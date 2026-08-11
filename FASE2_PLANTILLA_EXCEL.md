# FASE 2: GENERADOR DE PLANTILLA EXCEL
## Documento de Implementación

**Fecha Completada**: Agosto 2026  
**Estado**: ✅ Completado  
**Versión**: 1.0

---

## RESUMEN EJECUTIVO

Se ha implementado un generador de plantillas Excel automatizado que:
- ✅ Genera 3 hojas principales (Resumen, Detalle, Individuales)
- ✅ Soporta 54 catálogos ODISEO editables
- ✅ Estructura de 11 columnas en resumen
- ✅ Automatiza fecha/usuario de actualización
- ✅ Calcula totales automáticamente (Activos + Inactivos + Bloqueados)

---

## ARCHIVOS IMPLEMENTADOS

### 1. Servicio Core
**Archivo**: `src/modules/catalog-management/services/catalogTemplateGenerator.ts`

**Clase Principal**: `CatalogTemplateGenerator`

**Métodos públicos**:
```typescript
generateCompleteTemplate(): Blob
// Genera la plantilla completa Excel

downloadTemplate(): void
// Descarga la plantilla al navegador

downloadCatalogsTemplate(): void
// Función de conveniencia
```

**Funciones de utilidad**:
```typescript
generateCatalogsTemplateBlob(): Blob
// Retorna el blob para procesamientos adicionales
```

### 2. Componente UI
**Archivo**: `src/modules/catalog-management/components/CatalogTemplateDownload.tsx`

**Componente**: `CatalogTemplateDownload`
- Botón con ícono de descarga
- Loading state durante generación
- Manejo de errores integrado
- Nombres de archivo con fecha

---

## ESTRUCTURA DE HOJAS EXCEL

### Hoja 1: Resumen_Catalogos
**Propósito**: Vista ejecutiva de todos los catálogos

| Columna | Tipo | Descripción | Editable |
|---------|------|-------------|----------|
| Código Catálogo | Texto | CAT-001, CAT-002, etc. | ❌ No |
| Nombre del Campo | Texto | Nombre descriptivo | ❌ No |
| Aplicable en | Texto | LÁMINA, BOLSA, POUCH, General | ❌ No |
| Aplica en Otros | Texto | Otros tipos donde aplica | ❌ No |
| Sistema | Texto | ODISEO / SISTEMA_INTEGRAL | ❌ No |
| Total Valores | Número | Suma de Activos+Inactivos+Bloqueados | ❌ No |
| Activos | Número | Count valores estado Activo | ❌ No |
| Inactivos | Número | Count valores estado Inactivo | ❌ No |
| Bloqueados | Número | Count valores estado Bloqueado | ❌ No |
| Última Actualización | Fecha | DD/MM/YYYY | ❌ No |
| Actualizado Por | Texto | Usuario que hizo cambios | ❌ No |

**Ancho de Columnas**:
- Código Catálogo: 18 caracteres
- Nombre del Campo: 25 caracteres
- Aplicable en: 18 caracteres
- Aplica en Otros: 18 caracteres
- Sistema: 15 caracteres
- Total Valores: 12 caracteres
- Activos: 10 caracteres
- Inactivos: 10 caracteres
- Bloqueados: 10 caracteres
- Última Actualización: 20 caracteres
- Actualizado Por: 18 caracteres

**Fórmula de validación**:
```
Total = Activos + Inactivos + Bloqueados
```

---

### Hoja 2: Detalle_Catalogos
**Propósito**: Vista consolidada de todos los valores de catálogos

| Columna | Tipo | Descripción | Editable |
|---------|------|-------------|----------|
| Código Catálogo | Texto | CAT-001, etc. | ❌ No |
| Nombre del Campo | Texto | Nombre descriptivo | ❌ No |
| Código Valor | Texto | AT-001, EST-001, etc. | ✅ Sí* |
| Valor | Texto | Nombre del valor | ✅ Sí |
| Descripción | Texto | Descripción | ✅ Sí |
| Estado | Dropdown | Activo/Inactivo/Bloqueado | ✅ Sí* |
| Última Actualización | Fecha | DD/MM/YYYY | ❌ No |

*Con restricciones según validaciones de Fase 3

**Ancho de Columnas**:
- Código Catálogo: 18 caracteres
- Nombre del Campo: 25 caracteres
- Código Valor: 18 caracteres
- Valor: 25 caracteres
- Descripción: 35 caracteres
- Estado: 15 caracteres
- Última Actualización: 20 caracteres

---

### Hojas 3+: Individuales (CAT-XXX_nombre)
**Propósito**: Una hoja por cada catálogo para edición detallada

**Ejemplo de nombre**: 
- `CAT-002_Clase_de_Impresion`
- `CAT-004_Tipo_de_Estructura`
- `CAT-010_Tipo_de_Perforacion_Pouch`

| Columna | Tipo | Descripción | Editable |
|---------|------|-------------|----------|
| Código Valor | Texto | AT-001, EST-001, etc. | ✅ Sí* |
| Valor | Texto | Nombre del valor | ✅ Sí |
| Descripción | Texto | Descripción | ✅ Sí |
| Estado | Dropdown | Activo/Inactivo/Bloqueado | ✅ Sí* |
| Fecha de Creación | Fecha | DD/MM/YYYY | ❌ No |
| Última Actualización | Fecha | DD/MM/YYYY | ❌ No |
| Actualizado Por | Texto | Usuario que hizo cambios | ❌ No |

