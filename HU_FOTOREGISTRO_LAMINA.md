# HU: Configuración de Fotoregistro para Lámina (LÁMINA)

## 📋 Historia de Usuario

**Como** operario de ODISEO  
**Quiero** configurar los fotoregistros de una lámina de forma visual e intuitiva  
**Para que** el sistema calcule automáticamente las posiciones y márgenes correctos, evitando errores manuales

---

## 🎯 Objetivos

1. ✅ Permitir configuración de 1 o 2 fotoregistros por lámina
2. ✅ Auto-generar el segundo fotoregistro de forma simétrica
3. ✅ Validar que los fotoregistros caben dentro de la lámina
4. ✅ Mostrar vista previa visual en tiempo real
5. ✅ Calcular márgenes automáticamente según referencia y distancia
6. ✅ Modo manual para casos especiales

---

## 📊 Requisitos Funcionales

### RF-1: Inicialización
- [ ] Campo: "¿La lámina lleva fotoregistro?" (Sí/No)
- [ ] Si NO: ocultar toda la configuración
- [ ] Si SÍ: mostrar pregunta "¿Cuántos fotoregistros?" (1 o 2)

### RF-2: Fotoregistro 1 (Obligatorio si hay fotoregistro)
- [ ] **Dimensiones editables:**
  - Ancho (mm)
  - Alto (mm)
- [ ] **Referencia (posición base):**
  - Horizontal: Izquierda / Derecha
  - Vertical: Arriba / Abajo
- [ ] **Distancia (desde la referencia):**
  - Distancia horizontal (mm)
  - Distancia vertical (mm)
- [ ] **Márgenes calculados (solo lectura):**
  - Margen izquierdo (mm)
  - Margen derecho (mm)
  - Margen superior (mm)
  - Margen inferior (mm)
- [ ] Validar que cabe dentro de la lámina
- [ ] Mostrar icono ✅ o ⚠️ según validación

### RF-3: Fotoregistro 2 (Opcional)
- [ ] **Modo automático (por defecto):**
  - Calcular automáticamente como reflejo simétrico de FR1
  - Mismas dimensiones que FR1
  - Mostrar badge "Automático"
  - Botón para cambiar a manual si usuario lo requiere
- [ ] **Modo manual:**
  - Permitir editar dimensiones, referencia y distancia independientemente
  - Mostrar badge "Manual"
- [ ] Validación igual que FR1
- [ ] Indicador visual: "FR1 y FR2 están alineados" ✅ / "Posiciones diferentes" ⚠️

### RF-4: Cálculos automáticos
- [ ] Al cambiar dimensiones de FR1 → recalcular márgenes
- [ ] Al cambiar referencia de FR1 → recalcular márgenes
- [ ] Al cambiar distancia de FR1 → recalcular márgenes
- [ ] Si FR2 está en modo automático → actualizar FR2 también

### RF-5: Validación
- [ ] **Validación de cabe:**
  - Ancho total (margen izq + ancho FR + margen der) ≤ Ancho lámina
  - Alto total (margen sup + alto FR + margen inf) ≤ Alto lámina
  - Mensaje: "El fotoregistro no cabe en la lámina"
- [ ] **Validación de valores:**
  - Ancho FR: > 0 mm
  - Alto FR: > 0 mm
  - Márgenes: ≥ 0 mm

### RF-6: Vista Previa Visual
- [ ] Dibujo 2D con:
  - Rectángulo que representa la lámina
  - Rectángulo(s) que representa(n) el/los fotoregistro(s)
  - Líneas punteadas para márgenes
  - Coordenadas en ejes X/Y
  - Escala proporcional
- [ ] Indicador de validación: color verde si OK, rojo si hay problema
- [ ] Responsive: ajustarse al tamaño disponible

### RF-7: Persistencia en ProductEditPage
- [ ] **Guardar en formulario (form state):**
  - `hasPhotoregister1` (Sí/No)
  - `fr1Width`, `fr1Height` (números)
  - `fr1MarginLeft`, `fr1MarginRight`, `fr1MarginTop`, `fr1MarginBottom` (números)
  - `hasPhotoregister2` (Sí/No)
  - `fr2Width`, `fr2Height` (números)
  - `fr2MarginLeft`, `fr2MarginRight`, `fr2MarginTop`, `fr2MarginBottom` (números)

