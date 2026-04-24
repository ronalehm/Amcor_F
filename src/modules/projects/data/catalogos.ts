export interface CatalogoOption {
  value: string
  label: string
}

export interface SegmentoOption extends CatalogoOption {
  group: string
}

export const TIPO_OPORTUNIDAD: CatalogoOption[] = [
  { value: "Nuevo", label: "Nuevo" },
  { value: "Repetido", label: "Repetido" },
  { value: "Modificado", label: "Modificado" },
]

export const CLASIFICACION: CatalogoOption[] = [
  { value: "Nuevo", label: "Nuevo" },
  { value: "Modificado", label: "Modificado" },
]

export const SUBSECCION_CLASIFICACION: CatalogoOption[] = [
  { value: "Desarrollo_RD", label: "Desarrollo R&D" },
  { value: "Area_Tecnica", label: "Área Técnica" },
]

export const TIPO_PROYECTO: SegmentoOption[] = [
  { value: "Producto nuevo", label: "Producto nuevo", group: "Desarrollo R&D" },
  { value: "Nuevo equipamiento de envasado", label: "Nuevo equipamiento de envasado", group: "Desarrollo R&D" },
  { value: "Nuevos insumos", label: "Nuevos insumos", group: "Desarrollo R&D" },
  { value: "Nueva estructura", label: "Nueva estructura", group: "Desarrollo R&D" },
  { value: "Nuevo formato de envasado", label: "Nuevo formato de envasado", group: "Desarrollo R&D" },
  { value: "Nuevos accesorios", label: "Nuevos accesorios", group: "Desarrollo R&D" },
  { value: "Nuevos procesos por el lado del cliente", label: "Nuevos procesos por el lado del cliente", group: "Desarrollo R&D" },
  { value: "Nuevas temperaturas de envasado y almacenaje", label: "Nuevas temperaturas de envasado y almacenaje", group: "Desarrollo R&D" },
  { value: "Extensión de línea por familia", label: "Extensión de línea por familia", group: "Área Técnica" },
  { value: "Modifica dimensiones", label: "Modifica dimensiones", group: "Área Técnica" },
  { value: "Modifica propiedades", label: "Modifica propiedades", group: "Área Técnica" },
  { value: "Portafolio estándar", label: "Portafolio estándar", group: "Área Técnica" },
  { value: "ICO / BCP", label: "ICO / BCP", group: "Área Técnica" },
]

export const TIPO_PROYECTO_GROUPS = [...new Set(TIPO_PROYECTO.map((s) => s.group))]

export const RUBROS: CatalogoOption[] = [
  { value: "Food", label: "Food" },
  { value: "Fresh Food", label: "Fresh Food" },
  { value: "Snacks & Confectionery", label: "Snacks & Confectionery" },
  { value: "Healthcare", label: "Healthcare" },
  { value: "Pet Food", label: "Pet Food" },
  { value: "Technical Specialities", label: "Technical Specialities" },
  { value: "Non Food", label: "Non Food" },
]

export const SEGMENTOS: SegmentoOption[] = [
  { value: "Culinary", label: "Culinary", group: "Food" },
  { value: "Dehydrated Food", label: "Dehydrated Food", group: "Food" },
  { value: "Processed Fish & Seafood", label: "Processed Fish & Seafood", group: "Food" },
  { value: "Frozen Foods", label: "Frozen Foods", group: "Fresh Food" },
  { value: "Meat, Poultry & Seafood", label: "Meat, Poultry & Seafood", group: "Fresh Food" },
  { value: "Fresh Fish & Seafood", label: "Fresh Fish & Seafood", group: "Fresh Food" },
  { value: "Snack Foods", label: "Snack Foods", group: "Snacks & Confectionery" },
  { value: "Savoury Snacks", label: "Savoury Snacks", group: "Snacks & Confectionery" },
  { value: "Salty Snacks", label: "Salty Snacks", group: "Snacks & Confectionery" },
  { value: "Snack Bars", label: "Snack Bars", group: "Snacks & Confectionery" },
  { value: "Cereal Snacks", label: "Cereal Snacks", group: "Snacks & Confectionery" },
  { value: "Sterilization Pouches, Bags, Reels", label: "Sterilization Pouches, Bags, Reels", group: "Healthcare" },
  { value: "Pet Food Dry", label: "Pet Food Dry", group: "Pet Food" },
  { value: "Pet Food Wet", label: "Pet Food Wet", group: "Pet Food" },
  { value: "Pet Food Snacks & Treats", label: "Pet Food Snacks & Treats", group: "Pet Food" },
  { value: "Technical Components", label: "Technical Components", group: "Technical Specialities" },
  { value: "Technical Packaging", label: "Technical Packaging", group: "Technical Specialities" },
  { value: "Technical Foil", label: "Technical Foil", group: "Technical Specialities" },
  { value: "Home Care", label: "Home Care", group: "Non Food" },
  { value: "Personal Care", label: "Personal Care", group: "Non Food" },
]

export const SEGMENTO_GROUPS = [...new Set(SEGMENTOS.map((s) => s.group))]

export const FORMATOS: SegmentoOption[] = [
  { value: "HFFS - Stand up Pouch - Base cuadrada", label: "HFFS - Stand up Pouch - Base cuadrada", group: "Pouch" },
  { value: "HFFS - Stand up Pouch - Sello Doy Pack", label: "HFFS - Stand up Pouch - Sello Doy Pack", group: "Pouch" },
  { value: "HFFS - Stand up Pouch - Sello en K", label: "HFFS - Stand up Pouch - Sello en K", group: "Pouch" },
  { value: "POUCH PLANO\\DOS SELLOS", label: "POUCH PLANO\\DOS SELLOS", group: "Pouch" },
  { value: "POUCH PLANO\\TRES SELLOS", label: "POUCH PLANO\\TRES SELLOS", group: "Pouch" },
  { value: "POUCH STAND UP\\NORMAL\\FUELLE PROPIO", label: "POUCH STAND UP\\NORMAL\\FUELLE PROPIO", group: "Pouch" },
  { value: "SELLO LATERAL\\CORTE\\CON FUELLE FONDO", label: "SELLO LATERAL\\CORTE\\CON FUELLE FONDO", group: "Bolsa" },
  { value: "SELLO DE FONDO\\SIN FUELLE LATERAL", label: "SELLO DE FONDO\\SIN FUELLE LATERAL", group: "Bolsa" },
  { value: "WICKET", label: "WICKET", group: "Bolsa" },
  { value: "HOJAS", label: "HOJAS", group: "Bolsa" },
  { value: "GENERICA", label: "GENERICA", group: "Lámina" },
  { value: "TISSUE", label: "TISSUE", group: "Lámina" },
  { value: "FOOD", label: "FOOD", group: "Lámina" },
]

export const FORMATO_GROUPS = [...new Set(FORMATOS.map((s) => s.group))]

export const UNIDADES_MEDIDA: CatalogoOption[] = [
  { value: "KGS", label: "KGS" },
  { value: "MLL", label: "MLL" },
]

export const SOSTENIBILIDAD: CatalogoOption[] = [
  { value: "Estandar", label: "Estándar / Convencional" },
  { value: "AmLite", label: "AmLite - Alta barrera sin metal" },
  { value: "AmFiber", label: "AmFiber - Base papel" },
  { value: "EcoGuard", label: "EcoGuard - Reciclable PE/PP" },
  { value: "Compostable", label: "Compostable" },
]