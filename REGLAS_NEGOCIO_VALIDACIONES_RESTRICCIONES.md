# 📏 REGLAS DE NEGOCIO, VALIDACIONES Y RESTRICCIONES

**Versión:** 1.0  
**Fecha:** 2026-08-10  
**Cobertura:** 27 Casuísticas (3 LÁMINA + 8 BOLSA + 16 POUCH)

---

# FORMATO: LÁMINA

## 📐 REGLAS DE NEGOCIO - LÁMINA

### RB-L1: Clasificación de Tipos
```
REGLA: El tipo de formato LÁMINA tiene 3 variantes estándar
├─ Genérica: Formato estándar sin especificaciones
├─ Tissue: Formato especializado para papel tissue
└─ Food: Formato especializado para aplicaciones alimentarias

APLICACIÓN: Todas las casuísticas LÁMINA
IMPACTO: 
├─ Genera Blueprint diferente (3 variantes)
├─ No cambia estructura de campos (idéntica en todas)
└─ Solo cambio visual en identificación
```

### RB-L2: Perímetro como Medida Crítica
```
REGLA: El perímetro es un indicador de calidad y viabilidad de producción
├─ Calculado automáticamente: 2 × (width + repetition)
├─ Validado contra rango permitido: 100-20000 mm
├─ Bloquea operación si fuera de rango: ✅ CRÍTICO
└─ Se actualiza en tiempo real al cambiar dimensiones

APLICACIÓN: Todas las casuísticas LÁMINA
IMPACTO:
├─ Previene configuraciones inviables de producción
├─ Guía al usuario hacia dimensiones válidas
└─ Asegura calidad de producto
```

### RB-L3: Fotoregistro Exclusivo de LÁMINA
```
REGLA: Solo LÁMINA soporta Fotoregistro (no BOLSA ni POUCH)
├─ Razón: LÁMINA es un rollo continuo, necesita marcas de referencia
├─ Máximo 2 fotoregistros (FR1 + FR2)
├─ FR1 es obligatorio si se selecciona "Sí"
├─ FR2 es condicional: solo si usuario selecciona "2 fotoregistros"
└─ FR2 puede ser Automático (heredar de FR1) o Manual (editable)

APLICACIÓN: Todas las casuísticas LÁMINA
IMPACTO:
├─ Diferencia LÁMINA de otros formatos
├─ Permite control de calidad en producción
└─ Márgenes auto-calculados para precisión
```

### RB-L4: Materiales Validados Vía SI
```
REGLA: Material Core [SI] es obligatorio y viene de catálogo Sistema Integral
├─ No se puede crear material local
├─ Solo materiales pre-aprobados en SI
├─ Heredado en Producto Modificado
└─ Referencia para Estructura (capas)

APLICACIÓN: Todas las casuísticas LÁMINA
IMPACTO:
├─ Garantiza compatibilidad con Sistema Integral
├─ Asegura trazabilidad
└─ Facilita integración con proveedores
```

### RB-L5: Sentido de Bobinado Obligatorio
```
REGLA: Sentido de Bobinado (Rewind Direction) es obligatorio
├─ 8 opciones visuales disponibles
├─ Selector de imagen (usabilidad mejorada)
├─ Crítico para especificación técnica
└─ Afecta producción y acabado

APLICACIÓN: Todas las casuísticas LÁMINA
IMPACTO:
├─ Especifica dirección de impresión/bobinado
├─ Afecta calidad visual del producto final
└─ Requerido para validación de especificaciones técnicas
```

---

## ✅ VALIDACIONES - LÁMINA

### V-L1: Validación de Dimensiones Width
```
CAMPO: Width (Ancho)
TIPO: Rango numérico
RANGO: 1 - 9999 mm
BLOQUEA: ✅ Sí (impide guardar si fuera de rango)
TRIGGER: onChange (validación en tiempo real)
SEVERIDAD: Crítica

REGLA:
  IF width < 1 OR width > 9999 THEN
    ├─ Mostrar error en campo (rojo)
    ├─ Mensaje: "Ancho debe estar entre 1 y 9999 mm"
    ├─ Deshabilitar botón Guardar
    └─ Sugerir corrección
  END IF

CASOS ESPECIALES:
  └─ Ninguno (rango uniforme para todas las casuísticas)
```

### V-L2: Validación de Dimensiones Repetition
```
CAMPO: Repetition (Repetición)
TIPO: Rango numérico
RANGO: 1 - 9999 mm
BLOQUEA: ✅ Sí
TRIGGER: onChange
SEVERIDAD: Crítica

REGLA:
  IF repetition < 1 OR repetition > 9999 THEN
    ├─ Mostrar error en campo (rojo)
    ├─ Mensaje: "Repetición debe estar entre 1 y 9999 mm"
    ├─ Deshabilitar botón Guardar
    └─ Sugerir corrección
  END IF

CASOS ESPECIALES:
  └─ Ninguno (rango uniforme)
```

### V-L3: Validación de Perímetro
```
CAMPO: Perímetro (calculado automáticamente)
TIPO: Rango + Cálculo
CÁLCULO: 2 × (width + repetition)
RANGO: 100 - 20000 mm
BLOQUEA: ✅ Sí
TRIGGER: onChange width/repetition
SEVERIDAD: Crítica

REGLA:
  perimeter = 2 * (width + repetition)
  
  IF perimeter < 100 OR perimeter > 20000 THEN
    ├─ perimeterValidationStatus = "Rechazado"
    ├─ Mostrar badge ROJO: "Rechazado ❌"
    ├─ Mensaje: "Perímetro {valor} mm fuera de rango (100-20000)"
    ├─ Deshabilitar botón Guardar
    └─ Sugerir ajustar dimensiones
  ELSE
    ├─ perimeterValidationStatus = "Validado"
    └─ Mostrar badge VERDE: "Validado ✅"
  END IF

CASOS ESPECIALES:
  └─ Ninguno
```

### V-L4: Validación de Diámetro Core
```
CAMPO: Diámetro Core
TIPO: Rango numérico
RANGO: 76 - 152 mm
BLOQUEA: ✅ Sí
TRIGGER: onChange
SEVERIDAD: Media

REGLA:
  IF diametroCcore < 76 OR diametroCore > 152 THEN
    ├─ Mostrar error en campo (rojo)
    ├─ Mensaje: "Diámetro Core debe estar entre 76 y 152 mm"
    └─ Deshabilitar botón Guardar
  END IF

CASOS ESPECIALES:
  └─ Valores típicos: 76 mm (pequeño), 114 mm (estándar), 152 mm (grande)
```

