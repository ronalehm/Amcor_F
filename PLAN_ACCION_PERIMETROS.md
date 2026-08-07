# PLAN DE ACCIÓN: Implementación del Motor de Perímetros

**Versión:** 1.0  
**Fecha:** 2025-08-05  
**Responsable:** Dev + Usuario (definición de datos)

---

## FASE 1: PREPARACIÓN DE DATOS

### Paso 1.1: Definir Factores de Encogimiento (FE)

**Deliverable:** Lista de sustrato-espesor-FE

```
BOPP             | No aplica        | 1.004000
PET              | No aplica        | 1.001500
PAPEL            | No aplica        | 1.000000
PEBD/PEAD        | 18-30 µ          | 1.017000
PEBD/PEAD        | 31-60 µ          | 1.015000
PEBD/PEAD        | 61-80 µ          | 1.010000
PEBD/PEAD        | 81-135 µ         | 1.005000
PP Cast          | No aplica        | 1.007000
BOPA             | No aplica        | 1.001500
BARVAL           | 30-60 µ          | 1.015000
BARLON           | 30-60 µ          | 1.015000
ALUMINIO         | No aplica        | 1.000000
```

**Responsable:** Usuario → Dev  
**Validación:** Dev verifica que tenga al menos los 9 valores referenciales

---

### Paso 1.2: Definir Máquinas y Sus Capacidades

**Deliverable:** Tabla de máquinas extendida

```
ID         | Código    | Nombre                    | Planta | Sistema     | Envoltura | Ancho máx | Perímetro mín | Perímetro máx
FLEXO-01   | FLX-LAMI  | Flexografía Lámina Lima   | LIMA   | FLEXOGRAFIA | LAMINA    | 2000      | 400           | 800
FLEXO-02   | FLX-POUC  | Flexografía Pouch Lima    | LIMA   | FLEXOGRAFIA | POUCH     | 2500      | 300           | 900
HUECO-01   | HGR-LAMI  | Huecograbado Lámina Lima  | LIMA   | HUECOGRABADO| LAMINA    | 1800      | 450           | 750
HFFS-01    | HSP-POUC  | HFFS Pouch Lima           | LIMA   | HFFS        | POUCH     | 2000      | 280           | 850
VFFS-01    | VFS-BOLS  | VFFS Bolsa Lima           | LIMA   | VFFS        | BOLSA     | 1600      | 350           | 700
```

**Responsable:** Usuario → Dev  
**Validación:** Dev verifica:
- Al menos 1 máquina por tipo de envoltura
- Perímetro mín < Perímetro máx
- Ancho máx > 0

---

### Paso 1.3: Definir Perímetros Físicos Disponibles

**Deliverable:** Tabla de cilindros/perímetros

```
ID         | Máquina   | Código Cilindro | Perímetro (mm) | Diámetro (mm) | Ubicación | Cantidad | Estado
CYL-F001A  | FLEXO-01  | FL-001A         | 632.2800       | 150.5         | GALVANO   | 1        | ACTIVO
CYL-F001B  | FLEXO-01  | FL-001B         | 651.1500       | 150.5         | ALMACEN   | 2        | ACTIVO
CYL-F001C  | FLEXO-01  | FL-001C         | 670.0000       | 150.5         | PLANTA    | 1        | ACTIVO
CYL-H001   | HUECO-01  | HG-001          | 749.5000       | 175.0         | GALVANO   | 1        | ACTIVO
CYL-HFS01  | HFFS-01   | HS-001          | 580.0000       | 140.0         | ALMACEN   | 3        | ACTIVO
CYL-HFS02  | HFFS-01   | HS-002          | 630.0000       | 140.0         | PLANTA    | 1        | ACTIVO
```

**Responsable:** Usuario → Dev  
**Validación:** Dev verifica:
- Perímetro > 0
- La máquina existe en la tabla de máquinas
- Estado es uno de: ACTIVO, RESERVADO, AVERIA, RETIRADO

