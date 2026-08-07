# DIAGNÓSTICO EJECUTIVO: Motor de Perímetros

## 🎯 Situación Actual

### ✅ Qué SÍ Existe
```
ProductEditPage.tsx
  ├─ Campo: perimeterMm (entrada de texto)
  ├─ Campo: perimeterValidationStatus (dropdown)
  ├─ Campo: dimensionCrossCheckStatus
  └─ SIN VALIDACIÓN REAL

Catálogos Básicos
  ├─ PLANTS_CATALOG (4 plantas)
  ├─ PACKING_MACHINES_CATALOG (5-6 máquinas simples)
  ├─ MACHINES_BY_WRAPPING (nombres solamente)
  └─ Estructura de capas (layer1-4 material/micron)
```

### ❌ Qué NO Existe
```
CATÁLOGOS CRÍTICOS
  ├─ ❌ Factores de Encogimiento (FE: BOPP=1.004, PET=1.0015, etc.)
  ├─ ❌ Perímetros Físicos (cilindros registrados con diámetro y perímetro)
  ├─ ❌ Máquinas Extendidas (perímetro min/max, sistema impresión, estado)
  ├─ ❌ Sistemas de Impresión (Flexo, Huecograbado, etc. como tabla)
  └─ ❌ Tolerancia de Perímetro (campo en formulario)

MOTOR Y RESOLVEDORES
  ├─ ❌ Motor común de validación (PerimeterValidationEngine)
  ├─ ❌ Resolvedor LÁMINA (cómo obtener repetición objetivo)
  ├─ ❌ Resolvedor BOLSA (cómo obtener repetición objetivo)
  └─ ❌ Resolvedor POUCH (cómo obtener repetición objetivo)

CAMPOS DE FORMULARIO
  ├─ ❌ toleranceMm (para todos los formatos)
  ├─ ❌ printedLayerId (cuál capa recibe impresión)
  ├─ BOLSA: ❌ repetición objetivo + ancho total requerido
  └─ POUCH: ❌ exactRepeat, pouchWidth, overallWidth

INTERFAZ
  ├─ ❌ Panel de resultados de validación
  ├─ ❌ Botón "Validar Perímetro"
  ├─ ❌ Modal de alternativas
  └─ ❌ Visualización de N, perímetro registrado, repetición calculada, diferencia
```

---

## 📊 MATRIZ DE DEPENDENCIAS

```
ProductEditPage
    │
    └─→ Usuario completa: repetición, tolerancia, estructura, impresión
        │
        └─→ [Click "Validar Perímetro"]
            │
            ├─→ Resolver Específico (ej: LaminateRepeatTargetResolver)
            │   └─→ Lee campos del formulario
            │       └─→ Devuelve PerimeterValidationContext
            │
            └─→ PerimeterValidationEngine
                │
                ├─→ 1. Obtener FE
                │   └─→ Consulta SHRINK_FACTOR_CATALOG
                │       └─→ Por sustrato + espesor
                │
                ├─→ 2. Filtrar Máquinas
                │   └─→ Consulta PRINTING_MACHINE_CATALOG
                │       └─→ Por planta, sistema, ancho requerido
                │
                ├─→ 3. Calcular N mín/máx
                │   └─→ Rmax×FE×Nmin ≤ Pmáquina ≤ Rmin×FE×Nmax
                │
                ├─→ 4. Buscar Perímetros
                │   └─→ Consulta PERIMETER_RESOURCE_CATALOG
                │       └─→ Por máquina + rango de perímetro
                │
                ├─→ 5. Validar Cada Alternativa
                │   └─→ Rcalc = Preg / (FE × N)
                │       └─→ Si |Robj - Rcalc| ≤ Tolerancia → VÁLIDA
                │
                └─→ Devuelve PerimeterValidationResult
                    ├─ Alternativas válidas (o vacío si no hay)
                    ├─ Mensajes de error (si aplica)
                    └─ Métricas para UI
```

---

## 🔴 CRÍTICO: Qué Falta

### 1. SHRINK_FACTOR_CATALOG (Tabla de Factores de Encogimiento)

**Estado:** ❌ NO EXISTE  
**Urgencia:** CRÍTICA (sin esto, no se pueden hacer cálculos)

```
Sustrato      Espesor mín  Espesor máx  FE
BOPP          0            99999        1.004000
PET           0            99999        1.001500
PAPEL         0            99999        1.000000
PEBD/PEAD     18           30           1.017000
PEBD/PEAD     31           60           1.015000
PEBD/PEAD     61           80           1.010000
PEBD/PEAD     81           135          1.005000
PP Cast       0            99999        1.007000
BOPA          0            99999        1.001500
```

**A crear en:** `src/shared/data/mockDatabase.ts`

### 2. PERIMETER_RESOURCE_CATALOG (Tabla de Perímetros Físicos)

**Estado:** ❌ NO EXISTE  
**Urgencia:** CRÍTICA (sin esto, no hay alternativas que mostrar)

```
Máquina       Planta  Código Cilindro  Perímetro (mm)  Ubicación  Estado
FLEXO-01      LIMA    FL-001A          632.2800         GALVANO   ACTIVO
FLEXO-01      LIMA    FL-001B          651.1500         ALMACEN   ACTIVO
HUECO-01      LIMA    HG-001           749.5000         PLANTA    ACTIVO
...
```

**A crear en:** `src/shared/data/mockDatabase.ts`

### 3. PerimeterValidationEngine (Motor de Validación)

**Estado:** ❌ NO EXISTE  
**Urgencia:** CRÍTICA (sin esto, no hay validación)

