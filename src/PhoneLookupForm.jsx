// frontend/src/PhoneLookupForm.jsx
import React, { useState } from "react";
import axios from "axios";
import API_BASE from "./config"; // add this at the top

const COUNTRY_CODES = [
  { name: "India", code: "+91" },
  { name: "United States", code: "+1" },
  { name: "United Kingdom", code: "+44" },
  { name: "Australia", code: "+61" },
  { name: "Germany", code: "+49" },
  { name: "Canada", code: "+1" },
  { name: "France", code: "+33" },
  { name: "Brazil", code: "+55" },
  { name: "South Africa", code: "+27" },
  { name: "Mexico", code: "+52" }
];

export default function PhoneLookupForm({ setResult }) {
  const [countryCode, setCountryCode] = useState("+91");
  const [localNumber, setLocalNumber] = useState("");
  const [fullNumber, setFullNumber] = useState("");
  const [loading, setLoading] = useState(false);

  const buildNumber = () => {
    if (fullNumber && fullNumber.startsWith("+")) return fullNumber;
    const clean = localNumber.replace(/\s+/g, "");
    return `${countryCode}${clean}`;
  };

  const submit = async (e) => {
    e?.preventDefault();
    const phone = buildNumber();
    if (!phone) return alert("Enter a phone number");
    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE}/api/lookup`, { phone });
      setResult(res.data);
    } catch (err) {
      console.error(err);
      setResult({ error: "Lookup failed" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        Phone Lookup
      </h2>
      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Country Code</label>
          <select 
            value={countryCode} 
            onChange={(e) => setCountryCode(e.target.value)} 
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {COUNTRY_CODES.map(c => <option key={c.code} value={c.code}>{c.name} {c.code}</option>)}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Local Number</label>
          <input 
            value={localNumber} 
            onChange={(e) => setLocalNumber(e.target.value)} 
            placeholder="Enter local number (without country code)" 
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
          />
        </div>
        
        <div className="relative">
          <div className="absolute inset-0 flex items-center" aria-hidden="true">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center">
            <span className="px-2 bg-white text-sm text-gray-500">Or</span>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Full E.164 Number</label>
          <input 
            value={fullNumber} 
            onChange={(e) => setFullNumber(e.target.value)} 
            placeholder="+14155552671" 
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
          />
        </div>
        
        <button 
          disabled={loading} 
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition duration-200 flex items-center justify-center"
        >
          {loading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Searching...
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Search Number
            </>
          )}
        </button>
      </form>
    </div>
  );
}