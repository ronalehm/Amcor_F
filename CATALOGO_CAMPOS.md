# Lista Completa de Campos que Podrían ser Tablas Catálogo

## Módulo de Productos (ProductCreatePage.tsx y ProductEditPage.tsx)

### Información Básica
- **Clasificación*** → Nuevo/Modificado (hardcodeado)
- **Motivo/Modificación*** → Sub-clasificación (dinámico según Clasificación)
  - Si "Nuevo": Desarrollo_RD, Área_Técnica
  - Si "Modificado": Diseño y Dimensiones, Estructura
- **Unidad de Medida*** → KGS, MLL, MTS, MT2, LBS, UNI (hardcodeado)

### Impresión
- **Clase de Impresión** → Flexo, Huecograbado, Sin impresión (hardcodeado)
- **Tipo de Impresión** → Nuevo, Repetitivo (hardcodeado)

### Estructura y Materiales
- **Tipo de Estructura** → Monocapa, Bilaminado, Trilaminado, Tetralaminado (hardcodeado)
- **Material (por capa)*** → Catálogo complejo con grupos:
  - BOPP (20+ variantes)
  - POLIESTER (4 variantes)
  - PAPEL (6 variantes)
  - COEX (3 variantes)
  - ALUMINIO (3 variantes)
  - AMPRIMA (1 variante)
  - PPCAST (pendiente de revisar)
  - Otros grupos posibles
  
  Cada material incluye: nombre, micraje, si es libre o estándar

### Especificaciones de Envasado
- **Base Doy Pack** → Opciones de forma (Redondo, Cuadrado, Normal, etc.) (hardcodeado)
- **Tipo de Cierre (Zipper)** → Varios tipos estándar (hardcodeado)
- **Tipo de Válvula** → Varias opciones (hardcodeado)
- **Tipo Esquinas Redondeadas** → Varias opciones (hardcodeado)
- **Tipo Perforación Pouch** → Varias opciones (hardcodeado)
- **Tipo Perforación Bolsa** → Varias opciones (hardcodeado)
- **Ubicación de Perforaciones** → Varias opciones (hardcodeado)
- **Tipo Pre-Corte** → Varias opciones (hardcodeado)
- **Otros Accesorios** → Lista abierta (hardcodeado)

### Comercial
- **Tipo de Venta*** → Nacional, Internacional (hardcodeado)
- **Incoterm*** → CON, FOB, FOH, FRANCO_CANAL, etc. (hardcodeado)
- **País Destino*** → Lista completa de países (hardcodeado)
- **Tipo de Moneda*** → USD, PEN, EUR, etc. (hardcodeado)

### Diseño
- **Especificaciones de Diseño Especial** → Opciones de características especiales (hardcodeado)

### Formato (Dinámico según Envoltura)
- **Formato Blueprint** → Varía según tipo de envoltura (POUCH, BOLSA, LAMINA)
  - Si POUCH: 15+ opciones
  - Si BOLSA: 8 opciones
  - Si LAMINA: 3 opciones

---

## Módulo de Portfolio (PortfolioEditPage.tsx y PortfolioCreatePage.tsx)

### Catálogos Principales
- **Uso Final*** → FINAL_USE_CATALOG (ya está estructurado como catálogo)
  - Incluye: useFinal, sector, segment, subSegment, afMarketId
  
- **Envasado / Máquina de Cliente*** → Dinámico según envoltura seleccionada
  - Obtenido de: getPackingMachinesByWrappingId()
  - Incluye: id, name

### Otros campos (potenciales catálogos)
- **Estado** → STATUS_CATALOG (ya está como catálogo)
- **Planta** → PLANTS_CATALOG (ya está como catálogo)
- **Envoltura** → WRAPPINGS_CATALOG (ya está como catálogo)

---

## Priorización Sugerida

### TIER 1 - Productos (Uso frecuente, impacto alto)
1. **Clasificación** + **Motivo** - Control principal del flujo de proyecto
2. **Unidad de Medida** - Campo obligatorio, reutilizable
3. **Material** - Campo obligatorio, catálogo más complejo, usado múltiples veces por capas
4. **Tipo de Venta, Incoterm, País Destino, Moneda** - Campos comerciales, altamente reutilizables

### TIER 2 - Productos (Especificaciones técnicas)
5. **Clase de Impresión, Tipo de Impresión, Tipo de Estructura**
6. **Tipos de Zipper, Válvula, Esquinas, Perforaciones, Pre-Corte**
7. **Material de Núcleo, Base Doy Pack, Otros Accesorios**
8. **Formato Blueprint** (dinámico según envoltura)

### TIER 3 - Portfolio
9. **Uso Final** (ya tiene estructura de catálogo, requiere conversión a búsqueda)
10. **Máquinas de Envasado** (dinámico, requiere conversión a búsqueda)

### TIER 4 - Otros módulos
11. Revisar Clientes, Datasheets, y otros módulos

---

## Observaciones Generales

- **Campos con ***  son OBLIGATORIOS** y candidatos prioritarios
- **Muchas opciones están hardcodeadas en el código** en lugar de venir de ODISEO
- **Algunos campos son dinámicos** (dependen de otro campo - ej: Motivo depende de Clasificación)
- **Portfolio ya tiene estructura de catálogos** pero aún usa FormSelect
- **Las búsquedas inteligentes beneficiarían especialmente**: Material, País Destino, Unidad, Clasificación/Motivo
- **Material es el más complejo** - requiere búsqueda de dos niveles (grupo + material dentro del grupo)
