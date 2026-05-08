import { useState, useEffect } from "react";
import { Plus, Trash2 } from "lucide-react";
import {
  getProjectProducts,
  type ProjectProductRecord,
  destimarProjectProduct,
  toggleProductSelectedForQuote,
  createProjectProductFromProject,
} from "../../../shared/data/projectProductStorage";
import { exportProductsToExcel } from "../services/projectExportService";
import type { ProjectRecord } from "../../../shared/data/projectStorage";
import { canCreateProductFromApprovedProduct } from "../../../shared/data/projectWorkflow";
import FormCard from "../../../shared/components/forms/FormCard";
import Button from "../../../shared/components/ui/Button";
import ProductFormModal from "./ProductFormModal";

interface ProjectProductsPanelProps {
  project: ProjectRecord;
}

type ModalMode = "create" | "edit" | "create-from" | null;

export default function ProjectProductsPanel({ project }: ProjectProductsPanelProps) {
  const [products, setProducts] = useState<ProjectProductRecord[]>([]);
  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [selectedProduct, setSelectedProduct] = useState<ProjectProductRecord | null>(null);
  const [baseProductId, setBaseProductId] = useState<string | undefined>();

  useEffect(() => {
    refreshProducts();
  }, [project.code]);

  const refreshProducts = () => {
    setProducts(getProjectProducts(project.code));
  };

  const canAddProduct =
    project.graphicArtsValidationStatus === "Aprobado" &&
    project.rdValidationStatus === "Aprobado";

  const selectedForQuoteCount = products.filter((p) => p.selectedForQuote).length;
  const hasApprovedProducts = products.some(
    (p) => p.status === "Aprobado" || p.status === "Dado de Alta"
  );

  const handleOpenCreate = () => {
    setSelectedProduct(null);
    setBaseProductId(undefined);
    setModalMode("create");
  };

  const handleOpenEdit = (product: ProjectProductRecord) => {
    setSelectedProduct(product);
    setBaseProductId(undefined);
    setModalMode("edit");
  };

  const handleCreateFromApproved = (product: ProjectProductRecord) => {
    setBaseProductId(product.id);
    setSelectedProduct(null);
    setModalMode("create-from");
  };

  const handleDuplicate = async (product: ProjectProductRecord) => {
    const duplicated = createProjectProductFromProject(project.code, {
      ...product,
      productName: `${product.productName} (copia)`,
    });
    setProducts((prev) => [...prev, duplicated]);
  };

  const handleDiscard = (product: ProjectProductRecord) => {
    if (!confirm(`¿Descartar el producto "${product.productName}"?`)) return;
    destimarProjectProduct(product.id);
    refreshProducts();
  };

  const handleToggleQuote = (product: ProjectProductRecord) => {
    toggleProductSelectedForQuote(product.id);
    refreshProducts();
  };

  const handleModalSave = (product: ProjectProductRecord) => {
    setModalMode(null);
    refreshProducts();
  };

  const getStatusBadgeColor = (status: string): string => {
    if (status === "Dado de Alta" || status === "Aprobado") return "bg-green-100 text-green-800";
    if (status === "Observado / Bloqueado en SI") return "bg-red-100 text-red-800";
    if (status.includes("Enviado") || status.includes("Recibido") || status.includes("Proceso"))
      return "bg-yellow-100 text-yellow-800";
    return "bg-gray-100 text-gray-800";
  };

  return (
    <div className="mt-6">
      <FormCard title="Productos Preliminares" icon="📦" color="#3498db">
        {products.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p className="mb-4">No hay productos preliminares asociados a este proyecto.</p>
            <Button
              variant="primary"
              onClick={handleOpenCreate}
              disabled={!canAddProduct}
              title={
                !canAddProduct
                  ? "Requiere aprobación de Artes Gráficas y R&D"
                  : undefined
              }
              className="gap-2"
            >
              <Plus className="w-4 h-4" />
              Crear primer producto
            </Button>
            {!canAddProduct && (
              <p className="text-xs text-gray-400 mt-2">
                Requiere aprobación de Artes Gráficas y R&D
              </p>
            )}
          </div>
        ) : (
          <div>
            <div className="overflow-x-auto mb-6">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-700">
                      Código
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">
                      Nombre
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">
                      Tipo
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">
                      Estado
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">
                      Precio Min-Max
                    </th>
                    <th className="text-center py-3 px-4 font-medium text-gray-700">
                      ¿Cotizar?
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => {
                    const canCreateFromThis = canCreateProductFromApprovedProduct(
                      project.status as any,
                      product.status
                    );

                    return (
                      <tr
                        key={product.id}
                        className={`border-b border-gray-100 hover:bg-gray-50 ${
                          product.status === "Desestimado" ? "opacity-60" : ""
                        }`}
                      >
                        <td className="py-3 px-4 text-gray-700 font-mono text-xs">
                          {product.productRequestCode}
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-medium text-gray-900">{product.productName}</div>
                          {product.productDescription && (
                            <div className="text-xs text-gray-600">{product.productDescription}</div>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <span className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                            {product.productType}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`inline-block px-2 py-1 rounded text-xs font-medium ${getStatusBadgeColor(
                              product.status
                            )}`}
                          >
                            {product.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-gray-600 text-xs">
                          {product.targetPriceMin || product.targetPriceMax
                            ? `${product.targetPriceMin ?? "-"} - ${product.targetPriceMax ?? "-"}`
                            : "-"}
                        </td>
                        <td className="py-3 px-4 text-center">
                          {product.selectedForQuote ? (
                            <span className="text-lg">✓</span>
                          ) : (
                            <span className="text-gray-400">○</span>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex gap-2 flex-wrap">
                            {product.status !== "Desestimado" && (
                              <>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleOpenEdit(product)}
                                >
                                  Editar
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleDuplicate(product)}
                                >
                                  Duplicar
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleToggleQuote(product)}
                                >
                                  {product.selectedForQuote ? "Desmarcar" : "Cotizar"}
                                </Button>
                                <Button
                                  variant="danger"
                                  size="sm"
                                  onClick={() => handleDiscard(product)}
                                >
                                  <Trash2 className="w-3 h-3" />
                                </Button>
                              </>
                            )}
                            {canCreateFromThis && (
                              <Button
                                variant="primary"
                                size="sm"
                                onClick={() => handleCreateFromApproved(product)}
                              >
                                Crear desde este
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

            <div className="flex gap-2 flex-wrap">
              <Button
                variant="primary"
                onClick={handleOpenCreate}
                disabled={!canAddProduct}
                title={
                  !canAddProduct ? "Requiere aprobación de Artes Gráficas y R&D" : undefined
                }
                className="gap-2"
              >
                <Plus className="w-4 h-4" />
                Agregar producto
              </Button>
              {selectedForQuoteCount > 0 && (
                <Button
                  variant="secondary"
                  onClick={() => exportProductsToExcel(project.code)}
                  className="gap-2"
                >
                  📊 Exportar a Excel ({selectedForQuoteCount})
                </Button>
              )}
            </div>

            {!canAddProduct && (
              <p className="text-xs text-gray-500 mt-2">
                💡 Agregar productos requiere aprobación de Artes Gráficas y R&D
              </p>
            )}
          </div>
        )}
      </FormCard>

      {/* Modal */}
      {modalMode && (
        <ProductFormModal
          projectCode={project.code}
          project={project}
          initialData={modalMode === "edit" ? selectedProduct || undefined : undefined}
          baseProductId={modalMode === "create-from" ? baseProductId : undefined}
          onSave={handleModalSave}
          onCancel={() => setModalMode(null)}
        />
      )}
    </div>
  );
}
