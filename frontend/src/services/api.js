import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

export const api = axios.create({
  baseURL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor to attach auth tokens in the future
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("auth_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor for uniform error formatting
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      "An unexpected error occurred while communicating with the server.";
    return Promise.reject(new Error(message));
  }
);

/**
 * Check if the application is currently running in mock / demo mode.
 * Defaults to environment variable VITE_USE_MOCK_DATA.
 * Allows override via localStorage for demo/testing convenience.
 */
export function isMockMode() {
  const localOverride = localStorage.getItem("compliance_use_mock_data");
  if (localOverride !== null) {
    return localOverride === "true";
  }
  return import.meta.env.VITE_USE_MOCK_DATA === "true" || import.meta.env.VITE_USE_MOCK_DATA === true;
}

export function setRuntimeMockMode(enableMock) {
  localStorage.setItem("compliance_use_mock_data", String(enableMock));
}

export function resetMockModeOverride() {
  localStorage.removeItem("compliance_use_mock_data");
}

export function getApiBaseUrl() {
  return baseURL;
}
