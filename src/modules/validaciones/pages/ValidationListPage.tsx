import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLayout } from "../../../components/layout/LayoutContext";
import { getProjectRecords, type ValidationStatus } from "../../../shared/data/projectStorage";
import FormInput from "../../../shared/components/forms/FormInput";
import PreviewRow from "../../../shared/components/display/PreviewRow";

export default function ValidationListPage() {
  const navigate = useNavigate();
  const { setHeader, resetHeader } = useLayout();
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState<ValidationStatus | "">("");

  useEffect(() => {
    setHeader({
      title: "Bandeja de Validaciones",
      subtitle: "Proyectos pendientes de validación por áreas",
    });
    return () => resetHeader();
  }, [setHeader, resetHeader]);

  const projects = useMemo(() => {
    return getProjectRecords().filter(
      (p) => p.validacionSolicitada && p.requiereValidacion
    );
  }, []);

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchSearch = !searchText ||
        project.code.toLowerCase().includes(searchText.toLowerCase()) ||
        project.projectName?.toLowerCase().includes(searchText.toLowerCase()) ||
        project.clientName?.toLowerCase().includes(searchText.toLowerCase());

      const matchStatus = !statusFilter || project.estadoValidacionGeneral === statusFilter;

      return matchSearch && matchStatus;
    });
  }, [projects, searchText, statusFilter]);

  const statusOptions = [
    { value: "", label: "Todos los estados" },
    { value: "Pendiente de validación", label: "Pendiente de validación" },
    { value: "En validación", label: "En validación" },
    { value: "Observada", label: "Observada" },
    { value: "Rechazada", label: "Rechazada" },
    { value: "Validada por áreas", label: "Validada por áreas" },
  ];

  const getStatusBadgeColor = (status: ValidationStatus): string => {
    switch (status) {
      case "Pendiente de validación":
        return "bg-yellow-100 text-yellow-700";
      case "En validación":
        return "bg-amber-100 text-amber-700";
      case "Observada":
        return "bg-orange-100 text-orange-700";
      case "Rechazada":
        return "bg-red-100 text-red-700";
      case "Validada por áreas":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="w-full max-w-none bg-[#f6f8fb] pb-12">
      <div className="space-y-5 p-5">
        {/* Filtros */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormInput
            label="Buscar por código o nombre"
            type="text"
            value={searchText}
            onChange={setSearchText}
            placeholder="PR-000001, Proyecto..."
          />
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Estado de Validación
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as ValidationStatus | "")}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Lista de Proyectos */}
        {filteredProjects.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-slate-300 py-12">
            <div className="text-slate-500 font-medium">
              {projects.length === 0
                ? "No hay proyectos pendientes de validación"
                : "No hay proyectos que coincidan con los filtros"}
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="text-sm text-slate-600 font-medium">
              {filteredProjects.length} proyecto{filteredProjects.length !== 1 ? "s" : ""} pendiente{filteredProjects.length !== 1 ? "s" : ""}
            </div>
            {filteredProjects.map((project) => (
              <div
                key={project.code}
                onClick={() => navigate(`/validaciones/${project.code}`)}
                className="cursor-pointer rounded-lg border border-slate-200 bg-white p-4 transition-all hover:border-blue-500 hover:shadow-md"
              >
                <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                  <PreviewRow label="Código" value={project.code} />
                  <PreviewRow label="Proyecto" value={project.projectName} />
                  <PreviewRow label="Cliente" value={project.clientName} />
                  <div>
                    <div className="text-xs font-bold uppercase text-slate-400 mb-1">Estado</div>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeColor(
                        project.estadoValidacionGeneral
                      )}`}
                    >
                      {project.estadoValidacionGeneral}
                    </span>
                  </div>
                </div>

                {/* Resumen de validaciones por área */}
                {project.validaciones.length > 0 && (
                  <div className="mt-3 border-t border-slate-200 pt-3">
                    <div className="text-xs font-medium text-slate-600 mb-2">
                      Validaciones por área:
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      {project.validaciones.map((validation) => (
                        <div
                          key={validation.area}
                          className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                            validation.estado === "Aprobada"
                              ? "bg-green-100 text-green-700"
                              : validation.estado === "Pendiente"
                                ? "bg-yellow-100 text-yellow-700"
                                : validation.estado === "Observada"
                                  ? "bg-orange-100 text-orange-700"
                                  : "bg-red-100 text-red-700"
                          }`}
                        >
                          {validation.area}: {validation.estado}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
