import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

export function AttendanceTrendChart({ data = [] }) {
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const submitted = payload.find((p) => p.dataKey === "submitted")?.value || 0;
      const detected = payload.find((p) => p.dataKey === "detected")?.value || 0;
      const diff = Math.abs(submitted - detected);

      return (
        <div className="rounded-2xl bg-white border border-slate-200 p-4 shadow-xl text-xs sm:text-sm space-y-2 min-w-[220px] font-sans">
          <p className="font-bold text-slate-900 border-b border-slate-100 pb-1.5">{label}</p>
          <div className="flex items-center justify-between gap-4 text-blue-600 font-medium">
            <span>Submitted Count:</span>
            <span className="font-bold text-slate-900">{submitted}</span>
          </div>
          <div className="flex items-center justify-between gap-4 text-cyan-600 font-medium">
            <span>AI Detected Count:</span>
            <span className="font-bold text-slate-900">{detected}</span>
          </div>
          <div className="pt-1.5 mt-1 border-t border-slate-100 flex items-center justify-between gap-4 font-semibold">
            <span className={diff > 80 ? "text-red-600" : "text-slate-500"}>
              Divergence:
            </span>
            <span
              className={
                diff > 80
                  ? "text-red-600 font-bold px-2 py-0.5 rounded-full bg-red-50"
                  : "text-emerald-600 font-bold px-2 py-0.5 rounded-full bg-emerald-50"
              }
            >
              {diff} trainees
            </span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-80 sm:h-96 min-w-0 font-sans">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 20, right: 15, left: -15, bottom: 10 }}
        >
          <defs>
            <linearGradient id="colorSubmittedLight" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#2563EB" stopOpacity={0.25} />
              <stop offset="95%" stopColor="#2563EB" stopOpacity={0.02} />
            </linearGradient>
            <linearGradient id="colorDetectedLight" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.25} />
              <stop offset="95%" stopColor="#06B6D4" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
          <XAxis
            dataKey="date"
            stroke="#64748B"
            fontSize={12}
            tickLine={false}
            fontFamily="'Poppins', sans-serif"
          />
          <YAxis
            stroke="#64748B"
            fontSize={12}
            tickLine={false}
            fontFamily="'Poppins', sans-serif"
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            verticalAlign="top"
            align="right"
            wrapperStyle={{
              paddingBottom: "16px",
              fontSize: "13px",
              fontFamily: "'Poppins', sans-serif",
            }}
          />
          <Area
            type="monotone"
            dataKey="submitted"
            name="Biometric Submitted"
            stroke="#2563EB"
            strokeWidth={2.5}
            fillOpacity={1}
            fill="url(#colorSubmittedLight)"
          />
          <Area
            type="monotone"
            dataKey="detected"
            name="AI Headcount Detected"
            stroke="#06B6D4"
            strokeWidth={2.5}
            fillOpacity={1}
            fill="url(#colorDetectedLight)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
