"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

type Particle = {
  id: number;
  top: string;
  left: string;
  duration: string;
};

export default function HomePage() {
  const router = useRouter();
  const [accuracy, setAccuracy] = useState(0);
  const [particles, setParticles] = useState<Particle[]>([]);

  // Counter animation
  useEffect(() => {
    let start = 0;
    const interval = setInterval(() => {
      start += 1;
      if (start >= 99) {
        start = 99;
        clearInterval(interval);
      }
      setAccuracy(start);
    }, 20);
    return () => clearInterval(interval);
  }, []);

  // Generate particles AFTER mount (client only)
  useEffect(() => {
    const generated = Array.from({ length: 40 }).map((_, i) => ({
      id: i,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      duration: `${2 + Math.random() * 3}s`,
    }));
    setParticles(generated);
  }, []);

  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center text-white overflow-hidden bg-black">

      {/* Matrix Grid */}
      <div className="absolute inset-0 opacity-20 bg-[linear-gradient(to_right,#00ff0022_1px,transparent_1px),linear-gradient(to_bottom,#00ff0022_1px,transparent_1px)] bg-[size:40px_40px]" />

      {/* AI Glow */}
      <div className="absolute w-[700px] h-[700px] bg-red-600/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-3xl right-0 bottom-0 animate-pulse" />

      {/* Safe Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {particles.map((p) => (
          <div
            key={p.id}
            className="absolute bg-white rounded-full opacity-30 animate-ping"
            style={{
              width: "3px",
              height: "3px",
              top: p.top,
              left: p.left,
              animationDuration: p.duration,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="relative z-10 text-center px-6"
      >
        <h1 className="text-6xl font-extrabold mb-6 bg-gradient-to-r from-red-500 via-blue-500 to-purple-500 bg-clip-text text-transparent">
          🛡️ AI Ransomware Detection
        </h1>

        <p className="text-gray-300 max-w-2xl mx-auto mb-10 text-lg">
          Memory-based behavioral analysis powered by advanced Machine Learning.
        </p>

        <div className="flex justify-center gap-12 mb-12">
          <div>
            <div className="text-5xl font-bold text-green-400">
              {accuracy}%
            </div>
            <div className="text-gray-400">Detection Accuracy</div>
          </div>

          <div>
            <div className="text-5xl font-bold text-red-400">
              &lt; 3%
            </div>
            <div className="text-gray-400">False Positive Rate</div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-6 justify-center">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push("/login")}
            className="px-8 py-4 bg-red-600 hover:bg-red-700 rounded-xl shadow-2xl text-lg font-semibold"
          >
            🔐 Secure Login
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push("/dashboard")}
            className="px-8 py-4 bg-blue-600 hover:bg-blue-700 rounded-xl shadow-2xl text-lg font-semibold"
          >
            📊 Open Dashboard
          </motion.button>
        </div>
      </motion.div>
    </main>
  );
}