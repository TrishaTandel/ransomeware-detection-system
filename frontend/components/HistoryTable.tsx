"use client";

import { useEffect, useState } from "react";
import api from "@/services/api";
import { useAuthStore } from "@/store/authStore";

export default function HistoryTable() {
  const [data, setData] = useState([]);
  const token = useAuthStore((s) => s.token);

  useEffect(() => {
    const fetchHistory = async () => {
      const res = await api.get("/history", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setData(res.data);
    };

    fetchHistory();
  }, []);
   useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await api.get("/history");
      setData(res.data);
    } catch {
      console.log("Error loading history");
    }
  };

  return (
    <div className="mt-10">
      <h2 className="text-xl font-semibold mb-4 text-white">
        📊 Prediction History
      </h2>

      <div className="overflow-x-auto rounded-xl border border-white/10 backdrop-blur-lg bg-white/5">
        <table className="min-w-full text-sm text-gray-300">
          <thead className="bg-white/10 text-gray-200">
            <tr>
              <th className="px-4 py-3 text-left">Time</th>
              <th className="px-4 py-3 text-left">Label</th>
              <th className="px-4 py-3 text-left">Prediction</th>
              <th className="px-4 py-3 text-left">Confidence</th>
            </tr>
          </thead>

          

          <tbody>
            {data.map((row: any) => (
              <tr
                key={row.id}
                className="border-t border-white/10 hover:bg-white/5 transition"
              >
                <td className="px-4 py-3">
                  {new Date(row.time).toLocaleString()}
                </td>

                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-1 rounded-lg text-xs font-semibold ${
                      row.label === "Ransomware"
                        ? "bg-red-500/20 text-red-400"
                        : "bg-green-500/20 text-green-400"
                    }`}
                  >
                    {row.label}
                  </span>
                </td>

                <td className="px-4 py-3">
                  {row.prediction === 1 ? "Threat" : "Safe"}
                </td>

                <td className="px-4 py-3">
                  {(row.probability * 100).toFixed(2)}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <table className="w-full text-left">
        <thead>
          <tr className="text-gray-400">
            <th>ID</th>
            <th>User</th>
            <th>Result</th>
            <th>Confidence</th>
            <th>Time</th>
          </tr>
        </thead>

        <tbody>
          {data.map((item: any) => (
            <tr key={item.id} className="border-t border-white/10">
              <td>{item.id}</td>
              <td>{item.username}</td>
              <td
                className={
                  item.label === "Malware"
                    ? "text-red-400"
                    : "text-green-400"
                }
              >
                {item.label}
              </td>
              <td>{item.probability}</td>
              <td>{item.created_at}</td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  );
}