export type RoleCode =
  | "admin"
  | "it_support"
  | "master_data"
  | "commercial"
  | "customer_service"
  | "operations"
  | "readonly";

export type PermissionCode =
  | "users.read"
  | "users.create"
  | "users.update"
  | "users.deactivate"
  | "clients.read"
  | "portfolios.read"
  | "portfolios.create"
  | "portfolios.update"
  | "products.read"
  | "products.create"
  | "products.update"
  | "catalogs.read"
  | "catalogs.update"
  | "restrictions.read"
  | "restrictions.update"
  | "imports.execute"
  | "audit.read"
  | "settings.update";

export interface RoleProfile {
  code: RoleCode;
  name: string;
  description: string;
  permissions: PermissionCode[];
}

export const ROLE_PROFILES: RoleProfile[] = [
  {
    code: "admin",
    name: "Administrador",
    description: "Acceso total al portal ODISEO.",
    permissions: [
      "users.read",
      "users.create",
      "users.update",
      "users.deactivate",
      "clients.read",
      "portfolios.read",
      "portfolios.create",
      "portfolios.update",
      "products.read",
      "products.create",
      "products.update",
      "catalogs.read",
      "catalogs.update",
      "restrictions.read",
      "restrictions.update",
      "imports.execute",
      "audit.read",
      "settings.update",
    ],
  },
  {
    code: "it_support",
    name: "TI Soporte",
    description: "Perfil técnico para soporte, usuarios, auditoría y configuración.",
    permissions: [
      "users.read",
      "users.create",
      "users.update",
      "users.deactivate",
      "clients.read",
      "portfolios.read",
      "products.read",
      "catalogs.read",
      "catalogs.update",
      "restrictions.read",
      "restrictions.update",
      "audit.read",
      "settings.update",
    ],
  },
  {
    code: "master_data",
    name: "Master Data",
    description: "Gestión de datos maestros de negocio, portafolios, productos, catálogos y restricciones.",
    permissions: [
      "clients.read",
      "portfolios.read",
      "portfolios.create",
      "portfolios.update",
      "products.read",
      "products.create",
      "products.update",
      "catalogs.read",
      "catalogs.update",
      "restrictions.read",
      "restrictions.update",
      "imports.execute",
      "audit.read",
    ],
  },
  {
    code: "commercial",
    name: "Comercial",
    description: "Gestión comercial de portafolios y consulta de clientes/productos.",
    permissions: [
      "clients.read",
      "portfolios.read",
      "portfolios.create",
      "portfolios.update",
      "products.read",
      "catalogs.read",
    ],
  },
  {
    code: "customer_service",
    name: "Customer Service",
    description: "Consulta y seguimiento operativo de clientes, portafolios y productos.",
    permissions: [
      "clients.read",
      "portfolios.read",
      "products.read",
      "catalogs.read",
    ],
  },
  {
    code: "operations",
    name: "Operaciones",
    description: "Consulta operativa de productos, portafolios y catálogos necesarios para seguimiento.",
    permissions: [
      "clients.read",
      "portfolios.read",
      "products.read",
      "catalogs.read",
    ],
  },
  {
    code: "readonly",
    name: "Solo Consulta",
    description: "Acceso solo lectura al portal.",
    permissions: [
      "clients.read",
      "portfolios.read",
      "products.read",
      "catalogs.read",
    ],
  },
];

export function hasPermission(role: RoleCode, permission: PermissionCode): boolean {
  const profile = ROLE_PROFILES.find((item) => item.code === role);
  return Boolean(profile?.permissions.includes(permission));
}

export function getRoleProfile(code: RoleCode): RoleProfile | undefined {
  return ROLE_PROFILES.find((item) => item.code === code);
}

export function suggestRoleByArea(area: string): RoleCode {
  const normalizedArea = area.trim().toLowerCase();

  if (normalizedArea.includes("ti") || normalizedArea.includes("sistemas")) {
    return "it_support";
  }

  if (normalizedArea.includes("master data")) {
    return "master_data";
  }

  if (normalizedArea.includes("comercial")) {
    return "commercial";
  }

  if (normalizedArea.includes("customer service") || normalizedArea.includes("servicio")) {
    return "customer_service";
  }

  if (normalizedArea.includes("operaciones")) {
    return "operations";
  }

  return "readonly";
}
