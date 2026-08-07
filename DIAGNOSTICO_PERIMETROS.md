# DIAGNÓSTICO: Motor de Validación de Perímetros

**Fecha:** 2025-08-05  
**Objetivo:** Evaluar la arquitectura actual y definir qué falta para implementar el motor común de validación de perímetros para LÁMINA, BOLSA y POUCH.

---

## 1. ESTADO ACTUAL

### 1.1 Estructura del Proyecto

```
src/
├── modules/products/          ← Módulo principal de productos
│   ├── components/
│   │   ├── ProductEditPage.tsx    ← INTERFAZ PRINCIPAL
│   │   ├── RewindingDirectionSelector.tsx
│   │   ├── DimensionalPlanPreview.tsx
│   │   ├── PhotoregisterPreview.tsx
│   │   └── ...
│   └── pages/
├── shared/
│   ├── data/
│   │   ├── mockDatabase.ts         ← CATÁLOGOS BÁSICOS
│   │   ├── productCatalogs.ts      ← CATÁLOGOS DE PRODUCTOS
│   │   ├── projectStorage.ts       ← ALMACENAMIENTO DE PROYECTOS
│   │   └── ...
│   ├── utils/
│   └── catalogs/
```

### 1.2 Catálogos Maestros Disponibles

#### ✅ YA EXISTEN:
- **PACKING_MACHINES_CATALOG** (en `mockDatabase.ts`)
  - Estructura: `{ id, code, name, wrappingId }`
  - Contenido: 5-6 máquinas básicas por tipo de envoltura
  - **LIMITACIÓN:** No tiene perímetros, sistemas de impresión, rangos de ancho, estado operativo

- **MACHINES_BY_WRAPPING** (en `productCatalogs.ts`)
  - Estructura: `Record<string, string[]>` con nombres de máquinas
  - Contenido: POUCH, BOLSA, LÁMINA con lista de máquinas por nombre
  - **LIMITACIÓN:** Solo nombres, no IDs ni datos técnicos

- **PLANTS_CATALOG** (en `mockDatabase.ts`)
  - Estructura: `{ id, code, name }`
  - Contenido: AF-LIM, AF-SL, AF-CAL, AF-STN

- **WRAPPINGS_CATALOG** (en `mockDatabase.ts`)
  - Estructura: `{ id, code, name }`
  - Contenido: POUCH, BOLSA, LÁMINA, ETIQUETA

#### ❌ NO EXISTEN:
- **Catálogo de Factores de Encogimiento (FE)**
  - No existe tabla/registro de FE por sustrato y espesor
  - No hay referencia a BOPP, PET, PAPEL, PEBD, etc. con sus FE

- **Catálogo de Perímetros o Cilindros**
  - No existe tabla de perímetros físicos registrados
  - No hay información de diámetro, código de cilindro, ubicación
  - No hay disponibilidad (GALVANO, ALMACÉN, PLANTA)

- **Catálogo de Sistemas de Impresión**
  - Solo se mencionan en ProductEditPage como PRINT_CLASS_OPTIONS
  - No hay tabla con Flexografía, Huecograbado, etc.

- **Parámetros de Máquina Extendidos**
  - No hay perímetro mínimo/máximo por máquina
  - No hay ancho máximo por máquina
  - No hay estado operativo (activo, inactivo, mantenimiento)

### 1.3 Estructura de Datos de Producto

**En ProductEditPage.tsx:**

```typescript
type ProjectEditFormData {
  // Dimensiones - LÁMINA
  width: string;           // "1 ANCHO DE LÁMINA"
  length: string;          // Largo/Repetición
  repetition: string;      // "2 REPETICIÓN"
  
  // Dimensiones - BOLSA
  // (No hay campos explícitos de repetición de bolsa)
  
  // Dimensiones - POUCH
  // (No hay campos explícitos: width, pouch_width, overall_width)
  
  // Perímetros - ACTUAL
  perimeterMm: string;           // Campo de texto simple
  dimensionCrossCheckStatus: string;
  perimeterValidationStatus: string;
  perimeterComment: string;
  
  // Estructura
  structureType: string;    // Monocapa, Bilaminado, Trilaminado, Tetralaminado
  layer1Material: string;
  layer1Micron: string;
  layer1Grammage: string;
  layer2Material: string;
  // ...
  
  // Impresión
  printClass: string;       // Flexo, Huecograbado, Sin impresión
  printType: string;        // Continuo, Repetitivo
}
```

