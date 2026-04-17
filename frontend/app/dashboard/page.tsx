"use client";

import Sidebar from "@/components/Sidebar";
import FeatureForm from "@/components/FeatureForm";
import { motion } from "framer-motion";

export default function Dashboard() {
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 text-white">

      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 p-10 relative overflow-hidden">

        {/* Glow Effects */}
        <div className="absolute w-[400px] h-[400px] bg-red-600/10 rounded-full blur-3xl top-0 left-0" />
        <div className="absolute w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-3xl bottom-0 right-0" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10"
        >
          {/* Header */}
          <div className="flex justify-between items-center mb-10">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-red-500 to-blue-500 bg-clip-text text-transparent">
                🛡️ SOC Detection Dashboard
              </h1>
              <p className="text-gray-400 mt-2">
                Memory-Based Ransomware Analysis Engine
              </p>
            </div>

            {/* Live Status Indicator */}
            <div className="flex items-center gap-3 bg-green-500/20 px-4 py-2 rounded-full border border-green-500/30">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-green-400 text-sm font-semibold">
                System Operational
              </span>
            </div>
          </div>

          {/* Glass Card */}
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 p-8 rounded-2xl shadow-2xl">
            <FeatureForm />
          </div>
        </motion.div>
      </div>
    </div>
  );
}