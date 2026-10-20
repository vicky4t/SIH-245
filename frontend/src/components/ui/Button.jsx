import React from "react";
import { cn } from "../../utils/cn";
import { Loader2 } from "lucide-react";

export function Button({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  icon: Icon,
  iconPosition = "left",
  className,
  type = "button",
  onClick,
  ...props
}) {
  const baseStyles =
    "relative inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-150 cursor-pointer select-none focus:outline-none focus:ring-2 focus:ring-blue-500/30 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98] font-sans";

  const variantStyles = {
    primary:
      "bg-blue-600 hover:bg-blue-700 text-white shadow-xs border border-blue-600 font-semibold",
    secondary:
      "bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 shadow-xs hover:border-slate-300",
    outline:
      "bg-transparent border border-blue-600 text-blue-600 hover:bg-blue-50",
    danger:
      "bg-red-600 hover:bg-red-700 text-white border border-red-600 shadow-xs",
    emerald:
      "bg-emerald-600 hover:bg-emerald-700 text-white border border-emerald-600 shadow-xs",
    ghost:
      "bg-transparent hover:bg-slate-100 text-slate-600 hover:text-slate-900 border-transparent",
  };

  const sizeStyles = {
    sm: "px-3 py-1.5 text-xs gap-1.5 min-h-[36px]",
    md: "px-4 py-2.5 text-xs sm:text-sm gap-2 min-h-[42px]",
    lg: "px-5 py-3 text-sm sm:text-base gap-2.5 min-h-[48px]",
    icon: "p-2.5 aspect-square rounded-xl",
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)}
      {...props}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin shrink-0" />
      ) : Icon && iconPosition === "left" ? (
        <Icon className="w-4 h-4 shrink-0" />
      ) : null}
      {children}
      {!loading && Icon && iconPosition === "right" ? (
        <Icon className="w-4 h-4 shrink-0" />
      ) : null}
    </button>
  );
}
