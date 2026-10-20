import React from "react";
import { Link } from "react-router-dom";
import { StatusBadge } from "../ui/Badge";
import { formatTime } from "../../utils/formatters";
import { AlertTriangle, ChevronRight, ShieldAlert, Info } from "lucide-react";

export function RecentEventsList({ events = [] }) {
  const getSeverityIcon = (sev) => {
    switch (sev.toLowerCase()) {
      case "critical":
        return <ShieldAlert className="w-4.5 h-4.5 text-red-600" />;
      case "warning":
        return <AlertTriangle className="w-4.5 h-4.5 text-amber-600" />;
      default:
        return <Info className="w-4.5 h-4.5 text-blue-600" />;
    }
  };

  return (
    <div className="divide-y divide-slate-100 font-sans">
      {events.map((evt) => (
        <div
          key={evt.id}
          className="p-4 hover:bg-slate-50 transition-colors flex items-start gap-3.5 text-xs sm:text-sm"
        >
          <div className="mt-0.5 shrink-0">{getSeverityIcon(evt.severity)}</div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2 mb-1">
              <span className="font-bold text-slate-900 truncate text-sm">
                {evt.type}
              </span>
              <span className="text-xs text-slate-400 font-mono shrink-0">
                {formatTime(evt.timestamp)}
              </span>
            </div>
            <p className="text-xs text-slate-600 line-clamp-2 mb-2.5 leading-relaxed">
              {evt.description}
            </p>
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs text-slate-500 truncate">
                {evt.centreName} · {evt.location}
              </span>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-[11px] text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200 font-bold">
                  {evt.confidence}% Conf.
                </span>
                <StatusBadge status={evt.reviewStatus} />
              </div>
            </div>
          </div>
        </div>
      ))}
      <div className="p-3.5 text-center bg-slate-50 border-t border-slate-100">
        <Link
          to="/events"
          className="text-xs sm:text-sm text-blue-600 hover:text-blue-700 font-bold inline-flex items-center gap-1.5"
        >
          View All AI Detection Events
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
