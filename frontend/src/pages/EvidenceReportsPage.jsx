import React, { useState, useEffect, useCallback } from "react";
import {
  FileBarChart2,
  Download,
  Printer,
  Calendar,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Building2,
  ShieldCheck,
  FileSpreadsheet,
} from "lucide-react";
import { reportService } from "../services/reportService";
import { StatusBadge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { TableSkeleton } from "../components/ui/Skeleton";
import { ErrorState } from "../components/ui/ErrorState";
import { exportToCsv } from "../utils/exportCsv";
import { formatDateOnly } from "../utils/formatters";

export function EvidenceReportsPage() {
  const [reportType, setReportType] = useState("compliance");
  const [period, setPeriod] = useState("October 2026");
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchReport = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await reportService.getComplianceReports({ period, reportType });
      setReportData(data);
    } catch (err) {
      setError(err.message || "Failed to generate compliance report");
    } finally {
      setLoading(false);
    }
  }, [period, reportType]);

  useEffect(() => {
    fetchReport();
  }, [fetchReport]);

  const handleExportCsv = () => {
    if (!reportData) return;
    if (reportType === "compliance") {
      exportToCsv("compliance_audit_report", reportData.centresSummary, [
        { key: "centreId", label: "Centre ID" },
        { key: "name", label: "Centre Name" },
        { key: "state", label: "State" },
        { key: "score", label: "Compliance Score (%)" },
        { key: "status", label: "Audit Status" },
        { key: "attendanceDiscrepancy", label: "Attendance Discrepancy Level" },
        { key: "cameraUptime", label: "CCTV Camera Uptime" },
      ]);
    } else if (reportType === "attendance") {
      exportToCsv("attendance_audit_report", reportData.attendanceDiscrepancyLogs, [
        { key: "id", label: "Audit ID" },
        { key: "date", label: "Date" },
        { key: "centreName", label: "Centre Name" },
        { key: "batchName", label: "Batch Name" },
        { key: "biometricCount", label: "Biometric Punch" },
        { key: "aiDetectedCount", label: "AI Headcount" },
        { key: "variance", label: "Variance" },
        { key: "auditStatus", label: "Status" },
        { key: "notes", label: "Forensic Findings" },
      ]);
    } else {
      exportToCsv("infrastructure_deficits_report", reportData.infrastructureDeficits, [
        { key: "id", label: "Item ID" },
        { key: "itemName", label: "Item Name" },
        { key: "category", label: "Category" },
        { key: "centreName", label: "Centre Name" },
        { key: "sanctionedQty", label: "Sanctioned Qty" },
        { key: "detectedQty", label: "Detected Qty" },
        { key: "status", label: "Status" },
        { key: "notes", label: "AI Observation" },
      ]);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header (hidden in print) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <FileBarChart2 className="w-5 h-5 text-blue-600" />
            Official Compliance Reports & Evidence Audit
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Audit-grade forensic reports for State Nodal Agencies, NSDC, and Central Inspection Teams
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            icon={Printer}
            onClick={handlePrint}
          >
            Print / PDF
          </Button>
          <Button
            variant="primary"
            size="sm"
            icon={Download}
            onClick={handleExportCsv}
          >
            Export CSV
          </Button>
        </div>
      </div>

      {/* Filter and Report Type Selectors (hidden in print) */}
      <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3 no-print">
        <div className="flex flex-wrap items-center gap-2">
          {[
            { id: "compliance", label: "Centre Compliance Audit" },
            { id: "attendance", label: "Attendance Discrepancy Register" },
            { id: "infrastructure", label: "Infrastructure Deficit Report" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setReportType(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                reportType === tab.id
                  ? "bg-blue-50 text-blue-700 border border-blue-200 shadow-xs font-bold"
                  : "bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-600 font-semibold uppercase">Period:</span>
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="bg-white border border-slate-300 text-xs text-slate-800 rounded-lg px-3 py-1.5 focus:outline-none focus:border-blue-600"
          >
            <option value="October 2026">October 2026 (Current MTD)</option>
            <option value="September 2026">September 2026</option>
            <option value="Q3 2026">Q3 2026 (Jul - Sep)</option>
            <option value="FY 2026-27">FY 2026-27 YTD</option>
          </select>
        </div>
      </div>

      {/* Official Audit Report Document View (Formatted for display and printing) */}
      {loading ? (
        <TableSkeleton rows={6} cols={6} />
      ) : error ? (
        <ErrorState message={error} onRetry={fetchReport} />
      ) : !reportData ? (
        <div className="text-center p-8 text-slate-400 text-xs">No report data</div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-xs print:bg-white print:text-black print:border-none print:shadow-none">
          {/* Official Document Letterhead */}
          <div className="border-b border-slate-100 pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-blue-600 font-bold">
                GOVERNMENT OF INDIA · SKILL DEVELOPMENT MISSION
              </span>
              <h1 className="text-lg sm:text-xl font-extrabold text-slate-900 print:text-black tracking-tight mt-1">
                {reportType === "compliance"
                  ? "Consolidated Training Centre Surveillance & Compliance Audit"
                  : reportType === "attendance"
                  ? "AEBAS Biometric vs CCTV Video Attendance Discrepancy Log"
                  : "Sanctioned Physical Infrastructure & Equipment Deficit Report"}
              </h1>
              <p className="text-xs text-slate-500 print:text-gray-600 mt-1">
                Audit Cycle: {reportData.reportingPeriod} · Generated On: {formatDateOnly(reportData.generatedAt)}
              </p>
            </div>
            <div className="text-right font-mono text-xs">
              <span className="text-slate-500 print:text-gray-600 block">Report Doc Ref:</span>
              <span className="text-blue-600 font-bold">DOC/AUDIT/2026/OCT-88</span>
              <span className="text-[10px] text-emerald-600 font-bold block mt-0.5">DIGITALLY SEALED</span>
            </div>
          </div>

          {/* High-level Audit Findings Summary Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-50 print:bg-gray-100 border border-slate-200 print:border-gray-300">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500 print:text-gray-600">
                Centres Audited
              </span>
              <p className="text-xl font-bold font-mono text-slate-900 print:text-black mt-0.5">
                {reportData.totalCentresAudited} Centres
              </p>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500 print:text-gray-600">
                Avg Compliance Score
              </span>
              <p className="text-xl font-bold font-mono text-emerald-600 mt-0.5">
                {reportData.avgComplianceScore}%
              </p>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500 print:text-gray-600">
                Critical Violations
              </span>
              <p className="text-xl font-bold font-mono text-red-600 mt-0.5">
                {reportData.criticalEventsCount} Flagged
              </p>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500 print:text-gray-600">
                Equipment Deficits
              </span>
              <p className="text-xl font-bold font-mono text-amber-600 mt-0.5">
                {reportData.infrastructureDeficits.length} Items Missing/Defect
              </p>
            </div>
          </div>

          {/* Content Tables Based on Report Type */}
          {reportType === "compliance" && (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 print:bg-gray-200 print:text-black text-slate-600 uppercase font-semibold">
                  <tr>
                    <th className="py-3 px-4">Centre Code & Name</th>
                    <th className="py-3 px-4">State</th>
                    <th className="py-3 px-4 text-center">Camera Telemetry</th>
                    <th className="py-3 px-4 text-center">Attendance Discrepancy</th>
                    <th className="py-3 px-4 text-right">Score</th>
                    <th className="py-3 px-4 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 print:divide-gray-300 font-medium">
                  {reportData.centresSummary.map((c) => (
                    <tr key={c.centreId} className="hover:bg-slate-50/80">
                      <td className="py-3 px-4 font-bold text-slate-900 print:text-black">
                        {c.name}
                        <span className="block text-[10px] font-mono text-slate-500 font-normal">
                          {c.centreId}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-700 print:text-black">{c.state}</td>
                      <td className="py-3 px-4 text-center font-mono text-blue-600 font-semibold">
                        {c.cameraUptime} Online
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`font-mono text-xs ${
                            c.attendanceDiscrepancy.includes("High")
                              ? "text-red-600 font-bold"
                              : "text-emerald-600"
                          }`}
                        >
                          {c.attendanceDiscrepancy}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-sm text-slate-900 print:text-black">
                        {c.score}%
                      </td>
                      <td className="py-3 px-4 text-center">
                        <StatusBadge status={c.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {reportType === "attendance" && (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 print:bg-gray-200 print:text-black text-slate-600 uppercase font-semibold">
                  <tr>
                    <th className="py-3 px-4">Record ID / Batch</th>
                    <th className="py-3 px-4">Centre</th>
                    <th className="py-3 px-4 text-center">Biometric Punch</th>
                    <th className="py-3 px-4 text-center">AI Vision Count</th>
                    <th className="py-3 px-4 text-center">Variance</th>
                    <th className="py-3 px-4">Forensic Remark</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {reportData.attendanceDiscrepancyLogs.map((a) => (
                    <tr key={a.id} className="hover:bg-slate-50/80">
                      <td className="py-3 px-4 font-bold text-slate-900 print:text-black">
                        {a.batchName}
                        <span className="block text-[10px] font-mono text-blue-600 font-semibold">
                          {a.id} ({a.date})
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-700 print:text-black">{a.centreName}</td>
                      <td className="py-3 px-4 text-center font-mono font-bold text-blue-600">
                        {a.biometricCount}
                      </td>
                      <td className="py-3 px-4 text-center font-mono font-bold text-emerald-600">
                        {a.aiDetectedCount}
                      </td>
                      <td className="py-3 px-4 text-center font-mono font-bold text-red-600">
                        {a.variance} ({a.mismatchRate}%)
                      </td>
                      <td className="py-3 px-4 text-slate-600 text-[11px] leading-relaxed">
                        {a.notes}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {reportType === "infrastructure" && (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 print:bg-gray-200 print:text-black text-slate-600 uppercase font-semibold">
                  <tr>
                    <th className="py-3 px-4">Asset Name / Sanction Ref</th>
                    <th className="py-3 px-4">Centre</th>
                    <th className="py-3 px-4 text-center">Sanctioned vs Detected</th>
                    <th className="py-3 px-4 text-center">Deficit Status</th>
                    <th className="py-3 px-4">Inspection Finding</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {reportData.infrastructureDeficits.map((inf) => (
                    <tr key={inf.id} className="hover:bg-slate-50/80">
                      <td className="py-3 px-4 font-bold text-slate-900 print:text-black">
                        {inf.itemName}
                        <span className="block text-[10px] font-mono text-blue-600 font-semibold">
                          {inf.sanctionRef}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-700 print:text-black">{inf.centreName}</td>
                      <td className="py-3 px-4 text-center font-mono font-bold text-slate-900 print:text-black">
                        {inf.detectedQty} / {inf.sanctionedQty}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <StatusBadge status={inf.status} />
                      </td>
                      <td className="py-3 px-4 text-slate-600 text-[11px] leading-relaxed">
                        {inf.notes}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Audit Verification Footer & Sign-off */}
          <div className="pt-8 border-t border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-slate-500 print:text-black">
            <div className="space-y-1">
              <p className="font-semibold text-slate-900 print:text-black">
                Surveillance Verification Protocol
              </p>
              <p className="text-[11px] text-slate-500 max-w-md">
                Generated automatically by Video AI Analytics Pipeline v2.4 conforming to NCVET Compliance Guidelines.
              </p>
            </div>
            <div className="text-right sm:self-end">
              <div className="h-10 border-b border-dashed border-slate-300 w-48 mb-1" />
              <p className="font-mono text-[11px] text-slate-700 print:text-black font-semibold">
                Central Compliance Authority
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
