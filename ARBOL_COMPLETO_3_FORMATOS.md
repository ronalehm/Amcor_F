# 📦 Árbol Completo de Casuísticas - 3 Formatos (LÁMINA, BOLSA, POUCH)

**Versión:** 1.0  
**Fecha:** 2026-08-10  
**Total de Casuísticas:** 22 (3 LÁMINA + 3 BOLSA + 16 POUCH)

---

## 🎯 Estructura General por Tipo de Envoltura

```
ENVOLTURA (tipoFormato)
│
├─ 📄 LÁMINA (tipoFormatoLamina)
│  ├─ A. Genérica
│  ├─ B. Tissue
│  └─ C. Food
│
├─ 🛍️ BOLSA (tipoFormatoBolsa)
│  ├─ A. Bolsa (Presentación)
│  │  ├─ Sello Lateral / Fondo
│  │  └─ Acabado / Fuelle
│  ├─ B. Wicket
│  └─ C. Hojas
│
└─ 📦 POUCH (tipoFormatoPouch)
   ├─ A. Stand Up (3 sub-tipos + 4 Doy Pack = 6)
   ├─ B. Plano (2)
   ├─ C. Sello Central (6)
   └─ D. Sello Fuelle (2)
```

---

# 📄 TIPO 1: LÁMINA

## Estructura Base

```
LÁMINA (tipoFormatoLamina)
│
├─ 1️⃣ GENÉRICA
│  └─ blueprintFormat: "GENERICA"
│
├─ 2️⃣ TISSUE
│  └─ blueprintFormat: "TISSUE"
│
└─ 3️⃣ FOOD
   └─ blueprintFormat: "FOOD"
```

## Casuística 1: LÁMINA GENÉRICA

```
LÁMINA \ GENÉRICA
│
├─ blueprintFormat: "GENERICA"
├─ Descripción: Lámina de tipo Genérica (multi-propósito)
│
├─ CAMPOS OBLIGATORIOS:
│  ├─ tipoFormatoLamina: "Genérica" *
│  ├─ width: 1-9999 mm *
│  ├─ repetition: 1-9999 mm *
│  ├─ coreMaterial: * [SI - CATÁLOGO]
│  ├─ coreDiameter: * (numérico)
│  └─ externalDiameter: * (numérico)
│
├─ VALIDACIONES:
│  ├─ Perímetro = 2 × (width + repetition)
│  ├─ Rango perímetro: 100-20000 mm
│  └─ perimeterValidationStatus: Validado/Rechazado
│
├─ FOTOREGISTRO (OPCIONAL):
│  ├─ hasPhotoregister1: "Sí" / "No" / "Sin responder"
│  ├─ Si Sí:
│  │  ├─ fr1Width, fr1Height (obligatorios)
│  │  └─ Márgenes calculados automáticamente
│  └─ Si Fotoregistro2 → Automático/Manual
│
├─ SENTIDO DE BOBINADO:
│  ├─ rewindingDirection: 8 opciones *
│  └─ rewindingDirectionRef: opcional
│
└─ ESPECIFICACIONES OPCIONALES:
   ├─ externalVariationPlus: opcional
   ├─ externalVariationMinus: opcional
   └─ maxRollWeight: opcional
```

## Casuística 2: LÁMINA TISSUE

```
LÁMINA \ TISSUE
│
├─ blueprintFormat: "TISSUE"
├─ Descripción: Lámina de tipo Tissue (toallas de papel, papel higiénico)
│
├─ CAMPOS OBLIGATORIOS:
│  ├─ tipoFormatoLamina: "Tissue" *
│  ├─ width: 1-9999 mm * (SIN repetition)
│  ├─ coreMaterial: * [SI - CATÁLOGO]
│  ├─ coreDiameter: * (numérico)
│  └─ externalDiameter: * (numérico)
│
├─ VALIDACIONES:
│  ├─ Perímetro = 2 × (width + 0) [Sin repetition]
│  ├─ Rango perímetro: 100-20000 mm
│  └─ perimeterValidationStatus: Validado/Rechazado
│
├─ FOTOREGISTRO (OPCIONAL):
│  └─ Igual a GENÉRICA
│
├─ SENTIDO DE BOBINADO:
│  └─ rewindingDirection: 8 opciones *
│
└─ ESPECIFICACIONES OPCIONALES:
   ├─ hasPhotocell: Sí/No (condicional)
   └─ externalVariationPlus/Minus
```

