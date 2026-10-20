import React from "react";
import { useLocation, Link } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";

const routeNames = {
  "/": "Overview Dashboard",
  "/centres": "Training Centres",
  "/cameras": "Live CCTV Monitoring",
  "/attendance": "Attendance Analytics",
  "/infrastructure": "Infrastructure Compliance",
  "/events": "AI Detection Events",
  "/reports": "Evidence & Reports",
  "/alerts": "Alerts & Notifications",
  "/inventory": "Sanctioned Inventory",
  "/users": "User Management",
  "/settings": "Settings & Config",
};

export function Breadcrumbs() {
  const location = useLocation();
  const currentPath = location.pathname;
  const pageTitle = routeNames[currentPath] || "Compliance Dashboard";

  return (
    <div className="flex flex-col min-w-0">
      <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-medium mb-0.5">
        <Link
          to="/"
          className="flex items-center gap-1 hover:text-blue-600 transition-colors"
        >
          <Home className="w-3.5 h-3.5" />
          <span>Home</span>
        </Link>
        {currentPath !== "/" && (
          <>
            <ChevronRight className="w-3 h-3 text-slate-400 shrink-0" />
            <span className="text-slate-700 font-semibold truncate">{pageTitle}</span>
          </>
        )}
      </div>
      <h1 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight leading-tight truncate">
        {pageTitle}
      </h1>
    </div>
  );
}
