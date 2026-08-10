# 🎯 HU: Configuración Dinámica de Formatos POUCH

**Versión:** 1.0  
**Estado:** En Desarrollo  
**Story Points:** 21 (XL - Muy Complejo)  
**Prioridad:** ALTA  
**Asignado a:** Equipo Frontend  

---

## 📋 Descripción General

El usuario debe poder seleccionar un formato POUCH mediante un árbol jerárquico de decisiones condicionales que se habilitan progresivamente según la selección anterior. Cada rama del árbol lleva a combinaciones únicas de campos y accesorios editables, con validaciones específicas por formato.

**Objetivo:** Proporcionar una UI intuitiva que guíe al usuario a través de un árbol de decisiones sin abrumarle con demasiadas opciones simultáneamente.

---

## 🎨 Diseño del Árbol de Decisiones

```
POUCH (tipoFormatoPouch)
│
├─ STAND UP POUCH
│  ├─ Sello K          → POUCH STAND UP\TIPO K\FUELLE PROPIO
│  ├─ Normal           → POUCH STAND UP\NORMAL\FUELLE PROPIO
│  └─ Doy Pack         → selecciona Base + Tipo Fuelle
│     ├─ Redondo       → selecciona Tipo Fuelle
│     │  ├─ Fuelle Propio    → POUCH STAND UP\DOY PACK REDONDO\FUELLE PROPIO
│     │  └─ Fuelle Insertado → POUCH STAND UP\DOY PACK REDONDO\FUELLE INSERTADO
│     └─ Cuadrado      → selecciona Tipo Fuelle
│        ├─ Fuelle Propio    → POUCH STAND UP\DOY PACK CUADRADO\FUELLE PROPIO
│        └─ Fuelle Insertado → POUCH STAND UP\DOY PACK CUADRADO\FUELLE INSERTADO
│
├─ POUCH PLANO
│  ├─ Dos Sellos   → POUCH PLANO\DOS SELLOS
│  └─ Tres Sellos  → POUCH PLANO\TRES SELLOS
│
├─ POUCH C/SELLO CENTRAL
│  ├─ Material: selecciona Material + Tiene Fuelle
│  │  ├─ PE-PE/PE
│  │  │  ├─ Con Fuelle    → POUCH C/SELLO CENTRAL\TIPO ALETA\CON FUELLE (PE-PE/PE)
│  │  │  └─ Sin Fuelle    → POUCH C/SELLO CENTRAL\TIPO ALETA\SIN FUELLE (PE-PE/PE)
│  │  ├─ Aleta
│  │  │  ├─ Con Fuelle    → POUCH C/SELLO CENTRAL\TIPO ALETA\CON FUELLE
│  │  │  └─ Sin Fuelle    → POUCH C/SELLO CENTRAL\TIPO ALETA\SIN FUELLE
│  │  └─ Otro Material
│  │     ├─ Con Fuelle    → [POUCH C/SELLO CENTRAL\...\CON FUELLE (OTRO)]
│  │     └─ Sin Fuelle    → [POUCH C/SELLO CENTRAL\...\SIN FUELLE (OTRO)]
│
└─ POUCH C/SELLO EN FUELLE
   ├─ Tipo 4-1  → POUCH C/SELLO EN FUELLE\TIPO 4-1\FUELLE PROPIO
   └─ Tipo 1-1  → POUCH C/SELLO EN FUELLE\TIPO 1-1\FUELLE PROPIO
```

---

## 📌 Requisitos Funcionales

### RF-1: Selección de Familia POUCH
**Descripción:** El usuario puede elegir entre 4 familias principales de POUCH.

**Criterios:**
- Campo: `tipoFormatoPouch` (Select)
- Opciones:
  - "Stand Up Pouch"
  - "Pouch Plano"
  - "Pouch con Sello Central"
  - "Pouch con Sello en Fuelle"
- Estado: **OBLIGATORIO**
- Efecto: Habilita campos de subdivisión según la familia seleccionada

**Validación:**
```typescript
if (!form.tipoFormatoPouch || form.tipoFormatoPouch === "") {
  errors.tipoFormatoPouch = "Selecciona una familia de POUCH";
}
```

---

### RF-2: Subdivisión Stand Up Pouch
**Descripción:** Para Stand Up Pouch, el usuario selecciona el tipo de configuración superior.

