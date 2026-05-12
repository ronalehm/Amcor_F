import { useState, useEffect } from "react";
import { Plus, Trash2, Eye, Edit2 } from "lucide-react";
import {
  getPreliminaryProducts,
  createBasePreliminaryProduct,
  updatePreliminaryProductStatus,
  savePreliminaryProduct,
  destimarPreliminaryProduct,
  type ProjectPreliminaryProductRecord,
} from "../../../shared/data/projectProductStorage";
import { updateProjectRecord, type ProjectRecord } from "../../../shared/data/projectStorage";
import { type PortfolioRecord } from "../../../shared/data/portfolioStorage";
import { exportProjectQuotationExcel } from "../../../shared/utils/exportProjectQuotationExcel";
import FormCard from "../../../shared/components/forms/FormCard";
import Button from "../../../shared/components/ui/Button";
import ProductFormModal from "./ProductFormModal";

interface ProjectProductsPanelProps {
  project: ProjectRecord;
  portfolio: PortfolioRecord | null;
  onProjectUpdated: () => void;
}

type ModalMode = "create-base" | "create-variation" | "edit" | "view" | null;

export default function ProjectProductsPanel({
  project,
  portfolio,
  onProjectUpdated,
}: ProjectProductsPanelProps) {
  const [products, setProducts] = useState<ProjectPreliminaryProductRecord[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [editingProduct, setEditingProduct] = useState<ProjectPreliminaryProductRecord | null>(null);
  const [baseForVariation, setBaseForVariation] =
    useState<ProjectPreliminaryProductRecord | null>(null);

  useEffect(() => {
    refreshProducts();
  }, [project.code]);

  const refreshProducts = () => {
    setProducts(getPreliminaryProducts(project.code));
  };

  const canSelect = (product: ProjectPreliminaryProductRecord): boolean => {
    return product.status !== "Desestimado" && product.status !== "Alta";
  };

  const selectableProducts = products.filter(canSelect);
  const allSelectableAreSelected =
    selectableProducts.length > 0 &&
    selectableProducts.every((p) => selectedIds.has(p.id));
  const someAreSelected = selectedIds.size > 0;

  const toggleSelectAll = () => {
    if (allSelectableAreSelected) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(selectableProducts.map((p) => p.id)));
    }
  };

  const toggleSelect = (id: string) => {
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setSelectedIds(newSet);
  };

  const handleGenerateBase = () => {
    const baseProduct = createBasePreliminaryProduct(project.code, project);
    savePreliminaryProduct(baseProduct);
    refreshProducts();
  };

  const handleExportQuotation = async () => {
    if (selectedIds.size === 0) return;

    const selectedProducts = products.filter((p) => selectedIds.has(p.id));

    try {
      // Export to Excel
      exportProjectQuotationExcel({
        project,
        portfolio,
        products: selectedProducts,
      });

      // Update products to "En Cotización" if they're "Registrado"
      const now = new Date().toISOString();
      selectedProducts.forEach((product) => {
        if (product.status === "Registrado") {
          const updated = {
            ...product,
            status: "En Cotización" as const,
            quoteRequestedAt: now,
            updatedAt: now,
          };
          savePreliminaryProduct(updated);
        }
      });

      // Update project if needed
      if (project.status !== "En Cotización") {
        const updatedProject: ProjectRecord = {
          ...project,
          status: "En Cotización",
          stage: "P3_GESTION_COMERCIAL_PRODUCTOS_PRELIMINARES",
          quoteStartedAt: project.quoteStartedAt || now,
          statusUpdatedAt: now,
        };
        updateProjectRecord(project.code, updatedProject);
      }

      // Clear selection and refresh
      setSelectedIds(new Set());
      refreshProducts();
      onProjectUpdated();
    } catch (error) {
      console.error("Error exporting quotation:", error);
      alert("Error al exportar la cotización");
    }
  };

  const handleCreateVariation = (baseProduct: ProjectPreliminaryProductRecord) => {
    setBaseForVariation(baseProduct);
    setModalMode("create-variation");
  };

  const handleDesestimar = (product: ProjectPreliminaryProductRecord) => {
    if (!confirm(`¿Desestimar el producto "${product.name}"?`)) return;
    const now = new Date().toISOString();
    const updated = {
      ...product,
      status: "Desestimado" as const,
      updatedAt: now,
    };
    savePreliminaryProduct(updated);
    refreshProducts();
  };

  const handleModalSave = () => {
    setModalMode(null);
    setEditingProduct(null);
    setBaseForVariation(null);
    refreshProducts();
    onProjectUpdated();
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case "Registrado":
        return "bg-blue-100 text-blue-800";
      case "En Cotización":
        return "bg-yellow-100 text-yellow-800";
      case "Aprobado":
        return "bg-green-100 text-green-800";
      case "Alta":
        return "bg-purple-100 text-purple-800";
      case "Desestimado":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const hasBaseProduct = products.some((p) => p.isBaseProduct);
  const canGenerateBase = project.status === "Validado" && !hasBaseProduct;

  return (
    <div className="mt-8">
      <FormCard title="Productos Solicitados a Cotizar" icon="📦" color="#3498db">
        {products.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p className="mb-4">No hay productos preliminares asociados a este proyecto.</p>
            {canGenerateBase && (
              <Button variant="primary" onClick={handleGenerateBase} className="gap-2">
                <Plus className="w-4 h-4" />
                Generar Producto Preliminar
              </Button>
            )}
            {!canGenerateBase && (
              <p className="text-xs text-gray-400 mt-2">
                {project.status !== "Validado"
                  ? "El proyecto debe estar en estado 'Validado' para generar productos"
                  : "El proyecto ya tiene un producto base"}
              </p>
            )}
          </div>
        ) : (
          <div>
            {/* Generate base button */}
            {canGenerateBase && (
              <div className="mb-6">
                <Button variant="primary" onClick={handleGenerateBase} className="gap-2">
                  <Plus className="w-4 h-4" />
                  Generar Producto Preliminar
                </Button>
              </div>
            )}

            {/* Products table */}
            <div className="overflow-x-auto mb-6">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="text-center py-3 px-2 font-medium text-gray-700 w-8">
                      <input
                        type="checkbox"
                        checked={allSelectableAreSelected && selectableProducts.length > 0}
                        onChange={toggleSelectAll}
                        disabled={selectableProducts.length === 0}
                        className="rounded"
                      />
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Código</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Nombre</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Tipo</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Origen</th>
                    <th className="text-center py-3 px-4 font-medium text-gray-700">Gen</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Estado</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Formato</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Tipo Imp.</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Estructura</th>
                    <th className="text-center py-3 px-4 font-medium text-gray-700">Ancho</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Accesorios</th>
                    <th className="text-center py-3 px-4 font-medium text-gray-700">Vol Est</th>
                    <th className="text-center py-3 px-4 font-medium text-gray-700">UM</th>
                    <th className="text-center py-3 px-4 font-medium text-gray-700">Precio</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Moneda</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr
                      key={product.id}
                      className={`border-b border-gray-100 hover:bg-gray-50 ${
                        product.status === "Desestimado" ? "opacity-60" : ""
                      }`}
                    >
                      <td className="text-center py-3 px-2">
                        {canSelect(product) && (
                          <input
                            type="checkbox"
                            checked={selectedIds.has(product.id)}
                            onChange={() => toggleSelect(product.id)}
                            className="rounded"
                          />
                        )}
                      </td>
                      <td className="py-3 px-4 text-gray-700 font-mono text-xs">
                        {product.preliminaryProductCode}
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-medium text-gray-900 max-w-xs truncate">
                          {product.name}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                            product.productType === "Base"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-purple-100 text-purple-800"
                          }`}
                        >
                          {product.productType}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-600 text-xs">
                        {product.baseProductName || "—"}
                      </td>
                      <td className="text-center py-3 px-4 text-gray-600">
                        {product.generationLevel || 0}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-block px-2 py-1 rounded text-xs font-medium ${getStatusColor(
                            product.status
                          )}`}
                        >
                          {product.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-600 text-xs">
                        {product.blueprintFormat || "—"}
                      </td>
                      <td className="py-3 px-4 text-gray-600 text-xs">
                        {product.printType || "—"}
                      </td>
                      <td className="py-3 px-4 text-gray-600 text-xs">
                        {product.structureType || "—"}
                      </td>
                      <td className="text-center py-3 px-4 text-gray-600">
                        {product.width || "—"}
                      </td>
                      <td className="py-3 px-4 text-gray-600 text-xs max-w-xs truncate">
                        {product.accessories?.join(", ") || "—"}
                      </td>
                      <td className="text-center py-3 px-4 text-gray-600">
                        {product.estimatedVolume || "—"}
                      </td>
                      <td className="text-center py-3 px-4 text-gray-600">
                        {product.unitOfMeasure || "—"}
                      </td>
                      <td className="text-center py-3 px-4 text-gray-600">
                        {product.targetPrice || "—"}
                      </td>
                      <td className="py-3 px-4 text-gray-600 text-xs">
                        {product.currencyType || "—"}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-1 flex-wrap">
                          <button
                            onClick={() => {
                              setEditingProduct(product);
                              setModalMode("edit");
                            }}
                            disabled={product.status === "Desestimado" || product.status === "Alta"}
                            className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Editar"
                          >
                            <Edit2 className="w-3 h-3" />
                          </button>

                          {(product.isBaseProduct || product.status === "Aprobado") && (
                            <button
                              onClick={() => handleCreateVariation(product)}
                              className="px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded hover:bg-purple-200"
                              title="Crear variación"
                            >
                              +Var
                            </button>
                          )}

                          <button
                            onClick={() => handleDesestimar(product)}
                            disabled={product.status === "Desestimado" || product.status === "Alta"}
                            className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Desestimar"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Action buttons */}
            <div className="flex gap-2 flex-wrap">
              <Button
                variant="primary"
                onClick={handleExportQuotation}
                disabled={!someAreSelected}
                className="gap-2"
              >
                📊 Exportar a Excel para cotización
              </Button>
              {!someAreSelected && (
                <p className="text-xs text-gray-500">Selecciona productos para exportar</p>
              )}
            </div>
          </div>
        )}
      </FormCard>

      {/* Modal */}
      {modalMode && (
        <ProductFormModal
          projectCode={project.code}
          project={project}
          initialData={modalMode === "edit" ? editingProduct || undefined : undefined}
          baseProductId={modalMode === "create-variation" ? baseForVariation?.id : undefined}
          onSave={handleModalSave}
          onCancel={() => {
            setModalMode(null);
            setEditingProduct(null);
            setBaseForVariation(null);
          }}
        />
      )}
    </div>
  );
}
