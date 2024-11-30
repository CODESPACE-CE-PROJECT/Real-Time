import { api } from "./api.service";

export const userService = {
  profile: async (token: string) => {
    try {
      const response = await api.get("/user/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      throw new Error("Can't get user profile.");
    }
  },

  updateStatusActive: async (token: string, isActive: boolean, ipAddress: string) => {
    try {
      await api.patch("/user/realtime", {
        isActive: isActive,
        ipAddress: ipAddress
      }, {
        headers: { Authorization: `Bearer ${token}` },
      })
    } catch (error) {
      throw new Error("Can Not Update Status Acitive User")
    }
  }
};
