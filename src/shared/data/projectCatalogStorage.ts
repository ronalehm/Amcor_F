export type CatalogItem = {
  id: string;
  code: string;
  name: string;
  description?: string;
  isActive: boolean;
};

// Catálogos específicos para el módulo Proyectos
// Basado en el archivo Excel "02_Proyecto v0 (Técnico)"

// 1. Formato de Plano
export const BLUEPRINT_FORMAT_CATALOG: CatalogItem[] = [
  { id: "1", code: "FP-001", name: "Sachet / Pillow", description: "Bolsa tipo almohada", isActive: true },
  { id: "2", code: "FP-002", name: "Doy Pack - Stand Up", description: "Doy Pack con base", isActive: true },
  { id: "3", code: "FP-003", name: "Doy Pack - Stand Up con Fuelle", description: "Doy Pack con fuelle lateral", isActive: true },
  { id: "4", code: "FP-004", name: "Bolsa Lateral", description: "Bolsa con sello lateral", isActive: true },
  { id: "5", code: "FP-005", name: "Four Side Seal", description: "4 sellos", isActive: true },
  { id: "6", code: "FP-006", name: "Three Side Seal", description: "3 sellos", isActive: true },
  { id: "7", code: "FP-007", name: "Preformado", description: "Bolsa preformada", isActive: true },
  { id: "8", code: "FP-008", name: "Flow Pack", description: "Envasado flow pack", isActive: true },
  { id: "9", code: "FP-009", name: "Stand Up Pouch", description: "Pouch con base stand up", isActive: true },
  { id: "10", code: "FP-010", name: "Flat Bottom", description: "Fondo plano", isActive: true },
  { id: "11", code: "FP-011", name: "Box Pouch", description: "Pouch tipo caja", isActive: true },
  { id: "12", code: "FP-012", name: "Retort Pouch", description: "Pouch para retort", isActive: true },
  { id: "13", code: "FP-013", name: "Roll Stock", description: "Película en rollo", isActive: true },
  { id: "14", code: "FP-014", name: "Shrink Film", description: "Película shrink", isActive: true },
  { id: "15", code: "FP-015", name: "BOLSAS", description: "Bolsas genéricas", isActive: true },
  { id: "16", code: "FP-016", name: "ROLLITOS", description: "Rollos de película", isActive: true },
  { id: "17", code: "FP-017", name: "DOY PACK FUELLE CUADRADO", description: "Doy pack con fuelle cuadrado", isActive: true },
  { id: "18", code: "FP-018", name: "DOY PACK FUELLE LATERAL", description: "Doy pack con fuelle lateral", isActive: true },
  { id: "19", code: "FP-019", name: "DOY PACK SIN FUELLE", description: "Doy pack sin fuelle", isActive: true },
  { id: "20", code: "FP-020", name: "DOY PACK SELLO DOY PACK", description: "Doy pack con sello específico", isActive: true },
];

// 2. Aplicación Técnica
export const TECHNICAL_APPLICATION_CATALOG: CatalogItem[] = [
  { id: "1", code: "TA-001", name: "VFFS - Vertical Form Fill Seal", description: "Envasado vertical", isActive: true },
  { id: "2", code: "TA-002", name: "HFFS - Horizontal Form Fill Seal", description: "Envasado horizontal", isActive: true },
  { id: "3", code: "TA-003", name: "VFFS con Zipper", description: "Envasado vertical con zipper", isActive: true },
  { id: "4", code: "TA-004", name: "HFFS con Zipper", description: "Envasado horizontal con zipper", isActive: true },
  { id: "5", code: "TA-005", name: "VFFS Stand Up", description: "Envasado vertical stand up", isActive: true },
  { id: "6", code: "TA-006", name: "HFFS Doy Pack", description: "Envasado horizontal doy pack", isActive: true },
  { id: "7", code: "TA-007", name: "Preformado Manual", description: "Llenado manual de bolsas preformadas", isActive: true },
  { id: "8", code: "TA-008", name: "Preformado Automático", description: "Llenado automático de bolsas preformadas", isActive: true },
  { id: "9", code: "TA-009", name: "Flow Pack", description: "Envasado en flow pack", isActive: true },
  { id: "10", code: "TA-010", name: "3 Sellos", description: "Sellado en 3 lados", isActive: true },
  { id: "11", code: "TA-011", name: "4 Sellos", description: "Sellado en 4 lados", isActive: true },
  { id: "12", code: "TA-012", name: "Doy Pack Fuelle Cuadrado", description: "Aplicación doy pack fuelle cuadrado", isActive: true },
  { id: "13", code: "TA-013", name: "Doy Pack Fuelle Lateral", description: "Aplicación doy pack fuelle lateral", isActive: true },
];

