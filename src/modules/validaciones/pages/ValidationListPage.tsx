import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Eye,
  CheckCircle2,
  AlertCircle,
  Clock,
  XCircle,
} from "lucide-react";
import { useLayout } from "../../../components/layout/LayoutContext";
import { getAllValidaciones } from "../data/validacionesMock";
import type { FichaValidacion, AreaValidacion } from "../types/validaciones";

type FilterArea = "Todas" | AreaValidacion;

export default function ValidationListPage() {
  const navigate = useNavigate();
  const { setHeader, resetHeader } = useLayout();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedArea, setSelectedArea] = useState<FilterArea>("Todas");
  const [selectedStatus, setSelectedStatus] = useState<string>("");

  useEffect(() => {
    setHeader({
      title: "Validaciones",
      breadcrumbs: [{ label: "Validaciones" }, { label: "Bandeja de Validaciones" }],
    });
    return () => resetHeader();
  }, [setHeader, resetHeader]);

  const validaciones = useMemo(() => getAllValidaciones(), []);

  const statusCounts = useMemo(() => {
    return {
      pendientes: validaciones.filter((v) => v.estado === "Pendiente de validación").length,
      enValidacion: validaciones.filter((v) => v.estado === "En validación").length,
      observadas: validaciones.filter((v) => v.estado === "Observada").length,
      validadas: validaciones.filter((v) => v.estado === "Validada por áreas").length,
      pendientePrecio: validaciones.filter((v) => v.estado === "Pendiente de precio").length,
      aprobadas: validaciones.filter((v) => v.estado === "Ficha aprobada").length,
    };
  }, [validaciones]);

  const filteredValidaciones = useMemo(() => {
    const search = searchQuery.toLowerCase();

    return validaciones.filter((v) => {
      const matchesSearch =
        !search ||
        v.codigoProyecto.toLowerCase().includes(search) ||
        v.nombreProyecto.toLowerCase().includes(search) ||
        v.cliente.toLowerCase().includes(search) ||
        v.ejecutivoComercial.toLowerCase().includes(search);

      const matchesArea =
        selectedArea === "Todas" ||
        (selectedArea === "Artes Gráficas" && v.validacionArtesGraficas !== "Pendiente") ||
        (selectedArea === "R&D Técnica" && v.validacionRDTecnica !== "Pendiente") ||
        (selectedArea === "R&D Desarrollo" && v.validacionRDDesarrollo !== "Pendiente");

      const matchesStatus = !selectedStatus || v.estado === selectedStatus;

      return matchesSearch && matchesArea && matchesStatus;
    });
  }, [validaciones, searchQuery, selectedArea, selectedStatus]);

  const getStatusColor = (estado: string) => {
    switch (estado) {
      case "Pendiente de validación":
        return "bg-yellow-50 border-yellow-200";
      case "En validación":
        return "bg-blue-50 border-blue-200";
      case "Observada":
        return "bg-orange-50 border-orange-200";
      case "Rechazada":
        return "bg-red-50 border-red-200";
      case "Validada por áreas":
        return "bg-green-50 border-green-200";
      case "Lista para RFQ":
        return "bg-purple-50 border-purple-200";
      case "Pendiente de precio":
        return "bg-indigo-50 border-indigo-200";
      case "Precio cargado":
        return "bg-teal-50 border-teal-200";
      case "Ficha aprobada":
        return "bg-emerald-50 border-emerald-200";
      default:
        return "bg-slate-50 border-slate-200";
    }
  };

  const getStatusBadgeColor = (estado: string) => {
    switch (estado) {
      case "Pendiente de validación":
        return "bg-yellow-100 text-yellow-700";
      case "En validación":
        return "bg-blue-100 text-blue-700";
      case "Observada":
        return "bg-orange-100 text-orange-700";
      case "Rechazada":
        return "bg-red-100 text-red-700";
      case "Validada por áreas":
        return "bg-green-100 text-green-700";
      case "Lista para RFQ":
        return "bg-purple-100 text-purple-700";
      case "Pendiente de precio":
        return "bg-indigo-100 text-indigo-700";
      case "Precio cargado":
        return "bg-teal-100 text-teal-700";
      case "Ficha aprobada":
        return "bg-emerald-100 text-emerald-700";
      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  const getValidationBadge = (estado: "Pendiente" | "Aprobada" | "Observada" | "Rechazada") => {
    const styles = {
      Pendiente: "bg-slate-100 text-slate-700",
      Aprobada: "bg-green-100 text-green-700",
      Observada: "bg-orange-100 text-orange-700",
      Rechazada: "bg-red-100 text-red-700",
    };
    return styles[estado];
  };

  const StatCard = ({
    label,
    count,
    icon: Icon,
    color,
  }: {
    label: string;
    count: number;
    icon: React.ReactNode;
    color: string;
  }) => (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            {label}
          </p>
          <p className="mt-2 text-2xl font-bold text-slate-900">{count}</p>
        </div>
        <div className={`rounded-lg p-2 ${color}`}>{Icon}</div>
      </div>
    </div>
  );

  return (
    <div className="w-full max-w-none bg-[#f6f8fb]">
      {/* Stat Cards */}
      <section className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-6">
        <StatCard
          label="Pendientes"
          count={statusCounts.pendientes}
          icon={<Clock size={20} className="text-yellow-600" />}
          color="bg-yellow-50"
        />
        <StatCard
          label="En Validación"
          count={statusCounts.enValidacion}
          icon={<AlertCircle size={20} className="text-blue-600" />}
          color="bg-blue-50"
        />
        <StatCard
          label="Observadas"
          count={statusCounts.observadas}
          icon={<AlertCircle size={20} className="text-orange-600" />}
          color="bg-orange-50"
        />
        <StatCard
          label="Validadas"
          count={statusCounts.validadas}
          icon={<CheckCircle2 size={20} className="text-green-600" />}
          color="bg-green-50"
        />
        <StatCard
          label="Pendiente Precio"
          count={statusCounts.pendientePrecio}
          icon={<Clock size={20} className="text-indigo-600" />}
          color="bg-indigo-50"
        />
        <StatCard
          label="Aprobadas"
          count={statusCounts.aprobadas}
          icon={<CheckCircle2 size={20} className="text-emerald-600" />}
          color="bg-emerald-50"
        />
      </section>

      {/* Filters Section */}
      <section className="mt-6 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          {/* Search */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Buscar
            </label>
            <div className="relative">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                placeholder="Código, cliente, proyecto..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white pl-10 pr-4 py-2 text-sm outline-none transition-colors focus:border-[#003b5c] focus:ring-1 focus:ring-[#003b5c]"
              />
            </div>
          </div>

          {/* Filter by Area */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Área
            </label>
            <select
              value={selectedArea}
              onChange={(e) => setSelectedArea(e.target.value as FilterArea)}
              className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm outline-none transition-colors focus:border-[#003b5c] focus:ring-1 focus:ring-[#003b5c]"
            >
              <option value="Todas">Todas las áreas</option>
              <option value="Artes Gráficas">Artes Gráficas</option>
              <option value="R&D Técnica">R&D Técnica</option>
              <option value="R&D Desarrollo">R&D Desarrollo</option>
            </select>
          </div>

          {/* Filter by Status */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Estado
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm outline-none transition-colors focus:border-[#003b5c] focus:ring-1 focus:ring-[#003b5c]"
            >
              <option value="">Todos los estados</option>
              <option value="Pendiente de validación">Pendiente de validación</option>
              <option value="En validación">En validación</option>
              <option value="Observada">Observada</option>
              <option value="Validada por áreas">Validada por áreas</option>
              <option value="Pendiente de precio">Pendiente de precio</option>
              <option value="Ficha aprobada">Ficha aprobada</option>
            </select>
          </div>

          {/* Clear Filters */}
          <div className="flex items-end">
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedArea("Todas");
                setSelectedStatus("");
              }}
              className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:border-[#003b5c] hover:text-[#003b5c]"
            >
              Limpiar filtros
            </button>
          </div>
        </div>
      </section>

      {/* Validaciones Table */}
      <section className="mt-6 rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#003b5c]">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-white">
                  Código
                </th>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-white">
                  Proyecto
                </th>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-white">
                  Cliente
                </th>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-white">
                  Ejecutivo
                </th>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-white">
                  Estado
                </th>
                <th className="px-4 py-3 text-center text-xs font-bold uppercase tracking-wide text-white">
                  Artes
                </th>
                <th className="px-4 py-3 text-center text-xs font-bold uppercase tracking-wide text-white">
                  R&D Tec
                </th>
                <th className="px-4 py-3 text-center text-xs font-bold uppercase tracking-wide text-white">
                  R&D Des
                </th>
                <th className="px-4 py-3 text-center text-xs font-bold uppercase tracking-wide text-white">
                  SLA
                </th>
                <th className="px-4 py-3 text-center text-xs font-bold uppercase tracking-wide text-white">
                  Acción
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredValidaciones.map((validacion) => (
                <tr
                  key={validacion.id}
                  className={`border-t border-slate-200 transition-colors hover:bg-slate-50 ${getStatusColor(
                    validacion.estado
                  )}`}
                >
                  <td className="px-4 py-3 text-sm font-medium text-slate-900">
                    {validacion.codigoProyecto}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-700">
                    {validacion.nombreProyecto}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-700">
                    {validacion.cliente}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-700">
                    {validacion.ejecutivoComercial}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-block rounded-full px-3 py-1 text-xs font-bold ${getStatusBadgeColor(validacion.estado)}`}>
                      {validacion.estado}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-block rounded-full px-2 py-1 text-xs font-bold ${getValidationBadge(validacion.validacionArtesGraficas)}`}>
                      {validacion.validacionArtesGraficas.charAt(0)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-block rounded-full px-2 py-1 text-xs font-bold ${getValidationBadge(validacion.validacionRDTecnica)}`}>
                      {validacion.validacionRDTecnica.charAt(0)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-block rounded-full px-2 py-1 text-xs font-bold ${getValidationBadge(validacion.validacionRDDesarrollo)}`}>
                      {validacion.validacionRDDesarrollo.charAt(0)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span
                      className={`text-sm font-bold ${
                        validacion.slaDiasRestantes <= 0
                          ? "text-red-600"
                          : validacion.slaDiasRestantes <= 2
                            ? "text-orange-600"
                            : "text-green-600"
                      }`}
                    >
                      {validacion.slaDiasRestantes}d
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => navigate(`/validaciones/${validacion.id}`)}
                      className="inline-flex items-center gap-2 rounded-lg bg-[#003b5c] px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-[#002a41]"
                    >
                      <Eye size={16} />
                      Ver ficha
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredValidaciones.length === 0 && (
          <div className="flex flex-col items-center justify-center px-4 py-12">
            <XCircle size={48} className="text-slate-300 mb-3" />
            <p className="text-slate-500 font-medium">No se encontraron validaciones</p>
            <p className="text-sm text-slate-400 mt-1">Intenta ajustar los filtros de búsqueda</p>
          </div>
        )}
      </section>
    </div>
  );
}
