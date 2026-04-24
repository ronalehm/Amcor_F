const OBSERVATIONS_STORAGE_KEY = "odiseo_observations";

export type ObservationStatus = "Abierta" | "Cerrada";

export type ObservationRecord = {
  id: string;
  projectCode: string;
  area: string;
  observationType: string;
  description: string;
  status: ObservationStatus;
  isBlocking: boolean;
  createdBy: string;
  createdAt: string;
  resolvedBy?: string;
  resolvedAt?: string;
};

function safeParseArray<T>(value: string | null): T[] {
  try {
    const parsed = JSON.parse(value || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function persistObservations(records: ObservationRecord[]) {
  localStorage.setItem(OBSERVATIONS_STORAGE_KEY, JSON.stringify(records));
}

export function getProjectObservations(): ObservationRecord[] {
  return safeParseArray<ObservationRecord>(
    localStorage.getItem(OBSERVATIONS_STORAGE_KEY)
  );
}

export function getObservationsByProject(projectCode: string): ObservationRecord[] {
  return getProjectObservations().filter((obs) => obs.projectCode === projectCode);
}

export function getOpenObservationsByProject(projectCode: string): ObservationRecord[] {
  return getObservationsByProject(projectCode).filter((obs) => obs.status === "Abierta");
}

export function saveProjectObservation(observation: Omit<ObservationRecord, "id" | "createdAt" | "status">) {
  const current = getProjectObservations();
  const newObservation: ObservationRecord = {
    ...observation,
    id: `OBS-${Date.now()}`,
    status: "Abierta",
    createdAt: new Date().toISOString(),
  };
  persistObservations([newObservation, ...current]);
  return newObservation;
}

export function closeProjectObservation(id: string, resolvedBy: string) {
  const current = getProjectObservations();
  const updated = current.map((obs) => {
    if (obs.id === id) {
      return {
        ...obs,
        status: "Cerrada" as ObservationStatus,
        resolvedBy,
        resolvedAt: new Date().toISOString(),
      };
    }
    return obs;
  });
  persistObservations(updated);
}

// Tipo para el resumen de proyectos observados
export type ObservedProjectSummary = {
  projectCode: string;
  clientName?: string;
  currentStage?: string;
  openObservations: number;
  totalObservations: number;
  timesObserved: number;
  lastObservationDate: string;
  lastObservationDescription: string;
};

/**
 * Obtiene un resumen de todos los proyectos que tienen observaciones
 * Agrupa por proyecto y calcula métricas
 */
export function getObservedProjectsSummary(): ObservedProjectSummary[] {
  const allObservations = getProjectObservations();

  // Agrupar observaciones por proyecto
  const groupedByProject = allObservations.reduce((acc, obs) => {
    if (!acc[obs.projectCode]) {
      acc[obs.projectCode] = [];
    }
    acc[obs.projectCode].push(obs);
    return acc;
  }, {} as Record<string, ObservationRecord[]>);

  // Crear resumen para cada proyecto
  return Object.entries(groupedByProject).map(([projectCode, observations]) => {
    // Ordenar por fecha (más reciente primero)
    const sorted = observations.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    const openObs = observations.filter((o) => o.status === "Abierta").length;
    const totalObs = observations.length;

    return {
      projectCode,
      clientName: undefined, // Se poblará desde el dashboard
      currentStage: undefined, // Se poblará desde el dashboard
      openObservations: openObs,
      totalObservations: totalObs,
      timesObserved: totalObs,
      lastObservationDate: sorted[0]?.createdAt || "",
      lastObservationDescription: sorted[0]?.description || "",
    };
  });
}
