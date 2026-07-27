# 📋 DIAGNÓSTICO EXHAUSTIVO - Módulo de Estructura de Producto ODISEO

**Fecha:** 2026-07-26  
**Rama Activa:** `feature/odiseo-product-structure-validation`  
**Analista:** Claude Code  

---

## 1️⃣ ARQUITECTURA ACTUAL - FRONTEND ONLY

### Stack Tecnológico
- **Framework:** React 19.2.0 + Vite 7.2.4
- **Router:** React Router DOM 7.12.0
- **Estilos:** Tailwind CSS 3.4.17
- **Iconos:** Lucide React 0.562.0
- **Build:** TypeScript 5.9.3
- **Sin Backend:** Aplicación cliente puro con datos en localStorage

### Estructura de Directorios
```
src/
├── app/
│   ├── routeConfig.ts       (configuración de rutas)
│   └── router.tsx           (definición de router)
├── modules/
│   ├── products/            (MÓDULO PRINCIPAL DE PRODUCTOS)
│   │   ├── pages/
│   │   │   ├── ProductEditPage.tsx      (⭐ 6,962 líneas - CRÍTICO)
│   │   │   ├── ProductCreatePage.tsx
│   │   │   ├── ProductDetailPage.tsx
│   │   │   └── ProductListPage.tsx
│   │   ├── components/
│   │   │   ├── ProductStep0General.tsx
│   │   │   ├── ProductStep1Design.tsx
│   │   │   ├── ProductStep2Structure.tsx (estructura de capas)
│   │   │   ├── LayerComboInputs.tsx     (⚠️ 99 líneas - HARDCODED)
│   │   │   └── [otros...]
│   │   ├── data/
│   │   │   └── productsMock.ts
│   │   └── services/
│   │       └── productExportService.ts
│   └── [otros módulos...]
└── shared/
    ├── data/
    │   ├── productMaterialCatalog.ts     (⭐ 2,713 líneas - FUENTE DE MATERIALES)
    │   ├── productModificationCatalog.ts (308 líneas - MODIFICACIONES)
    │   ├── productCatalogs.ts            (1,503 líneas - CATÁLOGOS ODISEO)
    │   ├── projectStorage.ts             (persistencia localStorage)
    │   └── [otros...]
    └── components/
        ├── modals/
        │   ├── ProductInitialCreateModal.tsx (4,518 líneas)
        │   └── [otros...]
        └── forms/
            └── [componentes form genéricos]
```

---

## 2️⃣ PERSISTENCIA DE DATOS ACTUAL

### Modelo de Almacenamiento
**Ubicación:** `localStorage` del navegador  
**Estructura:** JSON en memoria (sin sincronización con BD real)

### Datos Persistidos

#### A. Tabla de Materiales (TABMATCAPAODISEO)
**Archivo:** `productMaterialCatalog.ts` (líneas 107-152)
- **44 registros** de materiales activos
- **Estructura:**
  ```typescript
  {
    TbMatCapPk: number,      // ID único
    TbMatCapCod: string,     // Código (MATCAP-001)
    TbMatCapGmp: string,     // Grupo (Aluminio, BOPP, PE, etc.)
    TbMatCapNom: string,     // Nombre (etiqueta UI)
    TbMatCapOrd: number,     // Orden en lista
    TbMatCapActi: boolean    // Activo/Inactivo
  }
  ```

#### B. Tabla de Micrajés (TABMATMICODISEO)
**Archivo:** `productMaterialCatalog.ts` (líneas 158-2352)
- **129 registros** de especificaciones de micraje
- **Tipos:**
  - `VALOR`: valores fijos (ej: 17 µm)
  - `RANGO`: rango permitido (ej: 25-200 µm)
