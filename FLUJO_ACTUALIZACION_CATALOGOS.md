# Flujo de Actualización de Catálogos mediante Plantilla Excel

## 📊 Diagrama General del Flujo

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                     GESTIÓN DE CATÁLOGOS ODISEO                             │
└─────────────────────────────────────────────────────────────────────────────┘

1. DESCARGA PLANTILLA
   ├─ Usuario hace clic en "Descargar" > "Catálogos"
   ├─ O "Descargar Plantilla Excel" (próxima iteración)
   └─ Se genera Excel con:
      ├─ Hoja "Resumen_Catalogos" (66 catálogos)
      ├─ Hoja "Detalle_Catalogos" (todos los valores)
      └─ Hojas individuales por catálogo (CAT-001, CAT-002, etc.)

2. EDICIÓN EN EXCEL (LOCAL)
   ├─ Usuario modifica el archivo localmente
   ├─ Cambios permitidos:
   │  ├─ Cambiar estado: Activo ↔ Inactivo ↔ Bloqueado
   │  ├─ Modificar descripción de valor
   │  └─ Agregar nuevos valores (solo ODISEO)
   └─ Cambios NO permitidos:
      ├─ Cambiar código de catálogo
      ├─ Modificar código de valor
      └─ Cambiar valores de Sistema Integral (lectura)

3. CARGA DE ARCHIVO
   ├─ Usuario hace clic en "Cargar Plantilla"
   ├─ Modal se abre en pestaña "Cargar Plantilla"
   ├─ Usuario selecciona archivo Excel
   └─ Sistema inicia validación

4. VALIDACIÓN (14 puntos de validación)
   ├─ V1: Hojas Resumen_Catalogos y Detalle_Catalogos existen
   ├─ V2: Código catálogo existe (formato CAT-XXX)
   ├─ V3: Sistema válido (ODISEO o SISTEMA_INTEGRAL)
   ├─ V4-V6: Códigos y valores no vacíos
   ├─ V7: Sin duplicados normalizados
   ├─ V8: Estados válidos (Activo, Inactivo, Bloqueado)
   ├─ V9: Hojas individuales corresponden a códigos
   ├─ V10-V11: Metadata (fechas, usuario) presentes
   ├─ V12-V14: Cambios de estado válidos
   └─ Resultado:
      ├─ ✓ VÁLIDO → Continúa a PREVIEW
      └─ ✗ INVÁLIDO → Muestra errores (bloqueantes en rojo)
                       + Warnings (informativos en amarillo)

5. PREVIEW DE CAMBIOS
   ├─ Usuario ve resumen de cambios:
   │  ├─ Nuevos registros (cantidad)
   │  ├─ Registros modificados (cantidad)
   │  ├─ Registros inactivados (cantidad)
   │  └─ Registros bloqueados (cantidad)
   ├─ Grid 2x2 con números en cada celda
   └─ Usuario decide:
      ├─ "Confirmar" → Continúa a REVIEW
      └─ "Cancelar" → Vuelve a inicio

6. REVIEW & RAZÓN
   ├─ Paso 1: Revisar cambios
   │  ├─ Vuelve a mostrar el preview 2x2
   │  └─ Usuario confirma haciendo clic en "Siguiente"
   │
   ├─ Paso 2: Ingresar razón (opcional)
   │  ├─ Campo de texto: "¿Por qué se hacen estos cambios?"
   │  ├─ Ejemplo: "Actualización de valores según nuevo proceso"
   │  └─ Usuario confirma haciendo clic en "Confirmar cambios"
   │
   └─ Paso 3: Procesamiento
      ├─ Spinner de carga
      └─ Sistema aplica cambios

7. APLICACIÓN DE CAMBIOS
   ├─ Sistema guarda en localStorage:
   │  ├─ Nuevo snapshot de valores de catálogos
   │  ├─ Registro de cambios (change log)
   │  └─ Metadata (timestamp, usuario, razón)
   │
   ├─ Actualiza catalog.seed.ts en memory (simulado)
   │
   └─ Genera trazabilidad:
      ├─ Timestamp exacto
      ├─ Usuario que hizo cambios
      ├─ Razón de cambios
      ├─ Detalles de cada cambio
      └─ Auditoría completa

