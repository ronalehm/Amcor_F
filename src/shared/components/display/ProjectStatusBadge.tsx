import { type ProjectStatus } from "../../data/projectStorage";

interface ProjectStatusBadgeProps {
  status: ProjectStatus;
}

export default function ProjectStatusBadge({ status }: ProjectStatusBadgeProps) {
  const styles: Record<ProjectStatus, string> = {
    "Borrador": "bg-gray-100 text-gray-700",
    "En validación": "bg-amber-100 text-amber-700",
    "Aprobado": "bg-green-100 text-green-700",
    "Rechazado": "bg-red-100 text-red-700",
    "Registrado": "bg-blue-100 text-blue-700",
    "Dado de alta": "bg-green-200 text-green-800",
    "Desestimado": "bg-gray-200 text-gray-800",
    "Aprobado para fabricación": "bg-green-100 text-green-700",
    "Aprobado para muestra": "bg-green-100 text-green-700",
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
