# FORMULAS MATEMÁTICAS DE CÁLCULO FOTOREGISTRO
## Documentación de Cálculos para Visualización en ProductEditPage

**Documento:** Fórmulas y campos para cálculo de Fotoregistro en LÁMINA  
**Versión:** 1.0  
**Fecha:** 2026-08-05  
**Ubicación:** `src/shared/utils/photoregisterCalculations.ts`  
**Componentes:** PhotoregisterAccordion, PhotoregisterPreview  
**Imagen Referencia:** Visualización de 2 Fotoregistros (FR1, FR2) en LÁMINA

---

## CAMPOS DE ENTRADA (INPUTS)

### Campos Obligatorios desde ProductEditPage

| Campo | Tipo | Rango | Unidad | Descripción |
|-------|------|-------|--------|------------|
| **laminaWidth** | Número | > 0 | mm | Ancho de la lámina (ej: 300 mm) |
| **repetition** | Número | > 0 | mm | Repetición de la lámina (ej: 400 mm) |

### Campos por Fotoregistro (FR1, FR2)

| Campo | Tipo | Rango | Unidad | Descripción |
|-------|------|-------|--------|------------|
| **dimensions.width** | Número | 0-laminaWidth | mm | Ancho del fotoregistro (ej: 12 mm) |
| **dimensions.height** | Número | 0-repetition | mm | Alto del fotoregistro (ej: 20 mm) |
| **reference.horizontal** | Select | "left" \| "right" | - | Referencia horizontal (Desde izquierda/derecha) |
| **reference.vertical** | Select | "top" \| "bottom" | - | Referencia vertical (Desde arriba/abajo) |
| **distance.horizontal** | Número | >= 0 | mm | Distancia desde borde horizontal (ej: 30 mm) |
| **distance.vertical** | Número | >= 0 | mm | Distancia desde borde vertical (ej: 50 mm) |

---

## FUNCIÓN PRINCIPAL: `calculateMargins()`

**Propósito:** Convierte referencias y distancias en márgenes absolutos (px desde cada borde)

**Entrada:**
```
laminaWidth: 300 mm
repetition: 400 mm
dimensions: { width: 12 mm, height: 20 mm }
reference: { horizontal: "right", vertical: "bottom" }
distance: { horizontal: 30 mm, vertical: 50 mm }
```

### FÓRMULAS HORIZONTALES

#### Si `reference.horizontal === "left"` (Desde la izquierda)
```
marginLeft = distance.horizontal
marginRight = laminaWidth - dimensions.width - distance.horizontal
```

#### Si `reference.horizontal === "right"` (Desde la derecha)
```
marginLeft = laminaWidth - dimensions.width - distance.horizontal
marginRight = distance.horizontal
```

**Ejemplo FR1 (reference.horizontal = "right"):**
```
marginLeft = 300 - 12 - 30 = 258 mm  ← Posición del FR1 desde el borde izquierdo
marginRight = 30 mm                   ← Margen al borde derecho
```

### FÓRMULAS VERTICALES

#### Si `reference.vertical === "top"` (Desde arriba)
```
marginTop = distance.vertical
marginBottom = repetition - dimensions.height - distance.vertical
```

#### Si `reference.vertical === "bottom"` (Desde abajo)
```
marginTop = repetition - dimensions.height - distance.vertical
marginBottom = distance.vertical
```

**Ejemplo FR1 (reference.vertical = "bottom"):**
```
marginTop = 400 - 20 - 50 = 330 mm   ← Posición del FR1 desde el borde superior
marginBottom = 50 mm                  ← Margen al borde inferior
```

### SALIDA `calculateMargins()` - FR1

```typescript
{
  left: 258 mm,        // Distancia desde borde izquierdo
  right: 30 mm,        // Distancia desde borde derecho
  top: 330 mm,         // Distancia desde borde superior
  bottom: 50 mm        // Distancia desde borde inferior
}
```

---

## FUNCIÓN SECUNDARIA: `calculateSymmetricSecond()`

**Propósito:** Calcula automáticamente el segundo fotoregistro (FR2) de forma simétrica

**Regla de Simetría:**
- Referencia horizontal **INVERTIDA**
- Referencia vertical **IGUAL** a FR1
- Distancias **IGUALES** a FR1

### TRANSFORMACIÓN FR1 → FR2

| Parámetro | FR1 | Operación | FR2 |
|-----------|-----|-----------|-----|
| reference.horizontal | "right" | Invertir | "left" |
| reference.vertical | "bottom" | Mantener | "bottom" |
| distance.horizontal | 30 mm | Mantener | 30 mm |
| distance.vertical | 50 mm | Mantener | 50 mm |
| dimensions | 12×20 mm | Mantener | 12×20 mm |

