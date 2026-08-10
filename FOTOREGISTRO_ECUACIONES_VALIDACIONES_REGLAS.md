# 📐 FOTOREGISTRO - ECUACIONES, VALIDACIONES Y REGLAS

**Versión:** 1.0  
**Fecha:** 2026-08-10  
**Scope:** Ecuaciones formales, validaciones exhaustivas, reglas negocio

---

# 1. ECUACIONES MATEMÁTICAS

## E-1: Márgenes Calculados

### E-1.1: Margen Izquierdo (Left)

```
MarginLeft = IF (referenceHorizontal = "IZQUIERDA")
             THEN distanceHorizontal
             ELSE 0

Notación formal:
MarginL = { distH,  if refH = LEFT
          { 0,      if refH = RIGHT
```

**Ejemplo 1:**
- refH = IZQUIERDA, distH = 25 mm
- MarginL = 25 mm ✓

**Ejemplo 2:**
- refH = DERECHA, distH = 25 mm
- MarginL = 0 mm ✓

---

### E-1.2: Margen Derecho (Right)

```
MarginRight = IF (referenceHorizontal = "DERECHA")
              THEN distanceHorizontal
              ELSE 0

Notación formal:
MarginR = { distH,  if refH = RIGHT
          { 0,      if refH = LEFT
```

**Ejemplo 1:**
- refH = DERECHA, distH = 30 mm
- MarginR = 30 mm ✓

**Ejemplo 2:**
- refH = IZQUIERDA, distH = 30 mm
- MarginR = 0 mm ✓

---

### E-1.3: Margen Superior (Top)

```
MarginTop = IF (referenceVertical = "ARRIBA")
            THEN distanceVertical
            ELSE 0

Notación formal:
MarginT = { distV,  if refV = TOP
          { 0,      if refV = BOTTOM
```

**Ejemplo 1:**
- refV = ARRIBA, distV = 15 mm
- MarginT = 15 mm ✓

**Ejemplo 2:**
- refV = ABAJO, distV = 15 mm
- MarginT = 0 mm ✓

---

### E-1.4: Margen Inferior (Bottom)

```
MarginBottom = IF (referenceVertical = "ABAJO")
               THEN distanceVertical
               ELSE 0

Notación formal:
MarginB = { distV,  if refV = BOTTOM
          { 0,      if refV = TOP
```

**Ejemplo 1:**
- refV = ABAJO, distV = 20 mm
- MarginB = 20 mm ✓

**Ejemplo 2:**
- refV = ARRIBA, distV = 20 mm
- MarginB = 0 mm ✓

---

## E-2: Posición del Fotoregistro en el Rollo

### E-2.1: Posición Horizontal (X)

```
X_FR1 = IF (referenceHorizontal = "IZQUIERDA")
        THEN distanceHorizontal
        ELSE (laminaWidth - fr1Width - distanceHorizontal)

Notación compacta:
X = { distH,                              if refH = LEFT
    { width_lamina - width_fr1 - distH,  if refH = RIGHT
```

**Ejemplo 1 (Referencia Izquierda):**
- Lámina Width = 500 mm
- FR1 Width = 100 mm
- Distance H = 25 mm
- Referencia = IZQUIERDA
- X = 25 mm (a 25mm del borde izquierdo)

**Ejemplo 2 (Referencia Derecha):**
- Lámina Width = 500 mm
- FR1 Width = 100 mm
- Distance H = 30 mm
- Referencia = DERECHA
- X = 500 - 100 - 30 = 370 mm (a 30mm del borde derecho)

---

### E-2.2: Posición Vertical (Y)

```
Y_FR1 = IF (referenceVertical = "ARRIBA")
        THEN distanceVertical
        ELSE (laminaRepetition - fr1Height - distanceVertical)

Notación compacta:
Y = { distV,                                    if refV = TOP
    { repetition_lamina - height_fr1 - distV,  if refV = BOTTOM
```

**Ejemplo 1 (Referencia Arriba):**
- Lámina Repetition = 800 mm
- FR1 Height = 80 mm
- Distance V = 15 mm
- Referencia = ARRIBA
- Y = 15 mm (a 15mm del borde superior)

**Ejemplo 2 (Referencia Abajo):**
- Lámina Repetition = 800 mm
- FR1 Height = 80 mm
- Distance V = 20 mm
- Referencia = ABAJO
- Y = 800 - 80 - 20 = 700 mm (a 20mm del borde inferior)

---

## E-3: Validación Geométrica (Coherencia)

### E-3.1: FR1 No Debe Exceder Rollo (Warnings)

```
⚠️ WARNING (No bloquea, solo aviso):

IF (X_FR1 + FR1_Width) > Lámina_Width:
  └─ ADVERTENCIA: "FR1 ancho excede borde derecho del rollo"

IF (Y_FR1 + FR1_Height) > Lámina_Repetition:
  └─ ADVERTENCIA: "FR1 alto excede borde inferior del rollo"

IF X_FR1 < 0:
  └─ ADVERTENCIA: "FR1 posición X negativa"

IF Y_FR1 < 0:
  └─ ADVERTENCIA: "FR1 posición Y negativa"
```

