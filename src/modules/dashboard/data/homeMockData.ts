// src/modules/dashboard/data/homeMockData.ts

export type ProductWrapping = "POUCH" | "BOLSA" | "LAMINA";

export type ProductStatus = "Registrado" | "En preparación" | "Completado";

export type SoldProduct = {
  code: string;
  name: string;
  client: string;
  rubro: string;
  wrapping: ProductWrapping;
  structure: string;
  status: "Completado";
  layerCount: number;
  lastUsed: string;
  successBadge: "Producto más usado";
};

export type RecentClient = {
  name: string;
  lastProduct: string;
  mainRubro: string;
  productsHighlighted: number;
  activePortfolios: number;
};

export type RecentRubro = {
  name: string;
  productCount: number;
  frequentStructure: string;
  frequentWrapping: ProductWrapping;
};

export type Recommendation = {
  type: "completed" | "reference" | "in-preparation" | "sync";
  title: string;
  description: string;
  actionLabel: string;
  route?: string;
  badge?: string;
};

export const SOLD_PRODUCTS: SoldProduct[] = [
  {
    code: "SKU-000250",
    name: "Doypack 250 gr",
    client: "Alicorp S.A.A.",
    rubro: "Alimentos Procesados",
    wrapping: "POUCH",
    structure: "PET / BOPP / PE",
    status: "Completado",
    layerCount: 3,
    lastUsed: "2026-04-20",
    successBadge: "Producto más usado",
  },
  {
    code: "SKU-000222",
    name: "Doypack Mayonesa 22gr",
    client: "Kimberly-Clark Perú",
    rubro: "Salsas y Aderezos",
    wrapping: "POUCH",
    structure: "PET / PE",
    status: "Completado",
    layerCount: 2,
    lastUsed: "2026-04-18",
    successBadge: "Producto más usado",
  },
  {
    code: "SKU-000024",
    name: "Maggie 24g",
    client: "Alicorp S.A.A.",
    rubro: "Alimentos Secos",
    wrapping: "BOLSA",
    structure: "BOPP / PE",
    status: "Completado",
    layerCount: 2,
    lastUsed: "2026-04-15",
    successBadge: "Producto más usado",
  },
  {
    code: "SKU-000025",
    name: "Galleta Crispy 25gr",
    client: "Café Andino Export S.A.C.",
    rubro: "Alimentos Secos",
    wrapping: "LAMINA",
    structure: "BOPP / CPP",
    status: "Completado",
    layerCount: 2,
    lastUsed: "2026-04-10",
    successBadge: "Producto más usado",
  },
];

export const RECENT_CLIENTS: RecentClient[] = [
  {
    name: "Alicorp S.A.A.",
    lastProduct: "Doypack 250 gr",
    mainRubro: "Alimentos Procesados",
    productsHighlighted: 12,
    activePortfolios: 3,
  },
  {
    name: "Kimberly-Clark Perú",
    lastProduct: "Doypack Mayonesa 22gr",
    mainRubro: "Salsas y Aderezos",
    productsHighlighted: 4,
    activePortfolios: 1,
  },
  {
    name: "Café Andino Export S.A.C.",
    lastProduct: "Galleta Crispy 25gr",
    mainRubro: "Alimentos Secos",
    productsHighlighted: 3,
    activePortfolios: 1,
  },
  {
    name: "CIA Importadora Derteano & Stucker S.A.C.",
    lastProduct: "LAMINA Alta Barrera",
    mainRubro: "Alimentos Procesados",
    productsHighlighted: 5,
    activePortfolios: 2,
  },
];

export const RECENT_RUBROS: RecentRubro[] = [
  {
    name: "Alimentos Procesados",
    productCount: 8,
    frequentStructure: "PET / BOPP / PE",
    frequentWrapping: "POUCH",
  },
  {
    name: "Salsas y Aderezos",
    productCount: 6,
    frequentStructure: "PET / PE",
    frequentWrapping: "POUCH",
  },
  {
    name: "Alimentos Secos",
    productCount: 7,
    frequentStructure: "BOPP / PE",
    frequentWrapping: "BOLSA",
  },
  {
    name: "Láminas Impresas",
    productCount: 4,
    frequentStructure: "BOPP / CPP",
    frequentWrapping: "LAMINA",
  },
];

