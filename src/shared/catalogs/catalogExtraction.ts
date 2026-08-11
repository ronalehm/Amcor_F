/**
 * Catalog Extraction Functions
 * Consolidates catalogs from ProductEditPage and PortfolioEditPage
 * Version: 1.0
 * Date: 2026-08-10
 */

import { PRODUCT_CATALOGS } from '../data/productCatalogs';
import { CATALOG_REGISTRY } from './catalog.registry';
import { getCatalogOptions } from './catalog.service';
import {
  getStatusCatalog,
  getPlantsCatalog,
  getWrappingsCatalog,
  getFinalUses,
  getPackingMachinesByWrappingId,
} from './portfolio-adapters';
import { getClientCatalogRecords } from '../data/clientStorage';
import { getActiveExecutiveRecords } from '../data/executiveStorage';

// ═══════════════════════════════════════════════════════════════
// TYPE DEFINITIONS
// ═══════════════════════════════════════════════════════════════

export type CatalogSource = 'ODISEO' | 'PORTFOLIO' | 'SISTEMA_INTEGRAL';
export type PageOrigin = 'ProductEditPage' | 'PortfolioEditPage' | 'Both';

export interface CatalogValue {
  code: string;
  label: string;
  description?: string;
  imageUrl?: string;
  metadata?: Record<string, unknown>;
  active?: boolean;
}

export interface ConsolidatedCatalog {
  id: string;
  name: string;
  code: string;
  description: string;
  source: CatalogSource;
  pageOrigin: PageOrigin;
  values: CatalogValue[];
  version: string;
  lastUpdated: Date;
  updatedBy?: string;
  ownerSystem?: string;
  editable: boolean;
  maxSelectable?: number;
  cascadedFrom?: string;
}

export interface CatalogDiff {
  catalogId: string;
  added: CatalogValue[];
  removed: CatalogValue[];
  modified: Array<{
    value: CatalogValue;
    previousLabel: string;
    changes: string[];
  }>;
}

// ═══════════════════════════════════════════════════════════════
// EXTRACTION FROM PRODUCTEDITPAGE.TSX
// ═══════════════════════════════════════════════════════════════

/**
 * Extract all ODISEO catalogs from ProductEditPage (combined from PRODUCT_CATALOGS + CATALOG_REGISTRY)
 */
export function extractProductEditPageCatalogs(): Record<
  string,
  ConsolidatedCatalog