**Criterios:**
- Campo: `tipoStandUpPouch` (Select)
- Visible si: `tipoFormatoPouch === "Stand Up Pouch"`
- Opciones:
  - "Sello K" (TIPO K)
  - "Normal"
  - "Doy Pack"
- Estado: **OBLIGATORIO si tipoFormatoPouch = "Stand Up Pouch"**
- Efecto:
  - Si "Sello K" o "Normal": genera blueprintFormat final
  - Si "Doy Pack": habilita `formaDoyPackPouch` y `tipoFuelleStandUpPouch`

---

### RF-3: Configuración Doy Pack
**Descripción:** Para Stand Up Doy Pack, el usuario selecciona la base del Doy Pack y el tipo de fuelle.

**Criterios:**
- Campo A: `formaDoyPackPouch` (Select)
  - Visible si: `tipoStandUpPouch === "Doy Pack"`
  - Opciones: "Redondo" / "Cuadrado"
  - Estado: **OBLIGATORIO**

- Campo B: `tipoFuelleStandUpPouch` (Select)
  - Visible si: `tipoStandUpPouch === "Doy Pack"`
  - Opciones: "Fuelle Propio" / "Fuelle Insertado"
  - Estado: **OBLIGATORIO**

- Efecto: Genera blueprintFormat en función de ambas selecciones
  ```
  POUCH STAND UP\DOY PACK [REDONDO|CUADRADO]\[FUELLE PROPIO|INSERTADO]
  ```

**Validaciones especiales para Doy Pack:**
```typescript
if (tipoStandUpPouch === "Doy Pack") {
  // width: 80-230 mm
  if (parseNumberInput(width) < 80 || parseNumberInput(width) > 230) {
    errors.width = "Ancho debe estar entre 80-230 mm para Doy Pack";
  }
  
  // length: 134-340 mm
  if (parseNumberInput(length) < 134 || parseNumberInput(length) > 340) {
    errors.length = "Largo debe estar entre 134-340 mm para Doy Pack";
  }
  
  // anchoFuelle: 0-3 mm
  if (parseNumberInput(anchoFuelle) < 0 || parseNumberInput(anchoFuelle) > 3) {
    errors.anchoFuelle = "Ancho fuelle debe estar entre 0-3 mm para Doy Pack";
  }
}
```

---

### RF-4: Pouch Plano - Cantidad de Sellos
**Descripción:** Para Pouch Plano, el usuario selecciona si tiene 2 o 3 sellos.

**Criterios:**
- Campo: `cantidadSellosPouchPlano` (Select)
- Visible si: `tipoFormatoPouch === "Pouch Plano"`
- Opciones: "Dos sellos" / "Tres sellos"
- Estado: **OBLIGATORIO si tipoFormatoPouch = "Pouch Plano"**
- Efecto:
  - Si "Dos sellos": genera `POUCH PLANO\DOS SELLOS`
  - Si "Tres sellos": genera `POUCH PLANO\TRES SELLOS`
    - Habilita campo adicional: `anchoSelloLateral`

---

### RF-5: Pouch Sello Central - Material
**Descripción:** Para Pouch con Sello Central, el usuario selecciona el material del sello.

**Criterios:**
- Campo A: `materialSelloCentralPouch` (Select)
  - Visible si: `tipoFormatoPouch === "Pouch con Sello Central"`
  - Opciones: "PE-PE/PE" / "Aleta" / "Otro material"
  - Estado: **OBLIGATORIO**

- Campo B: `tieneFuelleSelloCentralPouch` (Select)
  - Visible si: `tipoFormatoPouch === "Pouch con Sello Central"`
  - Opciones: "Sí" / "No"
  - Estado: **OBLIGATORIO**

- Efecto: Genera blueprintFormat y habilita campos específicos según material + fuelle

---

### RF-6: Configuración Sello Central PE-PE/PE
**Descripción:** Cuando se selecciona PE-PE/PE, se habilitan campos adicionales.

**Criterios:**
- Visible si: `materialSelloCentralPouch === "PE-PE/PE"`

**Campos habilitos:**
1. `anchoSelloAleta` (Select): 10 / 12 / 15 mm
2. `selloAnchoTransversal` (Input): número en mm
3. `anchoFuelleCerrado` (Input): si tieneFuelleSelloCentralPouch = "Sí"
4. `microperforadoAleta` (Checkbox): Sí/No
   - Si Sí, habilita:
     - `ladoAleta` (Select): Derecho / Izquierdo
     - `tipoMicroperforado` (Select): Total / Parcial
     - `separacionPuasAleta` (Select): opciones predefinidas
     - `distanciaLadoAleta` (Input): mm