- **Estructura:**
  ```typescript
  {
    TbMatMicPk: number,              // ID único
    TbMatMicCod: string,             // Código (MIC-001)
    TbMatMicMatCapFk: number,        // FK a TbMatCapPk
    TbMatMicTip: "VALOR" | "RANGO",  // Tipo
    TbMatMicVal: number | null,      // Valor (VALOR)
    TbMatMicMin/Max: number | null,  // Rango (RANGO)
    TbMatMicUni: string,             // Unidad (µm)
    TbMatMicDens: number | null,     // Densidad (g/cm³)
    TbMatMicGramTip: "FIJO"|"CALCULADO",  // Tipo gramaje
    TbMatMicGram: number | null,     // Gramaje (g/m²)
    TbMatMicOrd: number,             // Orden
    TbMatMicActi: boolean            // Activo/Inactivo
  }
  ```

#### C. Tabla de Modificaciones (TABMODPRODODISEO)
**Archivo:** `productModificationCatalog.ts` (líneas 25-122)
- **12 registros** de tipos de modificación
- Clasificación: "Producto Nuevo" (6) + "Producto Modificado" (6)
- Usados para mostrar opciones de `causal` en formularios

#### D. Catálogos ODISEO Generales
**Archivo:** `productCatalogs.ts`
- Aplicación Técnica (APT): 66 valores
- Clasificación (CSF): 2 valores
- Formato de Plano (FDP): 25 valores
- Tipo de Estructura (TDE): 4 valores ("Monocapa", "Bilaminado", etc.)
- Y más: ~20 catálogos diferentes

---

## 3️⃣ PROBLEMA: IMPLEMENTACIÓN ACTUAL vs REQUERIMIENTOS

### ❌ Problema #1: LayerComboInputs.tsx - HARDCODED
**Archivo:** `src/modules/products/components/LayerComboInputs.tsx` (99 líneas)

```typescript
// ESTO ES EL PROBLEMA ↓↓↓
const MATERIAL_MICRON_CONFIG: Record<string, {...}> = {
  BOPP: { label: "BOPP", micronOptions: ["13.5", "15", "17", "20", "25", "27", "30", "35"] },
  "PET - Cristal": { label: "PET - Cristal", micronOptions: ["10", "12"], defaultMicron: "12" },
  BOPA: { label: "BOPA / Nylon", micronOptions: ["15"], defaultMicron: "15" },
  // ... 9 materiales hardcoded con valores manuales
};
```

**Impacto:**
- ❌ No usa `productMaterialCatalog.ts` (la fuente oficial)
- ❌ Micrajés duplicados/desactualizados
- ❌ No sincroniza con cambios en la matriz de homologación
- ❌ No calcula gramaje automático

### ❌ Problema #2: ProductEditPage.tsx - MASIVO (6,962 líneas)
**Archivo:** `src/modules/products/pages/ProductEditPage.tsx`

- Archivo monolítico gigante
- Mezcla de lógica de formulario, validación y presentación
- Difícil de mantener y testear
- **Usa parcialmente** `productMaterialCatalog.ts` pero:
  ```typescript
  // Líneas 59-66: Imports correctos
  import {
    getActiveMaterialGroupOptions,
    getMaterialLayerOptionsByGroup,
    getMicronFrontendControl,    // ✅ Se usa aquí
    resolveMaterialLayer,         // ✅ Se usa aquí
    buildLayerTechnicalSnapshot,  // ✅ Se usa aquí
    getAllMaterialLayerOptions,   // ✅ Se usa aquí
    type MicronFrontendControl,
  } from "../../../shared/data/productMaterialCatalog";
  ```

### ❌ Problema #3: ProductInitialCreateModal.tsx - PARCIAL (4,518 líneas)
**Archivo:** `src/shared/components/modals/ProductInitialCreateModal.tsx`

- ✅ USA `productMaterialCatalog.ts` CORRECTAMENTE
- ✅ Integrado con búsqueda de similitud
- ✅ Calcula gramaje automático
- ⚠️ PERO: Es un modal diferente al flujo de ProductEditPage
  - Duplica lógica de capas/materiales
  - Diferentes validaciones

