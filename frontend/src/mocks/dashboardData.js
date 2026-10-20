export const mockDashboardSummary = {
  kpis: {
    totalCentres: { value: 8, label: "Total Training Centres", change: "+2 this quarter", changeType: "positive" },
    activeCentres: { value: 8, label: "Active Centres Monitored", subtext: "100% telemetry online", changeType: "neutral" },
    traineesDetectedToday: { value: 1262, label: "Trainees Detected Today", claimed: 1445, changeType: "warning" },
    attendanceDiscrepancies: { value: 183, label: "Attendance Discrepancies", rate: "12.6% mismatch", changeType: "negative" },
    approvedInfrastructure: { value: 418, label: "Approved Infrastructure", total: 480, changeType: "positive" },
    missingNonFunctionalEquipment: { value: 62, label: "Missing / Defective Assets", breakdown: "38 Missing · 24 Defective", changeType: "negative" },
    activeAlerts: { value: 14, label: "Active Compliance Alerts", critical: 4, warnings: 10, changeType: "negative" },
    overallCompliancePercentage: { value: 86.4, label: "Overall Compliance Score", target: "90% Min Threshold", changeType: "warning" },
  },
  complianceDonutData: [
    { name: "Compliant & Verified", value: 418, fill: "#10b981" }, // emerald-500
    { name: "Non-Functional / Damaged", value: 24, fill: "#f59e0b" }, // amber-500
    { name: "Missing from Premises", value: 38, fill: "#ef4444" }, // red-500
    { name: "Pending AI Verification", value: 12, fill: "#06b6d4" }, // cyan-500
  ],
  attendanceComparisonData: [
    { centre: "Jaipur", submitted: 180, detected: 176, mismatch: 4 },
    { centre: "Pune", submitted: 240, detected: 234, mismatch: 6 },
    { centre: "Lucknow", submitted: 130, detected: 88, mismatch: 42 },
    { centre: "Bhopal", submitted: 150, detected: 148, mismatch: 2 },
    { centre: "Ranchi", submitted: 95, detected: 79, mismatch: 16 },
    { centre: "Bengaluru", submitted: 310, detected: 308, mismatch: 2 },
    { centre: "Patna", submitted: 130, detected: 78, mismatch: 52 },
    { centre: "Ahmedabad", submitted: 210, detected: 201, mismatch: 9 },
  ],
  dailyTrends: [
    { date: "14 Oct", submitted: 1320, detected: 1285 },
    { date: "15 Oct", submitted: 1350, detected: 1310 },
    { date: "16 Oct", submitted: 1290, detected: 1240 },
    { date: "17 Oct", submitted: 1380, detected: 1325 },
    { date: "18 Oct", submitted: 1410, detected: 1340 },
    { date: "19 Oct", submitted: 1460, detected: 1295 },
    { date: "20 Oct (Today)", submitted: 1445, detected: 1262 },
  ],
  complianceHighlights: {
    topPerformer: { name: "Bharat Vikas Skill Centre (Bengaluru)", score: 98.4, status: "Compliant" },
    highestRisk: { name: "Surya Vocational Institute (Patna)", score: 61.8, status: "Critical" },
    activeCameras: "14 of 16 feeds online (87.5%)",
    avgAttendanceMismatch: "12.6% today across all centres",
  },
};