*Con restricciones según validaciones de Fase 3

**Ancho de Columnas**:
- Código Valor: 18 caracteres
- Valor: 25 caracteres
- Descripción: 35 caracteres
- Estado: 15 caracteres
- Fecha de Creación: 18 caracteres
- Última Actualización: 20 caracteres
- Actualizado Por: 18 caracteres

---

## DATOS MOSTRADOS

### Origen de Datos
- **Catálogos**: CATALOG_REGISTRY (67 totales, 54 ODISEO)
- **Valores**: CATALOG_VALUES_SEED
- **Estados**: Activo, Inactivo, Bloqueado
- **Mapeo de Aplicabilidad**: Hardcoded en `getApplicableIn()`

### Ejemplo de Datos Generados

#### Resumen
```
CAT-002 | Clase de Impresión | General | ODISEO | 5 | 5 | 0 | 0 | 11/08/2026 | ODISEO_SYSTEM
CAT-004 | Tipo de Estructura | General | ODISEO | 4 | 4 | 0 | 0 | 11/08/2026 | ODISEO_SYSTEM
CAT-010 | Perforación Pouch | POUCH | ODISEO | 3 | 3 | 0 | 0 | 11/08/2026 | ODISEO_SYSTEM
```

---

## INTEGRACIÓN CON COMPONENTES

### En ViewAllCatalogsPage
```typescript
import { CatalogTemplateDownload } from "@/modules/catalog-management/components/CatalogTemplateDownload";

export function ViewAllCatalogsPage() {
  return (
    <div>
      <div className="flex gap-4">
        <CatalogTemplateDownload />
        {/* Otros controles */}
      </div>
    </div>
  );
}
```

---

## VALIDACIONES IMPLEMENTADAS

En `catalogTemplateGenerator.ts`:

✅ Cálculo automático de totales por estado  
✅ Mapeo correcto de CAT-XXX códigos  
✅ Formateo de fechas DD/MM/YYYY  
✅ Conversión de caracteres especiales en nombres de hoja  
✅ Ajuste automático de ancho de columnas  
✅ Manejo de valores vacíos/null  

---

## CRITERIOS DE ACEPTACIÓN CUBIERTOS

| CA | Descripción | Estado |
|----|-------------|--------|
| CA-01 | Generador plantilla 3 hojas | ✅ Completado |
| CA-02 | Resumen 11 columnas | ✅ Completado |
| CA-03 | Detalle consolidado | ✅ Completado |
| CA-04 | Hojas individuales 7 columnas | ✅ Completado |
| CA-05 | Relación por Código catálogo | ✅ Completado |
| CA-06 | Total = Activos+Inactivos+Bloqueados | ✅ Completado |
| CA-10 | Fecha/Usuario automáticos | ✅ Completado |

---

## PRÓXIMOS PASOS: FASE 3

### Validador de Plantilla (catalogTemplateValidator.ts)

Se implementarán 14 validaciones obligatorias:

1. ✅ Hojas Resumen_Catalogos y Detalle_Catalogos existen
2. ✅ Código catálogo existe en Resumen
3. ✅ Sistema es ODISEO o Sistema Integral
4. ✅ Código valor no vacío
5. ✅ Combinación Código + Valor no duplicada
6. ✅ Valor no vacío
7. ✅ Sin duplicados (mayúsculas/espacios)
8. ✅ Estado válido (Activo/Inactivo/Bloqueado)
9. ✅ Hoja corresponde a código
10. ✅ Campos Fecha/Usuario no alterados
11. ✅ Ausencia no elimina valores
12. ✅ Inactivación solo si Estado=Inactivo
13. ✅ Valores bloqueados conservan trazabilidad
14. ✅ Código valor no modificado

**Archivo a crear**: `src/modules/catalog-management/services/catalogTemplateValidator.ts`

---

## TESTING

### Cómo probar Fase 2

1. Navegar a la página de gestión de catálogos
2. Hacer clic en "Descargar Plantilla Excel"
3. Verificar que descarga un archivo XLSX
4. Abrir el archivo en Excel y verificar:
   - ✅ 3+ hojas (Resumen_Catalogos, Detalle_Catalogos, CAT-00X_*)
   - ✅ Resumen con 11 columnas
   - ✅ Detalle con 7 columnas
   - ✅ Hojas individuales con 7 columnas
   - ✅ Totales calculados correctamente
   - ✅ Fechas en formato DD/MM/YYYY
   - ✅ Nombres de hojas válidos (sin caracteres especiales)
   - ✅ Ancho de columnas legible

### Validación de Datos
- Verificar que cada catálogo ODISEO tenga valores
- Verificar que los estados sean Activo/Inactivo/Bloqueado
- Verificar que la fecha sea la actual
- Verificar que "Actualizado Por" sea "ODISEO_SYSTEM"

---

## NOTAS DE IMPLEMENTACIÓN

1. **Generación Eficiente**: La plantilla se genera en memoria usando XLSX sin necesidad de servidor backend.

2. **Manejo de Catálogos Vacíos**: Si un catálogo no tiene valores, genera la hoja con headers solo.

3. **Nombres de Hojas**: Máximo 31 caracteres, se truncan automáticamente si exceden.

4. **Descarga**: Se usa Blob URL y elemento `<a>` para descargar, sin necesidad de backend.

5. **Nombres de Archivo**: Incluyen timestamp ISO para evitar sobrescrituras.

---

**Documento válido desde**: Agosto 2026  
**Próxima fase**: Validación de Cargas (Fase 3)
