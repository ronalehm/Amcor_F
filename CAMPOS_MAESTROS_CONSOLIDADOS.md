# 📊 CAMPOS MAESTROS CONSOLIDADOS - 27 Casuísticas

**Versión:** 2.0  
**Fecha:** 2026-08-10  
**Total Campos Base:** 30+ por formato | **Total Casuísticas:** 27

---

# ESTRATEGIA DE MAPEO

## Nivel 1: Campos Maestros por Formato
Tabla de todos los campos posibles que pueden aparecer en cada formato

## Nivel 2: Matriz de Visibilidad por Casuística
Tabla que muestra qué campos aparecen en cada casuística

---

# PARTE A: CAMPOS MAESTROS - LÁMINA

| # | Campo | Visible | Editable | Catálogo | Obligatorio | Rango/Opciones | Validación |
|:---|:---|:---:|:---:|:---|:---:|:---|:---|
| 1 | Envoltura | ✅ | ❌ | Local | ✅ | LÁMINA | Read-only |
| 2 | Tipo Formato | ✅ | ❌ | Local | ✅ | Genérica/Tissue/Food | Auto-set |
| 3 | Width (mm) | ✅ | ✅ | Local | ✅ | 1-9999 | onChange |
| 4 | Repetition (mm) | ✅ | ✅ | Local | ✅ | 1-9999 | onChange |
| 5 | Perímetro (mm) | ✅ | ❌ | Local | ✅ | 100-20000 | Auto-calc |
| 6 | Validación Perímetro | ✅ | ❌ | Local | ✅ | Validado/Rechazado | Auto |
| 7 | Material Core [SI] | ✅ | ✅ | **SI** | ✅ | [SI Catalog] | required |
| 8 | Diámetro Core (mm) | ✅ | ✅ | Local | ✅ | 76-152 | onChange |
| 9 | Variaciones Core | ✅ | ✅ | **ODISEO** | ⚪ | [Multiple] | - |
| 10 | Sentido Bobinado | ✅ | ✅ | Local | ✅ | 8 opciones | required |
| 11 | ¿Fotoregistro 1? | ✅ | ✅ | Local | ⚪ | Sí/No | onChange |
| 12 | FR1 Width (mm) | ✅* | ✅ | Local | ⚪ | 1-9999 | if #11=Sí |
| 13 | FR1 Height (mm) | ✅* | ✅ | Local | ⚪ | 1-9999 | if #11=Sí |
| 14 | FR1 Ref Horiz | ✅* | ✅ | Local | ⚪ | Left/Right | if #11=Sí |
| 15 | FR1 Ref Vert | ✅* | ✅ | Local | ⚪ | Top/Bottom | if #11=Sí |
| 16 | FR1 Dist Horiz (mm) | ✅* | ✅ | Local | ⚪ | 0-9999 | if #11=Sí |
| 17 | FR1 Dist Vert (mm) | ✅* | ✅ | Local | ⚪ | 0-9999 | if #11=Sí |
| 18 | FR1 Margin Left | ✅* | ❌ | Local | ⚪ | - | Calc |
| 19 | FR1 Margin Right | ✅* | ❌ | Local | ⚪ | - | Calc |
| 20 | FR1 Margin Top | ✅* | ❌ | Local | ⚪ | - | Calc |
| 21 | FR1 Margin Bottom | ✅* | ❌ | Local | ⚪ | - | Calc |
| 22 | ¿Cuántos FR? | ✅* | ✅ | Local | ⚪ | 1/2 | if #11=Sí |
| 23 | FR2 Modo | ✅* | ✅ | Local | ⚪ | Automático/Manual | if #22=2 |
| 24 | FR2 Width (mm) | ✅* | ✅ | Local | ⚪ | 1-9999 | if #22=2 & Manual |
| 25 | FR2 Height (mm) | ✅* | ✅ | Local | ⚪ | 1-9999 | if #22=2 & Manual |
| 26 | Blueprint Format | ✅ | ❌ | Local | ✅ | "GENERICA/TISSUE/FOOD" | Auto-generate |