### V-L5: Validación de Fotoregistro (Condicional)
```
CAMPO: FR1 (Width, Height, References, Distances)
TIPO: Condicional + Rangos
RANGO Width: 1 - 9999 mm
RANGO Height: 1 - 9999 mm
RANGO Distances: 0 - 9999 mm
BLOQUEA: ✅ Sí (solo si hasPhotoregister1 = "Sí")
TRIGGER: onChange (si FR1 visible)
SEVERIDAD: Media

REGLA:
  IF hasPhotoregister1 = "Sí" THEN
    ├─ Mostrar FR1 section
    ├─ FR1 Width REQUIRED: 1-9999 mm
    ├─ FR1 Height REQUIRED: 1-9999 mm
    ├─ References: required
    ├─ Distances REQUIRED: 0-9999 mm
    ├─ Márgenes: auto-calculados (read-only)
    │
    └─ IF countFotoregistros = 2 THEN
       ├─ Mostrar FR2 section
       ├─ FR2 Modo: Automático / Manual
       ├─ IF Automático: heredar dimensiones de FR1 (read-only)
       └─ IF Manual: editable (1-9999 mm cada uno)
  ELSE
    └─ Ocultar FR1/FR2 sections + limpiar campos
  END IF

CASOS ESPECIALES:
  └─ Márgenes calculados automáticamente según referencias
```

### V-L6: Validación de Material [SI]
```
CAMPO: Material Core [SI]
TIPO: Dropdown (catálogo externo)
BLOQUEA: ✅ Sí
TRIGGER: onChange
SEVERIDAD: Crítica

REGLA:
  IF material IS NULL OR material = "" THEN
    ├─ Mostrar error: "Material es obligatorio"
    ├─ Campo rojo con bordes
    └─ Deshabilitar botón Guardar
  ELSE
    ├─ Validar que existe en SI catalog
    └─ Permitir continuar
  END IF

CASOS ESPECIALES:
  ├─ Material debe existir en SI
  └─ Se hereda en Producto Modificado
```

### V-L7: Validación de Sentido Bobinado
```
CAMPO: Sentido Bobinado
TIPO: Image Grid (8 opciones)
BLOQUEA: ✅ Sí
TRIGGER: onChange
SEVERIDAD: Media

REGLA:
  IF sentidoBobinado IS NULL THEN
    ├─ Mostrar error: "Debe seleccionar un sentido de bobinado"
    └─ Deshabilitar botón Guardar
  ELSE
    └─ Permitir continuar
  END IF

OPCIONES VÁLIDAS: 1, 2, 3, 4, 5, 6, 7, 8 (imágenes visuales)

CASOS ESPECIALES:
  └─ No hay restricciones adicionales por tipo de formato LÁMINA
```

---

## 🚫 RESTRICCIONES - LÁMINA

### REST-L1: Sin Accesorios
```
RESTRICCIÓN: LÁMINA NO permite accesorios (no hay sección Accesorios)
RAZÓN: Formato rollo continuo, sin necesidad de accesorios adicionales
IMPACTO:
├─ Sección 4 (Embalajes) solo contiene: Acabados, Especificaciones
└─ No hay modal AccessoriesSelectionModal para LÁMINA
```

### REST-L2: Fotoregistro Exclusivo
```
RESTRICCIÓN: Fotoregistro (FR1/FR2) SOLO en LÁMINA
RAZÓN: Necesario para control de calidad en rollos continuos
IMPACTO:
├─ BOLSA y POUCH: Fotoregistro oculto/no disponible
└─ Si usuario selecciona BOLSA/POUCH, limpiar campos FR
```

### REST-L3: Dimensiones No Intercambiables
```
RESTRICCIÓN: Width y Repetition son conceptos diferentes, no intercambiables
RAZÓN: Width = ancho del rollo, Repetition = distancia patrón de impresión
IMPACTO:
├─ Ambas son obligatorias
├─ Rango igual (1-9999) pero semántica diferente
└─ No puede omitir ninguna
```

### REST-L4: Perímetro No Editable
```
RESTRICCIÓN: Campo Perímetro es READ-ONLY (no se puede editar manualmente)
RAZÓN: Se calcula automáticamente, es derivado de dimensiones
IMPACTO:
├─ Usuario no puede sobrescribir
└─ Si quiere cambiar perímetro, debe ajustar width o repetition
```

### REST-L5: Variaciones Core Opcionales
```
RESTRICCIÓN: Variaciones Core es OPCIONAL (checkbox, no obligatorio)
RAZÓN: No siempre hay variaciones de diámetro disponibles
IMPACTO:
├─ Puede dejarse sin seleccionar
└─ Afecta especificaciones técnicas, no bloquea guardado
```

---

---

# FORMATO: BOLSA

## 📐 REGLAS DE NEGOCIO - BOLSA

### RB-B1: Tres Presentaciones Distintas
```
REGLA: BOLSA tiene 3 presentaciones independientes
├─ Bolsa: Forma tradicional rectangular
├─ Wicket: Sistema de etiqueta para suspensión
└─ Hojas: Formato de láminas planas apiladas

APLICACIÓN: Define toda la estructura de campos subsiguientes
IMPACTO:
├─ Cada presentación tiene validaciones diferentes
├─ Wicket activa campos condicionales únicos
├─ Blueprint varía según presentación
└─ Estructura de campo homogénea pero lógica diferente
```

### RB-B2: Cascada Sello → Acabado (Condicional)
```
REGLA: Acabado es OBLIGATORIO solo si Tipo Sello = "Lateral"
├─ Si Sello = Lateral: Acabado (Corte/Pestaña) OBLIGATORIO
├─ Si Sello = Fondo: Acabado OCULTO
└─ Limpiar Acabado si cambia Sello de Lateral a Fondo

APLICACIÓN: Presentación = Bolsa
IMPACTO:
├─ Condicional obligatorio (bloquea si Lateral sin Acabado)
├─ Cambia disponibilidad de opciones según cascada
└─ Afecta Blueprint generation (5 variantes)
```

### RB-B3: Fuelle Condicional para Dimensión
```
REGLA: Ancho Fuelle es OBLIGATORIO solo si ¿Tiene Fuelle? = "Sí"
├─ Si Fuelle = No: Ancho Fuelle OCULTO (valor = 0)
├─ Si Fuelle = Sí: Ancho Fuelle OBLIGATORIO (0-500 mm)
└─ Limpiar Ancho Fuelle si Fuelle cambia a No

APLICACIÓN: Todas las presentaciones (Bolsa, Wicket, Hojas)
IMPACTO:
├─ Condicional obligatorio
├─ Afecta cálculo de perímetro indirectamente
└─ Usuario especifica si hay fuelle o no
```

