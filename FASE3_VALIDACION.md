# FASE 3: VALIDACIÓN DE PLANTILLAS
## Documento de Implementación

**Fecha Completada**: Agosto 2026  
**Estado**: ✅ Completado  
**Versión**: 1.0

---

## RESUMEN EJECUTIVO

Se ha implementado un validador completo de plantillas que:
- ✅ Ejecuta 14 validaciones obligatorias
- ✅ Diferencia entre errores (bloquean) y advertencias (informan)
- ✅ Genera preview de cambios (Nuevos/Modificados/Inactivados/Bloqueados)
- ✅ Interfaz de usuario completa con feedback detallado
- ✅ Validación de integridad de datos y consistencia

---

## ARCHIVOS IMPLEMENTADOS

### 1. Servicio de Validación
**Archivo**: `src/modules/catalog-management/services/catalogTemplateValidator.ts`

**Clase Principal**: `CatalogTemplateValidator`

**Métodos públicos**:
```typescript
validateTemplate(file: File): Promise<ValidationResult>
// Valida un archivo XLSX subido
```

**Función de utilidad**:
```typescript
validateCatalogTemplate(file: File): Promise<ValidationResult>
// Wrapper de conveniencia
```

### 2. Componente de Upload
**Archivo**: `src/modules/catalog-management/components/CatalogUploadValidator.tsx`

**Componente**: `CatalogUploadValidator`
- Selector de archivo XLSX
- Botón de validación
- Mostrado detallado de errores/advertencias
- Preview de cambios
- Botones de confirmación/cancelación

---

## LAS 14 VALIDACIONES OBLIGATORIAS

### Validación 1: Estructura de Hojas
**Código**: `MISSING_SUMMARY_SHEET`, `MISSING_DETAIL_SHEET`  
**Tipo**: ERROR  
**Descripción**: Verifica que existan las hojas 'Resumen_Catalogos' y 'Detalle_Catalogos'  
**Bloquea carga**: SÍ  

```typescript
if (!sheetNames.includes("Resumen_Catalogos")) {
  // ERROR
}
```

---

### Validación 2: Código de Catálogo Existe
**Código**: `MISSING_CATALOG_CODE`  
**Tipo**: ERROR  
**Descripción**: Cada fila del Resumen debe tener un código catálogo  
**Bloquea carga**: SÍ  

```typescript
const codCatalogo = row["Código Catálogo"];
if (!codCatalogo) {
  // ERROR
}
```

---

### Validación 3: Formato de Código Válido
**Código**: `INVALID_CATALOG_CODE_FORMAT`  
**Tipo**: ERROR  
**Descripción**: Código debe cumplir patrón CAT-XXX (ej: CAT-001)  
**Bloquea carga**: SÍ  

```typescript
if (!/^CAT-\d{3}$/.test(codCatalogo)) {
  // ERROR: formato inválido
}
```

---

### Validación 4: Sistema Válido
**Código**: `INVALID_SYSTEM`  
**Tipo**: ERROR  
**Descripción**: Sistema debe ser 'ODISEO' o 'SISTEMA_INTEGRAL'  
**Bloquea carga**: SÍ  

```typescript
if (!["ODISEO", "SISTEMA_INTEGRAL"].includes(sistema)) {
  // ERROR
}
```

---

### Validación 5: Código de Valor No Vacío
**Código**: `MISSING_VALUE_CODE`  
**Tipo**: ERROR  
**Descripción**: Cada valor debe tener un código (ej: AT-001)  
**Bloquea carga**: SÍ  

```typescript
const codigoValor = row["Código Valor"];
if (!codigoValor) {
  // ERROR
}
```

---

### Validación 6: Valor No Vacío
**Código**: `MISSING_VALUE`  
**Tipo**: ERROR  
**Descripción**: Campo 'Valor' no puede estar vacío  
**Bloquea carga**: SÍ  

```typescript
const valor = row["Valor"];
if (!valor) {
  // ERROR
}
```

---

### Validación 7: Sin Duplicados (Código + Valor)
**Código**: `DUPLICATE_VALUE_COMBINATION`  
**Tipo**: ERROR  
**Descripción**: La combinación Código Valor + Valor no puede duplicarse  
**Bloquea carga**: SÍ  

```typescript
const combination = `${codigoValor}||${valor}`;
if (seenValueCombinations.has(combination)) {
  // ERROR: duplicado
}
```

---

### Validación 8: Sin Duplicados (Mayúsculas/Espacios)
**Código**: `POTENTIAL_DUPLICATE`  
**Tipo**: ADVERTENCIA  
**Descripción**: Advierte sobre valores que son iguales normalizando mayúsculas/espacios  
**Bloquea carga**: NO  

