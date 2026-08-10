# 📸 HU FOTOREGISTRO - ESPECIFICACIÓN DE IMPLEMENTACIÓN

**Versión:** 1.0  
**Fecha:** 2026-08-10  
**Story Points:** 13  
**Complejidad:** Media  
**Dependencias:** LÁMINA exclusive, Perímetro calculado

---

# 1. RESUMEN EJECUTIVO

El **Fotoregistro** es una funcionalidad EXCLUSIVA de LÁMINA que permite registrar visualmente la posición de marcas de referencia en el rollo para control de calidad. Este HU especifica la implementación de un sistema visual con gráfico interactivo que permite:

- ✅ Seleccionar SI/NO para habilitar Fotoregistro
- ✅ Configurar UN (1) único Fotoregistro (cambio respecto a versión anterior que permitía 2)
- ✅ Visualizar gráficamente la posición mediante diagrama
- ✅ Calcular automáticamente márgenes
- ✅ Validar dimensiones y referencias

---

# 2. REQUISITOS FUNCIONALES

## RF-1: Disponibilidad Exclusiva LÁMINA
```
REGLA: Fotoregistro está disponible SOLO si:
  ├─ Envoltura = "LÁMINA"
  └─ Formato LÁMINA (Genérica, Tissue, Food)

COMPORTAMIENTO:
  ├─ IF Envoltura ≠ LÁMINA: Ocultar Fotoregistro section completamente
  ├─ IF Envoltura = LÁMINA: Mostrar Fotoregistro section
  └─ SI Usuario cambia de LÁMINA a BOLSA/POUCH: Limpiar datos FR

OBLIGATORIO: ⚪ No (opcional dentro de LÁMINA)
```

## RF-2: Toggle para Habilitar/Deshabilitar Fotoregistro
```
COMPONENTE: Radio Button o Checkbox
OPCIONES: Sí / No
DEFAULT: No (deshabilitado)
ETIQUETA: "¿Desea agregar Fotoregistro?"

COMPORTAMIENTO:
  IF Usuario selecciona "Sí":
  ├─ Mostrar FR1 section (7 campos + 4 márgenes calculados)
  ├─ FR1 se convierte en OBLIGATORIO
  └─ Validar FR1 en tiempo real

  IF Usuario selecciona "No":
  ├─ Ocultar FR1 section
  └─ Limpiar todos los campos FR1 (set to NULL)

VALIDACIÓN: onChange
SEVERIDAD: Media
```

## RF-3: Configuración FR1 (Única)
```
NOTA: Solo UN FOTOREGISTRO (no hay FR2)
      Esta es una restricción más severa que la versión anterior

CAMPOS FR1:

1. FR1 Width (mm) *
   ├─ Tipo: Number (input)
   ├─ Rango: 1-9999 mm
   ├─ Obligatorio: ✅ Sí (si FR = Sí)
   ├─ Validación: Range 1-9999
   └─ Placeholder: "ej: 100"

2. FR1 Height (mm) *
   ├─ Tipo: Number (input)
   ├─ Rango: 1-9999 mm
   ├─ Obligatorio: ✅ Sí (si FR = Sí)
   ├─ Validación: Range 1-9999
   └─ Placeholder: "ej: 80"

3. FR1 Referencia Horizontal *
   ├─ Tipo: Dropdown
   ├─ Opciones: ["Izquierda", "Derecha"]
   ├─ Obligatorio: ✅ Sí (si FR = Sí)
   ├─ DEFAULT: "Izquierda"
   └─ TRIGGER: onChange → Recalcular márgenes

4. FR1 Referencia Vertical *
   ├─ Tipo: Dropdown
   ├─ Opciones: ["Arriba", "Abajo"]
   ├─ Obligatorio: ✅ Sí (si FR = Sí)
   ├─ DEFAULT: "Arriba"
   └─ TRIGGER: onChange → Recalcular márgenes

5. FR1 Distancia Horizontal (mm) *
   ├─ Tipo: Number (input)
   ├─ Rango: 0-9999 mm
   ├─ Obligatorio: ✅ Sí (si FR = Sí)
   ├─ Validación: Range 0-9999
   ├─ Placeholder: "ej: 20"
   └─ TRIGGER: onChange → Recalcular márgenes

6. FR1 Distancia Vertical (mm) *
   ├─ Tipo: Number (input)
   ├─ Rango: 0-9999 mm
   ├─ Obligatorio: ✅ Sí (si FR = Sí)
   ├─ Validación: Range 0-9999
   ├─ Placeholder: "ej: 15"
   └─ TRIGGER: onChange → Recalcular márgenes

MÁRGENES CALCULADOS (READ-ONLY):

7. FR1 Margin Left (mm)
   ├─ Tipo: Display (read-only)
   ├─ Cálculo: IF refHoriz = "Izquierda" THEN distHoriz ELSE 0
   └─ Actualiza automáticamente

8. FR1 Margin Right (mm)
   ├─ Tipo: Display (read-only)
   ├─ Cálculo: IF refHoriz = "Derecha" THEN distHoriz ELSE 0
   └─ Actualiza automáticamente

9. FR1 Margin Top (mm)
   ├─ Tipo: Display (read-only)
   ├─ Cálculo: IF refVert = "Arriba" THEN distVert ELSE 0
   └─ Actualiza automáticamente

10. FR1 Margin Bottom (mm)
    ├─ Tipo: Display (read-only)
    ├─ Cálculo: IF refVert = "Abajo" THEN distVert ELSE 0
    └─ Actualiza automáticamente
```

