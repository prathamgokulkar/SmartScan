from langchain.chains import create_retrieval_chain, create_history_aware_retriever
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain_core.messages import HumanMessage, AIMessage
from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from dotenv import load_dotenv

from src.core.vector_store_client import get_vector_store_client
from src.core import cache, tracer
from src.agents.validation_agent import validate_answer_with_llm
from qdrant_client import models
import time
import json

load_dotenv()

GROQ_MODEL_NAME = "openai/gpt-oss-20b"

def extract_file_filters(question: str) -> list[str]:
    """Uses a fast LLM to parse exactly which filenames the user is targeting, if any."""
    llm = ChatGroq(model_name="llama-3.1-8b-instant", temperature=0.0)
    prompt = f"""You are a query router. The user may be asking a question about a specific file or files.
    Analyze the question: '{question}'
    If the user explicitly specifies any file names (e.g. 'in invoice123.pdf', 'from receipt.txt'), return them in a strict JSON array of strings. 
    If no files are mentioned, return an empty array [].
    Respond ONLY with the JSON array, nothing else.
    """
    try:
        response = llm.invoke(prompt)
        import re
        match = re.search(r'(\[.*\])', response.content, re.DOTALL)
        if match:
             return json.loads(match.group(1))
        return []
    except Exception as e:
        print(f"Warning: Failed to extract file filters: {e}")
        return []

def answer_query(question: str, chat_history_list: list = None) -> tuple[str, list]:
    
    start_time = time.time()
    
    if chat_history_list is None:
        chat_history_list = []
        
    # Convert dict list to LangChain message objects
    langchain_chat_history = []
    for msg in chat_history_list:
        if msg.get("role") == "user":
            langchain_chat_history.append(HumanMessage(content=msg.get("content", "")))
        elif msg.get("role") == "ai":
            langchain_chat_history.append(AIMessage(content=msg.get("content", "")))
            
    try:
        print(f"Q&A Agent: Answering question: '{question}' with {len(langchain_chat_history)} history messages.")
        
        # 1. OPTIMIZATION: Check Cache
        # Cache disabled or scoped per conversation could be added later. 
        # For reliable conversational memory, we bypass cache if history exists
        if not chat_history_list:
            cached_result = cache.get_cached_response(question)
            if cached_result:
                return cached_result + " (Cached)", []

        llm = ChatGroq(model_name=GROQ_MODEL_NAME, temperature=0.3)
        vector_store = get_vector_store_client()
        
        # --- Multi-Document Metadata Filtering ---
        search_kwargs = {"k": 5}
        target_files = extract_file_filters(question)
        if target_files:
            print(f"Q&A Agent: Applying explicit metadata filter for documents: {target_files}")
            search_kwargs["filter"] = models.Filter(
                must=[
                    models.FieldCondition(
                        key="metadata.source",
                        match=models.MatchAny(any=target_files)
                    )
                ]
            )
        else:
             print("Q&A Agent: No explicit document filters identified. Searching entire vector space.")
             
        retriever = vector_store.as_retriever(search_kwargs=search_kwargs)

        contextualize_q_system_prompt = (
            "Given a chat history and the latest user question "
            "which might reference context in the chat history, "
            "formulate a standalone question which can be understood "
            "without the chat history. Do NOT answer the question, "
            "just reformulate it if needed and otherwise return it as is."
        )
        contextualize_q_prompt = ChatPromptTemplate.from_messages([
            ("system", contextualize_q_system_prompt),
            MessagesPlaceholder(variable_name="chat_history"),
            ("human", "{input}"),
        ])
        
        history_aware_retriever = create_history_aware_retriever(
            llm, retriever, contextualize_q_prompt
        )

        template = """You are a helpful and meticulous financial assistant.
        
        You are looking at multiple financial documents and your previous conversation history. For every piece of information or total amount you find, you MUST explicitly state which file (metadata source) it came from. 
        If you find information for multiple files, present them in a clear Markdown table with a Source/Filename column.
        If a value is missing for a specific ID/Document, double-check the 'Grand Total' line specifically in that document's context and note if it's missing.

        CONTEXT:
        {context}
        
        """
        prompt = ChatPromptTemplate.from_messages([
            ("system", template),
            MessagesPlaceholder(variable_name="chat_history"),
            ("human", "{input}"),
        ])
        
        # Define how each document is formatted in the context string to include metadata
        document_prompt = ChatPromptTemplate.from_template("Source: {source}\nContent: {page_content}")

        combine_docs_chain = create_stuff_documents_chain(llm, prompt, document_prompt=document_prompt)
        retrieval_chain = create_retrieval_chain(history_aware_retriever, combine_docs_chain)

        # Execute Chain
        retrieved_docs = history_aware_retriever.invoke({"input": question, "chat_history": langchain_chat_history})
        
        response_dict = retrieval_chain.invoke({
            "input": question,
            "chat_history": langchain_chat_history
        })
        draft_answer = response_dict.get("answer", "No answer found.")
        actual_context_used = response_dict.get("context", [])

        # --- VALIDATION STEP ---
        # Temporarily disconnected as requested
        # We must validate against the EXACT context documents the retrieval_chain decided to use
        # validation_result = validate_answer_with_llm(draft_answer, actual_context_used)
        
        # if validation_result.get("is_supported") is True:
        #     answer_text = draft_answer
        # else:
        #     reason = validation_result.get("reasoning", "The AI generated unsupported facts.")
        #     answer_text = f"⚠️ **Validation Failed:** I generated an answer, but my fact-checking agent flagged it as potentially inaccurate or hallucinated based on the source documents.\n\n*Reasoning:* {reason}"
        #     print(f"Q&A Agent: Validation failed. Intercepted draft answer: {draft_answer}")
        
        answer_text = draft_answer

        # 2. OPTIMIZATION: Cache Result
        if not chat_history_list:
            cache.cache_response(question, answer_text)

        # --- SOURCING STEP ---
        sources = list(set([doc.metadata.get("source") for doc in actual_context_used if doc.metadata.get("source")]))
        
        # 3. MLOPS: Log Trace
        end_time = time.time()
        tracer.log_trace(
            query=question,
            retrieved_docs=retrieved_docs, # We captured these separately for logging
            answer=answer_text,
            latency=end_time - start_time
        )
        
        return (answer_text, sources)

    except Exception as e:
        print(f"!!!!!! ERROR in Q&A Agent: {e} !!!!!!")
        raise e