**Ejemplo:**
- Lámina: 500×800 mm
- FR1: 100×80 mm
- Ref H = DERECHA, Dist H = 30 mm → X = 370 mm
- X + FR1W = 370 + 100 = 470 < 500 ✅ OK (sin warning)

---

### E-3.2: Márgenes Coherencia

```
⚠️ WARNING (Lógica):

IF (MarginLeft > 0 AND MarginRight > 0):
  └─ ADVERTENCIA: "¿Ambos márgenes horizontales? Verificar referencias"

IF (MarginTop > 0 AND MarginBottom > 0):
  └─ ADVERTENCIA: "¿Ambos márgenes verticales? Verificar referencias"

IF (MarginLeft = 0 AND MarginRight = 0):
  └─ ADVERTENCIA: "Sin margen horizontal - FR1 ocupa todo ancho"

IF (MarginTop = 0 AND MarginBottom = 0):
  └─ ADVERTENCIA: "Sin margen vertical - FR1 ocupa todo alto"
```

---

# 2. VALIDACIONES

## V-FR-1: Rango Fotoregistro Toggle

```
Campo: hasFotoregistro
Tipo: Boolean
Valores: Sí (true) / No (false)
DEFAULT: No (false)

Validación:
├─ IF hasFotoregistro = Sí AND Envoltura ≠ LÁMINA:
│  └─ ❌ ERROR: "Fotoregistro solo disponible para LÁMINA"
│     ACCIÓN: Bloquear UI (no mostrar toggle)
│
└─ IF hasFotoregistro = Sí:
   └─ Todos los campos FR1 se vuelven OBLIGATORIOS
```

**Pseudocódigo:**
```typescript
if (hasFotoregistro && !isLaminaWrapping(envelope)) {
  throw new ValidationError('Fotoregistro: solo LÁMINA');
}
```

---

## V-FR-2: Rango FR1 Width (Ancho)

```
Campo: fr1Width
Tipo: Number
Unidad: milímetros (mm)
RANGO: 1 - 9999 mm
OBLIGATORIO: ✅ SÍ (si hasFotoregistro = Sí)

Validación:
├─ IF fr1Width < 1:
│  └─ ❌ ERROR: "Ancho debe ser ≥ 1 mm"
│     FIELD: Rojo, message debajo del input
│     BLOQUEA: Submit
│
├─ IF fr1Width > 9999:
│  └─ ❌ ERROR: "Ancho debe ser ≤ 9999 mm"
│     FIELD: Rojo, message debajo del input
│     BLOQUEA: Submit
│
└─ IF fr1Width entre 1 y 9999:
   └─ ✅ OK: Sin error
```

**Pseudocódigo:**
```typescript
if (fr1Width < 1 || fr1Width > 9999) {
  errors.push({
    field: 'fr1Width',
    message: 'Ancho debe estar entre 1 y 9999 mm',
    severity: 'error'
  });
}
```

---

## V-FR-3: Rango FR1 Height (Alto)

```
Campo: fr1Height
Tipo: Number
Unidad: milímetros (mm)
RANGO: 1 - 9999 mm
OBLIGATORIO: ✅ SÍ (si hasFotoregistro = Sí)

Validación:
├─ IF fr1Height < 1:
│  └─ ❌ ERROR: "Alto debe ser ≥ 1 mm"
│
├─ IF fr1Height > 9999:
│  └─ ❌ ERROR: "Alto debe ser ≤ 9999 mm"
│
└─ IF fr1Height entre 1 y 9999:
   └─ ✅ OK: Sin error
```

---

## V-FR-4: Referencia Horizontal (Requerida)

```
Campo: fr1ReferenceHorizontal
Tipo: Enum (select dropdown)
VALORES: ["Izquierda", "Derecha"]
OBLIGATORIO: ✅ SÍ (si hasFotoregistro = Sí)
DEFAULT: "Izquierda"

Validación:
├─ IF fr1ReferenceHorizontal = NULL o vacío:
│  └─ ❌ ERROR: "Referencia Horizontal es obligatoria"
│     FIELD: Select rojo
│     BLOQUEA: Submit
│
└─ IF fr1ReferenceHorizontal ∈ {Izquierda, Derecha}:
   └─ ✅ OK: Sin error
   └─ TRIGGER: Recalcular márgenes (E-1.1, E-1.2, E-2.1)
```

---

## V-FR-5: Referencia Vertical (Requerida)