## Casuística 3: LÁMINA FOOD

```
LÁMINA \ FOOD
│
├─ blueprintFormat: "FOOD"
├─ Descripción: Lámina para contacto con alimentos
│
├─ CAMPOS OBLIGATORIOS:
│  ├─ tipoFormatoLamina: "Food" *
│  ├─ width: 1-9999 mm * (SIN repetition)
│  ├─ coreMaterial: * [SI - CATÁLOGO]
│  ├─ coreDiameter: * (numérico)
│  └─ externalDiameter: * (numérico)
│
├─ VALIDACIONES:
│  ├─ Perímetro = 2 × (width + 0) [Sin repetition]
│  ├─ Rango perímetro: 100-20000 mm
│  └─ perimeterValidationStatus: Validado/Rechazado
│
├─ FOTOREGISTRO (OPCIONAL):
│  └─ Igual a GENÉRICA
│
├─ SENTIDO DE BOBINADO:
│  └─ rewindingDirection: 8 opciones *
│
└─ ESPECIFICACIONES OPCIONALES:
   ├─ hasPhotocell: Sí/No (condicional)
   └─ Certificaciones alimentarias (nota)
```

---

# 🛍️ TIPO 2: BOLSA

## Estructura Base

```
BOLSA (tipoFormatoBolsa)
│
├─ 1️⃣ BOLSA (Presentación)
│  ├─ Sello: Lateral / Fondo
│  ├─ Acabado: Corte / Pestaña (si Lateral)
│  └─ Fuelle: Sí / No
│
├─ 2️⃣ WICKET
│  ├─ Wicket: Sí / No
│  ├─ Pre-corte: Sí / No
│  ├─ Dispensador: Sí / No
│  └─ Control + Fotocélula
│
└─ 3️⃣ HOJAS
   └─ Configuración flexible
```

## Casuísticas: BOLSA (Presentación)

### Bolsa Presentación (4 Combinaciones Principales)

#### B1: Sello Lateral + Corte + Con Fuelle
```
BOLSA \ SELLO LATERAL \ CORTE \ CON FUELLE FONDO
│
├─ blueprintFormat: "SELLO LATERAL\CORTE\CON FUELLE FONDO"
├─ CAMPOS OBLIGATORIOS:
│  ├─ tipoFormatoBolsa: "Bolsa" *
│  ├─ tipoSelloBolsa: "Lateral" *
│  ├─ acabadoBolsa: "Corte" *
│  ├─ tieneFuelleBolsa: "Sí" *
│  ├─ width: 1-3000 mm *
│  ├─ length: 1-3000 mm *
│  └─ anchoFuelle: 0-500 mm *
│
├─ VALIDACIONES:
│  ├─ Perímetro = 2 × (width + length)
│  ├─ Rango perímetro: 100-10000 mm
│  └─ perimeterValidationStatus: Validado/Rechazado
│
├─ ACCESORIOS PRODUCTO (máx 3):
│  ├─ Asa Troquelada: tipoAsa, colorAsa, formaAsa
│  └─ Refuerzo: espesor, ancho
│
├─ ACCESORIOS INTERNOS (máx 3):
│  ├─ Corte Angular
│  ├─ Esquinas Redondas
│  ├─ Muesca
│  ├─ Perforación
│  └─ Pre-Corte
│
└─ ESPECIFICACIONES OPCIONALES:
   ├─ alturaEnLaBolsa
   └─ anchoEnLaBolsa
```

#### B2: Sello Lateral + Corte + Sin Fuelle
```
BOLSA \ SELLO LATERAL \ CORTE \ SIN FUELLE FONDO
│
├─ blueprintFormat: "SELLO LATERAL\CORTE\SIN FUELLE FONDO"
├─ Igual a B1 pero tieneFuelleBolsa: "No"
└─ anchoFuelle: NO APLICA
```