**Cálculos automáticos:**
```typescript
const anchoTotal = parseNumberInput(anchoSelloAleta) + parseNumberInput(selloAnchoTransversal);
// Mostrar: "Ancho Total (calculado): {anchoTotal} mm"
```

---

### RF-7: Configuración Sello Central Aleta
**Descripción:** Cuando se selecciona Aleta, se habilitan campos similares a PE-PE/PE pero más simplificados.

**Criterios:**
- Visible si: `materialSelloCentralPouch === "Aleta"`

**Campos habilitos:**
1. `anchoSelloAleta` (Select): 10 / 12 / 15 mm
2. `selloAnchoTransversal` (Input): número en mm
3. `anchoFuelleCerrado` (Input): si tieneFuelleSelloCentralPouch = "Sí"
4. **NO** campos de microperforado

---

### RF-8: Selección Sello en Fuelle
**Descripción:** Para Pouch con Sello en Fuelle, el usuario selecciona el tipo.

**Criterios:**
- Campo: `tipoSelloFuellePouch` (Select)
- Visible si: `tipoFormatoPouch === "Pouch con Sello en Fuelle"`
- Opciones: "Tipo 4-1" / "Tipo 1-1"
- Estado: **OBLIGATORIO**
- Efecto: Genera blueprintFormat final

---

### RF-9: Dimensiones Obligatorias
**Descripción:** Todos los formatos POUCH requieren 3 dimensiones base.

**Criterios:**
- Campos (SIEMPRE VISIBLES):
  1. `width` (Input): Ancho en mm
  2. `length` (Input): Largo en mm
  3. `anchoFuelle` (Input): Ancho fuelle en mm

- Estado: **OBLIGATORIOS para todos los formatos**

**Validaciones generales:**
```typescript
if (form.blueprintFormat && !form.width) {
  errors.width = "Ancho es obligatorio";
}
if (form.blueprintFormat && !form.length) {
  errors.length = "Largo es obligatorio";
}
if (form.blueprintFormat && !form.anchoFuelle) {
  errors.anchoFuelle = "Ancho fuelle es obligatorio";
}
```

**Validaciones por formato:**
- Doy Pack: ancho 80-230, largo 134-340, fuelle 0-3 (visto en RF-3)
- Otros: sin restricciones específicas

---

### RF-10: Especificaciones de Sello
**Descripción:** Según el formato, se habilitarán campos para especificar dimensiones del sello.

**Criterios:**

**Para Pouch Plano:**
- `anchoSello` (Input): Ancho del sello en mm (OPCIONAL)
- `selloAnchoTransversal` (Input): Ancho transversal en mm (OPCIONAL)
- `anchoSelloLateral` (Input): Solo si cantidadSellosPouchPlano = "Tres sellos" (OPCIONAL)

**Para Pouch Sello en Fuelle:**
- `selloAnchoTransversal` (Input): Ancho transversal del sello (OPCIONAL)

---

### RF-11: Accesorios Consumibles
**Descripción:** El usuario puede agregar hasta 3 accesorios consumibles según el formato.

**Criterios:**
- Máximo: 3 accesorios por POUCH
- Accesorios disponibles: Zipper, Tin-Tie, Valve
- Validación: Bloquear selección si ya hay 3 seleccionados

**Por cada accesorio:**

**Zipper:**
- Campo: `hasZipper` (Checkbox)
- Si seleccionado: `distanciaAbocaZipper` (Input)

**Tin-Tie:**
- Campo: `hasTinTie` (Checkbox)
- Sin campos adicionales

**Valve:**
- Campo: `hasValve` (Checkbox)
- Si seleccionado:
  - `valveType` (Select): "Degasificadora" / "Dosificadora"
  - `distanciaAbocaValvula` (Input)

---

### RF-12: Accesorios Internos
**Descripción:** El usuario puede agregar accesorios internos del POUCH.

**Criterios:**
- Máximo: 3 accesorios por POUCH
- Accesorios: Corte Angular, Esquinas Redondas, Muesca, Perforación, Pre-Corte