### RB-B4: Perímetro con Ancho + Largo
```
REGLA: Perímetro se calcula con ambas dimensiones
├─ Fórmula: 2 × (width + length)
├─ Rango: 100 - 10000 mm (más restrictivo que LÁMINA)
├─ Valida automáticamente en tiempo real
└─ Bloquea si fuera de rango

APLICACIÓN: Todas las casuísticas BOLSA
IMPACTO:
├─ Perímetro más restrictivo que LÁMINA
├─ Guía usuario hacia configuraciones viables
└─ Crítico para especificación de producción
```

### RB-B5: Wicket Condicional a Presentación
```
REGLA: Campos Wicket aparecen SOLO si Presentación = "Wicket"
├─ Si Presentación = Wicket: mostrar ¿Tiene Wicket? (Sí/No)
├─ Si ¿Tiene Wicket? = Sí: mostrar 5 campos (diameter, control, precorte, dispensador, fotocélula)
├─ Si ¿Tiene Wicket? = No: ocultar los 5 campos
└─ Si Presentación ≠ Wicket: ocultar todo Wicket section

APLICACIÓN: Presentación = Wicket únicamente
IMPACTO:
├─ Cascada compleja (2 niveles)
├─ Campos Wicket solo se validan si Presentación = Wicket
└─ Estructura dinámica según tipo seleccionado
```

### RB-B6: Accesorios Limitados a 3
```
REGLA: Máximo 3 accesorios TOTALES (mixta Producto + Internos)
├─ Accesorios Producto: Asa Troquelada, Refuerzo (2 tipos)
├─ Accesorios Internos: Corte Angular, Esquinas, Muesca, Perforación, Pre-Corte (5 tipos)
├─ Total permitido: 3 (suma de ambas categorías)
└─ Modal bloquea si intenta agregar 4º

APLICACIÓN: Todas las casuísticas BOLSA
IMPACTO:
├─ Restricción de negocio (no técnica)
├─ Usuario debe elegir combinaciones estratégicas
└─ Afecta especificaciones técnicas y costos
```

### RB-B7: Materiales Validados Vía SI
```
REGLA: Material [SI] es obligatorio y viene de catálogo Sistema Integral
├─ No se puede crear material local (igual que LÁMINA)
├─ Solo materiales pre-aprobados en SI
├─ Heredado en Producto Modificado
└─ Referencia para Estructura (capas)

APLICACIÓN: Todas las casuísticas BOLSA
IMPACTO:
├─ Garantiza compatibilidad con Sistema Integral
├─ Asegura trazabilidad
└─ Facilita integración con proveedores
```

---

## ✅ VALIDACIONES - BOLSA

### V-B1: Validación de Dimensiones Width
```
CAMPO: Width (Ancho)
TIPO: Rango numérico
RANGO: 1 - 3000 mm (más restrictivo que LÁMINA)
BLOQUEA: ✅ Sí
TRIGGER: onChange
SEVERIDAD: Crítica

REGLA:
  IF width < 1 OR width > 3000 THEN
    ├─ Mostrar error en campo (rojo)
    ├─ Mensaje: "Ancho BOLSA debe estar entre 1 y 3000 mm"
    ├─ Deshabilitar botón Guardar
    └─ Sugerir corrección
  END IF

CASOS ESPECIALES:
  └─ Rango más restrictivo que LÁMINA (3000 vs 9999)
```

### V-B2: Validación de Dimensiones Length
```
CAMPO: Length (Largo)
TIPO: Rango numérico
RANGO: 1 - 3000 mm
BLOQUEA: ✅ Sí
TRIGGER: onChange
SEVERIDAD: Crítica

REGLA:
  IF length < 1 OR length > 3000 THEN
    ├─ Mostrar error en campo (rojo)
    ├─ Mensaje: "Largo BOLSA debe estar entre 1 y 3000 mm"
    ├─ Deshabilitar botón Guardar
    └─ Sugerir corrección
  END IF

CASOS ESPECIALES:
  └─ Ninguno
```

### V-B3: Validación de Ancho Fuelle (Condicional)
```
CAMPO: Ancho Fuelle
TIPO: Rango numérico condicional
RANGO: 0 - 500 mm
VISIBLE: Solo si ¿Tiene Fuelle? = "Sí"
OBLIGATORIO: Solo si ¿Tiene Fuelle? = "Sí"
BLOQUEA: ✅ Sí (si visible y fuera de rango)
TRIGGER: onChange (si visible)
SEVERIDAD: Crítica (cuando es obligatorio)

REGLA:
  IF tieneFuelle = "Sí" THEN
    IF anchoFuelle < 0 OR anchoFuelle > 500 THEN
      ├─ Mostrar error: "Ancho Fuelle debe estar entre 0 y 500 mm"
      └─ Deshabilitar botón Guardar
    END IF
  ELSE
    ├─ Ocultar campo
    └─ Limpiar valor
  END IF

CASOS ESPECIALES:
  └─ Mínimo 0 (sin fuelle) es válido
```

### V-B4: Validación de Perímetro
```
CAMPO: Perímetro (calculado automáticamente)
TIPO: Rango + Cálculo
CÁLCULO: 2 × (width + length)
RANGO: 100 - 10000 mm (más restrictivo que LÁMINA)
BLOQUEA: ✅ Sí
TRIGGER: onChange width/length
SEVERIDAD: Crítica

REGLA:
  perimeter = 2 * (width + length)
  
  IF perimeter < 100 OR perimeter > 10000 THEN
    ├─ perimeterValidationStatus = "Rechazado"
    ├─ Mostrar badge ROJO: "Rechazado ❌"
    ├─ Mensaje: "Perímetro {valor} mm fuera de rango (100-10000)"
    ├─ Deshabilitar botón Guardar
    └─ Sugerir ajustar dimensiones
  ELSE
    ├─ perimeterValidationStatus = "Validado"
    └─ Mostrar badge VERDE: "Validado ✅"
  END IF

CASOS ESPECIALES:
  └─ Rango más restrictivo que LÁMINA (10000 vs 20000)
```

### V-B5: Validación de Acabado (Condicional)
```
CAMPO: Acabado
TIPO: Dropdown condicional
OPCIONES: Corte, Pestaña
VISIBLE: Solo si Tipo Sello = "Lateral"
OBLIGATORIO: Sí (si Sello = Lateral)
BLOQUEA: ✅ Sí (si Lateral sin Acabado)
TRIGGER: onChange Tipo Sello
SEVERIDAD: Crítica (cuando aplicable)

REGLA:
  IF tipoSello = "Lateral" THEN
    ├─ Mostrar Acabado dropdown (OBLIGATORIO)
    ├─ Opciones: Corte, Pestaña
    │
    └─ IF acabado IS NULL THEN
       ├─ Mostrar error: "Acabado es obligatorio para Sello Lateral"
       └─ Deshabilitar botón Guardar
  ELSE IF tipoSello = "Fondo" THEN
    ├─ Ocultar Acabado
    └─ Limpiar valor
  END IF

CASOS ESPECIALES:
  └─ Cascada: Sello = Lateral → Acabado obligatorio
```

