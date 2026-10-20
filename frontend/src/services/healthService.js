import { api, isMockMode, getApiBaseUrl } from "./api";

/**
 * Health check service to probe backend API availability.
 */
export const healthService = {
  async checkHealth() {
    const mock = isMockMode();

    if (mock) {
      // Return simulated health response in demo mode
      return {
        status: "demo",
        healthy: true,
        isMock: true,
        message: "Running in Demonstration Mode (Local Mock Service)",
        timestamp: new Date().toISOString(),
        version: "v1.0.0-frontend",
        baseUrl: getApiBaseUrl(),
      };
    }

    try {
      const response = await api.get("/health", { timeout: 5000 });
      return {
        status: "connected",
        healthy: true,
        isMock: false,
        message: "Backend REST API Connected",
        data: response.data,
        timestamp: new Date().toISOString(),
        baseUrl: getApiBaseUrl(),
      };
    } catch (error) {
      return {
        status: "unreachable",
        healthy: false,
        isMock: false,
        message: `Backend Unreachable at ${getApiBaseUrl()}: ${error.message}`,
        error: error.message,
        timestamp: new Date().toISOString(),
        baseUrl: getApiBaseUrl(),
      };
    }
  },

  /**
   * Explicitly ping the configured backend even if mock mode is currently enabled
   */
  async probeLiveBackend() {
    try {
      const response = await api.get("/health", { timeout: 4000 });
      return {
        success: true,
        status: 200,
        message: "Backend responded successfully",
        data: response.data,
      };
    } catch (err) {
      return {
        success: false,
        status: err.response?.status || 0,
        message: err.message || "Failed to reach backend",
      };
    }
  },
};