## RF-4: Gráfico Interactivo de Visualización
```
COMPONENTE: SVG Diagram (interactivo)
UBICACIÓN: Debajo de campos FR1
TAMAÑO: 600x400 px (responsive)
ACTUALIZACIÓN: En tiempo real al cambiar valores

ELEMENTOS DEL GRÁFICO:

1. RECTÁNGULO BASE (Rollo LÁMINA)
   ├─ Representa: Width × Repetition del rollo
   ├─ Color: Blanco/Gris claro (#F5F5F5)
   ├─ Borde: 2px solid #333
   └─ Etiqueta: "LÁMINA (W×R)"

2. RECTÁNGULO FR1 (Fotoregistro)
   ├─ Representa: FR1 Width × FR1 Height
   ├─ Posición: Calculada según referencias
   ├─ Color: Azul (#4A90E2)
   ├─ Relleno: Semitransparente
   └─ Etiqueta: "FR1 (WWxHH mm)"

3. FLECHAS Y LÍNEAS DE REFERENCIA
   ├─ Líneas punteadas: Desde referencias a bordes
   ├─ Color: Gris (#CCCCCC)
   ├─ Mostrar: Distancias (números)
   └─ Indicar: Márgenes en mm

4. ANOTACIONES DE MÁRGENES
   ├─ Margin Left: Etiqueta en lado izquierdo
   ├─ Margin Right: Etiqueta en lado derecho
   ├─ Margin Top: Etiqueta en lado superior
   └─ Margin Bottom: Etiqueta en lado inferior

5. LEYENDA
   ├─ Mostrar: Escala de renderización
   ├─ Mostrar: Dimensiones totales de rollo
   ├─ Mostrar: Dimensiones FR1
   └─ Mostrar: Márgenes calculados

EJEMPLO GRÁFICO:

┌─────────────────────────────────────────────┐
│                 LÁMINA                       │
│  (width: 500mm × repetition: 800mm)         │
│                                              │
│  ┌──────────────────────────────────────┐   │
│  │                                      │   │
│  │  Margin Top = 15mm                   │   │
│  │                                      │   │
│  │     ┌──────────────────┐             │   │
│  │     │ FR1              │             │   │
│  │     │ (100×80mm)       │             │   │
│  │     │                  │             │   │
│  │     └──────────────────┘             │   │
│  │                                      │   │
│  │  Margin Bottom = 0mm                 │   │
│  │                                      │   │
│  └──────────────────────────────────────┘   │
│   ↑                                         │
│   Margin Left = 20mm                        │
│   Margin Right = 0mm                        │
└─────────────────────────────────────────────┘
```