**Observación:** No hay campo para indicar cuál es la capa impresa, ni para la tolerancia de perímetro.

### 1.4 Lógica Actual de Perímetros

**En ProductEditPage.tsx (BLOQUE PERÍMETROS):**

```typescript
{canEditDesign && (
  <FormCard title="Perímetros" icon="📏" color="#e74c3c">
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <FormInput
          label="Perímetro (mm)"
          type="number"
          value={form.perimeterMm}
          onChange={(value) => updateField("perimeterMm", value)}
          placeholder="0"
          disabled={!canEditDesign}
        />
        <FormSelect
          label="Validación de dimensiones"
          value={form.dimensionCrossCheckStatus}
          // ... opciones ...
        />
        <FormSelect
          label="Validación de perímetros"
          value={form.perimeterValidationStatus}
          // ... opciones ...
        />
      </div>
    </div>
  </FormCard>
)}
```

**Estado:** 
- ✅ Existe entrada de perímetro (campo de texto)
- ✅ Existe estado de validación (dropdown)
- ❌ No existe validación real de perímetro
- ❌ No hay cálculo de repetición real
- ❌ No hay búsqueda en catálogo de perímetros
- ❌ No hay validación contra tolerancia
- ❌ No hay resolución de factor de encogimiento

### 1.5 Campos Específicos por Envoltura

#### LÁMINA
- ✅ Repetición objetivo: `form.repetition` (campo "2 REPETICIÓN")
- ✅ Ancho: `form.width` (campo "1 ANCHO DE LÁMINA")
- ❌ Tolerancia de perímetro: NO EXISTE
- ❌ Capa impresa explícita: NO EXISTE (asumir Capa 1?)
- ✅ Sustrato/Micraje: `layer1Material`, `layer1Micron`
- ✅ Sentido de bobinado: `form.rewindingDirection`

#### BOLSA
- ❌ Repetición objetivo: NO EXISTE CAMPO EXPLÍCITO
  - Se calcula dinámicamente en el plano de BOLSA
  - Campos que participan: `tipoPresentacionBolsa`, `tipoSelloBolsa`, `tieneFuelleBolsa`
  - Fórmula geométrica NO DOCUMENTADA EN CÓDIGO
- ❌ Ancho total requerido: NO EXISTE CAMPO
- ❌ Tolerancia de perímetro: NO EXISTE
- ❌ Capa impresa explícita: NO EXISTE

#### POUCH
- ❌ Exact Repeat: NO EXISTE CAMPO EXPLÍCITO
- ❌ Pouch width: NO EXISTE CAMPO (¿es `width`?)
- ❌ Overall width: NO EXISTE CAMPO
- ❌ Tolerancia de perímetro: NO EXISTE
- ❌ Capa impresa explícita: NO EXISTE
- ✅ Estructura: `structureType`, `layer1-4Material`, `layer1-4Micron`

---

## 2. LO QUE FALTA

### 2.1 Catálogos Maestros Requeridos

**A. Catálogo de Factores de Encogimiento (SHRINK_FACTOR_CATALOG)**

Debe contener:
```typescript
type ShrinkFactorEntry = {
  id: string;
  substrateCode: string;  // BOPP, PET, PAPEL, PEBD, etc.
  substrateLabel: string;
  thicknessMinMicrons?: number;
  thicknessMaxMicrons?: number;
  shrinkFactor: Decimal;  // 1.004, 1.0015, etc.
  effectiveFrom: Date;
  status: 'ACTIVO' | 'INACTIVO' | 'OBSOLETO';
  priority?: number;
};
```

**Valores iniciales requeridos:**
```
BOPP        - cualquier espesor        - 1.004
PET         - cualquier espesor        - 1.0015
PAPEL       - cualquier espesor        - 1.000
PEBD/PEAD   - 18-30 µ                  - 1.017
PEBD/PEAD   - 31-60 µ                  - 1.015
PEBD/PEAD   - 61-80 µ                  - 1.010
PEBD/PEAD   - 81-135 µ                 - 1.005
PP Cast     - cualquier espesor        - 1.007
BOPA        - cualquier espesor        - 1.0015
```

**B. Catálogo de Máquinas Extendido (PRINTING_MACHINE_CATALOG)**