#### B3: Sello Lateral + Pestaña + Con Fuelle
```
BOLSA \ SELLO LATERAL \ PESTAÑA \ CON FUELLE FONDO
│
├─ blueprintFormat: "SELLO LATERAL\PESTAÑA\CON FUELLE FONDO"
├─ Igual a B1 pero acabadoBolsa: "Pestaña"
└─ Estructura similar
```

#### B4: Sello Lateral + Pestaña + Sin Fuelle
```
BOLSA \ SELLO LATERAL \ PESTAÑA \ SIN FUELLE FONDO
│
├─ blueprintFormat: "SELLO LATERAL\PESTAÑA\SIN FUELLE FONDO"
├─ Igual a B3 pero tieneFuelleBolsa: "No"
└─ Estructura similar
```

#### B5: Sello de Fondo + Con Fuelle Lateral
```
BOLSA \ SELLO DE FONDO \ CON FUELLE LATERAL
│
├─ blueprintFormat: "SELLO DE FONDO\CON FUELLE LATERAL"
├─ CAMPOS OBLIGATORIOS:
│  ├─ tipoFormatoBolsa: "Bolsa" *
│  ├─ tipoSelloBolsa: "Fondo" *
│  ├─ tieneFuelleBolsa: "Sí" *
│  ├─ width: 1-3000 mm *
│  ├─ length: 1-3000 mm *
│  └─ anchoFuelle: 0-500 mm *
│
├─ ACCESORIOS:
│  └─ MISMO que B1
│
└─ NOTA:
   └─ acabadoBolsa NO APLICA (solo Sello Lateral)
```

#### B6: Sello de Fondo + Sin Fuelle
```
BOLSA \ SELLO DE FONDO \ SIN FUELLE LATERAL
│
├─ blueprintFormat: "SELLO DE FONDO\SIN FUELLE LATERAL"
├─ Igual a B5 pero tieneFuelleBolsa: "No"
└─ Estructura similar
```

## Casuística: WICKET

```
BOLSA \ WICKET
│
├─ blueprintFormat: "WICKET"
├─ Descripción: Bolsa con soporte tipo Wicket para exhibición
│
├─ CAMPOS OBLIGATORIOS:
│  ├─ tipoFormatoBolsa: "Wicket" *
│  ├─ width: 1-3000 mm *
│  ├─ length: 1-3000 mm *
│  └─ anchoFuelle: 0-500 mm *
│
├─ WICKET CONFIGURATION:
│  ├─ hasWicket: Sí/No
│  ├─ Si Sí:
│  │  ├─ wicketDiameter: D 12 / D 14 / D 16
│  │  ├─ wicketDistSuperior: mm
│  │  └─ wicketDistDerecho: mm
│  │
│  ├─ hasWicketControl: Sí/No (condicional)
│  ├─ hasPrecorteWicket: Sí/No
│  ├─ hasCortaAliviador: Sí/No
│  ├─ hasDispensador: Sí/No
│  └─ hasFotocelulaBolsaWicket: Sí/No
│
├─ VALIDACIONES:
│  ├─ Perímetro = 2 × (width + length)
│  ├─ Rango perímetro: 100-10000 mm
│  └─ perimeterValidationStatus: Validado/Rechazado
│
└─ ESPECIFICACIONES OPCIONALES:
   ├─ anchoSolapa
   ├─ precutFuelleAbreFacil
   └─ bagPerforationType
```

## Casuística: HOJAS

```
BOLSA \ HOJAS
│
├─ blueprintFormat: "HOJAS"
├─ Descripción: Bolsa en formato de hojas (sin estructura específica)
│
├─ CAMPOS OBLIGATORIOS:
│  ├─ tipoFormatoBolsa: "Hojas" *
│  ├─ width: 1-3000 mm *
│  └─ length: 1-3000 mm *
│
├─ VALIDACIONES:
│  ├─ Perímetro = 2 × (width + length)
│  ├─ Rango perímetro: 100-10000 mm
│  └─ perimeterValidationStatus: Validado/Rechazado
│
└─ ESPECIFICACIONES:
   └─ Configuración flexible según cliente
```