**Corte Angular:**
- Campo: `hasAngularCut` (Checkbox)
- Si seleccionado: `ladoCorteAngular` (Select): Derecho / Izquierdo

**Esquinas Redondas:**
- Campo: `hasRoundedCorners` (Checkbox)
- Si seleccionado: `roundedCornersType` (Select): opciones predefinidas

**Muesca:**
- Campo: `hasNotch` (Checkbox)
- Si seleccionado: `distanciaAbocaMuesca` (Input)

**Perforación:**
- Campo: `hasPerforation` (Checkbox)
- Si seleccionado:
  - `pouchPerforationType` (Select): Ojal / Circular / Europunch
  - `perforationLocation` (Select): Delantero / Posterior
  - `distanciaAbocaPerforacion` (Input)

**Pre-Corte:**
- Campo: `hasPreCut` (Checkbox)
- Si seleccionado:
  - `preCutType` (Select): opciones predefinidas
  - `distanciaAbocaPrecorte` (Input)

---

### RF-13: Accesorios Producto
**Descripción:** El usuario puede agregar accesorios que forman parte del producto.

**Criterios:**
- Máximo: 3 accesorios por POUCH
- Accesorios: Asa Troquelada, Refuerzo

**Asa Troquelada:**
- Campo: `hasDieCutHandle` (Checkbox)
- Si seleccionado:
  - `tipoAsa` (Select): Asida / Tirador / Anilla / Asa cosida
  - `colorAsa` (Select): opciones de colores
  - `formaAsa` (Select): Circular / Plana / Rectangular / Ovalada

**Refuerzo:**
- Campo: `hasReinforcement` (Checkbox)
- Si seleccionado:
  - `reinforcementThickness` (Input): Espesor en g/m²
  - `reinforcementWidth` (Input): Ancho en mm

---

### RF-14: Cálculos Automáticos
**Descripción:** El sistema debe calcular automáticamente ciertos valores.

**Criterios:**

**Ancho Total (Pouch Sello Central PE-PE/PE):**
```typescript
if (materialSelloCentralPouch === "PE-PE/PE") {
  const anchoTotal = parseNumberInput(anchoSelloAleta) + parseNumberInput(selloAnchoTransversal);
  displayAncho Total = `${anchoTotal} mm`;
}
```

**Perímetro (Pouch Sello en Fuelle):**
```typescript
// P = 2 * (ancho + largo)
const perimetro = 2 * (parseNumberInput(width) + parseNumberInput(length));
displayPerimetro = `${perimetro} mm`;
```

---

### RF-15: Persistencia de Datos
**Descripción:** Todos los datos del POUCH deben persistirse correctamente.

**Criterios:**
- **Cargar:** Cuando se abre ProductEditPage, cargar todos los datos de POUCH existentes
- **Editar:** updateField() debe actualizar el estado del formulario
- **Guardar:** handleSubmit() debe guardar todos los campos en updateProjectRecord()
- **Validación:** Antes de guardar, validar que todos los campos obligatorios estén completos

**Campos que se persisten:**
- tipoFormatoPouch
- tipoStandUpPouch
- formaDoyPackPouch
- tipoFuelleStandUpPouch
- cantidadSellosPouchPlano
- materialSelloCentralPouch
- tieneFuelleSelloCentralPouch
- tipoSelloFuellePouch
- width, length, anchoFuelle
- anchoFuelleCerrado
- anchoSello, selloAnchoTransversal, anchoSelloLateral
- anchoSelloAleta, microperforadoAleta, ladoAleta, tipoMicroperforado, separacionPuasAleta, distanciaLadoAleta
- Todos los campos de accesorios

---

## 🔄 Flujos de Usuario

### Flujo 1: Crear Stand Up Doy Pack Redondo con Accesorios

