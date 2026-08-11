import { useState } from "react";
import { Download } from "lucide-react";
import { exportRestrictionsToExcel } from "../utils/exportRestrictionsToExcel";

interface ExportRestrictionsButtonProps {
  variant?: "primary" | "secondary";
  className?: string;
}

export default function ExportRestrictionsButton({
  variant = "primary",
  className = "",
}: ExportRestrictionsButtonProps) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      exportRestrictionsToExcel();
    } catch (error) {
      console.error("Error exportando restricciones:", error);
      alert("Error al exportar restricciones");
    } finally {
      setIsExporting(false);
    }
  };

  const buttonClass =
    variant === "primary"
      ? "bg-brand-primary text-white hover:bg-brand-primary/90"
      : "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50";

  return (
    <button
      onClick={handleExport}
      disabled={isExporting}
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${buttonClass} ${className}`}
    >
      <Download size={16} />
      {isExporting ? "Exportando..." : "Descargar Restricciones (Excel)"}
    </button>
  );
}
