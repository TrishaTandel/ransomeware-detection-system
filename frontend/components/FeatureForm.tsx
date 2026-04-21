"use client";

import { useState, useRef } from "react";
import api from "@/services/api";
import ResultCard from "./ResultCard";

export default function FeatureForm() {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleScan = async () => {
    if (!file) return alert("Please select a file");

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const res = await api.post("/scan-file", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setResult(res.data);
    } catch (err) {
      console.error(err);
      alert("Scan failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white/10 p-6 rounded-xl backdrop-blur border border-white/20">

      <h2 className="text-xl mb-4 font-semibold">🔍 Scan File</h2>

      {/* Hidden input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        className="hidden"
      />

      {/* Custom Button */}
      <div className="flex items-center gap-4 mb-4">

        <button
          onClick={() => fileInputRef.current?.click()}
          className="px-5 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition"
        >
          📂 Choose File
        </button>

        <span className="text-gray-300 text-sm">
          {file ? file.name : "No file selected"}
        </span>
      </div>

      {/* Scan Button */}
      <button
        onClick={handleScan}
        disabled={loading}
        className="bg-blue-600 px-6 py-2 rounded-lg hover:bg-blue-700 transition"
      >
        {loading ? "Scanning..." : "🚀 Scan File"}
      </button>

      {/* Result */}
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

      {result && <ResultCard result={result} />}
    </div>
  );
}