```
1. Usuario abre ProductEditPage
   ↓
2. En Paso 1 (Diseño) → Paso 2 (Diseño)
   ↓
3. Selecciona tipoFormatoPouch = "Stand Up Pouch"
   → Se habilita campo tipoStandUpPouch
   ↓
4. Selecciona tipoStandUpPouch = "Doy Pack"
   → Se habilitan formaDoyPackPouch y tipoFuelleStandUpPouch
   ↓
5. Selecciona formaDoyPackPouch = "Redondo"
   → Se valida rango de width
   ↓
6. Selecciona tipoFuelleStandUpPouch = "Fuelle Propio"
   → Se genera blueprintFormat: POUCH STAND UP\DOY PACK REDONDO\FUELLE PROPIO
   ↓
7. Ingresa dimensiones:
   - width: 100 mm (validar 80-230)
   - length: 200 mm (validar 134-340)
   - anchoFuelle: 2 mm (validar 0-3)
   ↓
8. Selecciona accesorios consumibles (máx 3):
   - Zipper → ingresa distanciaAbocaZipper: 10 mm
   - Valve → selecciona valveType + ingresa distanciaAbocaValvula
   ↓
9. Click "Solicitar Producto"
   → Validar todos los campos obligatorios
   → Guardar en updateProjectRecord()
   → Mostrar mensaje de éxito
   ↓
10. Navigate("/products")
```

---

### Flujo 2: Crear Pouch Plano Tres Sellos

```
1. tipoFormatoPouch = "Pouch Plano"
   → Se habilita cantidadSellosPouchPlano
   ↓
2. cantidadSellosPouchPlano = "Tres sellos"
   → Se habilita campo anchoSelloLateral
   → Se genera blueprintFormat: POUCH PLANO\TRES SELLOS
   ↓
3. Ingresa especificaciones de sello:
   - anchoSello: 25 mm
   - selloAnchoTransversal: 15 mm
   - anchoSelloLateral: 20 mm
   ↓
4. Ingresa dimensiones:
   - width: 100 mm
   - length: 150 mm
   - anchoFuelle: 30 mm
   ↓
5. Selecciona accesorios (máx 3):
   - Zipper
   - Notch → ingresa distanciaAbocaMuesca
   - Perforación → selecciona tipo + ubicación + distancia
   ↓
6. Guardar
```

---

### Flujo 3: Crear Pouch Sello Central PE-PE/PE con Microperforado

```
1. tipoFormatoPouch = "Pouch con Sello Central"
   → Se habilitan materialSelloCentralPouch y tieneFuelleSelloCentralPouch
   ↓
2. materialSelloCentralPouch = "PE-PE/PE"
   → Se habilitan campos específicos
   ↓
3. tieneFuelleSelloCentralPouch = "Sí"
   → Se habilita anchoFuelleCerrado
   → Se genera blueprintFormat: POUCH C/SELLO CENTRAL\TIPO ALETA\CON FUELLE (PE-PE/PE)
   ↓
4. Ingresa datos de sello central:
   - anchoSelloAleta: 12
   - selloAnchoTransversal: 10
   → Sistema calcula y muestra: Ancho Total = 22 mm
   ↓
5. anchoFuelleCerrado: 5 mm
   ↓
6. Selecciona microperforadoAleta = "Sí"
   → Se habilitan ladoAleta, tipoMicroperforado, separacionPuasAleta, distanciaLadoAleta
   ↓
7. Ingresa datos de microperforado:
   - ladoAleta: "Derecho del pouch"
   - tipoMicroperforado: "Total"
   - separacionPuasAleta: "Fideos/Detergente 30-30 mm"
   - distanciaLadoAleta: 8 mm
   ↓
8. Ingresa dimensiones y accesorios
   ↓
9. Guardar
```

---

### Flujo 4: Editar Pouch Existente

```
1. Usuario abre ProductEditPage de un POUCH existente
   ↓
2. useEffect dispara → getProjectByCode() retorna proyecto guardado
   ↓
3. Se cargan TODOS los datos del POUCH:
   - tipoFormatoPouch
   - tipoStandUpPouch (si aplica)
   - Dimensiones
   - Accesorios
   ↓
4. Los campos se habilitan/deshabilitan según la estructura cargada
   ↓
5. Usuario modifica algunos campos (ej: width de 100 a 120)
   ↓
6. updateField("width", "120") actualiza el estado
   ↓
7. Click "Guardar" → handleSubmit()
   ↓
8. Validación de todos los campos
   ↓
9. updateProjectRecord() guarda cambios
   ↓
10. Mensaje de éxito
```

---

## 🧪 Casos de Prueba

### TC-01: Validación de Campo Obligatorio tipoFormatoPouch
**Given:** Usuario abre ProductEditPage con POUCH  
**When:** No selecciona tipoFormatoPouch y hace click en "Guardar"  
**Then:** Muestra error "Selecciona una familia de POUCH"  
**Expected:** Campo marcado en rojo, no guarda