- [ ] **Cargar desde proyecto existente:**
  - Al abrir ProductEditPage, leer valores de `project.hasPhotoregister1`
  - Recuperar todos los valores de márgenes y dimensiones
  - Convertir strings a números correctamente
  - Inicializar form state con valores cargados

- [ ] **Guardar en updateProjectRecord():**
  - Al hacer submit, enviar todos los campos de fotoregistro al storage
  - Incluir en objeto ProjectRecord que se guarda
  - Validar que los valores sean números válidos antes de guardar

- [ ] **Validación de datos persistidos:**
  - No permitir guardar si hay valores negativos
  - No permitir guardar si el fotoregistro no cabe en la lámina
  - Mostrar error claro si la validación falla

- [ ] **Reset de datos:**
  - Si usuario cambia `hasPhotoregister1` a "No", limpiar todos los valores de FR1
  - Si usuario cambia `hasPhotoregister2` a "No", limpiar todos los valores de FR2
  - Guardar cambio limpio sin datos huérfanos

---

## 🧮 Fórmulas de Cálculo

### Convertir Referencia + Distancia → Márgenes

```
Given:
- laminaWidth, laminaHeight (dimensiones de lámina)
- frWidth, frHeight (dimensiones del fotoregistro)
- reference = { horizontal: "left" | "right", vertical: "top" | "bottom" }
- distance = { horizontal: mm, vertical: mm }

Calculate:
IF reference.horizontal == "left":
  marginLeft = distance.horizontal
  marginRight = laminaWidth - marginLeft - frWidth
ELSE (right):
  marginRight = distance.horizontal
  marginLeft = laminaWidth - marginRight - frWidth

IF reference.vertical == "top":
  marginTop = distance.vertical
  marginBottom = laminaHeight - marginTop - frHeight
ELSE (bottom):
  marginBottom = distance.vertical
  marginTop = laminaHeight - marginBottom - frHeight
```

### Convertir Márgenes → Referencia + Distancia

```
Given margins, invert the above logic to find best reference/distance
```

### Fotoregistro 2 Simétrico (Automático)

```
FR2 es reflejo especular de FR1 en la lámina:

FR2.reference.horizontal = opposite(FR1.reference.horizontal)
  (si FR1 es left → FR2 es right, y viceversa)
FR2.reference.vertical = opposite(FR1.reference.vertical)
  (si FR1 es top → FR2 es bottom, y viceversa)

FR2.distance.horizontal = FR1.distance.horizontal (mismo)
FR2.distance.vertical = FR1.distance.vertical (mismo)

FR2.width = FR1.width (mismo)
FR2.height = FR1.height (mismo)
```

---

## 🖼️ Flujo de Pantalla

### Estado 1: Sin fotoregistro
```
┌─────────────────────────────────┐
│ ¿La lámina lleva fotoregistro?  │
│ [No] [Sí]                       │
└─────────────────────────────────┘
```

### Estado 2: Con 1 fotoregistro
```
┌─────────────────────────────────┐
│ ¿La lámina lleva fotoregistro?  │
│ [No] [Sí]                       │
├─────────────────────────────────┤
│ ¿Cuántos fotoregistros?         │
│ [1 fotoregistro] [2 fotoregistros]
├─────────────────────────────────┤
│ ► Fotoregistro 1                │
│   Ancho: [___] mm               │
│   Alto:  [___] mm               │
│   Referencia: [Izq▼] [Abajo▼]   │
│   Distancia: [___] mm horizontal│
│              [___] mm vertical   │
│   Márgenes (calculados):        │
│   Izq: 10mm | Der: 15mm         │
│   Sup: 20mm | Inf: 25mm         │
│   Status: ✅ Cabe en lámina      │
└─────────────────────────────────┘
  [Vista Previa 2D]
```