---

### Paso 1.4: Definir Sistemas de Impresión

**Deliverable:** Tabla de sistemas

```
ID          | Código  | Nombre         | N mín | N máx | Status
FLEXO       | FLEX    | Flexografía    | 1     | 15    | ACTIVO
HUECO       | HGR     | Huecograbado   | 1     | 10    | ACTIVO
HFFS        | HFFS    | HFFS           | 2     | 12    | ACTIVO
VFFS        | VFFS    | VFFS           | 1     | 8     | ACTIVO
OFFSET      | OFF     | Offset         | 1     | 10    | INACTIVO
```

**Responsable:** Usuario → Dev  
**Validación:** Dev verifica N mín < N máx

---

## FASE 2: IMPLEMENTAR CATÁLOGOS EN CÓDIGO

### Paso 2.1: Agregar SHRINK_FACTOR_CATALOG

**Archivo:** `src/shared/data/mockDatabase.ts`

```typescript
export type ShrinkFactorEntry = {
  id: number;
  substrateCode: string;      // BOPP, PET, PAPEL, etc.
  substrateLabel: string;     // "BOPP (Polipropileno Biorientado)"
  thicknessMinMicrons?: number;
  thicknessMaxMicrons?: number;
  shrinkFactor: number;       // 1.004, 1.0015, etc.
  status: 'ACTIVO' | 'INACTIVO' | 'OBSOLETO';
  effectiveFrom: string;      // YYYY-MM-DD
};

export const SHRINK_FACTOR_CATALOG: ShrinkFactorEntry[] = [
  {
    id: 1,
    substrateCode: 'BOPP',
    substrateLabel: 'BOPP (Polipropileno Biorientado)',
    thicknessMinMicrons: undefined,
    thicknessMaxMicrons: undefined,
    shrinkFactor: 1.004,
    status: 'ACTIVO',
    effectiveFrom: '2025-01-01',
  },
  // ... más entradas ...
];

export function getShrinkFactorForSubstrate(
  substrateCode: string,
  thicknessMicrons?: number
): number | null {
  const entry = SHRINK_FACTOR_CATALOG.find((sf) => {
    if (sf.substrateCode !== substrateCode) return false;
    if (sf.status !== 'ACTIVO') return false;
    
    if (thicknessMicrons === undefined) {
      return sf.thicknessMinMicrons === undefined;
    }
    
    const hasMinThickness = sf.thicknessMinMicrons === undefined || sf.thicknessMinMicrons <= thicknessMicrons;
    const hasMaxThickness = sf.thicknessMaxMicrons === undefined || sf.thicknessMaxMicrons >= thicknessMicrons;
    return hasMinThickness && hasMaxThickness;
  });
  
  return entry ? entry.shrinkFactor : null;
}
```

**Responsable:** Dev  
**Validación:** Prueba que getShrinkFactorForSubstrate('BOPP') retorna 1.004

---

### Paso 2.2: Extender PACKING_MACHINES_CATALOG

**Archivo:** `src/shared/data/mockDatabase.ts`

```typescript
// Cambiar de:
export type CatalogPackingMachine = {
  id: number;
  code: string;
  name: string;
  wrappingId: number;
};

// A:
export type CatalogPackingMachine = {
  id: number;
  code: string;
  name: string;
  wrappingId: number;
  plantId: number;              // ✨ NUEVO
  printingSystemId: string;     // ✨ NUEVO (FK a PRINTING_SYSTEM_CATALOG)
  wrappingType: 'LAMINA' | 'BOLSA' | 'POUCH';  // ✨ NUEVO
  maxWidthMm: number;           // ✨ NUEVO
  minPerimeterMm: number;       // ✨ NUEVO
  maxPerimeterMm: number;       // ✨ NUEVO
  operativeStatus: 'ACTIVO' | 'MANTENIMIENTO' | 'INACTIVO';  // ✨ NUEVO
};

// Actualizar datos:
export const PACKING_MACHINES_CATALOG: CatalogPackingMachine[] = [
  {
    id: 1,
    code: "FLEXO-01",
    name: "Flexografía Lámina Lima",
    wrappingId: 3,  // LÁMINA
    plantId: 1,     // LIMA
    printingSystemId: "FLEXOGRAFIA",
    wrappingType: "LAMINA",
    maxWidthMm: 2000,
    minPerimeterMm: 400,
    maxPerimeterMm: 800,
    operativeStatus: "ACTIVO",
  },
  // ... más máquinas ...
];
```