---

### TC-02: Cascada de Habilitación Stand Up → Doy Pack
**Given:** tipoFormatoPouch = "Stand Up Pouch"  
**When:** tipoStandUpPouch = "Doy Pack"  
**Then:** Se habilitan formaDoyPackPouch y tipoFuelleStandUpPouch  
**Expected:** Los campos pasan de disabled a enabled

---

### TC-03: Validación de Rango Doy Pack
**Given:** tipoStandUpPouch = "Doy Pack"  
**When:** width = 50 mm (fuera del rango 80-230)  
**Then:** Muestra error "Ancho debe estar entre 80-230 mm"  
**Expected:** Bloquea guardado

---

### TC-04: Cálculo Automático Ancho Total
**Given:** materialSelloCentralPouch = "PE-PE/PE"  
**When:** anchoSelloAleta = 12, selloAnchoTransversal = 10  
**Then:** Sistema muestra "Ancho Total (calculado): 22 mm"  
**Expected:** Cálculo es correcto y automático

---

### TC-05: Máximo 3 Accesorios
**Given:** Usuario ha seleccionado 3 accesorios consumibles  
**When:** Intenta seleccionar un 4to accesorio  
**Then:** Campo está deshabilitado con mensaje "Máximo 3 accesorios"  
**Expected:** No permite seleccionar más de 3

---

### TC-06: Limpiar Campos al Cambiar Formato
**Given:** Usuario selecciona "Stand Up Pouch\Doy Pack\Redondo"  
**When:** Cambia tipoFormatoPouch a "Pouch Plano"  
**Then:** Se limpian formaDoyPackPouch y tipoFuelleStandUpPouch  
**Expected:** No quedan datos inconsistentes

---

### TC-07: Persistencia de Datos
**Given:** Usuario crea Pouch Plano con datos  
**When:** Hace click "Guardar"  
**Then:** Se guarda en BD correctamente  
**Expected:** Al reabrir, se cargan todos los datos

---

### TC-08: Validación de Subdivisión Obligatoria
**Given:** tipoFormatoPouch = "Pouch Plano"  
**When:** No selecciona cantidadSellosPouchPlano y hace "Guardar"  
**Then:** Error "Selecciona cantidad de sellos"  
**Expected:** Bloquea guardado

---

### TC-09: Campos Condicionales Sello Central
**Given:** materialSelloCentralPouch = "Aleta"  
**When:** No se cargan campos de microperforado  
**Then:** Campos microperforado están ocultos  
**Expected:** No aparecen en UI

---

### TC-10: Validación de Accesorios Condicionales
**Given:** hasValve = "Sí"  
**When:** No ingresa valveType ni distanciaAbocaValvula  
**Then:** Error "Especifica tipo de válvula y distancia"  
**Expected:** Requiere completar datos de válvula

---

## ✅ Criterios de Aceptación

### Criterio 1: Árbol de Decisiones Funciona
```gherkin
Given usuario abre ProductEditPage
When selecciona tipoFormatoPouch = "Stand Up Pouch"
Then se habilita tipoStandUpPouch
And se deshabilitan otros campos de primera decisión
```

### Criterio 2: Validaciones por Formato Funcionan
```gherkin
Given tipoStandUpPouch = "Doy Pack"
When ingresa width = 50
Then muestra error específico de rango
And no permite guardar
```

### Criterio 3: Cálculos Automáticos Correctos
```gherkin
Given materialSelloCentralPouch = "PE-PE/PE"
And anchoSelloAleta = 12
And selloAnchoTransversal = 10
When el formulario se renderiza
Then muestra "Ancho Total: 22 mm"
```

### Criterio 4: Accesorios Máximo 3
```gherkin
Given usuario ha seleccionado 3 accesorios
When intenta seleccionar otro
Then muestra mensaje de máximo alcanzado
And no permite agregar más
```

### Criterio 5: Persistencia Correcta
```gherkin
Given usuario crea Pouch con datos
When hace click "Guardar"
And abre ProductEditPage del mismo producto
Then todos los datos se cargan correctamente
```

### Criterio 6: Campos Obligatorios Validados
```gherkin
Given usuario deja campo obligatorio vacío
When hace click "Guardar"
Then muestra error específico
And no guarda
```

