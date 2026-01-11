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
async def process_invoice_endpoint(files: list[UploadFile] = File(...)):
    from src.agents import indexing_agent
    
    # 1. Validate all files first
    for file in files:
        if file.content_type != "application/pdf":
            raise HTTPException(status_code=400, detail=f"Invalid file type for '{file.filename}'. Only PDF files are allowed.")

    try:
        print("Orchestrator: New upload received. Clearing previous session...")
        clear_vector_store() 
        
        processed_count = 0
        
        # 2. Process each file
        for file in files:
            tmp_path = None
            try:
                with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp:
                    shutil.copyfileobj(file.file, tmp)
                    tmp_path = tmp.name
                
                # Check file size (limit to 10MB)
                if os.path.getsize(tmp_path) > 10 * 1024 * 1024:
                     raise HTTPException(status_code=413, detail=f"File '{file.filename}' too large. Maximum size is 10MB.")

                print(f"Orchestrator: Processing '{file.filename}'...")
                indexing_agent.process_and_store_pdf(tmp_path, original_filename=file.filename)
                processed_count += 1
                
            finally:
                if tmp_path and os.path.exists(tmp_path):
                    os.unlink(tmp_path)
                await file.close()

        return {"success": True, "message": f"Successfully processed and indexed {processed_count} PDF(s)."}

    except HTTPException as he:
        raise he
    except Exception as e:
        print(f"INTERNAL ERROR: {e}")
        raise HTTPException(status_code=500, detail="An internal server error occurred processing the PDFs.")

@app.post("/api/query", response_model=QueryResponse)
async def query_endpoint(request: QueryRequest):
    from src.agents import qa_agent
    try:
        answer = qa_agent.answer_query(request.question)
        return {"success":True,"answer": answer}
    except Exception as e:
        print(f"INTERNAL ERROR: {e}")
        raise HTTPException(status_code=500, detail="An internal server error occurred generation the answer.")

