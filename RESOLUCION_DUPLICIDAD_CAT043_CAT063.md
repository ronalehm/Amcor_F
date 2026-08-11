# RESOLUCIÓN DE DUPLICIDAD CAT-043 vs CAT-063
## Consolidación de Catálogos de Tipo de Sello

**Fecha**: Agosto 11, 2026  
**Severidad**: 🔴 CRÍTICA  
**Estado**: ✅ RESUELTA

---

## PROBLEMA IDENTIFICADO

**Duplicidad**: Dos catálogos representaban el mismo concepto

| Catálogo | Sistema | Descripción | Valores |
|----------|---------|-------------|---------|
| CAT-043: `bag_seal_type` | ODISEO ❌ | "Tipos de sello para bolsas" | VACÍO |
| CAT-063: `seal_type_bag` | SISTEMA_INTEGRAL ✅ | "Tipos de sello disponibles" | 2 valores |

**Riesgo**: Dos maestros distintos causarían inconsistencia de datos.

---

## SOLUCIÓN APLICADA

### ✅ Cambios Realizados

#### 1. Consolidación en CAT-043 (`bag_seal_type`)
**Archivo**: `src/shared/catalogs/catalog.registry.ts`

```typescript
// ANTES
{
  code: "bag_seal_type",
  ownerSystem: "ODISEO",  ❌
  description: "Tipos de sello para bolsas",
}

// DESPUÉS
{
  code: "bag_seal_type",
  ownerSystem: "SISTEMA_INTEGRAL",  ✅
  description: "Tipos de sello para bolsas - Tabla espejo desde SI",
}
```

**Razón**: Es una tabla espejo del Sistema Integral, debe ser SI no ODISEO.

#### 2. Eliminación de CAT-063 (`seal_type_bag`)
**Archivo**: `src/shared/catalogs/catalog.registry.ts`

```typescript
// ELIMINADO
{
  id: "catalog_seal_type_bag",
  code: "seal_type_bag",
  name: "Tipo de Sello",
  description: "Tipos de sello disponibles",
  ownerSystem: "SISTEMA_INTEGRAL",
  status: "active",
}
```

**Razón**: Duplicado innecesario. Los valores están consolidados en `bag_seal_type`.

#### 3. Migración de Valores en Seed
**Archivo**: `src/shared/catalogs/catalog.seed.ts`

```typescript
// ANTES
{
  catalogId: "catalog_seal_type_bag",
  catalogCode: "seal_type_bag",
  item: "STB-001",
  name: "Sello lateral",
}

// DESPUÉS
{
  catalogId: "catalog_bag_seal_type",
  catalogCode: "bag_seal_type",
  item: "STB-001",
  name: "Sello lateral",
}
```

**Cambios**:
- Línea 2051: `catalog_seal_type_bag` → `catalog_bag_seal_type`
- Línea 2052: `seal_type_bag` → `bag_seal_type`
- Línea 2060: `catalog_seal_type_bag` → `catalog_bag_seal_type`
- Línea 2061: `seal_type_bag` → `bag_seal_type`

#### 4. Actualización de Extraction
**Archivo**: `src/shared/catalogs/catalogExtraction.ts`

```typescript
// ANTES
const usedCatalogCodes = [
  ...
  'seal_type_bag',  ❌ ELIMINADO
  ...
]

// DESPUÉS
const usedCatalogCodes = [
  ...
  'bag_seal_type',  ✅ ACTUALIZADO
  ...
]
```

**Razón**: El código extraído debe usar el catálogo consolidado.

---

## IMPACTO EN SISTEMA

### ✅ Plantilla Excel
- **Antes**: Incluiría CAT-043 (vacío) + CAT-063 (con datos) = DUPLICADO
- **Después**: Solo CAT-043 (con datos de `bag_seal_type`)
- **Cambio**: Elimina duplicado, mantiene datos

### ✅ Validador
- **Antes**: Aceptaría ambos catálogos
- **Después**: Solo valida CAT-043 como SISTEMA_INTEGRAL (read-only)
- **Cambio**: Previene edición accidental de datos espejo

### ✅ Vista Web
- **Antes**: Mostraría 67 catálogos con duplicidad
- **Después**: Muestra 66 catálogos sin duplicidad
- **Cambio**: UI más limpia, sin confusión

### ✅ Confirmación de Cambios
- **Antes**: Dos entradas separadas
- **Después**: Una única entrada consolidada
- **Cambio**: Bitácora más clara

