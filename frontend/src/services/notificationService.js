import { api, isMockMode } from "./api";
import { mockNotifications } from "../mocks/notificationsData";

const delay = (ms = 150) => new Promise((resolve) => setTimeout(resolve, ms));

let localNotifications = [...mockNotifications];

export const notificationService = {
  async getNotifications() {
    if (isMockMode()) {
      await delay(150);
      const unreadCount = localNotifications.filter((n) => !n.read).length;
      return {
        data: [...localNotifications],
        unreadCount,
        total: localNotifications.length,
      };
    }
    const res = await api.get("/notifications");
    return res.data;
  },

  async markAsRead(id) {
    if (isMockMode()) {
      await delay(100);
      localNotifications = localNotifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      );
      return { success: true };
    }
    const res = await api.patch(`/notifications/${id}/read`);
    return res.data;
  },

  async markAllAsRead() {
    if (isMockMode()) {
      await delay(100);
      localNotifications = localNotifications.map((n) => ({ ...n, read: true }));
      return { success: true };
    }
    const res = await api.post("/notifications/mark-all-read");
    return res.data;
  },

  async clearAll() {
    if (isMockMode()) {
      await delay(100);
      localNotifications = [];
      return { success: true };
    }
    const res = await api.delete("/notifications");
    return res.data;
  },
};