**Notas:**
- `✅*` = Visible condicionalmente
- **SI** = Sistema Integral (datos de referencia, heredados)
- **ODISEO** = Datos locales ODISEO (editables)
- **Local** = Datos calculados o enumeraciones

**Total LÁMINA:** 26 campos | **Obligatorios:** 10 | **Condicionales:** 12

---

# PARTE B: CAMPOS MAESTROS - BOLSA

| # | Campo | Visible | Editable | Catálogo | Obligatorio | Rango/Opciones | Validación |
|:---|:---|:---:|:---:|:---|:---:|:---|:---|
| 1 | Envoltura | ✅ | ❌ | Local | ✅ | BOLSA | Read-only |
| 2 | Presentación | ✅ | ❌ | Local | ✅ | Bolsa/Wicket/Hojas | Auto-set |
| 3 | Tipo Sello | ✅ | ✅ | Local | ✅ | Lateral/Fondo | onChange |
| 4 | Acabado | ✅* | ✅ | Local | ✅* | Corte/Pestaña | if #3=Lateral |
| 5 | ¿Tiene Fuelle? | ✅ | ✅ | Local | ✅ | Sí/No | onChange |
| 6 | Width (mm) | ✅ | ✅ | Local | ✅ | 1-3000 | onChange |
| 7 | Length (mm) | ✅ | ✅ | Local | ✅ | 1-3000 | onChange |
| 8 | Ancho Fuelle (mm) | ✅* | ✅ | Local | ✅* | 0-500 | if #5=Sí |
| 9 | Perímetro (mm) | ✅ | ❌ | Local | ✅ | 100-10000 | Auto-calc |
| 10 | Validación Perímetro | ✅ | ❌ | Local | ✅ | Validado/Rechazado | Auto |
| 11 | Material [SI] | ✅ | ✅ | **SI** | ✅ | [SI Catalog] | required |
| 12 | ¿Tiene Wicket? | ✅* | ✅ | Local | ✅* | Sí/No | if #2=Wicket |
| 13 | Diámetro Wicket | ✅* | ✅ | **ODISEO** | ⚪ | D12/D14/D16 | if #12=Sí |
| 14 | Control Wicket | ✅* | ✅ | **ODISEO** | ⚪ | Sencillo/Doble | if #12=Sí |
| 15 | Wicket Precorte | ✅* | ✅ | Local | ⚪ | Sí/No | if #12=Sí |
| 16 | Wicket Dispensador | ✅* | ✅ | Local | ⚪ | Sí/No | if #12=Sí |
| 17 | Wicket Fotocélula | ✅* | ✅ | Local | ⚪ | Sí/No | if #12=Sí |
| 18 | Asa Troquelada | ✅* | ✅ | **ODISEO** | ⚪ | Sí/No | Modal |
| 19 | Tipo Asa | ✅* | ✅ | **ODISEO** | ⚪ | [Tipos] | if Asa=Sí |
| 20 | Color Asa | ✅* | ✅ | **ODISEO** | ⚪ | [Colores] | if Asa=Sí |
| 21 | Refuerzo | ✅* | ✅ | **ODISEO** | ⚪ | Sí/No | Modal |
| 22 | Tipo Refuerzo | ✅* | ✅ | **ODISEO** | ⚪ | [Tipos] | if Refuerzo=Sí |
| 23 | Corte Angular | ✅* | ✅ | **ODISEO** | ⚪ | Sí/No | Modal |
| 24 | Esquinas Redondas | ✅* | ✅ | **ODISEO** | ⚪ | Sí/No | Modal |
| 25 | Muesca | ✅* | ✅ | **ODISEO** | ⚪ | Sí/No | Modal |
| 26 | Perforación | ✅* | ✅ | **ODISEO** | ⚪ | Sí/No | Modal |
| 27 | Pre-Corte | ✅* | ✅ | **ODISEO** | ⚪ | Sí/No | Modal |
| 28 | Especificaciones Sello | ✅* | ✅ | **ODISEO** | ⚪ | Text | - |
| 29 | Blueprint Format | ✅ | ❌ | Local | ✅ | Auto-generated | Auto-generate |

