export interface Client {
  id: string
  nombre: string
  ruc: string
  segmento: string
  contacto: string
  email: string
  telefono: string
  estado: "Activo" | "Inactivo"
  proyectos: number
  fechaRegistro: string
}