### Estado 3: Con 2 fotoregistros
```
┌─────────────────────────────────┐
│ ► Fotoregistro 1 [Automático]   │
│   [contenido igual que arriba]  │
├─────────────────────────────────┤
│ ► Fotoregistro 2 [Automático ✓] │
│   Ancho: [___] mm (igual FR1)   │
│   Alto:  [___] mm (igual FR1)   │
│   Referencia: [Der▼] [Arriba▼]  │
│   Distancia: [igual a FR1]      │
│   Márgenes (calculados):        │
│   Izq: 15mm | Der: 10mm         │
│   Sup: 25mm | Inf: 20mm         │
│   Status: ✅ Simétrico a FR1     │
│   [Cambiar a Manual]            │
└─────────────────────────────────┘
  [Vista Previa 2D: muestra ambos]
```

---

## 🔄 Flujos de Usuario

### Flujo 1: Crear lámina con 1 fotoregistro simple
1. Usuario selecciona "Sí" en "¿Lleva fotoregistro?"
2. Selecciona "1 fotoregistro"
3. Ingresa dimensiones: Ancho 100mm, Alto 80mm
4. Selecciona referencia: Izquierda + Abajo
5. Ingresa distancia: 10mm horizontal, 5mm vertical
6. Sistema calcula y muestra márgenes
7. Vista previa actualiza en tiempo real
8. Usuario ve ✅ de validación

### Flujo 2: Crear con 2 fotoregistros simétricos
1. Pasos 1-8 del Flujo 1
2. Usuario selecciona "2 fotoregistros"
3. Sistema auto-genera FR2 con valores simétricos
4. Usuario revisa FR2 (muestra "Automático")
5. Vista previa muestra ambos fotoregistros
6. Sistema valida alineación

### Flujo 3: Cambiar FR2 a manual
1. Usuario hace click en "Cambiar a Manual" en FR2
2. Campos de FR2 se habilitan para edición
3. Badge cambia a "Manual"
4. Usuario edita dimensiones/referencia/distancia
5. Sistema recalcula márgenes de FR2
6. Vista previa actualiza

### Flujo 4: Modificar FR1 cuando FR2 está automático
1. Usuario edita ancho de FR1
2. Sistema recalcula márgenes de FR1
3. Si FR2 está automático, también se actualiza FR2
4. Vista previa muestra cambios en ambos

---

## 📦 Componentes Requeridos

### Componente Principal: `PhotoregisterPanel`
**Props:**
```typescript
interface PhotoregisterPanelProps {
  laminaWidth: number;        // Ancho de lámina (mm)
  laminaHeight: number;       // Alto de lámina (mm) - calculado de repetición
  hasPhotoregister1: boolean;
  hasPhotoregister2: boolean;
  fr1: {
    width: number;
    height: number;
    marginLeft: number;
    marginRight: number;
    marginTop: number;
    marginBottom: number;
  };
  fr2?: {
    width: number;
    height: number;
    marginLeft: number;
    marginRight: number;
    marginTop: number;
    marginBottom: number;
    isAutomatic: boolean;
  };
  disabled?: boolean;
  onPhotoregisterChange: (data: PhotoregisterData) => void;
}
```

### Componentes Sub: 
- `PhotoregisterAccordion` (ya existe, mejorar)
- `PhotoregisterPreview` (ya existe, mejorar)
- `PhotoregisterCalculator` (utils)

---

## ✅ Criterios de Aceptación

- [ ] Interfaz intuitiva con acordeones expandibles/contraíbles
- [ ] Cálculos matemáticos 100% precisos (±0.01mm)
- [ ] Validación visual clara (✅/⚠️)
- [ ] Vista previa se actualiza en tiempo real sin lag
- [ ] Auto-cálculo de FR2 funciona correctamente
- [ ] Modo manual en FR2 permite independencia total
- [ ] Persistencia de datos entre sesiones
- [ ] Responsivo en desktop y tablet
- [ ] Accesibilidad WCAG 2.1 AA
- [ ] Tests unitarios de cálculos al 100%
- [ ] Documentación de fórmulas clara

---

## 🧪 Casos de Prueba

### CT-1: Validación de cabe
**Given:** Lámina 500mm ancho, Fotoregistro 100mm ancho, Margen izq 50mm  
**When:** Usuario ingresa Margen der 50mm (total: 50+100+50 = 200mm)  
**Then:** ✅ Sistema valida como OK (200 < 500)

### CT-2: Validación de no cabe
**Given:** Mismo escenario, pero Margen der 400mm  
**When:** Total = 450mm  
**Then:** ⚠️ "El fotoregistro no cabe en la lámina" (450 > 500)

