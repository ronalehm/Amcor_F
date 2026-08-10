# ANEXO 1: MATRIZ DE VALIDACIÓN Y RESTRICCIONES DEL FORMATO - LÁMINA

**Documento:** Matriz Consolidada de Validaciones  
**Versión:** 1.0  
**Fecha:** 2026-08-05  
**Producto:** LÁMINA  

---

## 1. MATRIZ CONSOLIDADA DE VALIDACIONES POR CAMPO

| # | Campo | Tipo | Obligatorio | Rango/Valores | Validación | Sección |
|---|-------|------|-----------|---|---|---|
| 1 | Nombre | Texto | ✓ | Min 5 caracteres | Alphanumeric | Producto |
| 2 | Cliente | Select | ✓ | Lista de clientes | Debe existir en BD | Producto |
| 3 | Segmento | Select | ✓ | Depende de Cliente | Filtro dinámico | Producto |
| 4 | Planta | Select | ✓ | AF Lima/Cali/Santiago/San Luis | Exacto | Producto |
| 5 | Moneda | Select | ✓ | PEN/USD/EUR | Exacto | Producto |
| 6 | País | Select | ✓ | LATAM + Otros | Exacto | Producto |
| 7 | Tipo Venta | Select | ✓ | B2B/B2C/Retail/Distribuidor | Exacto | Producto |
| 8 | Código SF | Texto | ✓ | A-XXXXXX | Formato exacto | Producto |
| 9 | Aplicación Técnica | Select | ✓ | 45+ opciones | Exacto | Producto |
| 10 | Incoterm | Select | ✓ | FOB/CIF/DDP | Exacto | Producto |
| 11 | Clase Impresión | Select | ✓ | Sin Impr/Flexo/Hueco | Condicional | Diseño |
| 12 | Tipo Impresión | Select | ✓* | Repetitivo/Continuo | Si Print ≠ Sin Impresión | Diseño |
| 13 | Forma Impresión | Select | ✓* | Dorso/Superficie | Si Print ≠ Sin Impresión | Diseño |
| 14 | EDAG | Texto | ✓** | NNNNN-NN | Si Referencia = Sí | Diseño |
| 15 | Objetivo Color | Select | ✓* | 4c/Pantone/Especial | Si Print ≠ Sin Impresión | Diseño |
| 16 | Tipo Estructura | Select | ✓ | Mono/Bilam/Trilam/Tetra | Condicional | Estructura |
| 17 | Material Capa 1 | Select | ✓ | SI VALIDADA | Filtro SI VALIDADA | Estructura |
| 18 | Material Capa 2 | Select | ✓+ | SI VALIDADA | Si Bilaminado+ | Estructura |
| 19 | Material Capa 3 | Select | ✓+ | SI VALIDADA | Si Trilaminado+ | Estructura |
| 20 | Material Capa 4 | Select | ✓+ | SI VALIDADA | Si Tetralaminado | Estructura |
| 21 | Micrones Totales | Número | ✓ | Auto-calculado | Lectura única (SI) | Estructura |
| 22 | Combinación 405 | Badge | ✓ | Validada/Pendiente | 405 SI Validadas | Estructura |
| 23 | Grammage | Número | ✓ | ±10% auto-calculado | Lectura única (SI) | Estructura |
| 24 | Tipo Formato | Select | ✓ | Tipo A/B/C | Exacto | Embalajes |
| 25 | Ancho LÁMINA | Número | ✓ | 100-20,000 mm | Rango ±2% | Embalajes |
| 26 | Repetición | Número | ✓ | 100-20,000 mm | ≤ Ancho, rango | Embalajes |
| 27 | Acabado | Select | ✓ | Mate/Brillante/Protección | Exacto | Embalajes |
| 28 | Embobinado | Select | ✓ | Longitudinal/Transversal | Exacto | Embalajes |
| 29 | Fotoregistro | Radio | ✗ | Sí/No | Max 1 LÁMINA exclusive | Embalajes |
| 30 | Tipo FR | Select | ✓*** | Marca/Regulares/Sensor | Si FR=Sí | Embalajes |
| 31 | Ubicación FR | Número | ✓*** | 50-(Ancho-50) mm | Dinámico, se recalcula | Embalajes |
| 32 | Margen FR | Número | ✓*** | 5-50 mm | Rango fijo | Embalajes |

**LEYENDA:**
- `✓` = Obligatorio siempre
- `✓*` = Obligatorio condicional (Print Class ≠ Sin Impresión)
- `✓**` = Obligatorio condicional (Diseño Referencia = Sí)
- `✓***` = Obligatorio condicional (Fotoregistro = Sí)
- `✗` = Opcional
- `✓+` = Obligatorio condicional (según Tipo Estructura)
- `Auto` = Auto-calculado por sistema
- `SI VALIDADA` = Solo materiales con estado VALIDADA del Sistema Integral

