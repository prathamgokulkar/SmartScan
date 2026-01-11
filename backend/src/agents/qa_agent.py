import os
from langchain.chains import create_retrieval_chain
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate
from dotenv import load_dotenv

from src.core.vector_store_client import get_vector_store_client
from src.core import cache, tracer
import time

load_dotenv()

GROQ_MODEL_NAME = "openai/gpt-oss-20b"

def answer_query(question: str) -> str:
    
    start_time = time.time()
    
    try:
        print(f"Q&A Agent: Answering question: '{question}'")
        
        # 1. OPTIMIZATION: Check Cache
        cached_result = cache.get_cached_response(question)
        if cached_result:
            return cached_result + " (Cached)"

        llm = ChatGroq(model_name=GROQ_MODEL_NAME, temperature=0.3)
        
        # Get the Qdrant vector store client
        vector_store = get_vector_store_client()
        retriever = vector_store.as_retriever(search_kwargs={"k": 5})

        template = """You are a helpful and meticulous financial assistant.
        
        You are looking at multiple financial documents. For every piece of information or total amount you find, you MUST explicitly state which file (metadata source) it came from. 
        If you find information for multiple files, present them in a clear Markdown table with a Source/Filename column.
        If a value is missing for a specific ID/Document, double-check the 'Grand Total' line specifically in that document's context and note if it's missing.

        CONTEXT:
        {context}
        
        QUESTION: {input}
        
        ANSWER:
        """
        prompt = ChatPromptTemplate.from_template(template)
        
        # Define how each document is formatted in the context string to include metadata
        document_prompt = ChatPromptTemplate.from_template("Source: {source}\nContent: {page_content}")

        combine_docs_chain = create_stuff_documents_chain(llm, prompt, document_prompt=document_prompt)
        retrieval_chain = create_retrieval_chain(retriever, combine_docs_chain)

        # Execute Chain
        # Note: We manually retrieve docs first if we want to log them specifically, 
        # but retrieval_chain does it internally. 
        # To log retrieved docs, we can use retriever directly first.
        retrieved_docs = retriever.invoke(question)
        
        # We re-pass retrieved docs or let the chain do it. 
        # For simplicity in this architecture, we will just run the chain 
        # (which re-retrieves) OR we can construct the chain differently.
        # Let's trust the chain for the answer, and use the retriever execution for logging.
        
        response_dict = retrieval_chain.invoke({"input": question})
        answer_text = response_dict.get("answer", "No answer found.")

        # 2. OPTIMIZATION: Cache Result
        cache.cache_response(question, answer_text)

        # 3. MLOPS: Log Trace
        end_time = time.time()
        tracer.log_trace(
            query=question,
            retrieved_docs=retrieved_docs, # We captured these separately for logging
            answer=answer_text,
            latency=end_time - start_time
        )
        
        return answer_text

    except Exception as e:
        print(f"!!!!!! ERROR in Q&A Agent: {e} !!!!!!")
        raise e
