import { api, isMockMode } from "./api";
import {
  mockDailyAttendanceTrends,
  mockWeeklyAttendanceTrends,
  mockMonthlyAttendanceTrends,
  mockCentreAttendanceComparisons,
  mockHistoricalAttendanceRecords,
} from "../mocks/attendanceData";

const delay = (ms = 200) => new Promise((resolve) => setTimeout(resolve, ms));

export const attendanceService = {
  async getAttendanceSummary(params = {}) {
    if (isMockMode()) {
      await delay(200);
      return {
        todaySubmitted: 1445,
        todayDetected: 1262,
        todayDiscrepancy: 183,
        todayMismatchRate: 12.6,
        totalBatchesAudited: 24,
        criticalFlaggedCentres: 2,
      };
    }
    const res = await api.get("/attendance/summary", { params });
    return res.data;
  },

  async getAttendanceTrends(timeframe = "daily") {
    if (isMockMode()) {
      await delay(150);
      if (timeframe === "weekly") return mockWeeklyAttendanceTrends;
      if (timeframe === "monthly") return mockMonthlyAttendanceTrends;
      return mockDailyAttendanceTrends;
    }
    const res = await api.get("/attendance/trends", { params: { timeframe } });
    return res.data;
  },

  async getCentreComparisons() {
    if (isMockMode()) {
      await delay(150);
      return mockCentreAttendanceComparisons;
    }
    const res = await api.get("/attendance/centre-comparisons");
    return res.data;
  },

  async getHistoricalRecords(params = {}) {
    if (isMockMode()) {
      await delay(200);
      let list = [...mockHistoricalAttendanceRecords];

      if (params.centreId && params.centreId !== "all") {
        list = list.filter((r) => r.centreId === params.centreId);
      }

      if (params.date) {
        list = list.filter((r) => r.date === params.date);
      }

      if (params.auditStatus && params.auditStatus !== "all") {
        list = list.filter(
          (r) => r.auditStatus.toLowerCase() === params.auditStatus.toLowerCase()
        );
      }

      if (params.search) {
        const q = params.search.toLowerCase();
        list = list.filter(
          (r) =>
            r.centreName.toLowerCase().includes(q) ||
            r.batchName.toLowerCase().includes(q) ||
            r.notes.toLowerCase().includes(q)
        );
      }

      return {
        data: list,
        total: list.length,
      };
    }
    const res = await api.get("/attendance", { params });
    return res.data;
  },
};