8. RESULTADO FINAL
   ├─ ✓ ÉXITO:
   │  ├─ Modal muestra "✓ Cambios Aplicados"
   │  ├─ Resumen: "X cambios registrados"
   │  ├─ Detalles:
   │  │  ├─ Y nuevos registros
   │  │  ├─ Z modificados
   │  │  ├─ W inactivados
   │  │  └─ V bloqueados
   │  ├─ Botón "Cerrar"
   │  └─ Tabla de CatalogsViewPage se actualiza automáticamente
   │
   └─ ✗ ERROR:
      ├─ Modal muestra "✗ Error"
      ├─ Descripción del error
      └─ Botón "Volver a intentar"
```

---

## 📋 Validaciones Detalladas

### Validación 1: Estructura de Hojas
- **Requerido**: Hojas "Resumen_Catalogos" y "Detalle_Catalogos"
- **Error**: Si falta alguna hoja → BLOQUEA carga
- **Solución**: Usar plantilla oficial descargada del sistema

### Validación 2-3: Código y Sistema
- **Requerido**: Formato CAT-XXX (000-066)
- **Válido Sistema**: "ODISEO" o "SISTEMA_INTEGRAL"
- **Error**: Formato inválido → BLOQUEA
- **Nota**: No se pueden crear nuevos catálogos, solo modificar existentes

### Validación 4-8: Datos de Valores
- **Requerido**: Código valor, Valor, Estado (no vacíos)
- **Válido Estado**: "Activo", "Inactivo", "Bloqueado"
- **Sin duplicados**: Combinación Código+Valor única
- **Warning**: Duplicados potenciales (mayúsculas/espacios)

### Validación 9: Hojas Individuales
- **Requerido**: Hojas individuales (CAT-001, CAT-002, etc.)
- **Estructura**: Debe coincidir con la definición de catálogo
- **Columnas**: Código Valor, Valor, Descripción, Estado, Fechas, Usuario

### Validación 10-14: Metadata y Estados
- **Requerido**: Fechas y usuario de actualización presentes
- **Restricción**: Valores bloqueados NO pueden cambiar de estado
- **Restricción**: Código de valor NO puede ser modificado
- **Inactivación**: Solo si está justificada

---

## 🔄 Tipos de Cambios Detectados

### 1. **NUEVO**
```
Condición: Código valor NO existe en catalog.seed.ts
Acción: Agregar nuevo valor al catálogo
Restricción: Solo para catálogos ODISEO
```

### 2. **MODIFICADO**
```
Condición: Código existe + Descripción cambió
Acción: Actualizar descripción del valor
Restricción: Solo para catálogos ODISEO
```

### 3. **INACTIVADO**
```
Condición: Código existe + Estado: Activo → Inactivo
Acción: Marcar como inactivo (conservar dato)
Restricción: Registrable en auditoría
```

### 4. **BLOQUEADO**
```
Condición: Código existe + Estado: Activo/Inactivo → Bloqueado
Acción: Bloquear valor (no se puede reactivar)
Restricción: Requiere razón de bloqueo
```

---

## 💾 Estructura de Archivo Excel Esperado

### Hoja "Resumen_Catalogos"
```
Código Catálogo | Nombre del Campo | Aplicable en | Aplica en Otros | Sistema | Total Valores | Activos | Inactivos | Bloqueados | Última Actualización | Actualizado Por
CAT-001         | Wrapping Type   | General      |                 | ODISEO  | 3             | 3       | 0         | 0          | 11/08/2026 10:30 AM | ODISEO_SYSTEM
CAT-002         | Formato Lámina  | LÁMINA       |                 | ODISEO  | 5             | 5       | 0         | 0          | 11/08/2026 10:30 AM | ODISEO_SYSTEM
...
```

### Hoja "Detalle_Catalogos"
```
Código Catálogo | Nombre del Campo | Código Valor | Valor | Descripción | Estado | Última Actualización
CAT-001         | Wrapping Type   | ENV-001      | POUCH | Pouch bag   | Activo | 11/08/2026 10:30 AM
CAT-001         | Wrapping Type   | ENV-002      | BOLSA | Bag         | Activo | 11/08/2026 10:30 AM
CAT-002         | Formato Lámina  | FMT-001      | A4    | Formato A4  | Activo | 11/08/2026 10:30 AM
...
```

### Hojas Individuales (CAT-001, CAT-002, etc.)
```
Código Valor | Valor | Descripción | Estado | Fecha de Creación | Última Actualización | Actualizado Por
ENV-001      | POUCH | Pouch bag   | Activo | 01/01/2024       | 11/08/2026 10:30 AM | ODISEO_SYSTEM
ENV-002      | BOLSA | Bag         | Activo | 01/01/2024       | 11/08/2026 10:30 AM | ODISEO_SYSTEM
...
```

---

## 🔐 Restricciones por Sistema

### Catálogos ODISEO (53)
✅ **Permitido**:
- Crear nuevos valores
- Modificar descripción de valores
- Cambiar estado (Activo ↔ Inactivo ↔ Bloqueado)
- Agregar/actualizar metadata

❌ **No permitido**:
- Eliminar catálogo
- Cambiar tipo de restricción

### Catálogos Sistema Integral (13)
✅ **Permitido**:
- Ver valores
- Descargar información

❌ **No permitido**:
- Crear/modificar/eliminar valores
- Cambiar estado
- Archivo Excel será de solo lectura

---

## 📊 Almacenamiento de Cambios

### LocalStorage Keys
```javascript
// Registro de uploads
"catalog_uploads" → Array de {
  id: "catalog_upload_TIMESTAMP",
  timestamp: "2026-08-11T10:30:00Z",
  confirmation: UploadConfirmationData,
  status: "confirmed",
  appliedAt: "2026-08-11T10:30:05Z"
}