## RF-5: Actualización Automática del Gráfico
```
TRIGGER: onChange en CUALQUIER campo
├─ FR1 Width
├─ FR1 Height
├─ Referencia Horizontal
├─ Referencia Vertical
├─ Distancia Horizontal
└─ Distancia Vertical

COMPORTAMIENTO:
├─ Recalcular márgenes inmediatamente
├─ Redibujar gráfico (SVG re-render)
├─ Animar transición (200ms)
└─ Mostrar nuevos valores en gráfico

PERFORMANCE:
├─ Debounce: 300ms (evitar re-renders excesivos)
└─ Smooth animation: CSS transition
```

## RF-6: Validaciones de Fotoregistro
```
VALIDACIÓN 1: Campos Requeridos
├─ IF FR = Sí AND CUALQUIER campo NULL:
│  ├─ Mostrar error: "Todos los campos FR1 son obligatorios"
│  ├─ Campo rojo
│  └─ Bloquear submit
└─ IF FR = No:
   └─ No validar (campos ignorados)

VALIDACIÓN 2: Rangos
├─ Width: 1-9999 mm
├─ Height: 1-9999 mm
├─ Distancia H: 0-9999 mm
└─ Distancia V: 0-9999 mm

VALIDACIÓN 3: Lógica
├─ FR Width < Perímetro (aviso si no se cumple)
├─ FR Height < Perímetro
└─ Márgenes deben ser coherentes

VALIDACIÓN 4: Coherencia Geométrica
├─ IF refHoriz = Izquierda AND marginLeft = 0:
│  └─ Mostrar advertencia: "Margen izquierdo no calculado"
└─ Similar para otros márgenes
```

## RF-7: Restricciones
```
RESTRICCIÓN 1: Solo UN Fotoregistro
├─ NO hay FR2
├─ NO hay opción "¿Cuántos FR?"
└─ El sistema acepta SOLO FR1

RESTRICCIÓN 2: Datos Históricos
├─ IF Usuario tenía 2 FR en versión anterior:
│  ├─ Migrar datos de FR1 a nuevo formato
│  └─ DESCARTAR datos de FR2 (downgrade)
└─ Mostrar advertencia en UI

RESTRICCIÓN 3: Cuando Cambiar Envoltura
├─ IF Usuario cambia de LÁMINA a BOLSA:
│  └─ LIMPIAR completamente datos FR
├─ IF Usuario cambia de BOLSA a LÁMINA:
│  └─ Mostrar opción de recuperar datos (si existen)
└─ NO permiten ambigüedad

RESTRICCIÓN 4: No Editable Después de Generar Referencia
├─ Once FR is submitted to SI system:
│  └─ Some fields become READ-ONLY
└─ (Opcional, depende de integración SI)
```

---

# 3. ESPECIFICACIONES TÉCNICAS

## Estructura de Datos (TypeScript)

```typescript
interface Fotoregistro {
  // Toggle
  hasFotoregistro: boolean; // Sí/No

  // FR1 Data
  fr1Width: number | null;           // 1-9999
  fr1Height: number | null;          // 1-9999
  fr1ReferenceHorizontal: 'left' | 'right'; // Izq/Der
  fr1ReferenceVertical: 'top' | 'bottom';   // Arriba/Abajo
  fr1DistanceHorizontal: number | null;     // 0-9999
  fr1DistanceVertical: number | null;       // 0-9999

  // Calculated Margins (READ-ONLY)
  fr1MarginLeft: number;      // Calculated
  fr1MarginRight: number;     // Calculated
  fr1MarginTop: number;       // Calculated
  fr1MarginBottom: number;    // Calculated

  // Metadata
  createdAt: Date;
  updatedAt: Date;
  validationStatus: 'valid' | 'invalid' | 'pending';
}
```

## Cálculo de Márgenes

