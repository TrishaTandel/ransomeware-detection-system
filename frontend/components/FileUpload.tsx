"use client";

import { useState } from "react";
import api from "@/services/api";
import { useAuthStore } from "@/store/authStore";

export default function FileUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<any>(null);
  const token = useAuthStore((s) => s.token);

  const handleUpload = async () => {
    if (!file) return alert("Select a file");

    const formData = new FormData();
    formData.append("file", file);

    const res = await api.post("/scan-file", formData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setResult(res.data);
  };

  return (
    <div className="mt-10">
      <h2 className="text-xl font-semibold mb-4 text-white">
        🛡️ File Scanner
      </h2>

      <div className="bg-white/5 border border-white/10 p-6 rounded-xl backdrop-blur-lg">
        <input
          type="file"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="mb-4 text-gray-300"
        />

        <button
          onClick={handleUpload}
          className="bg-red-600 px-4 py-2 rounded-lg hover:bg-red-700"
        >
          Scan File
        </button>

        {result && (
          <div className="mt-4 p-4 rounded-lg bg-black/40">
            <p>
              Result:{" "}
              <span className="font-bold">
                {result.label}
              </span>
            </p>
            <p>Confidence: {(result.probability * 100).toFixed(2)}%</p>
          </div>
        )}
      </div>
    </div>
  );
}