### Criterio 7: Limpiar al Cambiar Formato
```gherkin
Given usuario ha completado "Stand Up Pouch > Doy Pack"
When cambia tipoFormatoPouch a "Pouch Plano"
Then se limpian los campos de Doy Pack
```

### Criterio 8: Campos Condicionales se Muestran/Ocultan
```gherkin
Given materialSelloCentralPouch = "PE-PE/PE"
Then se muestran campos de microperforado
When cambia a "Aleta"
Then se ocultan campos de microperforado
```

### Criterio 9: Accesorios Condicionales Funcionan
```gherkin
Given hasValve = "Sí"
Then se muestran valveType y distanciaAbocaValvula
When hasValve = "No"
Then se ocultan y se limpian
```

### Criterio 10: UI es Intuitiva
```gherkin
Given usuario sin experiencia previa
When abre el formulario POUCH
Then puede completar un formato sin confusiones
And los campos se habilitan progresivamente
```

---

## 🔧 Especificación Técnica

### Componentes Involucrados

#### 1. ProductEditPage.tsx
**Responsabilidades:**
- Renderizar sección "Configuración de Formato" para POUCH
- Manejar cascada de decisiones (tipoFormatoPouch → tipoStandUpPouch → etc.)
- Validar datos según formato seleccionado
- Guardar datos en updateProjectRecord()

**Variables de estado:**
```typescript
// En form state (ProjectEditFormData)
tipoFormatoPouch: string;
tipoStandUpPouch: string;
formaDoyPackPouch: string;
tipoFuelleStandUpPouch: string;
cantidadSellosPouchPlano: string;
materialSelloCentralPouch: string;
tieneFuelleSelloCentralPouch: string;
tipoSelloFuellePouch: string;

// Dimensiones
width: string;
length: string;
anchoFuelle: string;
anchoFuelleCerrado: string;

// Sello
anchoSello: string;
selloAnchoTransversal: string;
anchoSelloLateral: string;
anchoSelloAleta: string;

// Microperforado (si PE-PE/PE)
microperforadoAleta: string;
ladoAleta: string;
tipoMicroperforado: string;
separacionPuasAleta: string;
distanciaLadoAleta: string;

// Accesorios consumibles
hasZipper: string;
distanciaAbocaZipper: string;
hasTinTie: string;
hasValve: string;
valveType: string;
distanciaAbocaValvula: string;

// Accesorios internos
hasAngularCut: string;
ladoCorteAngular: string;
hasRoundedCorners: string;
roundedCornersType: string;
hasNotch: string;
distanciaAbocaMuesca: string;
hasPerforation: string;
pouchPerformationType: string;
perforationLocation: string;
distanciaAbocaPerforacion: string;
hasPreCut: string;
preCutType: string;
distanciaAbocaPrecorte: string;

// Accesorios producto
hasDieCutHandle: string;
tipoAsa: string;
colorAsa: string;
formaAsa: string;
hasReinforcement: string;
reinforcementThickness: string;
reinforcementWidth: string;
```

#### 2. Validaciones
```typescript
// En validationErrors compute
if (isPouchWrapping(inheritedWrapping) && activeStep === 1) {
  // Validación de tipoFormatoPouch
  if (!form.tipoFormatoPouch) {
    errors.tipoFormatoPouch = "Selecciona una familia de POUCH";
  }
  
  // Validación de subdivisiones según tipoFormatoPouch
  if (form.tipoFormatoPouch === "Stand Up Pouch" && !form.tipoStandUpPouch) {
    errors.tipoStandUpPouch = "Selecciona tipo de Stand Up";
  }
  
  // ... más validaciones
  
  // Validación de dimensiones
  if (!form.width || !form.length || !form.anchoFuelle) {
    errors.width = errors.length = errors.anchoFuelle = "Obligatorio";
  }
  
  // Validación de rango Doy Pack
  if (form.tipoStandUpPouch === "Doy Pack") {
    const w = parseNumberInput(form.width) || 0;
    if (w < 80 || w > 230) {
      errors.width = "Ancho debe estar entre 80-230 mm";
    }
    // ... validar length y anchoFuelle
  }
  
  // Validación de accesorios condicionales
  if (form.hasValve === "Sí" && !form.valveType) {
    errors.valveType = "Especifica tipo de válvula";
  }
}
```

