// src/modules/dashboard/data/homeMockData.ts

export type ProductWrapping = "POUCH" | "BOLSA" | "LAMINA";

export type SoldProduct = {
  code: string;
  name: string;
  client: string;
  rubro: string;
  wrapping: ProductWrapping;
  structure: string;
  status: "Aprobado";
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
  type: "approved-bases" | "validated" | "portfolio" | "similar" | "modified";
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
    status: "Aprobado",
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
    status: "Aprobado",
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
    status: "Aprobado",
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
    status: "Aprobado",
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
    type: "approved-bases",
    title: "Bases aprobadas",
    description: "Productos aprobados que puedes reutilizar como base.",
    actionLabel: "Ver bases",
    route: "/portfolio",
  },
  {
    type: "validated",
    title: "Proyectos validados",
    description: "Proyectos listos para generar producto preliminar.",
    actionLabel: "Ver proyectos",
    route: "/projects",
  },
  {
    type: "portfolio",
    title: "Portafolios activos",
    description: "Oportunidades abiertas de tu cartera comercial.",
    actionLabel: "Ver portafolios",
    route: "/portfolio",
  },
];

export type WorkQueueItem = {
  code: string;
  entity: "Proyecto" | "Producto Preliminar" | "Portafolio";
  client: string;
  portfolio?: string;
  product?: string;
  status:
    | "Registrado"
    | "Ficha completa"
    | "En validación"
    | "Observado"
    | "Validado"
    | "En cotización"
    | "Aprobado cliente"
    | "Pendiente validación"
    | "Pendiente referencia"
    | "Pendiente aprobación";
  nextStep: string;
  actionLabel: string;
  area: "Comercial" | "Artes Gráficas" | "R&D" | "Commercial Finance" | "Sistema Integral";
  priority: "Alta" | "Media" | "Baja";
  dueLabel: string;
  route: string;
  urgency?: "high" | "medium" | "low";
  type?: string;
};

export const WORK_QUEUE: WorkQueueItem[] = [
  {
    code: "PRJ-2450",
    entity: "Proyecto",
    client: "Alicorp S.A.A.",
    portfolio: "PO-000250",
    product: "Doypack 250 g",
    status: "Ficha completa",
    nextStep: "Solicitar validación técnica",
    actionLabel: "Solicitar validación",
    area: "Comercial",
    priority: "Alta",
    dueLabel: "Hoy",
    route: "/projects/PRJ-2450",
  },
  {
    code: "PRJ-2451",
    entity: "Proyecto",
    client: "Kimberly-Clark Perú",
    portfolio: "PO-000222",
    product: "Doypack Mayonesa 22gr",
    status: "Observado",
    nextStep: "Corregir observación de R&D",
    actionLabel: "Corregir",
    area: "R&D",
    priority: "Alta",
    dueLabel: "Vence mañana",
    route: "/projects/PRJ-2451",
  },
  {
    code: "PRJ-2452",
    entity: "Proyecto",
    client: "Café Andino Export S.A.C.",
    portfolio: "PO-000025",
    product: "Galleta Crispy 25gr",
    status: "Validado",
    nextStep: "Crear producto preliminar",
    actionLabel: "Crear producto",
    area: "Comercial",
    priority: "Media",
    dueLabel: "2 días",
    route: "/products/create?project=PRJ-2452",
  },
  {
    code: "PP-1823",
    entity: "Producto Preliminar",
    client: "Alicorp S.A.A.",
    portfolio: "PO-000024",
    product: "Maggie 24g",
    status: "En cotización",
    nextStep: "Revisar cotización con Commercial Finance",
    actionLabel: "Revisar cotización",
    area: "Commercial Finance",
    priority: "Media",
    dueLabel: "3 días",
    route: "/products/PP-1823",
  },
];
