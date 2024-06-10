import React, { useState } from "react";
import axios from "axios";
import UploadPDF from "./components/UploadPDF";
import SearchPDF from "./components/SearchPDF";

const App = () => {
    const [searchResults, setSearchResults] = useState([]);

    const handleSearch = async (keyword) => {
        const response = await axios.get(`http://localhost:8000/search/?keyword=${keyword}`);
        setSearchResults(response.data.results);
    };

    return (
        <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md">
            <h1 className="text-2xl font-bold mb-4 text-center">PDF Management App 📑</h1>
            <UploadPDF />
            <div className="mb-4"></div>
            <SearchPDF onSearch={handleSearch} />
        </div>
    );
};

export default App;
