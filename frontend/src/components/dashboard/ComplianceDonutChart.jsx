import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

export function ComplianceDonutChart({ data = [] }) {
  const total = data.reduce((acc, curr) => acc + curr.value, 0);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const item = payload[0];
      const pct = total ? ((item.value / total) * 100).toFixed(1) : 0;
      return (
        <div className="rounded-2xl bg-white border border-slate-200 p-3.5 shadow-xl text-xs sm:text-sm font-sans">
          <p className="font-bold text-slate-900 mb-1.5">{item.name}</p>
          <div className="flex items-center gap-2">
            <span
              className="w-3 h-3 rounded-full shrink-0"
              style={{ backgroundColor: item.payload.fill }}
            />
            <span className="text-slate-600 font-medium">
              {item.value} items ({pct}%)
            </span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-72 sm:h-80 min-w-0 font-sans">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={65}
            outerRadius={95}
            paddingAngle={4}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} stroke="transparent" />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            verticalAlign="bottom"
            iconType="circle"
            wrapperStyle={{
              paddingTop: "16px",
              fontSize: "13px",
              color: "#334155",
              fontFamily: "'Poppins', sans-serif",
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