```typescript
const normalized = valor.trim().toUpperCase();
// Comparar contra otros valores normalizados
```

---

### Validación 9: Estado Válido
**Código**: `INVALID_STATE`  
**Tipo**: ERROR  
**Descripción**: Estado debe ser 'Activo', 'Inactivo' o 'Bloqueado'  
**Bloquea carga**: SÍ  

```typescript
if (!["Activo", "Inactivo", "Bloqueado"].includes(estado)) {
  // ERROR
}
```

---

### Validación 10: Hoja Corresponde a Código
**Código**: `INVALID_SHEET_STRUCTURE`  
**Tipo**: ERROR  
**Descripción**: Cada hoja individual (CAT-XXX_*) debe tener estructura correcta  
**Bloquea carga**: SÍ  

```typescript
const expectedColumns = [
  "Código Valor", "Valor", "Descripción", 
  "Estado", "Fecha de Creación", "Última Actualización", 
  "Actualizado Por"
];
```

---

### Validación 11: Metadatos No Alterados
**Código**: `MISSING_UPDATE_DATE`, `MISSING_UPDATE_USER`  
**Tipo**: ADVERTENCIA  
**Descripción**: Advierte si faltan campos de fecha/usuario de actualización  
**Bloquea carga**: NO  

```typescript
if (!lastUpdate || !updatedBy) {
  // ADVERTENCIA
}
```

---

### Validación 12: Cambio de Estado Valid o
**Código**: `BLOCKED_VALUE_CHANGED`  
**Tipo**: ERROR  
**Descripción**: Valores bloqueados no pueden cambiar de estado  
**Bloquea carga**: SÍ  

```typescript
if (originalValue.status === "Bloqueado" && 
    nuevoEstado !== "Bloqueado") {
  // ERROR: no puede cambiar bloqueado
}
```

---

### Validación 13: Conservar Trazabilidad
**Código**: (automático)  
**Tipo**: INFORMACIÓN  
**Descripción**: Se registran cambios de inactivación con trazabilidad  
**Bloquea carga**: NO  

Generado en el preview:
```
inactivatedRecords: count de cambios a estado "Inactivo"
blockedRecords: count de valores con estado "Bloqueado"
```

---

### Validación 14: Código Valor No Modificado
**Código**: `VALUE_CODE_MODIFIED`  
**Tipo**: ERROR  
**Descripción**: El código de un valor existente no puede ser modificado  
**Bloquea carga**: SÍ  

```typescript
if (originalValue.item !== codigoValor) {
  // ERROR: código modificado
}
```

---

## TIPOS DE RESULTADOS

### ValidationResult
```typescript
interface ValidationResult {
  isValid: boolean;  // true si no hay errores
  errors: ValidationError[];  // Bloquean la carga
  warnings: ValidationError[];  // Informativas
  preview?: {
    newRecords: number;  // Valores completamente nuevos
    modifiedRecords: number;  // Cambios de valores
    inactivatedRecords: number;  // Cambios a Inactivo
    blockedRecords: number;  // Valores Bloqueados
  };
}
```

### ValidationError
```typescript
interface ValidationError {
  type: "error" | "warning";
  code: string;  // Código único de validación
  message: string;  // Mensaje legible
  sheet?: string;  // Hoja donde ocurrió
  row?: number;  // Fila donde ocurrió
  value?: unknown;  // Valor problemático
}
```

---

## FLUJO DE VALIDACIÓN

```
1. Usuario selecciona archivo XLSX
   ↓
2. Click en "Validar Plantilla"
   ↓
3. Leer archivo con XLSX.read()
   ↓
4. Ejecutar 14 validaciones en orden:
   - Estructura de hojas
   - Validación de Resumen
   - Validación de Detalle
   - Validación de hojas individuales
   - Validación de consistencia
   - Validación de cambios de estado
   - Validación de metadatos
   ↓
5. Si isValid=true:
   - Generar preview
   - Mostrar cambios por tipo
   - Habilitar botón "Confirmar Cambios"
   ↓
6. Si hay errores:
   - Mostrar lista detallada de errores
   - Deshabilitar confirmación
   - Permitir seleccionar otro archivo
```

---

## INTERFAZ DE USUARIO

### Componente: CatalogUploadValidator

**Secciones**:

1. **Área de Carga**
   - Ícono de Upload
   - Instrucciones
   - Botón "Seleccionar Archivo"
   - Muestra archivo seleccionado con tamaño

2. **Botón de Validación**
   - Deshabilitado hasta seleccionar archivo
   - Muestra spinner durante validación
   - Se activa después de seleccionar archivo

