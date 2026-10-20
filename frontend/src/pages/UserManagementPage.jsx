import React, { useState, useEffect, useCallback } from "react";
import {
  UserCheck,
  UserPlus,
  Search,
  Filter,
  Shield,
  Trash2,
  Lock,
  Building2,
  CheckCircle2,
  KeyRound,
} from "lucide-react";
import { userService } from "../services/userService";
import { StatusBadge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { AddUserModal } from "../components/modals/AddUserModal";
import { TableSkeleton } from "../components/ui/Skeleton";
import { ErrorState } from "../components/ui/ErrorState";
import { EmptyState } from "../components/ui/EmptyState";

export function UserManagementPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [search, setSearch] = useState("");
  const [selectedRole, setSelectedRole] = useState("all");

  // Modal
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await userService.getUsers({
        role: selectedRole,
        search,
      });
      setUsers(res.data);
    } catch (err) {
      setError(err.message || "Failed to load audit personnel directory");
    } finally {
      setLoading(false);
    }
  }, [selectedRole, search]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleAddUser = async (data) => {
    setIsSubmitting(true);
    try {
      await userService.createUser(data);
      await fetchUsers();
    } catch (err) {
      alert("Failed to add user: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteUser = async (id) => {
    if (confirm("Revoke audit access for this personnel?")) {
      await userService.deleteUser(id);
      await fetchUsers();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-blue-600" />
            Compliance Personnel & User Access Control
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Role-based access permissions for Central Auditors, State Nodal Officers, and Centre Admins
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="primary"
            size="sm"
            icon={UserPlus}
            onClick={() => setIsAddOpen(true)}
          >
            Authorize Personnel
          </Button>
        </div>
      </div>

      {/* Permissions Matrix Info Banner */}
      <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 shrink-0">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-slate-900">
              Role-Based Multi-Tier Governance
            </h4>
            <p className="text-slate-600 mt-0.5">
              Central Auditors hold sovereign surveillance rights; State Nodal Officers review state-scoped batch discrepancies.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 font-mono text-[11px] text-blue-700 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-200 font-semibold">
          <KeyRound className="w-3.5 h-3.5" />
          <span>RBAC Enforcement Active</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="w-full sm:w-72">
          <Input
            placeholder="Search auditor name, email, department..."
            icon={Search}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="w-full sm:w-auto flex items-center gap-3">
          <span className="text-xs text-slate-600 font-semibold uppercase">Role:</span>
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="bg-white border border-slate-300 text-xs text-slate-800 rounded-lg px-3 py-1.5 focus:outline-none focus:border-blue-600"
          >
            <option value="all">All Roles</option>
            <option value="National Super Admin">National Super Admin</option>
            <option value="State Nodal Officer">State Nodal Officer</option>
            <option value="Central Compliance Auditor">Central Compliance Auditor</option>
            <option value="Centre Administrator">Centre Administrator</option>
            <option value="AI Model Quality Inspector">AI Model Quality Inspector</option>
          </select>
        </div>
      </div>

      {/* User Table */}
      {loading ? (
        <TableSkeleton rows={5} cols={6} />
      ) : error ? (
        <ErrorState message={error} onRetry={fetchUsers} />
      ) : users.length === 0 ? (
        <EmptyState
          title="No personnel found"
          description="Try clearing your search or role filter."
          actionLabel="Reset Filters"
          onAction={() => {
            setSearch("");
            setSelectedRole("all");
          }}
        />
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="py-3 px-4">User / Avatar</th>
                  <th className="py-3 px-4">Role & Authority</th>
                  <th className="py-3 px-4">Department & Jurisdiction</th>
                  <th className="py-3 px-4">Assigned Facilities</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {users.map((u) => (
                  <tr
                    key={u.id}
                    className="hover:bg-slate-50/80 transition-colors group"
                  >
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white text-xs shrink-0 shadow-xs">
                          {u.avatar || u.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                            {u.name}
                          </span>
                          <span className="text-[11px] text-slate-500 truncate">
                            {u.email}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-blue-600 block">
                        {u.role}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">
                        {u.twoFactorEnabled ? "2FA Enabled" : "Standard Auth"}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-700">
                      <div>{u.department}</div>
                      <div className="text-[11px] text-slate-500">
                        Jurisdiction: <strong className="text-slate-800">{u.stateJurisdiction}</strong>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-700">
                      <span className="text-slate-900 font-medium">
                        {u.centresAssigned}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <StatusBadge status={u.status} />
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleDeleteUser(u.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                        title="Revoke Personnel Access"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add User Modal */}
      <AddUserModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onSubmit={handleAddUser}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
