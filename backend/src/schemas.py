from pydantic import BaseModel
from typing import List, Dict, Any

class QueryRequest(BaseModel):
    question: str
    chat_history: List[Dict[str, str]] = []


class QueryResponse(BaseModel):
    success: bool
    answer: str
    sources: List[str] = []


class UploadResponse(BaseModel):
   
    success: bool
    message: str