**Notas:**
- Accesorios: Máximo 3 total (combinación de Producto + Internos)
- Wicket solo para Presentación = "Wicket"

**Total BOLSA:** 29 campos | **Obligatorios:** 11 | **Condicionales:** 15

---

# PARTE C: CAMPOS MAESTROS - POUCH

| # | Campo | Visible | Editable | Catálogo | Obligatorio | Rango/Opciones | Validación |
|:---|:---|:---:|:---:|:---|:---:|:---|:---|
| 1 | Envoltura | ✅ | ❌ | Local | ✅ | POUCH | Read-only |
| 2 | Familia | ✅ | ✅ | Local | ✅ | Stand Up/Plano/SelloCentral/SelloFuelle | onChange |
| 3 | Sub-familia StandUp | ✅* | ✅ | Local | ✅* | Sello K/Normal/Doy Pack | if #2=StandUp |
| 4 | Base DoyPack | ✅* | ✅ | Local | ✅* | Redonda/Cuadrada | if #3=DoyPack |
| 5 | Fuelle Tipo DoyPack | ✅* | ✅ | Local | ✅* | Propio/Insertado | if #3=DoyPack |
| 6 | Cantidad Sellos Plano | ✅* | ✅ | Local | ✅* | Dos/Tres | if #2=Plano |
| 7 | Material SelloCentral | ✅* | ✅ | Local | ✅* | PE-PE/PE/Aleta/Otro | if #2=SelloCentral |
| 8 | Tipo SelloFuelle | ✅* | ✅ | Local | ✅* | 4-1/1-1 | if #2=SelloFuelle |
| 9 | ¿Tiene Fuelle? | ✅ | ✅ | Local | ✅ | Sí/No | onChange |
| 10 | Width (mm) | ✅ | ✅ | Local | ✅ | 1-500 / 80-230** | onChange |
| 11 | Length (mm) | ✅ | ✅ | Local | ✅ | 1-500 / 134-340** | onChange |
| 12 | Ancho Fuelle (mm) | ✅* | ✅ | Local | ✅* | 0-500 / 0-3** | if #9=Sí |
| 13 | Perímetro (mm) | ✅ | ❌ | Local | ✅ | 100-15000 / 100-650** | Auto-calc |
| 14 | Validación Perímetro | ✅ | ❌ | Local | ✅ | Validado/Rechazado | Auto |
| 15 | Material [SI] | ✅ | ✅ | **SI** | ✅ | [SI Catalog] | required |
| 16 | ¿Tiene Microperforado? | ✅* | ✅ | Local | ⚪ | Sí/No | if PE-PE/PE+Fuelle |
| 17 | Lado Aleta | ✅* | ✅ | Local | ⚪ | Derecho/Izquierdo | if #16=Sí |
| 18 | Tipo Microperforado | ✅* | ✅ | **ODISEO** | ⚪ | Total/Parcial | if #16=Sí |
| 19 | Separación Puas (mm) | ✅* | ✅ | Local | ⚪ | 0-50 | if #16=Sí |
| 20 | Distancia Lado Aleta | ✅* | ✅ | Local | ⚪ | 0-500 | if #16=Sí |
| 21 | Ancho Sello Aleta (mm) | ✅* | ✅ | Local | ⚪ | 10/12/15 | if PE-PE/PE |
| 22 | Sello Ancho Transversal | ✅* | ✅ | Local | ⚪ | 0-500 | if PE-PE/PE |
| 23 | Ancho Total Calculado | ✅* | ❌ | Local | ⚪ | - | Calc #21+#22 |
| 24 | Ancho Sello Lateral Plano | ✅* | ✅ | Local | ⚪ | 0-500 | if Plano+Tres |
| 25 | Especificaciones Sello | ✅* | ✅ | **ODISEO** | ⚪ | Text | - |
| 26 | Zipper | ✅* | ✅ | **ODISEO** | ⚪ | Sí/No | Modal |
| 27 | Tipo Zipper | ✅* | ✅ | **ODISEO** | ⚪ | [Tipos] | if Zipper=Sí |
| 28 | Valve | ✅* | ✅ | **ODISEO** | ⚪ | Sí/No | Modal |
| 29 | Tipo Valve | ✅* | ✅ | **ODISEO** | ⚪ | [Tipos] | if Valve=Sí |
| 30 | Tin-Tie | ✅* | ✅ | **ODISEO** | ⚪ | Sí/No | Modal |
| 31 | Tipo Tin-Tie | ✅* | ✅ | **ODISEO** | ⚪ | [Tipos] | if Tin-Tie=Sí |
| 32 | Blueprint Format | ✅ | ❌ | Local | ✅ | Auto-generated | Auto-generate |

