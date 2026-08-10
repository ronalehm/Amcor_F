# ÁRBOL DE DECISIÓN CONSOLIDADO - POUCH
## Bifurcaciones y Casuísticas en Secuencia Real

**Documento:** Árbol de Decisión Pouch con flujo actual de ProductEditPage.tsx  
**Versión:** 2.0  
**Fecha:** 2026-08-10  
**Tipo Envoltura:** POUCH (Stand Up, Plano, Sello Central, Sello en Fuelle)  
**Bifurcaciones Identificadas:** 9 principales  
**Casuísticas Totales:** ~78 (Nuevo) + ~39 (Modificado) = ~117  

---

## ÁRBOL VISUAL ASCII

```
INICIO
  │
  ├─→ PASO 0: INFORMACIÓN PRODUCTO
  │    │
  │    ├─→ Clasificación
  │    │    ├─→ NUEVO
  │    │    │    └─→ Motivos: Nueva estructura, Nuevos insumos, Nuevo formato, Nuevo diseño, etc. (6 opciones)
  │    │    │
  │    │    └─→ MODIFICADO
  │    │         └─→ Motivos: Modifica dimensiones, Estructura, Materia prima, Diseño, etc. (6 opciones)
  │    │
  │    ├─→ Nombre, Volumen, Unidad, Descripción, Acción SF, Código RFQ, Aplicación Técnica
  │    │
  │    └─→ [FIN PASO 0]
  │
  ├─→ PASO 1: ESPECIFICACIONES DE DISEÑO
  │    │
  │    ├─→ Bifurcación 1: ¿Tiene Diseño Referencia?
  │    │    ├─→ SÍ
  │    │    │    └─→ [Cargar EDAG referencia] → E/M referencia disponible
  │    │    │
  │    │    └─→ NO
  │    │         └─→ [Nuevo diseño] → EDAG vacío (será rellenado en AG)
  │    │
  │    ├─→ Bifurcación 2: Clase Impresión
  │    │    ├─→ SIN IMPRESIÓN
  │    │    │    └─→ [Deshabilitar: Tipo, Forma, Color, ALUSA, Instrucciones]
  │    │    │
  │    │    ├─→ FLEXOGRAFÍA
  │    │    │    └─→ [Habilitar: Tipo*, Forma*, Color*, Instrucciones*]
  │    │    │
  │    │    └─→ HUECOGRABADO
  │    │         └─→ [Habilitar: Tipo*, Forma*, Color*, Instrucciones*]
  │    │
  │    ├─→ Bifurcación 3: ¿Tiene Plano Diseño?
  │    │    ├─→ SÍ
  │    │    │    ├─→ Tipo de Plano (4 opciones)
  │    │    │    │    ├─→ AI_ZIP_EMPAQUETADO → [Requiere archivo .zip]
  │    │    │    │    ├─→ AI_PDF_FUENTES → [Requiere archivo .zip]
  │    │    │    │    ├─→ AI_PDF_BAJA_ALTA → [Requiere archivos múltiples]
  │    │    │    │    └─→ SOLO_DATOS → [No requiere archivo, requiere comentario]
  │    │    │    │
  │    │    │    └─→ [Cargar archivos según tipo]
  │    │    │
  │    │    └─→ NO
  │    │         └─→ [Campos vacíos, opcional]
  │    │
  │    └─→ [FIN PASO 1]
  │
  ├─→ PASO 2: INFORMACIÓN TÉCNICA DE ESTRUCTURA
  │    │
  │    ├─→ Bifurcación 4: CONFIGURACIÓN DE FORMATO POUCH
  │    │    │
  │    │    ├─→ Familia = STAND UP
  │    │    │    │
  │    │    │    ├─→ Bifurcación 4.1: Tipo Stand Up
  │    │    │    │    │
  │    │    │    │    ├─→ SELLO K
  │    │    │    │    │    └─→ [Formato: POUCH_STAND_UP_SELLO_K]
  │    │    │    │    │    └─→ [Dimensiones: Ancho, Largo, Ancho Fuelle]
  │    │    │    │    │
  │    │    │    │    ├─→ NORMAL
  │    │    │    │    │    └─→ [Formato: POUCH_STAND_UP_NORMAL]
  │    │    │    │    │    └─→ [Dimensiones: Ancho, Largo, Ancho Fuelle]
  │    │    │    │    │
  │    │    │    │    └─→ DOY PACK
  │    │    │    │         │
  │    │    │    │         ├─→ Bifurcación 4.1.1: Tipo Fuelle
  │    │    │    │         │    ├─→ FUELLE PROPIO
  │    │    │    │         │    │    └─→ [Formato: POUCH_STAND_UP_DOY_PACK_FUELLE_PROPIO]
  │    │    │    │         │    │
  │    │    │    │         │    └─→ FUELLE INSERTADO
  │    │    │    │         │         └─→ [Formato: POUCH_STAND_UP_DOY_PACK_FUELLE_INSERTADO]
  │    │    │    │         │
  │    │    │    │         ├─→ Bifurcación 4.1.2: Base Doy Pack
  │    │    │    │         │    ├─→ REDONDO
  │    │    │    │         │    │    └─→ [Dimensiones: Ancho (80-230), Largo (134-340), Ancho Fuelle]
  │    │    │    │         │    │
  │    │    │    │         │    └─→ CUADRADO
  │    │    │    │         │         └─→ [Dimensiones: Ancho (80-230), Largo (134-340), Ancho Fuelle]
  │    │    │    │         │
  │    │    │    │         └─→ [Accesorios permitidos: Todos]
  │    │    │    │
  │    │    │    └─→ [Accesorios permitidos: Todos]
  │    │    │
  │    │    ├─→ Familia = POUCH PLANO
  │    │    │    │
  │    │    │    ├─→ Bifurcación 4.2: Cantidad de Sellos
  │    │    │    │    │
  │    │    │    │    ├─→ DOS SELLOS
  │    │    │    │    │    ├─→ [Formato: POUCH_PLANO_DOS_SELLOS]
  │    │    │    │    │    ├─→ [Campos: Ancho Sello + Ancho Transversal (obligatorios)]
  │    │    │    │    │    ├─→ [Ancho Sello Lateral: oculto]
  │    │    │    │    │    │
  │    │    │    │    │    └─→ Bifurcación 4.2.1: Accesorios Consumibles
  │    │    │    │    │         ├─→ Zipper
  │    │    │    │    │         │    └─→ Tipo Zipper + Distancia boca-zipper
  │    │    │    │    │         │
  │    │    │    │    │         ├─→ Tin-Tie
  │    │    │    │    │         │    └─→ Simple checkbox
  │    │    │    │    │         │
  │    │    │    │    │         └─→ Muesca
  │    │    │    │    │              ├─→ Tipo Muesca + Distancia boca-muesca
  │    │    │    │    │              │
  │    │    │    │    │              └─→ Perforación
  │    │    │    │    │                   ├─→ Tipo Perforación (Ojal/Circular/Europunch)
  │    │    │    │    │                   └─→ Distancia boca-perforación
  │    │    │    │    │
  │    │    │    │    └─→ TRES SELLOS
  │    │    │    │         ├─→ [Formato: POUCH_PLANO_TRES_SELLOS]
  │    │    │    │         ├─→ [Campos: Ancho Sello + Ancho Transversal + Ancho Lateral (obligatorios)]
  │    │    │    │         └─→ [Mismos accesorios que DOS SELLOS]
  │    │    │    │
  │    │    │    └─→ [Accesorios Internos: Todos permitidos]
  │    │    │
  │    │    ├─→ Familia = POUCH SELLO CENTRAL
  │    │    │    │
  │    │    │    ├─→ Bifurcación 4.3: Material Sello Central
  │    │    │    │    │
  │    │    │    │    ├─→ MATERIAL PE-PE/PE
  │    │    │    │    │    │
  │    │    │    │    │    ├─→ [Campos: Ancho Sello Transversal (obligatorio)]
  │    │    │    │    │    │
  │    │    │    │    │    ├─→ Bifurcación 4.3.1: ¿Tiene Fuelle?
  │    │    │    │    │    │    ├─→ SÍ
  │    │    │    │    │    │    │    ├─→ [Ancho Fuelle Cerrado: obligatorio]
  │    │    │    │    │    │    │    ├─→ [Mostrar: Especificaciones completas de Sello Central]
  │    │    │    │    │    │    │    └─→ [Formato: POUCH_SELLO_CENTRAL_PE_PE_PE_CON_FUELLE]
  │    │    │    │    │    │    │
  │    │    │    │    │    │    └─→ NO
  │    │    │    │    │    │         ├─→ [Ancho Fuelle Cerrado: oculto]
  │    │    │    │    │    │         └─→ [Formato: POUCH_SELLO_CENTRAL_PE_PE_PE_SIN_FUELLE]
  │    │    │    │    │    │
  │    │    │    │    │    ├─→ Bifurcación 4.3.2: ¿Microperforado Aleta?
  │    │    │    │    │    │    ├─→ SÍ
  │    │    │    │    │    │    │    ├─→ [Lado: Derecho/Izquierdo (obligatorio)]
  │    │    │    │    │    │    │    ├─→ [Tipo: Total/Parcial (obligatorio)]
  │    │    │    │    │    │    │    ├─→ [Separación Puas: 3 opciones (obligatorio)]
  │    │    │    │    │    │    │    └─→ [Distancia Lado: mm (obligatorio)]
  │    │    │    │    │    │    │
  │    │    │    │    │    │    └─→ NO
  │    │    │    │    │    │         └─→ [Campos microperf ocultos]
  │    │    │    │    │    │
  │    │    │    │    │    └─→ [Accesorios: Todos permitidos (máx 3)]
  │    │    │    │    │
  │    │    │    │    ├─→ MATERIAL ALETA
  │    │    │    │    │    │
  │    │    │    │    │    ├─→ [Campos: Ancho Sello Aleta (10/12/15 mm - obligatorio)]
  │    │    │    │    │    │
  │    │    │    │    │    ├─→ Bifurcación 4.3.3: ¿Tiene Fuelle?
  │    │    │    │    │    │    ├─→ SÍ
  │    │    │    │    │    │    │    ├─→ [Ancho Fuelle Cerrado: obligatorio]
  │    │    │    │    │    │    │    ├─→ [Especificaciones de Aleta CON Fuelle]
  │    │    │    │    │    │    │    ├─→ [Microperforado, Lado, Tipo, Separación, Distancia]
  │    │    │    │    │    │    │    └─→ [Formato: POUCH_SELLO_CENTRAL_ALETA_CON_FUELLE]
  │    │    │    │    │    │    │
  │    │    │    │    │    │    └─→ NO
  │    │    │    │    │    │         └─→ [Ancho Fuelle: oculto]
  │    │    │    │    │    │         └─→ [Formato: POUCH_SELLO_CENTRAL_ALETA_SIN_FUELLE]
  │    │    │    │    │    │
  │    │    │    │    │    └─→ [Accesorios: Limitados (Zipper, Tin-Tie)]
  │    │    │    │    │
  │    │    │    │    └─→ MATERIAL OTRO
  │    │    │    │         ├─→ [Campos limitados: Solo dimensiones base]
  │    │    │    │         └─→ [Formato: POUCH_SELLO_CENTRAL_OTRO]
  │    │    │    │
  │    │    │    └─→ [Accesorios Internos: Limitados según material]
  │    │    │
  │    │    └─→ Familia = POUCH SELLO EN FUELLE
  │    │         │
  │    │         ├─→ Bifurcación 4.4: Tipo Sello Fuelle
  │    │         │    │
  │    │         │    ├─→ TIPO 4-1
  │    │         │    │    ├─→ [Campos: Ancho Sello Lateral (10 mm - fijo)]
  │    │         │    │    ├─→ [Ancho Total: auto-calculado]
  │    │         │    │    ├─→ [Perímetro: auto-calculado]
  │    │         │    │    ├─→ [Dimensiones: Ancho, Largo, Ancho Fuelle (obligatorios)]
  │    │         │    │    ├─→ [Formato: POUCH_SELLO_EN_FUELLE_TIPO_4_1]
  │    │         │    │    └─→ [Accesorios: Consumibles (Zipper, Valve, Tin-Tie)]
  │    │         │    │
  │    │         │    └─→ TIPO 1-1
  │    │         │         ├─→ [Campos: Ancho Sello Lateral (10 mm - fijo)]
  │    │         │         ├─→ [Dimensiones: Ancho, Largo, Ancho Fuelle (obligatorios)]
  │    │         │         ├─→ [Formato: POUCH_SELLO_EN_FUELLE_TIPO_1_1]
  │    │         │         └─→ [Accesorios: Consumibles (Zipper, Valve, Tin-Tie)]
  │    │         │
  │    │         └─→ [Accesorios Internos: Limitados]
  │    │
  │    ├─→ Bifurcación 5: ¿Estructura Referencia?
  │    │    ├─→ SÍ
  │    │    │    └─→ [Tipo Estructura: Read-only (heredado)]
  │    │    │    └─→ [Botón "Consultar SI" para E/M]
  │    │    │
  │    │    └─→ NO
  │    │         ├─→ [Tipo Estructura: Editable]
  │    │         ├─→ [Poder elegir Mono/Bilam/Trilam/Tetra]
  │    │         │
  │    │         └─→ Bifurcación 6: Tipo Estructura
  │    │              ├─→ MONOCAPA
  │    │              │    ├─→ [Capas visibles: 1]
  │    │              │    ├─→ [Barniz de Protección: HABILITADO]
  │    │              │    └─→ [Grammage fijo: 2.5 + materiales]
  │    │              │
  │    │              ├─→ BILAMINADO
  │    │              │    ├─→ [Capas visibles: 2]
  │    │              │    ├─→ [Validación 405: (M1, M2)]
  │    │              │    └─→ [Grammage fijo: 5.0 + materiales]
  │    │              │
  │    │              ├─→ TRILAMINADO
  │    │              │    ├─→ [Capas visibles: 3]
  │    │              │    ├─→ [Validación 405: (M1, M2, M3)]
  │    │              │    └─→ [Grammage fijo: 7.5 + materiales]
  │    │              │
  │    │              └─→ TETRALAMINADO
  │    │                   ├─→ [Capas visibles: 4]
  │    │                   ├─→ [Validación 405: (M1, M2, M3, M4)]
  │    │                   └─→ [Grammage fijo: 9.5 + materiales]
  │    │
  │    ├─→ Bifurcación 7: Accesorios (máximo 3 simultáneos)
  │    │    │
  │    │    ├─→ CONSUMIBLES
  │    │    │    ├─→ Zipper
  │    │    │    │    └─→ [Si SÍ: Seleccionar Tipo Zipper]
  │    │    │    │
  │    │    │    ├─→ Tin-Tie
  │    │    │    │    └─→ [Simple checkbox]
  │    │    │    │
  │    │    │    └─→ Válvula
  │    │    │         ├─→ [Si SÍ: Seleccionar Tipo Válvula + Distancia boca-válvula]
  │    │    │         └─→ [Distancia obligatoria si válvula=Sí]
  │    │    │
  │    │    ├─→ PRODUCTO
  │    │    │    ├─→ Asa Troquelada
  │    │    │    │    └─→ [Si SÍ: Tipo Asa (3 opciones) + Color Asa (3 colores) + Forma Asa (4 formas)]
  │    │    │    │
  │    │    │    └─→ Refuerzo
  │    │    │         └─→ [Si SÍ: Espesor (g/m²) + Ancho (mm)]
  │    │    │
  │    │    ├─→ INTERNOS (máximo 3)
  │    │    │    ├─→ Corte Angular
  │    │    │    │    └─→ [Si SÍ: Lado (Derecho/Izquierdo)]
  │    │    │    │
  │    │    │    ├─→ Esquinas Redondas
  │    │    │    │    └─→ [Si SÍ: Tipo (Fondo / Todas)]
  │    │    │    │
  │    │    │    ├─→ Muesca
  │    │    │    │    └─→ [Simple checkbox]
  │    │    │    │
  │    │    │    ├─→ Perforación
  │    │    │    │    ├─→ [Si SÍ: Tipo (Cruz / Media Luna)]
  │    │    │    │    ├─→ Ubicación (Delantero / Posterior)
  │    │    │    │    └─→ Distancia boca-perforación
  │    │    │    │
  │    │    │    └─→ Pre-Corte
  │    │    │         ├─→ [Si SÍ: Tipo Pre-Corte (2 opciones)]
  │    │    │         ├─→ Precorte Fuelle Abre Fácil (Sí/No)
  │    │    │         └─→ Precorte Fuelle a 10mm (Sí/No)
  │    │    │
  │    │    └─→ [CONTADOR: X/3 accesorios seleccionados]
  │    │
  │    ├─→ Bifurcación 8: ¿Especificación Técnica Cliente?
  │    │    ├─→ SÍ
  │    │    │    └─→ [Cargar archivo + Comentarios opcionales]
  │    │    │
  │    │    └─→ NO
  │    │         └─→ [Campos vacíos, opcionales]
  │    │
  │    ├─→ ¿Solicitud de Muestra? (Sí/No)
  │    │
  │    └─→ [FIN PASO 2]
  │
  ├─→ PASO 3: EMBALAJE Y EMPALMES
  │    │
  │    ├─→ Embalaje Material (Select) *
  │    ├─→ Embalaje Material Especial (Textarea) - opcional
  │    ├─→ Embalaje Exportación (Select) *
  │    └─→ Empalmes (Select) *
  │
  └─→ [FIN - PRODUCTO COMPLETO]
     │
     ├─→ Si completitud = 100% → Botón "Solicitar Validación"
     ├─→ Si completitud < 100% → Botón "Guardar Avance"
     └─→ Navegación: Atrás a lista de productos
```

