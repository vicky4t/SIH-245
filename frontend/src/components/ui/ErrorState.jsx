import React from "react";
import { AlertTriangle, RefreshCw, ToggleLeft } from "lucide-react";
import { Button } from "./Button";
import { useApp } from "../../context/AppContext";

export function ErrorState({
  title = "Failed to load data",
  message = "An error occurred while connecting to the backend service.",
  onRetry,
  className,
}) {
  const { mockMode, toggleMockMode } = useApp();

  return (
    <div
      className={`flex flex-col items-center justify-center p-8 text-center rounded-xl border border-red-200 bg-red-50/60 ${
        className || ""
      }`}
    >
      <div className="w-12 h-12 rounded-xl bg-red-100 border border-red-200 flex items-center justify-center text-red-600 mb-3.5 shadow-xs">
        <AlertTriangle className="w-6 h-6 animate-pulse" />
      </div>
      <h3 className="text-base font-bold text-slate-900 mb-1">{title}</h3>
      <p className="text-xs text-slate-600 max-w-md mb-5 leading-relaxed font-mono">
        {message}
      </p>
      <div className="flex flex-wrap items-center justify-center gap-2.5">
        {onRetry && (
          <Button
            variant="secondary"
            size="sm"
            icon={RefreshCw}
            onClick={onRetry}
          >
            Retry Connection
          </Button>
        )}
        {!mockMode && (
          <Button
            variant="primary"
            size="sm"
            icon={ToggleLeft}
            onClick={() => toggleMockMode(true)}
          >
            Switch to Demo Mode
          </Button>
        )}
      </div>
    </div>
  );
}
