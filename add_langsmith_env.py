
import os

env_path = 'backend/.env'

# Content to append
langsmith_config = """
# LangSmith Configuration
LANGCHAIN_TRACING_V2=true
LANGCHAIN_ENDPOINT="https://api.smith.langchain.com"
LANGCHAIN_API_KEY="<your_langsmith_api_key_here>"
LANGCHAIN_PROJECT="IntelliAgent-PDF"
"""

try:
    with open(env_path, 'r') as f:
        content = f.read()
    
    if "LANGCHAIN_TRACING_V2" not in content:
        with open(env_path, 'a') as f:
            f.write(langsmith_config)
        print("Success: Appended LangSmith config to .env")
    else:
        print("Info: LangSmith config already present in .env")
        
except Exception as e:
    print(f"Error: {e}")
