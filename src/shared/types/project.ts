export type ProjectStatus = "CREADO" | "EN_PROCESO" | "VALIDACION_TECNICA" | "APROBADO"

export type ProjectTab = "activos" | "borradores" | "aprobaciones"

export type Priority = "Alta" | "Media" | "Baja"

export type OpportunityType = "Nuevo" | "Repetido" | "Modificado"

export interface Project {
  id: string
  nombre: string
  cliente: string
  segmento: string
  categoria: string
  productoBase: string
  tipoOportunidad: OpportunityType
  estado: ProjectStatus
  responsable: string
  fechaCreacion: string
  items: number
  prioridad: Priority
}

export interface NormalizedProject {
  id: string
  code: string
  name: string
  description: string
  client: string
  clientKey: string
  status: ProjectStatus
  statusLabel: string
  owner: string
  updatedAt: string
  tab: ProjectTab
  prioridad: Priority
  items: number
  segmento: string
  categoria: string
}

export interface ProjectCreateForm {
  // Seccion I - Informacion General
  id: string
  fechaRegistro: string
  ejecutivoComercial: string
  tipoOportunidad: OpportunityType | ""
  descripcion: string
  // Seccion II - Cliente
  clienteId: string
  // Seccion III - Marco Comun
  rubroPrincipal: string
  segmento: string
  formato: string
  opcionSostenible: string
  nombreBase: string
}
