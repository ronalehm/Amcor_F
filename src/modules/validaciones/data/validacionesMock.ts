import type { FichaValidacion } from "../types/validaciones";

const VALIDACIONES_STORAGE_KEY = "odiseo_validaciones";

const INITIAL_VALIDACIONES: FichaValidacion[] = [
  {
    id: "VAL-001",
    codigoProyecto: "PRY-000001",
    nombreProyecto: "Empaque Premium Chocolate",
    cliente: "CHOCOLATES PERÚ",
    ejecutivoComercial: "José Canny",
    plantaOrigen: "Lima",
    portafolio: "PO-000001",
    estado: "Pendiente de validación",
    fechaSolicitud: "2026-04-22T10:30:00.000Z",
    slaDiasRestantes: 3,
    validacionArtesGraficas: "Pendiente",
    validacionRDTecnica: "Pendiente",
    validacionRDDesarrollo: "Pendiente",
    comentarios: [],
    camposFinalesCompletos: false,
  },
  {
    id: "VAL-002",
    codigoProyecto: "PRY-000002",
    nombreProyecto: "Filme para Alimentos Congelados",
    cliente: "ALIMENTOS CONGELADOS SA",
    ejecutivoComercial: "Diana Fernandez",
    plantaOrigen: "Arequipa",
    portafolio: "PO-000002",
    estado: "En validación",
    fechaSolicitud: "2026-04-20T14:15:00.000Z",
    slaDiasRestantes: 1,
    validacionArtesGraficas: "Pendiente",
    validacionRDTecnica: "Pendiente",
    validacionRDDesarrollo: "Pendiente",
    comentarios: [],
    camposFinalesCompletos: false,
  },
  {
    id: "VAL-003",
    codigoProyecto: "PRY-000003",
    nombreProyecto: "Etiqueta Bebidas Energéticas",
    cliente: "BEBIDAS PERÚ",
    ejecutivoComercial: "Gustavo Lobatón",
    plantaOrigen: "Lima",
    portafolio: "PO-000003",
    estado: "Observada",
    fechaSolicitud: "2026-04-18T09:00:00.000Z",
    slaDiasRestantes: 0,
    validacionArtesGraficas: "Observada",
    validacionRDTecnica: "Aprobada",
    validacionRDDesarrollo: "Pendiente",
    comentarios: [
      {
        id: "COM-001",
        area: "Artes Gráficas",
        validador: "Ana Pérez",
        estado: "Observada",
        campo: "Archivos de arte",
        comentario: "Falta adjuntar archivo de referencia visual en formato PDF",
        fecha: "2026-04-22T15:45:00.000Z",
      },
      {
        id: "COM-002",
        area: "R&D Técnica",
        validador: "Luis Ramos",
        estado: "Aprobada",
        comentario: "Información técnica conforme",
        fecha: "2026-04-22T11:20:00.000Z",
      },
    ],
    camposFinalesCompletos: false,
  },
  {
    id: "VAL-004",
    codigoProyecto: "PRY-000004",
    nombreProyecto: "Bolsa Compostable Productos Frescos",
    cliente: "DISTRIBUIDORA FRESCA",
    ejecutivoComercial: "Fernando Patroni",
    plantaOrigen: "Callao",
    portafolio: "PO-000004",
    estado: "Observada",
    fechaSolicitud: "2026-04-19T13:30:00.000Z",
    slaDiasRestantes: 1,
    validacionArtesGraficas: "Aprobada",
    validacionRDTecnica: "Observada",
    validacionRDDesarrollo: "Aprobada",
    comentarios: [
      {
        id: "COM-003",
        area: "Artes Gráficas",
        validador: "Ana Pérez",
        estado: "Aprobada",
        comentario: "Diseño aprobado",
        fecha: "2026-04-20T10:15:00.000Z",
      },
      {
        id: "COM-004",
        area: "R&D Técnica",
        validador: "Carlos Mendez",
        estado: "Observada",
        campo: "Gramaje",
        comentario: "Confirmar tolerancia de gramaje con cliente antes de proceder",
        fecha: "2026-04-22T14:30:00.000Z",
      },
      {
        id: "COM-005",
        area: "R&D Desarrollo",
        validador: "Carla Ruiz",
        estado: "Aprobada",
        comentario: "Estructura de desarrollo confirmada",
        fecha: "2026-04-21T09:45:00.000Z",
      },
    ],
    camposFinalesCompletos: false,
  },
  {
    id: "VAL-005",
    codigoProyecto: "PRY-000005",
    nombreProyecto: "Caja Corrugada Electrónica",
    cliente: "ELECTRÓNICA GLOBAL",
    ejecutivoComercial: "Oswaldo Loayza",
    plantaOrigen: "Lima",
    portafolio: "PO-000005",
    estado: "Validada por áreas",
    fechaSolicitud: "2026-04-15T11:00:00.000Z",
    slaDiasRestantes: 5,
    validacionArtesGraficas: "Aprobada",
    validacionRDTecnica: "Aprobada",
    validacionRDDesarrollo: "Aprobada",
    comentarios: [
      {
        id: "COM-006",
        area: "Artes Gráficas",
        validador: "Ana Pérez",
        estado: "Aprobada",
        comentario: "Todos los archivos conformes",
        fecha: "2026-04-17T16:20:00.000Z",
      },
      {
        id: "COM-007",
        area: "R&D Técnica",
        validador: "Luis Ramos",
        estado: "Aprobada",
        comentario: "Especificaciones técnicas aprobadas",
        fecha: "2026-04-18T10:00:00.000Z",
      },
      {
        id: "COM-008",
        area: "R&D Desarrollo",
        validador: "Carla Ruiz",
        estado: "Aprobada",
        comentario: "Estructura y dimensiones aprobadas",
        fecha: "2026-04-18T14:30:00.000Z",
      },
    ],
    camposFinalesCompletos: false,
  },
  {
    id: "VAL-006",
    codigoProyecto: "PRY-000006",
    nombreProyecto: "Filme Retráctil Industrial",
    cliente: "INDUSTRIAS METAL",
    ejecutivoComercial: "David Rodriguez",
    plantaOrigen: "Arequipa",
    portafolio: "PO-000006",
    estado: "Pendiente de precio",
    fechaSolicitud: "2026-04-10T09:15:00.000Z",
    slaDiasRestantes: 8,
    validacionArtesGraficas: "Aprobada",
    validacionRDTecnica: "Aprobada",
    validacionRDDesarrollo: "Aprobada",
    comentarios: [
      {
        id: "COM-009",
        area: "Artes Gráficas",
        validador: "María García",
        estado: "Aprobada",
        comentario: "Arte aprobado",
        fecha: "2026-04-12T11:30:00.000Z",
      },
      {
        id: "COM-010",
        area: "R&D Técnica",
        validador: "Luis Ramos",
        estado: "Aprobada",
        comentario: "Técnica aprobada",
        fecha: "2026-04-12T13:00:00.000Z",
      },
      {
        id: "COM-011",
        area: "R&D Desarrollo",
        validador: "Carla Ruiz",
        estado: "Aprobada",
        comentario: "Desarrollo aprobado",
        fecha: "2026-04-13T10:15:00.000Z",
      },
    ],
    camposFinalesCompletos: false,
  },
  {
    id: "VAL-007",
    codigoProyecto: "PRY-000007",
    nombreProyecto: "Empaque Cosmético Lujo",
    cliente: "COSMÉTICOS LATINA",
    ejecutivoComercial: "Manuel Huerta",
    plantaOrigen: "Lima",
    portafolio: "PO-000007",
    estado: "Ficha aprobada",
    fechaSolicitud: "2026-04-01T08:00:00.000Z",
    slaDiasRestantes: 15,
    validacionArtesGraficas: "Aprobada",
    validacionRDTecnica: "Aprobada",
    validacionRDDesarrollo: "Aprobada",
    comentarios: [
      {
        id: "COM-012",
        area: "Artes Gráficas",
        validador: "Ana Pérez",
        estado: "Aprobada",
        comentario: "Diseño premium aprobado",
        fecha: "2026-04-03T15:45:00.000Z",
      },
      {
        id: "COM-013",
        area: "R&D Técnica",
        validador: "Luis Ramos",
        estado: "Aprobada",
        comentario: "Especificaciones de lujo aprobadas",
        fecha: "2026-04-04T10:30:00.000Z",
      },
      {
        id: "COM-014",
        area: "R&D Desarrollo",
        validador: "Carla Ruiz",
        estado: "Aprobada",
        comentario: "Estructura premium aprobada",
        fecha: "2026-04-05T09:00:00.000Z",
      },
    ],
    precioMinimo: 2500,
    precioMaximo: 3200,
    moneda: "USD",
    fechaCargaPrecio: "2026-04-08T14:20:00.000Z",
    camposFinalesCompletos: true,
  },
];

