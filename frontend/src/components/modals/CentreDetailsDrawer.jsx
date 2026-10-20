import React from "react";
import { Link } from "react-router-dom";
import {
  X,
  Building,
  MapPin,
  Phone,
  Mail,
  User,
  Video,
  Users,
  ShieldCheck,
  Calendar,
  Layers,
  ArrowRight,
  ExternalLink,
} from "lucide-react";
import { StatusBadge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { formatDate } from "../../utils/formatters";

export function CentreDetailsDrawer({ isOpen, centre, onClose, onEdit }) {
  if (!isOpen || !centre) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white border-l border-slate-200 shadow-2xl flex flex-col p-6 overflow-y-auto animate-in slide-in-from-right duration-300">
          {/* Header */}
          <div className="flex items-start justify-between pb-4 border-b border-slate-100 mb-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
                <Building className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 leading-tight">
                  {centre.name}
                </h3>
                <span className="text-xs font-mono text-blue-600 font-semibold">
                  {centre.code} · {centre.id}
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[11px] text-slate-500 font-medium">Compliance</span>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span
                  className={`text-xl font-bold font-mono ${
                    centre.complianceScore >= 90
                      ? "text-emerald-600"
                      : centre.complianceScore >= 75
                      ? "text-amber-600"
                      : "text-red-600"
                  }`}
                >
                  {centre.complianceScore}%
                </span>
                <StatusBadge status={centre.status} />
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[11px] text-slate-500 font-medium">CCTV Health</span>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-xl font-bold font-mono text-blue-600">
                  {centre.camerasOnline}/{centre.camerasTotal}
                </span>
                <span className="text-[11px] text-slate-500">Online</span>
              </div>
            </div>
          </div>

          {/* Body Info */}
          <div className="space-y-5 text-xs text-slate-600">
            <div>
              <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                Location & Governance
              </h4>
              <div className="space-y-2 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-slate-800">
                      {centre.district}, {centre.state}
                    </p>
                    <p className="text-slate-500 text-[11px] mt-0.5">{centre.address}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 pt-2 border-t border-slate-200">
                  <Layers className="w-4 h-4 text-slate-400" />
                  <span>Scheme: <strong className="text-slate-800">{centre.scheme}</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  <span>Last Audited: <span className="text-slate-800 font-medium">{formatDate(centre.lastAudited)}</span></span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                Nodal Contact Officer
              </h4>
              <div className="space-y-2 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-slate-400" />
                  <span className="font-semibold text-slate-800">{centre.nodalOfficer}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-blue-600" />
                  <a
                    href={`mailto:${centre.contactEmail}`}
                    className="text-blue-600 hover:underline font-medium"
                  >
                    {centre.contactEmail}
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-slate-400" />
                  <span className="text-slate-700 font-medium">{centre.contactPhone}</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                Sanctioned Training Trades
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {centre.courses?.map((c, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded-md bg-slate-100 border border-slate-200 text-slate-700 font-medium"
                  >
                    {c}
                  </span>
                ))}
              </div>
            </div>

            {/* Quick Actions / Jump to Routes */}
            <div className="pt-2 space-y-2">
              <Link
                to={`/cameras?centreId=${centre.id}`}
                onClick={onClose}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-blue-50/80 border border-blue-200 text-blue-700 hover:bg-blue-100 transition-colors font-medium"
              >
                <div className="flex items-center gap-2">
                  <Video className="w-4 h-4 text-blue-600" />
                  <span>View Live CCTV Cameras</span>
                </div>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                to={`/attendance?centreId=${centre.id}`}
                onClick={onClose}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100 transition-colors font-medium"
              >
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-emerald-600" />
                  <span>Attendance Discrepancy Logs</span>
                </div>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                to={`/inventory?centreId=${centre.id}`}
                onClick={onClose}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100 transition-colors font-medium"
              >
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-blue-600" />
                  <span>Sanctioned Equipment Inventory</span>
                </div>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-auto pt-6 border-t border-slate-200 flex items-center justify-end gap-3">
            <Button variant="secondary" onClick={onClose}>
              Close
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                onClose();
                onEdit(centre);
              }}
            >
              Edit Centre
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
