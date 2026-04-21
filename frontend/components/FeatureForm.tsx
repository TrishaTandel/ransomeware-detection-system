"use client";

import { useState } from "react";
import api from "@/services/api";
import ResultCard from "./ResultCard";

export default function FeatureForm() {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<any>(null);
  

  const handleSubmit = async () => {
    const payload = {
      features: {
        handles_nfile: 54,
        handles_nkey: 23,
      },
    };
    

    const res = await api.post("/predict", payload);
    setResult(res.data);
  };

   const handleUpload = async () => {
    if (!file) return alert("Select file");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await api.post("/scan-file", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setResult(res.data);
    } catch {
      alert("Error scanning file");
    }
  };
  return (
    
      <div className="bg-white/10 p-6 rounded-xl backdrop-blur border border-white/20">

      <h2 className="text-xl mb-4 font-semibold">🔍 Scan File</h2>

      <input
        type="file"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        className="mb-4"
      />

      <button
        onClick={handleUpload}
        className="bg-red-600 px-4 py-2 rounded-lg hover:bg-red-700"
      >
        Scan
      </button>
      {result && (
        <div className="mt-6 p-4 bg-black/40 rounded-lg">
          <p>
            <strong>Result:</strong>{" "}
            <span
              className={
                result.label === "Malware"
                  ? "text-red-400"
                  : "text-green-400"
              }
            >
              {result.label}
            </span>
          </p>
          <p>Confidence: {result.probability}</p>
        </div>
      )}
      <button
        onClick={handleSubmit}
        className="bg-red-600 text-white px-6 py-2 rounded"
      >
        Run Detection
      </button>

      {result && <ResultCard result={result} />}
    </div>
  );
}