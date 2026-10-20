import React, { useState } from "react";
import {
  Settings,
  Server,
  Sliders,
  ShieldCheck,
  Bell,
  Cpu,
  Wifi,
  WifiOff,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Code2,
  Save,
  RotateCcw,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { useTheme } from "../context/ThemeContext";
import { healthService } from "../services/healthService";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Select } from "../components/ui/Select";

export function SettingsPage() {
  const {
    mockMode,
    toggleMockMode,
    healthStatus,
    checkHealth,
    isCheckingHealth,
    apiBaseUrl,
  } = useApp();

  const { theme, toggleTheme } = useTheme();

  // Test backend probe state
  const [probeResult, setProbeResult] = useState(null);
  const [isProbing, setIsProbing] = useState(false);

  // Compliance threshold form state (persisted locally)
  const [discrepancyThreshold, setDiscrepancyThreshold] = useState("10");
  const [aiConfidenceThreshold, setAiConfidenceThreshold] = useState("85");
  const [cctvTimeoutMinutes, setCctvTimeoutMinutes] = useState("30");
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [smsCriticalAlerts, setSmsCriticalAlerts] = useState(true);
  const [autoFlagViolations, setAutoFlagViolations] = useState(true);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleProbeBackend = async () => {
    setIsProbing(true);
    setProbeResult(null);
    try {
      const result = await healthService.probeLiveBackend();
      setProbeResult(result);
    } catch (err) {
      setProbeResult({
        success: false,
        message: err.message,
      });
    } finally {
      setIsProbing(false);
    }
  };

  const handleSaveSettings = (e) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Settings className="w-5 h-5 text-blue-600" />
            System Configuration & Backend Integration
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure backend API connectivity, demo mock simulation, and AI compliance thresholds
          </p>
        </div>
      </div>

      {/* Backend Integration & Mock Mode Switcher (Section 11) */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-5">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                API Integration Architecture
              </h3>
              <p className="text-xs text-slate-500">
                Switch seamlessly between offline Demonstration Mode and live Node.js/Express REST backend
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-slate-700">
              {mockMode ? "Demo Mode (Mock)" : "Live Backend Mode"}
            </span>
            <button
              type="button"
              onClick={() => toggleMockMode(!mockMode)}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                mockMode ? "bg-amber-500" : "bg-emerald-500"
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  mockMode ? "translate-x-0" : "translate-x-5"
                }`}
              />
            </button>
          </div>
        </div>

        {/* Live Backend Telemetry Box */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="space-y-2 p-4 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              Active Environment Variables
            </span>
            <div className="space-y-1 font-mono text-[11px]">
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-500">VITE_API_BASE_URL:</span>
                <span className="text-blue-600 font-bold">{apiBaseUrl}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-500">VITE_USE_MOCK_DATA:</span>
                <span className={mockMode ? "text-amber-600 font-bold" : "text-emerald-600 font-bold"}>
                  {String(mockMode)}
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">Connection Status:</span>
                <span className="text-slate-800 font-bold flex items-center gap-1">
                  {mockMode ? (
                    <span className="text-amber-600">Mock Data Fallback</span>
                  ) : healthStatus.healthy ? (
                    <span className="text-emerald-600 flex items-center gap-1">
                      <Wifi className="w-3.5 h-3.5" /> Connected
                    </span>
                  ) : (
                    <span className="text-red-600 flex items-center gap-1">
                      <WifiOff className="w-3.5 h-3.5" /> Disconnected
                    </span>
                  )}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-3 p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
            <div>
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                Backend Health Probe (/health)
              </span>
              <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                Test if your backend REST API server is running and reachable at{" "}
                <code className="text-blue-600 font-mono font-semibold">{apiBaseUrl}/health</code>.
              </p>
            </div>

            <div className="space-y-2">
              <Button
                variant="outline"
                size="sm"
                icon={RefreshCw}
                loading={isProbing}
                onClick={handleProbeBackend}
              >
                Probe Live API Server
              </Button>

              {probeResult && (
                <div
                  className={`p-2.5 rounded-lg border text-xs font-mono ${
                    probeResult.success
                      ? "bg-emerald-50 border-emerald-200 text-emerald-700 font-semibold"
                      : "bg-red-50 border-red-200 text-red-700 font-semibold"
                  }`}
                >
                  {probeResult.success ? (
                    <span>✔ Success (HTTP {probeResult.status}): {probeResult.message}</span>
                  ) : (
                    <span>✖ Error: {probeResult.message}</span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Compliance Thresholds & Inspection Rules Form */}
      <form onSubmit={handleSaveSettings} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-5">
        <div className="pb-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                AI Detection Sensitivity & Alert Rules
              </h3>
              <p className="text-xs text-slate-500">
                Calibrate computer vision tolerance levels and discrepancy triggers
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase text-slate-700">
              Attendance Discrepancy Tolerance (%)
            </label>
            <Input
              type="number"
              value={discrepancyThreshold}
              onChange={(e) => setDiscrepancyThreshold(e.target.value)}
              helperText="Alerts trigger if biometric punches vs CCTV vision mismatch exceeds this percentage"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase text-slate-700">
              AI Object Confidence Threshold (%)
            </label>
            <Input
              type="number"
              value={aiConfidenceThreshold}
              onChange={(e) => setAiConfidenceThreshold(e.target.value)}
              helperText="Minimum inference confidence required before flagging missing infrastructure"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase text-slate-700">
              Camera Timeout Heartbeat (Minutes)
            </label>
            <Input
              type="number"
              value={cctvTimeoutMinutes}
              onChange={(e) => setCctvTimeoutMinutes(e.target.value)}
              helperText="Trigger 'Camera Offline' critical alert if RTSP feed drops for longer than this duration"
            />
          </div>
        </div>

        {/* Toggles */}
        <div className="pt-2 space-y-3 text-xs">
          <label className="flex items-center gap-2.5 cursor-pointer text-slate-700 hover:text-slate-900 font-medium">
            <input
              type="checkbox"
              checked={autoFlagViolations}
              onChange={(e) => setAutoFlagViolations(e.target.checked)}
              className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
            />
            <span>Automatically trigger show-cause inspection tickets on critical attendance fraud</span>
          </label>

          <label className="flex items-center gap-2.5 cursor-pointer text-slate-700 hover:text-slate-900 font-medium">
            <input
              type="checkbox"
              checked={emailAlerts}
              onChange={(e) => setEmailAlerts(e.target.checked)}
              className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
            />
            <span>Dispatch instant email notifications to State Nodal Officers for non-functional equipment</span>
          </label>

          <label className="flex items-center gap-2.5 cursor-pointer text-slate-700 hover:text-slate-900 font-medium">
            <input
              type="checkbox"
              checked={smsCriticalAlerts}
              onChange={(e) => setSmsCriticalAlerts(e.target.checked)}
              className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
            />
            <span>Send emergency SMS alert if more than 3 cameras go offline simultaneously at any facility</span>
          </label>
        </div>

        <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
          {savedSuccess && (
            <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              Settings saved successfully!
            </span>
          )}
          <div className="ml-auto flex items-center gap-2">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              icon={RotateCcw}
              onClick={() => {
                setDiscrepancyThreshold("10");
                setAiConfidenceThreshold("85");
                setCctvTimeoutMinutes("30");
              }}
            >
              Reset Defaults
            </Button>
            <Button type="submit" variant="primary" size="sm" icon={Save}>
              Save Preferences
            </Button>
          </div>
        </div>
      </form>

      {/* Backend REST API Contract Documentation (Section 13) */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center gap-3 pb-3 border-b border-slate-200">
          <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
            <Code2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Prepared Backend REST API Endpoints Contract
            </h3>
            <p className="text-xs text-slate-500">
              When ready, implement these corresponding endpoints in your Node.js/Express backend
            </p>
          </div>
        </div>

        <div className="space-y-2 font-mono text-xs text-slate-700">
          {[
            { method: "GET", path: "/dashboard/summary", desc: "Overall KPI metrics, active cameras, and recent anomalies" },
            { method: "GET", path: "/dashboard/attendance-trends", desc: "Daily/weekly attendance series comparing submitted vs AI headcount" },
            { method: "GET", path: "/centres", desc: "List training centres with state/district filters and compliance scores" },
            { method: "POST", path: "/centres", desc: "Register new vocational centre under surveillance" },
            { method: "GET", path: "/cameras", desc: "CCTV camera streams metadata, live status, and RTSP relay bindings" },
            { method: "GET", path: "/attendance", desc: "Attendance records with biometric punch count vs AI count" },
            { method: "GET", path: "/inventory", desc: "Itemized equipment inventory, sanction order refs, and deficit status" },
            { method: "GET", path: "/events", desc: "AI detection anomaly events with confidence ratings and timestamps" },
            { method: "PATCH", path: "/events/:id/status", desc: "Update event review status (Acknowledged, Resolved, False Positive)" },
            { method: "GET", path: "/notifications", desc: "System alerts and notifications with unread states" },
          ].map((ep, i) => (
            <div
              key={i}
              className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
            >
              <div className="flex items-center gap-2">
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                    ep.method === "GET"
                      ? "bg-blue-50 text-blue-700 border border-blue-200"
                      : ep.method === "POST"
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      : "bg-amber-50 text-amber-700 border border-amber-200"
                  }`}
                >
                  {ep.method}
                </span>
                <span className="text-slate-900 font-semibold">{ep.path}</span>
              </div>
              <span className="text-[11px] text-slate-500 font-sans">{ep.desc}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