// 3. Unidad de Medida
export const UNIT_OF_MEASURE_CATALOG: CatalogItem[] = [
  { id: "1", code: "UM-001", name: "unidad", description: "Unidad", isActive: true },
  { id: "2", code: "UM-002", name: "millares", description: "Millares (miles de unidades)", isActive: true },
  { id: "3", code: "UM-003", name: "kilos", description: "Kilogramos", isActive: true },
  { id: "4", code: "UM-004", name: "metros", description: "Metros lineales", isActive: true },
  { id: "5", code: "UM-005", name: "millones_unidades", description: "Millones de unidades", isActive: true },
  { id: "6", code: "UM-006", name: "toneladas", description: "Toneladas", isActive: true },
  { id: "7", code: "UM-007", name: "rollos", description: "Rollos", isActive: true },
];

// 4. Clase de Impresión
export const PRINT_CLASS_CATALOG: CatalogItem[] = [
  { id: "1", code: "PC-001", name: "Sencilla", description: "Impresión sencilla", isActive: true },
  { id: "2", code: "PC-002", name: "Alta Definición", description: "HD - Alta definición", isActive: true },
  { id: "3", code: "PC-003", name: "Ultra HD", description: "UHD - Ultra alta definición", isActive: true },
  { id: "4", code: "PC-004", name: "ESG (Extended Gamut)", description: "Gama extendida de colores", isActive: true },
  { id: "5", code: "PC-005", name: "Omnia", description: "Tecnología Omnia Amcor", isActive: true },
  { id: "6", code: "PC-006", name: "Sin Impresión", description: "Película sin impresión", isActive: true },
];

// 5. Tipo de Impresión
export const PRINT_TYPE_CATALOG: CatalogItem[] = [
  { id: "1", code: "PT-001", name: "Flexografía", description: "Impresión flexográfica", isActive: true },
  { id: "2", code: "PT-002", name: "Rotograbado", description: "Impresión en rotograbado", isActive: true },
  { id: "3", code: "PT-003", name: "Digital", description: "Impresión digital", isActive: true },
  { id: "4", code: "PT-004", name: "Sin Impresión", description: "Sin impresión", isActive: true },
];

// 6. Tipo de Estructura
export const STRUCTURE_TYPE_CATALOG: CatalogItem[] = [
  { id: "1", code: "ST-001", name: "Monocapa", description: "Estructura de una capa", isActive: true },
  { id: "2", code: "ST-002", name: "Dúplex", description: "Estructura de dos capas", isActive: true },
  { id: "3", code: "ST-003", name: "Tríplex", description: "Estructura de tres capas", isActive: true },
  { id: "4", code: "ST-004", name: "Cuádruple", description: "Estructura de cuatro capas", isActive: true },
  { id: "5", code: "ST-005", name: "Coextruida", description: "Estructura coextruida", isActive: true },
  { id: "6", code: "ST-006", name: "Laminada", description: "Estructura laminada", isActive: true },
];

