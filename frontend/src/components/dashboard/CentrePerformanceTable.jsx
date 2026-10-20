import React from "react";
import { Link } from "react-router-dom";
import { StatusBadge } from "../ui/Badge";
import { ChevronRight, Video, Users } from "lucide-react";

export function CentrePerformanceTable({ centres = [] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-xs sm:text-sm min-w-[720px] font-sans">
        <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold text-xs">
          <tr>
            <th className="py-4 px-5">Centre / Code</th>
            <th className="py-4 px-5">Location</th>
            <th className="py-4 px-5 text-center">Trainees</th>
            <th className="py-4 px-5 text-center">Cameras</th>
            <th className="py-4 px-5 text-right">Compliance Score</th>
            <th className="py-4 px-5 text-center">Status</th>
            <th className="py-4 px-5 text-right">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
          {centres.map((c) => (
            <tr
              key={c.id}
              className="hover:bg-slate-50 transition-colors group"
            >
              <td className="py-4 px-5">
                <div className="flex flex-col">
                  <span className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors text-sm sm:text-base">
                    {c.name}
                  </span>
                  <span className="text-xs text-slate-500 font-mono">
                    {c.code} · {c.scheme}
                  </span>
                </div>
              </td>
              <td className="py-4 px-5 text-slate-600">
                <span>{c.district}, {c.state}</span>
              </td>
              <td className="py-4 px-5 text-center">
                <span className="inline-flex items-center gap-1.5 font-medium text-slate-700">
                  <Users className="w-4 h-4 text-slate-400" />
                  {c.traineesEnrolled}
                </span>
              </td>
              <td className="py-4 px-5 text-center">
                <span className="inline-flex items-center gap-1.5 text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200 font-bold text-xs">
                  <Video className="w-3.5 h-3.5" />
                  {c.camerasOnline}/{c.camerasTotal}
                </span>
              </td>
              <td className="py-4 px-5 text-right">
                <span
                  className={`font-bold text-sm sm:text-base ${
                    c.complianceScore >= 90
                      ? "text-emerald-600"
                      : c.complianceScore >= 75
                      ? "text-amber-600"
                      : "text-red-600"
                  }`}
                >
                  {c.complianceScore.toFixed(1)}%
                </span>
              </td>
              <td className="py-4 px-5 text-center">
                <StatusBadge status={c.status} />
              </td>
              <td className="py-4 px-5 text-right">
                <Link
                  to={`/centres?centreId=${c.id}`}
                  className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 hover:underline font-semibold"
                >
                  Inspect
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