### ❌ Problema #4: Persistencia NO Sincronizada
- Datos en `productMaterialCatalog.ts` son **estáticos en código**
- No hay endpoint API para actualizar materiales
- No hay versionado de cambios en matriz homologación
- No hay auditoria de cambios

---

## 4️⃣ ARCHIVOS CLAVE - ANÁLISIS DETALLADO

### A. productMaterialCatalog.ts (2,713 líneas)
**Estado:** ✅ BIEN ESTRUCTURADO

Funciones Principales:
```typescript
// Obtener datos brutos
getActiveMaterialLayerRecords()              // ✅ Retorna 44 materiales activos
getActiveMicronRecords()                      // ✅ Retorna 129 micrajés activos

// Opciones de UI
getActiveMaterialGroupOptions()               // ✅ Grupos únicos
getMaterialLayerOptionsByGroup(groupName)     // ✅ Materiales por grupo

// Búsqueda
findMaterialLayerByCode(code)                 // ✅ Por código
findMaterialLayerById(id)                     // ✅ Por ID
resolveMaterialLayer(value)                   // ✅ Búsqueda flexible

// Micrajés
getMicronRecordsByMaterial(materialValue)     // ✅ Micrajés de un material
getMicronFrontendControl(materialValue)       // ✅ Retorna VALOR/RANGO/NONE para UI
findMicronRecordForValue(params)              // ✅ Valida si micrajé es permitido
isMicronAllowedForMaterial(params)            // ✅ Validación booleana

// Cálculos
calculateGrammageForMicron(params)            // ✅ Calcula gramaje
buildLayerTechnicalSnapshot(params)           // ✅ Snapshot completo de capa

// Utilitarios
normalizeMaterialText(value)                  // ✅ Normalización
normalizeUnitMeasure(unit)                    // ✅ Normaliza µm
getAllMaterialLayerOptions()                  // ✅ Todos los materiales
```

**Problemas:**
- Datos hardcoded en el mismo archivo (no separado de lógica)
- No hay validación de integridad de relaciones (FK)
- No hay versionado

### B. LayerComboInputs.tsx (99 líneas)
**Estado:** ❌ CRÍTICA - DEBE REEMPLAZARSE

Problema Actual:
```typescript
// Líneas 4-24: Hardcoded duplica productMaterialCatalog.ts
const MATERIAL_MICRON_CONFIG = {
  BOPP: {...},
  PET: {...},
  // ... 9 duplicados
};
```

**Efecto:** LayerComboInputs nunca usa `productMaterialCatalog.ts`

### C. ProductEditPage.tsx (6,962 líneas)
**Estado:** ⚠️ PARCIALMENTE CORRECTA

```typescript
// Líneas 59-66: Imports correctos de productMaterialCatalog
// Líneas 179-194: Form fields para capas (layer1-4Material/Micron/Grammage)
// PERO en componentes/renders: Usa LayerComboInputs que es hardcoded!
```

**Problema:** Mezcla código correcto con código hardcoded

### D. ProductInitialCreateModal.tsx (4,518 líneas)
**Estado:** ✅ CORRECTO PARA ESTE FLUJO

- Usa `productMaterialCatalog.ts` correctamente
- Integra búsqueda de similitud
- Calcula gramaje automático
- **PERO:** Es un flujo paralelo que crea inconsistencia

---

## 5️⃣ ENDPOINTS Y PERSISTENCIA

### Formato Actual
```
📍 Ubicación: localStorage
🔄 Sincronización: Ninguna (estático en código)
📊 Versionado: Ninguno
🔐 Auditoría: Ninguna
⚠️ Validación: Ocurre en la UI, no hay servidor
```

