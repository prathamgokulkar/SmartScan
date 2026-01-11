import os
import shutil
import tempfile
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from src.schemas import QueryRequest, QueryResponse, UploadResponse
from src.core.vector_store_client import clear_vector_store

load_dotenv()
app = FastAPI(title="IntelliAgent AI API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Hello from the IntelliAgent Backend!"}


@app.post("/api/clear-store")
def clear_store_endpoint():
    try:
        clear_vector_store()
        return {"success": True, "message": "Vector store cleared."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# Endpoint to upload a PDF
@app.post("/api/process-invoice", response_model=UploadResponse)
async def process_invoice_endpoint(file: UploadFile = File(...)):
    from src.agents import indexing_agent
    
    if file.content_type != "application/pdf":
        raise HTTPException(status_code=400, detail="Invalid file type. Only PDF files are allowed.")

    tmp_path = None
    try:
        print("Orchestrator: New upload received. Clearing previous session...")
        clear_vector_store() 
        
        with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp:
            shutil.copyfileobj(file.file, tmp)
            tmp_path = tmp.name
        
        # Check file size after saving (limit to 10MB)
        if os.path.getsize(tmp_path) > 10 * 1024 * 1024:
             raise HTTPException(status_code=413, detail="File too large. Maximum size is 10MB.")

        indexing_agent.process_and_store_pdf(tmp_path)
        return {"success": True, "message": "PDF processed and indexed successfully."}
    except HTTPException as he:
        raise he
    except Exception as e:
        print(f"INTERNAL ERROR: {e}")
        raise HTTPException(status_code=500, detail="An internal server error occurred processing the PDF.")
    finally:
        if tmp_path and os.path.exists(tmp_path):
            os.unlink(tmp_path)
        await file.close()

@app.post("/api/query", response_model=QueryResponse)
async def query_endpoint(request: QueryRequest):
    from src.agents import qa_agent
    try:
        answer = qa_agent.answer_query(request.question)
        return {"success":True,"answer": answer}
    except Exception as e:
        print(f"INTERNAL ERROR: {e}")
        raise HTTPException(status_code=500, detail="An internal server error occurred generation the answer.")

