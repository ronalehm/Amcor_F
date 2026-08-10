# Investigación y Resolución: Status Update Bug en ProductListPage

## Resumen Ejecutivo

**Problema**: Cuando un usuario presionaba "Solicitar Producto" en ProductEditPage, el estado debería cambiar a "Completado" en ProductListPage, pero permanecía en "Registrado".

**Causa Raíz**: ProductEditPage enviaba un ProductStatus ("Completado") en lugar de un ProjectStatus válido, y normalizeProjectStatus() no tenía manejo para este estado, retornando "Registrado" por defecto.

**Resolución**: Cambiar ProductEditPage a usar "Ficha Completa" (ProjectStatus válido) y agregar defensa en normalizeProjectStatus().

**Impacto**: Bug crítico que rompe la experiencia del usuario al presionar "Solicitar Producto".

---

## Análisis Detallado

### 1. Identificación del Bug

#### Síntomas Observados
```
ProductEditPage (DEBUG log): statusThatWasSaved: "Completado" ✅
odiseo_project_status_history: {"fromStatus":"Registrado","toStatus":"Completado"} ✅
ProductListPage render: status mostrado = "Registrado" ❌
```

#### ¿Por qué ocurría?
1. Se guardaba correctamente en localStorage
2. Se registraba correctamente en historial
3. Pero al leer con getProjectRecords(), el status se transformaba

### 2. Investigación de la Cadena de Lectura

#### Stack Trace de la Lectura:
```
ProductListPage.jsx (línea 360)
  ↓ useMemo(() => getProjectRecords())
  ↓
projectStorage.ts - getProjectRecords() (línea 931)
  ↓ reads from localStorage using getCreatedProjects()
  ↓ calls normalizeProjectWorkflow() on each project
  ↓
projectWorkflow.ts - normalizeProjectWorkflow() (línea 522)
  ↓ calls normalizeProjectStatus(rawStatus) on line 524
  ↓
projectWorkflow.ts - normalizeProjectStatus() (línea 306)
  ↓ switch statement - no case for "Completado"
  ↓ returns "Registrado" (default case - LINE 351)
  ↓
PROJECT STATUS BECOMES "Registrado" ← BUG ORIGIN
```

### 3. Análisis de Tipos de Estado

**ProjectStatus** (válidos para ProjectRecord.status):
- "Registrado"
- "En Preparación"
- "Ficha Completa"
- "En validación"
- "Observado"
- "Validado"
- "Productos preliminares"
- "En Cotización"
- "Cotización Completa"
- "Aprobado por Cliente"
- "Validación Tesorería"
- "Alta Producto"
- "Desestimado"

**ProductStatus** (válidos para ProductRecord, pero no para ProjectStatus):
- "Registrado"
- "En Preparación"
- "Completado" ← El problema
- "Dado de alta"

### 4. Ubicación de la Causa en ProductEditPage

**Archivo**: src/modules/products/pages/ProductEditPage.tsx
**Línea 4841**:
```typescript
status: shouldSubmitForValidation ? "Completado" : calculatedStatus,
```

**Línea 4844**:
```typescript
hasStartedExtendedFicha: (shouldSubmitForValidation ? "Completado" : calculatedStatus) !== "Registrado",
```

**Contexto**:
- Cuando usuario presiona "Solicitar Producto", `shouldSubmitForValidation = true`
- El código enviaba "Completado" (incorrecto) en lugar de un ProjectStatus válido
- Se establece `stage: "P2_VIABILIDAD_TECNICA"` que corresponde a "En validación" o "Ficha Completa"

### 5. Análisis de Impacto

**¿Qué funciones se vieron afectadas?**

1. **updateProjectRecord()** (projectStorage.ts:1060)
   - Guardaba correctamente el status que recibía
   - No validaba que fuera un ProjectStatus válido
   - Se confiaba en la normalización posterior

2. **getProjectRecords()** (projectStorage.ts:931)
   - Leía del localStorage correctamente
   - Llamaba normalizeProjectWorkflow() que normalizaba incorrectamente