```typescript
const calculateMargins = (
  refHorizontal: 'left' | 'right',
  refVertical: 'top' | 'bottom',
  distHorizontal: number,
  distVertical: number
): { left: number; right: number; top: number; bottom: number } => {
  return {
    left: refHorizontal === 'left' ? distHorizontal : 0,
    right: refHorizontal === 'right' ? distHorizontal : 0,
    top: refVertical === 'top' ? distVertical : 0,
    bottom: refVertical === 'bottom' ? distVertical : 0,
  };
};

// TRIGGER: Ejecutar cuando cambie cualquier referencia o distancia
const handleFotoregistroChange = (field: string, value: any) => {
  updateField(field, value);

  // Recalcular márgenes
  const margins = calculateMargins(
    form.fr1ReferenceHorizontal,
    form.fr1ReferenceVertical,
    form.fr1DistanceHorizontal,
    form.fr1DistanceVertical
  );

  updateField('fr1MarginLeft', margins.left);
  updateField('fr1MarginRight', margins.right);
  updateField('fr1MarginTop', margins.top);
  updateField('fr1MarginBottom', margins.bottom);

  // Redibujar gráfico
  updateFotoregistroVisualization();
};
```

## Componente SVG del Gráfico

```typescript
const FotoregistroVisualization: React.FC<Props> = ({
  fr1Width,
  fr1Height,
  fr1RefHoriz,
  fr1RefVert,
  fr1DistHoriz,
  fr1DistVert,
  laminaWidth,
  laminaRepetition,
}) => {
  // Escala: convertir mm a píxeles para renderización
  const SCALE = 0.3; // 1mm = 0.3px en pantalla
  
  const svgWidth = Math.min(laminaWidth * SCALE, 600);
  const svgHeight = Math.min(laminaRepetition * SCALE, 400);

  // Calcular posición FR1
  const fr1X = fr1RefHoriz === 'left' ? fr1DistHoriz * SCALE : (laminaWidth - fr1Width - fr1DistHoriz) * SCALE;
  const fr1Y = fr1RefVert === 'top' ? fr1DistVert * SCALE : (laminaRepetition - fr1Height - fr1DistVert) * SCALE;

  return (
    <svg width={svgWidth} height={svgHeight} className="fotoregistro-viz">
      {/* Base Rectángulo - LÁMINA */}
      <rect
        x="0"
        y="0"
        width={svgWidth}
        height={svgHeight}
        fill="#F5F5F5"
        stroke="#333"
        strokeWidth="2"
      />

      {/* FR1 Rectángulo */}
      <rect
        x={fr1X}
        y={fr1Y}
        width={fr1Width * SCALE}
        height={fr1Height * SCALE}
        fill="#4A90E2"
        fillOpacity="0.6"
        stroke="#2E5C8A"
        strokeWidth="2"
      />

      {/* Líneas de Referencia */}
      {/* Línea horizontal de referencia */}
      <line
        x1="0"
        y1={fr1Y}
        x2={svgWidth}
        y2={fr1Y}
        stroke="#CCCCCC"
        strokeDasharray="4,4"
        opacity="0.5"
      />

      {/* Línea vertical de referencia */}
      <line
        x1={fr1X}
        y1="0"
        x2={fr1X}
        y2={svgHeight}
        stroke="#CCCCCC"
        strokeDasharray="4,4"
        opacity="0.5"
      />

      {/* Anotaciones de Márgenes */}
      <text x="5" y={fr1Y - 5} fontSize="12" fill="#333">
        {`Margen Top: ${Math.round(fr1DistVert)}mm`}
      </text>

      <text x={fr1X - 50} y={svgHeight - 10} fontSize="12" fill="#333">
        {`Margen Left: ${Math.round(fr1DistHoriz)}mm`}
      </text>

      {/* Etiquetas de dimensiones */}
      <text
        x={fr1X + (fr1Width * SCALE) / 2}
        y={fr1Y + (fr1Height * SCALE) / 2}
        textAnchor="middle"
        fontSize="12"
        fill="white"
        fontWeight="bold"
      >
        {`FR1\n${Math.round(fr1Width)}×${Math.round(fr1Height)}mm`}
      </text>
    </svg>
  );
};
```

---

# 4. FLUJO DE INTERACCIÓN (UX)