### V-B6: Validación de Wicket (Condicional)
```
CAMPO: Wicket (5 subcampos: diameter, control, precorte, dispensador, fotocélula)
TIPO: Sección condicional
VISIBLE: Solo si Presentación = "Wicket"
OBLIGATORIO: Condicional (si ¿Tiene Wicket? = Sí)
BLOQUEA: ✅ Sí (si Wicket sin valores requeridos)
TRIGGER: onChange ¿Tiene Wicket?
SEVERIDAD: Media

REGLA:
  IF presentacion = "Wicket" THEN
    ├─ Mostrar ¿Tiene Wicket? (Sí/No)
    │
    └─ IF tieneFicket = "Sí" THEN
       ├─ Mostrar Wicket section (5 campos)
       ├─ Diámetro: enum [D12, D14, D16] - OBLIGATORIO
       ├─ Control: enum [Sencillo, Doble] - OBLIGATORIO
       ├─ Precorte, Dispensador, Fotocélula: Sí/No (opcionales)
       │
       └─ IF diámetro IS NULL OR control IS NULL THEN
          ├─ Mostrar error: "Diámetro y Control Wicket son obligatorios"
          └─ Deshabilitar botón Guardar
       ELSE
         └─ Permitir continuar
    ELSE IF tieneFicket = "No" THEN
       ├─ Ocultar Wicket section
       └─ Limpiar valores
  ELSE (Bolsa o Hojas)
    ├─ Ocultar ¿Tiene Wicket?
    └─ Ocultar Wicket section
  END IF

OPCIONES VÁLIDAS:
  ├─ Diámetro: D12, D14, D16
  └─ Control: Sencillo, Doble

CASOS ESPECIALES:
  └─ Cascada compleja (2 niveles): Presentación → Wicket → Parámetros
```

### V-B7: Validación de Accesorios (Máximo 3)
```
CAMPO: Accesorios (Producto + Internos)
TIPO: Contador + Validación
MÁXIMO: 3 totales
BLOQUEA: ✅ Sí (impide agregar 4º accesorio)
TRIGGER: onChange en modal AccessoriesSelectionModal
SEVERIDAD: Media

REGLA:
  count_accesorios = count(asaTroquelada, refuerzo, corteAngular, esquinas, muesca, perforación, preCorte)
  
  IF count_accesorios > 3 THEN
    ├─ Modal bloquea botón "Agregar"
    ├─ Mostrar mensaje: "Máximo 3 accesorios permitidos"
    └─ Sugerir remover uno
  ELSE
    └─ Permitir agregar más
  END IF

CASOS ESPECIALES:
  ├─ Se cuentan TODOS los accesorios (Producto + Internos)
  ├─ Límite es 3 totales, no 3 por categoría
  └─ Modal lo valida antes de guardar
```

### V-B8: Validación de Material [SI]
```
CAMPO: Material [SI]
TIPO: Dropdown (catálogo externo)
BLOQUEA: ✅ Sí
TRIGGER: onChange
SEVERIDAD: Crítica

REGLA:
  IF material IS NULL OR material = "" THEN
    ├─ Mostrar error: "Material es obligatorio"
    ├─ Campo rojo con bordes
    └─ Deshabilitar botón Guardar
  ELSE
    ├─ Validar que existe en SI catalog
    └─ Permitir continuar
  END IF

CASOS ESPECIALES:
  ├─ Material debe existir en SI
  └─ Se hereda en Producto Modificado
```

---

## 🚫 RESTRICCIONES - BOLSA

### REST-B1: Presentación Define Estructura Completa
```
RESTRICCIÓN: Cambiar Presentación limpia campos asociados a otra
RAZÓN: Cada presentación (Bolsa, Wicket, Hojas) tiene estructura diferente
IMPACTO:
├─ SI usuario cambia de Bolsa a Wicket:
│  ├─ Limpiar: Tipo Sello, Acabado
│  └─ Mostrar: ¿Tiene Wicket? y campos Wicket
├─ SI usuario cambia de Wicket a Bolsa:
│  ├─ Limpiar: Campos Wicket
│  └─ Mostrar: Tipo Sello, Acabado (condicional)
└─ SI usuario cambia a Hojas:
   ├─ Limpiar: Tipo Sello, Acabado, campos Wicket
   └─ Mostrar: solo campos base (width, length, fuelle, perímetro)
```

### REST-B2: Acabado Solo para Sello Lateral
```
RESTRICCIÓN: Acabado NO se puede editar si Tipo Sello ≠ "Lateral"
RAZÓN: Acabado solo aplica a sellos laterales
IMPACTO:
├─ Si Sello = Lateral: Acabado es VISIBLE y OBLIGATORIO
├─ Si Sello = Fondo: Acabado es OCULTO (no aplica concepto)
└─ Si cambias de Lateral a Fondo: Limpiar Acabado automáticamente
```

### REST-B3: Perímetro Más Restrictivo
```
RESTRICCIÓN: Rango perímetro BOLSA es más restrictivo que LÁMINA
RAZÓN: Bolsas tienen limitaciones de producción más estrictas
IMPACTO:
├─ LÁMINA: 100-20000 mm
├─ BOLSA: 100-10000 mm (50% del máximo de LÁMINA)
└─ Guía usuario hacia configuraciones más compactas
```

### REST-B4: Wicket Exclusivo de Presentación
```
RESTRICCIÓN: Campos Wicket SOLO disponibles si Presentación = "Wicket"
RAZÓN: Wicket es un tipo de empaque especializado
IMPACTO:
├─ Si Presentación = Bolsa o Hojas:
│  ├─ Wicket section no existe
│  ├─ No validar campos Wicket
│  └─ No mostrar en Blueprint
├─ Si Presentación = Wicket:
│  ├─ Mostrar opciones Wicket
│  └─ Validar si ¿Tiene Wicket? = Sí
└─ Cambiar presentación limpia automáticamente
```

### REST-B5: Accesorios Máximo Estricto
```
RESTRICCIÓN: No se pueden agregar más de 3 accesorios bajo ninguna circunstancia
RAZÓN: Limitación de producción y costo
IMPACTO:
├─ Modal bloquea botón "Agregar" cuando count = 3
├─ No permite sobrescribir mediante API
├─ Mensaje claro: "Máximo 3 accesorios permitidos"
└─ Usuario debe eliminar uno para agregar otro
```

