# Pruebas Manuales - Gestión de Catálogos y Restricciones

## Resumen de cambios

- **Layout**: Refactorizado a 2 columnas (66% flujo | 34% bitácora)
- **Flujo guiado**: 4 pasos numerados (Tipo, Configuración, Plantilla, Resultado)
- **Componentes nuevos**: WorkflowStep, ManagementTypeCards, RecentChangeLogPanel, HistoryModal
- **Bitácora de restricciones**: Ahora se actualiza correctamente (antes se registraba en la bitácora de catálogos)
- **Confirmación única**: El pie fijo contiene el único botón "Confirmar actualización"

---

## Criterios de Aceptación a Validar

### CA-01: Flujo guiado en 4 pasos
**Pasos esperados:**
1. Tipo de información (Catálogo vs Restricción)
2. Configurar actualización (Fuente/tipo y elemento)
3. Plantilla y validación
4. Resultado de la validación

**Validación:**
- [ ] Los 4 pasos se muestran numerados con icono de número en círculo azul
- [ ] Paso 1 muestra 2 tarjetas seleccionables (Catálogo | Restricción)
- [ ] Paso 2 aparece después de seleccionar tipo
- [ ] Paso 3 aparece solo cuando elemento está seleccionado
- [ ] Paso 4 aparece solo después de validar plantilla

---

### CA-02: Selección correcta sin ver campos irrelevantes
**Controles globales (parte superior):**
- [ ] Se muestran las pestañas "ODISEO" y "Sistema Integral" (siempre visible)
- [ ] Las pestañas están en una tarjeta con etiqueta "Origen de datos"

**Caso Catálogo (Paso 1 seleccionado):**
- [ ] Se muestra selector de catálogo en Paso 2
- [ ] No se muestran controles de restricción (Dimensión/Validación)

**Caso Restricción (Paso 1 seleccionado):**
- [ ] Se muestran tabs de restricción: "Dimensión" y "Validación" en Paso 2
- [ ] Se muestra selector de restricción
- [ ] No se muestran controles de catálogo

**Validación:**
- [ ] Cambiar de Catálogo a Restricción limpia el estado anterior
- [ ] Cambiar de Restricción a Catálogo limpia el estado anterior
- [ ] Cambiar de fuente (ODISEO ↔ Sistema Integral) afecta a ambos tipos

---

### CA-03: Restricción con subtipos
**Validación:**
- [ ] Al seleccionar "Restricción", aparece selector de tipo dentro de Paso 2
- [ ] Opciones: "Dimensiones" y "Validaciones"
- [ ] Es posible cambiar entre subtipos sin perder el flujo

---

### CA-04: Plantilla - descarga, carga, validación, estados claros
**Validación:**
- [ ] Botón "Descargar plantilla" descarga un archivo Excel/CSV
- [ ] Puede cargarse un archivo mediante "Seleccionar archivo"
- [ ] Se muestra nombre del archivo cargado
- [ ] Validación muestra estado: Validando... → Válido / Con observaciones
- [ ] Paso 3 es reemplazable sin afectar pasos anteriores
- [ ] Campo "Motivo" aparece con contador 0/500
- [ ] Campo "Motivo" es obligatorio (validación muestra error si está vacío)

---

### CA-05: Error crítico bloquea confirmación
**Validación:**
- [ ] Si plantilla tiene registros inválidos, aparece alerta roja en Paso 4
- [ ] Mensaje: "La plantilla contiene errores. Corrige todos los registros..."
- [ ] Botón "Confirmar actualización" está deshabilitado
- [ ] No es posible aplicar el lote con errores

---

### CA-06: Un único botón "Confirmar" en pie fijo
**Validación:**
- [ ] Pie fijo en la parte inferior siempre visible
- [ ] Contiene solo: "Cancelar" y "Confirmar actualización"
- [ ] No hay botones de confirmar dentro de tarjetas de plantilla
- [ ] Botón "Confirmar" está deshabilitado hasta que:
  - Elemento seleccionado ✓
  - Archivo cargado ✓
  - Motivo válido (1-500 caracteres) ✓
  - Plantilla validada ✓
  - No hay errores críticos ✓
  - Hay cambios aplicables ✓

---