```
PASO 1: Usuario ve "¿Desea agregar Fotoregistro?"
  ├─ Toggle: Sí / No
  └─ Default: No

PASO 2: Usuario selecciona "Sí"
  ├─ Mostrar FR1 Section (7 campos + 4 márgenes)
  ├─ Mostrar Gráfico
  └─ Gráfico vacío (sin datos)

PASO 3: Usuario ingresa datos FR1
  ├─ Ingresa: FR1 Width = 100 mm
  ├─ Ingresa: FR1 Height = 80 mm
  ├─ Selecciona: Ref Horiz = Izquierda
  ├─ Selecciona: Ref Vert = Arriba
  ├─ Ingresa: Dist Horiz = 20 mm
  ├─ Ingresa: Dist Vert = 15 mm
  └─ Gráfico se actualiza en tiempo real

PASO 4: Sistema calcula márgenes
  ├─ Margen Left = 20 mm
  ├─ Margen Right = 0 mm
  ├─ Margen Top = 15 mm
  └─ Margen Bottom = 0 mm

PASO 5: Sistema valida
  ├─ IF todos los campos OK:
  │  └─ Mostrar ✅ "Fotoregistro válido"
  ├─ ELSE:
  │  └─ Mostrar ❌ "Error: campos inválidos"
  └─ Bloquear/Habilitar submit

PASO 6: Usuario guarda proyecto
  ├─ IF FR = Sí Y todos los campos válidos:
  │  └─ Guardar datos FR1
  ├─ ELSE:
  │  └─ Mostrar error modal
  └─ Si todo OK → Proyecto guardado ✅
```

---

# 5. CASOS DE PRUEBA (10 Total)

## TC-1: Habilitar/Deshabilitar Fotoregistro
```
Precondición: Envoltura = LÁMINA, Fotoregistro = No
Pasos:
  1. Hacer clic en toggle "Sí"
Resultado esperado:
  ✅ Mostrar FR1 section
  ✅ Gráfico visible
  ✅ Todos los campos obligatorios
```

## TC-2: Ingreso de Dimensiones FR1
```
Precondición: Fotoregistro = Sí, campos vacíos
Pasos:
  1. Ingresar FR1 Width = 100 mm
  2. Ingresar FR1 Height = 80 mm
Resultado esperado:
  ✅ Valores aceptados
  ✅ Gráfico actualizado
  ✅ Sin errores de validación
```

## TC-3: Cálculo de Márgenes - Referencia Izquierda/Arriba
```
Precondición: FR1 completo con Ref Horiz=Izq, Ref Vert=Arriba
Pasos:
  1. Seleccionar Ref Horiz = Izquierda
  2. Seleccionar Ref Vert = Arriba
  3. Ingresar Dist Horiz = 25 mm
  4. Ingresar Dist Vert = 15 mm
Resultado esperado:
  ✅ Margen Left = 25 mm
  ✅ Margen Right = 0 mm
  ✅ Margen Top = 15 mm
  ✅ Margen Bottom = 0 mm
```

## TC-4: Cálculo de Márgenes - Referencia Derecha/Abajo
```
Precondición: FR1 completo con Ref Horiz=Der, Ref Vert=Abajo
Pasos:
  1. Seleccionar Ref Horiz = Derecha
  2. Seleccionar Ref Vert = Abajo
  3. Ingresar Dist Horiz = 30 mm
  4. Ingresar Dist Vert = 20 mm
Resultado esperado:
  ✅ Margen Left = 0 mm
  ✅ Margen Right = 30 mm
  ✅ Margen Top = 0 mm
  ✅ Margen Bottom = 20 mm
```

## TC-5: Actualización Dinámica de Gráfico
```
Precondición: FR1 con datos iniciales
Pasos:
  1. Cambiar FR1 Width de 100 a 150 mm
  2. Observar gráfico
Resultado esperado:
  ✅ Gráfico se redibuja (animación 200ms)
  ✅ Rectángulo FR1 más ancho
  ✅ Posiciones relativas actualizadas
```

