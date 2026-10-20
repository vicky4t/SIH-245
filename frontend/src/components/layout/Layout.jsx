import React from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { TopNav } from "./TopNav";
import { useApp } from "../../context/AppContext";
import { AlertCircle, RefreshCw, ToggleLeft, ShieldCheck } from "lucide-react";

export function Layout() {
  const {
    sidebarCollapsed,
    mockMode,
    healthStatus,
    checkHealth,
    isCheckingHealth,
    toggleMockMode,
  } = useApp();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col selection:bg-blue-600 selection:text-white">
      {/* Sidebar (Responsive drawer on mobile, collapsible on desktop) */}
      <Sidebar />

      {/* Main Content Area */}
      <div
        className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out pl-0 ${
          sidebarCollapsed ? "lg:pl-20" : "lg:pl-[264px]"
        }`}
      >
        {/* Sticky Top Navigation */}
        <TopNav />

        {/* Backend Warning Banner if Mock Mode is OFF and backend is unreachable */}
        {!mockMode && !healthStatus.healthy && (
          <div className="bg-red-50 border-b border-red-200 px-4 sm:px-6 lg:px-8 py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs sm:text-sm">
            <div className="flex items-center gap-2.5 text-red-800">
              <AlertCircle className="w-4.5 h-4.5 text-red-600 shrink-0 animate-pulse" />
              <span>
                <strong>Backend Disconnected:</strong> Unable to reach API server at{" "}
                <code className="font-mono bg-red-100 px-1.5 py-0.5 rounded text-red-900 font-semibold">
                  {healthStatus.baseUrl}
                </code>
                . Live requests may fail.
              </span>
            </div>
            <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
              <button
                onClick={checkHealth}
                disabled={isCheckingHealth}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-red-200 hover:bg-red-50 text-red-700 font-semibold transition-colors shadow-2xs"
              >
                <RefreshCw
                  className={`w-3.5 h-3.5 ${isCheckingHealth ? "animate-spin" : ""}`}
                />
                Retry
              </button>
              <button
                onClick={() => toggleMockMode(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold transition-colors shadow-2xs"
              >
                <ToggleLeft className="w-4 h-4" />
                Switch to Demo Mode
              </button>
            </div>
          </div>
        )}

        {/* Page Viewport - More spacious padding and comfortable max width */}
        <main className="flex-1 p-5 sm:p-7 lg:p-8 xl:p-9 max-w-[1750px] w-full mx-auto space-y-7 sm:space-y-8 min-w-0">
          <Outlet />
        </main>

        {/* Enterprise Government Compliance Footer */}
        <footer className="border-t border-slate-200 bg-white py-4 px-4 sm:px-6 lg:px-8 text-center text-xs sm:text-sm text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-2xs">
          <div className="flex items-center gap-2.5">
            <div className="w-2 h-2 rounded-full bg-blue-600" />
            <span className="font-semibold text-slate-700">
              SkillVision AI
            </span>
            <span className="text-slate-400">·</span>
            <span className="text-slate-500 text-xs">
              Intelligent Training Centre Monitoring & Compliance Framework
            </span>
          </div>
          <div className="flex items-center gap-3 text-xs font-mono text-slate-400">
            <span>AEBAS UIDAI Protocol v2.1</span>
            <span>·</span>
            <span>RTSP / WebRTC Stream Engine</span>
            <span>·</span>
            <span className="text-blue-600 font-bold font-sans">GovTech Certified</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
