from sqlalchemy import Column, Integer, String
from database import Base

class PDFData(Base):
    __tablename__ = "pdf_data"

    id = Column(Integer, primary_key=True, index=True)
    file_name = Column(String, index=True)
    extracted_text = Column(String)