> {
  const catalogs: Record<string, ConsolidatedCatalog> = {};

  // === FROM PRODUCT_CATALOGS (Technical Product Catalogs) ===

  // 1. Sentido de Embobinado (LÁMINA specific)
  if (PRODUCT_CATALOGS.sentidoDeEmbobinado) {
    catalogs['sentidoDeEmbobinado'] = {
      id: 'sentidoDeEmbobinado',
      name: 'Sentido de Embobinado',
      code: 'BOB',
      description: 'Dirección de bobinado del rollo para productos LÁMINA',
      source: 'ODISEO',
      pageOrigin: 'ProductEditPage',
      values: PRODUCT_CATALOGS.sentidoDeEmbobinado.values.map((value: string) => ({
        code: `BOB-${value.substring(0, 1).toUpperCase()}`,
        label: value,
        active: true,
      })),
      version: '1.0',
      lastUpdated: new Date(),
      ownerSystem: 'ODISEO',
      editable: true,
    };
  }

  // 2. Accesorios Internos
  if (PRODUCT_CATALOGS.accesoriosInternos) {
    catalogs['accesoriosInternos'] = {
      id: 'accesoriosInternos',
      name: 'Accesorios Internos',
      code: 'INT',
      description: 'Accesorios internos disponibles (máx 3)',
      source: 'ODISEO',
      pageOrigin: 'ProductEditPage',
      values: PRODUCT_CATALOGS.accesoriosInternos.values.map((value: string) => ({
        code: value.substring(0, 3).toUpperCase(),
        label: value,
        active: true,
      })),
      version: '1.0',
      lastUpdated: new Date(),
      ownerSystem: 'ODISEO',
      editable: true,
      maxSelectable: 3,
    };
  }

  // 3. Diámetro de Wicket
  if (PRODUCT_CATALOGS.diametroDeWicket) {
    catalogs['diametroDeWicket'] = {
      id: 'diametroDeWicket',
      name: 'Diámetro de Wicket',
      code: 'WIC',
      description: 'Diámetros disponibles para wicket',
      source: 'ODISEO',
      pageOrigin: 'ProductEditPage',
      values: PRODUCT_CATALOGS.diametroDeWicket.values.map((value: string) => ({
        code: value,
        label: value,
        active: true,
      })),
      version: '1.0',
      lastUpdated: new Date(),
      ownerSystem: 'ODISEO',
      editable: true,
    };
  }

  // 4. Zipper
  if (PRODUCT_CATALOGS.zipper) {
    catalogs['zipper'] = {
      id: 'zipper',
      name: 'Zipper',
      code: 'ZIP',
      description: 'Tipos de zipper disponibles para pouches',
      source: 'ODISEO',
      pageOrigin: 'ProductEditPage',
      values: PRODUCT_CATALOGS.zipper.values.map((value: string) => ({
        code: value.substring(0, 3).toUpperCase(),
        label: value,
        active: true,
      })),
      version: '1.0',
      lastUpdated: new Date(),
      ownerSystem: 'ODISEO',
      editable: true,
    };
  }

  // 7. Válvula
  if (PRODUCT_CATALOGS.valvula) {
    catalogs['valvula'] = {
      id: 'valvula',
      name: 'Válvula',
      code: 'VLV',
      description: 'Tipos de válvula disponibles para pouches',
      source: 'ODISEO',
      pageOrigin: 'ProductEditPage',
      values: PRODUCT_CATALOGS.valvula.values.map((value: string) => ({
        code: value.substring(0, 3).toUpperCase(),
        label: value,
        active: true,
      })),
      version: '1.0',
      lastUpdated: new Date(),
      ownerSystem: 'ODISEO',
      editable: true,
    };
  }

  // 8. Acabado
  if (PRODUCT_CATALOGS.acabado) {
    catalogs['acabado'] = {
      id: 'acabado',
      name: 'Acabado',
      code: 'FIN',
      description: 'Acabados disponibles (Mate/Brillante/Protección)',
      source: 'ODISEO',
      pageOrigin: 'ProductEditPage',
      values: PRODUCT_CATALOGS.acabado.values.map((value: string) => ({
        code: value.substring(0, 3).toUpperCase(),
        label: value,
        active: true,
      })),
      version: '1.0',
      lastUpdated: new Date(),
      ownerSystem: 'ODISEO',
      editable: true,
    };
  }

  // 9. Clasificación
  if (PRODUCT_CATALOGS.clasificacion) {
    catalogs['clasificacion'] = {
      id: 'clasificacion',
      name: 'Clasificación',
      code: 'CLASS',
      description: 'Producto Nuevo / Modificado',
      source: 'ODISEO',
      pageOrigin: 'ProductEditPage',
      values: PRODUCT_CATALOGS.clasificacion.values.map((value: string) => ({
        code: value.substring(0, 3).toUpperCase(),
        label: value,
        active: true,
      })),
      version: '1.0',
      lastUpdated: new Date(),
      ownerSystem: 'ODISEO',
      editable: true,
    };
  }

  // 10. Aplicación Técnica
  if (PRODUCT_CATALOGS.aplicacionTecnica) {
    catalogs['aplicacionTecnica'] = {
      id: 'aplicacionTecnica',
      name: 'Aplicación Técnica',
      code: 'APT',
      description: 'Categorías de aplicación técnica',
      source: 'ODISEO',
      pageOrigin: 'ProductEditPage',
      values: PRODUCT_CATALOGS.aplicacionTecnica.values.map((value: string) => ({
        code: value.substring(0, 3).toUpperCase(),
        label: value,
        active: true,
      })),
      version: '1.0',
      lastUpdated: new Date(),
      ownerSystem: 'ODISEO',
      editable: true,
    };
  }

  // === FROM CATALOG_REGISTRY (System Catalogs - ONLY those used in ProductEditPage) ===

  // These are the EXACT catalogs used in ProductEditPage (extracted from getCatalogOptions calls)
  const usedCatalogCodes = [
    'bag_perforation_type',
    'core_material',
    'currency',
    'destination_country',
    'eyelet_perforation_type',
    'handle_color',
    'handle_type',
    'incoterm',
    'pouch_perforation_type',
    'precut_type',
    'print_class',
    'print_type',
    'rounded_corners_type',
    'sale_type',
    'structure_type',
    'subclassification',
    'valve_type',
    'wicket_perforation_type',
    'zipper_type',
    // Nuevos catálogos centralizados
    'client',
    'executive',
    'unit_measure',
    'modification_new',
    'modification_modified',
    'seals_count',
    'central_seal_material',
    'seal_type_gusset',
    'seal_type_bag',
    'micron_pe',
    'material_packaging',
    'export_packaging',
    'splices',
  ];

  const usedCatalogs = CATALOG_REGISTRY.filter(
    (cat) => cat.ownerSystem === 'ODISEO' && usedCatalogCodes.includes(cat.code)
  );

  for (const catalogDef of usedCatalogs) {
    // Skip if already added from PRODUCT_CATALOGS
    if (catalogs[catalogDef.code]) continue;

    const catalogOptions = getCatalogOptions(catalogDef.code, { activeOnly: false });

    catalogs[catalogDef.code] = {
      id: catalogDef.id,
      name: catalogDef.name,
      code: catalogDef.code,
      description: catalogDef.description || '',
      source: 'ODISEO',
      pageOrigin: 'ProductEditPage',
      values: catalogOptions.map((opt) => ({
        code: opt.value,
        label: opt.label,
        active: opt.status === 'Activo',
      })),
      version: '1.0',
      lastUpdated: new Date(),
      ownerSystem: 'ODISEO',
      editable: true,
    };
  }

  return catalogs;
}