// Log de cambios
"catalog_change_logs" → Array de {
  timestamp: "2026-08-11T10:30:00Z",
  user: "ODISEO_SYSTEM",
  totalChanges: 15,
  newRecords: 3,
  modifiedRecords: 8,
  inactivatedRecords: 4,
  blockedRecords: 0,
  reason: "Actualización de valores según nuevo proceso",
  status: "success"
}

// Values actualizados (simulado en memory)
"catalog_values" → Snapshot completo de CATALOG_VALUES_SEED actualizado
```

---

## 🎯 Casos de Uso Comunes

### Caso 1: Agregar nuevo valor a catálogo
```
1. Descargar plantilla
2. En hoja CAT-001, agregar fila con:
   - Código Valor: ENV-004
   - Valor: NUEVA ENVOLTURA
   - Descripción: Nueva envoltura para pruebas
   - Estado: Activo
3. Cargar archivo
4. Validar (debe pasar)
5. Revisar (mostrará 1 nuevo registro)
6. Ingresar razón: "Agregar nueva envoltura"
7. Confirmar
8. ✓ Aplicado - Nuevo valor disponible en sistema
```

### Caso 2: Inactivar valor existente
```
1. Descargar plantilla
2. En hoja CAT-002, cambiar Estado de Activo → Inactivo
3. Cargar archivo
4. Validar (debe pasar)
5. Revisar (mostrará 1 inactivado)
6. Ingresar razón: "Valor descontinuado"
7. Confirmar
8. ✓ Aplicado - Valor inactivado (no disponible en UI)
```

### Caso 3: Error - Cambiar código de valor
```
1. Descargar plantilla
2. En hoja CAT-001, cambiar Código Valor: ENV-001 → ENV-999
3. Cargar archivo
4. ✗ VALIDACIÓN FALLA
   - Error V14: "Código de valor no puede ser modificado: ENV-001 → ENV-999"
5. Volver a descargar, hacer cambios correctos
```

---

## 📈 Fase Siguiente: Integración Backend

Cuando se implemente backend:

```
LocalStorage (actual) → Backend API
┌─────────────────┐     ┌──────────────────┐
│ catalog_uploads │────→│ POST /api/       │
│ catalog_logs    │     │ catalogs/import  │
│ catalog_values  │────→│ PUT /api/        │
│                 │     │ catalogs/values  │
└─────────────────┘     └──────────────────┘
                               ↓
                        [Base de datos]
                        ↓
                        Auditoria
                        Versioning
                        Replicación
```

**Cambios mínimos necesarios**:
- Reemplazar `confirmUpload()` para hacer POST al backend
- Agregar manejo de errores de API
- Implementar reintentos
- Agregar progreso de carga
