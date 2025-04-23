from fastapi import FastAPI, File, UploadFile, Depends, HTTPException, status
from sqlalchemy.orm import Session
from database import SessionLocal, engine, Base
from models import PDFData
from fastapi.middleware.cors import CORSMiddleware
from pdf_processor import extract_text_from_pdf
from typing import List
import os
import time

app = FastAPI()

# Crear la base de datos si no existe
Base.metadata.create_all(bind=engine)

# Configura los orígenes permitidos
origins = [
    "*"
]

# Agrega el middleware CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.post("/upload_pdf/")
def upload_pdf(files: List[UploadFile] = File(...), db: Session = Depends(get_db)):
    responses = []

    for file in files:
        # Verifica si el PDF ya está en la base de datos
        db_pdf = db.query(PDFData).filter_by(file_name=file.filename).first()
        if db_pdf:
            responses.append({
                "file_name": file.filename,
                "message": "El PDF ya ha sido subido"
            })
            continue

        file_name = file.filename
        file_path = f"pdf_files/{file_name}"
        with open(file_path, "wb") as pdf_file:
            pdf_file.write(file.file.read())

        start_time = time.time()
        extracted_text = extract_text_from_pdf(file_path).lower()  # Guardamos en minúsculas
        end_time = time.time()
        processing_time = end_time - start_time

        db_pdf = PDFData(file_name=file_name, extracted_text=extracted_text)
        db.add(db_pdf)
        db.commit()

        responses.append({
            "file_name": file_name,
            "message": "PDF subido exitosamente",
            "processing_time": processing_time
        })

    return {"results": responses}


@app.get("/search/")
def search_pdf(keyword: str, db: Session = Depends(get_db)):
    results = db.query(PDFData).filter(PDFData.extracted_text.ilike(f"%{keyword}%")).all()
    return {"results": [{"file_name": result.file_name, "extracted_text": result.extracted_text} for result in results]}