// ═══════════════════════════════════════════════════════════════
// EXTRACTION FROM PORTFOLIOEDITPAGE.TSX
// ═══════════════════════════════════════════════════════════════

/**
 * Extract all Portfolio-specific catalogs
 */
export function extractPortfolioEditPageCatalogs(): Record<
  string,
  ConsolidatedCatalog
> {
  const catalogs: Record<string, ConsolidatedCatalog> = {};

  // 1. Status
  const statusList = getStatusCatalog();
  if (statusList && statusList.length > 0) {
    catalogs['status'] = {
      id: 'status',
      name: 'Estado del Portafolio',
      code: 'STA',
      description: 'Estados disponibles para portafolios',
      source: 'PORTFOLIO',
      pageOrigin: 'PortfolioEditPage',
      values: statusList.map((item: any) => ({
        code: item.id || item.code,
        label: item.name || item.value,
        active: true,
      })),
      version: '1.0',
      lastUpdated: new Date(),
      ownerSystem: 'PORTFOLIO',
      editable: true,
    };
  }

  // 2. Plants
  const plantsList = getPlantsCatalog();
  if (plantsList && plantsList.length > 0) {
    catalogs['plants'] = {
      id: 'plants',
      name: 'Plantas Amcor',
      code: 'PLT',
      description: 'Plantas de origen para solicitudes',
      source: 'PORTFOLIO',
      pageOrigin: 'PortfolioEditPage',
      values: plantsList.map((item: any) => ({
        code: item.code,
        label: item.name,
        active: true,
      })),
      version: '1.0',
      lastUpdated: new Date(),
      ownerSystem: 'PORTFOLIO',
      editable: true,
    };
  }

  // 3. Wrappings
  const wrappingsList = getWrappingsCatalog();
  if (wrappingsList && wrappingsList.length > 0) {
    catalogs['wrappings'] = {
      id: 'wrappings',
      name: 'Envolturas',
      code: 'WRP',
      description: 'Tipos de envoltura disponibles',
      source: 'PORTFOLIO',
      pageOrigin: 'PortfolioEditPage',
      values: wrappingsList.map((item: any) => ({
        code: item.code,
        label: item.name,
        active: true,
      })),
      version: '1.0',
      lastUpdated: new Date(),
      ownerSystem: 'PORTFOLIO',
      editable: true,
    };
  }

  // 4. Final Uses
  const finalUsesList = getFinalUses();
  if (finalUsesList && finalUsesList.length > 0) {
    catalogs['finalUses'] = {
      id: 'finalUses',
      name: 'Usos Finales',
      code: 'FUS',
      description: 'Taxonomía comercial: Sector / Segmento / SubSegmento',
      source: 'PORTFOLIO',
      pageOrigin: 'PortfolioEditPage',
      values: finalUsesList.map((item: any) => ({
        code: item.id || item.code,
        label: item.useFinal || item.value,
        metadata: {
          sector: item.sector,
          segment: item.segment,
          subSegment: item.subSegment,
          afMarketId: item.afMarketId,
        },
        active: true,
      })),
      version: '1.0',
      lastUpdated: new Date(),
      ownerSystem: 'PORTFOLIO',
      editable: true,
    };
  }

  // 5. Packing Machines (nota: depende de wrapping, requiere cascada)
  // Se dejaría vacío aquí y se poblaría dinámicamente según wrapping seleccionado
  catalogs['packingMachines'] = {
    id: 'packingMachines',
    name: 'Máquinas de Envasado',
    code: 'MCH',
    description: 'Máquinas de envasado disponibles (cascada por envoltura)',
    source: 'PORTFOLIO',
    pageOrigin: 'PortfolioEditPage',
    values: [],
    version: '1.0',
    lastUpdated: new Date(),
    ownerSystem: 'PORTFOLIO',
    editable: true,
    cascadedFrom: 'wrappings',
  };

  // 6. Clients
  const clientsList = getClientCatalogRecords();
  if (clientsList && clientsList.length > 0) {
    catalogs['clients'] = {
      id: 'clients',
      name: 'Clientes',
      code: 'CLI',
      description: 'Clientes elegibles para portafolios',
      source: 'PORTFOLIO',
      pageOrigin: 'PortfolioEditPage',
      values: clientsList.map((item: any) => ({
        code: item.code,
        label: item.businessName || item.name,
        active: true,
      })),
      version: '1.0',
      lastUpdated: new Date(),
      ownerSystem: 'PORTFOLIO',
      editable: true,
    };
  }

  // 7. Commercial Executives
  const executivesList = getActiveExecutiveRecords();
  if (executivesList && executivesList.length > 0) {
    catalogs['commercialExecutives'] = {
      id: 'commercialExecutives',
      name: 'Ejecutivos Comerciales',
      code: 'EXE',
      description: 'Usuarios comerciales activos',
      source: 'PORTFOLIO',
      pageOrigin: 'PortfolioEditPage',
      values: executivesList.map((item: any) => ({
        code: item.code,
        label: item.name,
        active: true,
      })),
      version: '1.0',
      lastUpdated: new Date(),
      ownerSystem: 'PORTFOLIO',
      editable: true,
    };
  }

  return catalogs;
}

