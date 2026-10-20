import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

export function AttendanceComparisonChart({ data = [] }) {
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const submitted = payload.find((p) => p.dataKey === "submitted")?.value || 0;
      const detected = payload.find((p) => p.dataKey === "detected")?.value || 0;
      const diff = Math.abs(submitted - detected);
      const mismatch = submitted > 0 ? ((diff / submitted) * 100).toFixed(1) : 0;

      return (
        <div className="rounded-2xl bg-white border border-slate-200 p-4 shadow-xl text-xs sm:text-sm space-y-2 min-w-[220px] font-sans">
          <p className="font-bold text-slate-900 border-b border-slate-100 pb-1.5">
            {label} Centre
          </p>
          <div className="flex items-center justify-between gap-4 text-blue-600 font-medium">
            <span>Biometric Claimed:</span>
            <span className="font-bold text-slate-900">{submitted}</span>
          </div>
          <div className="flex items-center justify-between gap-4 text-emerald-600 font-medium">
            <span>AI CCTV Detected:</span>
            <span className="font-bold text-slate-900">{detected}</span>
          </div>
          <div className="pt-1.5 mt-1 border-t border-slate-100 flex items-center justify-between gap-4 font-semibold">
            <span className={diff > 10 ? "text-red-600" : "text-slate-500"}>
              Discrepancy:
            </span>
            <span
              className={
                diff > 10
                  ? "text-red-600 font-bold px-2 py-0.5 rounded-full bg-red-50"
                  : "text-emerald-600 font-bold px-2 py-0.5 rounded-full bg-emerald-50"
              }
            >
              {diff} ({mismatch}%)
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
        <BarChart
          data={data}
          margin={{ top: 20, right: 15, left: -15, bottom: 30 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
          <XAxis
            dataKey="centre"
            stroke="#64748B"
            fontSize={12}
            tickLine={false}
            interval={0}
            angle={-15}
            textAnchor="end"
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
          <Bar
            dataKey="submitted"
            name="Biometric Submitted"
            fill="#2563EB"
            radius={[6, 6, 0, 0]}
          />
          <Bar
            dataKey="detected"
            name="AI Camera Detected"
            fill="#06B6D4"
            radius={[6, 6, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