Ampliar `PACKING_MACHINES_CATALOG`:
```typescript
type PrintingMachine = {
  id: string;
  code: string;
  name: string;
  plantId: string;              // FK a PLANTS_CATALOG
  printingSystemId: string;     // FK a nuevo catálogo de sistemas
  wrappingType: 'LAMINA' | 'BOLSA' | 'POUCH';
  maxWidthMm: Decimal;
  minPerimeterMm: Decimal;      // NUEVO
  maxPerimeterMm: Decimal;      // NUEVO
  operativeStatus: 'ACTIVO' | 'MANTENIMIENTO' | 'INACTIVO';  // NUEVO
  priority?: number;
  notes?: string;
};
```

**Ejemplo:**
```
FLEXO-01 | Flexo Lámina Lima | LIMA | FLEXOGRAFIA | LAMINA | 2000 | 400 | 800 | ACTIVO
FLEXO-02 | Flexo Pouch Lima  | LIMA | FLEXOGRAFIA | POUCH  | 2500 | 300 | 900 | ACTIVO
HUECO-01 | Huecograbado Lima | LIMA | HUECOGRABADO | LAMINA | 1800 | 450 | 750 | ACTIVO
```

**C. Catálogo de Perímetros o Cilindros (PERIMETER_RESOURCE_CATALOG)**

Nuevo catálogo:
```typescript
type PerimeterResource = {
  id: string;
  machineId: string;            // FK a PRINTING_MACHINE_CATALOG
  plantId: string;              // FK a PLANTS_CATALOG
  cylinderCode: string;         // Código físico del cilindro
  cylinderDiameterMm: Decimal;
  registeredPerimeterMm: Decimal;  // El valor físico real
  cylinderLocation: 'GALVANO' | 'ALMACEN' | 'PLANTA' | 'MANTENIMIENTO';
  quantity: number;             // Cantidad de cilindros idénticos disponibles
  status: 'ACTIVO' | 'RESERVADO' | 'AVERIA' | 'RETIRADO';
  effectiveFrom: Date;
  lastCalibrationDate?: Date;
};
```

**Ejemplo:**
```
CYL-FLEXO-001 | FLEXO-01 | LIMA | FL-001A | 150.5 | 632.28 | GALVANO | 1 | ACTIVO
CYL-FLEXO-002 | FLEXO-01 | LIMA | FL-001B | 150.5 | 651.15 | ALMACEN | 2 | ACTIVO
CYL-HUECO-001 | HUECO-01 | LIMA | HG-001  | 175.0 | 749.50 | PLANTA  | 1 | ACTIVO
```

**D. Catálogo de Sistemas de Impresión (PRINTING_SYSTEM_CATALOG)**

Nuevo catálogo:
```typescript
type PrintingSystem = {
  id: string;
  code: string;
  name: string;  // Flexografía, Huecograbado, Offset, etc.
  minRepeatsPerCylinder?: number;  // 1, 2, ...
  maxRepeatsPerCylinder?: number;  // 10, 15, ...
  status: 'ACTIVO' | 'INACTIVO';
};
```

### 2.2 Campos de Formulario Nuevos Requeridos

**En ProductEditPage.tsx:**

```typescript
// Para TODOS los formatos (Lámina, Bolsa, Pouch)
toleranceMm: string;              // Tolerancia ±T

// Para LÁMINA específicamente
laminaPrintedLayerId: string;     // Cuál capa recibe impresión

// Para BOLSA específicamente (CAMPOS FALTANTES)
repeatTargetMm: string;           // Repetición objetivo calculada
requiredWidthMm: string;          // Ancho total requerido

// Para POUCH específicamente (CAMPOS FALTANTES)
pouchExactRepeat: boolean;        // Exact Repeat = Sí/No
pouchPrintedLayerId: string;      // Cuál capa recibe impresión
pouchWidth: string;               // Pouch width
pouchHeight: string;              // Pouch height
overallWidth: string;             // Overall width
```

### 2.3 Servicios/Motores Requeridos

**A. Motor Común: PerimeterValidationEngine**

```typescript
// src/shared/utils/perimeter-validation/PerimeterValidationEngine.ts

interface PerimeterValidationContext {
  wrapperType: 'LAMINA' | 'BOLSA' | 'POUCH';
  plantId: string;
  printingSystemId: string;
  repeatTargetMm: Decimal;
  toleranceMm: Decimal;
  requiredWidthMm: Decimal;
  printedLayerId: string;
  substrateId: string;
  thicknessMicrons?: Decimal;
  exactRepeat?: boolean;
}

interface PerimeterValidationResult {
  isValid: boolean;
  alternatives: Array<{
    machineId: string;
    machineName: string;
    repeatsPerCylinder: number;
    registeredPerimeterMm: Decimal;
    calculatedRepeatMm: Decimal;
    differenceMm: Decimal;
    shrinkFactor: Decimal;
  }>;
  messages: string[];
}

export class PerimeterValidationEngine {
  validate(context: PerimeterValidationContext): PerimeterValidationResult
}
```

