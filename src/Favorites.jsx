// frontend/src/Favorites.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Favorites() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => { 
    fetchFavs(); 
  }, []);
  
  const fetchFavs = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://127.0.0.1:5000/api/favorites");
      setRows(res.data.results || []);
    } catch (e) {
      setRows([]);
    } finally {
      setLoading(false);
    }
  };
  
  const remove = async (num) => {
    try {
      await axios.delete("http://127.0.0.1:5000/api/favorites", { 
        params: { phone: num } 
      });
      fetchFavs();
    } catch (e) {
      alert("Failed to remove favorite");
    }
  };

  return (
    <div>
      <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
        </svg>
        Favorites
      </h3>
      
      {loading ? (
        <div className="flex justify-center py-6">
          <svg className="animate-spin h-6 w-6 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      ) : rows.length === 0 ? (
        <div className="text-center py-6 text-gray-500">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
          </svg>
          <p className="mt-2">No favorites yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {rows.map(r => (
            <div key={r.number} className="bg-yellow-50 p-3 rounded-lg border border-yellow-100">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="font-medium text-gray-800">{r.number}</div>
                  <div className="text-sm text-gray-600 mt-1">{r.note || "No description"}</div>
                </div>
                <button 
                  onClick={() => remove(r.number)} 
                  className="text-red-500 hover:text-red-700 transition duration-200"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {rows.length > 0 && (
        <button 
          onClick={fetchFavs}
          className="w-full mt-4 text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center justify-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh Favorites
        </button>
      )}
    </div>
  );
}