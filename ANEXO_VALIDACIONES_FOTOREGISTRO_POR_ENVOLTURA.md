# 📋 ANEXO: VALIDACIONES FOTOREGISTRO POR ENVOLTURA

**Versión:** 1.0  
**Fecha:** 2026-08-10  
**Scope:** Detalles de validación por tipo de envoltura (LÁMINA, BOLSA, POUCH)  
**Nota:** Fotoregistro es EXCLUSIVO a LÁMINA

---

# 1. LÁMINA - VALIDACIONES FOTOREGISTRO

## 1.1 Contexto LÁMINA

```
TIPO DE ENVOLTURA: LÁMINA
DISPONIBILIDAD: Fotoregistro PERMITIDO ✅
CASUÍSTICAS APLICABLES:
├─ Lámina Genérica
├─ Lámina Tissue
└─ Lámina Food

CARACTERÍSTICAS GENERALES:
├─ Perímetro = 2 × (Width + Repetition)
├─ Rango Perímetro: 100-20000 mm
├─ Formato de sección: DISEÑO (Sección 2)
└─ Posición Fotoregistro: Paso 2 (Configuración de Formato)
```

---

## 1.2 Disponibilidad de Fotoregistro en LÁMINA

```
VALIDACIÓN: RF-LAMINA-FR-AVAILABILITY

CUANDO Usuario selecciona: Envoltura = "LÁMINA"
  ├─ Mostrar sección: "¿Desea agregar Fotoregistro?"
  ├─ Toggle: Sí / No
  ├─ DEFAULT: No (deshabilitado)
  └─ Permitir configuración FR1

CONDICIÓN FORMAL:
showFotoregistroSection() = (envelope === 'LÁMINA')

ACCIÓN: Renderizar componente <FotoregistroSection /> en ProductEditPage
```

---

## 1.3 Validaciones Específicas de LÁMINA

### V-LAMINA-FR-1: Toggle Habilitación

```
CAMPO: hasFotoregistro
TIPO: Boolean (Sí/No)
UBICACIÓN: Sección Fotoregistro (Paso 2 - Diseño)
DEFAULT: false (No)

LÓGICA:

IF User clica "Sí":
  ├─ Mostrar sección FR1 (7 campos input + 4 márgenes read-only)
  ├─ Marcar campos como OBLIGATORIOS
  ├─ Activar validaciones (V-LAMINA-FR-2 a V-LAMINA-FR-9)
  └─ Renderizar gráfico SVG

IF User clica "No":
  ├─ Ocultar sección FR1
  ├─ Limpiar datos FR1 (set NULL)
  ├─ Desactivar validaciones FR
  └─ Ocultar gráfico

VALIDACIÓN:
└─ ✅ SIEMPRE VÁLIDO (solo es trigger para mostrar/ocultar)

PSEUDOCÓDIGO:
```typescript
const handleFotoregistroToggle = (value: boolean) => {
  if (value) {
    // Habilitar FR1
    setShowFr1Section(true);
    setFr1Required(true);
  } else {
    // Deshabilitar FR1 + limpiar
    setShowFr1Section(false);
    setFr1Required(false);
    clearFr1Data(); // Set all fr1* to null
  }
};
```

---

### V-LAMINA-FR-2: Rango FR1 Width

```
CAMPO: fr1Width
TIPO: Number (input numérico)
UNIDAD: milímetros (mm)
RANGO VÁLIDO: 1 - 9999 mm
OBLIGATORIO: ✅ SÍ (si hasFotoregistro = Sí)
DEFAULT: vacío (null)

VALIDACIÓN:

