import { type SlaStatus } from "../../data/slaStorage";

interface SlaStatusBadgeProps {
  status: SlaStatus;
}

export default function SlaStatusBadge({ status }: SlaStatusBadgeProps) {
  const styles: Record<SlaStatus, string> = {
    "En plazo": "bg-green-100 text-green-700",
    "Por vencer": "bg-amber-100 text-amber-700",
    "Vencido": "bg-red-100 text-red-700",
    "Atendido": "bg-blue-100 text-blue-700",
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
