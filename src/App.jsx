// frontend/src/App.jsx
import React, { useState } from "react";
import PhoneLookupForm from "./PhoneLookupForm";
import ResultCard from "./ResultCard";
import PDFUpload from "./PDFUpload";
import History from "./History";
import Favorites from "./Favorites";

export default function App() {
  const [result, setResult] = useState(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex flex-col">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-5 shadow-lg">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold tracking-tight">Phone OSINT Dashboard</h1>
          </div>
          <div className="text-sm mt-2 md:mt-0 bg-white/10 px-3 py-1 rounded-full">
             OSINT Phone Lookup
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto p-5 grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <aside className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <PhoneLookupForm setResult={setResult} />
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <PDFUpload setResult={setResult} />
          </div>
        </aside>

        {/* Main Panel */}
        <section className="lg:col-span-3 space-y-6">
          {/* Result or Placeholder */}
          {result ? (
            <ResultCard result={result} />
          ) : (
            <div className="bg-white rounded-xl shadow-md p-10 text-center border border-gray-100">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-800 mb-2">Start exploring phone numbers</h3>
              <p className="text-gray-500">
                Use the tools on the left to search, upload PDFs, or check your history and favorites below.
              </p>
            </div>
          )}

          {/* History & Favorites */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-md p-5 border border-gray-100">
              <History />
            </div>
            <div className="bg-white rounded-xl shadow-md p-5 border border-gray-100">
              <Favorites />
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t py-5 text-center text-sm text-gray-600 mt-8">
        <div className="max-w-7xl mx-auto">
          © {new Date().getFullYear()} Phone OSINT Project. Built with ❤️ using Flask + React + Tailwind.
        </div>
      </footer>
    </div>
  );
}