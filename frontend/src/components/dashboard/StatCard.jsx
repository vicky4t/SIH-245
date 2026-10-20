import React from "react";
import { cn } from "../../utils/cn";
import { ArrowUpRight, ArrowDownRight, Minus } from "lucide-react";

export function StatCard({
  title,
  value,
  subtext,
  change,
  changeType = "neutral", // "positive" | "negative" | "warning" | "neutral"
  icon: Icon,
  variant = "blue", // "blue" | "emerald" | "amber" | "red" | "cyan"
  className,
}) {
  const variantStyles = {
    blue: {
      border: "hover:border-blue-300",
      iconBg: "bg-blue-50 text-blue-600 border border-blue-100",
      accent: "text-blue-600",
      trendBg: "bg-blue-50 text-blue-700 border-blue-200",
    },
    cyan: {
      border: "hover:border-cyan-300",
      iconBg: "bg-cyan-50 text-cyan-600 border border-cyan-100",
      accent: "text-cyan-600",
      trendBg: "bg-cyan-50 text-cyan-700 border-cyan-200",
    },
    emerald: {
      border: "hover:border-emerald-300",
      iconBg: "bg-emerald-50 text-emerald-600 border border-emerald-100",
      accent: "text-emerald-600",
      trendBg: "bg-emerald-50 text-emerald-700 border-emerald-200",
    },
    amber: {
      border: "hover:border-amber-300",
      iconBg: "bg-amber-50 text-amber-600 border border-amber-100",
      accent: "text-amber-600",
      trendBg: "bg-amber-50 text-amber-700 border-amber-200",
    },
    red: {
      border: "hover:border-red-300",
      iconBg: "bg-red-50 text-red-600 border border-red-100",
      accent: "text-red-600",
      trendBg: "bg-red-50 text-red-700 border-red-200",
    },
  };

  const v = variantStyles[variant] || variantStyles.blue;

  return (
    <div
      className={cn(
        "bg-white relative overflow-hidden rounded-2xl p-6 sm:p-7 border border-slate-200 transition-all duration-200 shadow-xs hover:shadow-md hover:-translate-y-0.5 flex flex-col justify-between",
        v.border,
        className
      )}
    >
      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          <span className="text-xs sm:text-[13px] font-semibold text-slate-500 uppercase tracking-wider truncate">
            {title}
          </span>
          {Icon && (
            <div
              className={cn(
                "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-2xs transition-transform duration-200 group-hover:scale-105",
                v.iconBg
              )}
            >
              <Icon className="w-6 h-6" />
            </div>
          )}
        </div>

        <div className="flex items-baseline gap-2 mb-2">
          <h3 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 font-sans">
            {value}
          </h3>
        </div>
      </div>

      <div className="flex items-center justify-between text-xs sm:text-sm text-slate-500 gap-2 pt-2 border-t border-slate-100 mt-2">
        {subtext && <span className="truncate">{subtext}</span>}
        {change && (
          <div
            className={cn(
              "inline-flex items-center gap-1 font-bold shrink-0 text-xs px-2 py-0.5 rounded-full border",
              changeType === "positive" && "bg-emerald-50 text-emerald-700 border-emerald-200",
              changeType === "negative" && "bg-red-50 text-red-700 border-red-200",
              changeType === "warning" && "bg-amber-50 text-amber-700 border-amber-200",
              changeType === "neutral" && "bg-slate-50 text-slate-600 border-slate-200"
            )}
          >
            {changeType === "positive" && <ArrowUpRight className="w-3.5 h-3.5" />}
            {changeType === "negative" && <ArrowDownRight className="w-3.5 h-3.5" />}
            {changeType === "neutral" && <Minus className="w-3.5 h-3.5" />}
            <span>{change}</span>
          </div>
        )}
      </div>
    </div>
  );
}
