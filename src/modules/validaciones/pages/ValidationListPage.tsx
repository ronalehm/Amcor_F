import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLayout } from "../../../components/layout/LayoutContext";
import { getProjectRecords } from "../../../shared/data/projectStorage";
import { normalizeProjectWorkflow } from "../../../shared/data/projectWorkflow";
import FormInput from "../../../shared/components/forms/FormInput";

type ValidationArea = "todas" | "artesGraficas" | "rdTecnica" | "rdDesarrollo"

export default function ValidationListPage() {
  const navigate = useNavigate();
  const { setHeader, resetHeader } = useLayout();
  const [searchText, setSearchText] = useState("");
  const [areaFilter, setAreaFilter] = useState<ValidationArea>("todas");

  useEffect(() => {
    setHeader({
      title: "Bandeja de Validaciones",
      subtitle: "Proyectos pendientes de validación por áreas",
    });
    return () => resetHeader();
  }, [setHeader, resetHeader]);

  // Obtener todos los proyectos
  const allProjects = useMemo(() => getProjectRecords(), []);

  // Filtrar proyectos en validación según currentValidationStep y validador asignado
  const projectsNeedingValidation = useMemo(() => {
    return allProjects.filter(p => {
      const project = normalizeProjectWorkflow(p);

      // Solo proyectos en validación (no Observado, que vuelve al Ejecutivo)
      if (project.status !== "En validación") return false;

      // Artes Gráficas: solo si currentStep es "Artes Gráficas"
      if (project.currentValidationStep === "Artes Gráficas") {
        return (
          project.graphicArtsValidationStatus === "Pendiente revisión manual" ||
          project.graphicArtsValidationStatus === "En revisión"
        );
      }

      // R&D Técnica: solo si currentStep es "R&D Técnica" Y está asignado a esta subárea
      if (project.currentValidationStep === "R&D Técnica") {
        return (
          project.technicalSubArea === "R&D Técnica" &&
          (project.technicalValidationStatus === "Pendiente" ||
           project.technicalValidationStatus === "En revisión")
        );
      }

      // R&D Desarrollo: solo si currentStep es "R&D Desarrollo" Y está asignado a esta subárea
      if (project.currentValidationStep === "R&D Desarrollo") {
        return (
          project.technicalSubArea === "R&D Desarrollo" &&
          (project.technicalValidationStatus === "Pendiente" ||
           project.technicalValidationStatus === "En revisión")
        );
      }

      return false;
    });
  }, [allProjects]);

  // Determinar qué área valida cada proyecto
  const projectsWithArea = useMemo(() => {
    return projectsNeedingValidation.map(p => {
      let validatingArea = "Artes Gráficas";

      if (p.currentValidationStep === "R&D Técnica") {
        validatingArea = "R&D Técnica";
      } else if (p.currentValidationStep === "R&D Desarrollo") {
        validatingArea = "R&D Desarrollo";
      }

      return { project: p, validatingArea };
    });
  }, [projectsNeedingValidation]);

  // Filtrar por área
  const filteredByArea = useMemo(() => {
    if (areaFilter === "todas") return projectsWithArea;
    if (areaFilter === "artesGraficas") return projectsWithArea.filter(x => x.validatingArea === "Artes Gráficas");
    if (areaFilter === "rdTecnica") return projectsWithArea.filter(x => x.validatingArea === "R&D Técnica");
    if (areaFilter === "rdDesarrollo") return projectsWithArea.filter(x => x.validatingArea === "R&D Desarrollo");
    return projectsWithArea;
  }, [projectsWithArea, areaFilter]);

  // Filtrar por búsqueda
  const filteredBySearch = useMemo(() => {
    if (!searchText) return filteredByArea;
    const lower = searchText.toLowerCase();
    return filteredByArea.filter(
      x =>
        x.project.code.toLowerCase().includes(lower) ||
        x.project.projectName?.toLowerCase().includes(lower) ||
        x.project.clientName?.toLowerCase().includes(lower)
    );
  }, [filteredByArea, searchText]);

  const getValidationStatusBadge = (area: string, status: string): string => {
    if (area === "Artes Gráficas") {
      switch (status) {
        case "Pendiente revisión manual":
          return "bg-yellow-100 text-yellow-800";
        case "En revisión":
          return "bg-amber-100 text-amber-800";
        case "Observado":
          return "bg-orange-100 text-orange-800";
        default:
          return "bg-gray-100 text-gray-700";
      }
    } else {
      switch (status) {
        case "Pendiente":
          return "bg-yellow-100 text-yellow-800";
        case "En revisión":
          return "bg-amber-100 text-amber-800";
        case "Observado":
          return "bg-orange-100 text-orange-800";
        default:
          return "bg-gray-100 text-gray-700";
      }
    }
  };

  const getValidationStatus = (area: string, project: any): string => {
    if (area === "Artes Gráficas") {
      return project.graphicArtsValidationStatus || "Pendiente";
    } else {
      return project.technicalValidationStatus || "Pendiente";
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
              Área Validadora
            </label>
            <select
              value={areaFilter}
              onChange={(e) => setAreaFilter(e.target.value as ValidationArea)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            >
              <option value="todas">Todas las áreas</option>
              <option value="artesGraficas">Artes Gráficas</option>
              <option value="rdTecnica">R&D Técnica</option>
              <option value="rdDesarrollo">R&D Desarrollo</option>
            </select>
          </div>
        </div>

        {/* Lista de Proyectos */}
        {filteredBySearch.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-slate-300 py-12">
            <div className="text-slate-500 font-medium">
              {projectsNeedingValidation.length === 0
                ? "No hay proyectos pendientes de validación"
                : "No hay proyectos que coincidan con los filtros"}
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="text-sm text-slate-600 font-medium">
              {filteredBySearch.length} proyecto{filteredBySearch.length !== 1 ? "s" : ""} pendiente{filteredBySearch.length !== 1 ? "s" : ""}
            </div>

            <div className="overflow-x-auto bg-white rounded-lg border border-slate-200">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <th className="text-left px-4 py-3 font-medium text-slate-700">Código</th>
                    <th className="text-left px-4 py-3 font-medium text-slate-700">Proyecto</th>
                    <th className="text-left px-4 py-3 font-medium text-slate-700">Cliente</th>
                    <th className="text-left px-4 py-3 font-medium text-slate-700">Estado</th>
                    <th className="text-left px-4 py-3 font-medium text-slate-700">Área Validadora</th>
                    <th className="text-left px-4 py-3 font-medium text-slate-700">Estado Validación</th>
                    <th className="text-left px-4 py-3 font-medium text-slate-700">Complejidad</th>
                    <th className="text-center px-4 py-3 font-medium text-slate-700">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBySearch.map(({ project, validatingArea }) => (
                    <tr
                      key={project.code}
                      className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
                    >
                      <td className="px-4 py-3 font-mono text-xs text-slate-700">{project.code}</td>
                      <td className="px-4 py-3 max-w-xs">
                        <div className="font-medium text-slate-900 truncate">{project.projectName}</div>
                      </td>
                      <td className="px-4 py-3 text-slate-600">{project.clientName || "—"}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                          project.status === "En validación" ? "bg-blue-100 text-blue-800" : "bg-orange-100 text-orange-800"
                        }`}>
                          {project.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-700">{validatingArea}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${getValidationStatusBadge(validatingArea, getValidationStatus(validatingArea, project))}`}>
                          {getValidationStatus(validatingArea, project)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-600">
                        {project.technicalComplexity || "—"}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => navigate(`/validaciones/${project.code}`)}
                          className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 font-medium"
                        >
                          Ver
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