def stream_answer_query(question: str, chat_history_list: list = None):
    """
    Generator function that streams exactly what answer_query returns.
    Follows Server-Sent Events (SSE) format to yield lines continuously.
    """
    start_time = time.time()
    
    if chat_history_list is None:
        chat_history_list = []
        
    langchain_chat_history = []
    for msg in chat_history_list:
        if msg.get("role") == "user":
            langchain_chat_history.append(HumanMessage(content=msg.get("content", "")))
        elif msg.get("role") == "ai":
            langchain_chat_history.append(AIMessage(content=msg.get("content", "")))
            
    try:
        print(f"Q&A Agent: Streaming question: '{question}' with {len(langchain_chat_history)} history messages.")
        
        # 1. Check Cache
        if not chat_history_list:
            cached_result = cache.get_cached_response(question)
            if cached_result:
                # If cached, just yield the full chunk instantly
                yield f"data: {json.dumps({'chunk': cached_result + ' (Cached)'})}\n\n"
                yield f"data: {json.dumps({'done': True, 'sources': []})}\n\n"
                return

        llm = ChatGroq(model_name=GROQ_MODEL_NAME, temperature=0.3)
        vector_store = get_vector_store_client()
        
        # --- Multi-Document Metadata Filtering ---
        search_kwargs = {"k": 5}
        target_files = extract_file_filters(question)
        if target_files:
            print(f"Q&A Agent (Streaming): Applying explicit metadata filter for documents: {target_files}")
            search_kwargs["filter"] = models.Filter(
                must=[
                    models.FieldCondition(
                        key="metadata.source",
                        match=models.MatchAny(any=target_files)
                    )
                ]
            )
        else:
             print("Q&A Agent (Streaming): No explicit document filters identified. Searching entire vector space.")
             
        retriever = vector_store.as_retriever(search_kwargs=search_kwargs)

        contextualize_q_system_prompt = (
            "Given a chat history and the latest user question "
            "which might reference context in the chat history, "
            "formulate a standalone question which can be understood "
            "without the chat history. Do NOT answer the question, "
            "just reformulate it if needed and otherwise return it as is."
        )
        contextualize_q_prompt = ChatPromptTemplate.from_messages([
            ("system", contextualize_q_system_prompt),
            MessagesPlaceholder(variable_name="chat_history"),
            ("human", "{input}"),
        ])
        
        history_aware_retriever = create_history_aware_retriever(
            llm, retriever, contextualize_q_prompt
        )

        template = """You are a helpful and meticulous financial assistant.
        
        You are looking at multiple financial documents and your previous conversation history. For every piece of information or total amount you find, you MUST explicitly state which file (metadata source) it came from. 
        If you find information for multiple files, present them in a clear Markdown table with a Source/Filename column.
        If a value is missing for a specific ID/Document, double-check the 'Grand Total' line specifically in that document's context and note if it's missing.

        CONTEXT:
        {context}
        
        """
        prompt = ChatPromptTemplate.from_messages([
            ("system", template),
            MessagesPlaceholder(variable_name="chat_history"),
            ("human", "{input}"),
        ])
        
        document_prompt = ChatPromptTemplate.from_template("Source: {source}\nContent: {page_content}")
        combine_docs_chain = create_stuff_documents_chain(llm, prompt, document_prompt=document_prompt)
        retrieval_chain = create_retrieval_chain(history_aware_retriever, combine_docs_chain)

        # We will collect the full answer as we stream it, so we can cache & log it later
        full_answer = ""
        sources = []
        actual_context_used = []

        # Stream chunk by chunk
        for chunk in retrieval_chain.stream({
            "input": question,
            "chat_history": langchain_chat_history
        }):
            # The 'context' chunk returns the full list of documents used
            if "context" in chunk:
                actual_context_used = chunk["context"]
                sources = list(set([doc.metadata.get("source") for doc in actual_context_used if doc.metadata.get("source")]))
            
            # The 'answer' chunk returns tiny string segments as the LLM types them
            if "answer" in chunk:
                text_chunk = chunk["answer"]
                full_answer += text_chunk
                # Format as SSE
                yield f"data: {json.dumps({'chunk': text_chunk})}\n\n"

        # 2. OPTIMIZATION: Cache Result
        if not chat_history_list:
            cache.cache_response(question, full_answer)

        # 3. MLOPS: Log Trace
        # Note: Validation Agent is disabled during streaming since streaming prevents pausing the response
        end_time = time.time()
        tracer.log_trace(
            query=question,
            retrieved_docs=actual_context_used,
            answer=full_answer,
            latency=end_time - start_time
        )
        
        # Stream complete
        yield f"data: {json.dumps({'done': True, 'sources': sources})}\n\n"

    except Exception as e:
        print(f"!!!!!! ERROR Streaming Q&A Agent: {e} !!!!!!")
        yield f"data: {json.dumps({'error': str(e)})}\n\n"
