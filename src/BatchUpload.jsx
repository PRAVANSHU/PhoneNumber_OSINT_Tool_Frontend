import React, { useState } from "react";
import axios from "axios";

export default function BatchUpload() {
  const [file, setFile] = useState(null);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);

  const upload = async () => {
    if (!file) return alert("Pick a CSV file");
    setLoading(true);
    const form = new FormData();
    form.append("file", file);
    try {
      const res = await axios.post("http://127.0.0.1:5000/api/batch-lookup", form, { headers: {"Content-Type": "multipart/form-data"} });
      setSummary(res.data);
    } catch (e) {
      alert("Batch upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="font-bold mb-2">CSV Bulk Lookup</h3>
      <input type="file" accept=".csv" onChange={(e) => setFile(e.target.files[0])} />
      <div className="mt-2">
        <button onClick={upload} disabled={loading} className="bg-green-600 text-white px-3 py-1 rounded">{loading ? "Processing..." : "Upload & Process"}</button>
      </div>
      {summary && <div className="mt-3 text-sm">Processed: {summary.count}</div>}
    </div>
  );
}