**B. Resolvedores Específicos por Envoltura**

```typescript
// src/shared/utils/perimeter-validation/LaminateRepeatTargetResolver.ts
export class LaminateRepeatTargetResolver {
  resolve(formData: ProjectEditFormData): PerimeterValidationContext
}

// src/shared/utils/perimeter-validation/BagRepeatTargetResolver.ts
export class BagRepeatTargetResolver {
  resolve(formData: ProjectEditFormData): PerimeterValidationContext
}

// src/shared/utils/perimeter-validation/PouchRepeatTargetResolver.ts
export class PouchRepeatTargetResolver {
  resolve(formData: ProjectEditFormData): PerimeterValidationContext
}
```

**C. Servicio de Recuperación de Datos**

```typescript
// src/shared/data/perimeterValidationData.ts

export function getShrinkFactorForSubstrate(
  substrateId: string,
  thicknessMicrons?: number
): Decimal | null

export function getPrintingMachinesForValidation(
  wrapperType: string,
  plantId: string,
  printingSystemId: string,
  requiredWidthMm: Decimal
): PrintingMachine[]

export function getPerimeterResourcesForMachine(
  machineId: string,
  minPerimeterMm: Decimal,
  maxPerimeterMm: Decimal
): PerimeterResource[]
```

### 2.4 Componentes de Interfaz Nuevos

**A. Selector de Capa Impresa**

```typescript
// Para LÁMINA: mostrar checkboxes de capas
// El usuario debe marcar cuál capa recibe la impresión
```

**B. Campo de Tolerancia**

```typescript
// Input para tolerancia en mm (±T)
// Solo para LÁMINA, BOLSA, POUCH
```

**C. Panel de Resultados de Perímetro**

```typescript
// Mostrar:
// - Repetición objetivo
// - Tolerancia
// - Sustrato y FE
// - Máquinas compatibles
// - Alternativas de perímetro (tabla con N, P registrado, R calculada, diferencia)
// - Estado: VÁLIDO / INVÁLIDO / SIN COINCIDENCIAS
```

**D. Botón de "Validar Perímetro"**

```typescript
// Ejecutar PerimeterValidationEngine
// Mostrar resultado en modal o panel lateral
```

---

## 3. DEPENDENCIAS Y ARQUITECTURA

### 3.1 Flujo de Datos Propuesto

```
ProductEditPage
  ↓
[Usuario cambia repetición, tolerancia, estructura, impresión]
  ↓
[Click "Validar Perímetro"]
  ↓
Resolver Específico (LaminateRepeatTargetResolver, etc.)
  ↓
PerimeterValidationEngine
  ├─ Obtener ShrinkFactor de substrateId + thickness
  ├─ Filtrar máquinas por planta + sistema + ancho
  ├─ Calcular N mín/máx
  ├─ Para cada N, buscar perímetros en rango
  ├─ Recalcular repetición real
  └─ Validar contra tolerancia
  ↓
Resultado (alternativas válidas o sin coincidencias)
  ↓
[Mostrar en ProductEditPage]
  ↓
[Guardar resultado en ProjectRecord]
```

### 3.2 Dependencias de Datos

```
ProductEditPage
  ↓
LaminateRepeatTargetResolver
  ├─ Lee: form.repetition, form.width, form.layer1Material, form.layer1Micron, form.toleranceMm
  └─ Devuelve: PerimeterValidationContext
  
PerimeterValidationEngine
  ├─ Consume: PerimeterValidationContext
  ├─ Consulta: SHRINK_FACTOR_CATALOG
  ├─ Consulta: PRINTING_MACHINE_CATALOG (extendido)
  ├─ Consulta: PERIMETER_RESOURCE_CATALOG
  └─ Devuelve: PerimeterValidationResult
```

---

## 4. PRIORIDAD DE IMPLEMENTACIÓN

### Fase 1: CATÁLOGOS (CRÍTICO)

