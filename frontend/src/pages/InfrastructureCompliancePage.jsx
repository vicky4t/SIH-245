import React, { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import {
  ShieldCheck,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  PackageX,
  Clock,
  Eye,
  Camera,
  Layers,
  Download,
  Building2,
} from "lucide-react";
import { inventoryService } from "../services/inventoryService";
import { centreService } from "../services/centreService";
import { StatusBadge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { EvidencePreviewModal } from "../components/modals/EvidencePreviewModal";
import { TableSkeleton, CardSkeleton } from "../components/ui/Skeleton";
import { ErrorState } from "../components/ui/ErrorState";
import { EmptyState } from "../components/ui/EmptyState";
import { exportToCsv } from "../utils/exportCsv";
import { formatDate } from "../utils/formatters";

export function InfrastructureCompliancePage() {
  const [searchParams] = useSearchParams();
  const initialCentreId = searchParams.get("centreId");

  const [summary, setSummary] = useState(null);
  const [items, setItems] = useState([]);
  const [centres, setCentres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedCentre, setSelectedCentre] = useState(initialCentreId || "all");
  const [search, setSearch] = useState("");

  // Modal
  const [activeEvidenceItem, setActiveEvidenceItem] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [sumRes, itemsRes, centreRes] = await Promise.all([
        inventoryService.getInventorySummary(),
        inventoryService.getInventoryItems({
          category: selectedCategory,
          status: selectedStatus,
          centreId: selectedCentre,
          search,
        }),
        centreService.getCentres(),
      ]);
      setSummary(sumRes);
      setItems(itemsRes.data);
      setCentres(centreRes.data);
    } catch (err) {
      setError(err.message || "Failed to load infrastructure data");
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, selectedStatus, selectedCentre, search]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleExportCsv = () => {
    exportToCsv("infrastructure_compliance_inventory", items, [
      { key: "id", label: "Asset ID" },
      { key: "itemName", label: "Item Name" },
      { key: "category", label: "Category" },
      { key: "centreName", label: "Centre Name" },
      { key: "sanctionRef", label: "Sanction Reference" },
      { key: "sanctionedQty", label: "Sanctioned Qty" },
      { key: "detectedQty", label: "Detected Qty" },
      { key: "status", label: "Compliance Status" },
      { key: "aiConfidence", label: "AI Confidence" },
      { key: "qrTag", label: "QR / Barcode Tag" },
      { key: "location", label: "Room / Location" },
      { key: "notes", label: "AI Inspection Findings" },
    ]);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-blue-600" />
            Infrastructure Compliance & Asset Verification
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Automated visual verification of mandated lab equipment, fire safety devices, and AEBAS terminals
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            icon={Download}
            onClick={handleExportCsv}
          >
            Export Compliance Audit
          </Button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      {summary && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5">
          <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs">
            <span className="text-xs text-slate-500 font-semibold uppercase">
              Sanctioned Assets
            </span>
            <p className="text-2xl font-mono font-bold text-slate-900 mt-1">
              {summary.sanctionedTotal}
            </p>
            <span className="text-[11px] text-blue-600 font-medium font-mono">Mandated Equipment</span>
          </div>

          <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs">
            <span className="text-xs text-slate-500 font-semibold uppercase">
              Detected & Functional
            </span>
            <p className="text-2xl font-mono font-bold text-emerald-600 mt-1">
              {summary.detectedFunctional}
            </p>
            <span className="text-[11px] text-emerald-600 font-medium font-mono">Operational in CCTV</span>
          </div>

          <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs">
            <span className="text-xs text-slate-500 font-semibold uppercase">
              Missing from Premises
            </span>
            <p className="text-2xl font-mono font-bold text-red-600 mt-1">
              {summary.missingCount}
            </p>
            <span className="text-[11px] text-red-600 font-medium font-mono">Show-Cause Triggered</span>
          </div>

          <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs">
            <span className="text-xs text-slate-500 font-semibold uppercase">
              Non-Functional / Defect
            </span>
            <p className="text-2xl font-mono font-bold text-amber-600 mt-1">
              {summary.nonFunctionalCount}
            </p>
            <span className="text-[11px] text-amber-600 font-medium font-mono">Maintenance Required</span>
          </div>

          <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs col-span-2 lg:col-span-1">
            <span className="text-xs text-slate-500 font-semibold uppercase">
              Overall Compliance
            </span>
            <p className="text-2xl font-mono font-bold text-blue-600 mt-1">
              {summary.overallComplianceScore}%
            </p>
            <span className="text-[11px] text-slate-500 font-mono">
              {summary.pendingVerification} Pending Audit
            </span>
          </div>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="w-full md:w-72">
          <Input
            placeholder="Search equipment, sanction order, QR..."
            icon={Search}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="w-full md:w-auto flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-600 font-semibold uppercase">Centre:</span>
            <select
              value={selectedCentre}
              onChange={(e) => setSelectedCentre(e.target.value)}
              className="bg-white border border-slate-300 text-xs text-slate-800 rounded-lg px-3 py-1.5 focus:outline-none focus:border-blue-600 max-w-[180px] truncate"
            >
              <option value="all">All Centres</option>
              {centres.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-600 font-semibold uppercase">Category:</span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-white border border-slate-300 text-xs text-slate-800 rounded-lg px-3 py-1.5 focus:outline-none focus:border-blue-600 max-w-[200px] truncate"
            >
              <option value="all">All Categories</option>
              <option value="IT Hardware & Workstations">IT Hardware & Workstations</option>
              <option value="Classroom AV & Interactive">Classroom AV & Interactive</option>
              <option value="Biometric Terminals (AEBAS)">Biometric Terminals (AEBAS)</option>
              <option value="Safety & Fire Protection">Safety & Fire Protection</option>
              <option value="Power & Online UPS Backup">Power & Online UPS Backup</option>
              <option value="Domain Machine & Toolkits">Domain Machine & Toolkits</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-600 font-semibold uppercase">Status:</span>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-white border border-slate-300 text-xs text-slate-800 rounded-lg px-3 py-1.5 focus:outline-none focus:border-blue-600"
            >
              <option value="all">All Statuses</option>
              <option value="Compliant">Compliant</option>
              <option value="Missing Equipment">Missing Equipment</option>
              <option value="Non-Functional">Non-Functional</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <TableSkeleton rows={5} cols={7} />
      ) : error ? (
        <ErrorState message={error} onRetry={fetchData} />
      ) : items.length === 0 ? (
        <EmptyState
          title="No infrastructure items found"
          description="Adjust your search query or reset filters."
          actionLabel="Clear Filters"
          onAction={() => {
            setSearch("");
            setSelectedCategory("all");
            setSelectedStatus("all");
            setSelectedCentre("all");
          }}
        />
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">
              Monitored Equipment Inventory ({items.length} Assets)
            </h3>
            <span className="text-[11px] text-slate-500">
              Live AI vision cross-checked against Sanction Orders
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="py-3 px-4">Equipment / Model</th>
                  <th className="py-3 px-4">Category & Sanction Ref</th>
                  <th className="py-3 px-4">Location & QR</th>
                  <th className="py-3 px-4 text-center">Sanctioned vs Detected</th>
                  <th className="py-3 px-4 text-center">AI Confidence</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Evidence Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {items.map((it) => (
                  <tr
                    key={it.id}
                    className="hover:bg-slate-50/80 transition-colors group"
                  >
                    <td className="py-3.5 px-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                          {it.itemName}
                        </span>
                        <span className="text-[11px] text-slate-500 font-mono">
                          {it.modelSpec}
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-700">
                      <div>{it.category}</div>
                      <div className="text-[11px] font-mono text-blue-600 font-semibold">
                        {it.sanctionRef}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-700">
                      <div>{it.location}</div>
                      <div className="text-[10px] font-mono text-slate-400">
                        {it.qrTag} · {it.centreName}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-center font-mono">
                      <span className="text-slate-900 font-semibold">
                        {it.detectedQty} / {it.sanctionedQty}
                      </span>
                      {it.detectedQty < it.sanctionedQty && (
                        <div className="text-[10px] text-red-600 font-bold">
                          -{it.sanctionedQty - it.detectedQty} Missing
                        </div>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-center font-mono">
                      <span className="text-blue-600 font-bold">
                        {it.aiConfidence}%
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <StatusBadge status={it.status} />
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Button
                        variant="secondary"
                        size="sm"
                        icon={Camera}
                        onClick={() => setActiveEvidenceItem(it)}
                      >
                        Inspect Proof
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Evidence Preview Modal */}
      <EvidencePreviewModal
        isOpen={!!activeEvidenceItem}
        item={activeEvidenceItem}
        onClose={() => setActiveEvidenceItem(null)}
      />
    </div>
  );
}