**Responsable:** Dev  
**Validación:** Verifica que todas las máquinas tengan los nuevos campos

---

### Paso 2.3: Crear PERIMETER_RESOURCE_CATALOG

**Archivo:** `src/shared/data/mockDatabase.ts`

```typescript
export type PerimeterResource = {
  id: number;
  machineId: number;                    // FK a PACKING_MACHINES_CATALOG
  cylinderCode: string;
  cylinderDiameterMm: number;
  registeredPerimeterMm: number;
  cylinderLocation: 'GALVANO' | 'ALMACEN' | 'PLANTA' | 'MANTENIMIENTO';
  quantityAvailable: number;
  status: 'ACTIVO' | 'RESERVADO' | 'AVERIA' | 'RETIRADO';
  lastCalibrationDate?: string;         // YYYY-MM-DD
};

export const PERIMETER_RESOURCE_CATALOG: PerimeterResource[] = [
  {
    id: 1,
    machineId: 1,  // FLEXO-01
    cylinderCode: 'FL-001A',
    cylinderDiameterMm: 150.5,
    registeredPerimeterMm: 632.28,
    cylinderLocation: 'GALVANO',
    quantityAvailable: 1,
    status: 'ACTIVO',
    lastCalibrationDate: '2025-06-15',
  },
  // ... más cilindros ...
];

export function getPerimeterResourcesForMachine(
  machineId: number,
  minPerimeterMm: number,
  maxPerimeterMm: number
): PerimeterResource[] {
  return PERIMETER_RESOURCE_CATALOG.filter((pr) => {
    return (
      pr.machineId === machineId &&
      pr.status === 'ACTIVO' &&
      pr.registeredPerimeterMm >= minPerimeterMm &&
      pr.registeredPerimeterMm <= maxPerimeterMm
    );
  });
}
```

**Responsable:** Dev  
**Validación:** Prueba que se filtra correctamente por rango de perímetro

---

### Paso 2.4: Crear PRINTING_SYSTEM_CATALOG

**Archivo:** `src/shared/data/mockDatabase.ts`

```typescript
export type PrintingSystem = {
  id: number;
  code: string;
  name: string;
  minRepeatsPerCylinder?: number;  // Límite mínimo de N
  maxRepeatsPerCylinder?: number;  // Límite máximo de N
  status: 'ACTIVO' | 'INACTIVO';
};

export const PRINTING_SYSTEM_CATALOG: PrintingSystem[] = [
  {
    id: 1,
    code: 'FLEXOGRAFIA',
    name: 'Flexografía',
    minRepeatsPerCylinder: 1,
    maxRepeatsPerCylinder: 15,
    status: 'ACTIVO',
  },
  {
    id: 2,
    code: 'HUECOGRABADO',
    name: 'Huecograbado',
    minRepeatsPerCylinder: 1,
    maxRepeatsPerCylinder: 10,
    status: 'ACTIVO',
  },
  // ... más sistemas ...
];
```

**Responsable:** Dev  
**Validación:** Verifica que todos los sistemas estén activos

---

## FASE 3: IMPLEMENTAR MOTOR DE VALIDACIÓN

### Paso 3.1: Crear Tipos e Interfaces

**Archivo:** `src/shared/utils/perimeter-validation/types.ts`

