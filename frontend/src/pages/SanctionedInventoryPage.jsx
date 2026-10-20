import React, { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Boxes,
  Search,
  Filter,
  QrCode,
  FileText,
  Building2,
  Download,
  Camera,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import { inventoryService } from "../services/inventoryService";
import { centreService } from "../services/centreService";
import { StatusBadge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { EvidencePreviewModal } from "../components/modals/EvidencePreviewModal";
import { TableSkeleton } from "../components/ui/Skeleton";
import { ErrorState } from "../components/ui/ErrorState";
import { EmptyState } from "../components/ui/EmptyState";
import { exportToCsv } from "../utils/exportCsv";
import { formatDate } from "../utils/formatters";

export function SanctionedInventoryPage() {
  const [searchParams] = useSearchParams();
  const initialCentreId = searchParams.get("centreId");

  const [items, setItems] = useState([]);
  const [centres, setCentres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [search, setSearch] = useState("");
  const [selectedCentre, setSelectedCentre] = useState(initialCentreId || "all");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Evidence modal
  const [activeEvidenceItem, setActiveEvidenceItem] = useState(null);

  const fetchInventory = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [itemsRes, centreRes] = await Promise.all([
        inventoryService.getInventoryItems({
          centreId: selectedCentre,
          category: selectedCategory,
          search,
        }),
        centreService.getCentres(),
      ]);
      setItems(itemsRes.data);
      setCentres(centreRes.data);
    } catch (err) {
      setError(err.message || "Failed to load sanctioned inventory");
    } finally {
      setLoading(false);
    }
  }, [selectedCentre, selectedCategory, search]);

  useEffect(() => {
    fetchInventory();
  }, [fetchInventory]);

  const handleExportCsv = () => {
    exportToCsv("sanctioned_inventory_register", items, [
      { key: "id", label: "Inventory Tag" },
      { key: "itemName", label: "Equipment Name" },
      { key: "category", label: "Asset Category" },
      { key: "modelSpec", label: "Technical Specifications" },
      { key: "sanctionRef", label: "Sanction Order Ref" },
      { key: "centreName", label: "Centre Location" },
      { key: "location", label: "Room / Floor" },
      { key: "serialNumber", label: "Serial Number" },
      { key: "qrTag", label: "QR / Barcode" },
      { key: "sanctionedQty", label: "Sanctioned Units" },
      { key: "detectedQty", label: "Detected Units" },
      { key: "status", label: "Compliance Status" },
      { key: "condition", label: "Operational State" },
      { key: "lastVerified", label: "Last Verified" },
      { key: "aiConfidence", label: "AI Match Score" },
    ]);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Boxes className="w-5 h-5 text-blue-600" />
            Sanctioned Equipment Inventory Register
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Detailed asset register with technical specs, official sanction orders, serial tags, and QR barcodes
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            icon={Download}
            onClick={handleExportCsv}
          >
            Export Register CSV
          </Button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="w-full md:w-72">
          <Input
            placeholder="Search serial, QR, item, specs..."
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
        </div>
      </div>

      {/* Itemized Inventory Table */}
      {loading ? (
        <TableSkeleton rows={5} cols={7} />
      ) : error ? (
        <ErrorState message={error} onRetry={fetchInventory} />
      ) : items.length === 0 ? (
        <EmptyState
          title="No sanctioned inventory found"
          description="Try broadening your search or centre selection."
          actionLabel="Reset Filters"
          onAction={() => {
            setSearch("");
            setSelectedCentre("all");
            setSelectedCategory("all");
          }}
        />
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">
              Itemized Asset Ledger ({items.length} Sanctioned Records)
            </h3>
            <span className="text-[11px] text-slate-500">
              Tamper-evident QR Barcode registry synced to AI inference pipeline
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="py-3 px-4">Item & Specifications</th>
                  <th className="py-3 px-4">Sanction Order Ref</th>
                  <th className="py-3 px-4">Serial & QR Tag</th>
                  <th className="py-3 px-4">Centre & Location</th>
                  <th className="py-3 px-4 text-center">Sanctioned / Detected</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Evidence</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {items.map((it) => (
                  <tr
                    key={it.id}
                    className="hover:bg-slate-50/80 transition-colors group"
                  >
                    <td className="py-3.5 px-4 max-w-xs">
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                          {it.itemName}
                        </span>
                        <span className="text-[11px] text-slate-500 leading-relaxed">
                          {it.modelSpec}
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-700 font-mono">
                      <span className="text-blue-600 font-semibold">
                        {it.sanctionRef}
                      </span>
                      <span className="block text-[10px] text-slate-500 font-sans">
                        {it.category}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-700">
                      <div className="flex items-center gap-1.5">
                        <QrCode className="w-3.5 h-3.5 text-blue-600" />
                        <span className="text-slate-900 font-semibold">{it.qrTag}</span>
                      </div>
                      <span className="text-[10px] text-slate-500 block">
                        SN: {it.serialNumber}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-700">
                      <div className="font-semibold text-slate-900">{it.centreName}</div>
                      <div className="text-[11px] text-slate-500">{it.location}</div>
                    </td>
                    <td className="py-3.5 px-4 text-center font-mono">
                      <span className="text-sm font-bold text-slate-900">
                        {it.detectedQty} / {it.sanctionedQty}
                      </span>
                      {it.detectedQty < it.sanctionedQty && (
                        <div className="text-[10px] text-red-600 font-bold">
                          Deficit: -{it.sanctionedQty - it.detectedQty}
                        </div>
                      )}
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
                        Proof
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
