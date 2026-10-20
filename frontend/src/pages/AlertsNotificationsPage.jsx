import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Bell,
  CheckCheck,
  Trash2,
  Filter,
  ShieldAlert,
  AlertTriangle,
  Info,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";
import { useNotifications } from "../context/NotificationContext";
import { StatusBadge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { EmptyState } from "../components/ui/EmptyState";
import { formatDate } from "../utils/formatters";

export function AlertsNotificationsPage() {
  const { notifications, unreadCount, markAsRead, markAllAsRead, clearAll } =
    useNotifications();
  const [selectedSeverity, setSelectedSeverity] = useState("all");

  const filtered = notifications.filter((n) => {
    if (selectedSeverity === "all") return true;
    return n.severity.toLowerCase() === selectedSeverity.toLowerCase();
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Bell className="w-5 h-5 text-blue-600" />
            Alerts & Compliance Notifications Register
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time critical notices, stream warnings, and inspection triggers
          </p>
        </div>
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <Button
              variant="secondary"
              size="sm"
              icon={CheckCheck}
              onClick={markAllAsRead}
            >
              Mark All Read ({unreadCount})
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            icon={Trash2}
            onClick={clearAll}
          >
            Clear All
          </Button>
        </div>
      </div>

      {/* Filter and stats bar */}
      <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="text-slate-600 font-semibold uppercase">Severity Filter:</span>
          {["all", "critical", "warning", "info", "success"].map((sev) => (
            <button
              key={sev}
              onClick={() => setSelectedSeverity(sev)}
              className={`px-3 py-1.5 rounded-lg capitalize font-medium transition-colors ${
                selectedSeverity === sev
                  ? "bg-blue-50 text-blue-700 font-bold border border-blue-200 shadow-xs"
                  : "bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              {sev}
            </button>
          ))}
        </div>

        <span className="text-xs text-slate-500 font-mono">
          Showing {filtered.length} of {notifications.length} notifications
        </span>
      </div>

      {/* Notification List */}
      {filtered.length === 0 ? (
        <EmptyState
          title="No alerts found"
          description="You are all caught up! No compliance warnings or critical issues flagged."
        />
      ) : (
        <div className="space-y-3">
          {filtered.map((n) => (
            <div
              key={n.id}
              className={`bg-white rounded-2xl p-4 sm:p-5 border transition-all duration-200 hover:border-slate-300 shadow-xs flex flex-col sm:flex-row items-start justify-between gap-4 ${
                !n.read ? "bg-blue-50/20 border-blue-200" : "bg-white border-slate-200"
              }`}
            >
              <div className="flex items-start gap-3.5 flex-1 min-w-0">
                <div className="mt-1 shrink-0">
                  {n.severity === "critical" ? (
                    <div className="w-9 h-9 rounded-xl bg-red-50 border border-red-200 flex items-center justify-center text-red-600">
                      <ShieldAlert className="w-5 h-5 animate-pulse" />
                    </div>
                  ) : n.severity === "warning" ? (
                    <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
                      <AlertTriangle className="w-5 h-5" />
                    </div>
                  ) : (
                    <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
                      <Info className="w-5 h-5" />
                    </div>
                  )}
                </div>

                <div className="space-y-1 min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm">
                      {n.title}
                    </span>
                    {!n.read && (
                      <span className="text-[9px] uppercase font-bold px-1.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                        Unread
                      </span>
                    )}
                    <span className="text-xs font-mono text-slate-500">
                      {formatDate(n.timestamp)}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {n.message}
                  </p>

                  {n.centreName && (
                    <p className="text-[11px] text-blue-600 font-medium">
                      Target Facility: {n.centreName}
                    </p>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                {!n.read && (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => markAsRead(n.id)}
                  >
                    Mark Read
                  </Button>
                )}
                {n.targetRoute && (
                  <Link to={n.targetRoute}>
                    <Button
                      variant="primary"
                      size="sm"
                      icon={ExternalLink}
                      iconPosition="right"
                      onClick={() => markAsRead(n.id)}
                    >
                      Investigate
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