```typescript
export interface PerimeterValidationContext {
  wrapperType: 'LAMINA' | 'BOLSA' | 'POUCH';
  plantId: string;
  printingSystemId: string;
  repeatTargetMm: number;
  toleranceMm: number;
  requiredWidthMm: number;
  printedLayerId: string;
  substrateId: string;
  thicknessMicrons?: number;
  exactRepeat?: boolean;
}

export interface PerimeterAlternative {
  machineId: string;
  machineName: string;
  repeatsPerCylinder: number;
  registeredPerimeterMm: number;
  idealPerimeterMm: number;
  calculatedRepeatMm: number;
  differenceMm: number;
  shrinkFactor: number;
  availableResources: number;
  status: 'VALID';
}

export interface PerimeterValidationResult {
  isValid: boolean;
  alternatives: PerimeterAlternative[];
  errorMessages: string[];
}
```

**Responsable:** Dev

---

### Paso 3.2: Crear PerimeterValidationEngine

**Archivo:** `src/shared/utils/perimeter-validation/PerimeterValidationEngine.ts`

```typescript
export class PerimeterValidationEngine {
  validate(context: PerimeterValidationContext): PerimeterValidationResult {
    const result: PerimeterValidationResult = {
      isValid: false,
      alternatives: [],
      errorMessages: [],
    };
    
    // 1. VALIDAR ENTRADAS
    if (context.repeatTargetMm <= 0) {
      result.errorMessages.push('PER-001: Repetición objetivo debe ser > 0');
      return result;
    }
    
    if (context.toleranceMm < 0) {
      result.errorMessages.push('PER-001: Tolerancia no puede ser negativa');
      return result;
    }
    
    if (context.requiredWidthMm <= 0) {
      result.errorMessages.push('PER-001: Ancho requerido debe ser > 0');
      return result;
    }
    
    // 2. OBTENER FACTOR DE ENCOGIMIENTO
    const shrinkFactor = getShrinkFactorForSubstrate(
      context.substrateId,
      context.thicknessMicrons
    );
    
    if (!shrinkFactor) {
      result.errorMessages.push(
        `PER-003: No existe factor de encogimiento para ${context.substrateId}`
      );
      return result;
    }
    
    // 3. CALCULAR RANGO DE REPETICIÓN
    const Rmin = context.repeatTargetMm - context.toleranceMm;
    const Rmax = context.repeatTargetMm + context.toleranceMm;
    
    // 4. FILTRAR MÁQUINAS
    const machines = getPrintingMachinesForValidation(
      context.wrapperType,
      context.plantId,
      context.printingSystemId,
      context.requiredWidthMm
    );
    
    if (machines.length === 0) {
      result.errorMessages.push(
        'PER-005: No existen máquinas activas que cumplan los criterios'
      );
      return result;
    }
    
    // 5. PARA CADA MÁQUINA
    for (const machine of machines) {
      // 5.1 CALCULAR RANGO DE N
      const Nmin = Math.ceil(machine.minPerimeterMm / (Rmax * shrinkFactor));
      const Nmax = Math.floor(machine.maxPerimeterMm / (Rmin * shrinkFactor));
      
      // Limitar por sistema de impresión
      const minSystem = getSystemLimits(context.printingSystemId).min || Nmin;
      const maxSystem = getSystemLimits(context.printingSystemId).max || Nmax;
      
      const NminFinal = Math.max(Nmin, minSystem);
      const NmaxFinal = Math.min(Nmax, maxSystem);
      
      if (NminFinal > NmaxFinal) continue; // Esta máquina no puede hacer este producto
      
      // 5.2 BUSCAR PERÍMETROS FÍSICOS
      for (let N = NminFinal; N <= NmaxFinal; N++) {
        const Pmin = Rmin * shrinkFactor * N;
        const Pideal = context.repeatTargetMm * shrinkFactor * N;
        const Pmax = Rmax * shrinkFactor * N;
        
        // Obtener perímetros que estén dentro del rango para N
        const periodmeters = getPerimeterResourcesForMachine(
          machine.id,
          Pmin,
          Pmax
        );
        
        // 5.3 VALIDAR CADA PERÍMETRO
        for (const perimeter of periodmeters) {
          const Rcalc = perimeter.registeredPerimeterMm / (shrinkFactor * N);
          const difference = Math.abs(context.repeatTargetMm - Rcalc);
          
          if (difference <= context.toleranceMm) {
            // ✅ VÁLIDA
            result.alternatives.push({
              machineId: machine.id.toString(),
              machineName: machine.name,
              repeatsPerCylinder: N,
              registeredPerimeterMm: perimeter.registeredPerimeterMm,
              idealPerimeterMm: Pideal,
              calculatedRepeatMm: Rcalc,
              differenceMm: difference,
              shrinkFactor: shrinkFactor,
              availableResources: perimeter.quantityAvailable,
              status: 'VALID',
            });
          }
        }
      }
    }
    
    // 6. RESULTADO FINAL
    if (result.alternatives.length === 0) {
      result.errorMessages.push(
        `PER-007: No se encontraron perímetros que cumplan ` +
        `${context.repeatTargetMm}±${context.toleranceMm} mm`
      );
      return result;
    }
    
    // Ordenar por: menor diferencia, mayor disponibilidad
    result.alternatives.sort((a, b) => {
      if (a.differenceMm !== b.differenceMm) {
        return a.differenceMm - b.differenceMm;
      }
      return b.availableResources - a.availableResources;
    });
    
    result.isValid = true;
    return result;
  }
}
```