---

# 📦 TIPO 3: POUCH

## Estructura Base

```
POUCH (tipoFormatoPouch)
│
├─ 1️⃣ STAND UP (6 casuísticas)
│  ├─ Sello K
│  ├─ Normal
│  └─ Doy Pack (4: 2 bases × 2 fuelles)
│
├─ 2️⃣ PLANO (2 casuísticas)
│  ├─ Dos Sellos
│  └─ Tres Sellos
│
├─ 3️⃣ SELLO CENTRAL (6 casuísticas)
│  ├─ PE-PE/PE (2: Con/Sin Fuelle)
│  ├─ Aleta (2: Con/Sin Fuelle)
│  └─ Otro Material (2: Con/Sin Fuelle)
│
└─ 4️⃣ SELLO FUELLE (2 casuísticas)
   ├─ Tipo 4-1
   └─ Tipo 1-1
```

## Casuísticas POUCH (Resumen)

### P1-P2: Stand Up - Sello K / Normal
```
Ambas tienen estructura idéntica:
├─ blueprintFormat: "POUCH STAND UP\{TIPO}\FUELLE PROPIO"
├─ Dimensiones: width (1-500), length (1-500), anchoFuelle (0-500)
├─ Perímetro: 2 × (width + length) → 100-15000 mm
├─ Accesorios: Zipper, Valve, Tin-Tie (máx 3)
└─ Validación: Estándar
```

### P3-P6: Stand Up - Doy Pack (4)
```
Validaciones ESPECIALES Doy Pack:
├─ width: 80-230 mm ⚠️ (NO 1-500)
├─ length: 134-340 mm ⚠️ (NO 1-500)
├─ anchoFuelle: 0-3 mm ⚠️ (NO 0-500)
├─ Perímetro: 100-650 mm ⚠️ (NO 100-15000)
└─ 4 combinaciones:
   ├─ Redonda + Propio
   ├─ Redonda + Insertado
   ├─ Cuadrada + Propio
   └─ Cuadrada + Insertado
```

### P7-P8: Plano - Dos/Tres Sellos
```
├─ blueprintFormat: "POUCH PLANO\{CANTIDAD SELLOS}"
├─ Dimensiones: width (1-500), length (1-500), anchoFuelle (0-500)
├─ Perímetro: 2 × (width + length) → 100-15000 mm
├─ Especificaciones Sello (opcionales):
│  ├─ anchoSello
│  ├─ selloAnchoTransversal
│  └─ anchoSelloLateral (SOLO Tres Sellos)
├─ Accesorios Consumibles: Zipper, Notch, Perforación (máx 3)
└─ Validación: Estándar
```

### P9-P14: Sello Central (6)
```
Material × Fuelle = 3 × 2 = 6 combinaciones:
├─ PE-PE/PE + Con Fuelle → MICROPERFORADO DISPONIBLE
├─ PE-PE/PE + Sin Fuelle
├─ Aleta + Con Fuelle
├─ Aleta + Sin Fuelle
├─ Otro + Con Fuelle
└─ Otro + Sin Fuelle

Especificaciones Comunes:
├─ anchoSelloAleta (opcional)
├─ selloAnchoTransversal (opcional)
├─ Cálculo: anchoTotalCalculado = anchoSelloAleta + selloAnchoTransversal
├─ Perímetro: 2 × (width + length) → 100-15000 mm
└─ Accesorios: Zipper, Valve, Tin-Tie (máx 3)
```

### P15-P16: Sello Fuelle - Tipo 4-1 / 1-1
```
├─ blueprintFormat: "POUCH C/SELLO EN FUELLE\{TIPO}\FUELLE PROPIO"
├─ Dimensiones: width (1-500), length (1-500), anchoFuelle (0-500)
├─ Perímetro: 2 × (width + length) → 100-15000 mm
├─ Especificaciones (opcionales):
│  └─ anchoSelloLateral
├─ Accesorios: Zipper, Valve, Tin-Tie (máx 3)
└─ Validación: Estándar
```