1. REQUERIDO (si hasFotoregistro = Sí):
   IF fr1Width = NULL o vacío:
     ├─ ❌ ERROR
     ├─ Mensaje: "Ancho FR1 es obligatorio"
     ├─ Campo: rojo (#FF6B6B)
     ├─ Ubicación: debajo del input
     └─ BLOQUEA: submit del proyecto

2. RANGO MÍNIMO:
   IF fr1Width < 1:
     ├─ ❌ ERROR
     ├─ Mensaje: "Ancho debe ser mínimo 1 mm"
     ├─ Campo: rojo
     └─ BLOQUEA: submit

3. RANGO MÁXIMO:
   IF fr1Width > 9999:
     ├─ ❌ ERROR
     ├─ Mensaje: "Ancho debe ser máximo 9999 mm"
     ├─ Campo: rojo
     └─ BLOQUEA: submit

4. TIPO DE DATO:
   IF value = no-numeric (ej: "abc"):
     ├─ ❌ ERROR
     ├─ Mensaje: "Ancho debe ser un número"
     ├─ Campo: rojo
     └─ BLOQUEA: submit

VALIDACIÓN COMPUESTA:
IF hasFotoregistro = Sí AND (fr1Width < 1 OR fr1Width > 9999):
  └─ ❌ ERROR BLOCKING: "Ancho: 1-9999 mm"

TRIGGER: onChange (con debounce 300ms)

PSEUDOCÓDIGO:
```typescript
const validateFr1Width = (value: number | null): ValidationError | null => {
  if (!hasFotoregistro) return null; // No validar si FR deshabilitado
  
  if (value === null || value === undefined) {
    return {
      field: 'fr1Width',
      message: 'Ancho FR1 es obligatorio',
      severity: 'error',
      blocking: true
    };
  }
  
  if (isNaN(value)) {
    return {
      field: 'fr1Width',
      message: 'Ancho debe ser un número',
      severity: 'error',
      blocking: true
    };
  }
  
  if (value < 1) {
    return {
      field: 'fr1Width',
      message: 'Ancho debe ser mínimo 1 mm',
      severity: 'error',
      blocking: true
    };
  }
  
  if (value > 9999) {
    return {
      field: 'fr1Width',
      message: 'Ancho debe ser máximo 9999 mm',
      severity: 'error',
      blocking: true
    };
  }
  
  return null; // ✅ Válido
};
```

---

### V-LAMINA-FR-3: Rango FR1 Height

```
CAMPO: fr1Height
TIPO: Number (input numérico)
UNIDAD: milímetros (mm)
RANGO VÁLIDO: 1 - 9999 mm
OBLIGATORIO: ✅ SÍ (si hasFotoregistro = Sí)
DEFAULT: vacío (null)

VALIDACIÓN:

1. REQUERIDO (si hasFotoregistro = Sí):
   IF fr1Height = NULL o vacío:
     ├─ ❌ ERROR: "Alto FR1 es obligatorio"
     └─ BLOQUEA: submit

2. RANGO MÍNIMO:
   IF fr1Height < 1:
     ├─ ❌ ERROR: "Alto debe ser mínimo 1 mm"
     └─ BLOQUEA: submit

3. RANGO MÁXIMO:
   IF fr1Height > 9999:
     ├─ ❌ ERROR: "Alto debe ser máximo 9999 mm"
     └─ BLOQUEA: submit

VALIDACIÓN COMPUESTA:
IF hasFotoregistro = Sí AND (fr1Height < 1 OR fr1Height > 9999):
  └─ ❌ ERROR BLOCKING: "Alto: 1-9999 mm"

TRIGGER: onChange (con debounce 300ms)
```

---

### V-LAMINA-FR-4: Referencia Horizontal (Requerida)

```
CAMPO: fr1ReferenceHorizontal
TIPO: Select (dropdown)
OPCIONES: ["Izquierda", "Derecha"]
OBLIGATORIO: ✅ SÍ (si hasFotoregistro = Sí)
DEFAULT: "Izquierda"
VALOR INTERNO: "LEFT" | "RIGHT"

VALIDACIÓN:

1. REQUERIDO (si hasFotoregistro = Sí):
   IF fr1ReferenceHorizontal = NULL o no seleccionado:
     ├─ ❌ ERROR: "Referencia Horizontal es obligatoria"
     ├─ Select: borde rojo, background rojo claro
     └─ BLOQUEA: submit

2. VALOR VÁLIDO:
   IF fr1ReferenceHorizontal ∉ {LEFT, RIGHT}:
     ├─ ❌ ERROR: "Selecciona Izquierda o Derecha"
     └─ BLOQUEA: submit

3. TRIGGER DE CÁLCULO:
   onChange → Recalcular márgenes:
     ├─ Si selecciona "Izquierda": MarginLeft = distanceHorizontal, MarginRight = 0
     ├─ Si selecciona "Derecha": MarginLeft = 0, MarginRight = distanceHorizontal
     ├─ Actualizar gráfico SVG
     └─ Mostrar nuevos márgenes

PSEUDOCÓDIGO:
```typescript
const validateFr1RefHoriz = (value: 'LEFT' | 'RIGHT' | null): ValidationError | null => {
  if (!hasFotoregistro) return null;
  
  if (value === null || value === undefined) {
    return {
      field: 'fr1ReferenceHorizontal',
      message: 'Referencia Horizontal es obligatoria',
      severity: 'error',
      blocking: true
    };
  }
  
  if (!['LEFT', 'RIGHT'].includes(value)) {
    return {
      field: 'fr1ReferenceHorizontal',
      message: 'Selecciona Izquierda o Derecha',
      severity: 'error',
      blocking: true
    };
  }
  
  // TRIGGER: Recalcular márgenes
  recalculateMargins();
  updateVisualization();
  
  return null; // ✅ Válido
};
```

---

### V-LAMINA-FR-5: Referencia Vertical (Requerida)

```
CAMPO: fr1ReferenceVertical
TIPO: Select (dropdown)
OPCIONES: ["Arriba", "Abajo"]
OBLIGATORIO: ✅ SÍ (si hasFotoregistro = Sí)
DEFAULT: "Arriba"
VALOR INTERNO: "TOP" | "BOTTOM"

VALIDACIÓN:

1. REQUERIDO (si hasFotoregistro = Sí):
   IF fr1ReferenceVertical = NULL o no seleccionado:
     ├─ ❌ ERROR: "Referencia Vertical es obligatoria"
     └─ BLOQUEA: submit

2. VALOR VÁLIDO:
   IF fr1ReferenceVertical ∉ {TOP, BOTTOM}:
     ├─ ❌ ERROR: "Selecciona Arriba o Abajo"
     └─ BLOQUEA: submit

3. TRIGGER DE CÁLCULO:
   onChange → Recalcular márgenes:
     ├─ Si selecciona "Arriba": MarginTop = distanceVertical, MarginBottom = 0
     ├─ Si selecciona "Abajo": MarginTop = 0, MarginBottom = distanceVertical
     ├─ Actualizar gráfico SVG
     └─ Mostrar nuevos márgenes
```

---

### V-LAMINA-FR-6: Rango Distancia Horizontal

```
CAMPO: fr1DistanceHorizontal
TIPO: Number (input numérico)
UNIDAD: milímetros (mm)
RANGO VÁLIDO: 0 - 9999 mm
OBLIGATORIO: ✅ SÍ (si hasFotoregistro = Sí)
DEFAULT: vacío (null)
NOTA: 0 es permitido (FR1 puede tocar borde)

VALIDACIÓN:

1. REQUERIDO (si hasFotoregistro = Sí):
   IF fr1DistanceHorizontal = NULL o vacío:
     ├─ ❌ ERROR: "Distancia Horizontal es obligatoria"
     └─ BLOQUEA: submit

2. NO NEGATIVO:
   IF fr1DistanceHorizontal < 0:
     ├─ ❌ ERROR: "Distancia no puede ser negativa"
     └─ BLOQUEA: submit

3. RANGO MÁXIMO:
   IF fr1DistanceHorizontal > 9999:
     ├─ ❌ ERROR: "Distancia debe ser máximo 9999 mm"
     └─ BLOQUEA: submit

4. TRIGGER DE CÁLCULO:
   onChange → Recalcular márgenes:
     ├─ MarginLeft o MarginRight = fr1DistanceHorizontal (según referencia)
     ├─ Recalcular posición X (E-2.1)
     ├─ Actualizar gráfico SVG
     └─ Validar coherencia geométrica

VALIDACIÓN ESPECIAL:
IF fr1DistanceHorizontal = 0:
  ├─ ✅ PERMITIDO (no error)
  └─ ⚠️ OPCIONAL WARNING: "FR1 toca borde horizontal del rollo"
```

---

### V-LAMINA-FR-7: Rango Distancia Vertical

```
CAMPO: fr1DistanceVertical
TIPO: Number (input numérico)
UNIDAD: milímetros (mm)
RANGO VÁLIDO: 0 - 9999 mm
OBLIGATORIO: ✅ SÍ (si hasFotoregistro = Sí)
DEFAULT: vacío (null)
NOTA: 0 es permitido (FR1 puede tocar borde)

VALIDACIÓN:

1. REQUERIDO (si hasFotoregistro = Sí):
   IF fr1DistanceVertical = NULL o vacío:
     ├─ ❌ ERROR: "Distancia Vertical es obligatoria"
     └─ BLOQUEA: submit

2. NO NEGATIVO:
   IF fr1DistanceVertical < 0:
     ├─ ❌ ERROR: "Distancia no puede ser negativa"
     └─ BLOQUEA: submit

3. RANGO MÁXIMO:
   IF fr1DistanceVertical > 9999:
     ├─ ❌ ERROR: "Distancia debe ser máximo 9999 mm"
     └─ BLOQUEA: submit

4. TRIGGER DE CÁLCULO:
   onChange → Recalcular márgenes:
     ├─ MarginTop o MarginBottom = fr1DistanceVertical (según referencia)
     ├─ Recalcular posición Y (E-2.2)
     ├─ Actualizar gráfico SVG
     └─ Validar coherencia geométrica
```

---

### V-LAMINA-FR-8: Composición de Campos (ALL_OR_NOTHING)

```
VALIDACIÓN COMPUESTA: Todos los campos deben estar válidos simultáneamente

CAMPOS REQUERIDOS (cuando hasFotoregistro = Sí):
├─ fr1Width (V-LAMINA-FR-2) ✓
├─ fr1Height (V-LAMINA-FR-3) ✓
├─ fr1ReferenceHorizontal (V-LAMINA-FR-4) ✓
├─ fr1ReferenceVertical (V-LAMINA-FR-5) ✓
├─ fr1DistanceHorizontal (V-LAMINA-FR-6) ✓
└─ fr1DistanceVertical (V-LAMINA-FR-7) ✓

LÓGICA:

IF hasFotoregistro = Sí:
  ├─ Ejecutar validaciones individuales (V-LAMINA-FR-2 a V-LAMINA-FR-7)
  ├─ IF cualquier validación individual FALLA:
  │  ├─ ❌ ERROR: "Campos inválidos: [lista campos]"
  │  └─ BLOQUEA: submit del proyecto
  │
  └─ IF TODAS las validaciones PASAN:
     ├─ Calcular márgenes (E-1.1 a E-1.4)
     ├─ Calcular posiciones XY (E-2.1 a E-2.2)
     ├─ Validar coherencia geométrica (V-LAMINA-FR-9)
     └─ ✅ PERMITIR: submit del proyecto

PSEUDOCÓDIGO:
```typescript
const validateAllFr1Fields = (): boolean => {
  if (!hasFotoregistro) return true;
  
  const errors = [];
  
  const errWidth = validateFr1Width(form.fr1Width);
  if (errWidth) errors.push(errWidth);
  
  const errHeight = validateFr1Height(form.fr1Height);
  if (errHeight) errors.push(errHeight);
  
  const errRefH = validateFr1RefHoriz(form.fr1ReferenceHorizontal);
  if (errRefH) errors.push(errRefH);
  
  const errRefV = validateFr1RefVert(form.fr1ReferenceVertical);
  if (errRefV) errors.push(errRefV);
  
  const errDistH = validateFr1DistanceHorizontal(form.fr1DistanceHorizontal);
  if (errDistH) errors.push(errDistH);
  
  const errDistV = validateFr1DistanceVertical(form.fr1DistanceVertical);
  if (errDistV) errors.push(errDistV);
  
  if (errors.length > 0) {
    showErrors(errors);
    return false; // ❌ Bloquea submit
  }
  
  return true; // ✅ Permite submit
};
```

---

### V-LAMINA-FR-9: Coherencia Geométrica (Warnings Only)

```
VALIDACIÓN: Verificar que FR1 no se salga del rollo
TIPO: Warning (NO bloquea, solo aviso)
TRIGGER: Después de calcular márgenes y posiciones

CÁLCULOS NECESARIOS:
├─ Lámina Width (dato existente)
├─ Lámina Repetition (dato existente)
├─ X_FR1 = posición horizontal (E-2.1)
├─ Y_FR1 = posición vertical (E-2.2)
├─ fr1Width
└─ fr1Height

VALIDACIONES (WARNING):

1. FR1 Ancho excede borde derecho:
   IF (X_FR1 + fr1Width) > Lámina_Width:
     ├─ ⚠️ WARNING: "FR1 ancho excede borde derecho del rollo"
     ├─ Display: badge amarillo (#FFD700)
     └─ Acción: NO bloquea submit, solo aviso

2. FR1 Alto excede borde inferior:
   IF (Y_FR1 + fr1Height) > Lámina_Repetition:
     ├─ ⚠️ WARNING: "FR1 alto excede borde inferior del rollo"
     ├─ Display: badge amarillo
     └─ Acción: NO bloquea submit

3. Posición X negativa:
   IF X_FR1 < 0:
     ├─ ⚠️ WARNING: "Posición X negativa - verificar referencias"
     ├─ Display: badge amarillo
     └─ Acción: NO bloquea submit

4. Posición Y negativa:
   IF Y_FR1 < 0:
     ├─ ⚠️ WARNING: "Posición Y negativa - verificar referencias"
     ├─ Display: badge amarillo
     └─ Acción: NO bloquea submit

PSEUDOCÓDIGO:
```typescript
const validateGeometricCoherence = (): WarningList => {
  const warnings = [];
  
  const xPos = calculateXPosition(fr1RefHoriz, fr1Width, fr1DistHoriz, laminaWidth);
  const yPos = calculateYPosition(fr1RefVert, fr1Height, fr1DistVert, laminaRepetition);
  
  if ((xPos + fr1Width) > laminaWidth) {
    warnings.push({
      message: 'FR1 ancho excede borde derecho del rollo',
      severity: 'warning',
      blocking: false
    });
  }
  
  if ((yPos + fr1Height) > laminaRepetition) {
    warnings.push({
      message: 'FR1 alto excede borde inferior del rollo',
      severity: 'warning',
      blocking: false
    });
  }
  
  if (xPos < 0) {
    warnings.push({
      message: 'Posición X negativa - verificar referencias',
      severity: 'warning',
      blocking: false
    });
  }
  
  if (yPos < 0) {
    warnings.push({
      message: 'Posición Y negativa - verificar referencias',
      severity: 'warning',
      blocking: false
    });
  }
  
  return warnings;
};
```

---

## 1.4 Resumen de Validaciones LÁMINA

| Validación | Campo | Tipo | Rango | Obligatorio | Bloquea |
|:---|:---|:---:|:---|:---:|:---:|
| **V-LAMINA-FR-1** | hasFotoregistro | Boolean | Sí/No | ⚪ No | ❌ No |
| **V-LAMINA-FR-2** | fr1Width | Number | 1-9999 mm | ✅ Sí (si FR=Sí) | ✅ Sí |
| **V-LAMINA-FR-3** | fr1Height | Number | 1-9999 mm | ✅ Sí (si FR=Sí) | ✅ Sí |
| **V-LAMINA-FR-4** | fr1RefHoriz | Enum | {Izq, Der} | ✅ Sí (si FR=Sí) | ✅ Sí |
| **V-LAMINA-FR-5** | fr1RefVert | Enum | {Arr, Aba} | ✅ Sí (si FR=Sí) | ✅ Sí |
| **V-LAMINA-FR-6** | fr1DistHoriz | Number | 0-9999 mm | ✅ Sí (si FR=Sí) | ✅ Sí |
| **V-LAMINA-FR-7** | fr1DistVert | Number | 0-9999 mm | ✅ Sí (si FR=Sí) | ✅ Sí |
| **V-LAMINA-FR-8** | All campos | Composite | ALL required | ✅ Sí (si FR=Sí) | ✅ Sí |
| **V-LAMINA-FR-9** | Position XY | Geometric | Boundaries | ⚪ No | ❌ No (warning) |

---

# 2. BOLSA - VALIDACIONES FOTOREGISTRO

## 2.1 Contexto BOLSA

```
TIPO DE ENVOLTURA: BOLSA
DISPONIBILIDAD: Fotoregistro NO PERMITIDO ❌
CASUÍSTICAS APLICABLES:
├─ Bolsa Lateral Corte
├─ Bolsa Lateral Pestaña
├─ Bolsa Fondo
├─ Bolsa Wicket
└─ Bolsa Hojas

CARACTERÍSTICAS GENERALES:
├─ Perímetro = 2 × (Width + Length)
├─ Rango Perímetro: 100-10000 mm
├─ Accesorios: 7 tipos disponibles (max 3 totales)
└─ Fotoregistro: NO DISPONIBLE
```

---

## 2.2 Validación de No-Disponibilidad de Fotoregistro

### V-BOLSA-FR-1: Ocultar Fotoregistro (No Renderizar)

```
VALIDACIÓN: BLOQUEO DE UI

CUANDO User selecciona: Envoltura = "BOLSA"
  ├─ ❌ NO renderizar componente <FotoregistroSection />
  ├─ ❌ NO mostrar toggle "¿Desea agregar Fotoregistro?"
  ├─ ❌ NO mostrar sección FR1
  ├─ LIMPIAR cualquier dato FR1 anterior (si migraba de LÁMINA)
  └─ Si hay datos FR1 previos: mostrar toast "Fotoregistro limpiado"

CONDICIÓN FORMAL:
showFotoregistroSection() = (envelope !== 'BOLSA')

IMPLEMENTACIÓN:
```typescript
// En ProductEditPage.tsx, sección Diseño:

if (inheritedWrapping === 'BOLSA' || isBolsaWrapping(inheritedWrapping)) {
  return (
    // Mostrar campos de BOLSA
    // NO incluir <FotoregistroSection />
  );
}
```

---

### V-BOLSA-FR-2: Limpieza de Datos al Cambiar a BOLSA

```
VALIDACIÓN: LIMPIEZA AUTOMÁTICA

WHEN User cambia: LÁMINA → BOLSA
  ├─ Action 1: Ocultar sección Fotoregistro
  ├─ Action 2: Limpiar datos FR1 en memoria:
  │  ├─ hasFotoregistro = false
  │  ├─ fr1Width = null
  │  ├─ fr1Height = null
  │  ├─ fr1ReferenceHorizontal = null
  │  ├─ fr1ReferenceVertical = null
  │  ├─ fr1DistanceHorizontal = null
  │  ├─ fr1DistanceVertical = null
  │  ├─ fr1MarginLeft = null
  │  ├─ fr1MarginRight = null
  │  ├─ fr1MarginTop = null
  │  └─ fr1MarginBottom = null
  ├─ Action 3: NO guardar datos FR1 en projectStorage
  └─ Action 4: Mostrar toast/notification

MENSAJES:
├─ Tipo: "info"
├─ Texto: "Fotoregistro no está disponible para BOLSA. Datos limpiados."
├─ Duración: 3 segundos
└─ Posición: top-right

PSEUDOCÓDIGO:
```typescript
const handleEnvelopeChange = (newEnvelope: string) => {
  const oldEnvelope = formState.envelope;
  
  // Cambiar envoltura
  setFormState({ envelope: newEnvelope });
  
  // Si cambio de LÁMINA a BOLSA: limpiar FR
  if (oldEnvelope === 'LÁMINA' && newEnvelope === 'BOLSA') {
    clearFotoregistroData(); // Set all fr1* to null
    showNotification({
      type: 'info',
      message: 'Fotoregistro no está disponible para BOLSA. Datos limpiados.',
      duration: 3000
    });
  }
};

const clearFotoregistroData = () => {
  setFormState(prev => ({
    ...prev,
    fotoregistro: {
      hasFotoregistro: false,
      fr1Width: null,
      fr1Height: null,
      fr1ReferenceHorizontal: null,
      fr1ReferenceVertical: null,
      fr1DistanceHorizontal: null,
      fr1DistanceVertical: null,
      fr1MarginLeft: null,
      fr1MarginRight: null,
      fr1MarginTop: null,
      fr1MarginBottom: null,
    }
  }));
};
```

---

## 2.3 Validaciones Específicas de BOLSA (Respecto a FR)

### V-BOLSA-FR-3: Validación en Submit (No Requiere Fotoregistro)

```
VALIDACIÓN: IGNORAR FR EN BOLSA

WHEN User presiona GUARDAR (Save Project):
  ├─ [Paso 1] ¿Envelope = BOLSA?
  │  └─ SÍ → Continuar
  │
  ├─ [Paso 2] ¿Hay datos FR1 en memoria?
  │  ├─ SÍ → ❌ ERROR: "Se detectaron datos FR1 inconsistentes"
  │  │        (No debería ocurrir si limpieza funcionó bien)
  │  │        └─ Limpiar y re-intentar
  │  │
  │  └─ NO → Continuar sin validar FR
  │
  └─ [Paso Final] ✅ Guardar BOLSA sin datos FR

NOTA: Normalmente NO debería haber datos FR1 si UI estaba correcta
      Pero esta validación es un safeguard
```

---

## 2.4 Resumen de Validaciones BOLSA (Fotoregistro)

| Validación | Accción | Tipo | Resultado |
|:---|:---|:---|:---|
| **V-BOLSA-FR-1** | No renderizar sección FR | UI Block | ✅ No aparece |
| **V-BOLSA-FR-2** | Limpiar datos al cambiar | Data Clean | ✅ Datos NULL |
| **V-BOLSA-FR-3** | Ignorar FR en validación | Validation | ✅ Sin FR requerido |

```
RESUMEN BOLSA:
└─ Fotoregistro: ❌ NO DISPONIBLE
   ├─ UI: Completamente oculto
   ├─ Datos: Limpios (NULL)
   └─ Validación: Ignorado en submit
```

---

# 3. POUCH - VALIDACIONES FOTOREGISTRO

## 3.1 Contexto POUCH

```
TIPO DE ENVOLTURA: POUCH
DISPONIBILIDAD: Fotoregistro NO PERMITIDO ❌
CASUÍSTICAS APLICABLES (16 total):
├─ Stand Up K (2 sub-tipos)
├─ Stand Up Normal (2 sub-tipos)
├─ Doy Pack Red (2 sub-tipos con validaciones ESPECIALES)
├─ Doy Pack Cuad Propio (2 sub-tipos)
├─ Doy Pack Insertado (2 sub-tipos)
├─ Plano 2 Sellos (2 sub-tipos)
├─ Plano 3 Sellos (2 sub-tipos)
└─ Sello Central (4 variantes con microperforado)

CARACTERÍSTICAS GENERALES:
├─ Perímetro = 2 × (Width + Length)
├─ Rango Perímetro: 100-15000 mm (general) | 100-650 mm (Doy Pack SPECIAL)
├─ Accesorios: 3 tipos disponibles (max 3 totales)
├─ Doy Pack: Validaciones EXTREMADAMENTE RESTRICTIVAS
└─ Fotoregistro: NO DISPONIBLE
```

---

## 3.2 Validación de No-Disponibilidad de Fotoregistro

### V-POUCH-FR-1: Ocultar Fotoregistro (No Renderizar)

```
VALIDACIÓN: BLOQUEO DE UI

CUANDO User selecciona: Envoltura = "POUCH"
  ├─ ❌ NO renderizar componente <FotoregistroSection />
  ├─ ❌ NO mostrar toggle "¿Desea agregar Fotoregistro?"
  ├─ ❌ NO mostrar sección FR1
  ├─ LIMPIAR cualquier dato FR1 anterior (si migraba de LÁMINA)
  └─ Si hay datos FR1 previos: mostrar toast "Fotoregistro limpiado"

CONDICIÓN FORMAL:
showFotoregistroSection() = (envelope !== 'POUCH')

IMPLEMENTACIÓN:
```typescript
// En ProductEditPage.tsx, sección Diseño:

if (inheritedWrapping === 'POUCH' || isPouchWrapping(inheritedWrapping)) {
  return (
    // Mostrar campos de POUCH
    // NO incluir <FotoregistroSection />
  );
}
```

---

### V-POUCH-FR-2: Limpieza de Datos al Cambiar a POUCH

```
VALIDACIÓN: LIMPIEZA AUTOMÁTICA

WHEN User cambia: LÁMINA → POUCH
  ├─ Action 1: Ocultar sección Fotoregistro
  ├─ Action 2: Limpiar datos FR1 en memoria:
  │  ├─ hasFotoregistro = false
  │  ├─ fr1Width = null
  │  ├─ fr1Height = null
  │  ├─ fr1ReferenceHorizontal = null
  │  ├─ fr1ReferenceVertical = null
  │  ├─ fr1DistanceHorizontal = null
  │  ├─ fr1DistanceVertical = null
  │  ├─ fr1MarginLeft = null
  │  ├─ fr1MarginRight = null
  │  ├─ fr1MarginTop = null
  │  └─ fr1MarginBottom = null
  ├─ Action 3: NO guardar datos FR1 en projectStorage
  └─ Action 4: Mostrar toast/notification

MENSAJES:
├─ Tipo: "info"
├─ Texto: "Fotoregistro no está disponible para POUCH. Datos limpiados."
├─ Duración: 3 segundos
└─ Posición: top-right

PSEUDOCÓDIGO:
```typescript
const handleEnvelopeChange = (newEnvelope: string) => {
  const oldEnvelope = formState.envelope;
  
  // Cambiar envoltura
  setFormState({ envelope: newEnvelope });
  
  // Si cambio de LÁMINA a POUCH: limpiar FR
  if (oldEnvelope === 'LÁMINA' && newEnvelope === 'POUCH') {
    clearFotoregistroData(); // Set all fr1* to null
    showNotification({
      type: 'info',
      message: 'Fotoregistro no está disponible para POUCH. Datos limpiados.',
      duration: 3000
    });
  }
};
```

---

### V-POUCH-FR-3: Validación en Submit (No Requiere Fotoregistro)

```
VALIDACIÓN: IGNORAR FR EN POUCH

WHEN User presiona GUARDAR (Save Project):
  ├─ [Paso 1] ¿Envelope = POUCH?
  │  └─ SÍ → Continuar
  │
  ├─ [Paso 2] ¿Hay datos FR1 en memoria?
  │  ├─ SÍ → ❌ ERROR: "Se detectaron datos FR1 inconsistentes"
  │  │        (No debería ocurrir si limpieza funcionó bien)
  │  │        └─ Limpiar y re-intentar
  │  │
  │  └─ NO → Continuar sin validar FR
  │
  ├─ [Paso 3] Ejecutar validaciones POUCH (doy pack, wicket, etc.)
  │  └─ (Estas validaciones son INDEPENDIENTES de FR)
  │
  └─ [Paso Final] ✅ Guardar POUCH sin datos FR
```

---

## 3.3 Resumen de Validaciones POUCH (Fotoregistro)

| Validación | Acción | Tipo | Resultado |
|:---|:---|:---|:---|
| **V-POUCH-FR-1** | No renderizar sección FR | UI Block | ✅ No aparece |
| **V-POUCH-FR-2** | Limpiar datos al cambiar | Data Clean | ✅ Datos NULL |
| **V-POUCH-FR-3** | Ignorar FR en validación | Validation | ✅ Sin FR requerido |

```
RESUMEN POUCH:
└─ Fotoregistro: ❌ NO DISPONIBLE
   ├─ UI: Completamente oculto
   ├─ Datos: Limpios (NULL)
   └─ Validación: Ignorado en submit
```

---

# 4. MATRIZ COMPARATIVA: VALIDACIONES POR ENVOLTURA

## 4.1 Disponibilidad y UI

| Aspecto | LÁMINA | BOLSA | POUCH |
|:---|:---:|:---:|:---:|
| **Fotoregistro disponible** | ✅ SÍ | ❌ NO | ❌ NO |
| **Sección renderizada** | ✅ Sí | ❌ No | ❌ No |
| **Toggle mostrado** | ✅ Sí | ❌ No | ❌ No |
| **Campos FR1 editables** | ✅ (si toggle=Sí) | ❌ No | ❌ No |
| **Gráfico SVG** | ✅ (si toggle=Sí) | ❌ No | ❌ No |

---

## 4.2 Validaciones Requeridas

| Validación | LÁMINA | BOLSA | POUCH |
|:---|:---:|:---:|:---:|
| **V-FR-1: Toggle** | ✅ Sí | ❌ Skip | ❌ Skip |
| **V-FR-2: Width Range** | ✅ Sí (si toggle=Sí) | ❌ Skip | ❌ Skip |
| **V-FR-3: Height Range** | ✅ Sí (si toggle=Sí) | ❌ Skip | ❌ Skip |
| **V-FR-4: Ref Horiz** | ✅ Sí (si toggle=Sí) | ❌ Skip | ❌ Skip |
| **V-FR-5: Ref Vert** | ✅ Sí (si toggle=Sí) | ❌ Skip | ❌ Skip |
| **V-FR-6: Dist Horiz** | ✅ Sí (si toggle=Sí) | ❌ Skip | ❌ Skip |
| **V-FR-7: Dist Vert** | ✅ Sí (si toggle=Sí) | ❌ Skip | ❌ Skip |
| **V-FR-8: All Fields** | ✅ Sí (si toggle=Sí) | ❌ Skip | ❌ Skip |
| **V-FR-9: Geometric** | ⚠️ Warning | ❌ Skip | ❌ Skip |

---

## 4.3 Comportamiento al Cambiar Envoltura

| Escenario | Acción | FR Limpieza | Notification |
|:---|:---|:---:|:---|
| **LÁMINA → BOLSA** | Limpiar FR | ✅ SÍ | ✅ Toast info |
| **LÁMINA → POUCH** | Limpiar FR | ✅ SÍ | ✅ Toast info |
| **BOLSA → LÁMINA** | Mostrar FR | ⚪ - | ⚪ No (user puede reconfigurar) |
| **BOLSA → POUCH** | Mantener oculto | ✅ SÍ (ya estaba NULL) | ⚪ No |
| **POUCH → LÁMINA** | Mostrar FR | ⚪ - | ⚪ No (user puede reconfigurar) |
| **POUCH → BOLSA** | Mantener oculto | ✅ SÍ (ya estaba NULL) | ⚪ No |

---

## 4.4 Persistencia en Storage

| Envoltura | Guardar FR | Cargar FR | Comportamiento |
|:---|:---:|:---:|:---|
| **LÁMINA** | ✅ SÍ (si toggle=Sí) | ✅ SÍ | Persistir datos FR1 |
| **BOLSA** | ❌ NO | ❌ NO | Ignorar FR completamente |
| **POUCH** | ❌ NO | ❌ NO | Ignorar FR completamente |

---

# 5. ÁRBOL DE DECISIÓN: VALIDACIONES POR ENVOLTURA

```
START: User presiona GUARDAR (Save Project)
  │
  ├─ [1] ¿Qué tipo de Envoltura?
  │
  ├─ CASE "LÁMINA":
  │  │
  │  ├─ [2] ¿hasFotoregistro = Sí?
  │  │  ├─ SÍ → Ejecutar validaciones completas (V-LAMINA-FR-2 a V-LAMINA-FR-9)
  │  │  │        └─ Si error → ❌ BLOQUEAR submit
  │  │  │        └─ Si OK → Calcular márgenes, validar coherencia
  │  │  │
  │  │  └─ NO → Limpiar datos FR, continuar sin validar FR
  │  │
  │  └─ [FINAL] ✅ GUARDAR LÁMINA (con o sin FR)
  │
  ├─ CASE "BOLSA":
  │  │
  │  ├─ [2] ¿Hay datos FR1 en memoria?
  │  │  ├─ SÍ → ❌ ERROR: Limpiar y re-intentar
  │  │  │        (No debería ocurrir)
  │  │  └─ NO → Continuar
  │  │
  │  ├─ [FINAL] ✅ GUARDAR BOLSA (sin FR)
  │  └─ Validaciones BOLSA específicas (accesorios, wicket, etc.)
  │
  ├─ CASE "POUCH":
  │  │
  │  ├─ [2] ¿Hay datos FR1 en memoria?
  │  │  ├─ SÍ → ❌ ERROR: Limpiar y re-intentar
  │  │  │        (No debería ocurrir)
  │  │  └─ NO → Continuar
  │  │
  │  ├─ [FINAL] ✅ GUARDAR POUCH (sin FR)
  │  └─ Validaciones POUCH específicas (doy pack, microperforado, etc.)
  │
  └─ END
```

---

# 6. CHECKLIST DE IMPLEMENTACIÓN

## Para LÁMINA

- [ ] Renderizar <FotoregistroSection /> en ProductEditPage
- [ ] Toggle Sí/No para hasFotoregistro
- [ ] 6 campos input + 4 display read-only (márgenes)
- [ ] Validaciones V-LAMINA-FR-1 a V-LAMINA-FR-9
- [ ] Gráfico SVG interactivo
- [ ] Cálculo automático de márgenes (E-1)
- [ ] Cálculo de posiciones XY (E-2)
- [ ] Warnings geométricos (V-LAMINA-FR-9)
- [ ] Persistencia en projectStorage

## Para BOLSA

- [ ] ❌ NO renderizar <FotoregistroSection />
- [ ] Implementar V-BOLSA-FR-2 (limpieza al cambiar)
- [ ] Mostrar toast cuando se limpia FR
- [ ] Verificar que no hay datos FR1 en submit

## Para POUCH

- [ ] ❌ NO renderizar <FotoregistroSection />
- [ ] Implementar V-POUCH-FR-2 (limpieza al cambiar)
- [ ] Mostrar toast cuando se limpia FR
- [ ] Verificar que no hay datos FR1 en submit

---

**📋 ANEXO: VALIDACIONES FOTOREGISTRO POR ENVOLTURA COMPLETO** ✅

**Resumen:**
- ✅ LÁMINA: 9 validaciones (V-LAMINA-FR-1 a V-LAMINA-FR-9)
- ✅ BOLSA: 3 validaciones (UI block + limpieza + ignorar)
- ✅ POUCH: 3 validaciones (UI block + limpieza + ignorar)
- ✅ Matrices comparativas
- ✅ Árbol de decisión
- ✅ Checklist implementación

**Enfoque:** LÁMINA = complejo + detallado, BOLSA/POUCH = simple + bloqueado