**Responsable:** Dev  
**Testing:** Casos BOPP (valida) y Huecograbado (sin coincidencias)

---

### Paso 3.3: Crear Resolvedores por Formato

**Archivo:** `src/shared/utils/perimeter-validation/LaminateRepeatTargetResolver.ts`

```typescript
export class LaminateRepeatTargetResolver {
  resolve(
    formData: ProjectEditFormData,
    plantId: string
  ): PerimeterValidationContext | null {
    // Validar que existan los campos requeridos
    if (!formData.repetition || !formData.width) {
      return null; // Datos incompletos
    }
    
    const repeatMm = parseFloat(formData.repetition);
    const toleranceMm = parseFloat(formData.toleranceMm || '0.15');
    const widthMm = parseFloat(formData.width);
    
    if (isNaN(repeatMm) || isNaN(toleranceMm) || isNaN(widthMm)) {
      return null;
    }
    
    return {
      wrapperType: 'LAMINA',
      plantId,
      printingSystemId: normalizePrintingSystem(formData.printClass),
      repeatTargetMm: repeatMm,
      toleranceMm: toleranceMm,
      requiredWidthMm: widthMm,
      printedLayerId: 'LAYER-1', // Asumir capa 1 (mejorar después)
      substrateId: extractSubstrateFromMaterial(formData.layer1Material),
      thicknessMicrons: extractThicknessFromMicron(formData.layer1Micron),
    };
  }
}
```

**Similar para:**
- `BagRepeatTargetResolver.ts`
- `PouchRepeatTargetResolver.ts`

**Responsable:** Dev

---

## FASE 4: AGREGAR CAMPOS AL FORMULARIO

### Paso 4.1: Actualizar ProjectEditFormData

**Archivo:** `src/modules/products/pages/ProductEditPage.tsx`

```typescript
export type ProjectEditFormData = {
  // ... campos existentes ...
  
  // ✨ NUEVO: Tolerancia (para LÁMINA, BOLSA, POUCH)
  toleranceMm: string;
  
  // ✨ NUEVO: Capa impresa (selector)
  printedLayerId: string;
  
  // ✨ NUEVO: Campos específicos BOLSA
  repeatTargetMm: string;      // Repetición calculada por fórmula de bolsa
  requiredWidthMm: string;     // Ancho total requerido
  
  // ✨ NUEVO: Campos específicos POUCH
  pouchExactRepeat: string;    // Sí / No
  pouchWidth: string;          // Ancho del pouch
  overallWidth: string;        // Ancho total del pouch con fuelles
};
```

