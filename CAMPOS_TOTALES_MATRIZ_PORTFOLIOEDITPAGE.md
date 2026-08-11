# MATRIZ COMPLETA DE CAMPOS - PORTFOLIOEDITPAGE
## Lista Consolidada de Todos los Campos con Atributos

**Documento:** Matriz exhaustiva de campos PortfolioEditPage  
**Versión:** 1.0  
**Fecha:** 2026-08-10  
**Total Campos:** 16  
**Formato:** Tabla estructurada  
**Ubicación:** `src/modules/portfolio/pages/PortfolioEditPage.tsx`

---

## 📋 LEYENDA DE COLUMNAS

| Columna | Valores Posibles |
|---------|-----------------|
| **#** | Número secuencial |
| **Campo** | Nombre del campo en UI |
| **Variable** | form.xxx (código) |
| **Sección** | Agrupación lógica (1-5) |
| **Obligatorio** | ✅ Sí, ❌ No, ✓* Condicional |
| **Visible** | ✅ Sí, ❌ No, ✓* Condicional |
| **Editable** | ✅ Sí, ❌ No (Read-only), ✓* Condicional |
| **Estado** | Activo, Read-only, Auto-calculado, Condicional |
| **Catálogo** | ✅ Sí, ❌ No |
| **Fuente Catálogo** | portfolio-adapters, executiveStorage, clientStorage, hardcoded, N/A |
| **Total Valores** | Número de opciones disponibles |

---

## 📊 MATRIZ COMPLETA DE CAMPOS

### SECCIÓN 1: CLIENTE Y RESPONSABLE

| # | Campo | Variable | Sección | Obligatorio | Visible | Editable | Estado | Catálogo | Fuente | Valores |
|---|-------|----------|---------|-------------|---------|----------|--------|----------|--------|---------|
| 1 | Nombre del Cliente | clienteId | 1 | ✅ Sí | ✅ Sí | ✅ Sí | Activo | ✅ Sí | clientStorage | Variable |
| 2 | Ejecutivo Comercial | ejecutivoId | 1 | ✅ Sí | ✅ Sí | ✅ Sí | Activo | ✅ Sí | executiveStorage | 66+ |
| 3 | ¿Licitación? | licitacion | 1 | ✅ Sí | ✅ Sí | ✅ Sí | Condicional | ✅ Sí | Hardcoded | 2 |
| 4 | Código RFQ | codigoRFQ | 1 | ✓* Cond. | ✓* Cond. | ✅ Sí | Condicional | ❌ No | N/A | - |

---

### SECCIÓN 2: INFORMACIÓN DEL PORTAFOLIO

| # | Campo | Variable | Sección | Obligatorio | Visible | Editable | Estado | Catálogo | Fuente | Valores |
|---|-------|----------|---------|-------------|---------|----------|--------|----------|--------|---------|
| 5 | Nombre de Portafolio | nombrePortafolio | 2 | ✅ Sí | ✅ Sí | ✅ Sí | Activo | ❌ No | N/A | - |
| 6 | Descripción del Portafolio | descripcionPortafolio | 2 | ❌ No | ✅ Sí | ✅ Sí | Activo | ❌ No | N/A | - |

---

### SECCIÓN 3: PRODUCTO Y USO FINAL

| # | Campo | Variable | Sección | Obligatorio | Visible | Editable | Estado | Catálogo | Fuente | Valores |
|---|-------|----------|---------|-------------|---------|----------|--------|----------|--------|---------|
| 7 | Envoltura | envolturaId | 3 | ✅ Sí | ✅ Sí | ✅ Sí | Condicional | ✅ Sí | portfolio-adapters | 3 |
| 8 | Uso Final | usoFinalId | 3 | ✅ Sí | ✅ Sí | ✅ Sí | Activo | ✅ Sí | portfolio-adapters | Variable |
| 9 | Sector (Display) | N/A | 3 | ❌ No | ✓* Cond. | ❌ No | Read-only | ❌ No | N/A | - |
| 10 | Segmento (Display) | N/A | 3 | ❌ No | ✓* Cond. | ❌ No | Read-only | ❌ No | N/A | - |
| 11 | Sub-segmento (Display) | N/A | 3 | ❌ No | ✓* Cond. | ❌ No | Read-only | ❌ No | N/A | - |
| 12 | AFMarketID (Display) | N/A | 3 | ❌ No | ✓* Cond. | ❌ No | Read-only | ❌ No | N/A | - |

---

### SECCIÓN 4: CONFIGURACIÓN TÉCNICA

| # | Campo | Variable | Sección | Obligatorio | Visible | Editable | Estado | Catálogo | Fuente | Valores |
|---|-------|----------|---------|-------------|---------|----------|--------|----------|--------|---------|
| 13 | Envasado / Máquina de Cliente | envasadoId | 4 | ✅ Sí | ✅ Sí | ✓* Cond. | Condicional | ✅ Sí | portfolio-adapters | Variable |

---

