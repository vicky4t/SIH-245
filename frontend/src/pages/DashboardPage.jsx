import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  Building2,
  CheckCircle,
  Users,
  AlertTriangle,
  ShieldCheck,
  PackageX,
  Bell,
  Percent,
  RefreshCw,
  ScanEye,
  Radio,
} from "lucide-react";
import { dashboardService } from "../services/dashboardService";
import { StatCard } from "../components/dashboard/StatCard";
import { AttendanceComparisonChart } from "../components/dashboard/AttendanceComparisonChart";
import { ComplianceDonutChart } from "../components/dashboard/ComplianceDonutChart";
import { AttendanceTrendChart } from "../components/dashboard/AttendanceTrendChart";
import { CentrePerformanceTable } from "../components/dashboard/CentrePerformanceTable";
import { RecentEventsList } from "../components/dashboard/RecentEventsList";
import { ComplianceSummaryCards } from "../components/dashboard/ComplianceSummaryCards";
import { CardSkeleton, TableSkeleton } from "../components/ui/Skeleton";
import { ErrorState } from "../components/ui/ErrorState";
import { Button } from "../components/ui/Button";
import { useApp } from "../context/AppContext";

export function DashboardPage() {
  const { mockMode, globalDate } = useApp();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [trendRange, setTrendRange] = useState("daily");

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const summary = await dashboardService.getDashboardSummary();
      setData(summary);
    } catch (err) {
      setError(err.message || "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData, globalDate]);

  if (loading) {
    return (
      <div className="space-y-7 sm:space-y-8 animate-pulse font-sans">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white p-7 rounded-2xl h-96 border border-slate-200" />
          <div className="bg-white p-7 rounded-2xl h-96 border border-slate-200" />
        </div>
        <TableSkeleton rows={5} cols={6} />
      </div>
    );
  }

  if (error) {
    return (
      <ErrorState
        title="Unable to load compliance dashboard"
        message={error}
        onRetry={loadData}
      />
    );
  }

  const {
    kpis,
    complianceDonutData,
    attendanceComparisonData,
    dailyTrends,
    complianceHighlights,
    recentCentres,
    recentEvents,
  } = data;

  return (
    <div className="space-y-7 sm:space-y-8 font-sans min-w-0">
      {/* SkillVision AI Welcome & Status Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-6 sm:p-7 rounded-2xl bg-white border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
              Live Operations Command
            </span>
            {mockMode && (
              <span className="text-xs uppercase font-mono px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 font-semibold border border-amber-200">
                Demo Simulation
              </span>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            SkillVision AI Operations Center
          </h1>
          <p className="text-sm sm:text-base text-slate-500 mt-1">
            Intelligent Training Centre Monitoring & Compliance · Real-time biometric validation, CCTV headcounts, and sanctioned asset surveillance.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0 self-start lg:self-auto">
          <Button
            variant="secondary"
            size="md"
            icon={RefreshCw}
            onClick={loadData}
          >
            Refresh Telemetry
          </Button>
        </div>
      </div>

      {/* 8 Primary KPI Cards in Spacious Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
        <StatCard
          title="Total Training Centres"
          value={kpis.totalCentres.value}
          subtext="Under active surveillance"
          change={kpis.totalCentres.change}
          changeType={kpis.totalCentres.changeType}
          icon={Building2}
          variant="blue"
        />
        <StatCard
          title="Active Centres Monitored"
          value={kpis.activeCentres.value}
          subtext={kpis.activeCentres.subtext}
          icon={CheckCircle}
          variant="emerald"
        />
        <StatCard
          title="Trainees Detected Today"
          value={kpis.traineesDetectedToday.value}
          subtext={`vs ${kpis.traineesDetectedToday.claimed} Claimed Biometrics`}
          change="AI Headcount"
          changeType={kpis.traineesDetectedToday.changeType}
          icon={Users}
          variant="cyan"
        />
        <StatCard
          title="Attendance Discrepancies"
          value={kpis.attendanceDiscrepancies.value}
          subtext={kpis.attendanceDiscrepancies.rate}
          change="Ghost attendance"
          changeType={kpis.attendanceDiscrepancies.changeType}
          icon={AlertTriangle}
          variant="red"
        />
        <StatCard
          title="Approved Infrastructure"
          value={kpis.approvedInfrastructure.value}
          subtext={`of ${kpis.approvedInfrastructure.total} Sanctioned Assets`}
          change="Verified Functional"
          changeType="positive"
          icon={ShieldCheck}
          variant="emerald"
        />
        <StatCard
          title="Missing / Defective Assets"
          value={kpis.missingNonFunctionalEquipment.value}
          subtext={kpis.missingNonFunctionalEquipment.breakdown}
          change="Audit Violations"
          changeType="negative"
          icon={PackageX}
          variant="amber"
        />
        <StatCard
          title="Active Compliance Alerts"
          value={kpis.activeAlerts.value}
          subtext={`${kpis.activeAlerts.critical} Critical · ${kpis.activeAlerts.warnings} Warning`}
          change="Needs Action"
          changeType="negative"
          icon={Bell}
          variant="red"
        />
        <StatCard
          title="Overall Compliance Score"
          value={`${kpis.overallCompliancePercentage.value}%`}
          subtext={kpis.overallCompliancePercentage.target}
          change="National Standard"
          changeType="warning"
          icon={Percent}
          variant="blue"
        />
      </div>

      {/* Compliance Highlights / Summary Cards */}
      <ComplianceSummaryCards highlights={complianceHighlights} />

      {/* Charts Row 1: Attendance Comparison & Infrastructure Compliance Donut */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-7">
        {/* Attendance Comparison Bar Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 sm:p-7 border border-slate-200 shadow-xs min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-3 border-b border-slate-100 gap-2">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                Biometric Submitted vs AI Camera Headcount by Centre
              </h2>
              <p className="text-xs sm:text-sm text-slate-500">
                Identifies attendance discrepancies and ghost attendee patterns
              </p>
            </div>
            <span className="text-xs font-bold text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-200 self-start sm:self-auto">
              Cross-Verification
            </span>
          </div>
          <AttendanceComparisonChart data={attendanceComparisonData} />
        </div>

        {/* Infrastructure Compliance Donut Chart */}
        <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200 shadow-xs min-w-0">
          <div className="flex items-center justify-between pb-4 mb-3 border-b border-slate-100">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                Infrastructure Compliance
              </h2>
              <p className="text-xs sm:text-sm text-slate-500">
                480 total sanctioned equipment items
              </p>
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              87.1% Score
            </span>
          </div>
          <ComplianceDonutChart data={complianceDonutData} />
        </div>
      </div>

      {/* Charts Row 2: Attendance Trend Line/Area Chart & Recent AI Detection Events */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-7">
        {/* Attendance Trend Line/Area Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 sm:p-7 border border-slate-200 shadow-xs min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-3 border-b border-slate-100 gap-2">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                Attendance Verification Trend (Last 7 Days)
              </h2>
              <p className="text-xs sm:text-sm text-slate-500">
                Shows gap divergence between claimed biometrics and detected presence
              </p>
            </div>
            <div className="flex items-center gap-1 bg-slate-100 p-1.5 rounded-xl border border-slate-200 text-xs sm:text-sm self-start sm:self-auto">
              <button
                onClick={() => setTrendRange("daily")}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                  trendRange === "daily"
                    ? "bg-white text-blue-700 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Daily
              </button>
              <button
                onClick={() => setTrendRange("weekly")}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                  trendRange === "weekly"
                    ? "bg-white text-blue-700 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Weekly
              </button>
            </div>
          </div>
          <AttendanceTrendChart data={dailyTrends} />
        </div>

        {/* Recent AI Detection Events */}
        <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200 shadow-xs flex flex-col min-w-0">
          <div className="flex items-center justify-between pb-4 mb-3 border-b border-slate-100">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                Recent AI Detection Events
              </h2>
              <p className="text-xs sm:text-sm text-slate-500">
                Automated vision alerts requiring inspection
              </p>
            </div>
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
          </div>
          <div className="flex-1 overflow-y-auto">
            <RecentEventsList events={recentEvents} />
          </div>
        </div>
      </div>

      {/* Centre Performance Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden min-w-0">
        <div className="p-6 sm:p-7 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900">
              Training Centre Compliance Leaderboard
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              State-wise compliance scores, active camera telemetry, and enrolled capacity
            </p>
          </div>
          <Link to="/centres">
            <Button variant="outline" size="sm">
              View All Centres
            </Button>
          </Link>
        </div>
        <CentrePerformanceTable centres={recentCentres} />
      </div>
    </div>
  );
}
