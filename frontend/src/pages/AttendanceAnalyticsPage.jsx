import React, { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import {
  UsersRound,
  Download,
  Filter,
  Search,
  Fingerprint,
  Video,
  AlertTriangle,
  Calendar,
  CheckCircle2,
  FileSpreadsheet,
  ChevronRight,
  TrendingDown,
} from "lucide-react";
import { attendanceService } from "../services/attendanceService";
import { centreService } from "../services/centreService";
import { AttendanceTrendChart } from "../components/dashboard/AttendanceTrendChart";
import { DiscrepancyModal } from "../components/modals/DiscrepancyModal";
import { StatusBadge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { TableSkeleton, CardSkeleton } from "../components/ui/Skeleton";
import { ErrorState } from "../components/ui/ErrorState";
import { EmptyState } from "../components/ui/EmptyState";
import { exportToCsv } from "../utils/exportCsv";
import { formatDate } from "../utils/formatters";

export function AttendanceAnalyticsPage() {
  const [searchParams] = useSearchParams();
  const initialCentreId = searchParams.get("centreId");

  const [summary, setSummary] = useState(null);
  const [trends, setTrends] = useState([]);
  const [records, setRecords] = useState([]);
  const [centres, setCentres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters & timeframe
  const [timeframe, setTimeframe] = useState("daily");
  const [selectedCentre, setSelectedCentre] = useState(initialCentreId || "all");
  const [selectedAuditStatus, setSelectedAuditStatus] = useState("all");
  const [search, setSearch] = useState("");

  // Modal
  const [activeRecord, setActiveRecord] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [sumRes, trendRes, recRes, centreRes] = await Promise.all([
        attendanceService.getAttendanceSummary(),
        attendanceService.getAttendanceTrends(timeframe),
        attendanceService.getHistoricalRecords({
          centreId: selectedCentre,
          auditStatus: selectedAuditStatus,
          search,
        }),
        centreService.getCentres(),
      ]);
      setSummary(sumRes);
      setTrends(trendRes);
      setRecords(recRes.data);
      setCentres(centreRes.data);
    } catch (err) {
      setError(err.message || "Failed to load attendance analytics");
    } finally {
      setLoading(false);
    }
  }, [timeframe, selectedCentre, selectedAuditStatus, search]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleResolveRecord = async (recordId, newStatus, notes) => {
    setRecords((prev) =>
      prev.map((r) =>
        r.id === recordId
          ? { ...r, auditStatus: newStatus, notes: notes || r.notes }
          : r
      )
    );
  };

  const handleExportCsv = () => {
    exportToCsv("attendance_audit_discrepancies", records, [
      { key: "id", label: "Record ID" },
      { key: "date", label: "Date" },
      { key: "centreName", label: "Centre Name" },
      { key: "batchName", label: "Batch Name" },
      { key: "biometricCount", label: "Biometric Punch Count" },
      { key: "aiDetectedCount", label: "AI Headcount Count" },
      { key: "variance", label: "Mismatch Variance" },
      { key: "mismatchRate", label: "Mismatch %" },
      { key: "auditStatus", label: "Audit Status" },
      { key: "confidence", label: "AI Confidence" },
      { key: "notes", label: "Forensic Observation" },
    ]);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <UsersRound className="w-5 h-5 text-blue-600" />
            Attendance Discrepancy & Verification Analytics
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Cross-checking AEBAS biometric punches against real-time CCTV AI vision headcounts
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            icon={FileSpreadsheet}
            onClick={handleExportCsv}
          >
            Export CSV Audit
          </Button>
        </div>
      </div>

      {/* Top 4 KPI Metrics Cards */}
      {summary && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
              <span className="font-semibold uppercase">Submitted Biometrics</span>
              <div className="w-7 h-7 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
                <Fingerprint className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-mono font-bold text-slate-900">
              {summary.todaySubmitted}
            </p>
            <p className="text-[11px] text-blue-600 mt-1 font-medium">Across 24 active batch sessions</p>
          </div>

          <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
              <span className="font-semibold uppercase">AI Camera Headcount</span>
              <div className="w-7 h-7 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
                <Video className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-mono font-bold text-emerald-600">
              {summary.todayDetected}
            </p>
            <p className="text-[11px] text-slate-500 mt-1">
              Physically verified on CCTV cameras
            </p>
          </div>

          <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
              <span className="font-semibold uppercase">Discrepancy (Missing)</span>
              <div className="w-7 h-7 rounded-lg bg-red-50 border border-red-200 flex items-center justify-center text-red-600">
                <TrendingDown className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-mono font-bold text-red-600">
              -{summary.todayDiscrepancy}
            </p>
            <p className="text-[11px] text-red-600 mt-1 font-medium">
              Punched in but absent on camera
            </p>
          </div>

          <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
              <span className="font-semibold uppercase">Mismatch Rate</span>
              <div className="w-7 h-7 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
                <AlertTriangle className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-mono font-bold text-amber-600">
              {summary.todayMismatchRate}%
            </p>
            <p className="text-[11px] text-slate-500 mt-1">
              Threshold tolerance: &lt; 5.0% max
            </p>
          </div>
        </div>
      )}

      {/* Trend Area Chart */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 mb-2 border-b border-slate-100 gap-2">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Biometric Punch vs AI Camera Detection Trend
            </h3>
            <p className="text-xs text-slate-500">
              Compare biometric claims against verified room occupancy over time
            </p>
          </div>
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs">
            {["daily", "weekly", "monthly"].map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-3 py-1 rounded font-medium capitalize transition-colors ${
                  timeframe === tf
                    ? "bg-white text-blue-700 font-semibold shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {tf}
              </button>
            ))}
          </div>
        </div>
        <AttendanceTrendChart data={trends} />
      </div>

      {/* Filter Toolbar for Historical Log */}
      <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="w-full md:w-72">
          <Input
            placeholder="Search batch, centre, remarks..."
            icon={Search}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
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
              <option value="all">All Centres</option>
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
              value={selectedAuditStatus}
              onChange={(e) => setSelectedAuditStatus(e.target.value)}
              className="bg-white border border-slate-300 text-xs text-slate-800 rounded-lg px-3 py-1.5 focus:outline-none focus:border-blue-600"
            >
              <option value="all">All Audit Statuses</option>
              <option value="Verified">Verified</option>
              <option value="Minor Variance">Minor Variance</option>
              <option value="Critical Flag">Critical Flag</option>
              <option value="Under Review">Under Review</option>
            </select>
          </div>
        </div>
      </div>

      {/* Historical Discrepancy Table */}
      {loading ? (
        <TableSkeleton rows={5} cols={7} />
      ) : error ? (
        <ErrorState message={error} onRetry={fetchData} />
      ) : records.length === 0 ? (
        <EmptyState
          title="No attendance records found"
          description="Try clearing your search or status filter."
          actionLabel="Clear Filters"
          onAction={() => {
            setSearch("");
            setSelectedCentre("all");
            setSelectedAuditStatus("all");
          }}
        />
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">
              Daily Attendance Discrepancy Log ({records.length} Batches)
            </h3>
            <span className="text-[11px] text-slate-500">
              Click Inspect to open forensic evidence & audit actions
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="py-3 px-4">Centre / Batch</th>
                  <th className="py-3 px-4">Date & Time</th>
                  <th className="py-3 px-4 text-center">Biometric Punch</th>
                  <th className="py-3 px-4 text-center">AI CCTV Count</th>
                  <th className="py-3 px-4 text-center">Mismatch Delta</th>
                  <th className="py-3 px-4 text-center">Audit Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {records.map((r) => (
                  <tr
                    key={r.id}
                    className="hover:bg-slate-50/80 transition-colors group"
                  >
                    <td className="py-3.5 px-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                          {r.centreName}
                        </span>
                        <span className="text-[11px] text-slate-500 font-mono">
                          {r.batchName} · <span className="text-blue-600 font-semibold">{r.id}</span>
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-700 font-mono">
                      <div>{r.date}</div>
                      <div className="text-[10px] text-slate-400">{r.capturedAt}</div>
                    </td>
                    <td className="py-3.5 px-4 text-center font-mono">
                      <span className="text-sm font-bold text-blue-600">
                        {r.biometricCount}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center font-mono">
                      <span className="text-sm font-bold text-emerald-600">
                        {r.aiDetectedCount}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center font-mono">
                      <span
                        className={`font-extrabold ${
                          Math.abs(r.variance) > 5 ? "text-red-600" : "text-slate-700"
                        }`}
                      >
                        {r.variance > 0 ? `+${r.variance}` : r.variance}{" "}
                        <span className="text-[10px] font-normal text-slate-500">
                          ({r.mismatchRate}%)
                        </span>
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <StatusBadge status={r.auditStatus} />
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => {
                          setActiveRecord(r);
                          setIsModalOpen(true);
                        }}
                      >
                        Inspect
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Discrepancy Forensic Modal */}
      <DiscrepancyModal
        isOpen={isModalOpen}
        record={activeRecord}
        onClose={() => setIsModalOpen(false)}
        onResolve={handleResolveRecord}
      />
    </div>
  );
}
