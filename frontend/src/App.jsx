import React, { useState } from "react";
import UploadPDF from "./components/UploadPDF";
import SearchPDF from "./components/SearchPDF";
import { FileUp, Search, BookOpen, ChevronRight } from "lucide-react";

const App = () => {
  const [activeTab, setActiveTab] = useState("search"); // 'search' o 'upload'
  const [uploadSuccess, setUploadSuccess] = useState(false);
  
  // Función para manejar la notificación de subida exitosa
  const handleUploadSuccess = () => {
    setUploadSuccess(true);
    // Auto-ocultar la notificación después de 5 segundos
    setTimeout(() => setUploadSuccess(false), 5000);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header con logo y título */}
        <header className="mb-8 text-center">
          <div className="inline-flex items-center justify-center p-3 bg-blue-50 rounded-full mb-4">
            <BookOpen size={28} className="text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800">PDF Management App</h1>
          <p className="text-gray-600 mt-2">Busca y administra tus documentos PDF fácilmente</p>
        </header>
        
        {/* Notificación de subida exitosa */}
        {uploadSuccess && (
          <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 rounded-md flex items-center justify-between">
            <div className="flex items-center">
              <div className="bg-green-100 p-1 rounded-full mr-3">
                <ChevronRight size={16} className="text-green-600" />
              </div>
              <p className="text-green-700">¡Archivo subido correctamente! Ya puedes buscarlo.</p>
            </div>
            <button 
              onClick={() => setUploadSuccess(false)}
              className="text-green-700 hover:text-green-900"
            >
              &times;
            </button>
          </div>
        )}
        
        {/* Pestañas de navegación */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab("search")}
              className={`flex-1 py-4 px-6 text-center font-medium flex items-center justify-center ${
                activeTab === "search"
                  ? "text-blue-600 border-b-2 border-blue-500"
                  : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
              }`}
            >
              <Search size={18} className="mr-2" />
              Buscar PDF
            </button>
            <button
              onClick={() => setActiveTab("upload")}
              className={`flex-1 py-4 px-6 text-center font-medium flex items-center justify-center ${
                activeTab === "upload"
                  ? "text-blue-600 border-b-2 border-blue-500"
                  : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
              }`}
            >
              <FileUp size={18} className="mr-2" />
              Subir PDF
            </button>
          </div>
          
          {/* Contenido activo */}
          <div className="p-6">
            {activeTab === "search" ? (
              <SearchPDF />
            ) : (
              <UploadPDF onUploadSuccess={handleUploadSuccess} />
            )}
          </div>
        </div>
        
        {/* Footer */}
        <footer className="mt-8 text-center text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} PDF Management App - Todos los derechos reservados</p>
        </footer>
      </div>
    </div>
  );
};

export default App;