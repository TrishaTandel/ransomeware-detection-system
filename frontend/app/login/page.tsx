"use client";

import { useState } from "react";
import api from "@/services/api";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const setToken = useAuthStore((s) => s.setToken);
  const router = useRouter();

  const handleLogin = async () => {
    try {
      setLoading(true);
      const res = await api.post("/login", { username, password });
      setToken(res.data.access_token);
      router.push("/dashboard");
    } catch {
      alert("Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-gray-800 text-white px-4">

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_#1f2937,_transparent_40%),radial-gradient(circle_at_bottom_right,_#111827,_transparent_40%)] opacity-50"></div>

      <div className="relative backdrop-blur-xl bg-white/10 border border-white/20 p-10 rounded-2xl shadow-2xl w-full max-w-md">

        <h2 className="text-3xl font-bold text-center mb-2">
          🛡️ Ransomware SOC
        </h2>

        <p className="text-center text-gray-300 mb-8">
          Secure Analyst Login
        </p>

        <input
          className="w-full mb-4 p-3 rounded-lg bg-white/20 border border-white/30 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500"
          placeholder="Username"
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          className="w-full mb-6 p-3 rounded-lg bg-white/20 border border-white/30 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500"
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full bg-red-600 hover:bg-red-700 transition duration-300 text-white py-3 rounded-lg font-semibold shadow-lg"
        >
          {loading ? "Authenticating..." : "Login"}
        </button>

        <div className="mt-6 text-center text-sm text-gray-400">
          Enterprise Security Platform • v1.0
        </div>
      </div>
    </div>
  );
}