- [ ] Crear SHRINK_FACTOR_CATALOG en mockDatabase.ts
- [ ] Extender PACKING_MACHINES_CATALOG con campos faltantes
- [ ] Crear PERIMETER_RESOURCE_CATALOG en mockDatabase.ts
- [ ] Crear PRINTING_SYSTEM_CATALOG en mockDatabase.ts
- [ ] Crear funciones de acceso en src/shared/data/perimeterValidationData.ts

### Fase 2: MOTOR COMÚN (CRÍTICO)

- [ ] Implementar PerimeterValidationEngine
- [ ] Implementar LaminateRepeatTargetResolver
- [ ] Implementar BagRepeatTargetResolver
- [ ] Implementar PouchRepeatTargetResolver
- [ ] Crear pruebas unitarias del motor

### Fase 3: CAMPOS DE FORMULARIO (IMPORTANTE)

- [ ] Agregar campo toleranceMm en ProductEditFormData
- [ ] Agregar campos específicos para BOLSA
- [ ] Agregar campos específicos para POUCH
- [ ] Agregar selector de "capa impresa" para LÁMINA

### Fase 4: INTERFAZ (IMPORTANTE)

- [ ] Componente PerimeterValidationPanel
- [ ] Botón "Validar Perímetro"
- [ ] Modal/drawer de resultados
- [ ] Validación en tiempo real o deshabilitación hasta que sea válido

### Fase 5: INTEGRACIÓN (IMPORTANTE)

- [ ] Conectar resolver en cada formato
- [ ] Persistencia de resultado en ProjectRecord
- [ ] Invalidación cuando cambian datos
- [ ] Auditoría de validaciones

---

## 5. SUPUESTOS ACTUALES

1. **LÁMINA:**
   - Repetición objetivo = campo `repetition` (etiquetado como "2 REPETICIÓN")
   - Ancho requerido = campo `width` (etiquetado como "1 ANCHO DE LÁMINA")
   - Capa impresa = siempre Capa 1 (se puede hacer selectora)
   - Tolerancia = NUEVO CAMPO

2. **BOLSA:**
   - Repetición se calcula desde tipos de bolsa (FALTA FÓRMULA)
   - Ancho total = FALTA CAMPO
   - Tolerancia = NUEVO CAMPO

3. **POUCH:**
   - Con Exact Repeat = Sí, repetición = Pouch width (FALTA VALIDAR)
   - Overall width se usa para filtrar máquinas
   - Tolerancia = NUEVO CAMPO

4. **General:**
   - Los sustrato se identifican desde layer1Material, layer2Material, etc.
   - La capa impresa NO ESTÁ EXPLÍCITAMENTE MARCADA
   - Los sistemas de impresión son solo nombres en dropdown

---

## 6. PREGUNTAS PENDIENTES PARA EL USUARIO

1. **¿Existen datos reales en alguna base de datos?**
   - O ¿vamos a usar datos mock para toda la validación?

2. **¿La geometría de BOLSA está documentada en el código?**
   - ¿Dónde está la fórmula para calcular repetición en BOLSA?

3. **¿Exact Repeat en POUCH es un campo visible o interno?**
   - ¿Cómo se determina en la interfaz actual?

4. **¿La "capa impresa" debe ser seleccionable o inducida por el sistema?**

5. **¿Cuándo se ejecuta la validación?**
   - ¿Al cambiar cualquier dato (auto)?
   - ¿Solo cuando el usuario hace click?

6. **¿Si falla la validación, se bloquea el guardado?**

7. **¿Los valores de FE son finales o pueden cambiar per cliente?**

---

## 7. RESUMEN

| Aspecto | Estado | Impacto |
|---------|--------|--------|
| Catálogo de FE | ❌ NO EXISTE | CRÍTICO |
| Catálogo de Perímetros | ❌ NO EXISTE | CRÍTICO |
| Catálogo de Máquinas Extendido | ⚠️ PARCIAL | CRÍTICO |
| Motor de Validación | ❌ NO EXISTE | CRÍTICO |
| Resolvedores por Formato | ❌ NO EXISTE | CRÍTICO |
| Campos de Tolerancia | ❌ NO EXISTEN | IMPORTANTE |
| Campos de BOLSA | ⚠️ INCOMPLETOS | IMPORTANTE |
| Campos de POUCH | ⚠️ INCOMPLETOS | IMPORTANTE |
| Interfaz de Validación | ❌ NO EXISTE | IMPORTANTE |
| Capa Impresa Selectora | ❌ NO EXISTE | IMPORTANTE |

**Esfuerzo Estimado:** 5-7 días de desarrollo (con datos mock)