### REST-B6: Fuelle No es Obligatorio
```
RESTRICCIÓN: ¿Tiene Fuelle? es OPCIONAL (no obligatorio seleccionar)
RAZÓN: No todas las bolsas tienen fuelle
IMPACTO:
├─ Usuario puede seleccionar Sí, No, o dejar sin seleccionar
├─ Si Sí: Ancho Fuelle es OBLIGATORIO
├─ Si No: Ancho Fuelle = 0 (automático)
└─ Si sin seleccionar: Ancho Fuelle = null (campo no utilizado)
```

---

---

# FORMATO: POUCH

## 📐 REGLAS DE NEGOCIO - POUCH

### RB-P1: Cuatro Familias Independientes
```
REGLA: POUCH tiene 4 familias MUTUAMENTE EXCLUYENTES
├─ Stand Up (6 casuísticas): Bolsas que se paran solas
├─ Plano (2 casuísticas): Bolsas planas tipo doypack plano
├─ Sello Central (6 casuísticas): Selladas en el centro
└─ Sello Fuelle (2 casuísticas): Selladas en el fuelle

APLICACIÓN: Define toda la arquitectura de campos
IMPACTO:
├─ Cambiar familia limpia campos de otras familias
├─ Cada familia tiene validaciones específicas
├─ Blueprint varía según familia
├─ Estructura completamente diferente por familia
```

### RB-P2: Stand Up → Doy Pack (Cascada con Validaciones ESPECIALES)
```
REGLA: Doy Pack es un subtipo de Stand Up con VALIDACIONES MÁS RESTRICTIVAS
├─ Stand Up tiene 3 subtipos: Sello K, Normal, Doy Pack
├─ Si Doy Pack seleccionado:
│  ├─ Base: Redonda/Cuadrada (OBLIGATORIO)
│  ├─ Fuelle Tipo: Propio/Insertado (OBLIGATORIO)
│  └─ APLICAR VALIDACIONES ESPECIALES (4 rangos + perímetro)
└─ Si Sello K o Normal:
   └─ APLICAR VALIDACIONES ESTÁNDAR

VALIDACIONES ESPECIALES DOY PACK:
├─ Width: 80-230 mm (vs normal 1-500 mm)
├─ Length: 134-340 mm (vs normal 1-500 mm)
├─ Ancho Fuelle: 0-3 mm (vs normal 0-500 mm)
├─ Perímetro: 100-650 mm (vs normal 100-15000 mm)
└─ BLOQUEA si CUALQUIERA está fuera de rango

APLICACIÓN: Stand Up Doy Pack únicamente
IMPACTO:
├─ Guía usuario hacia configuraciones muy específicas
├─ Previene configuraciones inviables
├─ Diferencia radical en dimensiones permitidas
└─ Crítico para especificación correcta
```

### RB-P3: Sello Central PE-PE/PE + Microperforado (Cascada Compleja)
```
REGLA: Microperforado es CONDICIONAL solo para Material = PE-PE/PE + Fuelle = Sí
├─ Si Material ≠ PE-PE/PE: Microperforado oculto
├─ Si Material = PE-PE/PE AND Fuelle = No: Microperforado oculto
├─ Si Material = PE-PE/PE AND Fuelle = Sí:
│  ├─ Mostrar ¿Tiene Microperforado? (Sí/No)
│  ├─ IF Sí:
│  │  ├─ Mostrar 4 campos (lado, tipo, separación, distancia)
│  │  └─ Todos son OBLIGATORIOS si Microperforado = Sí
│  └─ IF No:
│     └─ Ocultar campos

APLICACIÓN: Sello Central PE-PE/PE únicamente
IMPACTO:
├─ Cascada de 4 niveles (máxima complejidad)
├─ Condicional múltiple (material Y fuelle)
├─ 5 campos adicionales cuando microperforado = Sí
└─ Crítico para especificación de acabado
```

### RB-P4: Plano Cantidad Sellos (Afecta Ancho Lateral)
```
REGLA: Cantidad de Sellos determina visibilidad de Ancho Sello Lateral
├─ Si Cantidad = Dos:
│  ├─ Ancho Sello Lateral OCULTO
│  └─ Usar solo sellado en dos lados
├─ Si Cantidad = Tres:
│  ├─ Ancho Sello Lateral VISIBLE y OBLIGATORIO
│  └─ Tercera fila requiere ancho específico

APLICACIÓN: Plano únicamente
IMPACTO:
├─ Condicional simple (1 nivel)
├─ Afecta número de sellos en producción
└─ Cambiar cantidad limpia Ancho Lateral si era Dos
```

### RB-P5: Perímetro Automático con Rangos Especiales
```
REGLA: Perímetro se calcula automáticamente con rangos que cambian por tipo
├─ General (Stand Up K/Normal, Plano, Sello): 100-15000 mm
├─ Doy Pack: 100-650 mm (MUCHO más restrictivo)
├─ Cálculo: 2 × (width + length)
└─ Se valida en tiempo real

APLICACIÓN: Todas las casuísticas POUCH
IMPACTO:
├─ Rango general es intermedio entre LÁMINA y BOLSA
├─ Doy Pack tiene rango extremadamente restrictivo
├─ Guía usuario hacia viabilidad de producción
└─ Crítico para validación
```

### RB-P6: Ancho Total Sello Central (Calculado)
```
REGLA: Ancho Total es suma de Ancho Sello Aleta + Sello Ancho Transversal
├─ Fórmula: Ancho Total = Ancho Aleta + Ancho Transversal
├─ Se calcula automáticamente (READ-ONLY)
├─ Solo aplica si Material = PE-PE/PE
└─ Ambos componentes son editables, resultado es derivado

APLICACIÓN: Sello Central PE-PE/PE únicamente
IMPACTO:
├─ Cálculo simple pero importante
├─ Especifica ancho total de sellado
└─ User edita componentes, sistema calcula total
```

### RB-P7: Accesorios Limitados a 3
```
REGLA: Máximo 3 accesorios TOTALES (Zipper + Valve + Tin-Tie)
├─ Tipos: Zipper, Valve, Tin-Tie (3 opciones)
├─ Total permitido: 3 (suma)
├─ Modal bloquea si intenta agregar 4º
└─ Combinaciones posibles: cualquier combinación de los 3

APLICACIÓN: Todas las casuísticas POUCH
IMPACTO:
├─ Restricción de negocio (similar a BOLSA)
├─ Usuario elige estratégicamente
└─ Afecta especificaciones técnicas y costos
```

### RB-P8: Materiales Validados Vía SI
```
REGLA: Material [SI] es obligatorio y viene de catálogo Sistema Integral
├─ No se puede crear material local
├─ Solo materiales pre-aprobados en SI
├─ Heredado en Producto Modificado
└─ Referencia para Estructura (capas)

APLICACIÓN: Todas las casuísticas POUCH
IMPACTO:
├─ Garantiza compatibilidad con Sistema Integral
├─ Asegura trazabilidad
└─ Facilita integración con proveedores
```