**Responsable:** Dev

---

### Paso 4.2: Agregar Input de Tolerancia en PERÍMETROS

**En ProductEditPage.tsx, en la sección PERÍMETROS:**

```typescript
{canEditDesign && (
  <FormCard title="Perímetros" icon="📏" color="#e74c3c">
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <FormInput
          label="Repetición objetivo (mm)"
          type="number"
          value={form.repetition}  // O form.repeatTargetMm para BOLSA
          disabled={true}
          placeholder="Heredado del formato"
        />
        
        <FormInput
          label="Tolerancia (mm)"  // ✨ NUEVO
          type="number"
          value={form.toleranceMm}
          onChange={(value) => updateField("toleranceMm", value)}
          onBlur={() => markFieldAsTouched("toleranceMm")}
          placeholder="Ej. 0.15"
          step="0.01"
        />
        
        <FormInput
          label="Perímetro (mm)"
          type="number"
          value={form.perimeterMm}
          onChange={(value) => updateField("perimeterMm", value)}
          placeholder="0"
          disabled={!canEditDesign}
        />
        
        <button
          type="button"
          onClick={() => {
            const context = new LaminateRepeatTargetResolver().resolve(form, plantId);
            if (context) {
              const result = new PerimeterValidationEngine().validate(context);
              setPerimeterValidationResult(result);
              setShowPerimeterModal(true);
            }
          }}
          className="px-4 py-2 bg-brand-primary text-white rounded text-sm font-semibold"
        >
          ✓ Validar
        </button>
      </div>
      
      {perimeterValidationResult && (
        <PerimeterValidationPanel result={perimeterValidationResult} />
      )}
    </div>
  </FormCard>
)}
```

**Responsable:** Dev

---

## FASE 5: CREAR COMPONENTE DE RESULTADOS

### Paso 5.1: PerimeterValidationPanel

**Archivo:** `src/modules/products/components/PerimeterValidationPanel.tsx`

```typescript
interface PerimeterValidationPanelProps {
  result: PerimeterValidationResult;
}

export default function PerimeterValidationPanel({
  result,
}: PerimeterValidationPanelProps) {
  if (result.errorMessages.length > 0) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4">
        <p className="text-sm font-semibold text-red-900 mb-2">
          Sin coincidencias
        </p>
        <ul className="text-sm text-red-800 space-y-1">
          {result.errorMessages.map((msg, i) => (
            <li key={i}>• {msg}</li>
          ))}
        </ul>
      </div>
    );
  }
  
  return (
    <div className="rounded-lg border border-green-200 bg-green-50 p-4">
      <p className="text-sm font-semibold text-green-900 mb-3">
        ✓ {result.alternatives.length} alternativa(s) válida(s)
      </p>
      
      <table className="w-full text-xs">
        <thead>
          <tr className="border-b border-green-200">
            <th className="text-left py-2">Máquina</th>
            <th className="text-right">N</th>
            <th className="text-right">Perímetro</th>
            <th className="text-right">R Calc</th>
            <th className="text-right">Diferencia</th>
            <th className="text-center">Disponibles</th>
          </tr>
        </thead>
        <tbody>
          {result.alternatives.map((alt, i) => (
            <tr key={i} className="border-b border-green-100">
              <td className="py-2">{alt.machineName}</td>
              <td className="text-right">{alt.repeatsPerCylinder}</td>
              <td className="text-right">{alt.registeredPerimeterMm.toFixed(4)}</td>
              <td className="text-right">{alt.calculatedRepeatMm.toFixed(4)}</td>
              <td className="text-right">{alt.differenceMm.toFixed(4)}</td>
              <td className="text-center">{alt.availableResources}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

**Responsable:** Dev

---

## FASE 6: TESTING

### Caso Obligatorio 1: POUCH BOPP Válido

```
Entradas:
- wrapperType: POUCH
- repeatTargetMm: 90.0
- toleranceMm: 0.15
- substrateId: BOPP (FE = 1.004)
- requiredWidthMm: 404.0
- N: 7
- registeredPerimeterMm: 632.2800