```
Campo: fr1ReferenceVertical
Tipo: Enum (select dropdown)
VALORES: ["Arriba", "Abajo"]
OBLIGATORIO: ✅ SÍ (si hasFotoregistro = Sí)
DEFAULT: "Arriba"

Validación:
├─ IF fr1ReferenceVertical = NULL o vacío:
│  └─ ❌ ERROR: "Referencia Vertical es obligatoria"
│
└─ IF fr1ReferenceVertical ∈ {Arriba, Abajo}:
   └─ ✅ OK: Sin error
   └─ TRIGGER: Recalcular márgenes (E-1.3, E-1.4, E-2.2)
```

---

## V-FR-6: Rango Distancia Horizontal

```
Campo: fr1DistanceHorizontal
Tipo: Number
Unidad: milímetros (mm)
RANGO: 0 - 9999 mm
OBLIGATORIO: ✅ SÍ (si hasFotoregistro = Sí)

Validación:
├─ IF fr1DistanceHorizontal < 0:
│  └─ ❌ ERROR: "Distancia no puede ser negativa"
│
├─ IF fr1DistanceHorizontal > 9999:
│  └─ ❌ ERROR: "Distancia debe ser ≤ 9999 mm"
│
└─ IF fr1DistanceHorizontal ∈ [0, 9999]:
   └─ ✅ OK: Sin error
   └─ TRIGGER: Recalcular márgenes (E-1.1, E-1.2, E-2.1)
```

**Nota:** Rango 0 es permitido (FR1 tocando borde del rollo)

---

## V-FR-7: Rango Distancia Vertical

```
Campo: fr1DistanceVertical
Tipo: Number
Unidad: milímetros (mm)
RANGO: 0 - 9999 mm
OBLIGATORIO: ✅ SÍ (si hasFotoregistro = Sí)

Validación:
├─ IF fr1DistanceVertical < 0:
│  └─ ❌ ERROR: "Distancia no puede ser negativa"
│
├─ IF fr1DistanceVertical > 9999:
│  └─ ❌ ERROR: "Distancia debe ser ≤ 9999 mm"
│
└─ IF fr1DistanceVertical ∈ [0, 9999]:
   └─ ✅ OK: Sin error
   └─ TRIGGER: Recalcular márgenes (E-1.3, E-1.4, E-2.2)
```

---

## V-FR-8: Todos los Campos Obligatorios (Cuando FR=Sí)

```
Validación Compuesta (ALL_OR_NOTHING):

IF hasFotoregistro = Sí:
  THEN TODOS estos campos OBLIGATORIOS:
    ├─ fr1Width (E-1, V-FR-2) ✓
    ├─ fr1Height (E-1, V-FR-3) ✓
    ├─ fr1ReferenceHorizontal (V-FR-4) ✓
    ├─ fr1ReferenceVertical (V-FR-5) ✓
    ├─ fr1DistanceHorizontal (V-FR-6) ✓
    └─ fr1DistanceVertical (V-FR-7) ✓

  IF ALGUNO = NULL:
  ├─ ❌ ERROR: "Campos faltantes: [lista campos]"
  └─ BLOQUEA: Submit proyecto
    
  IF TODOS válidos:
  └─ ✅ OK: Permitir submit
```

**Pseudocódigo:**
```typescript
if (hasFotoregistro) {
  const requiredFields = [
    'fr1Width',
    'fr1Height',
    'fr1ReferenceHorizontal',
    'fr1ReferenceVertical',
    'fr1DistanceHorizontal',
    'fr1DistanceVertical'
  ];
  
  const missingFields = requiredFields.filter(f => !form[f]);
  
  if (missingFields.length > 0) {
    throw new ValidationError(`Campos requeridos: ${missingFields.join(', ')}`);
  }
}
```

---

## V-FR-9: Validación de Coherencia Geométrica

```
Campo: FR1 Position vs Rollo Boundaries
Tipo: Warning (no bloquea)

CÁLCULOS PREVIOS (E-2.1, E-2.2):
├─ X_FR1 = posición horizontal calculada
├─ Y_FR1 = posición vertical calculada
├─ Lámina Width = ancho del rollo
└─ Lámina Repetition = alto del rollo

VALIDACIONES:

1. FR1 Ancho no excede rollo:
   ├─ IF (X_FR1 + FR1_Width) > Lámina_Width:
   │  └─ ⚠️ WARNING: "FR1 ancho excede borde derecho"
   └─ ACCIÓN: Mostrar badge amarillo, no bloquea

2. FR1 Alto no excede rollo:
   ├─ IF (Y_FR1 + FR1_Height) > Lámina_Repetition:
   │  └─ ⚠️ WARNING: "FR1 alto excede borde inferior"
   └─ ACCIÓN: Mostrar badge amarillo, no bloquea

3. FR1 Posición X no negativa:
   ├─ IF X_FR1 < 0:
   │  └─ ⚠️ WARNING: "Posición X negativa - verificar referencias"
   └─ ACCIÓN: Mostrar badge amarillo

4. FR1 Posición Y no negativa:
   ├─ IF Y_FR1 < 0:
   │  └─ ⚠️ WARNING: "Posición Y negativa - verificar referencias"
   └─ ACCIÓN: Mostrar badge amarillo
```

