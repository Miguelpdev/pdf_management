from PyPDF2 import PdfReader

def extract_text_from_pdf(file_path):
    with open(file_path, "rb") as pdf_file:
        pdf_reader = PdfReader(pdf_file)
        text = ""
        for page in pdf_reader.pages:
            text += page.extract_text()
        return text

######
# from PyPDF2 import PdfReader
# import re

# def extract_text_from_pdf(file_path):
#     with open(file_path, "rb") as pdf_file:
#         pdf_reader = PdfReader(pdf_file)
#         words_array = []
#         for page in pdf_reader.pages:
#             text = page.extract_text()
#             words = re.findall(r'\b\w+\b', text)  # Utiliza una expresión regular para encontrar todas las palabras
#             words_array.extend(words)
#         return words_array

###############
# from PyPDF2 import PdfReader
# import re

# def extract_text_from_pdf(file_path):
#     with open(file_path, "rb") as pdf_file:
#         pdf_reader = PdfReader(pdf_file)
#         words_array = []
#         for page in pdf_reader.pages:
#             text = page.extract_text()
#             words = re.findall(r'\b\w+\b', text)  # Utiliza una expresión regular para encontrar todas las palabras
#             words_array.extend(words)
#         # Convierte la lista de palabras en una cadena separada por espacios
#         extracted_text = ' '.join(words_array)
#         return extracted_text