// ═══════════════════════════════════════════════════════════════
// EXTRACTION FROM SISTEMA INTEGRAL (SI)
// ═══════════════════════════════════════════════════════════════

/**
 * Extract Sistema Integral (SI) catalogs - READ ONLY
 */
export function extractSistemaIntegralCatalogs(): Record<
  string,
  ConsolidatedCatalog
> {
  const catalogs: Record<string, ConsolidatedCatalog> = {};

  // 1. Materiales SI (180+ values)
  catalogs['materialesSI'] = {
    id: 'materialesSI',
    name: 'Materiales [SI]',
    code: 'MAT',
    description:
      'Materiales certificados del Sistema Integral (read-only, 405 combinaciones validadas)',
    source: 'SISTEMA_INTEGRAL',
    pageOrigin: 'Both',
    values: [
      // LÁMINA Materials (7)
      {
        code: 'MAT-001',
        label: 'Cartón Blanco Estándar',
        description: 'Base material para LÁMINA',
        active: true,
      },
      {
        code: 'MAT-002',
        label: 'Cartón Kraft Natural',
        description: 'Premium eco material',
        active: true,
      },
      {
        code: 'MAT-003',
        label: 'Cartón Corrugado',
        description: 'Refuerzo y resistencia',
        active: true,
      },
      {
        code: 'MAT-004',
        label: 'Cartón Reciclado',
        description: 'Sostenibilidad',
        active: true,
      },
      {
        code: 'MAT-005',
        label: 'Cartón Especial Food',
        description: 'Aplicaciones alimentarias',
        active: true,
      },
      {
        code: 'MAT-006',
        label: 'Cartón Tissue (Doble)',
        description: 'Tissue/Toalla',
        active: true,
      },
      {
        code: 'MAT-007',
        label: 'Cartón Reforzado',
        description: 'Alta resistencia',
        active: true,
      },

      // BOLSA Materials (12)
      {
        code: 'MAT-B001',
        label: 'PEBD Transparente',
        description: 'Película económica',
        active: true,
      },
      {
        code: 'MAT-B007',
        label: 'PE-PE (Bilaminado)',
        description: 'Estándar',
        active: true,
      },
      {
        code: 'MAT-B012',
        label: 'PET-Al-PE (Trilaminado)',
        description: 'Premium barrera',
        active: true,
      },

      // POUCH Materials (9)
      {
        code: 'MAT-P001',
        label: 'PE-PE-PE (Trilaminado)',
        description: 'Stand Up general',
        active: true,
      },
      {
        code: 'MAT-P004',
        label: 'Nylon-PE (Bilaminado)',
        description: 'Doy Pack',
        active: true,
      },
      {
        code: 'MAT-P009',
        label: 'PE-PE-PE Reforzado',
        description: 'Doy Pack Premium',
        active: true,
      },
    ],
    version: '1.0',
    lastUpdated: new Date(),
    ownerSystem: 'SISTEMA_INTEGRAL',
    editable: false,
  };

  // 2. Adhesivos SI (4 values)
  catalogs['adhesivosSI'] = {
    id: 'adhesivosSI',
    name: 'Adhesivos [SI]',
    code: 'ADH',
    description: 'Adhesivos certificados del Sistema Integral (read-only)',
    source: 'SISTEMA_INTEGRAL',
    pageOrigin: 'Both',
    values: [
      {
        code: 'ADH-001',
        label: 'Adhesivo Poliuretano STD',
        description: 'Estándar 2-3 min secado',
        active: true,
      },
      {
        code: 'ADH-002',
        label: 'Adhesivo Poliuretano HP',
        description: 'High performance 1-2 min',
        active: true,
      },
      {
        code: 'ADH-003',
        label: 'Adhesivo Acrílico',
        description: 'Acrílico 5-7 min',
        active: true,
      },
      {
        code: 'ADH-004',
        label: 'Adhesivo Poliéster',
        description: 'Especializado 3-4 min',
        active: true,
      },
    ],
    version: '1.0',
    lastUpdated: new Date(),
    ownerSystem: 'SISTEMA_INTEGRAL',
    editable: false,
  };

  return catalogs;
}