## TC-6: Validación de Rango Width
```
Precondición: FR1 Width = 0 mm (fuera de rango)
Pasos:
  1. Ingresar FR1 Width = 0
  2. Presionar Tab (blur)
Resultado esperado:
  ✅ Mostrar error: "Width debe estar entre 1 y 9999 mm"
  ✅ Campo rojo
  ✅ Bloquear submit
```

## TC-7: Validación de Rango Height
```
Precondición: FR1 Height = 10000 mm (fuera de rango)
Pasos:
  1. Ingresar FR1 Height = 10000
  2. Presionar Tab (blur)
Resultado esperado:
  ✅ Mostrar error: "Height debe estar entre 1 y 9999 mm"
  ✅ Campo rojo
  ✅ Bloquear submit
```

## TC-8: Campo Requerido - Referencia Faltante
```
Precondición: FR = Sí, Ref Horiz = vacío
Pasos:
  1. Dejar Ref Horiz sin seleccionar
  2. Presionar guardar
Resultado esperado:
  ✅ Mostrar error: "Referencia Horizontal requerida"
  ✅ Bloquear submit
```

## TC-9: Cambiar de Envoltura (Limpieza)
```
Precondición: FR1 con datos completos, Envoltura = LÁMINA
Pasos:
  1. Cambiar Envoltura a BOLSA
Resultado esperado:
  ✅ Ocultar Fotoregistro section
  ✅ Limpiar datos FR1 (set to NULL)
  ✅ No guardar datos FR1
```

## TC-10: Validar Coherencia Geométrica
```
Precondición: FR1 con márgenes calculados
Pasos:
  1. Verificar que FR1 no se salga del rollo
Resultado esperado:
  ✅ IF FR1 + márgenes > Perímetro:
     └─ Mostrar advertencia (no error)
  ✅ Permitir guardar (user decision)
```

---

# 6. EJEMPLO PRÁCTICO COMPLETO

## Escenario: LÁMINA Genérica con Fotoregistro

```
DATOS DE ENTRADA:
├─ Envoltura: LÁMINA
├─ Tipo: Genérica
├─ Width: 500 mm
├─ Repetition: 800 mm
├─ Perímetro: 2×(500+800) = 2600 mm ✅
├─ Fotoregistro: Sí
│  ├─ FR1 Width: 100 mm
│  ├─ FR1 Height: 80 mm
│  ├─ Ref Horiz: Izquierda
│  ├─ Ref Vert: Arriba
│  ├─ Dist Horiz: 25 mm
│  └─ Dist Vert: 20 mm
└─ Material Core: MAT-001 (Cartón Blanco)

CÁLCULOS AUTOMÁTICOS:
├─ Perímetro = 2600 mm ✅
├─ Margen Left = 25 mm (ref izq + dist 25)
├─ Margen Right = 0 mm
├─ Margen Top = 20 mm (ref arriba + dist 20)
└─ Margen Bottom = 0 mm

GRÁFICO RESULTADO:
┌────────────────────────────────────────────┐
│           LÁMINA 500×800mm                 │
│  Perímetro: 2600mm                         │
│                                            │
│  Margin Top: 20mm                          │
│  ┌─────────────────────────────────────┐   │
│  │                                     │   │
│  │  ┌──────────────┐                   │   │
│  │  │ FR1          │                   │   │
│  │  │ 100×80mm     │                   │   │
│  │  │              │                   │   │
│  │  └──────────────┘                   │   │
│  │                                     │   │
│  └─────────────────────────────────────┘   │
│  ↑                                         │
│  Margin Left: 25mm    Margin Right: 0mm    │
│  Margin Bottom: 0mm                        │
└────────────────────────────────────────────┘

VALIDACIÓN:
├─ Width (100) < Perímetro (2600): ✅ OK
├─ Height (80) < Perímetro (2600): ✅ OK
├─ Márgenes coherentes: ✅ OK
└─ ESTADO GENERAL: ✅ VALIDADO

RESULTADO GUARDADO:
├─ Proyecto ID: PROJ-12345
├─ Fotoregistro: Habilitado
├─ FR1: 100×80mm @ 25/20 (Izq/Arriba)
├─ Márgenes: 25/0/20/0 (L/R/T/B)
└─ Estado: ✅ Guardado exitosamente
```