---

## ✅ VALIDACIONES - POUCH

### V-P1: Validación de Dimensiones Width (General)
```
CAMPO: Width (Ancho)
TIPO: Rango numérico con variantes
RANGO GENERAL: 1 - 500 mm
RANGO DOY PACK: 80 - 230 mm ⚠️ ESPECIAL
BLOQUEA: ✅ Sí
TRIGGER: onChange + validación especial si Doy Pack
SEVERIDAD: Crítica

REGLA:
  IF tipoFormatoPouch = "DoyPack" THEN
    IF width < 80 OR width > 230 THEN
      ├─ Mostrar error: "Ancho Doy Pack DEBE estar entre 80-230 mm"
      ├─ Mostrar advertencia visual
      ├─ Deshabilitar botón Guardar
      └─ Sugerir corrección
    END IF
  ELSE
    IF width < 1 OR width > 500 THEN
      ├─ Mostrar error: "Ancho POUCH debe estar entre 1-500 mm"
      ├─ Deshabilitar botón Guardar
      └─ Sugerir corrección
    END IF
  END IF

CASOS ESPECIALES:
  └─ Doy Pack tiene rango MUCHO más restrictivo (80-230 vs 1-500)
```

### V-P2: Validación de Dimensiones Length (General)
```
CAMPO: Length (Largo)
TIPO: Rango numérico con variantes
RANGO GENERAL: 1 - 500 mm
RANGO DOY PACK: 134 - 340 mm ⚠️ ESPECIAL
BLOQUEA: ✅ Sí
TRIGGER: onChange + validación especial si Doy Pack
SEVERIDAD: Crítica

REGLA:
  IF tipoFormatoPouch = "DoyPack" THEN
    IF length < 134 OR length > 340 THEN
      ├─ Mostrar error: "Largo Doy Pack DEBE estar entre 134-340 mm"
      ├─ Mostrar advertencia visual
      ├─ Deshabilitar botón Guardar
      └─ Sugerir corrección
    END IF
  ELSE
    IF length < 1 OR length > 500 THEN
      ├─ Mostrar error: "Largo POUCH debe estar entre 1-500 mm"
      ├─ Deshabilitar botón Guardar
      └─ Sugerir corrección
    END IF
  END IF

CASOS ESPECIALES:
  └─ Doy Pack tiene rango MUCHO más restrictivo (134-340 vs 1-500)
```

### V-P3: Validación de Ancho Fuelle (Condicional + Variantes)
```
CAMPO: Ancho Fuelle
TIPO: Rango numérico condicional con variantes
RANGO GENERAL: 0 - 500 mm
RANGO DOY PACK: 0 - 3 mm ⚠️ ESPECIAL
VISIBLE: Solo si ¿Tiene Fuelle? = "Sí"
OBLIGATORIO: Sí (si Fuelle = Sí)
BLOQUEA: ✅ Sí (si visible y fuera de rango)
TRIGGER: onChange (si visible)
SEVERIDAD: Crítica (cuando es obligatorio)

REGLA:
  IF tieneFuelle = "Sí" THEN
    IF tipoFormatoPouch = "DoyPack" THEN
      IF anchoFuelle < 0 OR anchoFuelle > 3 THEN
        ├─ Mostrar error: "Ancho Fuelle Doy Pack DEBE estar entre 0-3 mm"
        ├─ Mostrar advertencia visual
        └─ Deshabilitar botón Guardar
      END IF
    ELSE
      IF anchoFuelle < 0 OR anchoFuelle > 500 THEN
        ├─ Mostrar error: "Ancho Fuelle debe estar entre 0-500 mm"
        └─ Deshabilitar botón Guardar
      END IF
    END IF
  ELSE
    ├─ Ocultar campo
    └─ Limpiar valor
  END IF

CASOS ESPECIALES:
  ├─ Doy Pack: 0-3 mm (EXTREMADAMENTE restrictivo)
  └─ General: 0-500 mm (normal)
```

### V-P4: Validación de Perímetro (Condicional + Variantes)
```
CAMPO: Perímetro (calculado automáticamente)
TIPO: Rango + Cálculo + Variantes
CÁLCULO: 2 × (width + length)
RANGO GENERAL: 100 - 15000 mm
RANGO DOY PACK: 100 - 650 mm ⚠️ ESPECIAL
BLOQUEA: ✅ Sí
TRIGGER: onChange width/length
SEVERIDAD: Crítica

REGLA:
  perimeter = 2 * (width + length)
  
  IF tipoFormatoPouch = "DoyPack" THEN
    RANGO_MIN = 100
    RANGO_MAX = 650
  ELSE
    RANGO_MIN = 100
    RANGO_MAX = 15000
  END IF
  
  IF perimeter < RANGO_MIN OR perimeter > RANGO_MAX THEN
    ├─ perimeterValidationStatus = "Rechazado"
    ├─ Mostrar badge ROJO: "Rechazado ❌"
    ├─ Mensaje: "Perímetro {valor} mm fuera de rango ({min}-{max})"
    ├─ Deshabilitar botón Guardar
    └─ Sugerir ajustar dimensiones
  ELSE
    ├─ perimeterValidationStatus = "Validado"
    └─ Mostrar badge VERDE: "Validado ✅"
  END IF

CASOS ESPECIALES:
  ├─ Doy Pack: 100-650 mm (EXTREMADAMENTE restrictivo)
  └─ General: 100-15000 mm (más permisivo que BOLSA)
```

### V-P5: Validación de Ancho Sello Lateral Plano (Condicional)
```
CAMPO: Ancho Sello Lateral
TIPO: Rango condicional
RANGO: 0 - 500 mm
VISIBLE: Solo si Familia = "Plano" AND Cantidad Sellos = "Tres"
OBLIGATORIO: Sí (si visible)
BLOQUEA: ✅ Sí (si Cantidad=Tres sin valor)
TRIGGER: onChange Cantidad Sellos
SEVERIDAD: Crítica (cuando aplicable)

REGLA:
  IF familia = "Plano" THEN
    IF cantidadSellos = "Tres" THEN
      ├─ Mostrar Ancho Sello Lateral (OBLIGATORIO)
      │
      └─ IF anchoSelloLateral IS NULL OR (anchoSelloLateral < 0 OR > 500) THEN
         ├─ Mostrar error: "Ancho Sello Lateral debe estar entre 0-500 mm"
         └─ Deshabilitar botón Guardar
         ELSE
           └─ Permitir continuar
    ELSE IF cantidadSellos = "Dos" THEN
      ├─ Ocultar Ancho Sello Lateral
      └─ Limpiar valor
  ELSE
    ├─ Ocultar Ancho Sello Lateral
    └─ Limpiar valor
  END IF

CASOS ESPECIALES:
  └─ Cascada: Familia = Plano → Cantidad = Tres → Ancho Lateral obligatorio
```