### Flujo de Datos
```
Usuario Edita Capas
    ↓
ProductEditPage.tsx actualiza state (React)
    ↓
projectStorage.updateProjectRecord()
    ↓
localStorage['projects'] actualizado
    ↓
Sesión se cierra → datos se pierden (sin sincronización)
```

---

## 6️⃣ DIFERENCIAS: Código Actual vs productMaterialCatalog.ts

### Tabla de Comparación

| Aspecto | LayerComboInputs | ProductEditPage | ProductInitialCreateModal | productMaterialCatalog.ts |
|---------|------------------|-----------------|---------------------------|---------------------------|
| **Fuente de Datos** | Hardcoded local | Hardcoded → productMaterialCatalog | ✅ productMaterialCatalog | ✅ TABMATCAPAODISEO |
| **# Materiales** | 10 | 10 | ✅ 44 | ✅ 44 |
| **Micrajés** | Hardcoded strings | Hardcoded strings | ✅ Catalogados | ✅ 129 registros |
| **Tipos Micrajé** | Solo VALOR | Solo VALOR | ✅ VALOR/RANGO | ✅ VALOR/RANGO |
| **Densidad** | ❌ No | ❌ No | ✅ Sí | ✅ Sí (TbMatMicDens) |
| **Gramaje** | ❌ No | ❌ No | ✅ Calculado | ✅ Sí (TbMatMicGram) |
| **Validación** | ❌ Ninguna | ❌ Ninguna | ✅ isMicronAllowedForMaterial | ✅ Función validación |
| **Homologación** | ❌ Manual | ❌ Manual | ❌ No | ✅ Matriz observable |

---

## 7️⃣ MODELO DE DATOS PARA CAPAS

### Current (LayerComboInputs - INCORRECTO)
```typescript
form.layer1Material = "BOPP"                  // String directo
form.layer1Micron = "17"                      // String directo
// ❌ Sin información de grupo, sin validación, sin gramaje
```

### Requerido (productEditPage - CORRECTO)
```typescript
form.layer1Material = "MATCAP-006"            // Código oficial
form.layer1MaterialGroup = "BOPP"             // Grupo calculado
form.layer1Micron = "17"                      // Micraje validado
form.layer1Grammage = "3.4"                   // Calculado
form.layer1Snapshot = {                       // Nuevo
  materialId: 6,
  materialCode: "MATCAP-006",
  materialGroup: "BOPP",
  materialName: "BOPP Blanco",
  micronId: 8,
  micronCode: "MIC-008",
  micronValue: "17",
  density: null,
  grammage: "2.3",
  grammageUnit: "g/m²"
}
```

---

## 8️⃣ VALIDACIONES FALTANTES

### En Producción Actual - ❌ VACÍAS

```typescript
// Validación de Capa 1-4
validateLayer1Material()  // No existe
validateLayer1Micron()    // No existe
validateLayerConsistency() // No existe

// Validaciones que DEBERÍAN existir:
✅ Material debe existir en TABMATCAPAODISEO
✅ Micraje debe ser permitido para material seleccionado
✅ Si RANGO: valor dentro de rango
✅ Si VALOR: valor debe coincidir exactamente
✅ Densidad y Gramaje deben calcularse
✅ Estructura debe ser válida (capas continuas sin gaps)
```

---

## 9️⃣ RIESGOS DE COMPATIBILIDAD

### 🔴 CRÍTICOS

1. **LayerComboInputs Hardcoded**
   - Riesgo: Usuarios crean productos con materiales inválidos
   - Impacto: Datos inconsistentes con BD real
   - Solución: Reemplazar completamente por `productMaterialCatalog.ts`

2. **Sin Validación de Micrajé**
   - Riesgo: Usuarios seleccionan micrajés no permitidos
   - Impacto: Productos rechazados en paso siguiente
   - Solución: Implementar validación contra TABMATMICODISEO

3. **Sin Cálculo de Gramaje**
   - Riesgo: Gramaje incorrecto o faltante
   - Impacto: Especificación técnica incompleta
   - Solución: Usar `calculateGrammageForMicron()`

