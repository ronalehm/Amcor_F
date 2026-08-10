# 📚 CONSOLIDACIÓN DE CATÁLOGOS: ProductEditPage + PortfolioEditPage

**Versión:** 1.0  
**Fecha:** 2026-08-10  
**Scope:** Mapeo completo de catálogos desde ambas páginas hacia ViewAllCatalogsPage.tsx

---

# 1. CATÁLOGOS DE PRODUCTEDITPAGE.TSX

## 1.1 Catálogos por Sección

### LÁMINA (3 opciones)

| Catálogo | Código | Función | Fuente | Valores |
|:---|:---|:---|:---|:---|
| **Sentido Bobinado** | BOB-001 to BOB-008 | Dirección de bobinado del rollo | ODISEO | 8 opciones con imagen |
| **Acabados** | FIN-001 to FIN-007 | Mate/Brillante/Protección | ODISEO | 7 opciones |
| **Clasificación** | CLASS-001 to CLASS-002 | Producto Nuevo / Modificado | ODISEO | 2 opciones |
| **Aplicación Técnica** | APP-001 to APP-007 | Food/Pharma/General/Premium | ODISEO | 7 opciones |
| **Tipo Venta** | SAL-001 to SAL-004 | B2B/B2C/Retail/Distribuidor | ODISEO | 4 opciones |

### BOLSA (5 casuísticas)

| Catálogo | Código | Función | Fuente | Valores |
|:---|:---|:---|:---|:---|
| **Tipo Asa** | ASA-001 to ASA-006 | Handles para bolsa | ODISEO | 6 opciones |
| **Color Asa** | COL-001 to COL-009 | Colores disponibles | ODISEO | 9 opciones |
| **Tipo Refuerzo** | REF-001 to REF-005 | Refuerzos de esquina | ODISEO | 5 opciones |
| **Accesorios Internos** | INT-001 to INT-007 | Agarradera, Ventana, etc. | ODISEO | 7 opciones (máx 3) |
| **Diámetro Wicket** | WIC-001 to WIC-003 | D12, D14, D16 | ODISEO | 3 opciones |
| **Control Wicket** | CTL-001 to CTL-002 | Sensor / Manual | ODISEO | 2 opciones |
| **Acabados** | FIN-001 to FIN-007 | (igual LÁMINA) | ODISEO | 7 opciones |
| **Clasificación** | CLASS-001 to CLASS-002 | (igual LÁMINA) | ODISEO | 2 opciones |
| **Aplicación Técnica** | APP-001 to APP-007 | (igual LÁMINA) | ODISEO | 7 opciones |
| **Tipo Venta** | SAL-001 to SAL-004 | (igual LÁMINA) | ODISEO | 4 opciones |

### POUCH (16 casuísticas)

| Catálogo | Código | Función | Fuente | Valores |
|:---|:---|:---|:---|:---|
| **Tipo Microperforado** | MIC-001 to MIC-002 | Estándar / Personalizado | ODISEO | 2 opciones |
| **Tipos Zipper** | ZIP-001 to ZIP-004 | Slider/Lock/Doble/Especial | ODISEO | 4 opciones |
| **Tipos Valve** | VLV-001 to VLV-004 | Side/Corner/Center/Especial | ODISEO | 4 opciones |
| **Tipos Tin-Tie** | TIN-001 to TIN-004 | Standard/Eco/Premium/Custom | ODISEO | 4 opciones |
| **Acabados** | FIN-001 to FIN-007 | (igual LÁMINA) | ODISEO | 7 opciones |
| **Clasificación** | CLASS-001 to CLASS-002 | (igual LÁMINA) | ODISEO | 2 opciones |
| **Aplicación Técnica** | APP-001 to APP-007 | (igual LÁMINA) | ODISEO | 7 opciones |
| **Tipo Venta** | SAL-001 to SAL-004 | (igual LÁMINA) | ODISEO | 4 opciones |

### Catálogos Globales (LÁMINA + BOLSA + POUCH)

