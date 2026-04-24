import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  XCircle,
  MessageSquare,
} from "lucide-react";
import { useLayout } from "../../../components/layout/LayoutContext";
import { getValidacionById, updateValidacion } from "../data/validacionesMock";
import type { FichaValidacion, EstadoValidacion, AreaValidacion } from "../types/validaciones";

export default function ValidationDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { setHeader, resetHeader } = useLayout();

  const [validacion, setValidacion] = useState<FichaValidacion | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"general" | "comentarios" | "acciones">(
    "general"
  );
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [selectedArea, setSelectedArea] = useState<AreaValidacion>("Artes Gráficas");
  const [commentText, setCommentText] = useState("");
  const [validationAction, setValidationAction] = useState<EstadoValidacion>("Aprobada");

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    const data = getValidacionById(id);
    if (data) {
      setValidacion(data);
      setHeader({
        title: "Detalle de Validación",
        breadcrumbs: [
          { label: "Validaciones", href: "/validaciones" },
          { label: data.codigoProyecto },
          { label: "Detalle" },
        ],
      });
    }
    setLoading(false);
  }, [id, setHeader]);

  useEffect(() => {
    return () => resetHeader();
  }, [resetHeader]);

  const getStatusColor = (estado: string) => {
    const colorMap: Record<string, string> = {
      "Pendiente de validación": "bg-yellow-100 text-yellow-700",
      "En validación": "bg-blue-100 text-blue-700",
      Observada: "bg-orange-100 text-orange-700",
      Rechazada: "bg-red-100 text-red-700",
      "Validada por áreas": "bg-green-100 text-green-700",
      "Lista para RFQ": "bg-purple-100 text-purple-700",
      "Pendiente de precio": "bg-indigo-100 text-indigo-700",
      "Precio cargado": "bg-teal-100 text-teal-700",
      "Ficha aprobada": "bg-emerald-100 text-emerald-700",
    };
    return colorMap[estado] || "bg-slate-100 text-slate-700";
  };

  const getValidationIcon = (estado: EstadoValidacion) => {
    switch (estado) {
      case "Aprobada":
        return <CheckCircle2 size={20} className="text-green-600" />;
      case "Observada":
        return <AlertCircle size={20} className="text-orange-600" />;
      case "Rechazada":
        return <XCircle size={20} className="text-red-600" />;
      default:
        return <MessageSquare size={20} className="text-slate-600" />;
    }
  };

  const handleSubmitComment = () => {
    if (!validacion || !commentText.trim()) return;

    const newComment = {
      id: `COM-${Date.now()}`,
      area: selectedArea,
      validador: "Usuario Actual",
      estado: validationAction,
      comentario: commentText,
      fecha: new Date().toISOString(),
    };

    const updated = {
      ...validacion,
      comentarios: [...validacion.comentarios, newComment],
    };

    // Update the validation state based on action
    if (validationAction === "Observada") {
      updated.estado = "Observada";
      if (selectedArea === "Artes Gráficas") updated.validacionArtesGraficas = "Observada";
      if (selectedArea === "R&D Técnica") updated.validacionRDTecnica = "Observada";
      if (selectedArea === "R&D Desarrollo") updated.validacionRDDesarrollo = "Observada";
    } else if (validationAction === "Rechazada") {
      updated.estado = "Rechazada";
      if (selectedArea === "Artes Gráficas") updated.validacionArtesGraficas = "Rechazada";
      if (selectedArea === "R&D Técnica") updated.validacionRDTecnica = "Rechazada";
      if (selectedArea === "R&D Desarrollo") updated.validacionRDDesarrollo = "Rechazada";
    } else if (validationAction === "Aprobada") {
      if (selectedArea === "Artes Gráficas") updated.validacionArtesGraficas = "Aprobada";
      if (selectedArea === "R&D Técnica") updated.validacionRDTecnica = "Aprobada";
      if (selectedArea === "R&D Desarrollo") updated.validacionRDDesarrollo = "Aprobada";

      // Check if all areas are approved
      if (
        updated.validacionArtesGraficas === "Aprobada" &&
        updated.validacionRDTecnica === "Aprobada" &&
        updated.validacionRDDesarrollo === "Aprobada"
      ) {
        updated.estado = "Validada por áreas";
      }
    }

    updateValidacion(validacion.id, updated);
    setValidacion(updated);
    setCommentText("");
    setShowCommentForm(false);
  };

  if (loading) {
    return (
      <div className="w-full max-w-none bg-[#f6f8fb] flex items-center justify-center h-64">
        <div className="text-slate-600">Cargando validación...</div>
      </div>
    );
  }

  if (!validacion) {
    return (
      <div className="w-full max-w-none bg-[#f6f8fb] flex flex-col items-center justify-center h-64 gap-4">
        <div className="text-red-600 font-semibold">Validación no encontrada</div>
        <button
          onClick={() => navigate("/validaciones")}
          className="px-4 py-2 bg-[#003b5c] text-white rounded-lg text-sm font-medium"
        >
          Volver a Validaciones
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-none bg-[#f6f8fb]">
      {/* Header */}
      <div className="mt-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <button
          onClick={() => navigate("/validaciones")}
          className="mb-4 flex items-center gap-2 text-sm font-medium text-[#003b5c] hover:text-[#002a41]"
        >
          <ArrowLeft size={16} />
          Volver a Validaciones
        </button>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Código Proyecto
            </p>
            <p className="mt-2 text-lg font-bold text-slate-900">
              {validacion.codigoProyecto}
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Nombre Proyecto
            </p>
            <p className="mt-2 text-lg font-bold text-slate-900">
              {validacion.nombreProyecto}
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Cliente
            </p>
            <p className="mt-2 text-lg font-bold text-slate-900">
              {validacion.cliente}
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Estado
            </p>
            <div className="mt-2">
              <span className={`inline-block rounded-full px-4 py-1 text-sm font-bold ${getStatusColor(validacion.estado)}`}>
                {validacion.estado}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Ejecutivo Comercial
            </p>
            <p className="mt-2 text-sm text-slate-700">{validacion.ejecutivoComercial}</p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Planta de Origen
            </p>
            <p className="mt-2 text-sm text-slate-700">{validacion.plantaOrigen}</p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Portafolio
            </p>
            <p className="mt-2 text-sm text-slate-700">{validacion.portafolio}</p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              SLA (Días restantes)
            </p>
            <p className={`mt-2 text-sm font-bold ${validacion.slaDiasRestantes <= 0 ? "text-red-600" : validacion.slaDiasRestantes <= 2 ? "text-orange-600" : "text-green-600"}`}>
              {validacion.slaDiasRestantes} días
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-6 border-b border-slate-200">
        <div className="flex gap-4 bg-white px-6">
          <button
            onClick={() => setActiveTab("general")}
            className={`px-4 py-3 font-medium text-sm transition-colors border-b-2 ${
              activeTab === "general"
                ? "border-[#003b5c] text-[#003b5c]"
                : "border-transparent text-slate-600 hover:text-slate-900"
            }`}
          >
            Información General
          </button>
          <button
            onClick={() => setActiveTab("comentarios")}
            className={`px-4 py-3 font-medium text-sm transition-colors border-b-2 ${
              activeTab === "comentarios"
                ? "border-[#003b5c] text-[#003b5c]"
                : "border-transparent text-slate-600 hover:text-slate-900"
            }`}
          >
            Comentarios ({validacion.comentarios.length})
          </button>
          <button
            onClick={() => setActiveTab("acciones")}
            className={`px-4 py-3 font-medium text-sm transition-colors border-b-2 ${
              activeTab === "acciones"
                ? "border-[#003b5c] text-[#003b5c]"
                : "border-transparent text-slate-600 hover:text-slate-900"
            }`}
          >
            Acciones
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="mt-6">
        {activeTab === "general" && (
          <div className="space-y-6">
            {/* Validation Status */}
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Estado de Validaciones</h3>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="rounded-lg border border-slate-200 p-4">
                  <div className="flex items-center gap-3">
                    {getValidationIcon(validacion.validacionArtesGraficas)}
                    <div>
                      <p className="text-sm font-semibold text-slate-700">Artes Gráficas</p>
                      <p className="text-xs text-slate-500">{validacion.validacionArtesGraficas}</p>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border border-slate-200 p-4">
                  <div className="flex items-center gap-3">
                    {getValidationIcon(validacion.validacionRDTecnica)}
                    <div>
                      <p className="text-sm font-semibold text-slate-700">R&D Técnica</p>
                      <p className="text-xs text-slate-500">{validacion.validacionRDTecnica}</p>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border border-slate-200 p-4">
                  <div className="flex items-center gap-3">
                    {getValidationIcon(validacion.validacionRDDesarrollo)}
                    <div>
                      <p className="text-sm font-semibold text-slate-700">R&D Desarrollo</p>
                      <p className="text-xs text-slate-500">{validacion.validacionRDDesarrollo}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Información General */}
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Información General</h3>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Fecha de Solicitud
                  </p>
                  <p className="mt-1 text-sm text-slate-700">
                    {new Date(validacion.fechaSolicitud).toLocaleDateString("es-PE")}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Portafolio
                  </p>
                  <p className="mt-1 text-sm text-slate-700">{validacion.portafolio}</p>
                </div>
              </div>
            </div>

            {/* Especificaciones Financieras */}
            {validacion.precioMinimo && (
              <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="text-lg font-bold text-slate-900 mb-4">
                  Especificaciones Financieras
                </h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Precio Mínimo
                    </p>
                    <p className="mt-1 text-sm font-bold text-slate-900">
                      {validacion.precioMinimo} {validacion.moneda}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Precio Máximo
                    </p>
                    <p className="mt-1 text-sm font-bold text-slate-900">
                      {validacion.precioMaximo} {validacion.moneda}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Fecha Carga Precio
                    </p>
                    <p className="mt-1 text-sm text-slate-700">
                      {validacion.fechaCargaPrecio
                        ? new Date(validacion.fechaCargaPrecio).toLocaleDateString("es-PE")
                        : "—"}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "comentarios" && (
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Comentarios por Área</h3>

            {validacion.comentarios.length === 0 ? (
              <div className="text-center py-8">
                <MessageSquare size={32} className="mx-auto text-slate-300 mb-2" />
                <p className="text-slate-500">No hay comentarios aún</p>
              </div>
            ) : (
              <div className="space-y-3">
                {validacion.comentarios.map((comentario) => (
                  <div
                    key={comentario.id}
                    className="rounded-lg border border-slate-200 p-4 hover:border-slate-300 transition-colors"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-6 gap-3 text-sm">
                      <div>
                        <p className="font-semibold text-slate-900">{comentario.area}</p>
                      </div>
                      <div>
                        <p className="text-slate-700">{comentario.validador}</p>
                      </div>
                      <div>
                        <span className={`inline-block rounded-full px-2 py-1 text-xs font-bold ${
                          comentario.estado === "Aprobada"
                            ? "bg-green-100 text-green-700"
                            : comentario.estado === "Observada"
                              ? "bg-orange-100 text-orange-700"
                              : "bg-red-100 text-red-700"
                        }`}>
                          {comentario.estado}
                        </span>
                      </div>
                      {comentario.campo && (
                        <div>
                          <p className="text-slate-700 font-medium">{comentario.campo}</p>
                        </div>
                      )}
                      <div className="md:col-span-2">
                        <p className="text-slate-700">{comentario.comentario}</p>
                      </div>
                    </div>
                    <div className="mt-2 text-xs text-slate-500">
                      {new Date(comentario.fecha).toLocaleDateString("es-PE", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "acciones" && (
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Validar Ficha</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Área de Validación
                </label>
                <select
                  value={selectedArea}
                  onChange={(e) => setSelectedArea(e.target.value as AreaValidacion)}
                  className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm outline-none focus:border-[#003b5c] focus:ring-1 focus:ring-[#003b5c]"
                >
                  <option value="Artes Gráficas">Artes Gráficas</option>
                  <option value="R&D Técnica">R&D Técnica</option>
                  <option value="R&D Desarrollo">R&D Desarrollo</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Acción de Validación
                </label>
                <select
                  value={validationAction}
                  onChange={(e) => setValidationAction(e.target.value as EstadoValidacion)}
                  className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm outline-none focus:border-[#003b5c] focus:ring-1 focus:ring-[#003b5c]"
                >
                  <option value="Aprobada">Aprobar</option>
                  <option value="Observada">Observar</option>
                  <option value="Rechazada">Rechazar</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Comentario {validationAction !== "Aprobada" && "*"}
                </label>
                <textarea
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Ingresa tu comentario..."
                  rows={4}
                  className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#003b5c] focus:ring-1 focus:ring-[#003b5c]"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleSubmitComment}
                  disabled={validationAction !== "Aprobada" && !commentText.trim()}
                  className="flex-1 rounded-lg bg-[#003b5c] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#002a41] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Enviar Validación
                </button>
                <button
                  onClick={() => {
                    setCommentText("");
                    setShowCommentForm(false);
                  }}
                  className="flex-1 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:border-slate-300"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
