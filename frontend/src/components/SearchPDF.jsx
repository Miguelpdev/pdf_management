import React, { useState } from "react";
import axios from "axios";

const SearchPDF = () => {
    const [keyword, setKeyword] = useState("");
    const [results, setResults] = useState([]);

    const handleSearch = async () => {
        const response = await axios.get(`http://localhost:8000/search/?keyword=${keyword}`);
        setResults(response.data.results);
    };

    return (
        <div className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">Search PDF</h2>
            <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Enter keyword"
                className="w-full border border-gray-300 rounded-md px-4 py-2 mb-4 focus:outline-none focus:border-blue-500"
            />
            <button
                onClick={handleSearch}
                className="bg-blue-500 text-white rounded-md px-4 py-2 hover:bg-blue-600 transition-colors duration-300"
            >
                Search
            </button>
            {results.map((result, index) => (
                <div key={index} className="mt-4">
                    <p className="font-bold">File Name: {result.file_name}</p>
                    {/* Filtrar las oraciones que contienen la palabra clave */}
                    {result.extracted_text
                        .split(".")
                        .filter((sentence) => sentence.includes(keyword))
                        .map((sentence, idx) => (
                            <div key={idx} className="mt-2">
                                <p className="text-gray-700">Oración: {sentence}</p>
                            </div>
                        ))}
                </div>
            ))}
        </div>
    );
};

export default SearchPDF;