### CT-3: FR2 Automático se actualiza
**Given:** FR1 con Ancho=100, Alto=80, Izq, Abajo, 10mm/5mm  
**When:** Usuario cambia Ancho a 120  
**Then:** FR2 automático también cambia a 120mm

### CT-4: FR2 Manual no se actualiza
**Given:** FR2 está en modo Manual  
**When:** Usuario cambia FR1  
**Then:** FR2 permanece sin cambios

### CT-5: Conversión Referencia ↔ Márgenes
**Given:** Referencia Izquierda, Distancia 10mm, Lámina 500mm, FR 100mm  
**When:** Sistema calcula márgenes  
**Then:** MargenIzq=10, MargenDer=390 (500-10-100)

---

## 🎨 Diseño Visual

### Acordeón de FR1
```
┌──────────────────────────────────────┐
│ ▼ Fotoregistro 1  [Automático] ✅    │
├──────────────────────────────────────┤
│ Dimensiones del FR                   │
│ ┌────────────────────────────────┐   │
│ │ Ancho:  [100    ] mm           │   │
│ │ Alto:   [80     ] mm           │   │
│ │ Status: ✅ Cabe en lámina       │   │
│ └────────────────────────────────┘   │
│                                      │
│ Posición (Referencia + Distancia)    │
│ ┌────────────────────────────────┐   │
│ │ Referencia:                    │   │
│ │ Horizontal: [Izquierda ▼]      │   │
│ │ Vertical:   [Abajo ▼]          │   │
│ │                                │   │
│ │ Distancia desde referencia:    │   │
│ │ Horizontal: [10    ] mm        │   │
│ │ Vertical:   [5     ] mm        │   │
│ └────────────────────────────────┘   │
│                                      │
│ Márgenes Calculados (solo lectura)   │
│ ┌────────────────────────────────┐   │
│ │ Margen Izquierdo:    10 mm     │   │
│ │ Margen Derecho:      390 mm    │   │
│ │ Margen Superior:     395 mm    │   │
│ │ Margen Inferior:     5 mm      │   │
│ └────────────────────────────────┘   │
│                                      │
│ 100mm × 80mm · Izq 10mm · Abajo 5mm │
└──────────────────────────────────────┘
```

---

## 📝 Notas Técnicas

1. **Lámina Height**: En LÁMINA, la altura del fotoregistro se toma de la **Repetición**, no del Largo
2. **Sincronización**: FR2 automático debe sincronizarse en tiempo real, sin debounce
3. **Precisión**: Usar `parseFloat` con validación, permitir 2 decimales
4. **Mobile**: En móvil, la vista previa puede ser más pequeña o desaparecer
5. **Undo/Redo**: No necesario si los cambios son guardados en form state

---

## 🚀 Story Points: 13 (M - Mediano/Complejo)

### Desglose de Complejidad:
- Interfaz: 5 pts
- Cálculos: 5 pts  
- Vista Previa: 2 pts
- Tests: 1 pt

---

## 📎 Enlaces Relacionados

- **Componentes existentes:**
  - `PhotoregisterAccordion.tsx` (mejorar)
  - `PhotoregisterPreview.tsx` (mejorar)
  - `photoregisterCalculations.ts` (expandir)

- **Integraciones:**
  - ProductEditPage.tsx (Step 1: Diseño)
  - Paso 2 cuando FDP = LÁMINA

---

## 🔄 Definición de Hecho (DoD)

- [x] Código escrito y testeado
- [x] Componentes documentados (JSDoc)
- [x] Tests unitarios ≥ 80% cobertura
- [x] Tests E2E para flujos principales
- [x] Validación de cálculos matemáticos verificada
- [x] Accesibilidad verificada (WCAG)
- [x] Responsive verificado (desktop, tablet, móvil)
- [x] Performance verificado (render < 100ms)
- [x] Documentación actualizada (README/Wikis)
- [x] PR revisado y aprobado por 2+ equipos
- [x] Integración en ProductEditPage completada
- [x] Demo funciona sin errores

---

## 📌 Dependencias
- Material de referencia de `photoregisterCalculations.ts` funcional
- ProductEditPage soporta LÁMINA y Paso 1: Diseño
- Dimensiones de lámina disponibles (Ancho + Repetición)

