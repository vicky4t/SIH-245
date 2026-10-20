import React, { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Building2,
  Plus,
  Search,
  ArrowUpDown,
  Video,
  Users,
  Eye,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Download,
} from "lucide-react";
import { centreService } from "../services/centreService";
import { StatusBadge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { AddCentreModal } from "../components/modals/AddCentreModal";
import { EditCentreModal } from "../components/modals/EditCentreModal";
import { CentreDetailsDrawer } from "../components/modals/CentreDetailsDrawer";
import { TableSkeleton } from "../components/ui/Skeleton";
import { EmptyState } from "../components/ui/EmptyState";
import { ErrorState } from "../components/ui/ErrorState";
import { exportToCsv } from "../utils/exportCsv";

export function TrainingCentresPage() {
  const [searchParams] = useSearchParams();
  const initialCentreId = searchParams.get("centreId");

  const [centres, setCentres] = useState([]);
  const [states, setStates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters & Sorting state
  const [search, setSearch] = useState("");
  const [selectedState, setSelectedState] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [sortBy, setSortBy] = useState("complianceScore");
  const [sortOrder, setSortOrder] = useState("desc");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  // Modals state
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [activeCentre, setActiveCentre] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchCentres = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await centreService.getCentres({
        search,
        state: selectedState,
        status: selectedStatus,
        sortBy,
        order: sortOrder,
      });
      setCentres(res.data);
      if (res.states) setStates(res.states);

      if (initialCentreId && !activeCentre) {
        const found = res.data.find((c) => c.id === initialCentreId);
        if (found) {
          setActiveCentre(found);
          setIsDrawerOpen(true);
        }
      }
    } catch (err) {
      setError(err.message || "Failed to load training centres");
    } finally {
      setLoading(false);
    }
  }, [search, selectedState, selectedStatus, sortBy, sortOrder, initialCentreId]);

  useEffect(() => {
    fetchCentres();
  }, [fetchCentres]);

  const handleAddCentre = async (data) => {
    setIsSubmitting(true);
    try {
      await centreService.createCentre(data);
      await fetchCentres();
    } catch (err) {
      alert("Error creating centre: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditCentre = async (id, data) => {
    setIsSubmitting(true);
    try {
      await centreService.updateCentre(id, data);
      await fetchCentres();
    } catch (err) {
      alert("Error updating centre: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteCentre = async (id) => {
    if (confirm("Are you sure you want to remove this centre from surveillance?")) {
      await centreService.deleteCentre(id);
      await fetchCentres();
    }
  };

  // Pagination calculations
  const totalPages = Math.ceil(centres.length / pageSize) || 1;
  const paginatedCentres = centres.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleExport = () => {
    exportToCsv("training_centres_audit", centres, [
      { key: "id", label: "Centre ID" },
      { key: "name", label: "Centre Name" },
      { key: "code", label: "Centre Code" },
      { key: "scheme", label: "Skill Scheme" },
      { key: "state", label: "State" },
      { key: "district", label: "District" },
      { key: "nodalOfficer", label: "Nodal Officer" },
      { key: "traineesEnrolled", label: "Trainees" },
      { key: "camerasOnline", label: "Online Cameras" },
      { key: "camerasTotal", label: "Total Cameras" },
      { key: "complianceScore", label: "Compliance Score" },
      { key: "status", label: "Audit Status" },
    ]);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Building2 className="w-5 h-5 text-blue-600" />
            Training Centre Management & Oversight
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Surveillance status, camera availability, and biometric compliance scores
          </p>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <Button
            variant="secondary"
            size="sm"
            icon={Download}
            onClick={handleExport}
          >
            Export Directory
          </Button>
          <Button
            variant="primary"
            size="sm"
            icon={Plus}
            onClick={() => setIsAddOpen(true)}
          >
            Register Centre
          </Button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-xl sm:rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="w-full md:w-72">
          <Input
            placeholder="Search centre, district, code..."
            icon={Search}
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>

        <div className="w-full md:w-auto flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-semibold uppercase">State:</span>
            <select
              value={selectedState}
              onChange={(e) => {
                setSelectedState(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-white border border-slate-300 text-xs text-slate-800 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-100 shadow-2xs"
            >
              <option value="all">All States</option>
              {states.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-semibold uppercase">Status:</span>
            <select
              value={selectedStatus}
              onChange={(e) => {
                setSelectedStatus(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-white border border-slate-300 text-xs text-slate-800 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-100 shadow-2xs"
            >
              <option value="all">All Statuses</option>
              <option value="Compliant">Compliant</option>
              <option value="Warning">Warning</option>
              <option value="Non-Compliant">Non-Compliant</option>
              <option value="Critical">Critical</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-semibold uppercase">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-white border border-slate-300 text-xs text-slate-800 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-100 shadow-2xs"
            >
              <option value="complianceScore">Compliance Score</option>
              <option value="name">Centre Name</option>
              <option value="traineesEnrolled">Trainees</option>
              <option value="camerasOnline">Active Cameras</option>
            </select>
            <button
              onClick={() => setSortOrder((o) => (o === "asc" ? "desc" : "asc"))}
              className="p-2 rounded-lg bg-white border border-slate-300 text-slate-600 hover:text-slate-900 shadow-2xs"
              title={`Sorting ${sortOrder.toUpperCase()}`}
            >
              <ArrowUpDown className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Table or Loading/Error */}
      {loading ? (
        <TableSkeleton rows={5} cols={7} />
      ) : error ? (
        <ErrorState message={error} onRetry={fetchCentres} />
      ) : centres.length === 0 ? (
        <EmptyState
          title="No training centres found"
          description="Try broadening your state or search filter, or register a new centre."
          actionLabel="Clear Filters"
          onAction={() => {
            setSearch("");
            setSelectedState("all");
            setSelectedStatus("all");
          }}
        />
      ) : (
        <div className="bg-white rounded-xl sm:rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs min-w-[700px]">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="py-3 px-4">Centre / Code</th>
                  <th className="py-3 px-4">State & District</th>
                  <th className="py-3 px-4">Nodal Contact</th>
                  <th className="py-3 px-4 text-center">Trainees</th>
                  <th className="py-3 px-4 text-center">CCTV Cameras</th>
                  <th className="py-3 px-4 text-right">Compliance Score</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {paginatedCentres.map((c) => (
                  <tr
                    key={c.id}
                    className="hover:bg-slate-50/80 transition-colors group"
                  >
                    <td className="py-3.5 px-4">
                      <div className="flex flex-col">
                        <span
                          onClick={() => {
                            setActiveCentre(c);
                            setIsDrawerOpen(true);
                          }}
                          className="font-bold text-slate-900 group-hover:text-blue-600 cursor-pointer transition-colors"
                        >
                          {c.name}
                        </span>
                        <span className="text-[11px] text-slate-500 font-mono">
                          {c.code} · <span className="text-blue-600 font-semibold">{c.scheme}</span>
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-700">
                      <div>{c.district}</div>
                      <div className="text-[11px] text-slate-500 font-medium">{c.state}</div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-700">
                      <div className="font-bold text-slate-900">{c.nodalOfficer}</div>
                      <div className="text-[11px] text-slate-500">{c.contactEmail}</div>
                    </td>
                    <td className="py-3.5 px-4 text-center font-mono">
                      <span className="inline-flex items-center gap-1 text-slate-800 font-medium">
                        <Users className="w-3.5 h-3.5 text-slate-400" />
                        {c.traineesEnrolled}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center font-mono">
                      <span className="inline-flex items-center gap-1 text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 font-bold">
                        <Video className="w-3.5 h-3.5" />
                        {c.camerasOnline} / {c.camerasTotal}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <span
                        className={`text-sm font-mono font-extrabold ${
                          c.complianceScore >= 90
                            ? "text-emerald-600"
                            : c.complianceScore >= 75
                            ? "text-amber-600"
                            : "text-red-600"
                        }`}
                      >
                        {c.complianceScore}%
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <StatusBadge status={c.status} />
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => {
                            setActiveCentre(c);
                            setIsDrawerOpen(true);
                          }}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-slate-100 transition-colors"
                          title="Inspect Centre Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setActiveCentre(c);
                            setIsEditOpen(true);
                          }}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-slate-100 transition-colors"
                          title="Edit Centre"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteCentre(c.id)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-red-600 hover:bg-slate-100 transition-colors"
                          title="Delete Centre"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          <div className="p-3.5 sm:p-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 bg-slate-50/50">
            <span>
              Showing {(currentPage - 1) * pageSize + 1} to{" "}
              {Math.min(currentPage * pageSize, centres.length)} of {centres.length}{" "}
              centres
            </span>
            <div className="flex items-center gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="p-1.5 rounded-lg border border-slate-200 bg-white disabled:opacity-40 hover:bg-slate-50 text-slate-700 shadow-2xs"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="font-mono font-medium text-slate-700">
                Page {currentPage} of {totalPages}
              </span>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="p-1.5 rounded-lg border border-slate-200 bg-white disabled:opacity-40 hover:bg-slate-50 text-slate-700 shadow-2xs"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modals and Drawer */}
      <AddCentreModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onSubmit={handleAddCentre}
        isSubmitting={isSubmitting}
      />

      <EditCentreModal
        isOpen={isEditOpen}
        centre={activeCentre}
        onClose={() => setIsEditOpen(false)}
        onSubmit={handleEditCentre}
        isSubmitting={isSubmitting}
      />

      <CentreDetailsDrawer
        isOpen={isDrawerOpen}
        centre={activeCentre}
        onClose={() => setIsDrawerOpen(false)}
        onEdit={(c) => {
          setActiveCentre(c);
          setIsEditOpen(true);
        }}
      />
    </div>
  );
}
