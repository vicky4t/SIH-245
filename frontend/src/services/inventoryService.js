import { api, isMockMode } from "./api";
import { mockInventorySummary, mockInventoryItems } from "../mocks/inventoryData";

const delay = (ms = 200) => new Promise((resolve) => setTimeout(resolve, ms));

let localInventory = [...mockInventoryItems];

export const inventoryService = {
  async getInventorySummary() {
    if (isMockMode()) {
      await delay(150);
      return mockInventorySummary;
    }
    const res = await api.get("/inventory/summary");
    return res.data;
  },

  async getInventoryItems(params = {}) {
    if (isMockMode()) {
      await delay(200);
      let list = [...localInventory];

      if (params.centreId && params.centreId !== "all") {
        list = list.filter((i) => i.centreId === params.centreId);
      }

      if (params.category && params.category !== "all") {
        list = list.filter((i) => i.category === params.category);
      }

      if (params.status && params.status !== "all") {
        list = list.filter((i) => i.status.toLowerCase() === params.status.toLowerCase());
      }

      if (params.search) {
        const q = params.search.toLowerCase();
        list = list.filter(
          (i) =>
            i.itemName.toLowerCase().includes(q) ||
            i.centreName.toLowerCase().includes(q) ||
            i.sanctionRef.toLowerCase().includes(q) ||
            i.qrTag.toLowerCase().includes(q) ||
            i.serialNumber.toLowerCase().includes(q)
        );
      }

      return {
        data: list,
        total: list.length,
        categories: Array.from(new Set(localInventory.map((i) => i.category))),
      };
    }
    const res = await api.get("/inventory", { params });
    return res.data;
  },

  async getItemById(id) {
    if (isMockMode()) {
      await delay(100);
      const item = localInventory.find((i) => i.id === id);
      if (!item) throw new Error("Inventory item not found");
      return item;
    }
    const res = await api.get(`/inventory/${id}`);
    return res.data;
  },

  async updateItemStatus(id, newStatus, notes) {
    if (isMockMode()) {
      await delay(250);
      const idx = localInventory.findIndex((i) => i.id === id);
      if (idx !== -1) {
        localInventory[idx] = {
          ...localInventory[idx],
          status: newStatus,
          notes: notes || localInventory[idx].notes,
          lastVerified: new Date().toISOString(),
        };
        return localInventory[idx];
      }
      throw new Error("Item not found");
    }
    const res = await api.patch(`/inventory/${id}`, { status: newStatus, notes });
    return res.data;
  },
};