| Catálogo | Código | Función | Fuente | Valores |
|:---|:---|:---|:---|:---|
| **Material [SI]** | MAT-* | Materiales certificados | SI (read-only) | 180+ (405 combos validados) |
| **Adhesivos [SI]** | ADH-001 to ADH-004 | Pegamentos | SI (read-only) | 4 opciones |

---

## 1.2 Resumen ProductEditPage

```
ODISEO (Editable Local):
├─ Sentido Bobinado: 8
├─ Tipos Asa: 6
├─ Colores Asa: 9
├─ Refuerzos: 5
├─ Accesorios Internos: 7
├─ Diámetro Wicket: 3
├─ Control Wicket: 2
├─ Microperforado: 2
├─ Zipper: 4
├─ Valve: 4
├─ Tin-Tie: 4
├─ Acabados: 7
├─ Clasificación: 2
├─ Aplicación Técnica: 7
└─ Tipo Venta: 4

TOTAL ODISEO: 15 catálogos únicos (90+ valores)

SI (Read-Only):
├─ Materiales: 180+
└─ Adhesivos: 4

TOTAL SI: 184+ valores (405 combos)
```

---

# 2. CATÁLOGOS DE PORTFOLIOEDITPAGE.TSX

## 2.1 Catálogos Utilizados

### Portfolio Catalogs (Portfolio-specific)

| Catálogo | Código | Función | Fuente | Valores |
|:---|:---|:---|:---|:---|
| **Status** | (múltiples) | Estado del portafolio | Portfolio DB | Variable |
| **Plants** | AF_LIMA, AF_CALI, AF_SANTIAGO, AF_SAN_LUIS | Plantas Amcor | Portfolio DB | 4 opciones |
| **Wrappings** | POUCH, BOLSA, LÁMINA | Envolturas | Portfolio DB | 3 opciones |
| **Final Uses** | (múltiples) | Taxonomía comercial (Sector/Segment/SubSegment) | Portfolio DB | Variable |
| **Packing Machines** | (múltiples) | Máquinas de envasado | Portfolio DB | Variable (por envoltura) |

### Shared Catalogs (Also used in Product)

| Catálogo | Código | Función | Fuente | Overlap con ProductEditPage |
|:---|:---|:---|:---|:---|
| **Clients** | (múltiples) | Clientes elegibles | Client DB | ❌ NO (solo Portfolio) |
| **Commercial Executives** | (múltiples) | Usuarios comerciales | Executive DB | ❌ NO (solo Portfolio) |

---

## 2.2 Resumen PortfolioEditPage

```
Portfolio-Specific Catalogs:
├─ Status: Variable
├─ Plants: 4 (AF_LIMA, AF_CALI, AF_SANTIAGO, AF_SAN_LUIS)
├─ Wrappings: 3 (POUCH, BOLSA, LÁMINA)
├─ Final Uses: Variable
├─ Packing Machines: Variable (cascada por Wrapping)
├─ Clients: Variable
└─ Commercial Executives: Variable

TOTAL: 6 catálogos únicos (Portfolio-specific)
```

---

# 3. MATRIZ DE CONSOLIDACIÓN

## 3.1 Catálogos ÚNICOS para Consolidar