3. **Resumen de Resultados**
   - Header con estado (✓ válido / ✗ inválido)
   - Contador de errores/advertencias

4. **Lista de Errores**
   - Cada error con código y mensaje
   - Información de hoja y fila
   - Máximo 60 items visible (scroll)

5. **Lista de Advertencias**
   - Similar a errores pero estilo amarillo
   - Máximo 40 items visible

6. **Preview de Cambios**
   - Grid 2x2 con 4 métricas:
     * Nuevos Registros (azul)
     * Modificados (púrpura)
     * Inactivados (naranja)
     * Bloqueados (rojo)

7. **Botones de Acción** (solo si válido)
   - "Confirmar Cambios" (verde)
   - "Cancelar" (gris)

---

## CÓDIGOS DE VALIDACIÓN

| Código | Tipo | Severidad |
|--------|------|-----------|
| MISSING_SUMMARY_SHEET | Error | CRÍTICA |
| MISSING_DETAIL_SHEET | Error | CRÍTICA |
| MISSING_CATALOG_CODE | Error | ALTA |
| INVALID_CATALOG_CODE_FORMAT | Error | ALTA |
| INVALID_SYSTEM | Error | ALTA |
| MISSING_VALUE_CODE | Error | ALTA |
| MISSING_VALUE | Error | ALTA |
| DUPLICATE_VALUE_COMBINATION | Error | MEDIA |
| POTENTIAL_DUPLICATE | Advertencia | MEDIA |
| INVALID_STATE | Error | MEDIA |
| INVALID_SHEET_STRUCTURE | Error | MEDIA |
| MISSING_UPDATE_DATE | Advertencia | BAJA |
| MISSING_UPDATE_USER | Advertencia | BAJA |
| BLOCKED_VALUE_CHANGED | Error | MEDIA |
| VALUE_CODE_MODIFIED | Error | MEDIA |
| CATALOG_WITHOUT_VALUES | Advertencia | BAJA |
| FILE_READ_ERROR | Error | CRÍTICA |
| VALIDATION_ERROR | Error | CRÍTICA |

---

## INTEGRACIÓN CON COMPONENTES

### En ViewAllCatalogsPage
```typescript
import { CatalogUploadValidator } from "@/modules/catalog-management/components/CatalogUploadValidator";

export function ViewAllCatalogsPage() {
  return (
    <div className="space-y-8">
      <section>
        <h2>Descargar Plantilla</h2>
        <CatalogTemplateDownload />
      </section>

      <section>
        <h2>Cargar y Validar</h2>
        <CatalogUploadValidator />
      </section>
    </div>
  );
}
```

---

## MANEJO DE ERRORES

### Errores Capturados
- ✅ Archivo no puede leerse
- ✅ Formato incorrecto (no XLSX)
- ✅ Estructura incorrecta de datos
- ✅ Valores duplicados
- ✅ Estados inválidos
- ✅ Datos inconsistentes

### Recovery
1. El usuario puede reintent ar con otro archivo
2. Puede cancelar la carga
3. Sistema no modifica datos hasta confirmación

---

## PRÓXIMOS PASOS: FASE 4

### Vista Web de Consulta (viewAllCatalogsPage.tsx)

Ahora que tenemos:
- ✅ Plantilla generadora (Fase 2)
- ✅ Validador (Fase 3)

Implementaremos:
- [ ] Página principal con tabla de catálogos
- [ ] Buscador por nombre/código
- [ ] Filtro por Sistema (ODISEO/SI)
- [ ] Panel de detalle (modal/drawer)
- [ ] Tabla de valores con paginación
- [ ] Indicadores visuales de estado

---

## CRITERIOS DE ACEPTACIÓN CUBIERTOS

| CA | Descripción | Estado |
|----|-------------|--------|
| CA-11 | Validaciones 14 puntos | ✅ Completado |

---

## TESTING

### Casos de Prueba

1. **Archivo Válido**
   - Descargar plantilla oficial
   - Sin modificaciones
   - Validar: debe pasar

2. **Archivo con Errores**
   - Borrar columna requerida
   - Cambiar código catálogo
   - Cambiar estado a inválido
   - Validar: debe fallar con errores específicos

3. **Archivo con Advertencias**
   - Valores con espacios extras
   - Mayúsculas inconsistentes
   - Validar: debe pasar pero mostrar advertencias

4. **Preview Correcto**
   - Agregar nuevo valor
   - Cambiar estado a Inactivo
   - Validar: preview debe mostrar correctamente

---

**Documento válido desde**: Agosto 2026  
**Próxima fase**: Vista Web de Consulta (Fase 4)
