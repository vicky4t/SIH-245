import { api, isMockMode } from "./api";
import { mockUsers } from "../mocks/usersData";

const delay = (ms = 150) => new Promise((resolve) => setTimeout(resolve, ms));

let localUsers = [...mockUsers];

export const userService = {
  async getUsers(params = {}) {
    if (isMockMode()) {
      await delay(150);
      let list = [...localUsers];

      if (params.role && params.role !== "all") {
        list = list.filter((u) => u.role.toLowerCase() === params.role.toLowerCase());
      }

      if (params.search) {
        const q = params.search.toLowerCase();
        list = list.filter(
          (u) =>
            u.name.toLowerCase().includes(q) ||
            u.email.toLowerCase().includes(q) ||
            u.department.toLowerCase().includes(q) ||
            u.stateJurisdiction.toLowerCase().includes(q)
        );
      }

      return {
        data: list,
        total: list.length,
      };
    }

    const res = await api.get("/users", { params });
    return res.data;
  },

  async createUser(userData) {
    if (isMockMode()) {
      await delay(250);
      const initials = userData.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
      const newUser = {
        id: `USR-${String(localUsers.length + 1).padStart(3, "0")}`,
        avatar: initials || "US",
        status: "Active",
        twoFactorEnabled: true,
        lastActive: "Just added",
        permissions: ["view_state", "export_data"],
        ...userData,
      };
      localUsers.unshift(newUser);
      return newUser;
    }

    const res = await api.post("/users", userData);
    return res.data;
  },

  async deleteUser(id) {
    if (isMockMode()) {
      await delay(200);
      localUsers = localUsers.filter((u) => u.id !== id);
      return { success: true };
    }
    const res = await api.delete(`/users/${id}`);
    return res.data;
  },
};
