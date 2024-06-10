from fastapi import FastAPI, File, UploadFile, Depends, HTTPException, status
from sqlalchemy.orm import Session
from database import SessionLocal, engine, Base
from models import PDFData
from fastapi.middleware.cors import CORSMiddleware
from pdf_processor import extract_text_from_pdf
import os
import time

app = FastAPI()

# Crear la base de datos si no existe
Base.metadata.create_all(bind=engine)

# Configura los orígenes permitidos
origins = [
    "http://localhost",
    "http://localhost:5173",
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

# @app.post("/upload_pdf/")
# def upload_pdf(file: UploadFile = File(...), db: Session = Depends(get_db)):
#     file_name = file.filename
#     file_path = f"pdf_files/{file_name}"
#     with open(file_path, "wb") as pdf_file:
#         pdf_file.write(file.file.read())
    
#     start_time = time.time()  # Inicia el tiempo de procesamiento
    
#     extracted_text = extract_text_from_pdf(file_path)
    
#     end_time = time.time()  # Finaliza el tiempo de procesamiento
#     processing_time = end_time - start_time  # Calcula el tiempo de procesamiento en segundos
    
#     db_pdf = PDFData(file_name=file_name, extracted_text=extracted_text)
#     db.add(db_pdf)
#     db.commit()
    
#     return {"message": "PDF uploaded successfully", "processing_time": processing_time}
@app.post("/upload_pdf/")
def upload_pdf(file: UploadFile = File(...), db: Session = Depends(get_db)):
    # Verifica si el PDF ya está en la base de datos
    db_pdf = db.query(PDFData).filter_by(file_name=file.filename).first()
    if db_pdf:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="El PDF ya ha sido subido")

    file_name = file.filename
    file_path = f"pdf_files/{file_name}"
    with open(file_path, "wb") as pdf_file:
        pdf_file.write(file.file.read())
    
    start_time = time.time()  # Inicia el tiempo de procesamiento
    
    extracted_text = extract_text_from_pdf(file_path)
    
    end_time = time.time()  # Finaliza el tiempo de procesamiento
    processing_time = end_time - start_time  # Calcula el tiempo de procesamiento en segundos
    
    db_pdf = PDFData(file_name=file_name, extracted_text=extracted_text)
    db.add(db_pdf)
    db.commit()
    
    return {"message": "PDF uploaded successfully", "processing_time": processing_time}

@app.get("/search/")
def search_pdf(keyword: str, db: Session = Depends(get_db)):
    results = db.query(PDFData).filter(PDFData.extracted_text.ilike(f"%{keyword}%")).all()
    return {"results": [{"file_name": result.file_name, "extracted_text": result.extracted_text} for result in results]}
