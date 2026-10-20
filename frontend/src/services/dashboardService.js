import { api, isMockMode } from "./api";
import { mockDashboardSummary } from "../mocks/dashboardData";
import { mockDetectionEvents } from "../mocks/eventsData";
import { mockNotifications } from "../mocks/notificationsData";
import { mockCentres } from "../mocks/centresData";

// Simulated network latency for realistic demo UX
const delay = (ms = 250) => new Promise((resolve) => setTimeout(resolve, ms));

export const dashboardService = {
  async getDashboardSummary() {
    if (isMockMode()) {
      await delay(200);
      return {
        ...mockDashboardSummary,
        recentCentres: mockCentres.slice(0, 5),
        recentEvents: mockDetectionEvents.slice(0, 4),
        recentNotifications: mockNotifications.slice(0, 4),
      };
    }
    const res = await api.get("/dashboard/summary");
    return res.data;
  },

  async getAttendanceTrends(timeRange = "daily") {
    if (isMockMode()) {
      await delay(150);
      return mockDashboardSummary.dailyTrends;
    }
    const res = await api.get("/dashboard/attendance-trends", {
      params: { range: timeRange },
    });
    return res.data;
  },

  async getComplianceTrends() {
    if (isMockMode()) {
      await delay(150);
      return mockDashboardSummary.complianceDonutData;
    }
    const res = await api.get("/dashboard/compliance-trends");
    return res.data;
  },

  async getRecentEvents() {
    if (isMockMode()) {
      await delay(150);
      return mockDetectionEvents.slice(0, 5);
    }
    const res = await api.get("/events", { params: { limit: 5 } });
    return res.data;
  },
};