**Entrada para FR2:**
```
reference: { horizontal: "left", vertical: "bottom" }
distance: { horizontal: 30 mm, vertical: 50 mm }
```

### CÁLCULO FR2 (con referencia invertida)

#### Fórmulas Horizontales (reference.horizontal = "left")
```
marginLeft = distance.horizontal = 30 mm
marginRight = laminaWidth - dimensions.width - distance.horizontal
marginRight = 300 - 12 - 30 = 258 mm
```

#### Fórmulas Verticales (reference.vertical = "bottom" - sin cambio)
```
marginTop = repetition - dimensions.height - distance.vertical
marginTop = 400 - 20 - 50 = 330 mm
marginBottom = distance.vertical = 50 mm
```

### SALIDA `calculateMargins()` - FR2

```typescript
{
  left: 30 mm,         // Distancia desde borde izquierdo (invertido)
  right: 258 mm,       // Distancia desde borde derecho (invertido)
  top: 330 mm,         // Distancia desde borde superior (igual)
  bottom: 50 mm        // Distancia desde borde inferior (igual)
}
```

---

## RESUMEN DE CÁLCULOS PARA LA IMAGEN

### Datos de Entrada (Visibles en UI)

| Concepto | Valor |
|----------|-------|
| Ancho Lámina | 300 mm |
| Repetición | 400 mm |
| **FR1 - Dimensiones** | 12 mm × 20 mm |
| **FR1 - Referencia H** | Derecha |
| **FR1 - Distancia H** | 30 mm |
| **FR1 - Referencia V** | Abajo |
| **FR1 - Distancia V** | 50 mm |
| **FR2** | Automático (Simétrico) |

### Cálculos Intermedios

| Operación | Fórmula | Resultado |
|-----------|---------|-----------|
| Margen Izq FR1 | 300 - 12 - 30 | **258 mm** |
| Margen Der FR1 | 30 | **30 mm** |
| Margen Sup FR1 | 400 - 20 - 50 | **330 mm** |
| Margen Inf FR1 | 50 | **50 mm** |
| Margen Izq FR2 | 30 | **30 mm** |
| Margen Der FR2 | 300 - 12 - 30 | **258 mm** |
| Margen Sup FR2 | 400 - 20 - 50 | **330 mm** |
| Margen Inf FR2 | 50 | **50 mm** |

### Valores en la Imagen (Coordenadas de Renderizado)

```
                           Ancho de la lámina: 300 mm
                    ←────────────────────────────→
                   ┌────────────────────────────┐  ↑
                   │                            │  │ 330 mm (marginTop)
                   │         30 mm (marginLeft  │  │
                   │       FR1/30mm marginRight)│  ↓
                ┌──┴──────┐                  ┌──┴──┐
                │  FR1    │                  │ FR2 │
                │ 12×20mm │                  │12×20mm
                └──┬──────┘                  └──┬──┐
                   │                            │  │
                   │                            │  │ 50 mm (marginBottom)
                   │                            │  │
                   └────────────────────────────┘  ↓
                   
                   ← 258 mm → │ 12 mm │ ← 258 mm →
```

---

## VALIDACIONES IMPLEMENTADAS

### `validatePhotoregisterFitsInLamina()`

Se valida que los fotoregistros **CABEN DENTRO** de la lámina:

| Validación | Fórmula | Condición |
|------------|---------|-----------|
| Ancho FR > 0 | `dimensions.width > 0` | ✓ VÁLIDO |
| Alto FR > 0 | `dimensions.height > 0` | ✓ VÁLIDO |
| Ancho FR ≤ Lámina | `dimensions.width ≤ laminaWidth` | 12 ≤ 300 ✓ |
| Alto FR ≤ Repetición | `dimensions.height ≤ repetition` | 20 ≤ 400 ✓ |
| Distancia H ≥ 0 | `distance.horizontal ≥ 0` | 30 ≥ 0 ✓ |
| Distancia V ≥ 0 | `distance.vertical ≥ 0` | 50 ≥ 0 ✓ |
| Espacio Horizontal | `distance.horizontal ≤ (laminaWidth - dimensions.width)` | 30 ≤ 288 ✓ |
| Espacio Vertical | `distance.vertical ≤ (repetition - dimensions.height)` | 50 ≤ 380 ✓ |

---

## FUNCIÓN DE RECONSTRUCCIÓN: `reconstructReferenceAndDistance()`