---

## 📋 Matriz Consolidada - 22 Casuísticas

| Tipo | # | Familia/Tipo | Casuística | BlueprintFormat | Dimensiones | Perímetro | Especiales |
|:---:|:---:|:---|:---|:---|:---:|:---:|:---|
| LÁMINA | 1 | Genérica | - | GENERICA | w,r | 100-20000 | FR, Sentido |
| LÁMINA | 2 | Tissue | - | TISSUE | w | 100-20000 | FR, Fotocélula |
| LÁMINA | 3 | Food | - | FOOD | w | 100-20000 | FR, Fotocélula |
| BOLSA | 4 | Bolsa | Lat+Cort+F | SELLO LATERAL\CORTE\CON FUELLE | w,l,f | 100-10000 | Accesorios |
| BOLSA | 5 | Bolsa | Lat+Cort | SELLO LATERAL\CORTE\SIN FUELLE | w,l,f | 100-10000 | Accesorios |
| BOLSA | 6 | Bolsa | Lat+Pest+F | SELLO LATERAL\PESTAÑA\CON FUELLE | w,l,f | 100-10000 | Accesorios |
| BOLSA | 7 | Bolsa | Lat+Pest | SELLO LATERAL\PESTAÑA\SIN FUELLE | w,l,f | 100-10000 | Accesorios |
| BOLSA | 8 | Bolsa | Fond+F | SELLO DE FONDO\CON FUELLE | w,l,f | 100-10000 | Accesorios |
| BOLSA | 9 | Bolsa | Fond | SELLO DE FONDO\SIN FUELLE | w,l,f | 100-10000 | Accesorios |
| BOLSA | 10 | Wicket | - | WICKET | w,l,f | 100-10000 | Wicket Config |
| BOLSA | 11 | Hojas | - | HOJAS | w,l | 100-10000 | - |
| POUCH | 12 | Stand Up | Sello K | POUCH STAND UP\TIPO K\FUELLE PROPIO | w,l,f | 100-15000 | - |
| POUCH | 13 | Stand Up | Normal | POUCH STAND UP\NORMAL\FUELLE PROPIO | w,l,f | 100-15000 | - |
| POUCH | 14 | Doy Pack | Red+Prop | POUCH STAND UP\DOY PACK REDONDO\FUELLE PROPIO | w⚠️,l⚠️,f⚠️ | 100-650⚠️ | Validación DoyPack |
| POUCH | 15 | Doy Pack | Red+Ins | POUCH STAND UP\DOY PACK REDONDO\FUELLE INSERTADO | w⚠️,l⚠️,f⚠️ | 100-650⚠️ | Validación DoyPack |
| POUCH | 16 | Doy Pack | Cuad+Prop | POUCH STAND UP\DOY PACK CUADRADO\FUELLE PROPIO | w⚠️,l⚠️,f⚠️ | 100-650⚠️ | Validación DoyPack |
| POUCH | 17 | Doy Pack | Cuad+Ins | POUCH STAND UP\DOY PACK CUADRADO\FUELLE INSERTADO | w⚠️,l⚠️,f⚠️ | 100-650⚠️ | Validación DoyPack |
| POUCH | 18 | Plano | Dos | POUCH PLANO\DOS SELLOS | w,l,f | 100-15000 | - |
| POUCH | 19 | Plano | Tres | POUCH PLANO\TRES SELLOS | w,l,f | 100-15000 | anchoSelloLateral |
| POUCH | 20 | Sello Central | PE-PE/PE+F | POUCH C/SELLO CENTRAL\TIPO ALETA\CON FUELLE (PE-PE/PE) | w,l,f | 100-15000 | Microperforado |
| POUCH | 21 | Sello Central | PE-PE/PE | POUCH C/SELLO CENTRAL\TIPO ALETA\SIN FUELLE (PE-PE/PE) | w,l,f | 100-15000 | - |
| POUCH | 22+ | Sello Central / Fuelle | Mixed | + 6 más... | w,l,f | 100-15000 | Variables |