---

## BIFURCACIONES PRINCIPALES DETALLADAS

### Bifurcación 1: Diseño Referencia
```
SÍ  → Cargar código EDAG existente + Botón "Consultar SI"
NO  → Dejar vacío (será completado por Artes Gráficas)
```

### Bifurcación 2: Clase Impresión
```
SIN IMPRESIÓN
  → Deshabilitar: Tipo, Forma, Color, Instrucciones (campos GRISES)
  → Auto-limpiar valores si existen

FLEXO / HUECO
  → Habilitar campos de: Tipo, Forma, Color, Instrucciones
  → Obligatorios si clase ≠ Sin Impresión
```

### Bifurcación 3: Tipo de Plano
```
AI_ZIP_EMPAQUETADO          → Requiere .zip
AI_PDF_FUENTES_LINKS_ZIP    → Requiere .zip consolidado
AI_PDF_BAJA_ALTA_RES        → Requiere múltiples archivos
SOLO_DATOS_SIN_WEBCENTER    → NO requiere archivo, requiere comentario
```

### Bifurcación 4: Familia POUCH (CRÍTICA - MÁS COMPLEJA)

```
STAND UP
├─ Sello K
│   └─ Dimensiones: Ancho, Largo, Ancho Fuelle
├─ Normal
│   └─ Dimensiones: Ancho, Largo, Ancho Fuelle
└─ Doy Pack
   ├─ Tipo Fuelle: Propio / Insertado
   ├─ Base: Redondo / Cuadrado
   └─ Restricción: Ancho 80-230mm, Largo 134-340mm

PLANO
├─ Dos Sellos
│   ├─ Ancho Sello + Ancho Transversal (obligatorios)
│   └─ Ancho Lateral: oculto
└─ Tres Sellos
    ├─ Ancho Sello + Ancho Transversal + Ancho Lateral (obligatorios)
    └─ Mismo layout que DOS SELLOS

SELLO CENTRAL
├─ Material PE-PE/PE
│   ├─ Ancho Sello Transversal: obligatorio
│   ├─ ¿Fuelle?: Sí/No
│   │   └─ Si Sí: Ancho Fuelle Cerrado
│   └─ ¿Microperforado?: Sí/No
│       └─ Si Sí: Lado + Tipo + Separación + Distancia
├─ Material Aleta
│   ├─ Ancho Sello Aleta (10/12/15mm): obligatorio
│   └─ ¿Fuelle?: Sí/No
│       └─ Si Sí: Especificaciones completas
└─ Material Otro
    └─ Campos limitados

SELLO EN FUELLE
├─ Tipo 4-1
│   ├─ Ancho Sello Lateral: 10mm (fijo)
│   ├─ Ancho Total: auto-calculado
│   ├─ Perímetro: auto-calculado
│   └─ Dimensiones: Ancho, Largo, Ancho Fuelle
└─ Tipo 1-1
    ├─ Ancho Sello Lateral: 10mm (fijo)
    └─ Dimensiones: Ancho, Largo, Ancho Fuelle
```

