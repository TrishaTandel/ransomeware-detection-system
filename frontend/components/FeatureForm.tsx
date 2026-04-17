"use client";

import { useState } from "react";
import api from "@/services/api";
import ResultCard from "./ResultCard";

export default function FeatureForm() {
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

  return (
    <div className="bg-white p-6 rounded-xl shadow">
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