**Pseudocódigo:**
```typescript
const validateGeometricCoherence = (fr1, lamina) => {
  const warnings = [];
  
  const xPos = calculateXPosition(fr1, lamina);
  const yPos = calculateYPosition(fr1, lamina);
  
  if (xPos + fr1.width > lamina.width) {
    warnings.push({
      type: 'geometric-x-overflow',
      message: 'FR1 ancho excede borde derecho del rollo',
      severity: 'warning'
    });
  }
  
  if (yPos + fr1.height > lamina.repetition) {
    warnings.push({
      type: 'geometric-y-overflow',
      message: 'FR1 alto excede borde inferior del rollo',
      severity: 'warning'
    });
  }
  
  if (xPos < 0) {
    warnings.push({
      type: 'geometric-x-negative',
      message: 'Posición X negativa',
      severity: 'warning'
    });
  }
  
  if (yPos < 0) {
    warnings.push({
      type: 'geometric-y-negative',
      message: 'Posición Y negativa',
      severity: 'warning'
    });
  }
  
  return warnings;
};
```

---

# 3. REGLAS DE NEGOCIO

## RB-FR-1: Visibilidad Exclusiva LÁMINA

```
REGLA: Fotoregistro SOLO es visible en LÁMINA

IMPLEMENTACIÓN:

IF envelope = "LÁMINA":
  ├─ Mostrar sección: "¿Desea agregar Fotoregistro?"
  ├─ Toggle visible: Sí/No
  └─ Permitir configuración FR1

ELSE IF envelope ∈ {BOLSA, POUCH}:
  ├─ OCULTAR completamente sección Fotoregistro
  ├─ NO renderizar componente
  └─ NO almacenar datos FR1

WHEN Usuario cambia Envoltura:
  ├─ IF cambio: LÁMINA → BOLSA:
  │  ├─ LIMPIAR todos los datos FR1 (set NULL)
  │  ├─ OCULTAR sección
  │  └─ NO guardar datos en formulario
  │
  └─ IF cambio: BOLSA → LÁMINA:
     ├─ Mostrar sección nuevamente
     ├─ Permitir reconfigurar FR1 (datos previos borrados)
     └─ FR1 es OPCIONAL (toggle default = No)
```

**Condición Formal:**
```
visibility(Fotoregistro) = isLaminaWrapping(envelope)
```

---

## RB-FR-2: FR1 Únicamente (No FR2)

```
RESTRICCIÓN: Sistema acepta SOLO 1 Fotoregistro (FR1)

❌ NO permitir:
  ├─ FR2 (segundo fotoregistro)
  ├─ Opción "¿Cuántos FR?" (solo tenía FR1/FR2)
  ├─ Múltiples fotoregistros en mismo proyecto
  └─ Selector de cantidad FR

✅ PERMITIR:
  ├─ UN fotoregistro (FR1) si hasFotoregistro = Sí
  └─ CERO fotoregistros si hasFotoregistro = No
```

---

## RB-FR-3: Obligatoriedad Condicional

```
REGLA: FR1 es OPCIONAL si hasFotoregistro seleccionado

LÓGICA:

IF hasFotoregistro = No:
  ├─ Sección FR1 OCULTA
  ├─ Campos NO renderizados
  ├─ Datos NO requeridos
  ├─ Datos LIMPIOS (NULL)
  └─ NO bloquea submit de proyecto

IF hasFotoregistro = Sí:
  ├─ Sección FR1 VISIBLE
  ├─ TODOS los 6 campos OBLIGATORIOS:
  │  ├─ fr1Width *
  │  ├─ fr1Height *
  │  ├─ fr1ReferenceHorizontal *
  │  ├─ fr1ReferenceVertical *
  │  ├─ fr1DistanceHorizontal *
  │  └─ fr1DistanceVertical *
  ├─ Validaciones activas (V-FR-2 a V-FR-7)
  └─ BLOQUEA submit si alguno falta
```

---

## RB-FR-4: Cálculo Automático de Márgenes

```
REGLA: Márgenes son CALCULADOS, no ingresados

CAMPOS EDITABLE:
├─ fr1Width ✏️
├─ fr1Height ✏️
├─ fr1ReferenceHorizontal ✏️
├─ fr1ReferenceVertical ✏️
├─ fr1DistanceHorizontal ✏️
└─ fr1DistanceVertical ✏️

CAMPOS READ-ONLY (CALCULADOS):
├─ fr1MarginLeft 🔒 (E-1.1)
├─ fr1MarginRight 🔒 (E-1.2)
├─ fr1MarginTop 🔒 (E-1.3)
└─ fr1MarginBottom 🔒 (E-1.4)

TRIGGER CÁLCULO: onChange en CUALQUIER campo editable
├─ Debounce: 300ms
├─ Actualizar todos 4 márgenes simultáneamente
├─ Redibujar gráfico SVG
└─ Mostrar nuevos valores
```

