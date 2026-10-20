import React, { forwardRef } from "react";
import { cn } from "../../utils/cn";

export const Input = forwardRef(function Input(
  {
    label,
    error,
    helperText,
    icon: Icon,
    className,
    containerClassName,
    type = "text",
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
        {Icon && (
          <div className="absolute left-3 pointer-events-none text-slate-400">
            <Icon className="w-4 h-4" />
          </div>
        )}
        <input
          ref={ref}
          type={type}
          className={cn(
            "w-full rounded-lg bg-white border border-slate-300 px-3 py-2 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 shadow-xs",
            "focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-colors duration-150",
            "disabled:opacity-50 disabled:bg-slate-100",
            Icon && "pl-9",
            error && "border-red-500 focus:border-red-500 focus:ring-red-100",
            className
          )}
          {...props}
        />
      </div>
      {error && <p className="text-xs text-red-600 mt-1 font-medium">{error}</p>}
      {helperText && !error && (
        <p className="text-xs text-slate-500 mt-1">{helperText}</p>
      )}
    </div>
  );
});