**Notas:**
- `**` = Validación especial para Doy Pack
- Accesorios: Máximo 3 total (Zipper + Valve + Tin-Tie)

**Total POUCH:** 32 campos | **Obligatorios:** 10 | **Condicionales:** 18

---

# PARTE D: MATRIZ DE VISIBILIDAD POR CASUÍSTICA

## LÁMINA - Matriz de Campos

| Casuística | Genérica | Tissue | Food |
|:---|:---:|:---:|:---:|
| Campos base (1-10) | ✅ | ✅ | ✅ |
| Fotoregistro (11-25) | ✅* | ✅* | ✅* |
| Blueprint Format (26) | ✅ | ✅ | ✅ |
| **Total Campos** | **26** | **26** | **26** |
| **Diferencia** | Blueprint="GENERICA" | Blueprint="TISSUE" | Blueprint="FOOD" |

**Conclusión:** Las 3 casuísticas LÁMINA son idénticas en estructura, solo cambia el valor del Blueprint Format

---

## BOLSA - Matriz de Campos

| Campo \ Casuística | Lat.Corte | Lat.Pestaña | Fondo | Wicket | Hojas |
|:---|:---:|:---:|:---:|:---:|:---:|
| Base (1-11) | ✅ | ✅ | ✅ | ✅ | ✅ |
| Acabado (#4) | ✅ | ✅ | ❌ | ❌ | ❌ |
| Wicket (12-17) | ❌ | ❌ | ❌ | ✅ | ❌ |
| Accesorios Prod (18-22) | ✅ | ✅ | ✅ | ✅ | ✅ |
| Accesorios Int (23-27) | ✅ | ✅ | ✅ | ✅ | ✅ |
| Especificaciones (28) | ✅ | ✅ | ✅ | ✅ | ✅ |
| Blueprint (29) | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Total Campos Visibles** | **26** | **26** | **25** | **29** | **25** |
| **Campos Únicos** | Acabado + Accesorios | Acabado + Accesorios | Accesorios | Wicket + Accesorios | Accesorios |

---

## POUCH - Matriz de Campos

| Campo \ Casuística | StandUp-K | StandUp-Norm | DoyPack-R/P | Plano-Dos | Plano-Tres | SC-PE+F | SC-PE-F | SC-Aleta | SF-4-1 |
|:---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| Base (1-15) | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Sub-familia (3) | K | Normal | DoyPack | - | - | - | - | - | - |
| Validación DoyPack (7-14) | Std | Std | **SPEC** | Std | Std | Std | Std | Std | Std |
| Base/Fuelle DoyPack (4-5) | - | - | ✅ | - | - | - | - | - | - |
| Cantidad Plano (6) | - | - | - | Dos | Tres | - | - | - | - |
| Sello Lateral Plano (24) | - | - | - | ❌ | ✅ | - | - | - | - |
| Microperforado (16-20) | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Sello Central (21-23) | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ | ❌ |
| Accesorios (26-31) | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Total Campos Visibles** | **12** | **12** | **14** | **13** | **13** | **20** | **19** | **19** | **12** |

---

# PARTE E: TABLA CONSOLIDADA - RESUMEN EJECUTIVO

## CAMPOS TOTALES MAPEADOS

| Formato | Campos Base | Campos Condicionales | Campos Total | Casuísticas | Combinaciones Únicas |
|:---|:---:|:---:|:---:|:---:|:---:|
| **LÁMINA** | 10 | 16 | 26 | 3 | 1 (todas idénticas) |
| **BOLSA** | 11 | 18 | 29 | 5 | 5 (todas diferentes) |
| **POUCH** | 10 | 22 | 32 | 16 | 9 (múltiples variaciones) |
| **TOTAL** | **31** | **56** | **87** | **27** | **15 únicos** |

**Observación Crítica:** 
- Solo hay **15 casuísticas únicas** en términos de composición de campos
- Las otras 12 son variaciones de las mismas con diferentes valores de opciones

---

# PARTE F: CLASIFICACIÓN DE CAMPOS POR TIPO

## Campos por Categoría

### Categoría 1: Identificación (Obligatorios, Read-only)
```
├─ Envoltura (LÁMINA/BOLSA/POUCH)
├─ Tipo Formato (Genérica, Bolsa, Stand Up, etc.)
├─ Familia (solo POUCH)
└─ Blueprint Format (auto-generated)
```

### Categoría 2: Dimensionales (Obligatorios, Editables, Local)
```
├─ Width (mm)
├─ Length (mm)
├─ Repetition (mm)
├─ Ancho Fuelle (mm)
├─ Perímetro (mm) - Calculado
└─ Validación Perímetro - Calculado
```

### Categoría 3: Materiales (Obligatorios, Editables, SI)
```
└─ Material [SI] - Catálogo Sistema Integral
```

### Categoría 4: Configuración Específica (Condicionales, Editables)
```
LÁMINA:
├─ Diámetro Core
├─ Variaciones Core (ODISEO)
├─ Sentido Bobinado
└─ Fotoregistro (12 campos)

BOLSA:
├─ Tipo Sello
├─ Acabado
├─ Wicket (5 campos)
└─ Especificaciones Sello

POUCH:
├─ Familia + Sub-familia
├─ Microperforado (5 campos)
├─ Sello Central (3 campos)
└─ Accesorios (6 campos)
```

### Categoría 5: Accesorios (Condicionales, Editables, ODISEO, Máx 3)
```
BOLSA:
├─ Asa Troquelada + subtipos
├─ Refuerzo + subtipos
├─ Corte Angular
├─ Esquinas Redondas
├─ Muesca
├─ Perforación
└─ Pre-Corte

POUCH:
├─ Zipper + subtipos
├─ Valve + subtipos
└─ Tin-Tie + subtipos
```

---

# PARTE G: TABLA DE EQUIVALENCIAS - CAMPOS ANÁLOGOS

| Concepto | LÁMINA | BOLSA | POUCH |
|:---|:---|:---|:---|
| **Dimensión 1** | Width | Width | Width |
| **Dimensión 2** | Repetition | Length | Length |
| **Dimensión 3** | - | Ancho Fuelle | Ancho Fuelle |
| **Perímetro** | 2×(W+R) | 2×(W+L) | 2×(W+L) |
| **Rango Perímetro** | 100-20000 | 100-10000 | 100-15000/100-650* |
| **Material Ref** | Material Core [SI] | Material [SI] | Material [SI] |
| **Configuración Especial** | Fotoregistro (LÁMINA only) | Wicket (if Bolsa=Wicket) | Microperforado (if PE-PE+Fuelle) |
| **Accesorios** | ❌ | ✅ (máx 3) | ✅ (máx 3) |
| **Formato** | Type-based | Type-based | Family-based |

---

# PARTE H: ESTADÍSTICAS FINALES

## Resumen Campos por Tipo

```
Campos OBLIGATORIOS (10-11 cada formato):
├─ Envoltura/Familia ........................... 1 campo
├─ Dimensiones (Width, Length/Repetition) ... 2 campos
├─ Perímetro + Validación .................... 2 campos
├─ Material [SI] ............................. 1 campo
├─ Tipo/Configuración Base ................... 2-3 campos
└─ Blueprint Format .......................... 1 campo

Campos CONDICIONALES (16-22 cada formato):
├─ Opcionales de Configuración ............... 5-8 campos
├─ Accesorios/Especificaciones .............. 5-12 campos
└─ Cálculos Derivados ....................... 2-4 campos
```

## Distribución de Catálogos

```
SI (Sistema Integral):
├─ Material ................................. ~1 campo por casuística
└─ Total SI: 27 campos (1 × 27 casuísticas)

ODISEO (Local):
├─ Configuración especial ................... ~8-15 campos por formato
├─ Accesorios y subtipos ................... ~5-10 campos por formato
└─ Total ODISEO: ~250+ campos (variables por casuística)

Local (Enumeraciones/Cálculos):
├─ Envoltura, Tipo, Familia ................. 5-10 campos
├─ Dimensiones y Perímetro ................. 6-8 campos
└─ Total Local: ~150+ campos
```

---

# PARTE I: MATRIZ DE EDITABILIDAD

| Tipo de Campo | Visible | Editable | Catálogo | Ejemplo |
|:---|:---:|:---:|:---|:---|
| Identificación | ✅ | ❌ | Local | Envoltura, Tipo |
| Dimensional Editable | ✅ | ✅ | Local | Width, Length, Repetition |
| Dimensión Calculada | ✅ | ❌ | Local | Perímetro |
| Validación Estado | ✅ | ❌ | Local | Validación Perímetro |
| Catálogo SI | ✅ | ✅ | **SI** | Material [SI] |
| Configuración ODISEO | ✅* | ✅ | **ODISEO** | Variaciones Core, Wicket Type |
| Accesorios ODISEO | ✅* | ✅ | **ODISEO** | Zipper, Asa Troquelada |
| Especificaciones | ✅* | ✅ | **ODISEO** | Sentido Bobinado, Tipo Sello |

---

# PARTE J: REGLAS DE VALIDACIÓN CONSOLIDADAS

## Regla 1: Dimensiones
```
LÁMINA: width (1-9999) + repetition (1-9999) → período (100-20000)
BOLSA:  width (1-3000) + length (1-3000) → período (100-10000)
POUCH:  width (1-500) + length (1-500) → período (100-15000)
POUCH*: width (80-230) + length (134-340) → período (100-650)
```

## Regla 2: Período
```
SIEMPRE: Período = 2 × (Dimensión1 + Dimensión2)
VALIDAR: Período >= min AND Período <= max
MOSTRAR: Estado (Validado/Rechazado)
BLOQUEAR: Si Rechazado, no permitir guardar
```

## Regla 3: Material
```
SIEMPRE: Requerido [SI]
BLOQUEADOR: Si vacío, no permitir guardar
REFERENCIA: Se usa para herencia en Producto Modificado
```

## Regla 4: Accesorios
```
MÁXIMO: 3 accesorios totales por proyecto
VALIDAR: count(accesorios) <= 3
BLOQUEAR: No permitir agregar más de 3
```

## Regla 5: Fotoregistro (LÁMINA only)
```
VISIBLE: Solo si Envoltura = LÁMINA
CONDICIONAL: Si hasPhotoregister1 = Sí
MÁXIMO: 2 fotoregistros (FR1 + FR2)
CÁLCULO: Márgenes automáticos
```

## Regla 6: Microperforado (POUCH Sello Central)
```
VISIBLE: Solo si Material = PE-PE/PE AND Fuelle = Sí
CAMPOS: 5 campos condicionales (lado, tipo, separación, distancia)
VALIDAR: Separación >= 0, Distancia >= 0
```

---

**📊 DOCUMENTO COMPLETO - Campos Maestros Consolidados** ✅

**Resumen:**
- ✅ 3 Tablas de Campos Maestros (LÁMINA, BOLSA, POUCH)
- ✅ Matriz de Visibilidad por Casuística (15 casuísticas únicas)
- ✅ Clasificación de Campos por Tipo
- ✅ Equivalencias Análogas
- ✅ Estadísticas Finales
- ✅ Matriz de Editabilidad
- ✅ Reglas de Validación Consolidadas

**Totales:**
- 87 campos únicos mapeados
- 31 campos base comunes
- 56 campos condicionales
- 27 casuísticas (15 únicas)
- ~450 combinaciones campo-casuística
