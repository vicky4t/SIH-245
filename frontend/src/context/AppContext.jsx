import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { healthService } from "../services/healthService";
import { isMockMode, setRuntimeMockMode, getApiBaseUrl } from "../services/api";

const AppContext = createContext();

export function AppProvider({ children }) {
  const [mockMode, setMockModeState] = useState(() => isMockMode());
  const [healthStatus, setHealthStatus] = useState({
    status: "checking",
    healthy: true,
    isMock: true,
    message: "Initializing connection check...",
    baseUrl: getApiBaseUrl(),
  });
  const [isCheckingHealth, setIsCheckingHealth] = useState(false);
  const [globalDate, setGlobalDate] = useState("2026-10-20");
  const [globalSearch, setGlobalSearch] = useState("");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const checkHealth = useCallback(async () => {
    setIsCheckingHealth(true);
    try {
      const res = await healthService.checkHealth();
      setHealthStatus(res);
    } catch (err) {
      setHealthStatus({
        status: "unreachable",
        healthy: false,
        isMock: mockMode,
        message: err.message || "Failed to reach backend",
        baseUrl: getApiBaseUrl(),
      });
    } finally {
      setIsCheckingHealth(false);
    }
  }, [mockMode]);

  useEffect(() => {
    checkHealth();
  }, [checkHealth]);

  const toggleMockMode = (enableMock) => {
    setRuntimeMockMode(enableMock);
    setMockModeState(enableMock);
    // Reload or re-check
    setTimeout(() => {
      checkHealth();
    }, 100);
  };

  return (
    <AppContext.Provider
      value={{
        mockMode,
        toggleMockMode,
        healthStatus,
        checkHealth,
        isCheckingHealth,
        globalDate,
        setGlobalDate,
        globalSearch,
        setGlobalSearch,
        sidebarCollapsed,
        setSidebarCollapsed,
        mobileSidebarOpen,
        setMobileSidebarOpen,
        apiBaseUrl: getApiBaseUrl(),
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