---

## 2. RESTRICCIONES DEL FORMATO - LÁMINA

### RESTRICCION 1: ANCHO LÁMINA
**Rango:** 100 mm - 20,000 mm  
**Tolerancia:** ±2%  
**Razón:** Limitación de maquinaria industrial  

**Efecto cascada:**
- Cuando Ancho cambia → Recalcular rango dinámico de Ubicación Fotocelula
- Nuevo rango: [50, Ancho-50]
- Ejemplo: Si Ancho=1000mm → Ubicación rango 50-950mm

### RESTRICCION 2: REPETICION
**Rango:** 100 mm - 20,000 mm  
**Restricción adicional:** DEBE SER ≤ ANCHO  
**Razón:** Patrón de impresión debe caber en ancho de plano

**Validación lógica:**
```
100 ≤ Repetición ≤ 20,000 AND Repetición ≤ Ancho
```

**Error si:** `Repetición > Ancho` o fuera de rango

### RESTRICCION 3: FOTOREGISTRO
**Máximo:** 1 por LÁMINA  
**Visible:** SOLO si wrappingType = "LÁMINA"  
**Oculto:** Para BOLSA/POUCH  
**Razón:** Sistema exclusivo LÁMINA

**UI Indicador:**
- Contador: "1 de 1" cuando existe
- Botón Agregar: DISABLED cuando FR existe
- Botón Eliminar: ENABLED si FR existe

### RESTRICCION 4: UBICACION FOTOCÉLULA
**Rango DINÁMICO:** [50, Ancho-50] mm  
**Ejemplo:** Si Ancho=1000 → Rango 50-950 mm  
**Razón:** Zonas críticas de procesamiento, margen mínimo de 50mm desde bordes

**Validación:**
```
50 ≤ Ubicación ≤ (Ancho - 50)
```

**Recalculación:** Automática cuando Ancho cambia  
**Tooltip:** Mostrar rango calculado dinámicamente

### RESTRICCION 5: MARGEN DETECCIÓN FOTOCÉLULA
**Mínimo:** 5 mm  
**Máximo:** 50 mm  
**Razón:** Sensibilidad del sensor

**Validación:**
```
5 ≤ Margen ≤ 50
```

### RESTRICCION 6: ESTRUCTURA (Producto Modificado)
**Si Clasificación = "PRODUCTO MODIFICADO"**
- Estructura es HEREDADA (read-only)
- Campo UI: GRIS con candado 🔒
- Label: "Heredado del producto base"
- No se puede cambiar

**Campos Editables:** Solo dimensiones (Ancho, Repetición), acabado, aplicación técnica

**Campos Bloqueados:**
- Tipo Estructura (read-only)
- Todos los Materiales (read-only)
- Micrones (read-only)
- Grammage (read-only)

### RESTRICCION 7: COMBINACIONES 405 SI
**Materiales deben validar contra 405 combinaciones**  
**Si NO existe:** Marcar como "Pendiente Validación Técnica" (⚠️)  
**Razón:** Garantía de proceso y calidad

**Estado:**
- ✅ Validada: Material combination en 405 SI
- ⚠️ Pendiente: Material combination NO en 405 SI (requiere técnico)

### RESTRICCION 8: GRAMMAGE AUTO-CALCULADO
**Origen:** Sistema Integral (SI)  
**Cálculo:** Basado en materiales + espesores SI  
**Rango Válido:** ±10% del valor calculado  
**Campo:** Lectura única (no editable)

**Validación:**
```
Grammage ≤ (CalculatedValue * 1.10) AND
Grammage ≥ (CalculatedValue * 0.90)
```

**Si fuera de rango:** ADVERTENCIA (naranja), mensaje: "Grammage fuera de tolerancia"

### RESTRICCION 9: ACABADO RECOMENDADO (Advertencia)
**Si Aplicación Técnica = "Seco"**
- Recomendado: Mate
- Si Brillante: ADVERTENCIA (naranja), usuario puede ignorar

**Si Aplicación = "Pastoso" o "Líquido"**
- Recomendado: Brillante
- Si Mate: ADVERTENCIA (naranja), usuario puede ignorar

**Severidad:** Advertencia (⚠️), no error
**Usuario puede:** Confirmar e ignorar

### RESTRICCION 10: CLASE IMPRESIÓN CONDICIONAL
**Si Clase = "Sin Impresión"**
- DESHABILITAR: Tipo, Forma, EDAG, Color (campos GRISES)
- NO REQUERIR: Estos campos obligatorios pasan a opcionales
- Values: Auto-limpiar si existen