// 7. Tipo de Material / Capas
export const LAYER_MATERIAL_CATALOG: CatalogItem[] = [
  { id: "1", code: "LM-001", name: "PET", description: "Polietileno tereftalato", isActive: true },
  { id: "2", code: "LM-002", name: "PE", description: "Polietileno", isActive: true },
  { id: "3", code: "LM-003", name: "LDPE", description: "Polietileno de baja densidad", isActive: true },
  { id: "4", code: "LM-004", name: "MDPE", description: "Polietileno de media densidad", isActive: true },
  { id: "5", code: "LM-005", name: "HDPE", description: "Polietileno de alta densidad", isActive: true },
  { id: "6", code: "LM-006", name: "LLDPE", description: "Polietileno lineal de baja densidad", isActive: true },
  { id: "7", code: "LM-007", name: "PP", description: "Polipropileno", isActive: true },
  { id: "8", code: "LM-008", name: "BOPP", description: "Polipropileno orientado biaxialmente", isActive: true },
  { id: "9", code: "LM-009", name: "CPP", description: "Polipropileno fundido", isActive: true },
  { id: "10", code: "LM-010", name: "PA (Nylon)", description: "Poliamida", isActive: true },
  { id: "11", code: "LM-011", name: "EVOH", description: "Etileno vinil alcohol", isActive: true },
  { id: "12", code: "LM-012", name: "PVDC", description: "Policloruro de vinilideno", isActive: true },
  { id: "13", code: "LM-013", name: "MetPET", description: "PET metalizado", isActive: true },
  { id: "14", code: "LM-014", name: "MetBOPP", description: "BOPP metalizado", isActive: true },
  { id: "15", code: "LM-015", name: "Papel", description: "Papel kraft o especial", isActive: true },
  { id: "16", code: "LM-016", name: "Aluminio", description: "Lámina de aluminio", isActive: true },
  { id: "17", code: "LM-017", name: "AmPrima", description: "Solución sostenible Amcor", isActive: true },
  { id: "18", code: "LM-018", name: "AmLite", description: "Solución ligera Amcor", isActive: true },
  { id: "19", code: "LM-019", name: "AmFiber", description: "Solución de fibra Amcor", isActive: true },
  { id: "20", code: "LM-020", name: "Bio-based", description: "Material de origen biológico", isActive: true },
];

// 8. Tipo de Zipper
export const ZIPPER_TYPE_CATALOG: CatalogItem[] = [
  { id: "1", code: "ZT-001", name: "Slider", description: "Zipper con slider", isActive: true },
  { id: "2", code: "ZT-002", name: "Standard", description: "Zipper estándar", isActive: true },
  { id: "3", code: "ZT-003", name: "Wide", description: "Zipper ancho", isActive: true },
  { id: "4", code: "ZT-004", name: "Child Resistant", description: "Zipper a prueba de niños", isActive: true },
  { id: "5", code: "ZT-005", name: "Press-to-Close", description: "Cierre presión", isActive: true },
];

// 9. Tipo de Válvula
export const VALVE_TYPE_CATALOG: CatalogItem[] = [
  { id: "1", code: "VT-001", name: "Standard", description: "Válvula estándar", isActive: true },
  { id: "2", code: "VT-002", name: "High Flow", description: "Flujo alto", isActive: true },
  { id: "3", code: "VT-003", name: "Low Profile", description: "Perfil bajo", isActive: true },
];

// 10. Tipo de Esquinas Redondeadas
export const ROUNDED_CORNERS_TYPE_CATALOG: CatalogItem[] = [
  { id: "1", code: "RC-001", name: "Radio Pequeño (5mm)", description: "Esquinas con radio de 5mm", isActive: true },
  { id: "2", code: "RC-002", name: "Radio Medio (10mm)", description: "Esquinas con radio de 10mm", isActive: true },
  { id: "3", code: "RC-003", name: "Radio Grande (15mm)", description: "Esquinas con radio de 15mm", isActive: true },
  { id: "4", code: "RC-004", name: "Personalizado", description: "Radio personalizado", isActive: true },
];

// 11. Tipo de Perforación Pouch
export const POUCH_PERFORATION_TYPE_CATALOG: CatalogItem[] = [
  { id: "1", code: "PP-001", name: "Lineal Horizontal", description: "Perforación lineal horizontal", isActive: true },
  { id: "2", code: "PP-002", name: "Lineal Vertical", description: "Perforación lineal vertical", isActive: true },
  { id: "3", code: "PP-003", name: "Punteado", description: "Perforación punteada", isActive: true },
  { id: "4", code: "PP-004", name: "Microperforación", description: "Microperforación para gas", isActive: true },
];

// 12. Tipo de Perforación Bolsa
export const BAG_PERFORATION_TYPE_CATALOG: CatalogItem[] = [
  { id: "1", code: "BP-001", name: "Euroslot", description: "Ranura euro", isActive: true },
  { id: "2", code: "BP-002", name: "Sombrero", description: "Perforación tipo sombrero", isActive: true },
  { id: "3", code: "BP-003", name: "Doble Sombrero", description: "Doble perforación sombrero", isActive: true },
  { id: "4", code: "BP-004", name: "En O", description: "Perforación circular", isActive: true },
  { id: "5", code: "BP-005", name: "En Delta", description: "Perforación triangular", isActive: true },
];

