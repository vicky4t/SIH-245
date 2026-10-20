import React from "react";
import { useForm } from "react-hook-form";
import { X, UserPlus } from "lucide-react";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Select } from "../ui/Select";

export function AddUserModal({ isOpen, onClose, onSubmit, isSubmitting }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      role: "Central Compliance Auditor",
      department: "Directorate General of Training",
      stateJurisdiction: "Rajasthan",
      centresAssigned: "Apex Skill Development Centre",
    },
  });

  if (!isOpen) return null;

  const handleFormSubmit = async (data) => {
    await onSubmit(data);
    reset();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-200 bg-white shadow-2xl p-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Authorize Audit Personnel
              </h3>
              <p className="text-xs text-slate-500">
                Grant compliance monitoring role & state jurisdiction
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <Input
            label="Full Name *"
            placeholder="e.g. Vikramaditya Rathore"
            error={errors.name?.message}
            {...register("name", { required: "Name is required" })}
          />

          <Input
            label="Official Gov Email *"
            type="email"
            placeholder="v.rathore@skills.gov.in"
            error={errors.email?.message}
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Invalid email",
              },
            })}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select label="Role / Authority" {...register("role")}>
              <option value="State Nodal Officer">State Nodal Officer</option>
              <option value="Central Compliance Auditor">Central Compliance Auditor</option>
              <option value="Centre Administrator">Centre Administrator</option>
              <option value="AI Model Quality Inspector">AI Model Quality Inspector</option>
            </Select>

            <Input
              label="State Jurisdiction *"
              placeholder="e.g. Maharashtra"
              error={errors.stateJurisdiction?.message}
              {...register("stateJurisdiction", { required: "Jurisdiction is required" })}
            />
          </div>

          <Input
            label="Department / Ministry"
            placeholder="e.g. Ministry of Skill Development & Entrepreneurship"
            {...register("department")}
          />

          <Input
            label="Assigned Centres"
            placeholder="e.g. All Centres or Specific Centre Name"
            {...register("centresAssigned")}
          />

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
            <Button variant="secondary" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              loading={isSubmitting}
              icon={UserPlus}
            >
              Add User
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
