import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Search,
  Calendar,
  Bell,
  Sun,
  Moon,
  Server,
  Wifi,
  WifiOff,
  User,
  ShieldAlert,
  CheckCircle2,
  ExternalLink,
  RefreshCw,
  Sliders,
  Menu,
  Activity,
} from "lucide-react";
import { Breadcrumbs } from "./Breadcrumbs";
import { useApp } from "../../context/AppContext";
import { useNotifications } from "../../context/NotificationContext";
import { useTheme } from "../../context/ThemeContext";
import { formatTime } from "../../utils/formatters";

export function TopNav() {
  const {
    mockMode,
    toggleMockMode,
    healthStatus,
    checkHealth,
    isCheckingHealth,
    globalDate,
    setGlobalDate,
    globalSearch,
    setGlobalSearch,
    setMobileSidebarOpen,
  } = useApp();

  const { notifications, unreadCount, markAsRead, markAllAsRead } =
    useNotifications();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const notifRef = useRef(null);
  const profileRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-30 h-[74px] border-b border-slate-200 bg-white px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-3 shadow-2xs">
      {/* Left: Mobile Hamburger & Breadcrumbs */}
      <div className="flex items-center gap-3 sm:gap-4 min-w-0">
        <button
          onClick={() => setMobileSidebarOpen(true)}
          className="lg:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 transition-colors shrink-0"
          title="Open Menu"
          aria-label="Open sidebar menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <Breadcrumbs />

        <div className="hidden 2xl:flex items-center gap-2 px-3 py-1 rounded-full bg-slate-50 border border-slate-200 text-xs font-medium text-slate-600">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-semibold text-slate-800">SkillVision AI</span>
          <span>· Nationwide Monitoring Active</span>
        </div>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Global Search Input */}
        <div className="relative hidden md:block w-52 lg:w-72 xl:w-80">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search centres, CCTV feeds, alerts..."
            value={globalSearch}
            onChange={(e) => setGlobalSearch(e.target.value)}
            className="w-full pl-10 pr-9 py-2 text-xs sm:text-[13px] rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-colors"
          />
          {globalSearch ? (
            <button
              onClick={() => setGlobalSearch("")}
              className="absolute right-3 top-2.5 text-xs text-slate-400 hover:text-slate-700"
            >
              ✕
            </button>
          ) : (
            <span className="absolute right-2.5 top-2.5 hidden lg:inline-block px-1.5 py-0.5 rounded text-[10px] font-mono font-medium text-slate-400 bg-white border border-slate-200">
              ⌘K
            </span>
          )}
        </div>

        {/* Global Date Filter */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700">
          <Calendar className="w-4 h-4 text-blue-600 shrink-0" />
          <select
            value={globalDate}
            onChange={(e) => setGlobalDate(e.target.value)}
            className="bg-transparent border-none text-slate-700 text-xs focus:outline-none cursor-pointer font-medium"
          >
            <option value="2026-10-20">Today (20 Oct 2026)</option>
            <option value="2026-10-19">Yesterday (19 Oct 2026)</option>
            <option value="2026-10-18">18 Oct 2026</option>
            <option value="all">All Dates</option>
          </select>
        </div>

        {/* Backend Connection Status Badge */}
        <div className="flex items-center">
          {mockMode ? (
            <div
              className="group relative flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200 cursor-pointer shadow-2xs hover:bg-amber-100/70 transition-colors"
              onClick={() => navigate("/settings")}
              title="Click to view Backend API settings"
            >
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              <span className="hidden sm:inline">Demo Mode</span>
              <span className="text-[10px] text-amber-600/80 font-mono">(Mock)</span>
            </div>
          ) : healthStatus.healthy ? (
            <div
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-2xs"
              title={`Connected to ${healthStatus.baseUrl}`}
            >
              <Wifi className="w-3.5 h-3.5 text-emerald-600" />
              <span className="hidden sm:inline">API Connected</span>
            </div>
          ) : (
            <button
              onClick={checkHealth}
              disabled={isCheckingHealth}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 transition-colors shadow-2xs"
              title={`Backend unreachable at ${healthStatus.baseUrl}. Click to retry.`}
            >
              <WifiOff className="w-3.5 h-3.5 text-red-600" />
              <span className="hidden sm:inline">API Offline</span>
              <RefreshCw
                className={`w-3 h-3 ${isCheckingHealth ? "animate-spin" : ""}`}
              />
            </button>
          )}
        </div>

        {/* Theme Toggle (Dark/Light) */}
        <button
          onClick={toggleTheme}
          className="p-2.5 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 transition-colors"
          title={`Switch to ${theme === "dark" ? "Light" : "Dark"} Mode`}
          aria-label="Toggle theme"
        >
          {theme === "dark" ? (
            <Sun className="w-4 h-4 text-amber-500" />
          ) : (
            <Moon className="w-4 h-4 text-slate-600" />
          )}
        </button>

        {/* Notifications Dropdown */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2.5 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 transition-colors"
            title="Notifications"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white shadow-xs ring-2 ring-white">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2.5 w-80 sm:w-96 rounded-2xl border border-slate-200 bg-white shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Compliance Alerts
                  </h4>
                  {unreadCount > 0 && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] bg-red-50 text-red-700 font-bold border border-red-200">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-xs text-blue-600 hover:underline font-semibold"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                {notifications.length === 0 ? (
                  <div className="p-6 text-center text-xs text-slate-500">
                    No active alerts. All training centres compliant.
                  </div>
                ) : (
                  notifications.slice(0, 5).map((n) => (
                    <div
                      key={n.id}
                      onClick={() => {
                        markAsRead(n.id);
                        if (n.targetRoute) navigate(n.targetRoute);
                        setShowNotifications(false);
                      }}
                      className={`p-3.5 text-xs cursor-pointer transition-colors hover:bg-slate-50 flex items-start gap-3 ${
                        !n.read ? "bg-blue-50/40" : ""
                      }`}
                    >
                      <div className="mt-0.5 shrink-0">
                        {n.severity === "critical" ? (
                          <ShieldAlert className="w-4 h-4 text-red-600" />
                        ) : n.severity === "warning" ? (
                          <ShieldAlert className="w-4 h-4 text-amber-600" />
                        ) : (
                          <CheckCircle2 className="w-4 h-4 text-blue-600" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1 mb-1">
                          <p className="font-semibold text-slate-900 truncate">
                            {n.title}
                          </p>
                          <span className="text-[10px] text-slate-400 shrink-0 font-mono">
                            {formatTime(n.timestamp)}
                          </span>
                        </div>
                        <p className="text-slate-600 line-clamp-2 text-xs leading-relaxed">
                          {n.message}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="p-3 border-t border-slate-100 bg-slate-50 text-center">
                <Link
                  to="/alerts"
                  onClick={() => setShowNotifications(false)}
                  className="text-xs text-blue-600 font-semibold hover:underline inline-flex items-center gap-1.5"
                >
                  View All Notifications History
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-slate-100 border border-transparent hover:border-slate-200 transition-colors"
            aria-label="User account menu"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center text-white font-bold text-xs shadow-xs">
              AR
            </div>
            <div className="hidden xl:flex flex-col text-left">
              <span className="text-xs font-bold text-slate-900 leading-tight">
                Dr. Ananya Roy
              </span>
              <span className="text-[10px] text-slate-500 font-medium">
                National Super Admin
              </span>
            </div>
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2.5 w-68 rounded-2xl border border-slate-200 bg-white shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="p-4 border-b border-slate-100 bg-slate-50/60">
                <p className="text-sm font-bold text-slate-900">Dr. Ananya Roy</p>
                <p className="text-xs text-blue-600 font-medium">ananya.roy@compliance.gov.in</p>
                <p className="text-[11px] text-slate-500 mt-1">
                  Directorate General of Training (DGT)
                </p>
              </div>

              <div className="p-2 space-y-1 text-xs">
                <button
                  onClick={() => {
                    toggleMockMode(!mockMode);
                    setShowProfileMenu(false);
                  }}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-slate-700 hover:bg-slate-50 text-left transition-colors font-medium"
                >
                  <span className="flex items-center gap-2.5">
                    <Server className="w-4 h-4 text-blue-600" />
                    <span>Demo Mode (Mock Data)</span>
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      mockMode
                        ? "bg-amber-100 text-amber-800"
                        : "bg-emerald-100 text-emerald-800"
                    }`}
                  >
                    {mockMode ? "ON" : "OFF"}
                  </span>
                </button>

                <Link
                  to="/settings"
                  onClick={() => setShowProfileMenu(false)}
                  className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-slate-700 hover:bg-slate-50 transition-colors font-medium"
                >
                  <Sliders className="w-4 h-4 text-slate-500" />
                  <span>Backend & AI Settings</span>
                </Link>

                <Link
                  to="/users"
                  onClick={() => setShowProfileMenu(false)}
                  className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-slate-700 hover:bg-slate-50 transition-colors font-medium"
                >
                  <User className="w-4 h-4 text-slate-500" />
                  <span>Auditor Team Directory</span>
                </Link>
              </div>

              <div className="p-3 border-t border-slate-100 bg-slate-50/80">
                <div className="px-1 text-[11px] text-slate-500 flex items-center justify-between">
                  <span>SkillVision AI v2.4</span>
                  <span className="text-blue-600 font-medium">Production</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
