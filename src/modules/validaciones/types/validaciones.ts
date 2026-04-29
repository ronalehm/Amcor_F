export type AreaValidacion = "Artes Gráficas" | "R&D Técnica" | "R&D Desarrollo";
export type EstadoValidacion = "Pendiente" | "Aprobada" | "Observada" | "Rechazada";
export type ValidationStatus =
  | "Borrador"
  | "Pendiente de validación"
  | "En validación"
  | "Observada"
  | "Rechazada"
  | "Validada por áreas"
  | "Lista para RFQ"
  | "Pendiente de precio"
  | "Precio cargado"
  | "Ficha aprobada";

export interface ComentarioValidacion {
  id: string;
  area: AreaValidacion;
  validador: string;
  estado: EstadoValidacion;
  campo?: string;
  comentario: string;
  fecha: string;
}

export interface FichaValidacion {
  id: string;
  codigoProyecto: string;
  nombreProyecto: string;
  cliente: string;
  ejecutivoComercial: string;
  plantaOrigen: string;
  portafolio: string;
  estado: ValidationStatus;
  fechaSolicitud: string;
  slaDiasRestantes: number;

  validacionArtesGraficas: EstadoValidacion;
  validacionRDTecnica: EstadoValidacion;
  validacionRDDesarrollo: EstadoValidacion;

  comentarios: ComentarioValidacion[];

  precioMinimo?: number;
  precioMaximo?: number;
  moneda?: string;
  archivoPrecio?: string;
  fechaCargaPrecio?: string;

  camposFinalesCompletos: boolean;
}
