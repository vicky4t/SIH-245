import React from "react";
import { useForm } from "react-hook-form";
import { X, Building, Plus } from "lucide-react";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Select } from "../ui/Select";

export function AddCentreModal({ isOpen, onClose, onSubmit, isSubmitting }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      scheme: "PMKVY 4.0",
      state: "Rajasthan",
      district: "",
      address: "",
      nodalOfficer: "",
      contactEmail: "",
      contactPhone: "",
      sanctionedCapacity: 120,
      traineesEnrolled: 60,
      camerasTotal: 6,
      courses: "Solar Panel Technician, Electrician",
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
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-2xl p-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
              <Building className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Register New Training Centre
              </h3>
              <p className="text-xs text-slate-500">
                Enroll a sanctioned vocational facility for AI CCTV compliance monitoring
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

        {/* Form */}
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <Input
                label="Centre Name *"
                placeholder="e.g. National Vocational Academy"
                error={errors.name?.message}
                {...register("name", {
                  required: "Centre name is required",
                  minLength: { value: 3, message: "Min 3 characters" },
                })}
              />
            </div>

            <Select
              label="Skill Scheme *"
              {...register("scheme", { required: true })}
            >
              <option value="PMKVY 4.0">PMKVY 4.0</option>
              <option value="DDU-GKY">DDU-GKY</option>
              <option value="State Skill Mission">State Skill Mission</option>
              <option value="Special Central Project">Special Central Project</option>
            </Select>

            <Input
              label="State *"
              placeholder="e.g. Maharashtra"
              error={errors.state?.message}
              {...register("state", { required: "State is required" })}
            />

            <Input
              label="District *"
              placeholder="e.g. Pune"
              error={errors.district?.message}
              {...register("district", { required: "District is required" })}
            />

            <Input
              label="Nodal Officer Name *"
              placeholder="e.g. Sunita Deshmukh"
              error={errors.nodalOfficer?.message}
              {...register("nodalOfficer", { required: "Officer name is required" })}
            />

            <Input
              label="Contact Email *"
              type="email"
              placeholder="officer@skills.gov.in"
              error={errors.contactEmail?.message}
              {...register("contactEmail", {
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address",
                },
              })}
            />

            <Input
              label="Contact Phone *"
              placeholder="+91 98765 43210"
              error={errors.contactPhone?.message}
              {...register("contactPhone", { required: "Phone is required" })}
            />

            <div className="sm:col-span-2">
              <Input
                label="Complete Physical Address *"
                placeholder="Plot / Sector / Area / Pin Code"
                error={errors.address?.message}
                {...register("address", { required: "Address is required" })}
              />
            </div>

            <Input
              label="Sanctioned Seat Capacity"
              type="number"
              error={errors.sanctionedCapacity?.message}
              {...register("sanctionedCapacity", {
                min: { value: 10, message: "Min 10 seats" },
              })}
            />

            <Input
              label="CCTV Cameras Installed"
              type="number"
              error={errors.camerasTotal?.message}
              {...register("camerasTotal", {
                min: { value: 1, message: "Min 1 camera" },
              })}
            />

            <div className="sm:col-span-2">
              <Input
                label="Courses Offered (comma separated)"
                placeholder="Solar Tech, Electrician, Data Entry"
                {...register("courses")}
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
            <Button variant="secondary" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              loading={isSubmitting}
              icon={Plus}
            >
              Add Centre
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
