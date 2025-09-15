import React from "react";

const ExportButtons = () => {
  const handleExport = (format) => {
    window.open(`http://localhost:5000/api/export?format=${format}`, "_blank");
  };

  return (
    <div className="flex gap-3 mt-4">
      <button
        onClick={() => handleExport("json")}
        className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600"
      >
        Export JSON
      </button>
      <button
        onClick={() => handleExport("csv")}
        className="px-4 py-2 bg-green-500 text-white rounded-lg shadow hover:bg-green-600"
      >
        Export CSV
      </button>
      <button
        onClick={() => handleExport("pdf")}
        className="px-4 py-2 bg-red-500 text-white rounded-lg shadow hover:bg-red-600"
      >
        Export PDF
      </button>
    </div>
  );
};

export default ExportButtons;