```
┌────────────────────────────────────────────────────────────────┐
│                CATÁLOGOS ÚNICOS TOTALES                        │
└────────────────────────────────────────────────────────────────┘

DE PRODUCTEDITPAGE:
├─ [1] Sentido Bobinado (BOB-001 to BOB-008) = 8
├─ [2] Tipo Asa (ASA-001 to ASA-006) = 6
├─ [3] Color Asa (COL-001 to COL-009) = 9
├─ [4] Tipo Refuerzo (REF-001 to REF-005) = 5
├─ [5] Accesorios Internos (INT-001 to INT-007) = 7
├─ [6] Diámetro Wicket (WIC-001 to WIC-003) = 3
├─ [7] Control Wicket (CTL-001 to CTL-002) = 2
├─ [8] Tipo Microperforado (MIC-001 to MIC-002) = 2
├─ [9] Tipos Zipper (ZIP-001 to ZIP-004) = 4
├─ [10] Tipos Valve (VLV-001 to VLV-004) = 4
├─ [11] Tipos Tin-Tie (TIN-001 to TIN-004) = 4
├─ [12] Acabados (FIN-001 to FIN-007) = 7
├─ [13] Clasificación (CLASS-001 to CLASS-002) = 2
├─ [14] Aplicación Técnica (APP-001 to APP-007) = 7
├─ [15] Tipo Venta (SAL-001 to SAL-004) = 4
├─ [16] Materiales SI (MAT-*) = 180+
└─ [17] Adhesivos SI (ADH-*) = 4

SUBTOTAL PRODUCT: 17 catálogos (90+ ODISEO + 184+ SI)

DE PORTFOLIOEDITPAGE (NUEVOS):
├─ [18] Status = Variable
├─ [19] Plants (4 opciones) = 4
├─ [20] Wrappings (3 opciones) = 3
├─ [21] Final Uses = Variable
├─ [22] Packing Machines = Variable
├─ [23] Clients = Variable
└─ [24] Commercial Executives = Variable

SUBTOTAL PORTFOLIO: 7 catálogos (Portfolio-specific)

TOTAL CONSOLIDADO: 24 catálogos únicos
```

---

## 3.2 Distribución por Sistema

```
ODISEO (Editable en ViewAllCatalogsPage):
1. Sentido Bobinado
2. Tipo Asa
3. Color Asa
4. Tipo Refuerzo
5. Accesorios Internos
6. Diámetro Wicket
7. Control Wicket
8. Tipo Microperforado
9. Tipos Zipper
10. Tipos Valve
11. Tipos Tin-Tie
12. Acabados
13. Clasificación
14. Aplicación Técnica
15. Tipo Venta
└─ Total: 15 ODISEO catalogs

PORTFOLIO (Editable en ViewAllCatalogsPage):
1. Status
2. Plants
3. Wrappings
4. Final Uses
5. Packing Machines
6. Clients
7. Commercial Executives
└─ Total: 7 Portfolio catalogs

SISTEMA INTEGRAL (Read-Only):
1. Materiales [SI]
2. Adhesivos [SI]
└─ Total: 2 SI catalogs

GRAND TOTAL: 24 catálogos
```

---

# 4. ESTRATEGIA DE INTEGRACIÓN EN VIEWALLCATALOGSPAGE.TSX

## 4.1 Arquitectura Recomendada

```typescript
// New consolidated export function
export function extractAllCatalogsFromPages() {
  return {
    // From ProductEditPage
    productCatalogs: {
      sentidoBobinado: getSentidoBoninado(),
      tipoAsa: getTipoAsa(),
      colorAsa: getColorAsa(),
      // ... más
    },
    
    // From PortfolioEditPage
    portfolioCatalogs: {
      status: getStatusCatalog(),
      plants: getPlantsCatalog(),
      wrappings: getWrappingsCatalog(),
      finalUses: getFinalUses(),
      packingMachines: getPackingMachinesByWrappingId(),
      clients: getClientCatalogRecords(),
      commercialExecutives: getActiveExecutiveRecords(),
    }
  };
}
```

## 4.2 Modificaciones a ViewAllCatalogsPage.tsx

### ANTES (Actual - 2 columnas)
```
Catalogs (izq) | Restrictions (der)
```

### DESPUÉS (Propuesto - Único catálogo + tabs)
```
┌─────────────────────────────────────┐
│  Seleccionar Catálogo (Radio)       │
├─────────────────────────────────────┤
│ ○ Sentido Bobinado                  │
│ ○ Tipo Asa                          │
│ ○ Color Asa                         │
│ ... (24 total)                      │
├─────────────────────────────────────┤
│  Valores del Catálogo Seleccionado  │
│  [+] Agregar  [Edit] Editar  [X]    │
├─────────────────────────────────────┤
│  Comparación con fuente              │
│  Diff view (added/removed/modified)  │
├─────────────────────────────────────┤
│  [Cancelar] [Guardar Cambios]       │
└─────────────────────────────────────┘
```

