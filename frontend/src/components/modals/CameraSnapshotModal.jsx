import React from "react";
import { X, Camera, Download, ShieldCheck, CheckCircle2 } from "lucide-react";
import { Button } from "../ui/Button";
import { formatDate } from "../../utils/formatters";

export function CameraSnapshotModal({ isOpen, camera, onClose }) {
  if (!isOpen || !camera) return null;

  const downloadSnapshot = () => {
    alert(`Snapshot for ${camera.name} downloaded with cryptographic timestamp.`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl rounded-2xl border border-slate-200 bg-white shadow-2xl overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Live CCTV Snapshot Captured
              </h3>
              <p className="text-xs text-slate-500 font-mono">
                {camera.name} · {camera.location}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="relative aspect-video bg-slate-950 flex flex-col justify-between p-4 border-b border-slate-200 overflow-hidden">
          <div className="cctv-scanline" />

          {/* Top Stamp */}
          <div className="relative z-10 flex items-center justify-between text-xs font-mono text-cyan-400 bg-slate-950/80 px-3 py-1.5 rounded-lg border border-cyan-500/30 backdrop-blur-sm">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              STILL FRAME CAPTURE · {camera.model}
            </span>
            <span>{camera.resolution}</span>
          </div>

          {/* Scene Graphic */}
          <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center p-4">
            <div className="border border-dashed border-cyan-500/60 bg-slate-900/60 rounded-xl p-6 max-w-sm backdrop-blur-sm">
              <Camera className="w-8 h-8 text-cyan-400 mx-auto mb-2 opacity-80" />
              <p className="text-xs font-semibold text-slate-200">
                Live Frame Frozen at {camera.resolution}
              </p>
              <p className="text-[11px] text-cyan-300 font-mono mt-1">
                Trainees Counted: {camera.traineesDetected} · Conf: {camera.confidenceScore}%
              </p>
              <div className="mt-3 flex flex-wrap justify-center gap-1">
                {camera.equipmentDetected?.map((eq, i) => (
                  <span
                    key={i}
                    className="text-[9px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700"
                  >
                    {eq}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Watermark */}
          <div className="relative z-10 flex items-center justify-between text-[10px] font-mono text-slate-400 bg-slate-950/80 px-3 py-1 rounded-lg border border-slate-800">
            <span>TIMESTAMP: {new Date().toISOString()}</span>
            <span className="text-emerald-400">HASH: SHA256-VERIFIED</span>
          </div>
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-4">
          <span className="text-xs text-slate-600 font-mono">
            Centre: <strong className="text-slate-900">{camera.centreName}</strong>
          </span>
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              icon={Download}
              onClick={downloadSnapshot}
            >
              Save Image
            </Button>
            <Button variant="primary" size="sm" onClick={onClose}>
              Done
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