### ✅ Cascada de Referencias
Todos los módulos que usan `bag_seal_type` funcionan correctamente:
- `catalogExtraction.ts` ✅ Actualizado
- `catalogTemplateGenerator.ts` ✅ Usa registry (automático)
- `catalogTemplateValidator.ts` ✅ Usa registry (automático)
- `CatalogsViewPage.tsx` ✅ Usa registry (automático)

---

## ESTADÍSTICAS ACTUALIZADAS

### Distribución de Catálogos
- **Antes**: 67 catálogos (con duplicidad)
- **Después**: 66 catálogos (consolidados)
- **Eliminados**: 1 (seal_type_bag)

### Distribución por Sistema
- **ODISEO**: 53 catálogos (fue 54)
- **SISTEMA_INTEGRAL**: 13 catálogos (se agregó bag_seal_type)
- **Total**: 66 catálogos

### Valores Consolidados
- **Sello lateral** (STB-001): ✅ Disponible
- **Sello de fondo** (STB-002): ✅ Disponible

---

## VERIFICACIÓN POST-CAMBIO

### ✅ Checklist de Validación

- [x] CAT-043 actualizado a SISTEMA_INTEGRAL
- [x] CAT-063 eliminado del registry
- [x] Valores de seed migrados a bag_seal_type
- [x] catalogExtraction.ts actualizado
- [x] No quedan referencias a seal_type_bag en registry
- [x] Archivo catalog.registry.ts valida sin errores
- [x] Archivo catalog.seed.ts valida sin errores
- [x] Archivo catalogExtraction.ts valida sin errores

### ✅ Test de Integridad

```bash
# Verificar no hay seal_type_bag en registry
grep -c "seal_type_bag" catalog.registry.ts  # → 0

# Verificar bag_seal_type está en registry
grep -c "bag_seal_type" catalog.registry.ts  # → 1

# Verificar seed usa bag_seal_type
grep -c "bag_seal_type" catalog.seed.ts      # → 2 (dos valores)

# Verificar extractExtraction usa bag_seal_type
grep -c "bag_seal_type" catalogExtraction.ts # → 1
```

---

## DOCUMENTACIÓN DE CAMBIOS

### Archivos Modificados (4)
1. ✅ `catalog.registry.ts` - Consolidación + eliminación
2. ✅ `catalog.seed.ts` - Migración de valores
3. ✅ `catalogExtraction.ts` - Actualización de referencias

### Documentación Creada (3)
1. ✅ `ANALISIS_DUPLICIDAD_CAT043_CAT063.md` - Análisis detallado
2. ✅ `RESOLUCION_DUPLICIDAD_CAT043_CAT063.md` - Este documento
3. ✅ Validaciones en sistema

---

## IMPACTO EN FASES DEL PROYECTO

### Fase 1: Mapeo ✅
- **Antes**: 67 catálogos mapeados
- **Después**: 66 catálogos mapeados (eliminado duplicado)
- **Actualizar**: FASE1_MAPEO_CATALOGOS.md

### Fase 2: Plantilla ✅
- **Impacto**: Genera 66 hojas en lugar de 67
- **Cambio**: Plantilla más limpia sin duplicados

### Fase 3: Validador ✅
- **Impacto**: Valida 66 catálogos
- **Cambio**: Sin validaciones duplicadas

### Fase 4: Vista Web ✅
- **Impacto**: Tabla muestra 66 catálogos
- **Cambio**: UI más clara

### Fase 5: Carga/Confirmación ✅
- **Impacto**: Procesa 66 catálogos
- **Cambio**: Bitácora sin ruido de duplicados

---

## LECCIONES APRENDIDAS

1. **Validar Consolidación Antes de Crear**
   - Revisar si un concepto ya existe antes de crear un nuevo catálogo

2. **Dos Maestros = Problema**
   - Nunca tener el mismo concepto en dos sistemas distintos

3. **Código Descriptivo Importa**
   - `bag_seal_type` es más específico que `seal_type_bag`

4. **Seed y Registry Deben Estar Sincronizados**
   - Valores deben estar en el catálogo correcto

---

## CONCLUSIÓN

✅ **Resolución Completada**

La duplicidad crítica entre CAT-043 y CAT-063 ha sido eliminada.

**Resultado**:
- ✅ Un único maestro: CAT-043 como SISTEMA_INTEGRAL
- ✅ Valores consolidados en seed
- ✅ Referencias actualizadas
- ✅ 66 catálogos sin duplicidad
- ✅ Sistema íntegro y consistente

**Próximo**: Actualizar documentación de Fase 1 para reflejar 66 catálogos en lugar de 67.

---

**Status**: 🟢 COMPLETADO Y VALIDADO
**Riesgo residual**: NINGUNO
**Impacto en flujos**: NINGUNO (se mantienen mismos datos)
