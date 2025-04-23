import React, { useState, useRef } from "react";
import { Upload, FileText, Check, AlertCircle, X, Loader } from "lucide-react";
import api from '../api/client';

const UploadPDF = ({ onUploadSuccess }) => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadStatus, setUploadStatus] = useState("idle"); // idle, loading, success, error
  const [message, setMessage] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [fileResults, setFileResults] = useState([]);
  const fileInputRef = useRef(null);

  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files);
    
    if (files.length === 0) return;
    
    // Validar que sean archivos PDF
    const invalidFiles = files.filter(file => file.type !== "application/pdf");
    
    if (invalidFiles.length > 0) {
      setMessage("Solo se permiten archivos PDF. Algunos archivos fueron ignorados.");
      setUploadStatus("error");
      
      // Filtrar solo los archivos PDF válidos
      const validFiles = files.filter(file => file.type === "application/pdf");
      setSelectedFiles(validFiles);
      
      if (validFiles.length === 0) {
        event.target.value = null; // Limpiar el input
        return;
      }
    } else {
      setSelectedFiles(files);
      setUploadStatus("idle");
      setMessage("");
    }
  };

  const handleFileUpload = async () => {
    if (selectedFiles.length === 0) return;
    
    const formData = new FormData();
    selectedFiles.forEach(file => {
      formData.append("files", file);
    });
    
    setUploadStatus("loading");
    setMessage(`Subiendo ${selectedFiles.length} archivo(s)...`);
    setUploadProgress(0);
    setFileResults([]);
    
    try {
      const response = await api.post('/upload_pdf/', formData, {
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(percentCompleted);
        },
      });
      
      setUploadStatus("success");
      setFileResults(response.data.results || []);
      
      const successCount = response.data.results.filter(
        result => !result.message.includes("ya ha sido subido")
      ).length;
      
      const existingCount = response.data.results.filter(
        result => result.message.includes("ya ha sido subido")
      ).length;
      
      let statusMessage = "";
      if (successCount > 0 && existingCount > 0) {
        statusMessage = `${successCount} archivo(s) subido(s) correctamente. ${existingCount} archivo(s) ya existían.`;
      } else if (successCount > 0) {
        statusMessage = `${successCount} archivo(s) subido(s) correctamente.`;
      } else if (existingCount > 0) {
        statusMessage = `${existingCount} archivo(s) ya existían en el sistema.`;
      }
      
      setMessage(statusMessage);
      
      // Notificar al componente padre sobre la subida exitosa
      if (onUploadSuccess) {
        onUploadSuccess();
      }
      
    } catch (error) {
      setUploadStatus("error");
      setMessage(
        error.response?.data?.detail || 
        "Error al subir los archivos. Por favor, inténtalo de nuevo."
      );
      console.error("Error uploading files:", error);
    }
  };

  const resetForm = () => {
    setSelectedFiles([]);
    setUploadStatus("idle");
    setMessage("");
    setUploadProgress(0);
    setFileResults([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = null;
    }
  };

  const removeFile = (indexToRemove) => {
    setSelectedFiles(prevFiles => 
      prevFiles.filter((_, index) => index !== indexToRemove)
    );
  };

  const getTotalSize = () => {
    return selectedFiles.reduce((total, file) => total + file.size, 0);
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center">
        <Upload className="mr-2" />
        Subir PDFs
      </h2>
      
      <div className="mb-6">
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors">
          <input
            type="file"
            onChange={handleFileSelect}
            accept=".pdf"
            className="hidden"
            id="pdf-upload"
            disabled={uploadStatus === "loading"}
            multiple
            ref={fileInputRef}
          />
          
          <label 
            htmlFor="pdf-upload" 
            className="cursor-pointer flex flex-col items-center justify-center text-gray-500"
          >
            {selectedFiles.length > 0 ? (
              <>
                <FileText size={40} className="text-blue-500 mb-3" />
                <div className="text-lg font-medium text-blue-600">
                  {selectedFiles.length} archivo(s) seleccionado(s)
                </div>
                <div className="text-sm">
                  {(getTotalSize() / 1024 / 1024).toFixed(2)} MB en total
                </div>
              </>
            ) : (
              <>
                <Upload size={40} className="mb-3" />
                <div className="text-lg font-medium">Selecciona archivos PDF</div>
                <div className="text-sm">o arrastra y suelta aquí</div>
              </>
            )}
          </label>
        </div>
      </div>
      
      {/* Lista de archivos seleccionados */}
      {selectedFiles.length > 0 && uploadStatus === "idle" && (
        <div className="mb-4">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Archivos seleccionados:</h3>
          <ul className="space-y-2 max-h-40 overflow-y-auto">
            {selectedFiles.map((file, index) => (
              <li key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded-md">
                <div className="flex items-center">
                  <FileText size={16} className="text-blue-500 mr-2" />
                  <span className="text-sm truncate max-w-xs">{file.name}</span>
                </div>
                <button 
                  onClick={() => removeFile(index)} 
                  className="text-gray-400 hover:text-red-500"
                >
                  <X size={16} />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {/* Resultados de la subida */}
      {fileResults.length > 0 && uploadStatus === "success" && (
        <div className="mb-4">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Resultados:</h3>
          <ul className="space-y-2 max-h-40 overflow-y-auto">
            {fileResults.map((result, index) => (
              <li key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded-md">
                <div className="flex items-center">
                  {result.message.includes("exitosamente") ? (
                    <Check size={16} className="text-green-500 mr-2" />
                  ) : (
                    <AlertCircle size={16} className="text-amber-500 mr-2" />
                  )}
                  <span className="text-sm truncate max-w-xs">{result.file_name}</span>
                </div>
                <span className="text-xs text-gray-500">
                  {result.processing_time ? 
                    `${result.processing_time.toFixed(2)}s` : 
                    '-'}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {selectedFiles.length > 0 && uploadStatus === "idle" && (
        <div className="flex justify-between">
          <button
            onClick={resetForm}
            className="text-gray-600 hover:text-red-500 flex items-center"
          >
            <X size={16} className="mr-1" />
            Cancelar
          </button>
          
          <button
            onClick={handleFileUpload}
            className="ml-auto bg-blue-500 text-white rounded-md px-4 py-2 hover:bg-blue-600 transition-colors duration-300 flex items-center"
          >
            <Upload size={16} className="mr-2" />
            Subir {selectedFiles.length} archivo(s)
          </button>
        </div>
      )}
      
      {uploadStatus === "loading" && (
        <div className="mt-4">
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>Subiendo...</span>
            <span>{uploadProgress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        </div>
      )}
      
      {uploadStatus === "success" && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-md flex items-center">
          <Check size={18} className="mr-2" />
          {message}
          <button 
            onClick={resetForm}
            className="ml-auto text-green-700 hover:text-green-900"
          >
            <X size={16} />
          </button>
        </div>
      )}
      
      {uploadStatus === "error" && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md flex items-center">
          <AlertCircle size={18} className="mr-2" />
          {message}
          <button 
            onClick={resetForm}
            className="ml-auto text-red-700 hover:text-red-900"
          >
            <X size={16} />
          </button>
        </div>
      )}
    </div>
  );
};

export default UploadPDF;