---

# 5. ESTRUCTURA DE DATOS PROPUESTA

## 5.1 Interface TypeScript

```typescript
// Type definitions for consolidated catalogs

type CatalogSource = 'ODISEO' | 'PORTFOLIO' | 'SISTEMA_INTEGRAL';

interface ConsolidatedCatalog {
  // Identity
  id: string;                    // unique catalog identifier
  name: string;                  // Sentido Bobinado
  code: string;                  // BOB (prefix)
  description: string;           // Description
  
  // Classification
  source: CatalogSource;         // ODISEO | PORTFOLIO | SI
  pageOrigin: 'ProductEditPage' | 'PortfolioEditPage' | 'Both';
  
  // State
  values: CatalogValue[];        // Array of values
  version: string;               // v1.0, v1.1, etc.
  lastUpdated: Date;
  updatedBy: string;
  
  // Metadata
  ownerSystem?: string;          // ODISEO or PORTFOLIO
  editable: boolean;             // false if SI
  maxSelectable?: number;        // e.g., 3 for accesorios
  cascadedFrom?: string;         // e.g., wrappingId → packingMachine
}

interface CatalogValue {
  code: string;                  // BOB-001
  label: string;                 // Transversal
  description?: string;          // Full description
  imageUrl?: string;             // For visual catalogs
  metadata?: Record<string, any>;
  active: boolean;               // true/false
}

interface CatalogDiff {
  catalogId: string;
  added: CatalogValue[];         // New in source, not in catalog
  removed: CatalogValue[];       // In catalog, not in source
  modified: Array<{
    value: CatalogValue;
    previousLabel: string;
    changes: string[];
  }>;
}
```

---

# 6. PLAN DE IMPLEMENTACIÓN

## Fase 1: Extraction Functions (30 min)

```typescript
// File: src/shared/catalogs/catalogExtraction.ts

export function extractProductCatalogs() {
  return {
    sentidoBobinado: getSentidoBobinado(),
    tipoAsa: getTipoAsa(),
    colorAsa: getColorAsa(),
    // ... 12 más from PRODUCT_CATALOGS
  };
}

export function extractPortfolioCatalogs() {
  return {
    status: getStatusCatalog(),
    plants: getPlantsCatalog(),
    wrappings: getWrappingsCatalog(),
    finalUses: getFinalUses(),
    packingMachines: getPackingMachinesByWrappingId(),
    clients: getClientCatalogRecords(),
    commercialExecutives: getActiveExecutiveRecords(),
  };
}

export function consolidateAllCatalogs() {
  return {
    ...extractProductCatalogs(),
    ...extractPortfolioCatalogs(),
  };
}
```

## Fase 2: Single-Catalog Selection UI (20 min)

```typescript
// Modify ViewAllCatalogsPage.tsx

// REPLACE checkbox list with radio buttons
const catalogs = consolidateAllCatalogs();

<fieldset>
  <legend>Seleccionar Catálogo</legend>
  {Object.entries(catalogs).map(([catalogId, values]) => (
    <label key={catalogId}>
      <input 
        type="radio" 
        name="selectedCatalog"
        value={catalogId}
        checked={selectedCatalogId === catalogId}
        onChange={() => setSelectedCatalogId(catalogId)}
      />
      {translateCatalogName(catalogId)}
    </label>
  ))}
</fieldset>
```

## Fase 3: Pre-population Logic (20 min)

```typescript
// When catalog selected, show values
const selectedCatalog = catalogs[selectedCatalogId];
const existingValues = getCatalogStorageValues(selectedCatalogId);

const diff = calculateDiff(existingValues, selectedCatalog);

// Show UI:
// - Existing values
// - Source values
// - Diff highlight (added/removed/modified)
```

## Fase 4: Merge & Save (20 min)