---

## 🔐 Matriz de Validaciones Consolidada

### LÁMINA
```
Campos Obligatorios: 6
├─ tipoFormatoLamina: Genérica | Tissue | Food
├─ width: 1-9999 mm
├─ repetition: 1-9999 mm (SOLO Genérica)
├─ coreMaterial: [SI - Catálogo]
├─ coreDiameter: numérico
└─ externalDiameter: numérico

Perímetro:
├─ Fórmula: 2 × (width + repetition)
├─ Rango: 100-20000 mm
└─ Estado: Validado/Rechazado (obligatorio)

Especiales:
├─ Fotoregistro: SOLO LÁMINA (opcional)
├─ Sentido de Bobinado: 8 opciones
└─ Células: Fotocélula (Tissue/Food solo)
```

### BOLSA
```
Campos Obligatorios: 5-7
├─ tipoFormatoBolsa: Bolsa | Wicket | Hojas
├─ width: 1-3000 mm
├─ length: 1-3000 mm
├─ anchoFuelle: 0-500 mm (SOLO si Fuelle=Sí)
├─ tipoSelloBolsa: Lateral | Fondo (si Bolsa)
├─ acabadoBolsa: Corte | Pestaña (si Lateral)
└─ tieneFuelleBolsa: Sí | No (si Bolsa)

Perímetro:
├─ Fórmula: 2 × (width + length)
├─ Rango: 100-10000 mm
└─ Estado: Validado/Rechazado (obligatorio)

Especiales:
├─ Accesorios: máx 3 totales
├─ Wicket: 5+ campos condicionales
└─ Cascadas: Sello → Acabado → Fuelle
```

### POUCH
```
Campos Obligatorios: 5-7
├─ tipoFormatoPouch: StandUp | Plano | SelloCentral | SelloFuelle
├─ width: 1-500 mm (80-230 si DoyPack ⚠️)
├─ length: 1-500 mm (134-340 si DoyPack ⚠️)
├─ anchoFuelle: 0-500 mm (0-3 si DoyPack ⚠️)
├─ tipoStandUpPouch (si Stand Up)
├─ cantidadSellosPouchPlano (si Plano)
├─ materialSelloCentralPouch (si Sello Central)
└─ tipoSelloFuellePouch (si Sello Fuelle)

Perímetro:
├─ Fórmula: 2 × (width + length)
├─ Rango: 100-15000 mm (100-650 si DoyPack ⚠️)
└─ Estado: Validado/Rechazado (obligatorio)

Especiales:
├─ Doy Pack: Validaciones más restrictivas ⚠️
├─ Microperforado: SOLO PE-PE/PE + Fuelle
├─ Ancho Total: Cálculo automático (Sello Central)
├─ Accesorios: máx 3 totales
└─ Cascadas: 4 niveles (familia → sub → combinación → campos)
```

---

## 📊 Estadísticas Consolidadas

| Métrica | LÁMINA | BOLSA | POUCH | TOTAL |
|:---|:---:|:---:|:---:|:---:|
| **Casuísticas** | 3 | 8 | 16 | **27** |
| **Familias/Tipos** | 3 | 3 | 4 | **10** |
| **Campos Obligatorios** | 6 | 5-7 | 5-7 | **16-20** |
| **Campos Opcionales** | 5+ | 10+ | 15+ | **30+** |
| **Perímetro Rango** | 100-20000 | 100-10000 | 100-15000 | Variable |
| **Accesorios** | 0 | 3 max | 3 max | - |
| **Validaciones Especiales** | 1 (FR) | 1 (Wicket) | 2 (DoyPack, Micro) | 4+ |
| **Cálculos Automáticos** | 7 (Márgenes FR) | 0 | 3 (Perímetro, Ancho) | 10+ |
| **Cascadas (Niveles)** | 1 | 3 | 4 | - |

---

## 🎯 Resumen Comparativo