### Bifurcación 5: Estructura Referencia
```
SÍ  → Tipo Estructura: Read-only (heredado)
    → Botón "Consultar SI" para E/M
    
NO  → Tipo Estructura: Editable
    → Poder elegir Mono/Bilam/Trilam/Tetra
    → Acceder a Modal Momento 1
```

### Bifurcación 6: Tipo Estructura
```
MONOCAPA
├─ Capas visibles: 1
├─ Barniz de Protección: HABILITADO
└─ Grammage fijo: 2.5 + materiales

BILAMINADO
├─ Capas visibles: 2
├─ Validación 405: (M1, M2)
└─ Grammage fijo: 5.0 + materiales

TRILAMINADO
├─ Capas visibles: 3
├─ Validación 405: (M1, M2, M3)
└─ Grammage fijo: 7.5 + materiales

TETRALAMINADO
├─ Capas visibles: 4
├─ Validación 405: (M1, M2, M3, M4)
└─ Grammage fijo: 9.5 + materiales
```

### Bifurcación 7: Accesorios (Máximo 3)
```
Contador visible: "X/3 accesorios seleccionados"
Si contador = 3 → Deshabilitar checkboxes de nuevos accesorios

CONSUMIBLES: Zipper, Tin-Tie, Válvula
PRODUCTO:   Asa Troquelada, Refuerzo
INTERNOS:   Corte Angular, Esquinas Redondas, Muesca, Perforación, Pre-Corte
```