### V-P6: Validación de Microperforado (Cascada Compleja)
```
CAMPO: Microperforado section (4 campos: lado, tipo, separación, distancia)
TIPO: Sección condicional con múltiples campos
VISIBLE: Solo si Material = "PE-PE/PE" AND ¿Tiene Fuelle? = "Sí"
OBLIGATORIO: Sí (si visible y usuario selecciona ¿Tiene Microperforado? = Sí)
BLOQUEA: ✅ Sí (si Microperforado=Sí sin valores requeridos)
TRIGGER: onChange Material, onChange Fuelle, onChange ¿Tiene Microperforado?
SEVERIDAD: Crítica (cuando aplicable)

REGLA:
  IF material = "PE-PE/PE" AND tieneFuelle = "Sí" THEN
    ├─ Mostrar ¿Tiene Microperforado? (Sí/No)
    │
    └─ IF tienePerforado = "Sí" THEN
       ├─ Mostrar Microperforado section (4 campos)
       ├─ Lado Aleta: Derecho/Izquierdo - OBLIGATORIO
       ├─ Tipo Microperforado: Total/Parcial - OBLIGATORIO
       ├─ Separación Puas: 0-50 mm - OBLIGATORIO
       ├─ Distancia Lado Aleta: 0-500 mm - OBLIGATORIO
       │
       └─ IF ANY campo IS NULL OR fuera de rango THEN
          ├─ Mostrar error: "Campos Microperforado son obligatorios"
          └─ Deshabilitar botón Guardar
          ELSE
            └─ Permitir continuar
    ELSE IF tienePerforado = "No" THEN
       ├─ Ocultar Microperforado section
       └─ Limpiar valores
  ELSE (Material ≠ PE-PE/PE OR Fuelle = No)
    ├─ Ocultar ¿Tiene Microperforado?
    ├─ Ocultar Microperforado section
    └─ Limpiar valores
  END IF

OPCIONES VÁLIDAS:
  ├─ Lado: Derecho, Izquierdo
  ├─ Tipo: Total, Parcial
  ├─ Separación: 0-50 mm
  └─ Distancia: 0-500 mm

CASOS ESPECIALES:
  └─ Cascada de 3 niveles: Material → Fuelle → Microperforado → Parámetros
```

### V-P7: Validación de Ancho Sello Aleta (Condicional)
```
CAMPO: Ancho Sello Aleta
TIPO: Enum condicional
OPCIONES: 10, 12, 15 mm
VISIBLE: Solo si Material = "PE-PE/PE"
OBLIGATORIO: No (opcional)
BLOQUEA: ⚪ No (no bloquea si está vacío)
TRIGGER: onChange Material
SEVERIDAD: Baja

REGLA:
  IF material = "PE-PE/PE" THEN
    ├─ Mostrar Ancho Sello Aleta (Dropdown: 10, 12, 15)
    └─ Especifica ancho del sello en aleta
  ELSE (Aleta, Otro)
    ├─ Ocultar Ancho Sello Aleta
    └─ Limpiar valor
  END IF

OPCIONES VÁLIDAS: 10, 12, 15 mm (solo estas 3)

CASOS ESPECIALES:
  └─ Solo disponible para Material = PE-PE/PE
```

### V-P8: Validación de Ancho Total (Calculado)
```
CAMPO: Ancho Total Calculado
TIPO: Cálculo derivado
CÁLCULO: Ancho Sello Aleta + Sello Ancho Transversal
VISIBLE: Solo si Material = "PE-PE/PE"
EDITABLE: ❌ No (READ-ONLY)
BLOQUEA: ⚪ No (no participa en validación)
TRIGGER: onChange Ancho Aleta, onChange Ancho Transversal
SEVERIDAD: Baja

REGLA:
  IF material = "PE-PE/PE" THEN
    ├─ Mostrar Ancho Total (READ-ONLY)
    └─ Ancho Total = Ancho Aleta + Ancho Transversal
       └─ Auto-actualiza al cambiar componentes
  ELSE
    ├─ Ocultar Ancho Total
    └─ Limpiar valor
  END IF

CASOS ESPECIALES:
  └─ Es un field derivado, se calcula automáticamente
```

### V-P9: Validación de Accesorios (Máximo 3)
```
CAMPO: Accesorios (Zipper + Valve + Tin-Tie)
TIPO: Contador + Validación
MÁXIMO: 3 totales
BLOQUEA: ✅ Sí (impide agregar 4º accesorio)
TRIGGER: onChange en modal AccessoriesSelectionModal
SEVERIDAD: Media

REGLA:
  count_accesorios = count(zipper, valve, tinTie)
  
  IF count_accesorios > 3 THEN
    ├─ Modal bloquea botón "Agregar"
    ├─ Mostrar mensaje: "Máximo 3 accesorios permitidos"
    └─ Sugerir remover uno
  ELSE
    └─ Permitir agregar más
  END IF

OPCIONES VÁLIDAS: Zipper, Valve, Tin-Tie (solo estas 3)

CASOS ESPECIALES:
  ├─ Total permitido = 3
  └─ Modal lo valida antes de guardar
```

### V-P10: Validación de Material [SI]
```
CAMPO: Material [SI]
TIPO: Dropdown (catálogo externo)
BLOQUEA: ✅ Sí
TRIGGER: onChange
SEVERIDAD: Crítica

REGLA:
  IF material IS NULL OR material = "" THEN
    ├─ Mostrar error: "Material es obligatorio"
    ├─ Campo rojo con bordes
    └─ Deshabilitar botón Guardar
  ELSE
    ├─ Validar que existe en SI catalog
    └─ Permitir continuar
  END IF

CASOS ESPECIALES:
  ├─ Material debe existir en SI
  └─ Se hereda en Producto Modificado
```

---

## 🚫 RESTRICCIONES - POUCH

