type StatusVariant = "default" | "success" | "warning" | "danger" | "info";

interface EntityStatusBadgeProps {
  status: string;
  variant?: StatusVariant;
  className?: string;
}

const variantStyles: Record<StatusVariant, string> = {
  default: "bg-slate-100 text-slate-600",
  success: "bg-green-50 text-green-700 border-green-200",
  warning: "bg-amber-50 text-amber-700 border-amber-200",
  danger: "bg-red-50 text-red-700 border-red-200",
  info: "bg-blue-50 text-blue-700 border-blue-200",
};

export default function EntityStatusBadge({
  status,
  variant = "default",
  className = "",
}: EntityStatusBadgeProps) {
  return (
    <span
      className={`rounded-full border px-3 py-1 text-xs font-bold ${variantStyles[variant]} ${className}`}
    >
      {status}
    </span>
  );
}