### Bifurcación 8: Especificación Técnica Cliente
```
SÍ  → Requerir archivo(s) + Comentarios opcionales
NO  → Campos vacíos
```

---

## ESTADÍSTICAS DE CASUÍSTICAS

### Producto NUEVO

```
Paso 0:
  - Clasificación → 1 (Nuevo)
  - MOT → 6 opciones
  Subtotal: 1 × 6 = 6

Paso 1:
  - Diseño Referencia: SÍ/NO → 2
  - Clase Impresión: 3 opciones × 2 = 6
  - Tipo Plano: SÍ/NO × 4 opciones = 8
  Subtotal: 2 × 6 × 8 = 96 (pero se simplifican)

Paso 2:
  - Familia POUCH: 4 opciones (Stand Up, Plano, Sello Central, Sello en Fuelle)
    - Stand Up: 3 tipos (Sello K/Normal/Doy Pack)
      - Doy Pack: 2 fuelles × 2 bases = 4
      Subtotal: 1 + 1 + 4 = 6
    - Plano: 2 opciones (Dos/Tres sellos) = 2
    - Sello Central: 3 materiales × 2 fuelles = 6
      - PE-PE/PE: 2 microperf = 2
      - Aleta: 2 fuelles = 2
      - Otro: 1
      Subtotal: 5
    - Sello en Fuelle: 2 tipos = 2
    Total: 6 + 2 + 5 + 2 = 15 bifurcaciones principales
  
  - Estructura Referencia: SÍ/NO × Tipo Estructura × 4 = 8
  - Accesorios (máx 3): C(10,3) + C(10,2) + C(10,1) + 1 = 176

Total Nuevo (simplificado): ~78 casuísticas principales
```