// 13. Tipo de Pre-Corte
export const PRE_CUT_TYPE_CATALOG: CatalogItem[] = [
  { id: "1", code: "PCUT-001", name: "Lineal", description: "Corte lineal", isActive: true },
  { id: "2", code: "PCUT-002", name: "V", description: "Corte en V", isActive: true },
  { id: "3", code: "PCUT-003", name: "Curvo", description: "Corte curvo", isActive: true },
  { id: "4", code: "PCUT-004", name: "En Arco", description: "Corte en arco", isActive: true },
];

// 14. Venta Nacional / Internacional
export const SALE_TYPE_CATALOG: CatalogItem[] = [
  { id: "1", code: "ST-001", name: "Nacional", description: "Venta dentro del país", isActive: true },
  { id: "2", code: "ST-002", name: "Internacional", description: "Exportación", isActive: true },
];

// 15. Incoterm
export const INCOTERM_CATALOG: CatalogItem[] = [
  { id: "1", code: "IC-001", name: "EXW", description: "Ex Works - En fábrica", isActive: true },
  { id: "2", code: "IC-002", name: "FCA", description: "Free Carrier - Libre transportista", isActive: true },
  { id: "3", code: "IC-003", name: "CPT", description: "Carriage Paid To - Transporte pagado hasta", isActive: true },
  { id: "4", code: "IC-004", name: "CIP", description: "Carriage and Insurance Paid - Transporte y seguro pagado", isActive: true },
  { id: "5", code: "IC-005", name: "DAP", description: "Delivered at Place - Entregado en lugar", isActive: true },
  { id: "6", code: "IC-006", name: "DPU", description: "Delivered at Place Unloaded - Entregado descargado", isActive: true },
  { id: "7", code: "IC-007", name: "DDP", description: "Delivered Duty Paid - Entregado derechos pagados", isActive: true },
  { id: "8", code: "IC-008", name: "FAS", description: "Free Alongside Ship - Libre al costado del buque", isActive: true },
  { id: "9", code: "IC-009", name: "FOB", description: "Free On Board - Libre a bordo", isActive: true },
  { id: "10", code: "IC-010", name: "CFR", description: "Cost and Freight - Costo y flete", isActive: true },
  { id: "11", code: "IC-011", name: "CIF", description: "Cost, Insurance and Freight - Costo, seguro y flete", isActive: true },
];

// 16. País de Destino
export const DESTINATION_COUNTRY_CATALOG: CatalogItem[] = [
  { id: "1", code: "PE", name: "Perú", description: "Perú", isActive: true },
  { id: "2", code: "CL", name: "Chile", description: "Chile", isActive: true },
  { id: "3", code: "CO", name: "Colombia", description: "Colombia", isActive: true },
  { id: "4", code: "EC", name: "Ecuador", description: "Ecuador", isActive: true },
  { id: "5", code: "AR", name: "Argentina", description: "Argentina", isActive: true },
  { id: "6", code: "BR", name: "Brasil", description: "Brasil", isActive: true },
  { id: "7", code: "BO", name: "Bolivia", description: "Bolivia", isActive: true },
  { id: "8", code: "UY", name: "Uruguay", description: "Uruguay", isActive: true },
  { id: "9", code: "PY", name: "Paraguay", description: "Paraguay", isActive: true },
  { id: "10", code: "VE", name: "Venezuela", description: "Venezuela", isActive: true },
  { id: "11", code: "MX", name: "México", description: "México", isActive: true },
  { id: "12", code: "US", name: "Estados Unidos", description: "USA", isActive: true },
  { id: "13", code: "CA", name: "Canadá", description: "Canadá", isActive: true },
  { id: "14", code: "PA", name: "Panamá", description: "Panamá", isActive: true },
  { id: "15", code: "CR", name: "Costa Rica", description: "Costa Rica", isActive: true },
  { id: "16", code: "GT", name: "Guatemala", description: "Guatemala", isActive: true },
  { id: "17", code: "SV", name: "El Salvador", description: "El Salvador", isActive: true },
  { id: "18", code: "HN", name: "Honduras", description: "Honduras", isActive: true },
  { id: "19", code: "NI", name: "Nicaragua", description: "Nicaragua", isActive: true },
  { id: "20", code: "DO", name: "República Dominicana", description: "Rep. Dominicana", isActive: true },
];