---

## RB-FR-5: Visualización Gráfica Interactiva

```
REGLA: Gráfico SVG actualiza automáticamente

COMPONENTES GRÁFICO:

1. Base Rectángulo (Rollo LÁMINA)
   ├─ Dimensiones: width × repetition
   ├─ Color: Gris claro (#F5F5F5)
   ├─ Borde: 2px solid #333
   └─ Etiqueta: "LÁMINA (W×R)"

2. FR1 Rectángulo (Posicionable)
   ├─ Dimensiones: fr1Width × fr1Height
   ├─ Posición: Calculada por E-2.1 y E-2.2
   ├─ Color: Azul (#4A90E2)
   ├─ Relleno: Semitransparente (alpha=0.6)
   └─ Etiqueta: "FR1 (W×H mm)"

3. Líneas de Referencia (Guías)
   ├─ Punteadas (stroke-dasharray: 4,4)
   ├─ Color: Gris (#CCCCCC)
   ├─ Opacity: 0.5
   └─ Indican: Alineación FR1 en rollo

4. Anotaciones de Márgenes
   ├─ Margen Left: valor en lado izquierdo
   ├─ Margen Right: valor en lado derecho
   ├─ Margen Top: valor en lado superior
   └─ Margen Bottom: valor en lado inferior

ACTUALIZACIÓN:
├─ Trigger: onChange en cualquier campo editable
├─ Debounce: 300ms (evitar re-renders excesivos)
├─ Animación: CSS transition 200ms
└─ Escala: 0.3 (1mm = 0.3px en pantalla)
```

---

## RB-FR-6: Limpieza de Datos (Envoltura Change)

```
REGLA: Cambiar envoltura limpia datos FR automáticamente

IMPLEMENTACIÓN:

onChange(envelope):
  IF envelope_anterior = "LÁMINA" AND envelope_nueva ≠ "LÁMINA":
    ├─ hasFotoregistro = false
    ├─ fr1Width = NULL
    ├─ fr1Height = NULL
    ├─ fr1ReferenceHorizontal = NULL
    ├─ fr1ReferenceVertical = NULL
    ├─ fr1DistanceHorizontal = NULL
    ├─ fr1DistanceVertical = NULL
    ├─ fr1MarginLeft = NULL
    ├─ fr1MarginRight = NULL
    ├─ fr1MarginTop = NULL
    ├─ fr1MarginBottom = NULL
    └─ OCULTAR sección Fotoregistro

ACCIÓN USUARIO:
└─ Sin confirmación (limpieza silenciosa)
   ⚠️ PERO: Mostrar toast/notification: "Fotoregistro limpiado (no compatible con BOLSA/POUCH)"
```

---

## RB-FR-7: Márgenes Deben Ser Coherentes

```
REGLA: Un margen por dirección máximo

VALIDACIÓN (WARNING ONLY):

IF MarginLeft > 0 AND MarginRight > 0:
  └─ ⚠️ WARNING: "Ambos márgenes horizontales > 0. ¿Verificar referencias?"
     ACCIÓN: No bloquea, solo aviso

IF MarginTop > 0 AND MarginBottom > 0:
  └─ ⚠️ WARNING: "Ambos márgenes verticales > 0. ¿Verificar referencias?"
     ACCIÓN: No bloquea, solo aviso

NOTA: Matemáticamente, según E-1, esto NO debería ocurrir
      (porque refH es exclusivo: LEFT o RIGHT, no ambos)
      Pero la validación existe para detectar bugs de cálculo
```

---

## RB-FR-8: Persistencia de Datos

```
REGLA: Datos FR1 persisten en projectStorage

GUARDAR (Save Project):
  IF hasFotoregistro = Sí AND validaciones OK:
    ├─ Guardar en projectStorage:
    │  ├─ fotoregistro.hasFotoregistro = true
    │  ├─ fotoregistro.fr1Width = [valor]
    │  ├─ fotoregistro.fr1Height = [valor]
    │  ├─ fotoregistro.fr1ReferenceHorizontal = [valor]
    │  ├─ fotoregistro.fr1ReferenceVertical = [valor]
    │  ├─ fotoregistro.fr1DistanceHorizontal = [valor]
    │  ├─ fotoregistro.fr1DistanceVertical = [valor]
    │  ├─ fotoregistro.fr1MarginLeft = [calculado]
    │  ├─ fotoregistro.fr1MarginRight = [calculado]
    │  ├─ fotoregistro.fr1MarginTop = [calculado]
    │  └─ fotoregistro.fr1MarginBottom = [calculado]
    └─ Mostrar: "✅ Proyecto guardado"

  IF hasFotoregistro = No:
    ├─ fotoregistro.hasFotoregistro = false
    ├─ Todos los demás campos = NULL (no guardar)
    └─ Mostrar: "✅ Proyecto guardado"

CARGAR (Load Project):
  IF projectStorage.fotoregistro.hasFotoregistro = true:
    ├─ Toggle: Mostrar "Sí" (habilitado)
    ├─ Rellenar todos los campos desde storage
    ├─ Recalcular márgenes (E-1)
    └─ Mostrar gráfico con datos previos

  IF projectStorage.fotoregistro.hasFotoregistro = false:
    ├─ Toggle: Mostrar "No" (deshabilitado)
    ├─ Ocultar sección FR1
    └─ Campos vacíos
```

