# Diagrama de Flujo: Fix del Bug de Status Update

## Problema Original (Roto)

```
USER ACTIONS:
  Usuario abre ProductEditPage
  ↓
  Usuario completa formulario
  ↓
  Usuario presiona "Solicitar Producto"

PRODUCTEDIТPAGE LOGIC:
  shouldSubmitForValidation = true
  ↓
  updateProjectRecord(projectCode, {
    status: "Completado",  ← BUG: ProductStatus usado como ProjectStatus
    stage: "P2_VIABILIDAD_TECNICA",
    ...
  })

PROJECTSTORAGE - updateProjectRecord():
  normalized = normalizeProjectRecord({status: "Completado", ...})
  persistProjects([normalized, ...saved])
  addProjectStatusHistory(...)
  ↓
  localStorage["odiseo_created_projects"] = [..., {status: "Completado"}, ...]

PRODUCTLISTPAGE:
  projects = useMemo(() => getProjectRecords(), [refreshKey])
  ↓

PROJECTSTORAGE - getProjectRecords():
  createdProjects = getCreatedProjects()
  ↓
  return allProjects.map(normalizeProjectWorkflow)  ← KEY STEP

PROJECTWORKFLOW - normalizeProjectWorkflow():
  status = normalizeProjectStatus("Completado")  ← KEY BUG

PROJECTWORKFLOW - normalizeProjectStatus():
  switch ("Completado") {
    case "Registrado": return "Registrado";
    case "En Preparación": return "En Preparación";
    ...
    default: return "Registrado";  ← BUG: No case para "Completado"
  }
  ↓
  Returns: "Registrado"  ← WRONG!

PRODUCTLISTPAGE - Render:
  project.status = "Registrado"  ← WRONG, should be "Completado"
  ↓
  UserSees: Project status badge = "Registrado" ❌ (expected "Completado")
```

## Solución Implementada (Arreglado)

```
USER ACTIONS:
  Usuario abre ProductEditPage
  ↓
  Usuario completa formulario
  ↓
  Usuario presiona "Solicitar Producto"

PRODUCTEDIТPAGE LOGIC:
  shouldSubmitForValidation = true
  ↓
  updateProjectRecord(projectCode, {
    status: "Ficha Completa",  ← FIX: ProjectStatus correcto
    stage: "P2_VIABILIDAD_TECNICA",
    ...
  })

PROJECTSTORAGE - updateProjectRecord():
  normalized = normalizeProjectRecord({status: "Ficha Completa", ...})
  persistProjects([normalized, ...saved])
  addProjectStatusHistory(...)
  ↓
  localStorage["odiseo_created_projects"] = [..., {status: "Ficha Completa"}, ...]

PRODUCTLISTPAGE:
  projects = useMemo(() => getProjectRecords(), [refreshKey])
  ↓

PROJECTSTORAGE - getProjectRecords():
  createdProjects = getCreatedProjects()
  ↓
  return allProjects.map(normalizeProjectWorkflow)

PROJECTWORKFLOW - normalizeProjectWorkflow():
  status = normalizeProjectStatus("Ficha Completa")  ← Valid ProjectStatus

PROJECTWORKFLOW - normalizeProjectStatus():
  switch ("Ficha Completa") {
    case "Registrado": return "Registrado";
    case "En Preparación": return "En Preparación";
    case "Ficha completa":
    case "Ficha Completa":
    case "Completado": return "Ficha Completa";  ← FIX: Added defensive case
    ...
  }
  ↓
  Returns: "Ficha Completa"  ← CORRECT!

PRODUCTLISTPAGE - Render:
  project.status = "Ficha Completa"  ← CORRECT!
  ↓
  UserSees: Project status badge = "Ficha Completa" ✅ WORKS!
```

## Cambios de Código

### 1. ProductEditPage.tsx - Línea 4841

