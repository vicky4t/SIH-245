import React, { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Video,
  Square,
  Grid2X2,
  LayoutGrid,
  Maximize2,
  Camera,
  RefreshCw,
  Search,
  Filter,
  AlertTriangle,
  Wifi,
  WifiOff,
  Sliders,
  CheckCircle2,
  Info,
  Layers,
  X,
  Volume2,
  VolumeX,
} from "lucide-react";

import { cameraService } from "../services/cameraService";
import { centreService } from "../services/centreService";
import { StatusBadge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { CameraSnapshotModal } from "../components/modals/CameraSnapshotModal";
import { CardSkeleton } from "../components/ui/Skeleton";
import { ErrorState } from "../components/ui/ErrorState";

export function LiveCameraMonitoringPage() {
  const [searchParams] = useSearchParams();
  const initialCentreId = searchParams.get("centreId");

  const [cameras, setCameras] = useState([]);
  const [centres, setCentres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters & Grid layout
  const [gridSize, setGridSize] = useState(4); // 1, 4, 9, 16
  const [selectedCentre, setSelectedCentre] = useState(initialCentreId || "all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [search, setSearch] = useState("");
  const [aiOverlayActive, setAiOverlayActive] = useState(true);

  // Modals & Panels
  const [selectedCamForDetails, setSelectedCamForDetails] = useState(null);
  const [fullscreenCam, setFullscreenCam] = useState(null);
  const [snapshotCam, setSnapshotCam] = useState(null);

  const fetchCameras = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [camRes, centreRes] = await Promise.all([
        cameraService.getCameras({
          centreId: selectedCentre,
          status: selectedStatus,
          search,
        }),
        centreService.getCentres(),
      ]);
      setCameras(camRes.data);
      setCentres(centreRes.data);
    } catch (err) {
      setError(err.message || "Failed to load camera feeds");
    } finally {
      setLoading(false);
    }
  }, [selectedCentre, selectedStatus, search]);

  useEffect(() => {
    fetchCameras();
  }, [fetchCameras]);

  // Determine grid CSS column count based on gridSize
  const getGridClasses = () => {
    switch (gridSize) {
      case 1:
        return "grid-cols-1 max-w-4xl mx-auto";
      case 4:
        return "grid-cols-1 md:grid-cols-2";
      case 9:
        return "grid-cols-1 md:grid-cols-2 lg:grid-cols-3";
      case 16:
        return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4";
      default:
        return "grid-cols-1 md:grid-cols-2";
    }
  };

  const visibleCameras = cameras.slice(0, gridSize === 1 ? 1 : gridSize);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Video className="w-5 h-5 text-blue-600" />
            Live CCTV Compliance Surveillance
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Multi-stream CCTV inspection grid with edge AI object & trainee headcount telemetry
          </p>
        </div>

        {/* Grid Selector & AI Overlay Toggle */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200 shadow-xs text-xs">
            <span className="px-2 text-slate-400 font-semibold uppercase text-[10px]">
              Grid:
            </span>
            {[
              { size: 1, label: "1x1" },
              { size: 4, label: "2x2 (4)" },
              { size: 9, label: "3x3 (9)" },
              { size: 16, label: "4x4 (16)" },
            ].map((g) => (
              <button
                key={g.size}
                onClick={() => setGridSize(g.size)}
                className={`px-2.5 py-1 rounded-lg font-mono font-medium transition-all ${
                  gridSize === g.size
                    ? "bg-blue-50 text-blue-700 font-bold border border-blue-200"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                {g.label}
              </button>
            ))}
          </div>

          <button
            onClick={() => setAiOverlayActive(!aiOverlayActive)}
            className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              aiOverlayActive
                ? "bg-blue-50 border-blue-200 text-blue-700"
                : "bg-white border-slate-200 text-slate-600 hover:text-slate-900"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>AI Bounding Boxes: {aiOverlayActive ? "ON" : "OFF"}</span>
          </button>

          <Button
            variant="secondary"
            size="sm"
            icon={RefreshCw}
            onClick={fetchCameras}
          >
            Reload Feeds
          </Button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="w-full md:w-64">
          <input
            type="text"
            placeholder="Search camera name, location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-3 py-1.5 text-xs rounded-lg bg-white border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
          />
        </div>

        <div className="w-full md:w-auto flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-600 font-semibold uppercase">Centre:</span>
            <select
              value={selectedCentre}
              onChange={(e) => setSelectedCentre(e.target.value)}
              className="bg-white border border-slate-300 text-xs text-slate-800 rounded-lg px-3 py-1.5 focus:outline-none focus:border-blue-600 max-w-[200px] truncate"
            >
              <option value="all">All Centres ({centres.length})</option>
              {centres.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-600 font-semibold uppercase">Status:</span>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-white border border-slate-300 text-xs text-slate-800 rounded-lg px-3 py-1.5 focus:outline-none focus:border-blue-600"
            >
              <option value="all">All Statuses</option>
              <option value="Online">Online & Active</option>
              <option value="Warning">Warning / High Lag</option>
              <option value="Offline">Offline / Signal Lost</option>
            </select>
          </div>
        </div>
      </div>

      {/* CCTV Grid Viewport */}
      {loading ? (
        <div className="grid grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : error ? (
        <ErrorState message={error} onRetry={fetchCameras} />
      ) : visibleCameras.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-2xl border border-slate-200 shadow-xs">
          <p className="text-slate-800 text-sm font-semibold">No cameras match criteria</p>
          <p className="text-slate-500 text-xs mt-1">Select another centre or clear filters.</p>
        </div>
      ) : (
        <div className={`grid gap-4 ${getGridClasses()}`}>
          {visibleCameras.map((cam) => {
            const isOnline = cam.status === "Online";
            const isConfigured = cam.streamConfigured;

            return (
              <div
                key={cam.id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden flex flex-col transition-all duration-200 hover:border-slate-300 shadow-xs"
              >
                {/* Tile Top Bar */}
                <div className="p-3 bg-white border-b border-slate-100 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className={`w-2 h-2 rounded-full shrink-0 ${
                        !isConfigured
                          ? "bg-slate-400"
                          : isOnline
                          ? "bg-emerald-500 animate-pulse"
                          : cam.status === "Warning"
                          ? "bg-amber-500 animate-pulse"
                          : "bg-red-500"
                      }`}
                    />
                    <span className="font-bold text-slate-900 truncate">
                      {cam.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <StatusBadge status={isConfigured ? cam.status : "Stream Not Configured"} />
                  </div>
                </div>

                {/* Video Feed Canvas / Placeholder */}
                <div className="relative aspect-video bg-slate-950 flex flex-col justify-between p-3 overflow-hidden select-none">
                  {/* Scanline effect for active streams */}
                  {isConfigured && isOnline && <div className="cctv-scanline" />}

                  {/* Top HUD */}
                  <div className="relative z-10 flex items-center justify-between font-mono text-[10px] text-cyan-400 bg-slate-950/80 px-2 py-0.5 rounded border border-cyan-500/20 backdrop-blur-sm">
                    <span className="flex items-center gap-1.5">
                      <span className="text-slate-400">{cam.location}</span>
                    </span>
                    <span>{cam.resolution}</span>
                  </div>

                  {/* Feed Body Content */}
                  <div className="relative z-10 flex-1 flex flex-col items-center justify-center p-2 text-center">
                    {!isConfigured ? (
                      /* Professional Stream Not Configured Placeholder */
                      <div className="p-4 rounded-xl bg-slate-900/80 border border-dashed border-slate-700 max-w-xs text-center backdrop-blur-sm">
                        <Video className="w-7 h-7 text-slate-500 mx-auto mb-2 opacity-60" />
                        <h4 className="text-xs font-bold text-slate-300">
                          Stream Gateway Not Configured
                        </h4>
                        <p className="text-[10px] text-slate-500 mt-1 leading-relaxed">
                          RTSP credentials securely managed on edge backend. Awaiting WebRTC/HLS relay URL.
                        </p>
                        <span className="inline-block mt-2 text-[9px] font-mono text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/40">
                          Target: /api/streams/{cam.id.toLowerCase()}
                        </span>
                      </div>
                    ) : !isOnline ? (
                      /* Signal Lost / Offline Placeholder */
                      <div className="p-4 rounded-xl bg-red-950/30 border border-red-500/30 max-w-xs text-center">
                        <WifiOff className="w-7 h-7 text-red-400 mx-auto mb-2 animate-bounce" />
                        <h4 className="text-xs font-bold text-red-300">
                          CCTV Stream Lost
                        </h4>
                        <p className="text-[10px] text-red-400/80 mt-1">
                          Heartbeat timeout: {cam.lastPing}
                        </p>
                      </div>
                    ) : (
                      /* Active AI Telemetry Simulation */
                      <div className="w-full h-full flex flex-col justify-between">
                        {aiOverlayActive && (
                          <div className="flex-1 flex items-center justify-center relative">
                            {/* Simulated Target Detection Boxes */}
                            <div className="border border-cyan-400/70 bg-cyan-500/10 rounded px-2 py-1 text-[10px] font-mono text-cyan-200 shadow-md">
                              <span className="block font-bold">
                                TRAINEES SEATED [{cam.traineesDetected}]
                              </span>
                              <span className="text-[9px] text-cyan-400">
                                Match: {cam.confidenceScore}%
                              </span>
                            </div>

                            {cam.equipmentDetected?.length > 0 && (
                              <div className="absolute top-1 right-2 border border-emerald-400/70 bg-emerald-500/10 rounded px-1.5 py-0.5 text-[9px] font-mono text-emerald-300">
                                {cam.equipmentDetected[0]}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Bottom HUD */}
                  <div className="relative z-10 flex items-center justify-between font-mono text-[9px] text-slate-400 bg-slate-950/80 px-2 py-0.5 rounded border border-slate-800">
                    <span className="text-emerald-400 font-bold">
                      {isOnline && isConfigured ? `FPS: ${cam.fps} · ${cam.bitrate}` : "FPS: 0"}
                    </span>
                    <span className="text-slate-500 truncate max-w-[150px]">
                      {cam.centreName}
                    </span>
                  </div>
                </div>

                {/* Footer Controls & Stats */}
                <div className="p-3 bg-white border-t border-slate-100 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="flex flex-col">
                      <span className="text-[10px] text-slate-500 font-medium">Trainees Detected</span>
                      <span className="font-mono font-bold text-slate-900">
                        {cam.traineesDetected} / {cam.biometricTraineesExpected}
                      </span>
                    </div>
                    {cam.discrepancy !== 0 && (
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-red-50 text-red-600 border border-red-200 font-semibold">
                        {cam.discrepancy > 0 ? `+${cam.discrepancy}` : cam.discrepancy}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setSnapshotCam(cam)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-slate-100 transition-colors"
                      title="Capture Snapshot"
                    >
                      <Camera className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setSelectedCamForDetails(cam)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-slate-100 transition-colors"
                      title="Inspect Camera Telemetry"
                    >
                      <Info className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setFullscreenCam(cam)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors"
                      title="Maximize Feed"
                    >
                      <Maximize2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Snapshot Modal */}
      <CameraSnapshotModal
        isOpen={!!snapshotCam}
        camera={snapshotCam}
        onClose={() => setSnapshotCam(null)}
      />

      {/* Fullscreen Video Modal */}
      {fullscreenCam && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-5xl rounded-2xl border border-slate-200 bg-white shadow-2xl overflow-hidden flex flex-col">
            <div className="p-4 bg-white border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  {fullscreenCam.name} · Full Surveillance Viewport
                </h3>
                <p className="text-xs text-slate-500 font-mono">
                  {fullscreenCam.centreName} · {fullscreenCam.model}
                </p>
              </div>
              <button
                onClick={() => setFullscreenCam(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative aspect-video bg-slate-950 flex flex-col justify-between p-6">
              <div className="cctv-scanline" />
              <div className="relative z-10 flex items-center justify-between font-mono text-xs text-cyan-400 bg-slate-950/80 px-3 py-1.5 rounded-lg border border-cyan-500/30">
                <span>LIVE FEED · {fullscreenCam.resolution} · {fullscreenCam.fps} FPS</span>
                <span>CONFIDENCE: {fullscreenCam.confidenceScore}%</span>
              </div>
              <div className="relative z-10 flex-1 flex items-center justify-center">
                <div className="border border-dashed border-cyan-500/60 bg-cyan-950/20 rounded-xl p-8 max-w-md text-center">
                  <p className="text-base font-bold text-white mb-2">
                    {fullscreenCam.name}
                  </p>
                  <p className="text-xs text-cyan-300 font-mono">
                    Trainees Detected: {fullscreenCam.traineesDetected} / Expected: {fullscreenCam.biometricTraineesExpected}
                  </p>
                  <p className="text-xs text-slate-400 mt-2">
                    Equipment In View: {fullscreenCam.equipmentDetected?.join(", ") || "None"}
                  </p>
                </div>
              </div>
              <div className="relative z-10 flex items-center justify-between font-mono text-xs text-slate-400 bg-slate-950/80 px-3 py-1 rounded-lg border border-slate-800">
                <span>TIME: {new Date().toLocaleTimeString()}</span>
                <span className="text-emerald-400">CODEC: H.264 / WebRTC</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Camera Details Side Drawer */}
      {selectedCamForDetails && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-md bg-white border-l border-slate-200 shadow-2xl flex flex-col p-6 overflow-y-auto animate-in slide-in-from-right duration-300">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
                    <Video className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      Camera Stream Telemetry
                    </h3>
                    <p className="text-xs text-blue-600 font-semibold font-mono">
                      {selectedCamForDetails.id}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedCamForDetails(null)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4 text-xs text-slate-600 flex-1">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-900">
                      {selectedCamForDetails.name}
                    </span>
                    <StatusBadge status={selectedCamForDetails.status} />
                  </div>
                  <p className="text-blue-600 font-medium">
                    {selectedCamForDetails.centreName}
                  </p>
                  <p className="text-slate-500">
                    Location: {selectedCamForDetails.location}
                  </p>
                </div>

                <div className="space-y-2 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Device Hardware:</span>
                    <span className="font-mono text-slate-800 font-semibold">{selectedCamForDetails.model}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Resolution:</span>
                    <span className="font-mono text-blue-600 font-semibold">{selectedCamForDetails.resolution}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Frame Rate:</span>
                    <span className="font-mono text-emerald-600 font-semibold">{selectedCamForDetails.fps} FPS</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Relay Protocol:</span>
                    <span className="font-mono text-slate-800">{selectedCamForDetails.streamType || "Awaiting Config"}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Edge Gateway Status:</span>
                    <span className="font-mono text-slate-800">{selectedCamForDetails.lastPing}</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-200 space-y-2">
                  <span className="text-[11px] font-bold text-blue-700 uppercase tracking-wider">
                    AI Inference Summary
                  </span>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Trainees Detected:</span>
                    <span className="font-mono font-bold text-slate-900">{selectedCamForDetails.traineesDetected}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Biometric Expected:</span>
                    <span className="font-mono text-slate-700 font-medium">{selectedCamForDetails.biometricTraineesExpected}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Model Confidence:</span>
                    <span className="font-mono font-bold text-emerald-600">{selectedCamForDetails.confidenceScore}%</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 flex items-center justify-end">
                <Button
                  variant="secondary"
                  onClick={() => setSelectedCamForDetails(null)}
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