// 17. Tipo de Moneda
export const CURRENCY_TYPE_CATALOG: CatalogItem[] = [
  { id: "1", code: "PEN", name: "Soles", description: "Sol peruano", isActive: true },
  { id: "2", code: "USD", name: "Dólares", description: "Dólar estadounidense", isActive: true },
  { id: "3", code: "EUR", name: "Euros", description: "Euro", isActive: true },
];

// 18. Condiciones de Pago
export const PAYMENT_TERMS_CATALOG: CatalogItem[] = [
  { id: "1", code: "PT-001", name: "Contado", description: "Pago inmediato", isActive: true },
  { id: "2", code: "PT-002", name: "30 días", description: "Crédito 30 días", isActive: true },
  { id: "3", code: "PT-003", name: "45 días", description: "Crédito 45 días", isActive: true },
  { id: "4", code: "PT-004", name: "60 días", description: "Crédito 60 días", isActive: true },
  { id: "5", code: "PT-005", name: "90 días", description: "Crédito 90 días", isActive: true },
  { id: "6", code: "PT-006", name: "15 días", description: "Crédito 15 días", isActive: true },
];

// 19. Material de Tuco / Core
export const CORE_MATERIAL_CATALOG: CatalogItem[] = [
  { id: "1", code: "CM-001", name: "Cartón", description: "Core de cartón", isActive: true },
  { id: "2", code: "CM-002", name: "Plástico", description: "Core de plástico", isActive: true },
  { id: "3", code: "CM-003", name: "Metal", description: "Core metálico", isActive: true },
];

// 20. Logo Producto Peruano
export const PERUVIAN_PRODUCT_LOGO_CATALOG: CatalogItem[] = [
  { id: "1", code: "LP-001", name: "Sí", description: "Incluir logo", isActive: true },
  { id: "2", code: "LP-002", name: "No", description: "No incluir logo", isActive: true },
  { id: "3", code: "LP-003", name: "A definir", description: "Por confirmar", isActive: true },
];

// 21. Pie de Imprenta
export const PRINTING_FOOTER_CATALOG: CatalogItem[] = [
  { id: "1", code: "PF-001", name: "Estándar Amcor", description: "Pie de imprenta estándar Amcor", isActive: true },
  { id: "2", code: "PF-002", name: "Personalizado Cliente", description: "Pie de imprenta según especificación cliente", isActive: true },
  { id: "3", code: "PF-003", name: "Sin Pie de Imprenta", description: "Sin pie de imprenta", isActive: true },
];

// 22. Clasificación de Proyecto
export const PROJECT_CLASSIFICATION_CATALOG: CatalogItem[] = [
  { id: "1", code: "PC-N", name: "Nuevo", description: "Producto completamente nuevo", isActive: true },
  { id: "2", code: "PC-M", name: "Modificado", description: "Producto con modificaciones", isActive: true },
  { id: "3", code: "PC-E", name: "Estándar", description: "Producto estándar existente", isActive: true },
];

// 23. Sub-clasificación
export const PROJECT_SUBCLASSIFICATION_CATALOG: CatalogItem[] = [
  { id: "1", code: "PSC-001", name: "SFDC - R&D", description: "Solicitud de desarrollo cliente - R&D", isActive: true },
  { id: "2", code: "PSC-002", name: "SFDC - Técnica", description: "Solicitud de desarrollo cliente - Técnica", isActive: true },
  { id: "3", code: "PSC-003", name: "Estructura", description: "Cambio en estructura", isActive: true },
  { id: "4", code: "PSC-004", name: "Extensiones en línea", description: "Extensiones de línea existente", isActive: true },
  { id: "5", code: "PSC-005", name: "No aplica", description: "No aplica sub-clasificación", isActive: true },
];

// 24. Acción Salesforce
export const SALESFORCE_ACTION_CATALOG: CatalogItem[] = [
  { id: "1", code: "SA-001", name: "Nueva oportunidad", description: "Crear nueva oportunidad en Salesforce", isActive: true },
  { id: "2", code: "SA-002", name: "Oportunidad existente", description: "Actualizar oportunidad existente", isActive: true },
  { id: "3", code: "SA-003", name: "No aplica", description: "No requiere acción Salesforce", isActive: true },
];

