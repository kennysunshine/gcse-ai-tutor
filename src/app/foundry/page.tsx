"use client";

import React from "react";
import Image from "next/image";

export default function FoundryAuditPage() {
  const downloadReport = () => {
    const link = document.createElement("a");
    link.href = "/foundry/LUMENFORGE_SCHOLARLY_25_REPORT.md";
    link.download = "LUMENFORGE_SCHOLARLY_25_REPORT.md";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white flex flex-col items-center justify-center p-8 font-sans selection:bg-indigo-500/30">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600 blur-[120px] rounded-full" />
      </div>

      <main className="relative z-10 max-w-4xl w-full flex flex-col items-center space-y-12 text-center">
        {/* Seal Section */}
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-yellow-500 to-amber-600 rounded-full blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
          <div className="relative w-48 h-48 rounded-full overflow-hidden border-4 border-amber-500/50 shadow-2xl">
            <Image
              src="/foundry/socratic_integrity_seal.png"
              alt="Socratic Integrity Seal"
              width={192}
              height={192}
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
          </div>
        </div>

        {/* Narrative Section */}
        <div className="space-y-4">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-500">
            LumenForge Foundry
          </h1>
          <p className="text-xl md:text-2xl text-gray-400 font-light max-w-2xl mx-auto leading-relaxed">
            Institutional Pedagogical Audit: <span className="text-amber-500 font-medium">The Scholarly 25</span>
          </p>
          <div className="flex items-center justify-center gap-2 mt-4 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            SOCRATIC INTEGRITY CERTIFIED (v2.7)
          </div>
        </div>

        {/* Institutional Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-3xl">
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-3xl text-center">
            <div className="text-3xl font-bold text-indigo-400">38.5%</div>
            <div className="text-xs uppercase tracking-widest text-gray-500 mt-1">Thinking Ratio</div>
          </div>
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-3xl text-center">
            <div className="text-3xl font-bold text-amber-500">96.0%</div>
            <div className="text-xs uppercase tracking-widest text-gray-500 mt-1">Leakage Standard</div>
          </div>
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-3xl text-center">
            <div className="text-3xl font-bold text-blue-400">25</div>
            <div className="text-xs uppercase tracking-widest text-gray-500 mt-1">Audit Cohorts</div>
          </div>
        </div>

        {/* Download Action */}
        <div className="pt-8 flex flex-col items-center space-y-6">
          <button
            onClick={downloadReport}
            className="group relative px-8 py-4 bg-white text-black font-semibold rounded-2xl transition-all duration-300 hover:scale-[1.02] hover:bg-white/90 active:scale-95 shadow-[0_0_40px_rgba(255,255,255,0.1)]"
          >
            <span className="flex items-center gap-3">
              Download Institutional Report
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
            </span>
          </button>
          
          <p className="text-sm text-gray-500 flex items-center gap-2">
            Professional PDF/Markdown Archive • Board-Ready
          </p>
        </div>
      </main>

      <footer className="mt-20 text-gray-600 text-xs tracking-widest uppercase">
        LumenForge Sovereign Systems © 2026
      </footer>
    </div>
  );
}