**Si Clase = "Flexografía" o "Huecograbado"**
- HABILITAR: Tipo, Forma, Color (OBLIGATORIOS)
- EDAG: Obligatorio si Referencia = Sí

---

## 3. RESTRICCIONES NUMÉRICAS CONSOLIDADAS

| Campo | Mín | Máx | Unidad | Tolerancia | Efecto |
|-------|-----|-----|--------|-----------|--------|
| Ancho LÁMINA | 100 | 20,000 | mm | ±2% | Recalcula Ubicación FR |
| Repetición | 100 | 20,000 | mm | Exacto | Debe ser ≤ Ancho |
| Ubicación FR | 50 | Ancho-50 | mm | Dinámico | Recalc. con Ancho |
| Margen FR | 5 | 50 | mm | Exacto | Rango fijo |
| Grammage | -10% | +10% | g/m² | 10% | vs. calculado |

---

## 4. VALIDACIONES CONDICIONALES

### Validación por Tipo Estructura

| Tipo Estructura | Cap 1 | Cap 2 | Cap 3 | Cap 4 | Validación |
|---|---|---|---|---|---|
| Monocapa | ✓ | ✗ | ✗ | ✗ | Solo Cap 1, resto oculto |
| Bilaminado | ✓ | ✓ | ✗ | ✗ | Cap 1+2, validar 405 (M1,M2) |
| Trilaminado | ✓ | ✓ | ✓ | ✗ | Cap 1+2+3, validar 405 (M1,M2,M3) |
| Tetralaminado | ✓ | ✓ | ✓ | ✓ | Todas caps, validar 405 (M1,M2,M3,M4) |

### Validación por Clase Impresión

| Clase | Tipo | Forma | Color | EDAG | Validación |
|---|---|---|---|---|---|
| Sin Impresión | ✗ GRIS | ✗ GRIS | ✗ GRIS | ✗ GRIS | Todos deshabilitados |
| Flexografía | ✓ | ✓ | ✓ | ✓* | Si Ref=Sí |
| Huecograbado | ✓ | ✓ | ✓ | ✓* | Si Ref=Sí |

### Validación por Producto Modificado

| Campo | Estado | Editable |
|-------|--------|----------|
| Estructura | Heredada | NO 🔒 |
| Materiales | Heredados | NO 🔒 |
| Ancho | Propio | SÍ |
| Repetición | Propio | SÍ |
| Acabado | Propio | SÍ |
| Fotoregistro | Propio | SÍ |

---

## 5. MATRIZ DE RESTRICCIONES VS SECCIONES

| Restricción | Sección | Campo Afectado | Tipo | Severidad |
|---|---|---|---|---|
| Rango Ancho | Embalajes | Ancho LÁMINA | Rango | ERROR ❌ |
| Rango Repetición | Embalajes | Repetición | Rango | ERROR ❌ |
| Repetición ≤ Ancho | Embalajes | Repetición | Lógica | ERROR ❌ |
| Max 1 FR | Embalajes | Fotoregistro | Contador | ERROR ❌ |
| Rango Ubicación FR | Embalajes | Ubicación FR | Dinámico | ERROR ❌ |
| Rango Margen FR | Embalajes | Margen FR | Rango | ERROR ❌ |
| Grammage ±10% | Estructura | Grammage | Tolerancia | ADVERTENCIA ⚠️ |
| Acabado Recom. | Embalajes | Acabado | Sugerencia | ADVERTENCIA ⚠️ |
| Estructura Heredada | Estructura | Tipo, Materiales | Read-only | BLOQUEO 🔒 |
| Combinación 405 | Estructura | Materiales | Validación | ADVERTENCIA ⚠️ |

---

## 6. PUNTOS DE VALIDACIÓN CRÍTICOS

1. **Al cambiar Ancho:** Recalcular [50, Ancho-50] para Ubicación FR
2. **Al cambiar Tipo Estructura:** Validar materiales disponibles, ocultar capas
3. **Al cambiar Clase Impresión:** Enable/disable diseño campos
4. **Al cambiar Fotoregistro:** Mostrar/ocultar campos FR
5. **Al cambiar Producto Clasificación:** Lock/unlock estructura
6. **Al guardar:** Validar 405 SI, grammage, repetición ≤ ancho

---

## REFERENCIAS

- [[Classification & Modification Structure]]
- [[DEVIN Validated Structures Implementation]]
- [[Dimensions & Accessories Relocation Complete]]
- [[Layer Editing Restrictions]]

---

*Documento Anexo 1 - Matriz de Validación | LÁMINA | v1.0*