### SECCIÓN 5: PLANTA DE ORIGEN DE SOLICITUD

| # | Campo | Variable | Sección | Obligatorio | Visible | Editable | Estado | Catálogo | Fuente | Valores |
|---|-------|----------|---------|-------------|---------|----------|--------|----------|--------|---------|
| 14 | Planta de Origen | plantaId | 5 | ✅ Sí | ✅ Sí | ✅ Sí | Activo | ✅ Sí | portfolio-adapters | 4 |

---

### CAMPOS INTERNOS NO VISIBLES

| # | Campo | Variable | Sección | Obligatorio | Visible | Editable | Estado | Catálogo | Fuente | Valores |
|---|-------|----------|---------|-------------|---------|----------|--------|----------|--------|---------|
| 15 | Código Portafolio | codigo | - | ❌ No | ❌ No (Display en header) | ❌ No | Read-only | ❌ No | N/A | - |
| 16 | Estado | estadoId | - | ❌ No | ❌ No (Hidden) | ❌ No | Read-only | ✅ Sí | portfolio-adapters | Variable |

---

## 📈 ESTADÍSTICAS FINALES

### Por Sección

| Sección | Campos | Con Catálogo | Obligatorios | Opcionales | Condicionales |
|---------|--------|---|---|---|---|
| **1. Cliente y Responsable** | 4 | 3 | 3 | 0 | 1 |
| **2. Información Portafolio** | 2 | 0 | 1 | 1 | 0 |
| **3. Producto y Uso Final** | 6 | 2 | 2 | 0 | 4 |
| **4. Configuración Técnica** | 1 | 1 | 1 | 0 | 0 |
| **5. Planta de Origen** | 1 | 1 | 1 | 0 | 0 |
| **Internos (no visibles)** | 2 | 1 | 0 | 0 | 0 |
| **TOTAL** | **16** | **8** | **8** | **1** | **5** |

### Por Tipo de Dato

| Tipo | Cantidad | Ejemplos |
|------|----------|----------|
| **Con Catálogo** | 8 | Cliente, Ejecutivo, Envoltura, Uso Final, Máquina, Planta, Estado |
| **Sin Catálogo** | 8 | Nombre Portafolio, Descripción, Código RFQ |
| **Read-only** | 6 | Sector, Segmento, Sub-segmento, AFMarketID, Código, Estado |
| **Condicional Visible** | 4 | Código RFQ (si Licitación=Sí), Taxonomía (al expandir) |
| **Condicional Editable** | 1 | Máquina (si Envoltura seleccionada) |

### Por Componente UI

| Componente | Cantidad | Campos |
|-----------|----------|--------|
| **ClientSearch** | 1 | Nombre del Cliente |
| **ExecutiveSearch** | 1 | Ejecutivo Comercial |
| **FormInput** | 3 | Nombre Portafolio, Código RFQ, Sector, Segmento, Sub-segmento, AFMarketID |
| **FormTextarea** | 1 | Descripción del Portafolio |
| **FormSelect** | 2 | Uso Final, Máquina de Cliente |
| **EnvolturaSelector** | 1 | Envoltura |
| **PlantSelector** | 1 | Planta de Origen |
| **FinalUseCatalogModal** | 1 | Uso Final (modal) |
| **Display/Badge** | 5 | Código, Sector, Segmento, Sub-segmento, AFMarketID |

---

## 🔑 OBSERVACIONES CLAVE

### ✅ CAMPOS CON CATÁLOGO (8)

| Campo | Catálogo | Valores | Fuente |
|-------|----------|---------|--------|
| **Cliente** | clientStorage | Variable | getClientCatalogRecords (filtra elegibles) |
| **Ejecutivo Comercial** | executiveStorage | 66+ | getActiveExecutiveRecords |
| **Licitación** | Hardcoded | 2 (Sí/No) | Hardcoded |
| **Envoltura** | portfolio-adapters | 3 (POUCH, BOLSA, LÁMINA) | getWrappingsCatalog |
| **Uso Final** | portfolio-adapters | Variable | getFinalUses |
| **Máquina de Cliente** | portfolio-adapters | Variable | getPackingMachinesByWrappingId |
| **Planta de Origen** | portfolio-adapters | 4 (AF Lima, Cali, Santiago, San Luis) | getPlantsCatalog |
| **Estado** | portfolio-adapters | Variable | getStatusCatalog |

### ❌ CAMPOS SIN CATÁLOGO (8)

| Campo | Tipo | Validación |
|-------|------|-----------|
| **Nombre de Portafolio** | Texto libre | Required, trim() |
| **Descripción** | Textarea | Opcional |
| **Código RFQ** | Texto libre | Required si Licitación=Sí, trim() |
| **Sector** | Display (read-only) | Derivado de Uso Final |
| **Segmento** | Display (read-only) | Derivado de Uso Final |
| **Sub-segmento** | Display (read-only) | Derivado de Uso Final |
| **AFMarketID** | Display (read-only) | Derivado de Uso Final |
| **Código Portafolio** | Display (read-only) | Parámetro URL |

