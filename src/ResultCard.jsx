// frontend/src/ResultCard.jsx
import React, { useState } from "react";
import axios from "axios";

function colorForScore(score) {
  if (score >= 75) return "bg-red-500";
  if (score >= 40) return "bg-yellow-400";
  return "bg-green-500";
}

export default function ResultCard({ result }) {
  const [saved, setSaved] = useState(false);

  if (!result) return null;
  if (result.error) {
    return (
      <div className="bg-red-50 p-5 rounded-xl border border-red-200 text-red-800 flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        {result.error}
      </div>
    );
  }

  const rep = result.reputation || {};
  const score = rep.score ?? 0;
  const coords = result.coordinates;

  const addToFavorites = async () => {
    try {
      await axios.post("http://127.0.0.1:5000/api/favorites", { phone: result.number, note: "Saved from UI" });
      setSaved(true);
    } catch (e) {
      alert("Failed to add favorite");
    }
  };

  const exportPDF = async () => {
    try {
      const res = await axios.post(
        "http://127.0.0.1:5000/api/export", 
        { numbers: [result.number], format: "pdf" }, 
        { responseType: "blob" }
      );
      const blob = new Blob([res.data], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `report_${result.number}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      alert("Export failed");
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
      <div className="flex flex-col md:flex-row justify-between items-start gap-6">
        <div className="flex-1">
          <div className="text-sm font-medium text-gray-500 mb-1">Phone Number</div>
          <div className="text-2xl font-bold text-gray-800">{result.number}</div>
          <div className="flex items-center mt-2 text-gray-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            <span>{result.numverify?.carrier}</span>
            <span className="mx-2">•</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{result.numverify?.country_name || result.numverify?.location}</span>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="text-sm font-medium text-gray-600 text-center mb-1">Reputation Score</div>
          <div className="flex items-end justify-center">
            <div className="text-3xl font-bold text-gray-800">{score}</div>
            <div className="text-sm text-gray-500 ml-1">/100</div>
          </div>
          <div className="text-xs font-medium text-center mt-1 text-gray-500 uppercase tracking-wide">{rep.label}</div>
          
          <div className="mt-4 flex gap-2 justify-center">
            <button 
              onClick={addToFavorites} 
              className="flex items-center px-3 py-2 bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 transition duration-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
              {saved ? "Saved" : "Save"}
            </button>
            <button 
              onClick={exportPDF} 
              className="flex items-center px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition duration-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Export PDF
            </button>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Risk Level</span>
          <span className="text-sm text-gray-500">{score}%</span>
        </div>
        <div className="h-2.5 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className={`h-full ${colorForScore(score)}`} 
            style={{ width: `${score}%` }} 
          />
        </div>
      </div>

      {Object.entries(rep.breakdown || {}).length > 0 && (
        <div className="mt-6">
          <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Risk Breakdown
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {Object.entries(rep.breakdown || {}).map(([k, v]) => (
              <div key={k} className="bg-gray-50 p-3 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-700 capitalize">{k.replace(/_/g, ' ')}</span>
                  <span className="text-sm font-medium px-2 py-1 bg-white rounded-md">
                    {v.score} <span className="text-gray-400">/ 100</span>
                  </span>
                </div>
                <div className="mt-2 text-xs text-gray-500">
                  Weight: {v.weight}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {coords && (
        <div className="mt-6 pt-5 border-t border-gray-200">
          <h3 className="font-semibold text-gray-800 mb-2 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Approximate Location
          </h3>
          <div className="text-gray-600">
            Latitude: {coords.lat}, Longitude: {coords.lng}
          </div>
          <a 
            className="inline-flex items-center mt-2 text-blue-600 hover:text-blue-800 transition duration-200" 
            href={`https://www.openstreetmap.org/?mlat=${coords.lat}&mlon=${coords.lng}#map=12/${coords.lat}/${coords.lng}`} 
            target="_blank" 
            rel="noreferrer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            View on OpenStreetMap
          </a>
        </div>
      )}
    </div>
  );
}