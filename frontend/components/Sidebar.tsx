"use client";

import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";

export default function Sidebar() {
  const router = useRouter();
  const logout = useAuthStore((s) => s.logout);

  return (
    <div className="w-64 bg-gray-900 text-white min-h-screen p-6">
      <h2 className="text-xl font-bold mb-8">🛡️ SOC Panel</h2>

      <button
        onClick={() => router.push("/dashboard")}
        className="block mb-4"
      >
        Dashboard
      </button>

      <button
        onClick={() => {
          logout();
          router.push("/login");
        }}
        className="text-red-500"
      >
        Logout
      </button>
    </div>
  );
}