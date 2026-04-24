export interface CatalogoOption {
  value: string
  label: string
}

export interface SegmentoOption extends CatalogoOption {
  group: string
}

// --- I. TIPO DE OPORTUNIDAD ---
export const TIPO_OPORTUNIDAD: CatalogoOption[] = [
  { value: "Nuevo", label: "Nuevo" },
  { value: "Repetido", label: "Repetido" },
  { value: "Modificado", label: "Modificado" },
]

// --- III. RUBRO PRINCIPAL ---
export const RUBROS: CatalogoOption[] = [
  { value: "FMCG", label: "Consumo Masivo (FMCG)" },
  { value: "Healthcare", label: "Cuidado de la Salud (Healthcare)" },
  { value: "Industrial", label: "Industrial y Especialidades" },
]

// --- III. INDUSTRIA / SEGMENTO (con optgroups) ---
export const SEGMENTOS: SegmentoOption[] = [
  // Alimentos & Bebidas
  { value: "Alimentos", label: "Alimentos (Frescos/Procesados)", group: "Alimentos & Bebidas" },
  { value: "Bebidas", label: "Bebidas (Etiquetas/Tapas)", group: "Alimentos & Bebidas" },
  { value: "Lácteos", label: "Lácteos", group: "Alimentos & Bebidas" },
  { value: "Snacks y Confitería", label: "Snacks y Confitería", group: "Alimentos & Bebidas" },
  { value: "Café y Té", label: "Café y Té", group: "Alimentos & Bebidas" },
  { value: "Congelados", label: "Congelados", group: "Alimentos & Bebidas" },
  // Hogar y Personal
  { value: "Cuidado Personal", label: "Cuidado Personal (Beauty)", group: "Hogar y Personal" },
  { value: "Cuidado del Hogar", label: "Cuidado del Hogar (Home Care)", group: "Hogar y Personal" },
  // Especializados
  { value: "Farmacéutico", label: "Farmacéutica", group: "Especializados" },
  { value: "Pet Food", label: "Pet Food (Mascotas)", group: "Especializados" },
  { value: "Agroindustrial", label: "Agroindustrial", group: "Especializados" },
  { value: "Industrial", label: "Industrial", group: "Especializados" },
]

// Grupos úicos para renderizar optgroups
export const SEGMENTO_GROUPS = [...new Set(SEGMENTOS.map((s) => s.group))]

// --- III. TECNOLOG\u00cdA / FORMATO ---
export const FORMATOS: CatalogoOption[] = [
  { value: "Rollstock", label: "Laminados y Películas (Rollstock)" },
  { value: "Pouches", label: "Bolsas y Sobres (Stand-up Pouches)" },
  { value: "Lidding", label: "Tapas y Sellos (Lidding)" },
  { value: "FormPack", label: "Blísters (FormPack)" },
  { value: "Etiquetas", label: "Etiquetas" },
]

// --- III. OPCI\u00d3N SOSTENIBLE ---
export const SOSTENIBILIDAD: CatalogoOption[] = [
  { value: "Estandar", label: "Estándar (Convencional)" },
  { value: "AmLite", label: "AmLite (Alta Barrera sin Metal)" },
  { value: "AmFiber", label: "AmFiber (Base Papel)" },
  { value: "EcoGuard", label: "EcoGuard (Reciclable PE/PP)" },
  { value: "Compostable", label: "Compostable" },
]
