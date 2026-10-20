import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { X, Edit3, Save } from "lucide-react";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Select } from "../ui/Select";

export function EditCentreModal({
  isOpen,
  centre,
  onClose,
  onSubmit,
  isSubmitting,
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (centre) {
      reset({
        name: centre.name || "",
        scheme: centre.scheme || "PMKVY 4.0",
        state: centre.state || "",
        district: centre.district || "",
        address: centre.address || "",
        nodalOfficer: centre.nodalOfficer || "",
        contactEmail: centre.contactEmail || "",
        contactPhone: centre.contactPhone || "",
        status: centre.status || "Compliant",
        traineesEnrolled: centre.traineesEnrolled || 0,
        camerasTotal: centre.camerasTotal || 0,
        camerasOnline: centre.camerasOnline || 0,
      });
    }
  }, [centre, reset]);

  if (!isOpen || !centre) return null;

  const handleFormSubmit = async (data) => {
    await onSubmit(centre.id, data);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-2xl p-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
              <Edit3 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Edit Centre: {centre.name}
              </h3>
              <p className="text-xs text-slate-500">
                Centre ID: <span className="font-mono text-blue-600 font-semibold">{centre.id}</span>
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <Input
                label="Centre Name *"
                error={errors.name?.message}
                {...register("name", { required: "Name is required" })}
              />
            </div>

            <Select label="Compliance Status" {...register("status")}>
              <option value="Compliant">Compliant</option>
              <option value="Warning">Warning</option>
              <option value="Non-Compliant">Non-Compliant</option>
              <option value="Critical">Critical</option>
            </Select>

            <Select label="Scheme" {...register("scheme")}>
              <option value="PMKVY 4.0">PMKVY 4.0</option>
              <option value="DDU-GKY">DDU-GKY</option>
              <option value="State Skill Mission">State Skill Mission</option>
              <option value="BSDM">BSDM</option>
              <option value="GSDM">GSDM</option>
              <option value="UPSDM">UPSDM</option>
            </Select>

            <Input
              label="State *"
              error={errors.state?.message}
              {...register("state", { required: "State is required" })}
            />

            <Input
              label="District *"
              error={errors.district?.message}
              {...register("district", { required: "District is required" })}
            />

            <Input
              label="Nodal Officer *"
              error={errors.nodalOfficer?.message}
              {...register("nodalOfficer", { required: "Officer is required" })}
            />

            <Input
              label="Contact Email *"
              type="email"
              error={errors.contactEmail?.message}
              {...register("contactEmail", { required: "Email is required" })}
            />

            <Input
              label="Contact Phone"
              {...register("contactPhone")}
            />

            <Input
              label="Trainees Enrolled"
              type="number"
              {...register("traineesEnrolled")}
            />

            <Input
              label="Cameras Online"
              type="number"
              {...register("camerasOnline")}
            />

            <Input
              label="Total Cameras Installed"
              type="number"
              {...register("camerasTotal")}
            />

            <div className="sm:col-span-2">
              <Input
                label="Physical Address"
                {...register("address")}
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
              icon={Save}
            >
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
