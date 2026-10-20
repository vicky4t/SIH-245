import { api, isMockMode } from "./api";
import { mockCentres } from "../mocks/centresData";

const delay = (ms = 250) => new Promise((resolve) => setTimeout(resolve, ms));

// In-memory store for demo session mutations
let localCentres = [...mockCentres];

export const centreService = {
  async getCentres(params = {}) {
    if (isMockMode()) {
      await delay(200);
      let filtered = [...localCentres];

      if (params.search) {
        const q = params.search.toLowerCase();
        filtered = filtered.filter(
          (c) =>
            c.name.toLowerCase().includes(q) ||
            c.code.toLowerCase().includes(q) ||
            c.district.toLowerCase().includes(q) ||
            c.state.toLowerCase().includes(q)
        );
      }

      if (params.state && params.state !== "all") {
        filtered = filtered.filter((c) => c.state === params.state);
      }

      if (params.status && params.status !== "all") {
        filtered = filtered.filter((c) => c.status.toLowerCase() === params.status.toLowerCase());
      }

      if (params.sortBy) {
        filtered.sort((a, b) => {
          let aVal = a[params.sortBy];
          let bVal = b[params.sortBy];
          if (typeof aVal === "string") {
            return params.order === "desc"
              ? bVal.localeCompare(aVal)
              : aVal.localeCompare(bVal);
          }
          return params.order === "desc" ? bVal - aVal : aVal - bVal;
        });
      }

      return {
        data: filtered,
        total: filtered.length,
        states: Array.from(new Set(localCentres.map((c) => c.state))),
        districts: Array.from(new Set(localCentres.map((c) => c.district))),
      };
    }

    const res = await api.get("/centres", { params });
    return res.data;
  },

  async getCentreById(id) {
    if (isMockMode()) {
      await delay(150);
      const centre = localCentres.find((c) => c.id === id);
      if (!centre) throw new Error("Training centre not found");
      return centre;
    }
    const res = await api.get(`/centres/${id}`);
    return res.data;
  },

  async createCentre(centreData) {
    if (isMockMode()) {
      await delay(300);
      const newCentre = {
        id: `TC-${centreData.state.slice(0, 3).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`,
        code: `CTC-${Math.floor(1000 + Math.random() * 9000)}`,
        complianceScore: 100.0,
        status: "Compliant",
        camerasOnline: Number(centreData.camerasTotal || 4),
        camerasTotal: Number(centreData.camerasTotal || 4),
        traineesEnrolled: Number(centreData.traineesEnrolled || 60),
        activeBatches: 2,
        lastAudited: new Date().toISOString(),
        aiStatus: "Active",
        courses: centreData.courses ? centreData.courses.split(",").map((s) => s.trim()) : ["Solar Technician"],
        ...centreData,
      };
      localCentres.unshift(newCentre);
      return newCentre;
    }
    const res = await api.post("/centres", centreData);
    return res.data;
  },

  async updateCentre(id, centreData) {
    if (isMockMode()) {
      await delay(300);
      const idx = localCentres.findIndex((c) => c.id === id);
      if (idx === -1) throw new Error("Training centre not found");
      localCentres[idx] = { ...localCentres[idx], ...centreData };
      return localCentres[idx];
    }
    const res = await api.put(`/centres/${id}`, centreData);
    return res.data;
  },

  async deleteCentre(id) {
    if (isMockMode()) {
      await delay(200);
      localCentres = localCentres.filter((c) => c.id !== id);
      return { success: true };
    }
    const res = await api.delete(`/centres/${id}`);
    return res.data;
  },
};