**A crear en:** `src/shared/utils/perimeter-validation/PerimeterValidationEngine.ts`

```typescript
export class PerimeterValidationEngine {
  validate(context: PerimeterValidationContext): PerimeterValidationResult {
    // 1. Validar entradas
    // 2. Obtener FE
    // 3. Filtrar máquinas
    // 4. Calcular N mín/máx
    // 5. Buscar perímetros
    // 6. Validar cada alternativa
    // 7. Retornar resultado
  }
}
```

### 4. Resolvedores Específicos (Lámina, Bolsa, Pouch)

**Estado:** ❌ NO EXISTEN  
**Urgencia:** CRÍTICA (sin esto, no se sabe qué repetición objetivo usar)

**A crear en:** `src/shared/utils/perimeter-validation/`

- `LaminateRepeatTargetResolver.ts` → lee `form.repetition`
- `BagRepeatTargetResolver.ts` → calcula desde geometría de bolsa
- `PouchRepeatTargetResolver.ts` → lee `form.pouchWidth` (si Exact Repeat = Sí)

### 5. Campo de Tolerancia en Formulario

**Estado:** ❌ NO EXISTE  
**Urgencia:** IMPORTANTE (sin esto, no hay tolerancia)

```typescript
type ProjectEditFormData {
  // ... campos existentes ...
  toleranceMm: string;  // ✨ NUEVO
}
```

---

## 📋 CHECKLIST DE IMPLEMENTACIÓN

### FASE 1: CATÁLOGOS (3-4 horas)
- [ ] Crear SHRINK_FACTOR_CATALOG en mockDatabase.ts
- [ ] Crear PERIMETER_RESOURCE_CATALOG en mockDatabase.ts  
- [ ] Extender PACKING_MACHINES_CATALOG con minPerimeterMm, maxPerimeterMm
- [ ] Crear PRINTING_SYSTEM_CATALOG (Flexo, Huecograbado, etc.)
- [ ] Crear funciones accessoras en perimeterValidationData.ts

### FASE 2: MOTOR (4-5 horas)
- [ ] Crear PerimeterValidationEngine (lógica de validación)
- [ ] Crear LaminateRepeatTargetResolver
- [ ] Crear BagRepeatTargetResolver
- [ ] Crear PouchRepeatTargetResolver
- [ ] Crear interfaces TypeScript
- [ ] Crear pruebas unitarias (motor + resolvedores)

### FASE 3: FORMULARIO (2 horas)
- [ ] Agregar toleranceMm a ProjectEditFormData
- [ ] Agregar campo toleranceMm en ProductEditPage (input)
- [ ] Agregar campos específicos para BOLSA
- [ ] Agregar campos específicos para POUCH
- [ ] Agregar selector de "capa impresa" (si aplica)

### FASE 4: INTERFAZ (3-4 horas)
- [ ] Crear componente PerimeterValidationPanel
- [ ] Crear modal/drawer de resultados
- [ ] Agregar botón "Validar Perímetro"
- [ ] Validación y estado visual (pendiente/válido/inválido)
- [ ] Tabla de alternativas

### FASE 5: INTEGRACIÓN (2-3 horas)
- [ ] Conectar resolver en cada formato
- [ ] Persistencia en ProjectRecord
- [ ] Invalidación al cambiar datos
- [ ] Auditoría básica

---

## 🎯 PRÓXIMOS PASOS

### 1️⃣ CONSENSO EN DATOS
**Preguntas para el usuario:**
- ¿Existen FE reales en un documento o utilizamos los valores propuestos?
- ¿Cuántos perímetros/cilindros físicos existen por máquina?
- ¿La geometría de BOLSA está documentada? ¿Dónde?
- ¿El campo toleranceMm debe ser global o por formato?

### 2️⃣ CREAR CATÁLOGOS MOCK
**Responsable:** Usuario proporciona datos, Dev crea tablas

Datos iniciales:
- Al menos 2-3 máquinas por tipo de envoltura
- Al menos 3-5 perímetros por máquina
- Todos los factores FE referenciados

### 3️⃣ IMPLEMENTAR MOTOR
**Responsable:** Dev

Core logic (PerimeterValidationEngine) sin dependencias de UI.

### 4️⃣ INTEGRAR EN FORMULARIOS
**Responsable:** Dev + Usuario (validación)

Conectar Motor en ProductEditPage para LÁMINA, BOLSA, POUCH.

### 5️⃣ TESTING
**Responsable:** Dev + Usuario (casos de negocio)

- Caso 1: POUCH 90mm ±0.15 → VÁLIDA (ejemplo obligatorio)
- Caso 2: Huecograbado 93mm → SIN COINCIDENCIAS
- Casos adicionales por envoltura

---

## 📈 ESTIMACIÓN DE ESFUERZO

| Fase | Horas | Notas |
|------|-------|-------|
| 1. Catálogos | 3-4 | Con datos proporcionados |
| 2. Motor | 4-5 | Lógica pura, pruebas |
| 3. Formulario | 2 | Campos + actualización de tipos |
| 4. Interfaz | 3-4 | Panel + modal + tabla |
| 5. Integración | 2-3 | Persistencia + invalidación |
| Testing | 2-3 | Unitarias + integración |
| **TOTAL** | **16-22 horas** | ~2-3 días de trabajo |

---

## 🚀 RECOMENDACIÓN

**Comenzar por FASE 1 y FASE 2 en paralelo:**
- Dev prepara estructura (interfaces, motor, resolvedores)
- Usuario proporciona datos (FE, perímetros, máquinas)
- Merge y validación temprana

**No esperar a tener la interfaz completa para validar el core.**