```typescript
// User can:
// 1. Accept all source values (overwrite)
// 2. Merge selectively
// 3. Keep existing values

// On save:
// - Update catalogStorage
// - Log audit trail
// - Increment version
// - Persist to localStorage
```

---

# 7. RESTRICCIONES Y REGLAS

## 7.1 Edición por Fuente

```
ODISEO Catalogs (15 total): ✅ FULLY EDITABLE
  - User can add/remove/modify values
  - Version increments (v1.0 → v1.1)
  - Audit trail logged

PORTFOLIO Catalogs (7 total): ⚠️ LIMITED EDITABLE
  - Can modify values (name, description)
  - BUT: Cannot delete records in use
  - Cascading dependencies (wrapping → machines)

SISTEMA INTEGRAL (2 total): ❌ READ-ONLY
  - Display only
  - No editing allowed
  - Reference for comparison
```

## 7.2 Single-Select Enforcement

```
❌ NO multiple catalogs at once:
  - Only ONE radio button selected
  - Loading one catalog at a time
  - Clear → Edit → Save → Clear workflow

✅ Sequential editing:
  1. Select catalog (radio)
  2. View values
  3. Compare with source
  4. Edit/Merge
  5. Save
  6. Return to step 1 for next catalog
```

---

# 8. CHECKLIST PARA IMPLEMENTACIÓN

### Pre-Implementation (15 min)
- [ ] Read consolidateAllCatalogs structure
- [ ] Verify catalog adapters (portfolio-adapters.ts)
- [ ] Identify existing catalogStorage schema
- [ ] Check PRODUCT_CATALOGS structure

### Development (90 min)
- [ ] Fase 1: Create extractProductCatalogs() & extractPortfolioCatalogs()
- [ ] Fase 2: Modify UI from checkbox to radio buttons
- [ ] Fase 3: Implement pre-population logic
- [ ] Fase 4: Build merge/diff display
- [ ] Fase 5: Save with audit trail

### Testing (30 min)
- [ ] Test single-catalog selection (no multi-select)
- [ ] Verify pre-population from both pages
- [ ] Test diff calculation (added/removed/modified)
- [ ] Verify save persists correctly
- [ ] Check audit trail logging
- [ ] Test cascade changes (e.g., wrapping → machines)

### Deployment (15 min)
- [ ] Commit changes
- [ ] Create pull request
- [ ] Review by team lead
- [ ] Deploy to staging/prod

---

# 9. RESUMEN FINAL

```
CONSOLIDACIÓN DE CATÁLOGOS:

ProductEditPage.tsx:
├─ 15 ODISEO catalogs (90+ valores)
├─ 2 SI catalogs (180+ valores, 405 combos)
└─ Subtotal: 17 catálogos

PortfolioEditPage.tsx:
├─ 7 Portfolio catalogs (variable valores)
└─ Subtotal: 7 catálogos

ViewAllCatalogsPage.tsx (CONSOLIDADO):
├─ Total: 24 catálogos únicos
├─ UI: Single-select radio buttons (ONE at a time)
├─ Pre-population: Automática desde ambas fuentes
├─ Merge: Diff-based comparison + manual override
└─ Persistence: Audit trail + version control

CAMBIOS PRINCIPALES:
1. ❌ Eliminar checkbox multi-select
2. ✅ Implementar radio single-select
3. ✅ Extraer catálogos de ambas páginas
4. ✅ Pre-poblar valores automáticamente
5. ✅ Mostrar diff para revisión
6. ✅ Guardar con versionado
```

---

**📚 CONSOLIDACIÓN COMPLETA** ✅

**Total Catálogos:** 24  
**Total Valores:** 280+  
**Fuentes:** 2 (ProductEditPage + PortfolioEditPage)  
**Sistemas:** 3 (ODISEO + PORTFOLIO + SI)  
**Implementación:** ~2.5 horas

**Siguiente paso:** Implementar extracción y single-select en ViewAllCatalogsPage.tsx