---

# 4. MATRIZ DE VALIDACIONES

| Validación | Campo | Tipo | Rango | Requerido | Bloquea | Error Message |
|:---|:---|:---:|:---|:---:|:---:|:---|
| **V-FR-1** | hasFotoregistro | Boolean | Sí/No | ⚪ Opcional | ❌ No | Fotoregistro solo para LÁMINA |
| **V-FR-2** | fr1Width | Number | 1-9999 mm | ✅ Sí (si FR=Sí) | ✅ Sí | Ancho: 1-9999 mm |
| **V-FR-3** | fr1Height | Number | 1-9999 mm | ✅ Sí (si FR=Sí) | ✅ Sí | Alto: 1-9999 mm |
| **V-FR-4** | fr1RefHoriz | Enum | {Izq, Der} | ✅ Sí (si FR=Sí) | ✅ Sí | Referencia requerida |
| **V-FR-5** | fr1RefVert | Enum | {Arr, Aba} | ✅ Sí (si FR=Sí) | ✅ Sí | Referencia requerida |
| **V-FR-6** | fr1DistHoriz | Number | 0-9999 mm | ✅ Sí (si FR=Sí) | ✅ Sí | Distancia: 0-9999 mm |
| **V-FR-7** | fr1DistVert | Number | 0-9999 mm | ✅ Sí (si FR=Sí) | ✅ Sí | Distancia: 0-9999 mm |
| **V-FR-8** | All campos | Composite | - | ✅ Sí (si FR=Sí) | ✅ Sí | Campos faltantes |
| **V-FR-9** | Position XY | Geometric | - | ⚪ Opcional | ❌ No | ⚠️ Warning |

---

# 5. FLUJO DE VALIDACIÓN (DECISIÓN TREE)

```
START: User presses GUARDAR (Save)
  │
  ├─ [1] ¿Envelope = LÁMINA?
  │  ├─ NO → ❌ Ocultar Fotoregistro, SALTAR resto validaciones FR, Guardar sin FR
  │  │
  │  └─ SÍ → Continuar
  │     │
  │     ├─ [2] ¿hasFotoregistro = Sí?
  │     │  ├─ NO → Limpiar datos FR, Guardar sin FR ✅
  │     │  │
  │     │  └─ SÍ → Validar todos los campos
  │     │     │
  │     │     ├─ [3] ¿fr1Width válido? (1-9999)
  │     │     │  ├─ NO → ❌ ERROR: mostrar en campo, BLOQUEAR save
  │     │     │  └─ SÍ → Continuar
  │     │     │
  │     │     ├─ [4] ¿fr1Height válido? (1-9999)
  │     │     │  ├─ NO → ❌ ERROR: mostrar en campo, BLOQUEAR save
  │     │     │  └─ SÍ → Continuar
  │     │     │
  │     │     ├─ [5] ¿fr1RefHoriz seleccionado?
  │     │     │  ├─ NO → ❌ ERROR: mostrar en select, BLOQUEAR save
  │     │     │  └─ SÍ → Continuar
  │     │     │
  │     │     ├─ [6] ¿fr1RefVert seleccionado?
  │     │     │  ├─ NO → ❌ ERROR: mostrar en select, BLOQUEAR save
  │     │     │  └─ SÍ → Continuar
  │     │     │
  │     │     ├─ [7] ¿fr1DistHoriz válido? (0-9999)
  │     │     │  ├─ NO → ❌ ERROR: mostrar en campo, BLOQUEAR save
  │     │     │  └─ SÍ → Continuar
  │     │     │
  │     │     ├─ [8] ¿fr1DistVert válido? (0-9999)
  │     │     │  ├─ NO → ❌ ERROR: mostrar en campo, BLOQUEAR save
  │     │     │  └─ SÍ → Continuar
  │     │     │
  │     │     ├─ [9] Calcular márgenes (E-1)
  │     │     │  └─ Actualizar display read-only
  │     │     │
  │     │     ├─ [10] Calcular posiciones XY (E-2)
  │     │     │
  │     │     ├─ [11] ¿Coherencia geométrica? (V-FR-9)
  │     │     │  ├─ Warnings → ⚠️ Mostrar badges (no bloquea)
  │     │     │  └─ OK → Continuar
  │     │     │
  │     │     └─ [FINAL] ✅ TODOS OK → Guardar proyecto
  │     │        └─ Persiste datos en projectStorage
  │     │
  │     └─ END
  │
  └─ END VALIDACIONES
```

