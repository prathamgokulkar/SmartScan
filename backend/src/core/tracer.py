import json
import time
import os
from datetime import datetime

LOG_DIR = "logs"
TRACE_FILE = os.path.join(LOG_DIR, "traces.jsonl")

# Ensure logs directory exists
os.makedirs(LOG_DIR, exist_ok=True)

def log_trace(query: str, retrieved_docs: list, answer: str, latency: float):
    """
    Logs a RAG execution trace to a JSONL file.
    """
    
    # Format retrieved documents for logging (extract metadata)
    docs_info = []
    if retrieved_docs:
        for doc in retrieved_docs:
            docs_info.append({
                "content_snippet": doc.page_content[:100] + "...",
                "source": doc.metadata.get("source", "unknown")
            })

    trace = {
        "timestamp": datetime.now().isoformat(),
        "latency_seconds": round(latency, 4),
        "query": query,
        "retrieved_docs": docs_info,
        "answer": answer
    }

    try:
        with open(TRACE_FILE, "a", encoding="utf-8") as f:
            f.write(json.dumps(trace) + "\n")
        print(f"--- Tracer: Logged execution trace to {TRACE_FILE} ---")
    except Exception as e:
        print(f"--- Tracer Error: Failed to log trace: {e} ---")