#### 3. Cálculos Automáticos
```typescript
// Ancho Total para PE-PE/PE
const computeAnchoTotal = () => {
  if (materialSelloCentralPouch === "PE-PE/PE") {
    const aleta = parseNumberInput(anchoSelloAleta) || 0;
    const transversal = parseNumberInput(selloAnchoTransversal) || 0;
    return aleta + transversal;
  }
  return 0;
};

// Perímetro para Sello en Fuelle
const computePerimetro = () => {
  if (tipoSelloFuellePouch) {
    const w = parseNumberInput(width) || 0;
    const l = parseNumberInput(length) || 0;
    return 2 * (w + l);
  }
  return 0;
};
```

### Mapeo a ProjectRecord
```typescript
// En handleSubmit → updateProjectRecord()
updateProjectRecord(projectCode, {
  // Formato POUCH
  tipoFormatoPouch: form.tipoFormatoPouch,
  tipoStandUpPouch: form.tipoStandUpPouch,
  formaDoyPackPouch: form.formaDoyPackPouch,
  tipoFuelleStandUpPouch: form.tipoFuelleStandUpPouch,
  cantidadSellosPouchPlano: form.cantidadSellosPouchPlano,
  materialSelloCentralPouch: form.materialSelloCentralPouch,
  tieneFuelleSelloCentralPouch: form.tieneFuelleSelloCentralPouch as BooleanLike,
  tipoSelloFuellePouch: form.tipoSelloFuellePouch,
  
  // Dimensiones
  width: form.width,
  length: form.length,
  anchoFuelle: form.anchoFuelle,
  anchoFuelleCerrado: form.anchoFuelleCerrado,
  
  // ... todos los demás campos
  
  updatedAt: now,
});
```

---

## 📊 Resumen de Campos

### Total de Campos: 45

| Categoría | Cantidad | Obligatorios | Condicionales | Opcionales |
|-----------|----------|:---:|:---:|:---:|
| Selección Formato | 5 | 1 | 4 | - |
| Subdivisiones | 7 | - | 7 | - |
| Dimensiones | 4 | 3 | 1 | - |
| Sello/Especificaciones | 8 | - | - | 8 |
| Microperforado | 5 | - | - | 5 |
| Accesorios Consumibles | 6 | - | - | 6 |
| Accesorios Internos | 8 | - | - | 8 |
| Accesorios Producto | 6 | - | - | 6 |
| **TOTAL** | **45** | **4** | **12** | **29** |

---

## 🚀 Story Points: 21 (XL)

**Desglose:**
- Lógica de cascada de decisiones: 8 puntos
- Validaciones por formato: 5 puntos
- Cálculos automáticos: 3 puntos
- Persistencia y carga: 3 puntos
- Testing: 2 puntos

---

## ⚠️ Restricciones y Limitaciones

1. **Máximo 3 Accesorios Consumibles:** El sistema debe limitar y bloquear la selección de más de 3 accesorios
2. **Máximo 3 Accesorios Internos:** Igual restricción que consumibles
3. **Máximo 3 Accesorios Producto:** Igual restricción
4. **Validaciones de Rango (Doy Pack):** Solo aplican cuando tipoStandUpPouch = "Doy Pack"
5. **Cálculos Automáticos (Lectura):** No se pueden editar campos calculados (Ancho Total, Perímetro)
6. **Cascada Obligatoria:** No se puede "saltar" niveles en el árbol de decisiones

---

## 📋 Dependencias

- **ProjectEditPage.tsx:** Componente padre que contiene la lógica principal
- **PhotoregisterCalculations.ts:** Para cualquier cálculo de posicionamiento
- **ProductEditFormData:** Type que define toda la estructura
- **updateProjectRecord():** Función de persistencia
- **FIELD_TO_EDITABLE_GROUP:** Mapeo de campos a grupos

---

## 🎯 Definición de Completitud

La HU está COMPLETA cuando:
1. ✅ Árbol de decisiones funciona sin errores
2. ✅ Todas las validaciones están implementadas
3. ✅ Cálculos automáticos son correctos
4. ✅ Accesorios están limitados a máximo 3
5. ✅ Persistencia funciona (carga/edita/guarda)
6. ✅ Todos los TC pasan
7. ✅ UI es intuitiva y responsive
8. ✅ Tests unitarios e integración cumplen

---

**Documento Completo - Listo para Desarrollo** ✅
