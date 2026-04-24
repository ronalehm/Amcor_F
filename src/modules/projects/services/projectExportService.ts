import { getProjectByCode } from "../../../shared/data/projectStorage";
import { getProjectTrackingState } from "../../../shared/data/projectTrackingStorage";
import { getProjectObservations } from "../../../shared/data/observationStorage";

export const exportProjectToExcelMock = (projectCode: string) => {
  const project = getProjectByCode(projectCode);
  if (!project) {
    alert("No se pudo encontrar el proyecto para exportar.");
    return;
  }

  const tracking = getProjectTrackingState(projectCode);
  const observations = getProjectObservations().filter(o => o.projectCode === projectCode);

  console.group(`Exportando Ficha Técnica de Proyecto: ${project.code}`);
  console.log("Datos del Cliente y Portafolio:", {
    Cliente: project.clientName,
    Portafolio: project.portfolioCode,
    Ruta_Diseño: project.designRoute,
  });
  console.log("Especificaciones:", {
    Envoltura: project.envoltura,
    Sector: project.sector,
    Dimensiones: project.dimensions,
    Sostenibilidad: project.sustainability,
  });
  console.log("Validaciones (Tracking):", tracking);
  console.log("Observaciones Abiertas:", observations.filter(o => o.status === "Abierta"));
  console.groupEnd();

  alert(`Ficha del Proyecto ${project.code} exportada exitosamente a Excel para Commercial Finance.`);
};