3. **normalizeProjectStatus()** (projectWorkflow.ts:306)
   - Falta de case para "Completado"
   - Retornaba default "Registrado"

4. **ProductListPage** (línea 360-375)
   - Mostraba el status normalizado incorrectamente

---

## Solución Implementada

### Fix 1: Cambiar ProductEditPage (Corrección Principal)

**Archivo**: src/modules/products/pages/ProductEditPage.tsx
**Líneas**: 4841, 4844

```typescript
// ANTES:
status: shouldSubmitForValidation ? "Completado" : calculatedStatus,
...
hasStartedExtendedFicha: (shouldSubmitForValidation ? "Completado" : calculatedStatus) !== "Registrado",

// DESPUÉS:
status: shouldSubmitForValidation ? "Ficha Completa" : calculatedStatus,
...
hasStartedExtendedFicha: (shouldSubmitForValidation ? "Ficha Completa" : calculatedStatus) !== "Registrado",
```

**Justificación**:
- "Ficha Completa" es un ProjectStatus válido
- Representa que la ficha del proyecto está completa
- Coherente con stage: "P2_VIABILIDAD_TECNICA"

### Fix 2: Agregar Defensa en normalizeProjectStatus()

**Archivo**: src/shared/data/projectWorkflow.ts
**Línea**: ~320

```typescript
// ANTES:
case "Ficha completa":
case "Ficha Completa":
  return "Ficha Completa";
// [default case retorna "Registrado"]

// DESPUÉS:
case "Ficha completa":
case "Ficha Completa":
case "Completado": // Map ProductStatus "Completado" to "Ficha Completa" for defensive programming
  return "Ficha Completa";
// [default case retorna "Registrado"]
```

**Justificación**:
- Protege contra datos heredados que pudieran tener "Completado"
- Asegura que incluso si hay inconsistencia anterior, se normaliza correctamente
- Principio de defensa en programación

---

## Validación

### Validación Script (validate-status-fix.js)

```bash
$ node validate-status-fix.js

TEST 1: Normalización de 'Completado'
Resultado: "Ficha Completa" ✅ PASS

TEST 2: Normalización de 'Ficha Completa'
Resultado: "Ficha Completa" ✅ PASS

TEST 3: Otros Estados (Regresión)
  Registrado → Registrado: ✅
  En Preparación → En Preparación: ✅
  En validación → En validación: ✅
  Validado → Validado: ✅
  Desestimado → Desestimado: ✅
Estado Global: ✅ PASS
```

### Unit Tests (src/shared/data/projectStorage.test.ts)

1. **PASSING TEST: Should preserve 'Ficha Completa' status**
   - Crea proyecto
   - Actualiza con status "Ficha Completa"
   - Verifica getProjectRecords() retorna "Ficha Completa" ✅

2. **PASSING TEST: getProjectByCode() consistency**
   - Verifica ambos métodos de lectura retornan el mismo status ✅

3. **DEFENSIVE TEST: Legacy 'Completado' handling**
   - Simula datos heredados con "Completado"
   - Verifica normalización a "Ficha Completa" ✅

---

## Flujo Después del Fix

```
USER ACTIONS:
  Usuario presiona "Solicitar Producto"

PRODUCTEDIТPAGE:
  updateProjectRecord(projectCode, {
    status: "Ficha Completa",  ← FIX: Ahora usa ProjectStatus válido
    stage: "P2_VIABILIDAD_TECNICA",
    validacionSolicitada: true,
  })

PROJECTSTORAGE - persistProjects():
  localStorage["odiseo_created_projects"] = [..., {
    status: "Ficha Completa",
    ...
  }]

PRODUCTLISTPAGE - useMemo(() => getProjectRecords()):
  getProjectRecords() →
  normalizeProjectWorkflow() →
  normalizeProjectStatus("Ficha Completa") →
  Returns: "Ficha Completa" ✅

RENDER:
  status badge = "Ficha Completa" ✅ CORRECTO
```

---

## Documentación Generada

### Archivos de Investigación y Validación

