# 🎯 HU DETALLADO INTEGRADO - 3 Formatos (LÁMINA, BOLSA, POUCH)

**Versión:** 3.0  
**Fecha:** 2026-08-10  
**Story Points:** 50 (13 LÁMINA + 16 BOLSA + 21 POUCH)  

---

## 📋 Tabla de Contenidos

1. [Requisitos Funcionales Integrados](#requisitos-funcionales-integrados)
2. [Campos con Imagen/Gráficos](#campos-con-imagengráficos)
3. [Modales y Acciones](#modales-y-acciones)
4. [Cálculos Detallados](#cálculos-detallados)
5. [Condicionales Complejas](#condicionales-complejas)
6. [Ejemplos Prácticos](#ejemplos-prácticos)
7. [Validaciones](#validaciones)
8. [Matriz UI/Componentes](#matriz-uicomponentes)

---

# SECCIÓN 1: REQUISITOS FUNCIONALES INTEGRADOS

## RF-1: Selección de Envoltura (Nivel 0 - CRÍTICO)

**Descripción:** Usuario selecciona el tipo de envoltura principal

**Componentes UI:**
```
┌─────────────────────────────────────────────┐
│ Seleccionar Tipo de Envoltura * (OBLIGATORIO)│
│─────────────────────────────────────────────│
│ ☐ LÁMINA                                    │
│   └─ Imagen: /assets/envolturas/lamina.png │
│                                              │
│ ☐ BOLSA                                     │
│   └─ Imagen: /assets/envolturas/bolsa.png  │
│                                              │
│ ☐ POUCH                                     │
│   └─ Imagen: /assets/envolturas/pouch.png  │
└─────────────────────────────────────────────┘
```

**Comportamiento:**
```javascript
// CONDICIONAL COMPLEJA 1: Cambiar envoltura limpia dependientes
IF envoltura = "LÁMINA" THEN
  ├─ Mostrar: tipoFormatoLamina (Genérica/Tissue/Food)
  ├─ Mostrar: width, repetition (NO length, anchoFuelle)
  ├─ Ocultar: tipoSelloBolsa, acabadoBolsa
  ├─ Ocultar: tipoFormatoPouch, tipoStandUpPouch
  └─ Limpiar: todos los campos de BOLSA y POUCH

ELSE IF envoltura = "BOLSA" THEN
  ├─ Mostrar: tipoFormatoBolsa (Bolsa/Wicket/Hojas)
  ├─ Mostrar: width, length, anchoFuelle
  ├─ Ocultar: repetition
  ├─ Ocultar: tipoFormatoPouch
  └─ Limpiar: todos los campos de LÁMINA y POUCH

ELSE IF envoltura = "POUCH" THEN
  ├─ Mostrar: tipoFormatoPouch (StandUp/Plano/SelloCentral/SelloFuelle)
  ├─ Mostrar: width, length, anchoFuelle
  ├─ Ocultar: repetition
  ├─ Ocultar: tipoFormatoBolsa
  └─ Limpiar: todos los campos de LÁMINA y BOLSA
```

---

## RF-2: Cálculo de Perímetro (CRÍTICO - TRANSVERSAL)

**Descripción:** Calcular perímetro automáticamente según envoltura

**Fórmulas por Tipo:**

### LÁMINA
```
Perímetro = 2 × (width + repetition)

Ejemplo:
├─ width = 500 mm
├─ repetition = 800 mm
└─ Perímetro = 2 × (500 + 800) = 2600 mm

Rango válido: 100 - 20000 mm
Estado: Validado ✅
```

### BOLSA
```
Perímetro = 2 × (width + length)

Ejemplo:
├─ width = 200 mm
├─ length = 350 mm
└─ Perímetro = 2 × (200 + 350) = 1100 mm

Rango válido: 100 - 10000 mm
Estado: Validado ✅
```

### POUCH (General)
```
Perímetro = 2 × (width + length)

Ejemplo:
├─ width = 250 mm
├─ length = 400 mm
└─ Perímetro = 2 × (250 + 400) = 1300 mm

Rango válido: 100 - 15000 mm
Estado: Validado ✅
```

### POUCH Doy Pack (ESPECIAL)
```
Perímetro = 2 × (width + length)
PERO rangos son MÁS RESTRICTIVOS

Ejemplo:
├─ width = 150 mm (validar: 80-230)
├─ length = 200 mm (validar: 134-340)
└─ Perímetro = 2 × (150 + 200) = 700 mm

Rango válido: 100 - 650 mm ⚠️ (MUCHO MÁS RESTRICTIVO)
Estado: Validado ✅
```

**Implementación (TypeScript):**

```typescript
const calculatePerimeter = (
  width: number,
  length: number | null,
  repetition: number | null,
  format: 'lamina' | 'bolsa' | 'pouch',
  isDoyPack: boolean = false
): { perimeter: number; isValid: boolean; range: [number, number] } => {
  
  let perimeter = 0;
  let range: [number, number] = [100, 15000];
  
  // Cálculo según formato
  if (format === 'lamina') {
    perimeter = 2 * (width + (repetition || 0));
    range = [100, 20000];
  } else if (format === 'bolsa' || format === 'pouch') {
    perimeter = 2 * (width + (length || 0));
    range = format === 'bolsa' ? [100, 10000] : [100, 15000];
  }
  
  // Validación especial Doy Pack
  if (isDoyPack) {
    range = [100, 650];
  }
  
  const isValid = perimeter >= range[0] && perimeter <= range[1];
  
  return { perimeter, isValid, range };
};
```

**UI Component:**

```jsx
<div className="perimeter-section">
  <label>Perímetro (mm) *</label>
  <input 
    type="number" 
    value={perimeter} 
    disabled={true}  // READ-ONLY ✨
    className={perimeter_status === 'Validado' ? 'valid' : 'invalid'}
  />
  <span className={perimeter_status === 'Validado' ? 'badge-green' : 'badge-red'}>
    {perimeter_status}
  </span>
  <small>Rango permitido: {minPerimeter}-{maxPerimeter} mm</small>
</div>
```

---

## RF-3: Validación de Dimensiones (CRÍTICO - TRANSVERSAL)

**Descripción:** Validar que las dimensiones cumplan rangos específicos

**Validaciones por Tipo:**

### LÁMINA
```
Width:
├─ Rango: 1-9999 mm
├─ Validación: onChange
├─ Error: "Ancho debe estar entre 1 y 9999 mm"
└─ Bloquea: submit

Repetition:
├─ Rango: 1-9999 mm
├─ Validación: onChange
├─ Error: "Repetición debe estar entre 1 y 9999 mm"
└─ Bloquea: submit
```

### BOLSA
```
Width:
├─ Rango: 1-3000 mm
├─ Validación: onChange
├─ Error: "Ancho BOLSA debe estar entre 1 y 3000 mm"
└─ Bloquea: submit

Length:
├─ Rango: 1-3000 mm
├─ Validación: onChange
├─ Error: "Largo BOLSA debe estar entre 1 y 3000 mm"
└─ Bloquea: submit

Ancho Fuelle (si Fuelle = Sí):
├─ Rango: 0-500 mm
├─ Validación: onChange
├─ Error: "Ancho Fuelle debe estar entre 0 y 500 mm"
└─ Bloquea: submit
```

### POUCH (General)
```
Width:
├─ Rango: 1-500 mm
├─ Validación: onChange
├─ Error: "Ancho POUCH debe estar entre 1 y 500 mm"
└─ Bloquea: submit

Length:
├─ Rango: 1-500 mm
├─ Validación: onChange
├─ Error: "Largo POUCH debe estar entre 1 y 500 mm"
└─ Bloquea: submit

Ancho Fuelle:
├─ Rango: 0-500 mm
├─ Validación: onChange
├─ Error: "Ancho Fuelle debe estar entre 0 y 500 mm"
└─ Bloquea: submit
```

### POUCH Doy Pack (ESPECIAL ⚠️)
```
Width:
├─ Rango: 80-230 mm ⚠️ (MÁS RESTRICTIVO)
├─ Validación: onChange
├─ Error: "Ancho Doy Pack DEBE estar entre 80-230 mm"
└─ Bloquea: submit

Length:
├─ Rango: 134-340 mm ⚠️ (MÁS RESTRICTIVO)
├─ Validación: onChange
├─ Error: "Largo Doy Pack DEBE estar entre 134-340 mm"
└─ Bloquea: submit

Ancho Fuelle:
├─ Rango: 0-3 mm ⚠️ (MUCHO MÁS RESTRICTIVO)
├─ Validación: onChange
├─ Error: "Ancho Fuelle Doy Pack DEBE estar entre 0-3 mm"
└─ Bloquea: submit
```

---

## RF-4: Validación de Perímetro (CRÍTICO - TRANSVERSAL)

**Descripción:** Validar que perímetro calculado esté en rango permitido

**Validaciones:**

```javascript
// CONDICIONAL COMPLEJA 2: Validar perímetro
IF Perímetro < min OR Perímetro > max THEN
  ├─ perimeterValidationStatus = "Rechazado" 🔴
  ├─ Mostrar error: "Perímetro {valor} mm fuera de rango ({min}-{max})"
  ├─ Campo rojo (visual feedback)
  ├─ Bloquear submit (user cannot save)
  └─ Mostrar sugerencia: "Revise dimensiones width y length"

ELSE IF Perímetro >= min AND Perímetro <= max THEN
  ├─ perimeterValidationStatus = "Validado" ✅
  ├─ Campo verde (visual feedback)
  ├─ Permitir submit
  └─ Sin mensaje de error
```

---

# SECCIÓN 2: CAMPOS CON IMAGEN/GRÁFICOS

## Campos con Imagen (Display only)

```html
<!-- Envoltura Selection (RF-1) -->
<div class="wrapping-selector">
  <div class="wrapping-option lamina">
    <img src="/assets/envolturas/lamina.png" alt="Lámina">
    <label>LÁMINA</label>
  </div>
  
  <div class="wrapping-option bolsa">
    <img src="/assets/envolturas/bolsa.png" alt="Bolsa">
    <label>BOLSA</label>
  </div>
  
  <div class="wrapping-option pouch">
    <img src="/assets/envolturas/pouch.png" alt="Pouch">
    <label>POUCH</label>
  </div>
</div>

<!-- Direction Selector - Sentido de Bobinado (LÁMINA only) -->
<div class="direction-selector">
  <label>Sentido de Bobinado *</label>
  <div class="direction-grid">
    <img src="/assets/directions/dir1.svg" alt="Dirección 1">
    <img src="/assets/directions/dir2.svg" alt="Dirección 2">
    <!-- ... más 6 direcciones -->
  </div>
</div>

<!-- Pouch Family Selection -->
<div class="pouch-family-selector">
  <img src="/assets/pouch/standup.png" alt="Stand Up">
  <img src="/assets/pouch/plano.png" alt="Plano">
  <img src="/assets/pouch/sello-central.png" alt="Sello Central">
  <img src="/assets/pouch/sello-fuelle.png" alt="Sello Fuelle">
</div>
```

## Campos con Gráficos (Visual Representation)

```html
<!-- Perímetro Calculado - Mostrar gráfico de validación -->
<div class="perimeter-visual">
  <label>Perímetro Calculado *</label>
  <input type="number" value={perimeter} disabled />
  
  <!-- GRÁFICO 1: Barra de validación -->
  <div class="validation-bar">
    <div class="range-min">{minPerimeter}</div>
    <div class="range-track">
      <div 
        class={`value-indicator ${isValid ? 'valid' : 'invalid'}`}
        style={{left: `${(perimeter / maxPerimeter) * 100}%`}}
      >
        {perimeter} mm
      </div>
    </div>
    <div class="range-max">{maxPerimeter}</div>
  </div>
  
  <span className={isValid ? 'badge-valid' : 'badge-invalid'}>
    {isValid ? 'Validado ✅' : 'Rechazado ❌'}
  </span>
</div>

<!-- GRÁFICO 2: Comparativa de perímetros (si usuario ingresa múltiples) -->
<svg class="perimeter-chart" width="400" height="200">
  <!-- Renderizar barras comparativas de perímetros -->
  <!-- X-axis: Tipo de envoltura (LAMINA, BOLSA, POUCH)  -->
  <!-- Y-axis: Perímetro (mm)  -->
</svg>

<!-- GRÁFICO 3: Estructura visual POUCH Doy Pack -->
<div class="doypack-visualization">
  <svg>
    <!-- Dibujar forma redonda o cuadrada -->
    <!-- Mostrar fuelle (0-3mm) visualizado -->
    <!-- Mostrar width y length como dimensiones -->
  </svg>
</div>

<!-- GRÁFICO 4: Fotoregistro (LÁMINA) - Visualización de márgenes -->
<div class="photoregister-visual">
  <svg class="fr-diagram">
    <!-- Dibujar rectángulo representando la lámina (width × repetition) -->
    <!-- Dibujar FR1 como rectángulo inner -->
    <!-- Mostrar márgenes (fr1MarginTop, fr1MarginBottom, etc) -->
    <!-- Si FR2 → mostrar segundo rectángulo -->
  </svg>
</div>
```

---

# SECCIÓN 3: MODALES Y ACCIONES

## Modales que se Abren desde ProductEditPage

### Modal 1: Seleccionar Estructura de Materiales

```
Trigger Button:
├─ Texto: "🔧 Editar Estructura" 
├─ Ubicación: Paso 2 (Estructura)
├─ Color: Blue (#667eea)
└─ OnClick → MaterialsEditModal

Modal Content:
├─ Título: "Editar Estructura de Capas"
├─ Contenido:
│  ├─ Layer 1 (Obligatorio)
│  │  ├─ Material Group (dropdown)
│  │  ├─ Material (dropdown - depende de grupo)
│  │  └─ Micron (input)
│  ├─ Layer 2 (si Bilaminado+)
│  ├─ Layer 3 (si Trilaminado+)
│  └─ Layer 4 (si Tetralaminado)
│
├─ Botones:
│  ├─ "Aplicar" → Guarda cambios en form
│  └─ "Cancelar" → Cierra sin cambios
│
└─ Validaciones:
   ├─ Material no puede repetirse en capas
   └─ Micron debe estar en rango válido
```

### Modal 2: Validación de Dimensiones (Bloqueador)

```
Trigger:
├─ Automático cuando: User intenta submit con dimensiones inválidas
├─ OnSubmit → validateDimensions() → retorna error

Modal Content:
├─ Icono: ❌ Rojo
├─ Título: "Dimensiones Inválidas"
├─ Mensaje: 
│  "Los siguientes campos no cumplen los rangos requeridos:
│   • Width: debe estar entre {min}-{max} mm (ingresó: {value})"
│
├─ Sugerencia:
│  "Revise las dimensiones e intente nuevamente"
│
└─ Botón:
   └─ "Entendido" → Cierra modal, user vuelve a form
```

### Modal 3: Validación de Perímetro (Bloqueador)

```
Trigger:
├─ Automático cuando: perímetro calculado está fuera de rango
├─ OnPerimeterChange → validatePerimeter() → retorna error

Modal Content:
├─ Icono: ⚠️ Amarillo/Rojo
├─ Título: "Perímetro Inválido"
├─ Mensaje:
│  "Perímetro {valor} mm está fuera del rango permitido:
│   Rango válido: {min}-{max} mm
│   Tipo de envoltura: {type}"
│
├─ Análisis:
│  "Esto ocurrió porque:
│   • Width ({width}) + Length ({length}) = Perímetro ({perimeter})"
│
├─ Sugerencia:
│  "Para un perímetro válido, intente:
│   • Width: {suggestedWidth}
│   • Length: {suggestedLength}"
│
└─ Botones:
   ├─ "Aplicar Sugerencia" → Auto-rellena dimensiones
   └─ "Revisar Manualmente" → Cierra y user edita
```

### Modal 4: Seleccionar Accesorios (BOLSA/POUCH)

```
Trigger Button:
├─ Texto: "➕ Agregar Accesorio"
├─ Ubicación: Sección Accesorios
├─ Deshabilitado: SI accesories.length >= 3
└─ OnClick → AccessoriesSelectionModal

Modal Content:
├─ Título: "Agregar Accesorio ({count}/3)"
├─ Opciones (depende de tipo):
│  
│  BOLSA Accesorios Producto:
│  ├─ ☐ Asa Troquelada
│  │  └─ SubCampos: tipoAsa, colorAsa, formaAsa
│  └─ ☐ Refuerzo
│     └─ SubCampos: espesor, ancho
│  
│  BOLSA Accesorios Internos:
│  ├─ ☐ Corte Angular
│  ├─ ☐ Esquinas Redondas
│  ├─ ☐ Muesca
│  ├─ ☐ Perforación
│  └─ ☐ Pre-Corte
│  
│  POUCH Accesorios:
│  ├─ ☐ Zipper
│  │  └─ SubCampos: zipperType, distancia
│  ├─ ☐ Valve
│  │  └─ SubCampos: valveType, distancia
│  └─ ☐ Tin-Tie
│
└─ Botones:
   ├─ "Agregar" → Añade a lista
   └─ "Cancelar" → Cierra sin cambios
```

### Modal 5: Fotoregistro (LÁMINA ONLY)

```
Trigger:
├─ Automático cuando: hasPhotoregister1 = "Sí"
├─ OnChange → Muestra/Oculta campos FR

Modal Content (if triggered):
├─ Título: "Configurar Fotoregistro"
├─ FR1 (Obligatorio si hasPhotoregister1 = Sí):
│  ├─ fr1Width * (input)
│  ├─ fr1Height * (input)
│  ├─ Referencia Horizontal: Right/Left
│  ├─ Referencia Vertical: Top/Bottom
│  ├─ Distancia Horizontal (mm)
│  ├─ Distancia Vertical (mm)
│  └─ Márgenes Calculados (READ-ONLY):
│     ├─ fr1MarginLeft
│     ├─ fr1MarginRight
│     ├─ fr1MarginTop
│     └─ fr1MarginBottom
│
├─ IF countFotoregistros = 2:
│  └─ FR2 (Condicional):
│     ├─ Modo: Automático / Manual
│     ├─ Si Automático:
│     │  └─ Heredar dimensiones de FR1
│     └─ Si Manual:
│        ├─ fr2Width, fr2Height
│        └─ Márgenes (editables)
│
└─ Botones:
   ├─ "Guardar FR" → Guarda en form
   └─ "Cancelar" → Cierra sin cambios
```

---

# SECCIÓN 4: CÁLCULOS DETALLADOS

## Cálculo 1: Perímetro (Transversal)

```typescript
// ==================== PERÍMETRO ====================

const calculatePerimeter = (params: {
  width: number;
  length?: number;
  repetition?: number;
  envoltura: 'lamina' | 'bolsa' | 'pouch';
  isDoyPack?: boolean;
}): { value: number; min: number; max: number; status: 'valid' | 'invalid' } => {
  
  const { width, length, repetition, envoltura, isDoyPack } = params;
  
  let perimeter = 0;
  let range = { min: 100, max: 15000 };
  
  // Calcular según envoltura
  switch (envoltura) {
    case 'lamina':
      perimeter = 2 * (width + (repetition || 0));
      range = { min: 100, max: 20000 };
      break;
      
    case 'bolsa':
      perimeter = 2 * (width + (length || 0));
      range = { min: 100, max: 10000 };
      break;
      
    case 'pouch':
      perimeter = 2 * (width + (length || 0));
      range = isDoyPack 
        ? { min: 100, max: 650 }
        : { min: 100, max: 15000 };
      break;
  }
  
  return {
    value: perimeter,
    min: range.min,
    max: range.max,
    status: (perimeter >= range.min && perimeter <= range.max) ? 'valid' : 'invalid'
  };
};

// TRIGGER: onChange para width o length/repetition
const handleDimensionChange = (field: string, value: number) => {
  updateField(field, value);
  
  // Recalcular perímetro
  const perimeter = calculatePerimeter({
    width: form.width,
    length: form.length,
    repetition: form.repetition,
    envoltura: getEnveltura(),
    isDoyPack: isDoyPackPouch()
  });
  
  updateField('perimeterMm', perimeter.value.toString());
  updateField('perimeterValidationStatus', perimeter.status === 'valid' ? 'Validado' : 'Rechazado');
  
  // Mostrar error si está inválido
  if (perimeter.status === 'invalid') {
    setErrors(prev => ({
      ...prev,
      perimeterMm: `Perímetro ${perimeter.value} mm fuera de rango (${perimeter.min}-${perimeter.max})`
    }));
  } else {
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors.perimeterMm;
      return newErrors;
    });
  }
};
```

## Cálculo 2: Ancho Total (POUCH Sello Central)

```typescript
// ==================== ANCHO TOTAL (POUCH SELLO CENTRAL) ====================

const calculateTotalWidth = (
  anchoSelloAleta: number | string,
  selloAnchoTransversal: number | string
): number => {
  const a1 = parseFloat(String(anchoSelloAleta)) || 0;
  const a2 = parseFloat(String(selloAnchoTransversal)) || 0;
  return a1 + a2;
};

// TRIGGER: onChange para anchoSelloAleta o selloAnchoTransversal
const handleSelloDimensionChange = (field: string, value: string) => {
  updateField(field, value);
  
  // Solo calcular si es Sello Central
  if (form.tipoFormatoPouch === 'SelloCentral') {
    const totalWidth = calculateTotalWidth(
      form.anchoSelloAleta,
      form.selloAnchoTransversal
    );
    
    updateField('anchoTotalCalculado', totalWidth.toString());
  }
};
```

## Cálculo 3: Márgenes Fotoregistro (LÁMINA)

```typescript
// ==================== MÁRGENES FOTOREGISTRO ====================

interface MarginResult {
  marginLeft: number;
  marginRight: number;
  marginTop: number;
  marginBottom: number;
}

const calculateMargins = (params: {
  referenceHorizontal: 'left' | 'right';
  referenceVertical: 'top' | 'bottom';
  distanceHorizontal: number;
  distanceVertical: number;
}): MarginResult => {
  
  const { referenceHorizontal, referenceVertical, distanceHorizontal, distanceVertical } = params;
  
  return {
    marginLeft: referenceHorizontal === 'left' ? distanceHorizontal : 0,
    marginRight: referenceHorizontal === 'right' ? distanceHorizontal : 0,
    marginTop: referenceVertical === 'top' ? distanceVertical : 0,
    marginBottom: referenceVertical === 'bottom' ? distanceVertical : 0
  };
};

// TRIGGER: onChange para cualquier parámetro de referencia/distancia
const handleFotoregistroChange = (field: string, value: any) => {
  updateField(field, value);
  
  // Recalcular márgenes FR1
  const margins = calculateMargins({
    referenceHorizontal: form.fr1ReferenceHorizontal,
    referenceVertical: form.fr1ReferenceVertical,
    distanceHorizontal: parseFloat(form.fr1DistanceHorizontal) || 0,
    distanceVertical: parseFloat(form.fr1DistanceVertical) || 0
  });
  
  updateField('fr1MarginLeft', margins.marginLeft.toString());
  updateField('fr1MarginRight', margins.marginRight.toString());
  updateField('fr1MarginTop', margins.marginTop.toString());
  updateField('fr1MarginBottom', margins.marginBottom.toString());
};
```

---

# SECCIÓN 5: CONDICIONALES COMPLEJAS

## Condicional 1: Cascada de Formato POUCH

```javascript
// CONDICIONAL COMPLEJA 1: Cascada POUCH
IF tipoFormatoPouch = "StandUp" THEN
  ├─ Mostrar: tipoStandUpPouch (SelloK, Normal, DoyPack)
  │
  ├─ IF tipoStandUpPouch = "DoyPack" THEN
  │  ├─ Mostrar: formaDoyPackPouch (Redonda, Cuadrada)
  │  ├─ Mostrar: tipoFuelleStandUpPouch (Propio, Insertado)
  │  ├─ VALIDACIONES ESPECIALES:
  │  │  ├─ width: 80-230 mm (NO 1-500)
  │  │  ├─ length: 134-340 mm (NO 1-500)
  │  │  ├─ anchoFuelle: 0-3 mm (NO 0-500)
  │  │  └─ Perímetro: 100-650 mm (NO 100-15000)
  │  └─ Generar blueprintFormat: "POUCH STAND UP\DOY PACK {BASE}\FUELLE {TIPO}"
  │
  ├─ ELSE IF tipoStandUpPouch = "SelloK" OR "Normal" THEN
  │  ├─ Ocultar: formaDoyPackPouch
  │  ├─ Ocultar: tipoFuelleStandUpPouch
  │  ├─ VALIDACIONES ESTÁNDAR:
  │  │  ├─ width: 1-500 mm
  │  │  ├─ length: 1-500 mm
  │  │  ├─ anchoFuelle: 0-500 mm
  │  │  └─ Perímetro: 100-15000 mm
  │  └─ Generar blueprintFormat: "POUCH STAND UP\{TIPO}\FUELLE PROPIO"

ELSE IF tipoFormatoPouch = "Plano" THEN
  ├─ Ocultar: tipoStandUpPouch, formaDoyPackPouch, tipoFuelleStandUpPouch
  ├─ Mostrar: cantidadSellosPouchPlano (DOS, TRES)
  │
  ├─ IF cantidadSellosPouchPlano = "TRES" THEN
  │  ├─ Mostrar: anchoSelloLateral (opcional)
  │  └─ Generar blueprintFormat: "POUCH PLANO\TRES SELLOS"
  │
  ├─ ELSE IF cantidadSellosPouchPlano = "DOS" THEN
  │  ├─ Ocultar: anchoSelloLateral
  │  └─ Generar blueprintFormat: "POUCH PLANO\DOS SELLOS"
  │
  └─ VALIDACIONES ESTÁNDAR para width, length, anchoFuelle

ELSE IF tipoFormatoPouch = "SelloCentral" THEN
  ├─ Ocultar: tipoStandUpPouch, cantidadSellosPouchPlano
  ├─ Mostrar: materialSelloCentralPouch (PE_PE_PE, Aleta, Otro)
  ├─ Mostrar: tieneFuelleSelloCentralPouch (Sí, No)
  │
  ├─ IF materialSelloCentralPouch = "PE_PE_PE" AND tieneFuelleSelloCentralPouch = "Sí" THEN
  │  ├─ MOSTRAR: Microperforado section
  │  │  ├─ hasMicroperforado (Sí/No)
  │  │  ├─ SI Sí:
  │  │  │  ├─ ladoAleta (Derecho/Izquierdo)
  │  │  │  ├─ tipoMicroperforado (Total/Parcial)
  │  │  │  ├─ separacionPuasAleta
  │  │  │  └─ distanciaLadoAleta
  │  │  └─ SI No: Ocultar todos los campos
  │  └─ Generar blueprintFormat: "POUCH C/SELLO CENTRAL\TIPO ALETA\CON FUELLE (PE-PE/PE)"
  │
  ├─ ELSE IF tieneFuelleSelloCentralPouch = "Sí" THEN
  │  ├─ Mostrar: anchoFuelleCerrado (opcional)
  │  ├─ OCULTAR: Microperforado section
  │  └─ Generar blueprintFormat basado en material
  │
  ├─ ELSE tieneFuelleSelloCentralPouch = "No" THEN
  │  ├─ OCULTAR: anchoFuelleCerrado
  │  ├─ OCULTAR: Microperforado section
  │  └─ Generar blueprintFormat basado en material
  │
  └─ MOSTRAR: Especificaciones Sello (opcional)
     ├─ anchoSelloAleta (10/12/15 mm)
     ├─ selloAnchoTransversal
     └─ Cálculo: anchoTotalCalculado = anchoSelloAleta + selloAnchoTransversal

ELSE IF tipoFormatoPouch = "SelloFuelle" THEN
  ├─ Ocultar: todo anterior
  ├─ Mostrar: tipoSelloFuellePouch (Tipo4-1, Tipo1-1)
  └─ Generar blueprintFormat: "POUCH C/SELLO EN FUELLE\{TIPO}\FUELLE PROPIO"
```

## Condicional 2: Validación de Dimensiones

```javascript
// CONDICIONAL COMPLEJA 2: Validar Dimensiones
IF hasErrors = true THEN
  ├─ Mostrar: Error messages en campos
  ├─ Colorear campos en RED
  ├─ BLOQUEAR: Botón "Guardar"
  ├─ MOSTRAR: Mensaje general "Revise los campos marcados"
  └─ IF user intenta submit:
     └─ ABRIR: Modal de Validación de Dimensiones

ELSE IF hasErrors = false THEN
  ├─ Ocultar: Error messages
  ├─ Colorear campos en GREEN
  ├─ HABILITAR: Botón "Guardar"
  └─ IF user hace submit:
     └─ Proceder a updateProjectRecord()
```

## Condicional 3: Fotoregistro (LÁMINA ONLY)

```javascript
// CONDICIONAL COMPLEJA 3: Fotoregistro
IF envoltura = "LÁMINA" THEN
  ├─ MOSTRAR: Sección "Datos de Fotoregistro"
  ├─ Mostrar: hasPhotoregister1 (Sí/No/Sin responder)
  │
  ├─ IF hasPhotoregister1 = "Sí" THEN
  │  ├─ MOSTRAR: FR1 section
  │  │  ├─ fr1Width * (input)
  │  │  ├─ fr1Height * (input)
  │  │  ├─ referencia horizontal/vertical
  │  │  ├─ distancia horizontal/vertical
  │  │  └─ Márgenes calculados (READ-ONLY)
  │  │
  │  ├─ Mostrar: countFotoregistros (1 o 2)
  │  │
  │  └─ IF countFotoregistros = 2 THEN
  │     ├─ MOSTRAR: FR2 section
  │     ├─ Modo: Automático / Manual
  │     └─ SI Manual: editable FR2 dimensions
  │
  ├─ ELSE IF hasPhotoregister1 = "No" THEN
  │  └─ LIMPIAR: Todos los campos FR (si había previos)
  │
  └─ ELSE IF hasPhotoregister1 = "Sin responder" THEN
     └─ OCULTAR: FR1 y FR2 sections

ELSE (BOLSA o POUCH) THEN
  └─ OCULTAR: Sección "Datos de Fotoregistro" completamente
```

---

# SECCIÓN 6: EJEMPLOS PRÁCTICOS

## Ejemplo 1: LÁMINA Genérica con Fotoregistro

```
Entrada del usuario:
├─ Envoltura: LÁMINA
├─ Tipo: Genérica
├─ Width: 500 mm
├─ Repetition: 800 mm
├─ Core Material: Cartón [SI]
├─ Core Diameter: 76 mm
├─ External Diameter: 152 mm
├─ Sentido Bobinado: Opción 3
├─ ¿Tiene Fotoregistro?: Sí
│  ├─ FR1 Width: 100 mm
│  ├─ FR1 Height: 80 mm
│  ├─ Referencia: Right/Bottom
│  └─ Distancia: 20mm / 15mm
└─ ¿Cuántos FR?: 2 (Automático)

Cálculos automáticos:
├─ Perímetro = 2 × (500 + 800) = 2600 mm ✅ (dentro 100-20000)
├─ perimeterValidationStatus = "Validado"
├─ FR1 Márgenes:
│  ├─ marginLeft = 0
│  ├─ marginRight = 20
│  ├─ marginTop = 0
│  └─ marginBottom = 15
└─ FR2 (Automático):
   ├─ Dimensiones = FR1 (100 × 80)
   └─ Márgenes = Simétricos

Resultado:
├─ blueprintFormat: "GENERICA"
├─ perimeterMm: 2600
├─ perimeterValidationStatus: "Validado" ✅
└─ Proyecto se puede guardar ✅
```

## Ejemplo 2: POUCH Doy Pack Redondo (Validación Fallida)

```
Entrada del usuario:
├─ Envoltura: POUCH
├─ Tipo: Stand Up
├─ Sub-tipo: Doy Pack
├─ Base: Redonda
├─ Fuelle: Propio
├─ Width: 300 mm ⚠️ (DEBE ser 80-230)
├─ Length: 150 mm ✅ (dentro 134-340)
└─ Ancho Fuelle: 2 mm ✅ (dentro 0-3)

Validación:
├─ Width = 300 mm
│  └─ ERROR: ❌ "Ancho Doy Pack DEBE estar entre 80-230 mm"
│  └─ ACCIÓN: Campo RED, error message visible
│
├─ Perímetro = 2 × (300 + 150) = 900 mm
│  └─ ERROR: ❌ "Perímetro 900 mm fuera de rango (100-650)"
│  └─ ACCIÓN: Campo RED, error message visible
│
├─ perimeterValidationStatus = "Rechazado"
│  └─ BADGE: RED "Rechazado ❌"
│
└─ Botón "Guardar": DESHABILITADO
   └─ Usuario no puede hacer submit

Sugerencia Modal (on submit attempt):
├─ Título: "Dimensiones Inválidas"
├─ Mensaje:
│  "Los siguientes campos no cumplen los rangos requeridos:
│   • Width: debe estar entre 80-230 mm (ingresó: 300)
│   • Perímetro: 900 mm fuera de rango (100-650)"
│
└─ Acciones:
   ├─ "Entendido" → Cierra modal, user vuelve a form
   └─ User edita: width = 200, perimet = 700mm ✅
```

## Ejemplo 3: POUCH Sello Central PE-PE/PE con Microperforado

```
Entrada del usuario:
├─ Envoltura: POUCH
├─ Tipo: Sello Central
├─ Material: PE-PE/PE
├─ ¿Tiene Fuelle?: Sí
├─ Width: 250 mm
├─ Length: 350 mm
├─ Ancho Fuelle: 80 mm
├─ Ancho Sello Aleta: 12 mm
├─ Sello Ancho Transversal: 30 mm
├─ ¿Tiene Microperforado?: Sí
│  ├─ Lado Aleta: Derecho
│  ├─ Tipo Microperforado: Total
│  ├─ Separación Puas: 2mm
│  └─ Distancia Lado Aleta: 50mm
└─ Accesorios: Zipper (String), Valve (Degasificadora)

Cálculos automáticos:
├─ Perímetro = 2 × (250 + 350) = 1200 mm ✅
├─ perimeterValidationStatus = "Validado"
├─ Ancho Total = 12 + 30 = 42 mm ✅
└─ blueprintFormat = "POUCH C/SELLO CENTRAL\TIPO ALETA\CON FUELLE (PE-PE/PE)"

Proyecto se puede guardar ✅
```

---

# SECCIÓN 7: VALIDACIONES

## Validación 1: Dimensiones

```typescript
const validateDimensions = (form: ProjectEditFormData): ValidationErrors => {
  const errors: ValidationErrors = {};
  const envoltura = getEnveltura(form);
  
  // LÁMINA
  if (envoltura === 'LAMINA') {
    if (!form.width || parseFloat(form.width) <= 0 || parseFloat(form.width) > 9999) {
      errors.width = 'Ancho debe estar entre 1 y 9999 mm';
    }
    if (!form.repetition || parseFloat(form.repetition) <= 0 || parseFloat(form.repetition) > 9999) {
      errors.repetition = 'Repetición debe estar entre 1 y 9999 mm';
    }
  }
  
  // BOLSA
  if (envoltura === 'BOLSA') {
    if (!form.width || parseFloat(form.width) <= 0 || parseFloat(form.width) > 3000) {
      errors.width = 'Ancho BOLSA debe estar entre 1 y 3000 mm';
    }
    if (!form.length || parseFloat(form.length) <= 0 || parseFloat(form.length) > 3000) {
      errors.length = 'Largo BOLSA debe estar entre 1 y 3000 mm';
    }
    if (form.tieneFuelleBolsa === 'Sí') {
      if (!form.anchoFuelle || parseFloat(form.anchoFuelle) < 0 || parseFloat(form.anchoFuelle) > 500) {
        errors.anchoFuelle = 'Ancho Fuelle BOLSA debe estar entre 0 y 500 mm';
      }
    }
  }
  
  // POUCH
  if (envoltura === 'POUCH') {
    const isDoyPack = isDoyPackPouch(form);
    
    const widthRange = isDoyPack ? { min: 80, max: 230 } : { min: 1, max: 500 };
    const lengthRange = isDoyPack ? { min: 134, max: 340 } : { min: 1, max: 500 };
    const fuelleRange = isDoyPack ? { min: 0, max: 3 } : { min: 0, max: 500 };
    
    if (!form.width || parseFloat(form.width) < widthRange.min || parseFloat(form.width) > widthRange.max) {
      const msg = isDoyPack 
        ? `Ancho Doy Pack DEBE estar entre ${widthRange.min}-${widthRange.max} mm`
        : `Ancho POUCH debe estar entre ${widthRange.min}-${widthRange.max} mm`;
      errors.width = msg;
    }
    
    if (!form.length || parseFloat(form.length) < lengthRange.min || parseFloat(form.length) > lengthRange.max) {
      const msg = isDoyPack
        ? `Largo Doy Pack DEBE estar entre ${lengthRange.min}-${lengthRange.max} mm`
        : `Largo POUCH debe estar entre ${lengthRange.min}-${lengthRange.max} mm`;
      errors.length = msg;
    }
    
    if (!form.anchoFuelle || parseFloat(form.anchoFuelle) < fuelleRange.min || parseFloat(form.anchoFuelle) > fuelleRange.max) {
      const msg = isDoyPack
        ? `Ancho Fuelle Doy Pack DEBE estar entre ${fuelleRange.min}-${fuelleRange.max} mm`
        : `Ancho Fuelle POUCH debe estar entre ${fuelleRange.min}-${fuelleRange.max} mm`;
      errors.anchoFuelle = msg;
    }
  }
  
  return errors;
};
```

---

# SECCIÓN 8: MATRIZ UI/COMPONENTES

## Tabla de Componentes por Sección

| Sección | Component | Props | Validación | Tipo |
|:---|:---|:---|:---|:---|
| Envoltura | ImageSelector | images, values | required | Radio |
| Tipo (LAMINA) | Select | options=[Genérica,Tissue,Food] | required | Dropdown |
| Width | TextInput | min, max, unit=mm | dynamic range | Number |
| Length | TextInput | min, max, unit=mm | dynamic range | Number |
| Repetition | TextInput | min:1, max:9999 | range | Number |
| Perímetro | TextInput | readonly=true, status badge | auto-calc | Display |
| Core Material | Select | options=[SI], disabled=no | [SI] catalog | Dropdown |
| Fotoregistro | Section | visible if LAMINA | conditional | Accordion |
| FR1 Márgenes | Display | readonly | calculated | Visual |
| Microperforado | Section | visible if PE-PE/PE+Fuelle | conditional | Accordion |
| Accesorios | Modal | max 3, type-specific | constraint | Button + Modal |
| Sentido Bobinado | ImageGrid | 8 options | required | Radio Grid |

---

**Documento Completo - HU Detallado Integrado v3.0** ✅

**50 Story Points Total** | **Cálculos, Condicionales y Ejemplos Completos**