function safeParseArray<T>(value: string | null): T[] {
  try {
    const parsed = JSON.parse(value || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function persistValidaciones(records: FichaValidacion[]) {
  localStorage.setItem(VALIDACIONES_STORAGE_KEY, JSON.stringify(records));
}

export function getCreatedValidaciones(): FichaValidacion[] {
  return safeParseArray<FichaValidacion>(
    localStorage.getItem(VALIDACIONES_STORAGE_KEY)
  );
}

export function getAllValidaciones(): FichaValidacion[] {
  const created = getCreatedValidaciones();
  const createdIds = new Set(created.map((v) => v.id));
  const initialWithoutDuplicates = INITIAL_VALIDACIONES.filter(
    (v) => !createdIds.has(v.id)
  );
  return [...created, ...initialWithoutDuplicates];
}

export function getValidacionById(id: string): FichaValidacion | undefined {
  return getAllValidaciones().find((v) => v.id === id);
}

export function saveValidacion(validacion: FichaValidacion): void {
  const created = getCreatedValidaciones();
  const filtered = created.filter((v) => v.id !== validacion.id);
  persistValidaciones([validacion, ...filtered]);
}

export function updateValidacion(
  id: string,
  updates: Partial<FichaValidacion>
): FichaValidacion | null {
  const validacion = getValidacionById(id);
  if (!validacion) return null;

  const updated: FichaValidacion = {
    ...validacion,
    ...updates,
  };

  saveValidacion(updated);
  return updated;
}

export function getValidacionesByEstado(estado: string): FichaValidacion[] {
  return getAllValidaciones().filter((v) => v.estado === estado);
}

export function getValidacionesByArea(area: string): FichaValidacion[] {
  return getAllValidaciones().filter((v) => {
    if (area === "Artes Gráficas" && v.validacionArtesGraficas !== "Pendiente") {
      return true;
    }
    if (area === "R&D Técnica" && v.validacionRDTecnica !== "Pendiente") {
      return true;
    }
    if (area === "R&D Desarrollo" && v.validacionRDDesarrollo !== "Pendiente") {
      return true;
    }
    return false;
  });
}