### CA-07: Modal de confirmación con detalles
**Validación:**
- [ ] Modal muestra título "Confirmar actualización"
- [ ] Muestra tipo (Catálogo / Restricción)
- [ ] Muestra elemento seleccionado
- [ ] Muestra motivo de la actualización
- [ ] Muestra resumen:
  - Nuevos: N (verde)
  - Modificados: N (azul)
  - Inactivados: N (gris)
  - Bloqueados: N (rojo)
- [ ] Mensaje: "Los cambios se aplicarán una sola vez y quedarán registrados en la bitácora."
- [ ] Botones: Cancelar y Confirmar
- [ ] Botón Confirmar muestra "Procesando..." durante operación

---

### CA-08: Bitácora reciente unificada
**Validación:**
- [ ] Panel derecho (sticky) muestral bitácora reciente (máx 5)
- [ ] Al seleccionar "Catálogo", muestra solo cambios de catálogos
- [ ] Al seleccionar "Restricción", muestra solo cambios de restricciones
- [ ] Cada entrada muestra:
  - Nombre del elemento/restricción
  - Acción (Actualizado/Creado/Eliminado)
  - Fecha y hora
  - Usuario
  - Resultado (Éxito/Error con color)
  - Motivo (si existe)
- [ ] Si hay >5 registros, aparece botón "Ver historial completo →"
- [ ] Si no hay registros, muestra "Aún no hay actualizaciones registradas."

---

### CA-09: Bitácora de restricciones se actualiza correctamente
**Validación:**
- [ ] Confirmar actualización de CATÁLOGO:
  - Aparece en bitácora de Catálogos
  - NO aparece en bitácora de Restricciones
- [ ] Confirmar actualización de RESTRICCIÓN (Dimensión):
  - Aparece en bitácora de Restricciones
  - Tipo: "Dimensión"
  - NO aparece en bitácora de Catálogos
- [ ] Confirmar actualización de RESTRICCIÓN (Validación):
  - Aparece en bitácora de Restricciones
  - Tipo: "Validación"
  - Motivo se registra correctamente

---

### CA-10: Responsividad móvil/tablet/escritorio
**Validación:**
- [ ] En escritorio (>1024px): 2 columnas (66%/34%)
- [ ] En tablet (<1024px): flujo se expande, bitácora abajo
- [ ] En móvil (<640px): flujo full width, bitácora debajo
- [ ] Pie fijo no se superpone con contenido
- [ ] Todos los campos son accesibles y legibles

---

## Escenarios de Prueba Detallados

### Escenario 1: Actualización válida de CATÁLOGO
1. Ingresar a "Gestión de Catálogos y Restricciones"
2. **Paso 1**: Seleccionar tarjeta "Catálogo"
3. **Paso 2**:
   - Seleccionar fuente "ODISEO" (debe estar activa por defecto)
   - Seleccionar un catálogo (ej: "Clase de Impresión")
   - Verificar que aparece "Elemento seleccionado: Clase de Impresión"
4. **Paso 3**:
   - Descargar plantilla
   - Cargar un archivo Excel válido con cambios (ej: agregar una nueva clase)
   - Ingreso motivo: "Agregar nueva clase de impresión estándar"
   - Hacer clic en "Validar plantilla"
5. **Paso 4**:
   - Esperar validación
   - Verificar que aparece ValidationSummaryCard con conteo de cambios
   - Verificar que aparece etiqueta verde "✓ Plantilla validada"
6. **Pie fijo**:
   - Botón "Confirmar actualización" debe estar habilitado
   - Hacer clic
7. **Modal de confirmación**:
   - Verificar tipo: "Catálogo"
   - Verificar elemento: "Clase de Impresión"
   - Verificar motivo
   - Hacer clic en "Confirmar"
8. **Resultado esperado**:
   - Mensaje de éxito
   - Redirige a /catalogs
   - Entrada en bitácora de Catálogos (NO en restricciones)
   - Bitácora muestra: Clase de Impresión | Actualización por plantilla | Éxito | Fecha/hora/usuario

---

### Escenario 2: Plantilla con error que bloquea el lote
1. Seguir pasos 1-3 del Escenario 1
2. **Paso 4 - Validación con error**:
   - Archivo contiene registro con formato inválido
   - ValidationSummary muestra criticalErrors > 0
   - Aparece alerta roja: "La plantilla contiene errores..."
