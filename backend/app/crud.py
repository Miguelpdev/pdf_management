from sqlalchemy.orm import Session
from . import models

def get_pdfs_by_keyword(db: Session, keyword: str):
    return db.query(models.PDF).filter(models.PDF.text.contains(keyword)).all()

def create_pdf(db: Session, filename: str, text: str):
    db_pdf = models.PDF(filename=filename, text=text)
    db.add(db_pdf)
    db.commit()
    db.refresh(db_pdf)
    return db_pdf