### Por Complejidad
```
SIMPLE: LÁMINA
├─ Flujo lineal (Tipo → Dimensiones → Core → Sentido)
├─ 3 casuísticas sencillas
└─ Cascadas mínimas

MEDIA: BOLSA
├─ Flujo ramificado (Presentación → Sello → Acabado → Fuelle)
├─ 8 casuísticas (6 Bolsa + Wicket + Hojas)
├─ Cascadas moderadas
└─ Wicket con campos condicionales complejos

ALTA: POUCH
├─ Flujo muy ramificado (4 niveles)
├─ 16 casuísticas
├─ Validaciones especiales (Doy Pack)
├─ Múltiples cálculos automáticos
└─ Cascadas profundas
```

### Por Validaciones
```
LÁMINA:
✓ width: 1-9999 mm
✓ repetition: 1-9999 mm
✓ Perímetro: 100-20000 mm
✓ Fotoregistro (opcional)

BOLSA:
✓ width: 1-3000 mm
✓ length: 1-3000 mm
✓ anchoFuelle: 0-500 mm
✓ Perímetro: 100-10000 mm
✓ Accesorios (máx 3)

POUCH General:
✓ width: 1-500 mm
✓ length: 1-500 mm
✓ anchoFuelle: 0-500 mm
✓ Perímetro: 100-15000 mm

POUCH Doy Pack (ESPECIAL):
✓ width: 80-230 mm ⚠️
✓ length: 134-340 mm ⚠️
✓ anchoFuelle: 0-3 mm ⚠️
✓ Perímetro: 100-650 mm ⚠️
```

---

## 🔑 Reglas de Condicionalidad Globales

```
1. CASCADAS JERÁRQUICAS:
   - LÁMINA: Lineal (1 nivel)
   - BOLSA: 3 niveles (Tipo → Sello → Acabado/Fuelle)
   - POUCH: 4 niveles (Familia → Sub → Combinación → Campos)

2. VALIDACIONES DINÁMICAS:
   - Doy Pack (POUCH): Rangos más restrictivos
   - Wicket (BOLSA): Campos condicionales múltiples
   - FR (LÁMINA): Márgenes calculados

3. CÁLCULOS AUTOMÁTICOS:
   - Perímetro: TODOS (fórmula específica por tipo)
   - Ancho Total: POUCH Sello Central
   - Márgenes: LÁMINA Fotoregistro

4. ACCESORIOS:
   - BOLSA: máx 3 (Producto + Internos separados)
   - POUCH: máx 3 (Zipper, Valve, Tin-Tie)
   - LÁMINA: 0 (no aplica)

5. CAMPOS SI (CATÁLOGOS):
   - coreMaterial (LÁMINA): [SI - CATÁLOGO]
   - TODO LO DEMÁS: ODISEO (local)
```

---

## ✅ Campos Obligatorios por Envoltura

### LÁMINA (6 obligatorios)
1. tipoFormatoLamina *
2. width *
3. repetition * (SOLO Genérica)
4. coreMaterial * [SI]
5. coreDiameter *
6. externalDiameter *

### BOLSA (5-7 obligatorios)
1. tipoFormatoBolsa *
2. width *
3. length *
4. anchoFuelle * (si Fuelle=Sí)
5. tipoSelloBolsa * (si Bolsa)
6. acabadoBolsa * (si Lateral)
7. tieneFuelleBolsa * (si Bolsa)

### POUCH (5-7 obligatorios)
1. tipoFormatoPouch *
2. width * (1-500, 80-230 si DoyPack)
3. length * (1-500, 134-340 si DoyPack)
4. anchoFuelle * (0-500, 0-3 si DoyPack)
5. tipoStandUpPouch * (si Stand Up)
6. cantidadSellosPouchPlano * (si Plano)
7. materialSelloCentralPouch * (si Sello Central)
8. tipoSelloFuellePouch * (si Sello Fuelle)

---

**Documento Completo - Árbol de Casuísticas de los 3 Formatos** ✅

**3 Tipos** | **27 Casuísticas Únicas** | **Totalmente Documentadas**
