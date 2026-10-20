import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Building2,
  Video,
  UsersRound,
  ShieldCheck,
  Cpu,
  FileBarChart2,
  Bell,
  Boxes,
  UserCheck,
  Settings,
  ChevronLeft,
  ChevronRight,
  Radio,
  ScanEye,
  X,
} from "lucide-react";
import { useApp } from "../../context/AppContext";
import { useNotifications } from "../../context/NotificationContext";

export function Sidebar() {
  const {
    sidebarCollapsed,
    setSidebarCollapsed,
    mobileSidebarOpen,
    setMobileSidebarOpen,
  } = useApp();
  const { unreadCount } = useNotifications();
  const location = useLocation();

  const navigationSections = [
    {
      title: "Surveillance & AI",
      items: [
        {
          name: "Overview Dashboard",
          path: "/",
          icon: LayoutDashboard,
        },
        {
          name: "Training Centres",
          path: "/centres",
          icon: Building2,
          badge: "8",
          badgeColor: "bg-slate-100 text-slate-700 border border-slate-200",
        },
        {
          name: "Live CCTV Monitoring",
          path: "/cameras",
          icon: Video,
          badge: "LIVE",
          badgeColor: "bg-emerald-50 text-emerald-700 border border-emerald-200",
        },
        {
          name: "AI Detection Events",
          path: "/events",
          icon: Cpu,
          badge: "4 Alert",
          badgeColor: "bg-red-50 text-red-700 border border-red-200",
        },
      ],
    },
    {
      title: "Compliance & Audit",
      items: [
        {
          name: "Attendance Analytics",
          path: "/attendance",
          icon: UsersRound,
          badge: "Flag",
          badgeColor: "bg-amber-50 text-amber-700 border border-amber-200",
        },
        {
          name: "Infrastructure Compliance",
          path: "/infrastructure",
          icon: ShieldCheck,
          badge: "87%",
          badgeColor: "bg-blue-50 text-blue-700 border border-blue-200",
        },
        {
          name: "Evidence & Reports",
          path: "/reports",
          icon: FileBarChart2,
        },
        {
          name: "Sanctioned Inventory",
          path: "/inventory",
          icon: Boxes,
        },
      ],
    },
    {
      title: "Administration",
      items: [
        {
          name: "Alerts & Notifications",
          path: "/alerts",
          icon: Bell,
          badge: unreadCount > 0 ? `${unreadCount}` : null,
          badgeColor: "bg-red-500 text-white font-bold",
        },
        {
          name: "User Management",
          path: "/users",
          icon: UserCheck,
        },
        {
          name: "Settings & Config",
          path: "/settings",
          icon: Settings,
        },
      ],
    },
  ];

  const handleNavClick = () => {
    if (mobileSidebarOpen) {
      setMobileSidebarOpen(false);
    }
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 lg:hidden transition-opacity"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* Main Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-screen transition-all duration-300 ease-in-out border-r border-slate-200 bg-white flex flex-col shadow-xs ${
          sidebarCollapsed ? "w-20" : "w-[264px]"
        } ${
          mobileSidebarOpen
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Brand Header */}
        <div className="h-[74px] flex items-center justify-between px-4 sm:px-5 border-b border-slate-200 shrink-0 bg-white">
          <NavLink
            to="/"
            onClick={handleNavClick}
            className="flex items-center gap-3 overflow-hidden group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-500 flex items-center justify-center text-white shadow-sm shrink-0 transition-transform group-hover:scale-105">
              <ScanEye className="w-5.5 h-5.5 text-white" />
            </div>
            {(!sidebarCollapsed || mobileSidebarOpen) && (
              <div className="flex flex-col truncate">
                <span className="text-base font-bold tracking-tight text-slate-900 flex items-center gap-1.5">
                  SkillVision
                  <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded-md bg-gradient-to-r from-blue-600 to-cyan-600 text-white tracking-wider">
                    AI
                  </span>
                </span>
                <span className="text-[11px] text-slate-500 truncate font-medium">
                  Intelligent Compliance Monitor
                </span>
              </div>
            )}
          </NavLink>

          {/* Desktop Collapse / Mobile Close Button */}
          <div className="flex items-center">
            {/* Mobile close button */}
            <button
              onClick={() => setMobileSidebarOpen(false)}
              className="lg:hidden p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Desktop collapse toggle */}
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="hidden lg:flex p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors shrink-0"
              title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {sidebarCollapsed ? (
                <ChevronRight className="w-4 h-4" />
              ) : (
                <ChevronLeft className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* Navigation Sections */}
        <div className="flex-1 overflow-y-auto px-3.5 py-4 space-y-5">
          {navigationSections.map((section, idx) => (
            <div key={idx} className="space-y-1">
              {(!sidebarCollapsed || mobileSidebarOpen) ? (
                <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-3 mb-2">
                  {section.title}
                </div>
              ) : (
                <div className="flex justify-center mb-1 text-slate-300">
                  <span className="w-4 h-0.5 bg-slate-200 rounded-full" />
                </div>
              )}

              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive =
                  item.path === "/"
                    ? location.pathname === "/"
                    : location.pathname.startsWith(item.path);

                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={handleNavClick}
                    className={`group flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-[13px] font-medium transition-all duration-150 relative ${
                      isActive
                        ? "bg-blue-50 text-blue-700 font-semibold border-r-3 border-blue-600 shadow-2xs"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-50/80 border border-transparent"
                    }`}
                    title={
                      sidebarCollapsed && !mobileSidebarOpen
                        ? item.name
                        : undefined
                    }
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <Icon
                        className={`w-4.5 h-4.5 shrink-0 transition-transform duration-150 group-hover:scale-105 ${
                          isActive
                            ? "text-blue-600"
                            : "text-slate-400 group-hover:text-slate-600"
                        }`}
                      />
                      {(!sidebarCollapsed || mobileSidebarOpen) && (
                        <span className="truncate">{item.name}</span>
                      )}
                    </div>
                    {(!sidebarCollapsed || mobileSidebarOpen) && item.badge && (
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase tracking-wider shrink-0 ${
                          item.badgeColor || "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                    {sidebarCollapsed && !mobileSidebarOpen && item.badge && (
                      <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-blue-600 ring-2 ring-white" />
                    )}
                  </NavLink>
                );
              })}
            </div>
          ))}
        </div>

        {/* System AI Engine Heartbeat & User Profile */}
        <div className="p-3 border-t border-slate-200 bg-white space-y-2 shrink-0">
          {!sidebarCollapsed || mobileSidebarOpen ? (
            <>
              {/* Engine Status */}
              <div className="rounded-xl p-2.5 bg-slate-50 border border-slate-200/80">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1.5">
                    <Radio className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
                    <span className="text-[11px] font-semibold text-slate-900">
                      AI Edge Engine
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-700 font-bold bg-emerald-100/70 px-1.5 py-0.2 rounded">
                    ACTIVE
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium">
                  <span>YOLO-v8x Vision</span>
                  <span className="font-mono text-blue-600 font-bold">25 FPS</span>
                </div>
              </div>

              {/* User Profile */}
              <div className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-50/70 border border-slate-100">
                <div className="relative shrink-0">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-cyan-500 text-white font-bold text-xs flex items-center justify-center shadow-2xs">
                    RS
                  </div>
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-slate-900 truncate">
                    Dr. Rajesh Sharma
                  </p>
                  <p className="text-[10px] text-slate-500 truncate">
                    State Nodal Director
                  </p>
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center gap-2 py-1">
              <div
                className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-cyan-500 text-white font-bold text-xs flex items-center justify-center shadow-2xs"
                title="Dr. Rajesh Sharma (State Nodal Director)"
              >
                RS
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
