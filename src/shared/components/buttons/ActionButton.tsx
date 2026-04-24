import { type ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "danger" | "success" | "outline";
type ButtonSize = "sm" | "md" | "lg";

interface ActionButtonProps {
  label: string;
  onClick?: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: ReactNode;
  disabled?: boolean;
  loading?: boolean;
  type?: "button" | "submit" | "reset";
  className?: string;
  title?: string;
}

export default function ActionButton({
  label,
  onClick,
  variant = "primary",
  size = "md",
  icon,
  disabled = false,
  loading = false,
  type = "button",
  className = "",
  title,
}: ActionButtonProps) {
  const getVariantClass = () => {
    switch (variant) {
      case "secondary":
        return "bg-slate-200 text-slate-900 hover:bg-slate-300";
      case "danger":
        return "bg-red-600 text-white hover:bg-red-700";
      case "success":
        return "bg-green-600 text-white hover:bg-green-700";
      case "outline":
        return "border border-slate-300 text-slate-700 hover:bg-slate-50";
      default:
        return "bg-blue-600 text-white hover:bg-blue-700";
    }
  };

  const getSizeClass = () => {
    switch (size) {
      case "sm":
        return "px-3 py-1.5 text-sm";
      case "lg":
        return "px-6 py-3 text-lg";
      default:
        return "px-4 py-2 text-base";
    }
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      title={title}
      className={`inline-flex items-center gap-2 rounded-lg font-medium transition-colors ${getSizeClass()} ${getVariantClass()} disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {loading && (
        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      )}
      {icon && !loading && <span>{icon}</span>}
      {label}
    </button>
  );
}
