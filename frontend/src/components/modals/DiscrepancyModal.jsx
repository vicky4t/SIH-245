import React, { useState } from "react";
import {
  X,
  AlertTriangle,
  Fingerprint,
  Video,
  FileText,
  CheckCircle2,
  Send,
} from "lucide-react";
import { Button } from "../ui/Button";
import { StatusBadge } from "../ui/Badge";
import { formatDate } from "../../utils/formatters";

export function DiscrepancyModal({ isOpen, record, onClose, onResolve }) {
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen || !record) return null;

  const handleAction = async (status) => {
    setSubmitting(true);
    if (onResolve) {
      await onResolve(record.id, status, notes);
    }
    setSubmitting(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl rounded-2xl border border-slate-200 bg-white shadow-2xl p-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Attendance Discrepancy Audit
              </h3>
              <p className="text-xs text-slate-500 font-mono">
                Record ID: {record.id}
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

        <div className="space-y-4 text-xs text-slate-600">
          {/* Centre and Batch */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-900 text-sm">
                {record.centreName}
              </span>
              <StatusBadge status={record.auditStatus} />
            </div>
            <p className="text-blue-600 font-medium">{record.batchName}</p>
            <p className="text-slate-500 text-[11px]">
              Captured: {record.capturedAt} ({formatDate(record.date)})
            </p>
          </div>

          {/* Counts Comparison Box */}
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-3 rounded-xl bg-blue-50 border border-blue-200">
              <div className="flex items-center justify-center gap-1 text-blue-700 mb-1">
                <Fingerprint className="w-4 h-4" />
                <span className="font-semibold text-[11px]">Biometric Punch</span>
              </div>
              <p className="text-2xl font-bold font-mono text-blue-600">
                {record.biometricCount}
              </p>
              <span className="text-[10px] text-slate-500">AEBAS Portal</span>
            </div>

            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200">
              <div className="flex items-center justify-center gap-1 text-emerald-700 mb-1">
                <Video className="w-4 h-4" />
                <span className="font-semibold text-[11px]">AI Vision Count</span>
              </div>
              <p className="text-2xl font-bold font-mono text-emerald-600">
                {record.aiDetectedCount}
              </p>
              <span className="text-[10px] text-slate-500">CCTV Verified</span>
            </div>

            <div className="p-3 rounded-xl bg-red-50 border border-red-200">
              <div className="flex items-center justify-center gap-1 text-red-700 mb-1">
                <AlertTriangle className="w-4 h-4" />
                <span className="font-semibold text-[11px]">Mismatch Delta</span>
              </div>
              <p className="text-2xl font-bold font-mono text-red-600">
                {record.variance > 0 ? `+${record.variance}` : record.variance}
              </p>
              <span className="text-[10px] text-red-600 font-semibold font-mono">
                {record.mismatchRate}% Discrepancy
              </span>
            </div>
          </div>

          {/* AI Observation Notes */}
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-blue-600" />
              Automated Forensic Observation
            </span>
            <p className="text-slate-700 leading-relaxed text-xs">
              {record.notes}
            </p>
            <div className="pt-2 flex items-center justify-between text-[11px] text-slate-500">
              <span>Model Detection Confidence:</span>
              <span className="font-mono text-blue-600 font-bold">
                {record.confidence}%
              </span>
            </div>
          </div>

          {/* Auditor Investigation input */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
              Auditor Justification / Action Notes
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Enter auditor verification remarks, trainee explanation, or show-cause notice reference..."
              className="w-full rounded-lg bg-white border border-slate-300 px-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-5 border-t border-slate-200 mt-5">
          <Button variant="secondary" size="sm" onClick={onClose}>
            Close
          </Button>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              loading={submitting}
              onClick={() => handleAction("Under Review")}
            >
              Mark Under Review
            </Button>
            <Button
              variant="primary"
              size="sm"
              loading={submitting}
              icon={Send}
              onClick={() => handleAction("Notice Issued")}
            >
              Issue Notice
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