### 📋 VALIDACIONES PRINCIPALES

```typescript
VALIDACIONES IMPLEMENTADAS:
├─ clienteId: Required, debe ser elegible (canClientHavePortfolio)
├─ ejecutivoId: Required
├─ plantaId: Required
├─ nombrePortafolio: Required, no vacío (trim)
├─ envolturaId: Required
├─ usoFinalId: Required
├─ envasadoId: Required
└─ codigoRFQ: Required si licitacion === "Sí", no vacío (trim)

CONDICIONALIDADES IMPLEMENTADAS:
├─ licitacion: Sí/No → Si es "Sí", habilita codigoRFQ
├─ envolturaId: Si cambia, limpia envasadoId y filtra máquinas
└─ envasadoId: Deshabilitado hasta que envolturaId sea seleccionado
```

### 🔄 BIFURCACIONES/CONDICIONALIDADES

| Condición | Efecto |
|-----------|--------|
| **Licitación = Sí** | Habilita y requiere Código RFQ |
| **Licitación = No** | Oculta Código RFQ, limpia su valor |
| **Envoltura cambia** | Limpia Máquina de Cliente, filtra máquinas disponibles |
| **Envoltura NO seleccionada** | Deshabilita Máquina de Cliente |
| **Uso Final seleccionado** | Muestra taxonomía (Sector/Segmento/Sub-seg/AFMarket) |
| **Mostrar Taxonomía** | Despliega 4 campos read-only con detalles |

### 📊 FLUJO DE VALIDACIÓN

```
Usuario llena formulario
         ↓
onSubmit → setSubmitAttempted = true
         ↓
validationErrors (useMemo) calcula errores
         ↓
shouldShowFieldError = submitAttempted OR touchedFields[field]
         ↓
Si hay errores → setTouchedFields y retorna
         ↓
Si sin errores → updatePortfolioRecord + navigate
```

---

## 📝 VALORES ESPECÍFICOS POR CATÁLOGO

### Envoltura (3 valores)
- POUCH
- BOLSA
- LÁMINA

### Planta de Origen (4 valores)
- AF Lima (AF_LIMA)
- AF Cali (AF_CALI)
- AF Santiago Norte (AF_SANTIAGO)
- AF San Luis (AF_SAN_LUIS)

### Licitación (2 valores)
- Sí (habilita Código RFQ)
- No (deshabilita Código RFQ)

### Cliente (Variable)
- Solo clientes elegibles (canClientHavePortfolio = true)
- Búsqueda completa disponible

### Ejecutivo Comercial (66+ valores)
- Desde executiveStorage.ts
- Ejecutivos activos solamente

### Uso Final (Variable)
- Desde portfolio-adapters → getFinalUses()
- Incluye Sector, Segmento, Sub-segmento, AFMarketID

### Máquina de Cliente (Variable)
- Filtrado por Envoltura seleccionada
- Incluye opción "Máquina genérica" (temporal)
- Específicas por wrappingId

### Estado (Variable)
- Desde portfolio-adapters → getStatusCatalog()
- Predefinido al cargar

---

## ✅ CARACTERÍSTICAS ESPECIALES

### 🎯 ClientSearch Component
- Búsqueda con autocomplete
- Filtra clientes elegibles
- Requerido

### 🎯 ExecutiveSearch Component
- Búsqueda con autocomplete
- Ejecutivos activos
- Requerido

### 🎯 EnvolturaSelector Component
- 3 opciones de radio/toggle
- Condiciona máquinas disponibles
- Limpia máquina si cambia

### 🎯 PlantSelector Component
- 4 opciones (4 plantas)
- Radio buttons
- Requerido

### 🎯 FinalUseCatalogModal Component
- Modal con tabla completa
- Ver tabla para búsqueda avanzada
- Actualiza campo al seleccionar

### 🎯 PortfolioPreview Component
- Vista rápida en columna derecha
- Muestra % completitud
- 7 items en preview

---

## 🔐 CONTROL DE ACCESO

```typescript
canEdit = false (inicial)
    ↓
useEffect → getCurrentUser()
    ↓
if (!user) → Acceso denegado (no editables, botón "Iniciar Sesión")
    ↓
if (user) → canEdit = true (formulario funcional)
```

---

## 📌 PUNTOS CRÍTICOS DE VALIDACIÓN

1. **Elegibilidad Cliente**: `canClientHavePortfolio(client.status)` es REQUERIDO
2. **Máquina Genérica**: Aviso informativo que debe reemplazarse antes de validación
3. **Código RFQ Condicional**: Solo obligatorio si `licitacion === "Sí"`
4. **Envoltura + Máquina**: Acoplados - cambiar envoltura limpia máquina
5. **Persistencia**: updatePortfolioRecord guarda todos los datos completos

---

**Documento completo v1.0 | 2026-08-10**

**Matriz lista para auditoría, análisis y trazabilidad completa de PortfolioEditPage**