### 🟡 MAYORES

4. **ProductEditPage vs ProductInitialCreateModal**
   - Riesgo: Dos flujos diferentes, inconsistentes
   - Impacto: UX confusa, bugs en sincronización
   - Solución: Unificar lógica, una única fuente de datos

5. **Sin Auditoria de Cambios**
   - Riesgo: No saber qué cambió, cuándo, quién
   - Impacto: Imposible rastrear problemas
   - Solución: Agregar versionado y auditoría

### 🟠 MENORES

6. **Datos Estáticos en Código**
   - Riesgo: Cambios requieren redeploy
   - Impacto: Ciclo lento de actualización
   - Solución: Separar datos en JSON o BD

---

## 🔟 TABLAS ACTUALES AFECTADAS

### localStorage (en navegador)

```json
{
  "projects": [
    {
      "id": "PRJ-001",
      "layer1Material": "BOPP",          // ⚠️ Debe ser "MATCAP-006"
      "layer1Micron": "17",              // ⚠️ Debe ser validado
      "layer1Grammage": "",              // ❌ Vacío
      "layer2Material": "PE",            // ⚠️ Debe ser "MATCAP-029"
      // ...
    }
  ]
}
```

### Datos en Código (NO en BD)

- `TABMATCAPAODISEO_INITIAL_DATA` - 44 materiales
- `TABMATMICODISEO_INITIAL_DATA` - 129 micrajés
- `TABMODPRODODISEO_INITIAL_DATA` - 12 modificaciones
- `PRODUCT_CATALOGS` - 20+ catálogos genéricos

---

## 1️⃣1️⃣ PLAN DE IMPLEMENTACIÓN (POR ETAPAS)

### ✅ ETAPA 1: Análisis y Preparación (YA COMPLETADA)
- [x] Exploración de código
- [x] Identificación de problemas
- [x] Mapeo de dependencias
- [x] Creación de rama feature

### 🔄 ETAPA 2: Reemplazo de LayerComboInputs (PRÓXIMO)
1. Crear nuevo componente `LayerStructureInputs.tsx`
2. Usar `productMaterialCatalog.ts` como fuente única
3. Integrar validación de micrajés (VALOR/RANGO)
4. Calcular gramaje automático
5. Actualizar ProductEditPage para usar nuevo componente
6. Tests unitarios

### 🔄 ETAPA 3: Validación en ProductEditPage
1. Agregar funciones `validateLayerN()`
2. Validar estructura (sin gaps)
3. Validar micrajés permitidos
4. Validar consistencia de especificaciones
5. Mostrar errores en UI

### 🔄 ETAPA 4: Unificación de Flujos
1. Auditar ProductInitialCreateModal
2. Crear composable compartido para capas
3. Sincronizar lógica entre flujos
4. Tests de integración

### 🔄 ETAPA 5: Persistencia Mejorada
1. Guardar `layer1Snapshot` completo (no solo material+micron)
2. Guardar historial de cambios
3. Auditoria de cambios (quién, cuándo, qué)
4. Versioning de estructura

### 🔄 ETAPA 6: QA y Validación
1. Pruebas manuales exhaustivas
2. Tests de regresión
3. Validación de matriz homologación
4. Performance checks

---

## 1️⃣2️⃣ ARQUITECTURA PROPUESTA

### Estructura Mejorada
```
src/
└── modules/products/
    ├── components/
    │   ├── layers/
    │   │   ├── LayerStructureInputs.tsx      (✨ NUEVO - usa productMaterialCatalog)
    │   │   ├── MaterialSelector.tsx           (✨ NUEVO - wrapper para material)
    │   │   ├── MicronSelector.tsx             (✨ NUEVO - VALOR/RANGO handling)
    │   │   └── LayerPreview.tsx               (✨ NUEVO - muestra snapshot)
    │   ├── ProductStep2Structure.tsx          (actualizado)
    │   └── LayerComboInputs.tsx               (⏹️ DEPRECADO)
    ├── hooks/
    │   └── useLayerValidation.ts              (✨ NUEVO)
    ├── validators/
    │   └── layerValidator.ts                  (✨ NUEVO - validaciones)
    └── [resto sin cambios...]
```