---

# 6. TABLA DE COMPORTAMIENTOS POR ESTADO

| Estado | Sección | FR1 Fields | Márgenes | Gráfico | Submit | Limpieza |
|:---|:---|:---:|:---:|:---:|:---:|:---:|
| **Envelope ≠ LÁMINA** | ❌ Hidden | - | - | - | ✅ Permitido | Auto (vacío) |
| **LÁMINA + FR=No** | ✅ Visible | ❌ Hidden | - | - | ✅ Permitido | Auto (NULL) |
| **LÁMINA + FR=Sí (vacío)** | ✅ Visible | ✅ Visible | ⚪ Pendiente | ⚪ Vacío | ❌ Bloqueado | Manual |
| **LÁMINA + FR=Sí (parcial)** | ✅ Visible | ✅ Visible | ⚪ Parcial | ⚪ Parcial | ❌ Bloqueado | Manual |
| **LÁMINA + FR=Sí (válido)** | ✅ Visible | ✅ Visible | ✅ Actualizado | ✅ Renderizado | ✅ Permitido | - |
| **LÁMINA + FR=Sí (warning)** | ✅ Visible | ✅ Visible | ✅ Actualizado | ✅ Renderizado | ✅ Permitido | ⚠️ Avisos |

---

# 7. PSEUDOCÓDIGO COMPLETO (Validación)

```typescript
function validateFotoregistro(form: ProjectForm, lamina: LaminaData): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];
  
  // [GUARD] Solo validar si es LÁMINA
  if (form.envelope !== 'LÁMINA') {
    return { isValid: true, errors: [], warnings: [] };
  }
  
  // [GUARD] Si FR deshabilitado, no validar campos
  if (!form.fotoregistro.hasFotoregistro) {
    // Limpiar datos
    form.fotoregistro.fr1Width = null;
    form.fotoregistro.fr1Height = null;
    form.fotoregistro.fr1ReferenceHorizontal = null;
    form.fotoregistro.fr1ReferenceVertical = null;
    form.fotoregistro.fr1DistanceHorizontal = null;
    form.fotoregistro.fr1DistanceVertical = null;
    return { isValid: true, errors: [], warnings: [] };
  }
  
  // [VALIDAR CAMPOS]
  const { fr1 } = form.fotoregistro;
  
  // V-FR-2: Width range
  if (!fr1.width || fr1.width < 1 || fr1.width > 9999) {
    errors.push({
      field: 'fr1Width',
      message: 'Ancho debe estar entre 1 y 9999 mm',
      severity: 'error'
    });
  }
  
  // V-FR-3: Height range
  if (!fr1.height || fr1.height < 1 || fr1.height > 9999) {
    errors.push({
      field: 'fr1Height',
      message: 'Alto debe estar entre 1 y 9999 mm',
      severity: 'error'
    });
  }
  
  // V-FR-4: Reference Horizontal
  if (!fr1.referenceHorizontal || !['LEFT', 'RIGHT'].includes(fr1.referenceHorizontal)) {
    errors.push({
      field: 'fr1ReferenceHorizontal',
      message: 'Referencia Horizontal es obligatoria',
      severity: 'error'
    });
  }
  
  // V-FR-5: Reference Vertical
  if (!fr1.referenceVertical || !['TOP', 'BOTTOM'].includes(fr1.referenceVertical)) {
    errors.push({
      field: 'fr1ReferenceVertical',
      message: 'Referencia Vertical es obligatoria',
      severity: 'error'
    });
  }
  
  // V-FR-6: Distance Horizontal
  if (fr1.distanceHorizontal === null || fr1.distanceHorizontal === undefined) {
    errors.push({
      field: 'fr1DistanceHorizontal',
      message: 'Distancia Horizontal es obligatoria',
      severity: 'error'
    });
  } else if (fr1.distanceHorizontal < 0 || fr1.distanceHorizontal > 9999) {
    errors.push({
      field: 'fr1DistanceHorizontal',
      message: 'Distancia debe estar entre 0 y 9999 mm',
      severity: 'error'
    });
  }
  
  // V-FR-7: Distance Vertical
  if (fr1.distanceVertical === null || fr1.distanceVertical === undefined) {
    errors.push({
      field: 'fr1DistanceVertical',
      message: 'Distancia Vertical es obligatoria',
      severity: 'error'
    });
  } else if (fr1.distanceVertical < 0 || fr1.distanceVertical > 9999) {
    errors.push({
      field: 'fr1DistanceVertical',
      message: 'Distancia debe estar entre 0 y 9999 mm',
      severity: 'error'
    });
  }
  
  // Si hay errores de validación, retornar ahora
  if (errors.length > 0) {
    return { isValid: false, errors, warnings };
  }
  
  // [CALCULAR MÁRGENES] (E-1)
  const margins = calculateMargins(
    fr1.referenceHorizontal,
    fr1.referenceVertical,
    fr1.distanceHorizontal,
    fr1.distanceVertical
  );
  
  form.fotoregistro.fr1MarginLeft = margins.left;
  form.fotoregistro.fr1MarginRight = margins.right;
  form.fotoregistro.fr1MarginTop = margins.top;
  form.fotoregistro.fr1MarginBottom = margins.bottom;
  
  // [CALCULAR POSICIONES] (E-2)
  const xPosition = calculateXPosition(
    fr1.referenceHorizontal,
    fr1.width,
    fr1.distanceHorizontal,
    lamina.width
  );
  
  const yPosition = calculateYPosition(
    fr1.referenceVertical,
    fr1.height,
    fr1.distanceVertical,
    lamina.repetition
  );
  
  // [VALIDAR COHERENCIA GEOMÉTRICA] (V-FR-9)
  if ((xPosition + fr1.width) > lamina.width) {
    warnings.push({
      field: 'fr1Position',
      message: 'FR1 ancho excede borde derecho del rollo',
      severity: 'warning'
    });
  }
  
  if ((yPosition + fr1.height) > lamina.repetition) {
    warnings.push({
      field: 'fr1Position',
      message: 'FR1 alto excede borde inferior del rollo',
      severity: 'warning'
    });
  }
  
  if (xPosition < 0) {
    warnings.push({
      field: 'fr1Position',
      message: 'Posición X negativa - verificar referencias',
      severity: 'warning'
    });
  }
  
  if (yPosition < 0) {
    warnings.push({
      field: 'fr1Position',
      message: 'Posición Y negativa - verificar referencias',
      severity: 'warning'
    });
  }
  
  // [RETORNAR RESULTADO]
  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}
```