// 25. Tipo de Proyecto
export const PROJECT_TYPE_CATALOG: CatalogItem[] = [
  { id: "1", code: "TP-001", name: "Proyecto", description: "Proyecto de desarrollo", isActive: true },
  { id: "2", code: "TP-002", name: "Muestra", description: "Solo muestra", isActive: true },
  { id: "3", code: "TP-003", name: "Ambos", description: "Proyecto y muestra", isActive: true },
];

// 26. Opción Sí/No
export const YES_NO_CATALOG: CatalogItem[] = [
  { id: "1", code: "YN-001", name: "Sí", description: "Sí", isActive: true },
  { id: "2", code: "YN-002", name: "No", description: "No", isActive: true },
];

// 27. Tipo de Archivo de Arte
export const ARTWORK_FILE_TYPE_CATALOG: CatalogItem[] = [
  { id: "1", code: "AFT-001", name: "PDF", description: "Archivo PDF", isActive: true },
  { id: "2", code: "AFT-002", name: "AI (Illustrator)", description: "Adobe Illustrator", isActive: true },
  { id: "3", code: "AFT-003", name: "EPS", description: "Encapsulated PostScript", isActive: true },
  { id: "4", code: "AFT-004", name: "PSD (Photoshop)", description: "Adobe Photoshop", isActive: true },
  { id: "5", code: "AFT-005", name: "CDR (Corel)", description: "CorelDRAW", isActive: true },
  { id: "6", code: "AFT-006", name: "TIF/TIFF", description: "Tagged Image File", isActive: true },
  { id: "7", code: "AFT-007", name: "JPG/JPEG", description: "JPEG", isActive: true },
];

// Funciones helper para obtener catálogos
export function getCatalogByName(name: string): CatalogItem[] | undefined {
  const catalogs: Record<string, CatalogItem[]> = {
    blueprintFormat: BLUEPRINT_FORMAT_CATALOG,
    technicalApplication: TECHNICAL_APPLICATION_CATALOG,
    unitOfMeasure: UNIT_OF_MEASURE_CATALOG,
    printClass: PRINT_CLASS_CATALOG,
    printType: PRINT_TYPE_CATALOG,
    structureType: STRUCTURE_TYPE_CATALOG,
    layerMaterial: LAYER_MATERIAL_CATALOG,
    zipperType: ZIPPER_TYPE_CATALOG,
    valveType: VALVE_TYPE_CATALOG,
    roundedCornersType: ROUNDED_CORNERS_TYPE_CATALOG,
    pouchPerforationType: POUCH_PERFORATION_TYPE_CATALOG,
    bagPerforationType: BAG_PERFORATION_TYPE_CATALOG,
    preCutType: PRE_CUT_TYPE_CATALOG,
    saleType: SALE_TYPE_CATALOG,
    incoterm: INCOTERM_CATALOG,
    destinationCountry: DESTINATION_COUNTRY_CATALOG,
    currencyType: CURRENCY_TYPE_CATALOG,
    paymentTerms: PAYMENT_TERMS_CATALOG,
    coreMaterial: CORE_MATERIAL_CATALOG,
    peruvianProductLogo: PERUVIAN_PRODUCT_LOGO_CATALOG,
    printingFooter: PRINTING_FOOTER_CATALOG,
    classification: PROJECT_CLASSIFICATION_CATALOG,
    subClassification: PROJECT_SUBCLASSIFICATION_CATALOG,
    salesforceAction: SALESFORCE_ACTION_CATALOG,
    projectType: PROJECT_TYPE_CATALOG,
    yesNo: YES_NO_CATALOG,
    artworkFileType: ARTWORK_FILE_TYPE_CATALOG,
  };
  
  return catalogs[name];
}

export function getCatalogItem(catalogName: string, itemCode: string): CatalogItem | undefined {
  const catalog = getCatalogByName(catalogName);
  if (!catalog) return undefined;
  
  return catalog.find((item) => item.code === itemCode || item.id === itemCode);
}

export function getCatalogOptions(catalogName: string): { value: string; label: string }[] {
  const catalog = getCatalogByName(catalogName);
  if (!catalog) return [];
  
  return catalog
    .filter((item) => item.isActive)
    .map((item) => ({
      value: item.code,
      label: item.name,
    }));
}
