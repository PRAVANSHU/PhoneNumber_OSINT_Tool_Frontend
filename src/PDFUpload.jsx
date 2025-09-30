// frontend/src/PDFUpload.jsx
import React, { useState } from "react";
import axios from "axios";
import API_BASE from "./config";

export default function PDFUpload({ setBatchResults, setCurrentPage, setSingleResult }) {
  const [file, setFile] = useState(null);
  const [numbers, setNumbers] = useState([]);
  const [processing, setProcessing] = useState(false);

  const upload = async () => {
    if (!file) return alert("Choose a PDF file");
    setProcessing(true);
    const form = new FormData();
    form.append("file", file);
    try {
      const res = await axios.post(`${API_BASE}/api/upload-pdf`, form, { 
        headers: { "Content-Type": "multipart/form-data" } 
      });

      const results = res.data.results || [];
      setNumbers(res.data.numbers || []);

      if (results.length > 0) {
        setBatchResults(results);
        setCurrentPage(0);
        setSingleResult(null);
      } else {
        alert("No numbers found in PDF");
      }

    } catch (e) {
      console.error(e);
      alert("Upload failed");
    } finally {
      setProcessing(false);
    }
  };

  const exportPdf = async () => {
    if (!numbers.length) return alert("No numbers to export");
    try {
      const res = await axios.post(
        `${API_BASE}/api/export`, 
        { numbers, format: "pdf" }, 
        { responseType: "blob" }
      );
      const blob = new Blob([res.data], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "pdf-upload-report.pdf";
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      alert("Export failed");
    }
  };

  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
        PDF Upload
      </h2>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Upload PDF File</label>
        <div className="flex items-center justify-center w-full">
          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition duration-200">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <p className="text-sm text-gray-500">{file ? file.name : "Choose a PDF file"}</p>
            </div>
            <input 
              type="file" 
              accept="application/pdf" 
              onChange={(e) => setFile(e.target.files[0])} 
              className="hidden" 
            />
          </label>
        </div>
      </div>
      
      <div className="flex gap-2">
        <button 
          onClick={upload} 
          disabled={processing || !file}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200 disabled:opacity-50"
        >
          {processing ? "Processing..." : "Extract & Process"}
        </button>
        
        <button 
          onClick={exportPdf} 
          disabled={!numbers.length}
          className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition duration-200 disabled:opacity-50"
        >
          Export
        </button>
      </div>
      
      {numbers.length > 0 && (
        <div className="mt-4">
          <div className="text-sm font-medium text-gray-700 mb-2">
            Extracted Numbers <span className="text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full">{numbers.length}</span>
          </div>
          <div className="max-h-40 overflow-auto border border-gray-200 rounded-lg p-3 bg-gray-50">
            {numbers.map((n, i) => (
              <div key={i} className="py-1 text-sm font-mono text-gray-600 border-b border-gray-200 last:border-0">
                {n}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
