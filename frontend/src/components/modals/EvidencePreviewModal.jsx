import React from "react";
import { X, ShieldAlert, CheckCircle2, Download, Eye, Camera } from "lucide-react";
import { Button } from "../ui/Button";
import { StatusBadge } from "../ui/Badge";
import { formatDate } from "../../utils/formatters";

export function EvidencePreviewModal({ isOpen, item, onClose }) {
  if (!isOpen || !item) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl rounded-2xl border border-slate-200 bg-white shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                AI Vision Evidence Snapshot
              </h3>
              <p className="text-xs text-slate-500 font-mono">
                Asset: {item.itemName || item.name} · <span className="text-blue-600 font-semibold">{item.qrTag || item.id}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Video Frame Canvas Simulation */}
        <div className="relative aspect-video bg-slate-950 flex flex-col justify-between p-4 overflow-hidden border-b border-slate-200">
          <div className="cctv-scanline" />

          {/* Top HUD */}
          <div className="relative z-10 flex items-center justify-between font-mono text-xs text-cyan-400 bg-slate-900/80 px-3 py-1.5 rounded-lg backdrop-blur-sm border border-cyan-500/20">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              SANCTION AUDIT STREAM · {item.location || "On-Premises"}
            </span>
            <span>CONFIDENCE: {item.aiConfidence || 95.0}%</span>
          </div>

          {/* Center Graphic */}
          <div className="relative z-10 flex-1 flex items-center justify-center">
            <div className="border-2 border-cyan-400/80 bg-cyan-950/40 rounded-xl p-5 max-w-md text-center backdrop-blur-xs relative shadow-2xl">
              <div className="absolute -top-3 left-4 px-2 py-0.5 bg-blue-600 text-white font-mono text-[10px] font-bold rounded">
                OBJECT IDENTIFIER
              </div>
              <p className="text-sm font-bold text-white mb-1">
                {item.itemName || item.name}
              </p>
              <p className="text-xs text-cyan-300 font-mono mb-2">
                Sanctioned Qty: {item.sanctionedQty || 1} · Detected Qty: {item.detectedQty ?? 0}
              </p>
              <p className="text-xs text-slate-200 leading-relaxed">
                {item.notes || "AI frame analysis confirmed physical asset position matching geo-tagged coordinates."}
              </p>
            </div>
          </div>

          {/* Bottom HUD */}
          <div className="relative z-10 flex items-center justify-between font-mono text-[11px] text-slate-400 bg-slate-900/80 px-3 py-1 rounded-lg border border-slate-800">
            <span>TIMESTAMP: {formatDate(item.lastVerified || new Date())}</span>
            <span className="text-cyan-400 font-bold">SERIAL: {item.serialNumber || "VERIFIED"}</span>
          </div>
        </div>

        {/* Details & Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <StatusBadge status={item.status} />
            <span className="text-xs text-slate-600">
              Condition: <strong className="text-slate-900">{item.condition || "Operational"}</strong>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              icon={Download}
              onClick={() => alert("Audit certificate & evidence PNG downloaded")}
            >
              Export Frame
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