### Funciones de Validación (NUEVAS)
```typescript
// validators/layerValidator.ts
export function validateMaterialExists(code: string): boolean
export function validateMicronForMaterial(material: string, micron: string): boolean
export function validateLayerStructure(layers: Layer[]): ValidationError[]
export function validateGrammageCalculation(material: string, micron: string): number | null
```

---

## 1️⃣3️⃣ CHECKLIST DE COMPATIBILIDAD

### Antes de Cambios
- [x] Branch creado: `feature/odiseo-product-structure-validation`
- [x] Diagnostico completado
- [x] Funcionalidad actual documentada
- [ ] Usuarios actuales en localStorage identificados

### Durante Cambios
- [ ] LayerComboInputs reemplazado
- [ ] Tests de unidad agregados
- [ ] Validaciones implementadas
- [ ] Flujos unificados
- [ ] Regresiones probadas

### Después de Cambios
- [ ] QA exhaustiva
- [ ] Matriz de homologación validada
- [ ] Auditoría de cambios funcional
- [ ] Documentación actualizada
- [ ] Deploy a producción

---

## 1️⃣4️⃣ DECISIONES DE DISEÑO

### 1. Usar productMaterialCatalog.ts como Fuente Única
**Decisión:** ✅ CONFIRMADA
- Pros: Ya existe, está bien estructurado, tiene todas las funciones
- Contras: Datos hardcoded en código
- Mitigación: Futura separación a JSON/API

### 2. Guardar Snapshots de Capas
**Decisión:** ✅ CONFIRMADA
- Almacenar snapshot completo para auditoría
- Permite rastrear cambios históricos
- Valida integridad de datos retrospectivamente

### 3. No Inventar Homologaciones
**Decisión:** ✅ CONFIRMADA (PER USUARIO)
- Materiales/micrajés solo de TABMATCAPAODISEO + TABMATMICODISEO
- Valores no homologados → error/bloqueo
- Reportar como pendientes para homologación oficial

### 4. Preservar Funcionalidad Actual
**Decisión:** ✅ CONFIRMADA
- Solo cambiar estructura/materiales/micraje/densidad/gramaje
- NO tocar: diseño, dimensiones, accesorios, packaging, etc.
- Mantener todos los catálogos existentes

---

## 1️⃣5️⃣ METADATOS DEL ANÁLISIS

```json
{
  "analisis_fecha": "2026-07-26",
  "rama_trabajo": "feature/odiseo-product-structure-validation",
  "archivos_analizados": 27,
  "lineas_codigo": 11585,
  "problemas_identificados": 4,
  "riesgos_criticos": 3,
  "riesgos_mayores": 2,
  "riesgos_menores": 1,
  "etapas_implementacion": 6,
  "componentes_nuevos": 4,
  "funciones_nuevas": 5,
  "validaciones_nuevas": 4
}
```

---

## 📌 CONCLUSIÓN

**Estado Actual:** ⚠️ CRÍTICO
- Código duplicado (Hardcoded vs productMaterialCatalog.ts)
- Validaciones ausentes
- Riesgo de datos inválidos
- Inconsistencia entre flujos

**Acción Requerida:** ✅ PROCEDIMIENTO LISTADO ARRIBA

**Próximo Paso:** Aguardar confirmación del usuario antes de implementar.

---

**Documento Generado por:** Claude Code  
**Herramientas Usadas:** Glob, Read, Bash, Git  
**Verificación:** Manual exhaustiva del código fuente