Esperado:
✓ VÁLIDA
- Rcalc = 632.2800 / (1.004 × 7) = 89.9659 mm
- Diferencia = |90.0 - 89.9659| = 0.0341 mm
- 0.0341 ≤ 0.15 → CUMPLE
```

**Responsable:** Dev (escribir prueba unitaria)

---

### Caso Obligatorio 2: Huecograbado 93mm Sin Coincidencias

```
Entradas:
- wrapperType: LAMINA
- repeatTargetMm: 93.0
- toleranceMm: 0.15
- printingSystemId: HUECOGRABADO
- Perímetros disponibles: 490, 500.75, 635, 642, 701.05, 724, 780.1

Cálculos:
N=6 → rango 559.33 a 561.14 (SIN perímetro en rango)
N=7 → rango 652.55 a 654.66 (SIN perímetro en rango)
N=8 → rango 745.77 a 748.18 (SIN perímetro en rango)

Esperado:
✗ SIN COINCIDENCIAS
Mensaje: "No se encontraron perímetros que cumplan..."
```

**Responsable:** Dev (escribir prueba unitaria)

---

## RESUMEN DE ARCHIVOS A CREAR/MODIFICAR

| Archivo | Acción | Responsable | Prioridad |
|---------|--------|-------------|-----------|
| `mockDatabase.ts` | Agregar SHRINK_FACTOR_CATALOG | Dev | 🔴 |
| `mockDatabase.ts` | Agregar PERIMETER_RESOURCE_CATALOG | Dev | 🔴 |
| `mockDatabase.ts` | Extender PACKING_MACHINES_CATALOG | Dev | 🔴 |
| `mockDatabase.ts` | Agregar PRINTING_SYSTEM_CATALOG | Dev | 🔴 |
| `types.ts` (nuevo) | Interfaces PerimeterValidationContext | Dev | 🔴 |
| `PerimeterValidationEngine.ts` (nuevo) | Motor de validación | Dev | 🔴 |
| `LaminateRepeatTargetResolver.ts` (nuevo) | Resolvedor LÁMINA | Dev | 🔴 |
| `BagRepeatTargetResolver.ts` (nuevo) | Resolvedor BOLSA | Dev | 🟡 |
| `PouchRepeatTargetResolver.ts` (nuevo) | Resolvedor POUCH | Dev | 🟡 |
| `ProductEditPage.tsx` | Actualizar ProjectEditFormData | Dev | 🔴 |
| `ProductEditPage.tsx` | Agregar campo toleranceMm | Dev | 🔴 |
| `ProductEditPage.tsx` | Agregar botón "Validar" | Dev | 🟡 |
| `PerimeterValidationPanel.tsx` (nuevo) | Componente de resultados | Dev | 🟡 |

---

## CHECKLIST FINAL

- [ ] FASE 1: Datos de FE, máquinas, perímetros, sistemas definidos
- [ ] FASE 2: Catálogos implementados en mockDatabase.ts
- [ ] FASE 3: Motor y resolvedores implementados
- [ ] FASE 4: Campos de formulario agregados
- [ ] FASE 5: Componente de resultados creado
- [ ] FASE 6: Pruebas unitarias pasando
- [ ] Caso POUCH BOPP devuelve 89.9659 mm ✓
- [ ] Caso Huecograbado 93mm devuelve sin coincidencias ✓
- [ ] Documentación actualizada
- [ ] Code review completado