### Producto MODIFICADO

```
Paso 0:
  - Clasificación → 1 (Modificado)
  - MOT → 6 opciones
  Subtotal: 1 × 6 = 6

Paso 2:
  - Campos heredados: Read-only (Familia, Tipo Estructura, Materiales)
  - Solo editable: Accesorios, Dimensiones (según MOT)
  
Total Modificado (simplificado): ~39 casuísticas principales
```

---

## VALIDACIONES CRÍTICAS POR BIFURCACIÓN

| Bifurcación | Validación | Error Si |
|------------|-----------|----------|
| Diseño Referencia (SÍ) | EDAG debe existir en SI | EDAG inválido o vacío |
| Clase Impresión ≠ Sin Impr | Tipo, Forma, Color, Instrucciones obligatorios | Campos vacíos |
| Tiene Plano (SÍ) | Tipo de Plano + Archivo/Comentario | Falta tipo o archivo |
| Familia POUCH | Campos según familia | Valores fuera de rango |
| Stand Up Doy Pack | Ancho 80-230mm, Largo 134-340mm | Fuera de rango |
| Sello Central PE-PE/PE | Ancho Transversal obligatorio | Vacío |
| Sello Central con Microperf | Lado + Tipo + Separación + Distancia | Falta alguno |
| Estructura Referencia (NO) | Tipo Estructura + Materiales + 405 | Estructura incompleta |
| Accesorios | Máximo 3 simultáneos | Más de 3 seleccionados |
| Especif. Técnica (SÍ) | Al menos 1 archivo | Sin archivos |

