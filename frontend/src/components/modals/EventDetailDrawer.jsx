import React, { useState } from "react";
import {
  X,
  AlertTriangle,
  Cpu,
  MapPin,
  Clock,
  ShieldCheck,
  CheckCircle,
  FileText,
  Eye,
  Check,
} from "lucide-react";
import { StatusBadge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { formatDate } from "../../utils/formatters";

export function EventDetailDrawer({
  isOpen,
  event,
  onClose,
  onUpdateStatus,
}) {
  const [reviewStatus, setReviewStatus] = useState("");
  const [investigationNotes, setInvestigationNotes] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  React.useEffect(() => {
    if (event) {
      setReviewStatus(event.reviewStatus || "Pending");
      setInvestigationNotes(event.investigationNotes || "");
    }
  }, [event]);

  if (!isOpen || !event) return null;

  const handleSave = async () => {
    setIsUpdating(true);
    if (onUpdateStatus) {
      await onUpdateStatus(event.id, reviewStatus, investigationNotes);
    }
    setIsUpdating(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-lg bg-white border-l border-slate-200 shadow-2xl flex flex-col p-6 overflow-y-auto animate-in slide-in-from-right duration-300">
          {/* Header */}
          <div className="flex items-start justify-between pb-4 border-b border-slate-100 mb-5">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-red-50 border border-red-200 flex items-center justify-center text-red-600">
                <Cpu className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {event.type}
                </h3>
                <span className="text-xs font-mono text-blue-600 font-semibold">
                  {event.id}
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4 text-xs text-slate-600 flex-1">
            {/* Status & Severity Badges */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
              <div className="flex items-center gap-2">
                <span className="text-slate-500 font-medium">Severity:</span>
                <StatusBadge status={event.severity} />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-slate-500 font-medium">Status:</span>
                <StatusBadge status={event.reviewStatus} />
              </div>
            </div>

            {/* Evidence Video Frame Simulation */}
            <div className="relative rounded-xl overflow-hidden border border-slate-300 bg-slate-950 aspect-video flex flex-col justify-between p-3 shadow-inner">
              <div className="cctv-scanline" />
              {/* Overlay Top */}
              <div className="relative z-10 flex items-center justify-between font-mono text-[11px] text-cyan-400 bg-slate-950/80 px-2 py-1 rounded backdrop-blur-sm border border-cyan-500/20">
                <span className="flex items-center gap-1.5 font-bold">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                  EVIDENCE FRAME · {event.location}
                </span>
                <span>{event.confidence}% CONFIDENCE</span>
              </div>

              {/* Simulated Bounding Boxes on scene */}
              <div className="relative z-10 flex-1 flex items-center justify-center my-4">
                <div className="border-2 border-dashed border-red-500/80 bg-red-500/10 rounded-lg p-3 max-w-[80%] text-center backdrop-blur-xs">
                  <span className="text-[10px] font-mono text-red-300 bg-red-950/80 px-1.5 py-0.5 rounded border border-red-500/30">
                    [AI DETECTION: {event.type.toUpperCase()}]
                  </span>
                  <p className="text-[11px] font-semibold text-slate-100 mt-1">
                    {event.description}
                  </p>
                </div>
              </div>

              {/* Overlay Bottom */}
              <div className="relative z-10 flex items-center justify-between font-mono text-[10px] text-slate-400 bg-slate-950/80 px-2 py-1 rounded border border-slate-800">
                <span>TS: {formatDate(event.timestamp)}</span>
                <span className="text-emerald-400">FPS: 25.0</span>
              </div>
            </div>

            {/* Event Context Meta */}
            <div className="space-y-2 p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-600 shrink-0" />
                <span className="text-slate-900 font-semibold">{event.centreName}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                <span>Detected At: {formatDate(event.timestamp)}</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-slate-400 shrink-0" />
                <span>Assigned Auditor: {event.assignedAuditor || "Pending Assignment"}</span>
              </div>
            </div>

            {/* Suggested Action */}
            <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 space-y-1">
              <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wider flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5" />
                Recommended Remediation Action
              </span>
              <p className="text-slate-800 text-xs leading-relaxed">
                {event.suggestedAction}
              </p>
            </div>

            {/* Status Change Selector */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
                Update Review Status
              </label>
              <div className="grid grid-cols-2 gap-2">
                {["Pending", "Acknowledged", "Resolved", "False Positive"].map(
                  (st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setReviewStatus(st)}
                      className={`p-2 rounded-lg border text-xs font-medium transition-colors text-left flex items-center justify-between ${
                        reviewStatus === st
                          ? "bg-blue-50 border-blue-600 text-blue-700 font-semibold shadow-xs"
                          : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      <span>{st}</span>
                      {reviewStatus === st && <Check className="w-3.5 h-3.5 text-blue-600" />}
                    </button>
                  )
                )}
              </div>
            </div>

            {/* Investigation Remarks Input */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
                Investigation Findings / Notes
              </label>
              <textarea
                rows={3}
                value={investigationNotes}
                onChange={(e) => setInvestigationNotes(e.target.value)}
                placeholder="Log field auditor findings, telephone call remarks, or remediation closure summary..."
                className="w-full rounded-lg bg-white border border-slate-300 px-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3 mt-4">
            <Button variant="secondary" onClick={onClose} disabled={isUpdating}>
              Cancel
            </Button>
            <Button
              variant="primary"
              loading={isUpdating}
              onClick={handleSave}
            >
              Update Event
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
