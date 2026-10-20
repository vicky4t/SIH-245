import { api, isMockMode } from "./api";
import { mockDetectionEvents } from "../mocks/eventsData";

const delay = (ms = 200) => new Promise((resolve) => setTimeout(resolve, ms));

let localEvents = [...mockDetectionEvents];

export const eventService = {
  async getEvents(params = {}) {
    if (isMockMode()) {
      await delay(180);
      let list = [...localEvents];

      if (params.severity && params.severity !== "all") {
        list = list.filter((e) => e.severity.toLowerCase() === params.severity.toLowerCase());
      }

      if (params.type && params.type !== "all") {
        list = list.filter((e) => e.type.toLowerCase() === params.type.toLowerCase());
      }

      if (params.reviewStatus && params.reviewStatus !== "all") {
        list = list.filter(
          (e) => e.reviewStatus.toLowerCase() === params.reviewStatus.toLowerCase()
        );
      }

      if (params.centreId && params.centreId !== "all") {
        list = list.filter((e) => e.centreId === params.centreId);
      }

      if (params.search) {
        const q = params.search.toLowerCase();
        list = list.filter(
          (e) =>
            e.description.toLowerCase().includes(q) ||
            e.centreName.toLowerCase().includes(q) ||
            e.location.toLowerCase().includes(q) ||
            e.id.toLowerCase().includes(q)
        );
      }

      return {
        data: list,
        total: list.length,
        criticalCount: list.filter((e) => e.severity === "Critical").length,
        warningCount: list.filter((e) => e.severity === "Warning").length,
        pendingReviewCount: list.filter((e) => e.reviewStatus === "Pending").length,
      };
    }

    const res = await api.get("/events", { params });
    return res.data;
  },

  async getEventById(id) {
    if (isMockMode()) {
      await delay(100);
      const evt = localEvents.find((e) => e.id === id);
      if (!evt) throw new Error("Event not found");
      return evt;
    }
    const res = await api.get(`/events/${id}`);
    return res.data;
  },

  async updateReviewStatus(id, newStatus, investigationNotes) {
    if (isMockMode()) {
      await delay(250);
      const idx = localEvents.findIndex((e) => e.id === id);
      if (idx !== -1) {
        localEvents[idx] = {
          ...localEvents[idx],
          reviewStatus: newStatus,
          investigationNotes: investigationNotes !== undefined ? investigationNotes : localEvents[idx].investigationNotes,
        };
        return localEvents[idx];
      }
      throw new Error("Event not found");
    }
    const res = await api.patch(`/events/${id}/status`, {
      reviewStatus: newStatus,
      investigationNotes,
    });
    return res.data;
  },
};