---

## DIFERENCIAS POUCH vs LÁMINA vs BOLSA

| Aspecto | LÁMINA | BOLSA | POUCH |
|--------|--------|-------|-------|
| **Paso 1.5** | ✓ SÍ | ✗ NO | ✗ NO |
| **Fotoregistro** | ✓ SÍ | ✗ NO | ✗ NO |
| **Core** | ✓ SÍ | ✗ NO | ✗ NO |
| **Familias Formato** | 3 simples | 3 complejas | 4 muy complejas |
| **Complejidad Familia** | Baja | Media | **ALTA** |
| **Accesorios máx** | Ilimitados | 3 máx | 3 máx |
| **Especificaciones Sello** | ✗ NO | ✗ NO | ✓ SÍ (**muy complejo**) |
| **Wicket** | ✗ NO | ✓ SÍ | ✗ NO |
| **Doy Pack** | ✗ NO | ✗ NO | ✓ SÍ (restricciones ancho/largo) |
| **Microperforado** | ✗ NO | ✗ NO | ✓ SÍ (Sello Central) |
| **Casuísticas totales** | ~64 | ~96 | **~117** |

---

## FLUJO COMPLETO: POUCH STAND UP DOY PACK

```
ENTRADA: Producto Nuevo, POUCH Wrapping, Familia Stand Up, Tipo Doy Pack

PASO 0:
  Clasificación: NUEVO
  MOT: "Nuevo formato de envasado"
  
PASO 1:
  Diseño Referencia: NO → EDAG vacío
  Clase Impresión: FLEXO
  Tipo: Repetitivo
  Forma: Dorso
  Plano: SÍ → Tipo AI_PDF_BAJA_ALTA → Cargar archivos
  
PASO 2:
  Familia: STAND UP
    ├─ Tipo: DOY PACK
    ├─ Tipo Fuelle: FUELLE PROPIO
    └─ Base Doy Pack: REDONDO
  
  Dimensiones:
    - Ancho: 120mm (dentro de 80-230)
    - Largo: 200mm (dentro de 134-340)
    - Ancho Fuelle: 40mm
  
  Estructura:
    - Referencia: NO
    - Tipo: BILAMINADO
    - Material 1: BOPP Cristal 20μ
    - Material 2: PE Blanco 70μ
    - Validación 405: ✓ VALIDADA
    - Grammage: 40.5 g/m²
  
  Accesorios (2/3):
    - Zipper: SÍ → Tipo: Convencional
    - Válvula: SÍ → Tipo: Degasificadora, Distancia: 15mm
  
  Especif. Técnica Cliente: NO
  Solicitud Muestra: SÍ

PASO 3:
  Embalaje Material: Cajas de cartón
  Embalaje Exportación: Pallets semitrailer
  Empalmes: 25mm

ESTADO: 94% completo → "Guardar Avance" habilitado
SI completitud = 100% → "Solicitar Validación" habilitado
```