---

# 8. RESUMEN DE ECUACIONES

| Ecuación | Fórmula | Uso |
|:---|:---|:---|
| **E-1.1** | MarginL = (refH=LEFT) ? distH : 0 | Margen izquierdo |
| **E-1.2** | MarginR = (refH=RIGHT) ? distH : 0 | Margen derecho |
| **E-1.3** | MarginT = (refV=TOP) ? distV : 0 | Margen superior |
| **E-1.4** | MarginB = (refV=BOTTOM) ? distV : 0 | Margen inferior |
| **E-2.1** | X = (refH=LEFT) ? distH : (W_lamina - W_fr1 - distH) | Posición X FR1 |
| **E-2.2** | Y = (refV=TOP) ? distV : (R_lamina - H_fr1 - distV) | Posición Y FR1 |

---

# 9. RESUMEN DE VALIDACIONES

| Validación | Tipo | Rango | Bloquea |
|:---|:---|:---|:---:|
| **V-FR-1** | Disponibilidad | LÁMINA solo | ❌ No |
| **V-FR-2** | Rango Width | 1-9999 mm | ✅ Sí |
| **V-FR-3** | Rango Height | 1-9999 mm | ✅ Sí |
| **V-FR-4** | Enum RefH | {Izq, Der} | ✅ Sí |
| **V-FR-5** | Enum RefV | {Arr, Aba} | ✅ Sí |
| **V-FR-6** | Rango DistH | 0-9999 mm | ✅ Sí |
| **V-FR-7** | Rango DistV | 0-9999 mm | ✅ Sí |
| **V-FR-8** | Compuesta | All required | ✅ Sí |
| **V-FR-9** | Geométrica | Boundaries | ❌ No (warning) |

---

# 10. RESUMEN DE REGLAS DE NEGOCIO

| Regla | Descripción | Enforcement |
|:---|:---|:---|
| **RB-FR-1** | Visibilidad LÁMINA solo | Condicional (IF envelope) |
| **RB-FR-2** | Solo 1 FR (no FR2) | UI (no opción múltiple) |
| **RB-FR-3** | FR1 opcional si toggle=Sí | Condicional (IF toggle) |
| **RB-FR-4** | Márgenes calculados auto | Sistema (E-1) |
| **RB-FR-5** | Gráfico interactivo | Sistema (re-render onChange) |
| **RB-FR-6** | Limpieza envoltura | Sistema (onChange) |
| **RB-FR-7** | Márgenes coherentes | Warning (no bloquea) |
| **RB-FR-8** | Persistencia datos | localStorage + projectStorage |

---

**📐 ECUACIONES, VALIDACIONES Y REGLAS FOTOREGISTRO COMPLETAS** ✅

**Total Elementos:**
- ✅ 6 Ecuaciones matemáticas
- ✅ 9 Validaciones (V-FR-1 a V-FR-9)
- ✅ 8 Reglas de Negocio (RB-FR-1 a RB-FR-8)
- ✅ Matriz de validaciones
- ✅ Árbol de decisión completo
- ✅ Pseudocódigo TypeScript
