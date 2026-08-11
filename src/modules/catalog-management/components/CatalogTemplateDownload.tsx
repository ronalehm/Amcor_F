import { useState } from "react";
import Button from "../../../shared/components/ui/Button";
import { generateCatalogsTemplateBlob } from "../services/catalogTemplateGenerator";
import { Download, Loader2 } from "lucide-react";

export function CatalogTemplateDownload() {
  const [isLoading, setIsLoading] = useState(false);

  const handleDownloadTemplate = async () => {
    try {
      setIsLoading(true);
      const blob = generateCatalogsTemplateBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `Catalogs_Template_${new Date().toISOString().split("T")[0]}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error descargando plantilla:", error);
      alert("Error al descargar la plantilla. Por favor intenta nuevamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleDownloadTemplate}
      disabled={isLoading}
      className="gap-2"
      variant="outline"
    >
      {isLoading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          Generando plantilla...
        </>
      ) : (
        <>
          <Download className="w-4 h-4" />
          Descargar Plantilla Excel
        </>
      )}
    </Button>
  );
}