**Propósito:** Convierte márgenes absolutos **DE VUELTA** a referencias y distancias

**Caso de Uso:** Al cargar un fotoregistro guardado en BD

**Entrada (márgenes desde BD):**
```typescript
margins: {
  left: 258 mm,
  right: 30 mm,
  top: 330 mm,
  bottom: 50 mm
}
```

### LÓGICA DE RECONSTRUCCIÓN

#### Referencia Horizontal
```typescript
horizontalReference = (margins.left < margins.right) ? "left" : "right"
// 258 < 30 ? NO
// horizontalReference = "right" ✓
```

#### Distancia Horizontal
```typescript
horizontalDistance = (ref === "left") ? margins.left : margins.right
// "right" selected
// horizontalDistance = 30 mm ✓
```

#### Referencia Vertical
```typescript
verticalReference = (margins.top < margins.bottom) ? "top" : "bottom"
// 330 < 50 ? NO
// verticalReference = "bottom" ✓
```

#### Distancia Vertical
```typescript
verticalDistance = (ref === "top") ? margins.top : margins.bottom
// "bottom" selected
// verticalDistance = 50 mm ✓
```

**Salida Reconstruida:**
```typescript
{
  reference: { horizontal: "right", vertical: "bottom" },
  distance: { horizontal: 30 mm, vertical: 50 mm }
}
```

---

## FUNCIÓN DE DETECCIÓN: `isSecondPhotoregisterAutomatic()`

**Propósito:** Detecta si FR2 es simétrico (automático) o personalizado

**Condiciones de Simetría:**
```typescript
// 1. Mismo tamaño
Math.abs(fr2.width - fr1.width) ≤ tolerance  // 12 - 12 = 0 ✓
Math.abs(fr2.height - fr1.height) ≤ tolerance  // 20 - 20 = 0 ✓

// 2. Simétría horizontal
Math.abs(fr2.left - fr1.right) ≤ tolerance    // 30 - 30 = 0 ✓
Math.abs(fr2.right - fr1.left) ≤ tolerance    // 258 - 258 = 0 ✓

// 3. Misma posición vertical
Math.abs(fr2.top - fr1.top) ≤ tolerance       // 330 - 330 = 0 ✓
Math.abs(fr2.bottom - fr1.bottom) ≤ tolerance // 50 - 50 = 0 ✓

// Si TODAS las condiciones son verdaderas → isAutomatic = TRUE
```

**Tolerancia por defecto:** 0.1 mm

---

## CAMPOS DERIVADOS (AUTO-CALCULADOS)

### Posiciones Visuales (Para renderizado en SVG)

| Campo | Fórmula | FR1 | FR2 |
|-------|---------|-----|-----|
| **x (posición horizontal)** | marginLeft | 258 | 30 |
| **y (posición vertical)** | marginTop | 330 | 330 |
| **ancho** | dimensions.width | 12 | 12 |
| **alto** | dimensions.height | 20 | 20 |

### Etiquetas de Referencia (Legibles)

```typescript
// FR1: reference.horizontal = "right", reference.vertical = "bottom"
label = "Desde la derecha, Desde abajo"

// FR2: reference.horizontal = "left", reference.vertical = "bottom"
label = "Desde la izquierda, Desde abajo"
```

---

## CASO DE USO COMPLETO: CREAR UN FOTOREGISTRO

**Usuario ingresa en la UI:**
```
¿La lámina lleva fotoregistro? → SÍ
¿Cuántos fotoregistros lleya? → 2 fotoregistros

FOTOREGISTRO 1
├─ Ancho: 12 mm
├─ Alto: 20 mm
├─ Medir desde: Derecha
├─ Distancia horizontal: 30 mm
├─ Medir desde: Abajo
└─ Distancia vertical: 50 mm

FOTOREGISTRO 2: [AUTOMÁTICO - No requiere entrada]
```

**Sistema calcula (internamente):**

1. Valida que FR1 cabe en la lámina ✓
2. Calcula márgenes de FR1:
   - left: 258, right: 30, top: 330, bottom: 50
3. Genera FR2 simétrico automáticamente:
   - reference: { horizontal: "left", vertical: "bottom" }
   - distance: { horizontal: 30, vertical: 50 }
4. Calcula márgenes de FR2:
   - left: 30, right: 258, top: 330, bottom: 50
5. Renderiza ambos FR en la visualización

**Resultado:** Imagen con 2 FR perfectamente centrados (simetría)

---

## RESTRICCIONES Y LÍMITES

