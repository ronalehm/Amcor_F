import { useState, useEffect } from "react";
import { Plus, Info } from "lucide-react";
import { getProjectProducts, type ProjectProductRecord, getProductStatusMeaning } from "../../../shared/data/projectProductStorage";
import { getActionsForProductStatus, canCreateProductFromApprovedProduct, type WorkflowProjectStatus } from "../../../shared/data/projectWorkflow";
import FormCard from "../../../shared/components/forms/FormCard";
import Button from "../../../shared/components/ui/Button";

interface ProjectProductsPanelProps {
  projectCode: string;
  projectStatus: WorkflowProjectStatus;
  onCreateNew?: () => void;
  onCreateFromApproved?: (baseProductId: string) => void;
  onViewProduct?: (productId: string) => void;
}

export default function ProjectProductsPanel({
  projectCode,
  projectStatus,
  onCreateNew,
  onCreateFromApproved,
  onViewProduct,
}: ProjectProductsPanelProps) {
  const [products, setProducts] = useState<ProjectProductRecord[]>([]);

  useEffect(() => {
    const allProducts = getProjectProducts(projectCode);
    setProducts(allProducts);
  }, [projectCode]);

  const approvedProducts = products.filter((p) =>
    p.status === "Aprobado" || p.status === "Dado de Alta"
  );
  const hasApprovedProducts = approvedProducts.length > 0;

  return (
    <div className="mt-6">
      <FormCard title="Productos Asociados" icon="📦" color="#3498db">
      {products.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p className="mb-4">No hay productos asociados a este proyecto.</p>
          <Button
            variant="primary"
            onClick={onCreateNew}
            disabled={projectStatus === "Desestimado"}
            className="gap-2"
          >
            <Plus className="w-4 h-4" />
            Crear primer producto
          </Button>
        </div>
      ) : (
        <div>
          <div className="overflow-x-auto mb-6">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Producto</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Tipo</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Estado</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">SKU SI</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => {
                  const actions = getActionsForProductStatus(product.status);
                  const canCreateFromThis = canCreateProductFromApprovedProduct(projectStatus, product.status);

                  return (
                    <tr key={product.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div>
                          <div className="font-medium text-gray-900">{product.productName}</div>
                          {product.productDescription && (
                            <div className="text-xs text-gray-600">{product.productDescription}</div>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                          {product.productType}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1 group">
                            <span
                              className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                                product.status === "Dado de Alta" || product.status === "Aprobado"
                                  ? "bg-green-100 text-green-800"
                                  : product.status === "Observado / Bloqueado en SI"
                                  ? "bg-red-100 text-red-800"
                                  : product.status.includes("Enviado") ||
                                    product.status.includes("Recibido") ||
                                    product.status.includes("Proceso")
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {product.status}
                            </span>
                            <Info className="w-3 h-3 text-gray-400 opacity-0 group-hover:opacity-100 cursor-help transition-opacity" />
                            <div className="hidden group-hover:block absolute z-10 bg-gray-900 text-white text-xs rounded p-2 max-w-xs bottom-full left-0 mb-2 whitespace-normal">
                              {getProductStatusMeaning(product.status)}
                            </div>
                          </div>
                          {product.generationLevel && product.generationLevel > 1 && (
                            <div className="text-xs text-gray-500">
                              Gen. {product.generationLevel} {product.parentProductId ? "derivado" : ""}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-gray-600">{product.siSku || "-"}</td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          {canCreateFromThis && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => onCreateFromApproved?.(product.id)}
                            >
                              Crear desde este
                            </Button>
                          )}
                          {onViewProduct && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onViewProduct(product.id)}
                            >
                              Ver
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="flex gap-2">
            <Button
              variant="primary"
              onClick={onCreateNew}
              disabled={projectStatus === "Desestimado"}
              className="gap-2"
            >
              <Plus className="w-4 h-4" />
              Agregar producto
            </Button>
            {hasApprovedProducts && (
              <Button
                variant="secondary"
                onClick={() => onCreateFromApproved?.(approvedProducts[0].id)}
                disabled={projectStatus === "Desestimado"}
                className="gap-2"
              >
                <Plus className="w-4 h-4" />
                Crear desde aprobado
              </Button>
            )}
          </div>
        </div>
      )}
      </FormCard>
    </div>
  );
}