3. **Pie fijo**:
   - Botón "Confirmar actualización" debe estar DESHABILITADO
   - Mensaje de validación explica por qué
4. **Esperado**: No es posible confirmar con errores

---

### Escenario 3: Actualización válida de RESTRICCIÓN - Dimensiones
1. **Paso 1**: Seleccionar tarjeta "Restricción"
2. **Paso 2**:
   - NO se muestran pestañas ODISEO/Sistema Integral
   - Aparecen tabs: "Dimensión" y "Validación"
   - Pestaña "Dimensión" está activa
   - Seleccionar una restricción (ej: "Alto máximo")
3. **Paso 3**:
   - Descargar plantilla de restricciones de dimensión
   - Cargar archivo actualizado
   - Motivo: "Actualizar límites de altura para nuevo empaque"
   - Validar
4. **Paso 4**:
   - Revisar cambios
   - Confirmar
5. **Modal**:
   - Tipo: Restricción
   - Elemento: Alto máximo
   - Motivo visible
6. **Resultado**:
   - Entrada en bitácora de RESTRICCIONES (NO catálogos)
   - restrictionType: "dimension"
   - restrictionName: "Alto máximo"
   - reason: "Actualizar límites..."

---

### Escenario 4: Actualización válida de RESTRICCIÓN - Validaciones
1. Repetir Escenario 3, pero seleccionar pestaña "Validación"
2. Resultado esperado:
   - Entrada en bitácora de RESTRICCIONES
   - restrictionType: "validation"
   - Resto idéntico al Escenario 3

---

### Escenario 5: Cancelación sin aplicar
1. Avanzar hasta Paso 4 (plantilla validada)
2. **Pie fijo**: Hacer clic en "Cancelar"
3. **Resultado esperado**:
   - Formulario se resetea completamente
   - managementType vuelve a "catalog"
   - Elementos seleccionados limpios
   - Archivos descargados
   - NO aparece entrada en bitácora

---

### Escenario 6: Cambio de fuente (ODISEO ↔ Sistema Integral)
1. **Paso 1**: Seleccionar "Catálogo"
2. **Paso 2**:
   - Seleccionar fuente "ODISEO"
   - Seleccionar un catálogo
   - Cambiar a fuente "Sistema Integral"
3. **Resultado esperado**:
   - Catálogos disponibles cambian
   - Si catálogo seleccionado no existe en Sistema Integral, se limpia la selección
   - Validación y plantilla se resetean

---

### Escenario 7: Historial completo
1. Después de múltiples actualizaciones exitosas
2. **Panel de bitácora**:
   - Si hay >5 registros, aparece "Ver historial completo →"
3. Hacer clic
4. **Modal de historial**:
   - Muestra TODOS los registros (no solo 5)
   - Cada uno con detalles completos
   - Puede cerrarse con botón "Cerrar"

---

## Notas Técnicas

### Variables clave a monitorear en console/DevTools
```javascript
// Estado del formulario
managementType // "catalog" | "restriction"
selectedTargetId // ID del catálogo/restricción
selectedTarget // Nombre del elemento
uploadStatus // "pending" | "validating" | "valid" | "with_observations" | "applied"
validationSummary // Objeto con newRecords, modifiedRecords, etc.

// Bitácoras
changeLog // Array de ChangeLogEntry (catálogos)
restrictionChangeLog // Array de RestrictionChangeLogEntry (restricciones)
```

### localStorage keys
```javascript
// Bitácora de catálogos
localStorage.getItem("odiseo_catalog_changelog")

// Bitácora de restricciones
localStorage.getItem("odiseo_restriction_changelog")
```

---

## Checklist final

- [ ] Compilación sin errores (1906 módulos)
- [ ] 4 pasos visibles y numerados
- [ ] Flujo 2 columnas responde correctamente
- [ ] Bitácora unificada cambia según tipo
- [ ] Catálogos se registran en changeLog
- [ ] Restricciones se registran en restrictionChangeLog
- [ ] Botón "Confirmar" único en pie fijo
- [ ] Modal de confirmación detallado
- [ ] Pestañas ODISEO/Sistema Integral funcionales
- [ ] Sin duplicación de botones o acciones
- [ ] Encabezado compacto sin bloque informativo grande

