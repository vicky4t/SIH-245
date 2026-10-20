import { api, isMockMode } from "./api";
import { mockCameras } from "../mocks/camerasData";

const delay = (ms = 200) => new Promise((resolve) => setTimeout(resolve, ms));

let localCameras = [...mockCameras];

export const cameraService = {
  async getCameras(params = {}) {
    if (isMockMode()) {
      await delay(150);
      let list = [...localCameras];

      if (params.centreId && params.centreId !== "all") {
        list = list.filter((c) => c.centreId === params.centreId);
      }

      if (params.status && params.status !== "all") {
        list = list.filter((c) => c.status.toLowerCase() === params.status.toLowerCase());
      }

      if (params.search) {
        const q = params.search.toLowerCase();
        list = list.filter(
          (c) =>
            c.name.toLowerCase().includes(q) ||
            c.location.toLowerCase().includes(q) ||
            c.centreName.toLowerCase().includes(q)
        );
      }

      return {
        data: list,
        total: list.length,
        onlineCount: list.filter((c) => c.status === "Online").length,
        offlineCount: list.filter((c) => c.status === "Offline").length,
        warningCount: list.filter((c) => c.status === "Warning").length,
      };
    }

    const res = await api.get("/cameras", { params });
    return res.data;
  },

  async getCameraById(id) {
    if (isMockMode()) {
      await delay(100);
      const cam = localCameras.find((c) => c.id === id);
      if (!cam) throw new Error("Camera not found");
      return cam;
    }
    const res = await api.get(`/cameras/${id}`);
    return res.data;
  },

  async takeSnapshot(id) {
    if (isMockMode()) {
      await delay(300);
      const cam = localCameras.find((c) => c.id === id);
      return {
        success: true,
        cameraId: id,
        timestamp: new Date().toISOString(),
        snapshotUrl: null, // Frontend will render the simulated captured frame canvas
        resolution: cam?.resolution || "1920x1080",
        message: "CCTV snapshot captured and cryptographically timestamped for audit.",
      };
    }
    const res = await api.post(`/cameras/${id}/snapshot`);
    return res.data;
  },
};
