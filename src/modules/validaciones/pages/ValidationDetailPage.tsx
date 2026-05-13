import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useLayout } from "../../../components/layout/LayoutContext";
import { getProjectByCode } from "../../../shared/data/projectStorage";
import { observeProject, approveValidation } from "../services/validationService";
import type { ProjectRecord } from "../../../shared/data/projectStorage";
import FormCard from "../../../shared/components/forms/FormCard";
import Button from "../../../shared/components/ui/Button";
import PreviewRow from "../../../shared/components/display/PreviewRow";
import ValidationHistoryTimeline from "../components/ValidationHistoryTimeline";

export default function ValidationDetailPage() {
  const navigate = useNavigate();
  const { setHeader, resetHeader } = useLayout();
  const { projectCode } = useParams<{ projectCode: string }>();
  const [project, setProject] = useState<ProjectRecord | null>(null);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (projectCode) {
      const p = getProjectByCode(projectCode);
      setProject(p);
    }
  }, [projectCode]);

  useEffect(() => {
    if (project) {
      setHeader({
        title: `Validación: ${project.code}`,
        breadcrumbs: [
          { label: "Validaciones", href: "/validaciones" },
          { label: project.code },
        ],
      });
    }
    return () => resetHeader();
  }, [project, setHeader, resetHeader]);

  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <div className="text-red-600 font-semibold">Proyecto no encontrado</div>
        <Button variant="ghost" onClick={() => navigate("/validaciones")}>
          Volver a Validaciones
        </Button>
      </div>
    );
  }

  // Get validation area from multiple possible sources
  const validationArea =
    project.currentValidationStep ||
    project.technicalSubArea ||
    "";

  const isGraphicArtsStep = validationArea === "Artes Gráficas";

  const isTechnicalStep =
    validationArea === "R&D Técnica" ||
    validationArea === "R&D Desarrollo";

  const canValidateCurrentStep =
    isGraphicArtsStep || isTechnicalStep;

  const handleObservar = async () => {
    if (!canValidateCurrentStep || !validationArea) {
      alert("No hay un área de validación activa para este proyecto.");
      return;
    }

    if (!comment.trim()) {
      alert("El comentario es obligatorio al observar.");
      return;
    }

    setLoading(true);
    try {
      const updated = observeProject(project, validationArea as any, comment);
      setProject(updated);
      alert("Proyecto observado. El ejecutivo deberá corregir y solicitar validación nuevamente.");
      navigate("/validaciones");
    } catch (error) {
      console.error("Error al observar:", error);
      alert("Error al procesar la observación.");
    } finally {
      setLoading(false);
    }
  };

  const handleValidar = async () => {
    if (!canValidateCurrentStep || !validationArea) {
      alert("No hay un área de validación activa para este proyecto.");
      return;
    }

    setLoading(true);
    try {
      const updated = approveValidation(project, validationArea as any, comment || undefined);
      setProject(updated);
      alert("Validación completada.");
      navigate("/validaciones");
    } catch (error) {
      console.error("Error al validar:", error);
      alert("Error al procesar la validación.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-none bg-[#f6f8fb] space-y-6 pb-12 p-6">
      <button
        type="button"
        onClick={() => navigate("/validaciones")}
        className="flex items-center gap-1.5 px-1 text-sm font-semibold text-slate-600 hover:text-brand-primary transition-colors"
      >
        <ArrowLeft size={16} />
        Atrás
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Columna izquierda: Datos del proyecto */}
        <div className="lg:col-span-2 space-y-6">
          {/* Encabezado del proyecto */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 bg-gradient-to-br from-brand-primary to-brand-secondary text-white">
              <div className="text-xs font-bold uppercase tracking-wide text-white/75 mb-1">
                Proyecto {project.code}
              </div>
              <h2 className="text-2xl font-bold">{project.projectName}</h2>
            </div>
          </div>

          {/* Datos generales */}
          <FormCard title="Datos del Proyecto" icon="▦" color="#00395A">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
              <PreviewRow label="Código" value={project.code} />
              <PreviewRow label="Cliente" value={project.clientName} />
              <PreviewRow label="Portafolio" value={project.portfolioCode} />
              <PreviewRow label="Ejecutivo" value={project.ejecutivoName} />
              <PreviewRow label="Estado" value={project.status} />
              <PreviewRow label="Completitud" value={`${project.completionPercentage || 0}%`} />
            </div>
          </FormCard>

          {/* Datos para Artes Gráficas */}
          {isGraphicArtsStep && (() => {
            const projectAny = project as any;

            const displayYesNo = (value: any) => {
              if (value === true || value === "Sí" || value === "Si") return "Sí";
              if (value === false || value === "No") return "No";
              return value || "—";
            };

            const requiresDesignWorkValue = projectAny.requiresDesignWork;

            const hasDesignReferenceValue =
              projectAny.isPreviousDesign ??
              projectAny.hasEdagReference ??
              projectAny.tieneDisenoReferencia;

            const hasDesignPlanValue =
              projectAny.hasDesignPlan ??
              projectAny.tienePlanoDiseno;

            const edagCodeValue =
              projectAny.previousEdagCode ||
              projectAny.edagCode ||
              "—";

            const edagVersionValue =
              projectAny.previousEdagVersion ||
              projectAny.edagVersion ||
              "—";

            return (
              <FormCard title="Datos para Validación de Artes Gráficas" icon="🎨" color="#7E3FB2">
                <div className="space-y-6">
                  {/* Bloque A: Impresión y diseño */}
                  <div>
                    <h4 className="mb-3 text-xs font-bold uppercase tracking-wide text-slate-500">
                      Impresión y diseño
                    </h4>
                    <div className="grid grid-cols-1 gap-y-4 gap-x-8 md:grid-cols-2">
                      <PreviewRow
                        label="Requiere trabajo de diseño"
                        value={displayYesNo(requiresDesignWorkValue)}
                      />
                      <PreviewRow label="Clase de impresión" value={project.printClass || "—"} />
                      <PreviewRow label="Tipo de impresión" value={project.printType || "—"} />
                      <PreviewRow
                        label="Especificaciones Especiales"
                        value={projectAny.specialDesignSpecs || "—"}
                      />
                      {projectAny.specialDesignComments && (
                        <div className="md:col-span-2">
                          <div className="text-xs font-bold uppercase text-slate-600 mb-1">
                            Comentarios de diseños especiales
                          </div>
                          <div className="text-sm text-slate-700 bg-slate-50 p-3 rounded border border-slate-200">
                            {projectAny.specialDesignComments}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Bloque B: Diseño de referencia y planos */}
                  <div>
                    <h4 className="mb-3 text-xs font-bold uppercase tracking-wide text-slate-500">
                      Diseño de referencia y planos
                    </h4>
                    <div className="grid grid-cols-1 gap-y-4 gap-x-8 md:grid-cols-2">
                      <PreviewRow
                        label="Tiene diseño de referencia"
                        value={displayYesNo(hasDesignReferenceValue)}
                      />
                      <PreviewRow
                        label="Código EDAG"
                        value={edagCodeValue}
                      />
                      <PreviewRow
                        label="Versión EDAG"
                        value={edagVersionValue}
                      />
                      <PreviewRow
                        label="Tiene plano de diseño"
                        value={displayYesNo(hasDesignPlanValue)}
                      />
                    </div>

                    {/* Planos cargados */}
                  <div className="mt-4">
                    <p className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-500">
                      Planos cargados
                    </p>
                    {Array.isArray((project as any).designPlanFiles) && (project as any).designPlanFiles.length > 0 ? (
                      <ul className="space-y-1 rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">
                        {(project as any).designPlanFiles.map((fileName: string, index: number) => (
                          <li key={`${fileName}-${index}`}>• {fileName}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm text-slate-500">
                        —
                      </p>
                    )}
                  </div>
                </div>

                {/* Bloque C: Color */}
                <div>
                  <h4 className="mb-3 text-xs font-bold uppercase tracking-wide text-slate-500">
                    Color
                  </h4>
                  <div className="grid grid-cols-1 gap-y-4 gap-x-8 md:grid-cols-2">
                    <PreviewRow
                      label="Objetivo de color"
                      value={
                        Array.isArray((project as any).colorObjective)
                          ? (project as any).colorObjective.join(", ")
                          : Array.isArray((project as any).objetivoColor)
                            ? (project as any).objetivoColor.join(", ")
                            : "—"
                      }
                    />
                    <PreviewRow
                      label="Comentarios de objetivo de color"
                      value={
                        (project as any).colorObjectiveComment ||
                        (project as any).comentarioObjetivoColor ||
                        "—"
                      }
                    />
                    <div className="md:col-span-2">
                      <PreviewRow
                        label="Instrucciones de trabajo para diseño"
                        value={
                          (project as any).designWorkInstructions ||
                          (project as any).instruccionesTrabajoDiseno ||
                          "—"
                        }
                      />
                    </div>
                  </div>
                </div>

                {/* Bloque D: Formato y datos legales */}
                <div>
                  <h4 className="mb-3 text-xs font-bold uppercase tracking-wide text-slate-500">
                    Formato y datos legales
                  </h4>
                  <div className="grid grid-cols-1 gap-y-4 gap-x-8 md:grid-cols-2">
                    <PreviewRow
                      label="Formato de Plano Calculado"
                      value={project.blueprintFormat || (project as any).formatoPlano || (project as any).format || "—"}
                    />
                    <PreviewRow
                      label='Logo "Producto Peruano"'
                      value={(project as any).peruvianProductLogo || "—"}
                    />
                    <PreviewRow
                      label="Pie de Imprenta"
                      value={(project as any).printingFooter || "—"}
                    />
                  </div>
                </div>

                {/* Bloque E: Dimensiones del producto */}
                <div>
                  <h4 className="mb-3 text-xs font-bold uppercase tracking-wide text-slate-500">
                    Dimensiones del producto
                  </h4>
                  <div className="grid grid-cols-1 gap-y-4 gap-x-8 md:grid-cols-3">
                    <PreviewRow
                      label="Ancho *"
                      value={
                        projectAny.width || projectAny.ancho
                          ? `${projectAny.width || projectAny.ancho} mm`
                          : "—"
                      }
                    />
                    <PreviewRow
                      label="Largo *"
                      value={
                        projectAny.length || projectAny.largo
                          ? `${projectAny.length || projectAny.largo} mm`
                          : "—"
                      }
                    />
                    <PreviewRow
                      label="Ancho Fuelle *"
                      value={
                        projectAny.gussetWidth || projectAny.anchoFuelle
                          ? `${projectAny.gussetWidth || projectAny.anchoFuelle} mm`
                          : "—"
                      }
                    />
                  </div>
                </div>
              </div>
              </FormCard>
            );
          })()}

          {/* Datos para R&D / Área Técnica */}
          {isTechnicalStep && (
            <FormCard title="Datos para Validación Técnica" icon="⚙" color="#00A1DE">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
                <PreviewRow label="Tipo de Estructura" value={project.structureType || "—"} />
                <PreviewRow label="Formato" value={project.blueprintFormat || "—"} />
                <PreviewRow label="Aplicación Técnica" value={project.technicalApplication || "—"} />
                <PreviewRow label="Complejidad Técnica" value={project.technicalComplexity || "—"} />

                <div className="md:col-span-2 border-t border-slate-100 pt-4 mt-2">
                  <h4 className="font-semibold text-slate-700 mb-3">Capas y Materiales</h4>
                </div>

                {[1, 2, 3, 4].map((n) => {
                  const materialKey = `layer${n}Material` as keyof ProjectRecord;
                  const micronKey = `layer${n}Micron` as keyof ProjectRecord;
                  const grammageKey = `layer${n}Grammage` as keyof ProjectRecord;

                  const hasMaterial = project[materialKey];
                  if (!hasMaterial) return null;

                  return (
                    <div key={n} className="md:col-span-2">
                      <div className="text-xs font-semibold text-slate-600 uppercase mb-2">Capa {n}</div>
                      <div className="grid grid-cols-3 gap-2">
                        <PreviewRow label="Material" value={String(project[materialKey] || "—")} />
                        <PreviewRow label="Micraje" value={String(project[micronKey] || "—")} />
                        <PreviewRow label="Gramaje" value={String(project[grammageKey] || "—")} />
                      </div>
                    </div>
                  );
                })}

                <div className="md:col-span-2 border-t border-slate-100 pt-4">
                  <PreviewRow label="Gramaje Total" value={project.grammage || "—"} />
                </div>

                <div className="md:col-span-2 border-t border-slate-100 pt-4">
                  <h4 className="font-semibold text-slate-700 mb-3">Dimensiones y Accesorios</h4>
                </div>

                <PreviewRow label="Ancho" value={project.width || "—"} />
                <PreviewRow label="Largo" value={project.length || "—"} />
                <PreviewRow label="Zipper" value={project.hasZipper ? (project.zipperType || "Sí") : "No"} />
                <PreviewRow label="Válvula" value={project.hasValve ? (project.valveType || "Sí") : "No"} />
                <PreviewRow label="Refuerzo" value={project.hasReinforcement ? "Sí" : "No"} />
                <PreviewRow label="Esquinas Redondeadas" value={project.hasRoundedCorners ? "Sí" : "No"} />
              </div>
            </FormCard>
          )}
        </div>

        {/* Columna derecha: Formulario de validación */}
        <div className="space-y-6">
          {/* Estado de validaciones */}
          <FormCard title="Estado de Validaciones" icon="✓" color="#00395A">
            <div className="space-y-3">
              <div>
                <div className="text-xs font-bold uppercase text-slate-600 mb-1">Artes Gráficas</div>
                <span className={`inline-block px-3 py-2 rounded text-xs font-medium ${
                  project.graphicArtsValidationStatus === "Validado" ? "bg-green-100 text-green-800" :
                  project.graphicArtsValidationStatus === "Aprobado automático" ? "bg-green-100 text-green-800" :
                  project.graphicArtsValidationStatus === "Observado" ? "bg-orange-100 text-orange-800" :
                  project.graphicArtsValidationStatus === "Revisión manual" ? "bg-yellow-100 text-yellow-800" :
                  "bg-gray-100 text-gray-800"
                }`}>
                  {project.graphicArtsValidationStatus || "Sin solicitar"}
                </span>
              </div>

              <div>
                <div className="text-xs font-bold uppercase text-slate-600 mb-1">Validación Técnica</div>
                <span className={`inline-block px-3 py-2 rounded text-xs font-medium ${
                  project.technicalValidationStatus === "Validado" ? "bg-green-100 text-green-800" :
                  project.technicalValidationStatus === "Aprobado automático" ? "bg-green-100 text-green-800" :
                  project.technicalValidationStatus === "Observado" ? "bg-orange-100 text-orange-800" :
                  project.technicalValidationStatus === "Pendiente" ? "bg-yellow-100 text-yellow-800" :
                  "bg-gray-100 text-gray-800"
                }`}>
                  {project.technicalValidationStatus || "Sin solicitar"}
                </span>
              </div>
            </div>
          </FormCard>

          {/* Formulario de acción */}
          {canValidateCurrentStep && (
            <FormCard
              title="Acción de Validación"
              icon="📋"
              color="#e74c3c"
            >
              <div className="space-y-4">
                {validationArea && (
                  <p className="text-xs text-slate-500 mb-3">
                    Área responsable: {validationArea}
                  </p>
                )}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Comentarios (obligatorio al observar)
                  </label>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Escribe tus comentarios aquí..."
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:border-brand-primary focus:outline-none resize-none"
                    rows={5}
                  />
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="danger"
                    onClick={handleObservar}
                    disabled={loading}
                    className="flex-1"
                  >
                    {loading ? "Procesando..." : "Observado"}
                  </Button>
                  <Button
                    variant="success"
                    onClick={handleValidar}
                    disabled={loading}
                    className="flex-1"
                  >
                    {loading ? "Procesando..." : "Validado"}
                  </Button>
                </div>
              </div>
            </FormCard>
          )}

          {!isGraphicArtsStep && !isTechnicalStep && (
            <FormCard title="Estado" icon="ℹ️" color="#2c3e50">
              <div className="text-sm text-slate-600">
                Este proyecto ya ha completado todas las validaciones.
              </div>
            </FormCard>
          )}

          {/* Historial de observaciones */}
          {project.lastObservationComment && (
            <FormCard title="Última Observación" icon="⚠️" color="#f39c12">
              <div className="space-y-2">
                <div>
                  <div className="text-xs font-semibold text-slate-600 uppercase">Fuente</div>
                  <div className="text-sm text-slate-700">{project.lastObservationSource || "—"}</div>
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-600 uppercase">Comentario</div>
                  <div className="text-sm text-slate-700 bg-yellow-50 p-2 rounded">
                    {project.lastObservationComment}
                  </div>
                </div>
                {project.lastObservationAt && (
                  <div>
                    <div className="text-xs font-semibold text-slate-600 uppercase">Fecha</div>
                    <div className="text-sm text-slate-700">
                      {new Date(project.lastObservationAt).toLocaleDateString("es-AR")}
                    </div>
                  </div>
                )}
              </div>
            </FormCard>
          )}
        </div>
      </div>

      {/* Historial de validaciones - Sección completa */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-6">Historial de Validaciones</h3>
        <ValidationHistoryTimeline projectCode={project.code} />
      </div>
    </div>
  );
}
