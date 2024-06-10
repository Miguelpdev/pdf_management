import React from "react";
import axios from "axios";

const UploadPDF = () => {
    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        const formData = new FormData();
        formData.append("file", file);
        await axios.post("http://localhost:8000/upload_pdf/", formData);
    };

    return (
        <div className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">Upload PDF</h2>
            <input
                type="file"
                onChange={handleFileUpload}
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-blue-500"
            />
        </div>
    );
};

export default UploadPDF;

