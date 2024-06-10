from fastapi import APIRouter, Depends, UploadFile
from sqlalchemy.orm import Session
from database import get_db
from crud import get_pdfs_by_keyword, create_pdf
from pdf_processor import extract_text_from_pdf

router = APIRouter()

@router.get("/search")
def search_pdfs(keyword: str, db: Session = Depends(get_db)):
    pdfs = get_pdfs_by_keyword(db, keyword)
    return {"results": [pdf.filename for pdf in pdfs]}

@router.post("/upload")
def upload_pdf(file: UploadFile, db: Session = Depends(get_db)):
    content = file.file.read()
    text = extract_text_from_pdf(content)
    create_pdf(db, file.filename, text)
    return {"message": "PDF uploaded successfully"}
