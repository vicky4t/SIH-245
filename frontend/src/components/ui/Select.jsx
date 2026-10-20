import React, { forwardRef } from "react";
import { cn } from "../../utils/cn";
import { ChevronDown } from "lucide-react";

export const Select = forwardRef(function Select(
  {
    label,
    options = [],
    error,
    helperText,
    className,
    containerClassName,
    children,
    ...props
  },
  ref
) {
  return (
    <div className={cn("w-full space-y-1.5", containerClassName)}>
      {label && (
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        <select
          ref={ref}
          className={cn(
            "w-full appearance-none rounded-lg bg-white border border-slate-300 px-3 py-2 pr-9 text-xs sm:text-sm text-slate-900 shadow-xs",
            "focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-colors duration-150 cursor-pointer",
            "disabled:opacity-50 disabled:bg-slate-100",
            error && "border-red-500 focus:border-red-500",
            className
          )}
          {...props}
        >
          {options.length > 0
            ? options.map((opt) => (
                <option key={opt.value} value={opt.value} className="bg-white text-slate-900">
                  {opt.label}
                </option>
              ))
            : children}
        </select>
        <ChevronDown className="absolute right-3 w-4 h-4 text-slate-500 pointer-events-none" />
      </div>
      {error && <p className="text-xs text-red-600 mt-1 font-medium">{error}</p>}
      {helperText && !error && (
        <p className="text-xs text-slate-500 mt-1">{helperText}</p>
      )}
    </div>
  );
});