| Restricción | Valor | Razón |
|------------|-------|-------|
| **Máximo Fotoregistros** | 2 por LÁMINA | Por especificación de producto |
| **FR único** | 1 (no simétrico) | Permitido |
| **Ancho FR mínimo** | > 0 mm | Debe ser visible |
| **Alto FR mínimo** | > 0 mm | Debe ser visible |
| **Ancho FR máximo** | < laminaWidth | Debe caber en lámina |
| **Alto FR máximo** | < repetition | Debe caber en repetición |
| **Distancia mínima** | 0 mm | Puede estar en borde |
| **Distancia máxima H** | laminaWidth - ancho_FR | Debe caber en lámina |
| **Distancia máxima V** | repetition - alto_FR | Debe caber en repetición |

---

## PERSISTENCIA Y ALMACENAMIENTO

### Datos Guardados en BD
```typescript
{
  "photoregisters": [
    {
      "id": "FR1",
      "dimensions": { "width": 12, "height": 20 },
      "reference": { "horizontal": "right", "vertical": "bottom" },
      "distance": { "horizontal": 30, "vertical": 50 },
      "isAutomatic": false
    },
    {
      "id": "FR2",
      "dimensions": { "width": 12, "height": 20 },
      "reference": { "horizontal": "left", "vertical": "bottom" },
      "distance": { "horizontal": 30, "vertical": 50 },
      "isAutomatic": true
    }
  ]
}
```

### Al Cargar desde BD
1. Reconstruye referencia y distancia desde márgenes si es necesario
2. Valida que FR2 sea simétrico (si isAutomatic = true)
3. Recalcula márgenes para renderizado

---

## DIAGRAMA DE FLUJO - CÁLCULO FOTOREGISTRO

```
┌─────────────────────────────────────┐
│  Usuario ingresa datos (UI)         │
│  ├─ Ancho Lámina: 300 mm            │
│  ├─ Repetición: 400 mm              │
│  ├─ FR1: 12×20, Right, 30, Bottom 50│
│  └─ FR2: Automático                 │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  validatePhotoregisterFitsInLamina()│
│  ✓ Todas las validaciones pasan     │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  calculateMargins(FR1)              │
│  → { left:258, right:30,            │
│      top:330, bottom:50 }           │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  calculateSymmetricSecond(FR1)      │
│  → reference.horizontal = "left"    │
│    (inverso de "right")             │
│  → reference.vertical = "bottom"    │
│    (igual que FR1)                  │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  calculateMargins(FR2)              │
│  → { left:30, right:258,            │
│      top:330, bottom:50 }           │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  PhotoregisterPreview renderiza     │
│  ├─ SVG con FR1 (258,330)           │
│  ├─ SVG con FR2 (30,330)            │
│  └─ Etiquetas de dimensiones        │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  Persistencia (localStorage/BD)      │
│  Guarda referencias + distancias    │
└─────────────────────────────────────┘
```

---

## MATRIZ DE REFERENCIAS POSIBLES

### Todas las Combinaciones Válidas

| Horizontal | Vertical | Descripción | Uso |
|-----------|----------|------------|-----|
| left | top | Desde esquina superior izquierda | Estándar |
| left | bottom | Desde esquina inferior izquierda | Menos común |
| right | top | Desde esquina superior derecha | Menos común |
| right | bottom | Desde esquina inferior derecha | **Más común** (imagen) |

Para cada combinación, se aplican las fórmulas correspondientes de `calculateMargins()`.

---

## INTEGRACIÓN CON PRODUCTEDIPAGE

### Ubicación en el Flujo

```
ProductEditPage (Paso 2)
├─ PhotoregisterAccordion (Usuario ingresa datos)
│  ├─ Input: ¿La lámina lleva fotoregistro?
│  ├─ Input: Dimensiones (ancho × alto)
│  ├─ Input: Referencia y distancia (FR1)
│  └─ Input: ¿FR2 automático o personalizado?
│
├─ handleCalculatePhotoregister() (Valida + calcula)
│  ├─ validatePhotoregisterFitsInLamina()
│  ├─ calculateMargins(FR1)
│  ├─ calculateSymmetricSecond(FR1) [si automático]
│  └─ calculateMargins(FR2)
│
└─ PhotoregisterPreview (Renderiza)
   ├─ SVG canvas (300×400 mm)
   ├─ Rectángulo FR1 (posición + dimensiones)
   ├─ Rectángulo FR2 (posición + dimensiones)
   └─ Etiquetas de medidas
```

---

**Documento completo v1.0 | 2026-08-05**