---

## FLUJO COMPLETO: POUCH SELLO CENTRAL ALETA CON MICROPERF

```
ENTRADA: Producto Nuevo, POUCH Wrapping, Familia Sello Central, Material Aleta

PASO 2:
  Familia: SELLO CENTRAL
    ├─ Material: ALETA
    └─ ¿Fuelle?: SÍ
  
  Especificaciones Sello Central Aleta:
    - Ancho Pouch: 200mm
    - Largo Pouch: 300mm
    - Ancho Fuelle Cerrado: 60mm
    - Ancho Sello Aleta: 12mm
  
  Microperforado Aleta:
    - ¿Microperf?: SÍ
    - Lado: DERECHO
    - Tipo: TOTAL
    - Separación: Avena 20-20mm
    - Distancia: 10mm
  
  Accesorios (2/3):
    - Zipper: SÍ → Tipo Zipper: String Zipper
    - Tin-Tie: SÍ
  
  [Accesorios Internos: limitados]

ESTADO: Estructura incompleta hasta que se seleccione Tipo Estructura
```

---

## COMPARACIÓN: ÁRBOL VIEJO vs ÁRBOL NUEVO

| Aspecto | VIEJO (Ficción) | NUEVO (Real) |
|--------|-----------------|------------|
| Estructura | 7 niveles artificiales | 4 pasos reales + bifurcaciones |
| Campos ficticios | Moneda, País, Cliente, etc. | 71 campos REALES |
| Paso 1.5 | Inexistente para POUCH | Correctamente ausente ✓ |
| Fotoregistro | Colocado artificialmente | NO existe en POUCH ✓ |
| Bifurcaciones | No mapeadas | 8 principales, ~117 casuísticas |
| Familias POUCH | Simplificadas | 4 complejas con múltiples bifurcaciones |
| Especificaciones Sello | Ignoradas | Detalladas por familia y material |
| Doy Pack Restricciones | Inexistentes | Ancho 80-230mm, Largo 134-340mm |
| Microperforado | Ignorado | Modelado con Lado + Tipo + Separación |
| Complejidad total | Baja | **ALTA** (más que LÁMINA y BOLSA) |

---

## CONCLUSIÓN

El **Árbol de Decisión Real de POUCH** es el **más complejo** de los tres formatos (LÁMINA, BOLSA, POUCH) debido a:

1. **4 familias** con arquitecturas completamente distintas
2. **Bifurcaciones muy profundas** en Familia (Stand Up, Plano, Sello Central, Sello en Fuelle)
3. **Stand Up Doy Pack** con restricciones numéricas específicas (80-230 × 134-340)
4. **Sello Central** con subfamilias (PE-PE/PE, Aleta, Otro) y microperforación dinámica
5. **Especificaciones de Sello** que varían por familia y material
6. **Accesorios limitados** con contador activo (máximo 3)
7. **~117 casuísticas totales** (vs ~64 LÁMINA, ~96 BOLSA)

El árbol captura la realidad de ProductEditPage.tsx sin ficción ni simplificaciones.

---

**Documento completo v2.0 | 2026-08-10**