1. **VALIDATION_STATUS_FIX.md**
   - Análisis completo del problema
   - Root cause analysis
   - Soluciones implementadas
   - Validación de cada caso
   - Archivos modificados

2. **STATUS_FIX_FLOWCHART.md**
   - Diagrama de flujo antes del fix (roto)
   - Diagrama de flujo después del fix (arreglado)
   - Cambios de código detallados
   - Timeline de ejecución
   - Validación QA checklist

3. **src/shared/data/projectStorage.test.ts**
   - Suite de tests QA
   - Tests de status persistence
   - Tests de consistencia entre métodos
   - Tests de defensa contra datos heredados

4. **validate-status-fix.js**
   - Script de validación standalone
   - Puede ejecutarse sin dependencias
   - Demuestra que la normalización funciona correctamente

---

## Casos de Uso Validados

### Caso 1: Nuevo Proyecto → Solicitar Producto
```
1. Usuario crea proyecto (status = "Registrado")
2. Usuario completa formulario
3. Usuario presiona "Solicitar Producto"
4. ProductEditPage establece status = "Ficha Completa"
5. Se guarda en localStorage
6. ProductListPage muestra "Ficha Completa" ✅
```

### Caso 2: Datos Heredados con "Completado"
```
1. Proyecto antiguo con status = "Completado" (pre-fix)
2. Sistema lee el proyecto
3. normalizeProjectStatus("Completado") → "Ficha Completa"
4. Se normaliza correctamente ✅
```

### Caso 3: Cambio Posterior a "En Validación"
```
1. Proyecto con status = "Ficha Completa"
2. Se solicita validación manual
3. Se establece status = "En validación"
4. Se lee correctamente en ProductListPage ✅
```

---

## Cambios de Git

```
commit 3b9a88e
Author: Claude Haiku <noreply@anthropic.com>
Date: 2026-08-09

fix: Critical bug - Status not updating in ProductListPage after 'Solicitar Producto'

6 files changed, 878 insertions(+), 123 deletions(-)
create mode 100644 STATUS_FIX_FLOWCHART.md
create mode 100644 VALIDATION_STATUS_FIX.md
create mode 100644 src/shared/data/projectStorage.test.ts
create mode 100644 validate-status-fix.js
```

---

## Recomendaciones de QA

### Testing Manual Checklist

- [ ] Crear nuevo proyecto desde ProductCreatePage
- [ ] Completar toda la información requerida en ProductEditPage
- [ ] Presionar botón "Solicitar Producto"
- [ ] Abrir DevTools → Application → localStorage
- [ ] Verificar odiseo_created_projects contiene el proyecto con status: "Ficha Completa"
- [ ] Navegar a ProductListPage (F5 para refrescar)
- [ ] Verificar que el proyecto muestra estado "Ficha Completa" (no "Registrado")
- [ ] Verificar odiseo_project_status_history registra el cambio correctamente
- [ ] Intentar cambiar a otros estados y verificar que se preservan

### Testing de Regresión

- [ ] Crear proyecto con classification "Modificado"
- [ ] Verificar que los cambios de status funcionan correctamente
- [ ] Validar que otros estados (Registrado, En Preparación, etc.) aún funcionan
- [ ] Verificar que getProjectByCode() retorna status correcto

### Datos para Testing

```sql
-- Si hay base de datos, agregar proyecto de prueba con status heredado:
INSERT INTO projects (code, status) VALUES ('TEST-LEGACY-001', 'Completado');
-- Verificar que se normaliza a 'Ficha Completa'
```

---

## Conclusión

El bug ha sido identificado, aislado, corregido y validado. La solución implementa:

1. **Corrección Principal**: ProductEditPage ahora usa "Ficha Completa" (ProjectStatus válido)
2. **Defensa**: normalizeProjectStatus() maneja "Completado" de forma segura
3. **Testing**: Suite completa de tests QA para prevenir regresiones
4. **Documentación**: Análisis exhaustivo de causa raíz y flujo de datos

El sistema ahora funciona correctamente cuando un usuario presiona "Solicitar Producto" en ProductEditPage y el estado se refleja correctamente en ProductListPage.
