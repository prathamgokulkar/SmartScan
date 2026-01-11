from langchain_groq import ChatGroq


def validate_answer_with_llm(answer: str, context: list) -> dict:
 
    print("--- Validation Agent: Starting fact-checking process... ---")
    
    formatted_context = "\n\n---\n\n".join([doc.page_content for doc in context])

    validation_llm = ChatGroq(model_name="llama-3.1-8b-instant", temperature=0.0)
    
    validation_prompt_template = f"""You are a meticulous Validation Agent. Your task is to verify if the provided 'STATEMENT' is fully supported by the 'SOURCE TEXT'.
    
    CRITICAL CHECK:
    - If the STATEMENT mentions a specific Invoice ID and a Price/Value (e.g. "Invoice A has total $500"), you MUST check if that specific Invoice ID and that Price appear TOGETHER in the same context block.
    - If the ID appears in one block and the price in another unrelated block, this is a HALLUCINATION. Reject it.

    SOURCE TEXT:
    ---
    {formatted_context}
    ---

    STATEMENT:
    ---
    {answer}
    ---

    Analyze the STATEMENT and determine if all facts, figures, and claims within it are present and correctly linked in the SOURCE TEXT.
    
    Respond ONLY with a JSON object with two keys:
    1. "is_supported": boolean (true if the statement is fully supported, false otherwise)
    2. "reasoning": string (a brief explanation for your decision)
    """
    
    try:
        response = validation_llm.invoke(validation_prompt_template)
        import json
        validation_result = json.loads(response.content)
        print(f"Validation Agent: Result: {validation_result}")
        return validation_result
    except Exception as e:
        print(f"!!!!!! ERROR in Validation Agent: Could not parse validation response: {e} !!!!!!")
        return {"is_supported": False, "reasoning": "Validation process failed."}