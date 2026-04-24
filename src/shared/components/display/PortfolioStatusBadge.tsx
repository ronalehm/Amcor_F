
interface PortfolioStatusBadgeProps {
  status: "Borrador" | "Activo" | "Inactivo";
}

export default function PortfolioStatusBadge({ status }: PortfolioStatusBadgeProps) {
  const styles: Record<string, string> = {
    Borrador: "bg-slate-100 text-slate-700",
    Activo: "bg-green-100 text-green-700",
    Inactivo: "bg-red-100 text-red-700",
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
        styles[status] || "bg-gray-100 text-gray-800"
      }`}
    >
      {status}
    </span>
  );
}