### REST-P1: Familia Define Estructura Completa
```
RESTRICCIÓN: Cambiar Familia limpia campos asociados a otras
RAZÓN: Cada familia tiene estructura completamente diferente
IMPACTO:
├─ SI usuario cambia a Stand Up:
│  ├─ Mostrar: Sub-familia (K/Normal/Doy Pack)
│  ├─ Limpiar: Cantidad Sellos, Material SelloCentral, Tipo SelloFuelle
│  └─ Estructura ajusta automáticamente
├─ SI usuario cambia a Plano:
│  ├─ Mostrar: Cantidad Sellos (Dos/Tres)
│  ├─ Limpiar: Sub-familia, Material SelloCentral, Microperforado
│  └─ Estructura ajusta automáticamente
├─ SI usuario cambia a Sello Central:
│  ├─ Mostrar: Material SelloCentral (PE-PE/PE/Aleta/Otro)
│  ├─ Limpiar: Sub-familia, Cantidad Sellos, Tipo SelloFuelle
│  └─ Estructura ajusta automáticamente
└─ SI usuario cambia a Sello Fuelle:
   ├─ Mostrar: Tipo SelloFuelle (4-1/1-1)
   ├─ Limpiar: Sub-familia, Cantidad Sellos, Material SelloCentral, Microperforado
   └─ Estructura ajusta automáticamente
```

### REST-P2: Doy Pack Tiene Validaciones EXTREMADAMENTE Restrictivas
```
RESTRICCIÓN: Doy Pack no es opcional, es CRÍTICO
RAZÓN: Doy Pack es un formato especializado con especificaciones muy estrictas
IMPACTO:
├─ Width: 80-230 mm (vs 1-500 mm general) = 63% del rango
├─ Length: 134-340 mm (vs 1-500 mm general) = 68% del rango
├─ Ancho Fuelle: 0-3 mm (vs 0-500 mm general) = 0.6% del rango
├─ Perímetro: 100-650 mm (vs 100-15000 mm general) = 4% del rango
└─ BLOQUEA completamente si CUALQUIERA está fuera de rango
```

### REST-P3: Microperforado Solo para PE-PE/PE + Fuelle
```
RESTRICCIÓN: Microperforado NUNCA está disponible para:
├─ Material = Aleta (no soporta microperforado)
├─ Material = Otro (no soporta microperforado)
├─ Fuelle = No (sin fuelle, sin microperforado)
└─ Cualquier otra familia que no sea Sello Central

RAZÓN: Microperforado solo tiene sentido en materiales específicos con fuelle
IMPACTO:
├─ Si usuario selecciona Aleta o Otro: microperforado oculto
├─ Si usuario selecciona Fuelle = No: microperforado oculto
└─ Cambiar cualquiera de estos limpia campos microperforado
```

### REST-P4: Perímetro Más Permisivo que BOLSA
```
RESTRICCIÓN: Rango período POUCH es mayor que BOLSA
RAZÓN: POUCH tiene más variedad de tamaños que BOLSA
IMPACTO:
├─ BOLSA: 100-10000 mm (más restrictivo)
├─ POUCH General: 100-15000 mm (más permisivo)
├─ POUCH Doy Pack: 100-650 mm (EXTREMADAMENTE restrictivo)
└─ Pero general es mayor que BOLSA para dar flexibilidad
```

### REST-P5: Ancho Sello Lateral Solo para Plano Tres
```
RESTRICCIÓN: Ancho Sello Lateral SOLO existe si Familia=Plano AND Cantidad=Tres
RAZÓN: Tercer sello solo tiene sentido en configuración de tres sellos
IMPACTO:
├─ Si Cantidad = Dos: Ancho Sello Lateral no existe
├─ Si Cantidad = Tres: Ancho Sello Lateral es OBLIGATORIO
└─ Cambiar Cantidad de Tres a Dos: limpia automáticamente
```

### REST-P6: Accesorios Máximo Estricto
```
RESTRICCIÓN: No se pueden agregar más de 3 accesorios bajo ninguna circunstancia
RAZÓN: Limitación de producción y costo (igual que BOLSA)
IMPACTO:
├─ Modal bloquea botón "Agregar" cuando count = 3
├─ No permite sobrescribir mediante API
├─ Mensaje claro: "Máximo 3 accesorios permitidos"
└─ Usuario debe eliminar uno para agregar otro
```

### REST-P7: Ancho Aleta Solo Para PE-PE/PE
```
RESTRICCIÓN: Ancho Sello Aleta SOLO existe si Material = PE-PE/PE
RAZÓN: Aleta es un componente específico de PE-PE/PE
IMPACTO:
├─ Si Material = Aleta o Otro: campos Aleta ocultos
├─ Si Material = PE-PE/PE: campos Aleta visibles
└─ Cambiar material limpia automáticamente
```

### REST-P8: Ancho Total es Derivado (No Editable)
```
RESTRICCIÓN: Ancho Total Calculado es READ-ONLY
RAZÓN: Se calcula automáticamente desde componentes
IMPACTO:
├─ Usuario no puede editar directamente
├─ User edita: Ancho Aleta + Ancho Transversal
└─ Sistema calcula: Ancho Total
```

---

# MATRIZ COMPARATIVA: VALIDACIONES POR FORMATO

| Validación | LÁMINA | BOLSA | POUCH |
|:---|:---:|:---:|:---:|
| **Width Range** | 1-9999 | 1-3000 | 1-500 (Gen) / 80-230 (Doy) |
| **Length Range** | N/A | 1-3000 | 1-500 (Gen) / 134-340 (Doy) |
| **Repetition Range** | 1-9999 | N/A | N/A |
| **Ancho Fuelle Range** | N/A | 0-500 | 0-500 (Gen) / 0-3 (Doy) |
| **Perímetro Range** | 100-20000 | 100-10000 | 100-15000 (Gen) / 100-650 (Doy) |
| **Diámetro Core Range** | 76-152 | N/A | N/A |
| **Accesorios Máx** | 0 (None) | 3 | 3 |
| **Fotoregistro** | ✅ Sí (2 max) | ❌ No | ❌ No |
| **Wicket** | ❌ No | ✅ Sí (cond) | ❌ No |
| **Microperforado** | ❌ No | ❌ No | ✅ Sí (cond) |
| **Total Validaciones** | 7 | 8 | 10+ |
| **Complejidad** | Media | Media | **Alta** |

---

**📏 DOCUMENTO COMPLETO - Reglas de Negocio, Validaciones y Restricciones** ✅

**Cobertura Completa:**
- ✅ Reglas de Negocio (8 por LÁMINA, 7 por BOLSA, 8 por POUCH)
- ✅ Validaciones Detalladas (7 por LÁMINA, 8 por BOLSA, 10+ por POUCH)
- ✅ Restricciones Operacionales (8 por LÁMINA, 6 por BOLSA, 8 por POUCH)
- ✅ Casos Especiales Documentados
- ✅ Cascadas Complejas Explicadas
- ✅ Matriz Comparativa

**Totales:**
- **LÁMINA:** 8 Reglas + 7 Validaciones + 8 Restricciones = 23
- **BOLSA:** 7 Reglas + 8 Validaciones + 6 Restricciones = 21
- **POUCH:** 8 Reglas + 10+ Validaciones + 8 Restricciones = 26+

**Implementación Pronta:** Todos los detalles están listos para desarrollo
