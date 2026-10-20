import { api, isMockMode } from "./api";
import { mockCentres } from "../mocks/centresData";
import { mockHistoricalAttendanceRecords } from "../mocks/attendanceData";
import { mockInventoryItems } from "../mocks/inventoryData";
import { mockDetectionEvents } from "../mocks/eventsData";

const delay = (ms = 200) => new Promise((resolve) => setTimeout(resolve, ms));

export const reportService = {
  async getComplianceReports(filters = {}) {
    if (isMockMode()) {
      await delay(200);
      return {
        generatedAt: new Date().toISOString(),
        reportingPeriod: filters.period || "October 2026",
        totalCentresAudited: mockCentres.length,
        avgComplianceScore: (
          mockCentres.reduce((sum, c) => sum + c.complianceScore, 0) / mockCentres.length
        ).toFixed(1),
        centresSummary: mockCentres.map((c) => ({
          centreId: c.id,
          name: c.name,
          state: c.state,
          score: c.complianceScore,
          status: c.status,
          attendanceDiscrepancy: c.status === "Compliant" ? "Low (<5%)" : "High (>15%)",
          cameraUptime: `${Math.round((c.camerasOnline / c.camerasTotal) * 100)}%`,
        })),
        attendanceDiscrepancyLogs: mockHistoricalAttendanceRecords,
        infrastructureDeficits: mockInventoryItems.filter((i) => i.status !== "Compliant"),
        criticalEventsCount: mockDetectionEvents.filter((e) => e.severity === "Critical").length,
      };
    }

    const res = await api.get("/reports/compliance", { params: filters });
    return res.data;
  },
};
