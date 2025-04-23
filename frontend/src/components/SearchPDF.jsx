import React, { useState } from "react";
import axios from "axios";
import { Search, Loader, FileText, AlertCircle } from "lucide-react";
import api from '../api/client';

const SearchPDF = () => {
  const [keyword, setKeyword] = useState("");
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e) => {
    e?.preventDefault();
    
    if (!keyword.trim()) {
      setResults([]);
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setSearched(true);
    
    try {
      const { data } = await api.get('/search/', {
        params: { keyword }
      });
      setResults(data.results);
    } catch (err) {
      setError("Error al buscar. Por favor intenta nuevamente.");
      console.error("Error searching:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Función para resaltar la palabra clave en el texto
  const highlightKeyword = (text) => {
    if (!keyword.trim()) return text;
    
    const parts = text.split(new RegExp(`(${keyword})`, 'gi'));
    return parts.map((part, index) => 
      part.toLowerCase() === keyword.toLowerCase() ? 
        <span key={index} className="bg-yellow-200 font-medium">{part}</span> : part
    );
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center">
        <FileText className="mr-2" />
        Buscador de PDF
      </h2>
      
      <form onSubmit={handleSearch} className="mb-6">
        <div className="relative">
          <input
            type="text"
            value={keyword}
            onChange={(e) => {
              setKeyword(e.target.value);
              if (!e.target.value.trim()) {
                setResults([]);
                setSearched(false);
              }
            }}
            placeholder="Ingresa palabra clave"
            className="w-full border border-gray-300 rounded-lg px-4 py-3 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            aria-label="Buscar palabra clave"
          />
          <Search className="absolute left-3 top-3.5 text-gray-400" size={18} />
          
          <button
            type="submit"
            disabled={isLoading || !keyword.trim()}
            className="absolute right-3 top-2 bg-blue-500 text-white rounded-md px-4 py-1.5 hover:bg-blue-600 transition-colors duration-300 disabled:bg-blue-300 disabled:cursor-not-allowed"
          >
            {isLoading ? <Loader className="animate-spin" size={18} /> : "Buscar"}
          </button>
        </div>
      </form>
      
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md flex items-center">
          <AlertCircle size={18} className="mr-2" />
          {error}
        </div>
      )}
      
      {searched && !isLoading && results.length === 0 && !error && (
        <div className="text-center py-8 text-gray-500">
          No se encontraron resultados para "{keyword}"
        </div>
      )}
      
      {results.length > 0 && (
        <div className="space-y-6">
          <h3 className="text-lg font-medium text-gray-700">
            {results.length} {results.length === 1 ? 'resultado encontrado' : 'resultados encontrados'}
          </h3>
          
          {results.map((result, index) => {
            const filteredSentences = result.extracted_text
              .split(".")
              .filter(sentence => sentence.toLowerCase().includes(keyword.toLowerCase()) && sentence.trim());
              
            return (
              <div key={index} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                <h4 className="font-bold text-blue-700 mb-2 flex items-center">
                  <FileText size={16} className="mr-2" />
                  {result.file_name}
                </h4>
                
                {filteredSentences.length > 0 ? (
                  <div className="space-y-3">
                    {filteredSentences.map((sentence, idx) => (
                      <div key={idx} className="bg-gray-50 p-3 rounded">
                        <p className="text-gray-700">{highlightKeyword(sentence.trim())}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 italic">No se encontraron oraciones con la palabra "{keyword}"</p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SearchPDF;