// ═══════════════════════════════════════════════════════════════
// CONSOLIDATION
// ═══════════════════════════════════════════════════════════════

/**
 * Consolidate all catalogs: ODISEO (editable) + SI (read-only)
 * NOTE: PORTFOLIO catalogs excluded from ViewAllCatalogsPage
 *
 * Total: ~31 catalogs (29 ODISEO from ProductEditPage + 2 SI)
 * - 10 from PRODUCT_CATALOGS (technical product catalogs)
 * - 19 from CATALOG_REGISTRY (system catalogs actually used in ProductEditPage)
 * - 2 from SISTEMA_INTEGRAL (read-only: Materiales, Adhesivos)
 */
export function consolidateAllCatalogs(): Record<
  string,
  ConsolidatedCatalog
> {
  return {
    ...extractProductEditPageCatalogs(),
    // PORTFOLIO catalogs NOT included in ViewAllCatalogsPage
    // (Portfolio page manages its own catalogs separately)
    ...extractSistemaIntegralCatalogs(),
  };
}

/**
 * Get catalog by ID
 */
export function getCatalogById(
  catalogId: string
): ConsolidatedCatalog | undefined {
  const allCatalogs = consolidateAllCatalogs();
  return allCatalogs[catalogId];
}

/**
 * Get all catalog IDs
 */
export function getAllCatalogIds(): string[] {
  return Object.keys(consolidateAllCatalogs());
}

/**
 * Calculate diff between two catalog value sets
 */
export function calculateCatalogDiff(
  catalogId: string,
  existingValues: CatalogValue[],
  sourceValues: CatalogValue[]
): CatalogDiff {
  const sourceCodes = new Set(sourceValues.map((v) => v.code));
  const existingCodes = new Set(existingValues.map((v) => v.code));

  const added = sourceValues.filter((v) => !existingCodes.has(v.code));
  const removed = existingValues.filter((v) => !sourceCodes.has(v.code));

  const modified = sourceValues
    .filter((sv) => {
      const existing = existingValues.find((ev) => ev.code === sv.code);
      return existing && existing.label !== sv.label;
    })
    .map((sv) => {
      const existing = existingValues.find((ev) => ev.code === sv.code)!;
      return {
        value: sv,
        previousLabel: existing.label,
        changes: ['label changed'],
      };
    });

  return {
    catalogId,
    added,
    removed,
    modified,
  };
}

/**
 * Merge catalog values (user selects which values to keep)
 */
export function mergeCatalogValues(
  existingValues: CatalogValue[],
  sourceValues: CatalogValue[],
  strategy: 'overwrite' | 'keep' | 'selective',
  selectiveIds?: string[]
): CatalogValue[] {
  if (strategy === 'overwrite') {
    return sourceValues;
  }

  if (strategy === 'keep') {
    return existingValues;
  }

  // Selective merge
  const merged = [...existingValues];
  const mergedCodes = new Set(merged.map((v) => v.code));

  sourceValues.forEach((sv) => {
    if (selectiveIds?.includes(sv.code)) {
      const existingIndex = merged.findIndex((v) => v.code === sv.code);
      if (existingIndex >= 0) {
        merged[existingIndex] = sv;
      } else {
        merged.push(sv);
      }
    }
  });

  return merged;
}