---

# 7. RESTRICCIONES IMPLEMENTADAS

## REST-F1: Solo UN Fotoregistro
```
❌ NO hay FR2
❌ NO hay opción "¿Cuántos FR?"
✅ Sistema acepta SOLO FR1
```

## REST-F2: Exclusividad LÁMINA
```
✅ Fotoregistro visible SOLO si Envoltura = LÁMINA
❌ Fotoregistro oculto en BOLSA y POUCH
❌ Si cambias envoltura: limpiar datos FR
```

## REST-F3: No Editable Post-Submisión
```
Opcional: Si FR se envía a SI, algunos campos pueden ser read-only
Depende de integración con Sistema Integral
```

---

# 8. INTEGRACIÓN CON OTROS MÓDULOS

## Integración con Perímetro
```
DEPENDENCIA: RF-Período (debe estar calculado antes de FR)

Flujo:
  1. Usuario ingresa Width y Repetition
  2. Sistema calcula Perímetro automáticamente
  3. Usuario habilita Fotoregistro
  4. Sistema valida que FR no exceda Perímetro
  5. Mostrar advertencia si no es coherente
```

## Integración con Material [SI]
```
DEPENDENCIA: Material Core [SI] (requerido)

Flujo:
  1. User selecciona Material Core
  2. FR1 se configura independientemente
  3. Al guardar, ambos se persisten en SI
```

---

# 9. ESPECIFICACIONES DE VALIDACIÓN

| Validación | Tipo | Rango/Opciones | Bloquea | Error Message |
|:---|:---:|:---|:---:|:---|
| **Fotoregistro Toggle** | Boolean | Sí/No | ⚪ No | - |
| **FR1 Width** | Number | 1-9999 mm | ✅ Sí | "Width: 1-9999 mm" |
| **FR1 Height** | Number | 1-9999 mm | ✅ Sí | "Height: 1-9999 mm" |
| **FR1 Ref Horiz** | Enum | Izq/Der | ✅ Sí | "Referencia requerida" |
| **FR1 Ref Vert** | Enum | Arriba/Abajo | ✅ Sí | "Referencia requerida" |
| **FR1 Dist Horiz** | Number | 0-9999 mm | ✅ Sí | "Distancia: 0-9999 mm" |
| **FR1 Dist Vert** | Number | 0-9999 mm | ✅ Sí | "Distancia: 0-9999 mm" |
| **FR1 Margins** | Calculated | Auto | ⚪ No | - |

---

# 10. RECURSOS REQUERIDOS

## Componentes React Necesarios
```
✅ FotoregistroSection.tsx (componente principal)
✅ FotoregistroVisualization.tsx (gráfico SVG)
✅ fotoregistroValidation.ts (lógica de validación)
✅ fotoregistroCalculations.ts (lógica de cálculos)
```

## Integraciones
```
✅ ProductEditPage.tsx (container)
✅ API integration (save FR1 data to SI)
✅ Perímetro calculator (dependency)
✅ Error handling (validation errors)
```

## Assets Necesarios
```
✅ SVG diagram template
✅ CSS para animaciones (200ms transition)
✅ Responsive design (600x400px → mobile)
```

---

**📸 HU FOTOREGISTRO COMPLETO - IMPLEMENTACIÓN LISTA** ✅

**Resumen:**
- ✅ Especificación técnica completa
- ✅ 10 casos de prueba
- ✅ Gráfico SVG interactivo
- ✅ Cálculo automático de márgenes
- ✅ Validaciones exhaustivas
- ✅ Ejemplo práctico paso-a-paso
- ✅ Story Points: 13
- ✅ LISTO PARA DESARROLLAR

**Cambio Principal Respecto Versión Anterior:**
- Versión 1: Permitía hasta 2 FR (FR1 + FR2)
- Versión 2: **Solo 1 FR (FR1)** - Simplificación