```typescript
// ANTES (BUG):
status: shouldSubmitForValidation ? "Completado" : calculatedStatus,
hasStartedExtendedFicha: (shouldSubmitForValidation ? "Completado" : calculatedStatus) !== "Registrado",

// DESPUÉS (FIXED):
status: shouldSubmitForValidation ? "Ficha Completa" : calculatedStatus,
hasStartedExtendedFicha: (shouldSubmitForValidation ? "Ficha Completa" : calculatedStatus) !== "Registrado",
```

### 2. projectWorkflow.ts - normalizeProjectStatus()

```typescript
// ANTES (BUG):
case "Ficha completa":
case "Ficha Completa":
  return "Ficha Completa";
// NO HAY CASE PARA "Completado" → RETORNA "Registrado" en default

// DESPUÉS (FIXED - Defensive Programming):
case "Ficha completa":
case "Ficha Completa":
case "Completado": // Map ProductStatus "Completado" to "Ficha Completa"
  return "Ficha Completa";
```

## Validación de la Solución

### Test 1: Nuevo Status se Preserva
```
Input:  updateProjectRecord(code, {status: "Ficha Completa"})
Read:   getProjectRecords()
Output: status = "Ficha Completa" ✅
```

### Test 2: Consistencia entre Métodos de Lectura
```
Input:  updateProjectRecord(code, {status: "Ficha Completa"})
Read1:  getProjectByCode(code)
Read2:  getProjectRecords().find(...)
Output: Ambos retornan "Ficha Completa" ✅
```

### Test 3: Defensa contra Datos Heredados
```
Input:  Proyecto antiguo con status: "Completado" (de antes del fix)
Read:   getProjectRecords() con normalizeProjectWorkflow()
Output: normalizeProjectStatus("Completado") → "Ficha Completa" ✅
```

## Timeline de Ejecución

### Antes (Roto)
```
t=1: User presiona "Solicitar Producto"
t=2: ProductEditPage.updateProjectRecord(status: "Completado")
t=3: Se guarda en localStorage
t=4: Usuario navega a ProductListPage
t=5: getProjectRecords() → normalizeProjectWorkflow()
t=6: normalizeProjectStatus("Completado") → "Registrado" (BUG)
t=7: ProductListPage muestra "Registrado" ❌
```

### Después (Arreglado)
```
t=1: User presiona "Solicitar Producto"
t=2: ProductEditPage.updateProjectRecord(status: "Ficha Completa")
t=3: Se guarda en localStorage
t=4: Usuario navega a ProductListPage
t=5: getProjectRecords() → normalizeProjectWorkflow()
t=6: normalizeProjectStatus("Ficha Completa") → "Ficha Completa" ✅
t=7: ProductListPage muestra "Ficha Completa" ✅
```

## Impacto

### Antes
- ❌ "Solicitar Producto" no actualizaba el status en ProductListPage
- ❌ Desconsistencia entre lo que se guardaba y lo que se mostraba
- ❌ Confusión al usuario: presiona botón pero nada parece cambiar

### Después
- ✅ Status se actualiza correctamente
- ✅ Consistencia entre guardado y lectura
- ✅ User feedback inmediato y correcto
- ✅ Defensa implementada para datos antiguos

## QA Checklist

- [x] Validado: normalizeProjectStatus("Completado") → "Ficha Completa"
- [x] Validado: normalizeProjectStatus("Ficha Completa") → "Ficha Completa"
- [x] Validado: Sin regresiones en otros estados
- [x] Validado: getProjectRecords() retorna status correcto
- [x] Validado: getProjectByCode() retorna status correcto
- [x] Validado: localStorage persiste status correctamente
- [x] Validado: odiseo_project_status_history registra cambios
- [x] Validado: Defensa contra datos heredados funciona

## Recursos

- Archivo de Validación: `validate-status-fix.js`
- Tests QA: `src/shared/data/projectStorage.test.ts`
- Documentación: `VALIDATION_STATUS_FIX.md`
