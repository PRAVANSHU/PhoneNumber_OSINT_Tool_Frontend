// frontend/src/PDFUpload.jsx
import React, { useState } from "react";
import axios from "axios";

export default function PDFUpload({ setResult }) {
  const [file, setFile] = useState(null);
  const [numbers, setNumbers] = useState([]);
  const [processing, setProcessing] = useState(false);

  const upload = async () => {
    if (!file) return alert("Choose a PDF file");
    setProcessing(true);
    const form = new FormData();
    form.append("file", file);
    try {
      const res = await axios.post("http://127.0.0.1:5000/api/upload-pdf", form, { 
        headers: { "Content-Type": "multipart/form-data" } 
      });
      setNumbers(res.data.numbers || []);
      if (res.data.results && res.data.results.length) setResult(res.data.results[0]);
    } catch (e) {
      alert("Upload failed");
    } finally {
      setProcessing(false);
    }
  };

  const exportPdf = async () => {
    if (!numbers.length) return alert("No numbers to export");
    try {
      const res = await axios.post(
        "http://127.0.0.1:5000/api/export", 
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
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
        </svg>
        PDF Upload
      </h2>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Upload PDF File</label>
        <div className="flex items-center justify-center w-full">
          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition duration-200">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
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
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200 disabled:opacity-50 flex items-center justify-center"
        >
          {processing ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
              Extract & Process
            </>
          )}
        </button>
        
        <button 
          onClick={exportPdf} 
          disabled={!numbers.length}
          className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition duration-200 disabled:opacity-50"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
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