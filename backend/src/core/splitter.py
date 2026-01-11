# Logic for chunking text
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_core.documents import Document

def split_text_into_chunks(text: str, metadata: dict = None) -> list[Document]:
    
    print("Splitter: Splitting document into chunks...")
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000, 
        chunk_overlap=200
    )

    docs = text_splitter.split_documents([Document(page_content=text, metadata=metadata or {})])
    print(f"Splitter: Split into {len(docs)} chunks.")
    return docs
