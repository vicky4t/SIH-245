import React from "react";
import { Award, AlertOctagon, Video, CheckCircle2 } from "lucide-react";

export function ComplianceSummaryCards({ highlights }) {
  if (!highlights) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 font-sans">
      {/* Top Compliant Centre */}
      <div className="bg-emerald-50/80 rounded-2xl p-5 sm:p-6 border border-emerald-200 shadow-2xs hover:shadow-xs transition-shadow">
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-2">
            <Award className="w-4.5 h-4.5 text-emerald-600" />
            Top Performer
          </span>
          <span className="text-xs font-bold text-emerald-800 bg-white px-2.5 py-0.5 rounded-full border border-emerald-200 shadow-2xs">
            {highlights.topPerformer?.score}%
          </span>
        </div>
        <p className="text-base font-bold text-slate-900 truncate mb-1">
          {highlights.topPerformer?.name}
        </p>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          Zero biometric discrepancies detected over 14 monitored cameras.
        </p>
      </div>

      {/* Highest Risk Centre */}
      <div className="bg-red-50/80 rounded-2xl p-5 sm:p-6 border border-red-200 shadow-2xs hover:shadow-xs transition-shadow">
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-xs font-bold text-red-800 uppercase tracking-wider flex items-center gap-2">
            <AlertOctagon className="w-4.5 h-4.5 text-red-600" />
            Highest Audit Risk
          </span>
          <span className="text-xs font-bold text-red-800 bg-white px-2.5 py-0.5 rounded-full border border-red-200 shadow-2xs">
            {highlights.highestRisk?.score}%
          </span>
        </div>
        <p className="text-base font-bold text-slate-900 truncate mb-1">
          {highlights.highestRisk?.name}
        </p>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          52 unverified attendees & 1 missing biometric terminal flagged.
        </p>
      </div>

      {/* Camera Telemetry */}
      <div className="bg-cyan-50/80 rounded-2xl p-5 sm:p-6 border border-cyan-200 shadow-2xs hover:shadow-xs transition-shadow">
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-xs font-bold text-cyan-800 uppercase tracking-wider flex items-center gap-2">
            <Video className="w-4.5 h-4.5 text-cyan-600" />
            CCTV Telemetry
          </span>
          <span className="text-xs font-bold text-cyan-800 bg-white px-2.5 py-0.5 rounded-full border border-cyan-200 shadow-2xs">
            87.5%
          </span>
        </div>
        <p className="text-base font-bold text-slate-900 truncate mb-1">
          {highlights.activeCameras}
        </p>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          2 camera streams pending gateway reconfiguration or link recovery.
        </p>
      </div>

      {/* AI Parity Engine */}
      <div className="bg-blue-50/80 rounded-2xl p-5 sm:p-6 border border-blue-200 shadow-2xs hover:shadow-xs transition-shadow">
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-xs font-bold text-blue-800 uppercase tracking-wider flex items-center gap-2">
            <CheckCircle2 className="w-4.5 h-4.5 text-blue-600" />
            Audit Mismatch
          </span>
          <span className="text-xs font-bold text-amber-800 bg-white px-2.5 py-0.5 rounded-full border border-amber-200 shadow-2xs">
            12.6%
          </span>
        </div>
        <p className="text-base font-bold text-slate-900 truncate mb-1">
          {highlights.avgAttendanceMismatch}
        </p>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          State standard target is under 5.0% discrepancy threshold.
        </p>
      </div>
    </div>
  );
}