export const QUICK_RECOMMENDATIONS: Recommendation[] = [
  {
    type: "completed",
    title: "Productos completados",
    description: "Fichas de producto completadas y listas para sincronización.",
    actionLabel: "Ver productos",
    route: "/products",
  },
  {
    type: "reference",
    title: "Productos de referencia",
    description: "Productos base que pueden servir como referencia para nuevas fichas.",
    actionLabel: "Ver referencias",
    route: "/portfolio",
  },
  {
    type: "in-preparation",
    title: "Fichas en preparación",
    description: "Fichas de producto actualmente en preparación por equipos.",
    actionLabel: "Ver fichas",
    route: "/products",
  },
];

export type WorkQueueItem = {
  code: string;
  entity: "Ficha de Producto" | "Producto Preliminar" | "SKU" | "Sincronización";
  client: string;
  portfolio?: string;
  product: string;
  status: ProductStatus;
  stage:
    | "Registro de ficha"
    | "Preparación comercial"
    | "Preparación Customer Service"
    | "Preparación técnica"
    | "Preparación de estructura"
    | "Preparación de artes"
    | "Completar datos de producto"
    | "Sincronización con Sistema Integral"
    | "Sincronización con WebCenter";
  nextStep: string;
  actionLabel: string;
  area:
    | "Comercial"
    | "Customer Service"
    | "R&D"
    | "Área Técnica"
    | "Artes Gráficas"
    | "Master Data"
    | "Sistema Integral"
    | "WebCenter";
  priority: "Alta" | "Media" | "Baja";
  dueLabel: string;
  route: string;
  urgency?: "high" | "medium" | "low";
  type:
    | "Producto nuevo sin referencia"
    | "Producto nuevo con referencia"
    | "Producto modificado"
    | "Extensión de línea"
    | "Portafolio estándar";
};

export const WORK_QUEUE: WorkQueueItem[] = [
  {
    code: "FP-2450",
    entity: "Ficha de Producto",
    client: "Alicorp S.A.A.",
    portfolio: "PO-000250",
    product: "Doypack 250 g",
    status: "En preparación",
    stage: "Preparación comercial",
    nextStep: "Completar información comercial",
    actionLabel: "Completar información",
    area: "Comercial",
    priority: "Alta",
    dueLabel: "Hoy",
    route: "/products/FP-2450",
    type: "Producto nuevo sin referencia",
  },
  {
    code: "FP-2451",
    entity: "Ficha de Producto",
    client: "Kimberly-Clark Perú",
    portfolio: "PO-000222",
    product: "Doypack Mayonesa 22gr",
    status: "En preparación",
    stage: "Preparación técnica",
    nextStep: "Revisar especificaciones técnicas",
    actionLabel: "Revisar especificaciones",
    area: "R&D",
    priority: "Alta",
    dueLabel: "Vence mañana",
    route: "/products/FP-2451",
    type: "Producto nuevo con referencia",
  },
  {
    code: "FP-2452",
    entity: "Ficha de Producto",
    client: "Café Andino Export S.A.C.",
    portfolio: "PO-000025",
    product: "Galleta Crispy 25gr",
    status: "En preparación",
    stage: "Preparación Customer Service",
    nextStep: "Completar datos de producto",
    actionLabel: "Completar datos",
    area: "Customer Service",
    priority: "Media",
    dueLabel: "2 días",
    route: "/products/FP-2452",
    type: "Producto nuevo sin referencia",
  },
  {
    code: "SKU-1823",
    entity: "SKU",
    client: "Alicorp S.A.A.",
    portfolio: "PO-000024",
    product: "Maggie 24g",
    status: "Completado",
    stage: "Sincronización con Sistema Integral",
    nextStep: "Sincronizar con Sistema Integral",
    actionLabel: "Sincronizar",
    area: "Sistema Integral",
    priority: "Media",
    dueLabel: "3 días",
    route: "/products/SKU-1823",
    type: "Extensión de línea",
  },
];
