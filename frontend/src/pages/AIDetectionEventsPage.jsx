import React, { useState, useEffect, useCallback } from "react";
import {
  Cpu,
  Search,
  Filter,
  ShieldAlert,
  AlertTriangle,
  Info,
  CheckCircle2,
  Clock,
  Eye,
  Camera,
  Layers,
  ArrowRight,
} from "lucide-react";
import { eventService } from "../services/eventService";
import { StatusBadge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { EventDetailDrawer } from "../components/modals/EventDetailDrawer";
import { TableSkeleton, CardSkeleton } from "../components/ui/Skeleton";
import { ErrorState } from "../components/ui/ErrorState";
import { EmptyState } from "../components/ui/EmptyState";
import { formatDate } from "../utils/formatters";

export function AIDetectionEventsPage() {
  const [events, setEvents] = useState([]);
  const [counts, setCounts] = useState({ critical: 0, warning: 0, pending: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [selectedSeverity, setSelectedSeverity] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedReviewStatus, setSelectedReviewStatus] = useState("all");
  const [search, setSearch] = useState("");

  // Drawer
  const [activeEvent, setActiveEvent] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await eventService.getEvents({
        severity: selectedSeverity,
        type: selectedType,
        reviewStatus: selectedReviewStatus,
        search,
      });
      setEvents(res.data);
      setCounts({
        critical: res.criticalCount,
        warning: res.warningCount,
        pending: res.pendingReviewCount,
      });
    } catch (err) {
      setError(err.message || "Failed to load AI events");
    } finally {
      setLoading(false);
    }
  }, [selectedSeverity, selectedType, selectedReviewStatus, search]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const handleUpdateStatus = async (id, newStatus, investigationNotes) => {
    try {
      await eventService.updateReviewStatus(id, newStatus, investigationNotes);
      await fetchEvents();
    } catch (err) {
      alert("Failed to update event: " + err.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Cpu className="w-5 h-5 text-blue-600" />
            AI Detection Events & Anomaly Stream
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Automated computer vision detection incidents across all vocational training centres
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200 font-semibold">
            Model: YOLOv8-Compliance-v2
          </span>
        </div>
      </div>

      {/* Top Severity Counter Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase">
              Critical Violations
            </span>
            <p className="text-2xl font-bold font-mono text-red-600 mt-0.5">
              {counts.critical}
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-red-50 border border-red-200 flex items-center justify-center text-red-600">
            <ShieldAlert className="w-5 h-5 animate-pulse" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase">
              Warning Alerts
            </span>
            <p className="text-2xl font-bold font-mono text-amber-600 mt-0.5">
              {counts.warning}
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase">
              Pending Auditor Review
            </span>
            <p className="text-2xl font-bold font-mono text-blue-600 mt-0.5">
              {counts.pending}
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
            <Clock className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="w-full md:w-72">
          <Input
            placeholder="Search anomaly description, centre, ID..."
            icon={Search}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="w-full md:w-auto flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-600 font-semibold uppercase">Severity:</span>
            <select
              value={selectedSeverity}
              onChange={(e) => setSelectedSeverity(e.target.value)}
              className="bg-white border border-slate-300 text-xs text-slate-800 rounded-lg px-3 py-1.5 focus:outline-none focus:border-blue-600"
            >
              <option value="all">All Severities</option>
              <option value="Critical">Critical</option>
              <option value="Warning">Warning</option>
              <option value="Info">Info</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-600 font-semibold uppercase">Type:</span>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="bg-white border border-slate-300 text-xs text-slate-800 rounded-lg px-3 py-1.5 focus:outline-none focus:border-blue-600 max-w-[200px] truncate"
            >
              <option value="all">All Event Types</option>
              <option value="Attendance Mismatch">Attendance Mismatch</option>
              <option value="Missing Equipment">Missing Equipment</option>
              <option value="Potentially Non-Functional Equipment">Non-Functional Equipment</option>
              <option value="Camera Offline">Camera Offline</option>
              <option value="Processing Errors">Processing Errors</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-600 font-semibold uppercase">Review:</span>
            <select
              value={selectedReviewStatus}
              onChange={(e) => setSelectedReviewStatus(e.target.value)}
              className="bg-white border border-slate-300 text-xs text-slate-800 rounded-lg px-3 py-1.5 focus:outline-none focus:border-blue-600"
            >
              <option value="all">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Acknowledged">Acknowledged</option>
              <option value="Resolved">Resolved</option>
              <option value="False Positive">False Positive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Events List / Cards */}
      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : error ? (
        <ErrorState message={error} onRetry={fetchEvents} />
      ) : events.length === 0 ? (
        <EmptyState
          title="No detection events match criteria"
          description="Try broadening your severity or search filter."
          actionLabel="Clear Filters"
          onAction={() => {
            setSearch("");
            setSelectedSeverity("all");
            setSelectedType("all");
            setSelectedReviewStatus("all");
          }}
        />
      ) : (
        <div className="space-y-3.5">
          {events.map((evt) => (
            <div
              key={evt.id}
              className={`bg-white rounded-2xl p-4 sm:p-5 border transition-all duration-200 hover:border-slate-300 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
                evt.severity === "Critical"
                  ? "border-red-200 hover:shadow-red-500/5"
                  : evt.severity === "Warning"
                  ? "border-amber-200 hover:shadow-amber-500/5"
                  : "border-slate-200"
              }`}
            >
              <div className="flex items-start gap-3.5 flex-1 min-w-0">
                <div className="mt-1 shrink-0">
                  {evt.severity === "Critical" ? (
                    <div className="w-9 h-9 rounded-xl bg-red-50 border border-red-200 flex items-center justify-center text-red-600">
                      <ShieldAlert className="w-5 h-5 animate-pulse" />
                    </div>
                  ) : evt.severity === "Warning" ? (
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
                      {evt.type}
                    </span>
                    <span className="text-xs font-mono text-blue-600 font-semibold">
                      [{evt.id}]
                    </span>
                    <StatusBadge status={evt.severity} />
                    <span className="text-[11px] font-mono text-slate-500">
                      {formatDate(evt.timestamp)}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {evt.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] text-slate-500">
                    <span>Centre: <strong className="text-slate-800">{evt.centreName}</strong></span>
                    <span>·</span>
                    <span>Camera: <strong className="text-slate-800">{evt.location}</strong></span>
                    <span>·</span>
                    <span className="font-mono text-blue-600 font-semibold">
                      {evt.confidence}% Confidence
                    </span>
                  </div>
                </div>
              </div>

              {/* Status and Action */}
              <div className="flex items-center gap-3 self-end md:self-center shrink-0">
                <StatusBadge status={evt.reviewStatus} />
                <Button
                  variant="primary"
                  size="sm"
                  icon={ArrowRight}
                  iconPosition="right"
                  onClick={() => {
                    setActiveEvent(evt);
                    setIsDrawerOpen(true);
                  }}
                >
                  Review Anomaly
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Event Details Drawer */}
      <EventDetailDrawer
        isOpen={isDrawerOpen}
        event={activeEvent}
        onClose={() => setIsDrawerOpen(false)}
        onUpdateStatus={handleUpdateStatus}
      />
    </div>
  );
}
