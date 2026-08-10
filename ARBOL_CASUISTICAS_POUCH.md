# 📦 Árbol Completo de Casuísticas - POUCH

**Versión:** 1.0  
**Fecha:** 2026-08-10  
**Total de Combinaciones:** 35+  

---

## 🎯 Estructura General del Árbol

```
POUCH (tipoFormatoPouch)
│
├─ 1️⃣ STAND UP POUCH (tipoStandUpPouch)
│  ├─ A. Sello K
│  ├─ B. Normal
│  └─ C. Doy Pack (2 bases × 2 fuelles = 4 combinaciones)
│
├─ 2️⃣ POUCH PLANO (cantidadSellosPouchPlano)
│  ├─ A. Dos Sellos
│  └─ B. Tres Sellos
│
├─ 3️⃣ POUCH CON SELLO CENTRAL (materialSelloCentralPouch × tieneFuelleSelloCentralPouch)
│  ├─ A. PE-PE/PE (2 opciones fuelle = 2 combinaciones)
│  ├─ B. Aleta (2 opciones fuelle = 2 combinaciones)
│  └─ C. Otro Material (2 opciones fuelle = 2 combinaciones)
│
└─ 4️⃣ POUCH CON SELLO EN FUELLE (tipoSelloFuellePouch)
   ├─ A. Tipo 4-1
   └─ B. Tipo 1-1
```

---

## 📊 FAMILIA 1: STAND UP POUCH

### 1.A - Sello K

```
POUCH STAND UP \ TIPO K \ FUELLE PROPIO
│
├─ blueprintFormat: "POUCH STAND UP\TIPO K\FUELLE PROPIO"
├─ Descripción: Pouch Stand Up con sello tipo K y fuelle propio
│
├─ CAMPOS OBLIGATORIOS:
│  ├─ tipoFormatoPouch: "StandUp"
│  ├─ tipoStandUpPouch: "SelloK"
│  ├─ width: 1-500 mm *
│  ├─ length: 1-500 mm *
│  └─ anchoFuelle: 0-500 mm *
│
├─ VALIDACIONES:
│  ├─ Perímetro = 2 × (width + length)
│  ├─ Rango perímetro: 100-15000 mm
│  └─ perimeterValidationStatus: Validado/Rechazado
│
├─ ACCESORIOS (máx 3):
│  ├─ Zipper + zipperType + distanciaAbocaZipper
│  ├─ Valve + valveType + distanciaAbocaValvula
│  └─ Tin-Tie
│
└─ ESPECIFICACIONES OPCIONALES:
   ├─ Ninguna (estructura fija)
```

### 1.B - Normal

```
POUCH STAND UP \ NORMAL \ FUELLE PROPIO
│
├─ blueprintFormat: "POUCH STAND UP\NORMAL\FUELLE PROPIO"
├─ Descripción: Pouch Stand Up normal con fuelle propio
│
├─ CAMPOS OBLIGATORIOS:
│  ├─ tipoFormatoPouch: "StandUp"
│  ├─ tipoStandUpPouch: "Normal"
│  ├─ width: 1-500 mm *
│  ├─ length: 1-500 mm *
│  └─ anchoFuelle: 0-500 mm *
│
├─ VALIDACIONES:
│  ├─ Perímetro = 2 × (width + length)
│  ├─ Rango perímetro: 100-15000 mm
│  └─ perimeterValidationStatus: Validado/Rechazado
│
├─ ACCESORIOS (máx 3):
│  ├─ Zipper + zipperType + distanciaAbocaZipper
│  ├─ Valve + valveType + distanciaAbocaValvula
│  └─ Tin-Tie
│
└─ ESPECIFICACIONES OPCIONALES:
   ├─ Ninguna (estructura fija)
```

### 1.C - Doy Pack (4 Combinaciones)

#### 1.C.1 - Doy Pack Redondo + Fuelle Propio

```
POUCH STAND UP \ DOY PACK REDONDO \ FUELLE PROPIO
│
├─ blueprintFormat: "POUCH STAND UP\DOY PACK REDONDO\FUELLE PROPIO"
├─ Descripción: Pouch con base redonda y fuelle propio (Doy Pack)
│
├─ CAMPOS OBLIGATORIOS:
│  ├─ tipoFormatoPouch: "StandUp"
│  ├─ tipoStandUpPouch: "DoyPack"
│  ├─ formaDoyPackPouch: "Redonda" *
│  ├─ tipoFuelleStandUpPouch: "FuellePropio" *
│  ├─ width: 80-230 mm * ⚠️ RANGO ESPECIAL
│  ├─ length: 134-340 mm * ⚠️ RANGO ESPECIAL
│  └─ anchoFuelle: 0-3 mm * ⚠️ RANGO ESPECIAL
│
├─ VALIDACIONES ESPECIALES DOY PACK:
│  ├─ Width: DEBE estar 80-230 mm
│  ├─ Length: DEBE estar 134-340 mm
│  ├─ Ancho Fuelle: DEBE estar 0-3 mm
│  ├─ Perímetro = 2 × (width + length)
│  ├─ Rango perímetro: 100-650 mm * ⚠️ MÁS RESTRICTIVO
│  └─ perimeterValidationStatus: Validado/Rechazado
│
├─ ACCESORIOS (máx 3):
│  ├─ Zipper + zipperType + distanciaAbocaZipper
│  ├─ Valve + valveType + distanciaAbocaValvula
│  └─ Tin-Tie
│
└─ ESPECIFICACIONES OPCIONALES:
   ├─ Ninguna adicional
```

#### 1.C.2 - Doy Pack Redondo + Fuelle Insertado

```
POUCH STAND UP \ DOY PACK REDONDO \ FUELLE INSERTADO
│
├─ blueprintFormat: "POUCH STAND UP\DOY PACK REDONDO\FUELLE INSERTADO"
├─ Descripción: Pouch con base redonda y fuelle insertado
│
├─ CAMPOS OBLIGATORIOS:
│  ├─ tipoFormatoPouch: "StandUp"
│  ├─ tipoStandUpPouch: "DoyPack"
│  ├─ formaDoyPackPouch: "Redonda" *
│  ├─ tipoFuelleStandUpPouch: "FuelleInsertado" *
│  ├─ width: 80-230 mm * ⚠️ RANGO ESPECIAL
│  ├─ length: 134-340 mm * ⚠️ RANGO ESPECIAL
│  └─ anchoFuelle: 0-3 mm * ⚠️ RANGO ESPECIAL
│
├─ VALIDACIONES ESPECIALES DOY PACK:
│  ├─ Width: DEBE estar 80-230 mm
│  ├─ Length: DEBE estar 134-340 mm
│  ├─ Ancho Fuelle: DEBE estar 0-3 mm
│  ├─ Perímetro: 100-650 mm ⚠️ MÁS RESTRICTIVO
│  └─ perimeterValidationStatus: Validado/Rechazado
│
├─ ACCESORIOS (máx 3):
│  └─ Mismo que C.1
│
└─ ESPECIFICACIONES OPCIONALES:
   ├─ Ninguna adicional
```

#### 1.C.3 - Doy Pack Cuadrado + Fuelle Propio

```
POUCH STAND UP \ DOY PACK CUADRADO \ FUELLE PROPIO
│
├─ blueprintFormat: "POUCH STAND UP\DOY PACK CUADRADO\FUELLE PROPIO"
├─ Descripción: Pouch con base cuadrada y fuelle propio
│
├─ CAMPOS OBLIGATORIOS:
│  ├─ tipoFormatoPouch: "StandUp"
│  ├─ tipoStandUpPouch: "DoyPack"
│  ├─ formaDoyPackPouch: "Cuadrada" *
│  ├─ tipoFuelleStandUpPouch: "FuellePropio" *
│  ├─ width: 80-230 mm * ⚠️
│  ├─ length: 134-340 mm * ⚠️
│  └─ anchoFuelle: 0-3 mm * ⚠️
│
├─ VALIDACIONES:
│  └─ Idénticas a C.1 (pero base cuadrada)
│
└─ ACCESORIOS (máx 3):
   └─ Mismo que C.1
```

#### 1.C.4 - Doy Pack Cuadrado + Fuelle Insertado

```
POUCH STAND UP \ DOY PACK CUADRADO \ FUELLE INSERTADO
│
├─ blueprintFormat: "POUCH STAND UP\DOY PACK CUADRADO\FUELLE INSERTADO"
├─ Descripción: Pouch con base cuadrada y fuelle insertado
│
├─ CAMPOS OBLIGATORIOS:
│  └─ Idénticos a C.3 pero FuelleInsertado
│
├─ VALIDACIONES:
│  └─ Idénticas a C.3
│
└─ ACCESORIOS (máx 3):
   └─ Mismo que C.1
```

---

## 📊 FAMILIA 2: POUCH PLANO

### 2.A - Dos Sellos

```
POUCH PLANO \ DOS SELLOS
│
├─ blueprintFormat: "POUCH PLANO\DOS SELLOS"
├─ Descripción: Pouch plano con dos sellos laterales
│
├─ CAMPOS OBLIGATORIOS:
│  ├─ tipoFormatoPouch: "Plano"
│  ├─ cantidadSellosPouchPlano: "DOS" *
│  ├─ width: 1-500 mm *
│  ├─ length: 1-500 mm *
│  └─ anchoFuelle: 0-500 mm *
│
├─ VALIDACIONES:
│  ├─ Perímetro = 2 × (width + length)
│  ├─ Rango perímetro: 100-15000 mm
│  └─ perimeterValidationStatus: Validado/Rechazado
│
├─ ESPECIFICACIONES SELLO (OPCIONALES):
│  ├─ anchoSello: 1-500 mm (opcional)
│  └─ selloAnchoTransversal: 1-500 mm (opcional)
│
├─ ACCESORIOS CONSUMIBLES (máx 3):
│  ├─ Zipper + distanciaAbocaZipper
│  ├─ Notch + distanciaAbocaNotch
│  └─ Perforación + tipo + ubicación + distancia
│
└─ NOTA:
   └─ anchoSelloLateral NO EXISTE (solo en Tres Sellos)
```

### 2.B - Tres Sellos

```
POUCH PLANO \ TRES SELLOS
│
├─ blueprintFormat: "POUCH PLANO\TRES SELLOS"
├─ Descripción: Pouch plano con tres sellos (dos laterales + uno central)
│
├─ CAMPOS OBLIGATORIOS:
│  ├─ tipoFormatoPouch: "Plano"
│  ├─ cantidadSellosPouchPlano: "TRES" *
│  ├─ width: 1-500 mm *
│  ├─ length: 1-500 mm *
│  └─ anchoFuelle: 0-500 mm *
│
├─ VALIDACIONES:
│  ├─ Perímetro = 2 × (width + length)
│  ├─ Rango perímetro: 100-15000 mm
│  └─ perimeterValidationStatus: Validado/Rechazado
│
├─ ESPECIFICACIONES SELLO (OPCIONALES):
│  ├─ anchoSello: 1-500 mm (opcional)
│  ├─ selloAnchoTransversal: 1-500 mm (opcional)
│  └─ anchoSelloLateral: 1-500 mm (opcional) * SOLO AQUÍ
│
├─ ACCESORIOS CONSUMIBLES (máx 3):
│  ├─ Zipper + distanciaAbocaZipper
│  ├─ Notch + distanciaAbocaNotch
│  └─ Perforación + tipo + ubicación + distancia
│
└─ DIFERENCIA CON DOS SELLOS:
   └─ anchoSelloLateral existe y es OPCIONAL
```

---

## 📊 FAMILIA 3: POUCH CON SELLO CENTRAL (6 Combinaciones)

### 3.A - PE-PE/PE + Con Fuelle

```
POUCH C/SELLO CENTRAL \ TIPO ALETA \ CON FUELLE (PE-PE/PE)
│
├─ blueprintFormat: "POUCH C/SELLO CENTRAL\TIPO ALETA\CON FUELLE (PE-PE/PE)"
├─ Descripción: Pouch sello central con material PE-PE/PE y fuelle
│
├─ CAMPOS OBLIGATORIOS:
│  ├─ tipoFormatoPouch: "SelloCentral"
│  ├─ materialSelloCentralPouch: "PE_PE_PE" *
│  ├─ tieneFuelleSelloCentralPouch: "Sí" *
│  ├─ width: 1-500 mm *
│  ├─ length: 1-500 mm *
│  └─ anchoFuelle: 0-500 mm *
│
├─ VALIDACIONES:
│  ├─ Perímetro = 2 × (width + length)
│  ├─ Rango perímetro: 100-15000 mm
│  └─ perimeterValidationStatus: Validado/Rechazado
│
├─ ESPECIFICACIONES SELLO CENTRAL (OPCIONALES):
│  ├─ anchoSelloAleta: 10/12/15 mm (opcional)
│  ├─ selloAnchoTransversal: 1-500 mm (opcional)
│  ├─ anchoFuelleCerrado: mm (opcional, SOLO con Fuelle)
│  └─ Cálculo: anchoTotalCalculado = anchoSelloAleta + selloAnchoTransversal
│
├─ MICROPERFORADO (OPCIONAL, PE-PE/PE + Fuelle = Sí):
│  ├─ hasMicroperforado: "Sí" / "No"
│  ├─ Si Sí:
│  │  ├─ ladoAleta: "Derecho" | "Izquierdo"
│  │  ├─ tipoMicroperforado: "Total" | "Parcial"
│  │  ├─ separacionPuasAleta: (opciones)
│  │  └─ distanciaLadoAleta: mm
│  └─ Si No: Campos ocultos
│
├─ ACCESORIOS (máx 3):
│  ├─ Zipper + distancia
│  ├─ Valve + tipo + distancia
│  └─ Tin-Tie
│
└─ CAMPOS ESPECIALES:
   └─ Microperforado es EXCLUSIVO de PE-PE/PE + Fuelle
```

### 3.B - PE-PE/PE + Sin Fuelle

```
POUCH C/SELLO CENTRAL \ TIPO ALETA \ SIN FUELLE (PE-PE/PE)
│
├─ blueprintFormat: "POUCH C/SELLO CENTRAL\TIPO ALETA\SIN FUELLE (PE-PE/PE)"
├─ Descripción: Pouch sello central PE-PE/PE sin fuelle
│
├─ CAMPOS OBLIGATORIOS:
│  ├─ tipoFormatoPouch: "SelloCentral"
│  ├─ materialSelloCentralPouch: "PE_PE_PE" *
│  ├─ tieneFuelleSelloCentralPouch: "No" *
│  ├─ width: 1-500 mm *
│  ├─ length: 1-500 mm *
│  └─ anchoFuelle: 0-500 mm *
│
├─ ESPECIFICACIONES SELLO CENTRAL (OPCIONALES):
│  ├─ anchoSelloAleta: 10/12/15 mm (opcional)
│  ├─ selloAnchoTransversal: 1-500 mm (opcional)
│  ├─ anchoFuelleCerrado: NO APLICA (sin fuelle)
│  └─ Cálculo: anchoTotalCalculado = anchoSelloAleta + selloAnchoTransversal
│
├─ MICROPERFORADO:
│  └─ NO APLICA (Solo si Con Fuelle)
│
└─ ACCESORIOS (máx 3):
   └─ Mismo que 3.A
```

### 3.C - Aleta + Con Fuelle

```
POUCH C/SELLO CENTRAL \ TIPO ALETA \ CON FUELLE
│
├─ blueprintFormat: "POUCH C/SELLO CENTRAL\TIPO ALETA\CON FUELLE"
├─ Descripción: Pouch sello central tipo Aleta con fuelle
│
├─ CAMPOS OBLIGATORIOS:
│  ├─ tipoFormatoPouch: "SelloCentral"
│  ├─ materialSelloCentralPouch: "Aleta" *
│  ├─ tieneFuelleSelloCentralPouch: "Sí" *
│  ├─ width: 1-500 mm *
│  ├─ length: 1-500 mm *
│  └─ anchoFuelle: 0-500 mm *
│
├─ ESPECIFICACIONES SELLO (OPCIONALES):
│  ├─ anchoSelloAleta: 10/12/15 mm (opcional)
│  ├─ selloAnchoTransversal: 1-500 mm (opcional)
│  └─ anchoFuelleCerrado: mm (opcional)
│
├─ MICROPERFORADO:
│  └─ NO APLICA (Solo en PE-PE/PE)
│
└─ ACCESORIOS (máx 3):
   └─ Mismo que 3.A
```

### 3.D - Aleta + Sin Fuelle

```
POUCH C/SELLO CENTRAL \ TIPO ALETA \ SIN FUELLE
│
├─ blueprintFormat: "POUCH C/SELLO CENTRAL\TIPO ALETA\SIN FUELLE"
├─ Descripción: Pouch sello central tipo Aleta sin fuelle
│
├─ CAMPOS OBLIGATORIOS:
│  ├─ tipoFormatoPouch: "SelloCentral"
│  ├─ materialSelloCentralPouch: "Aleta" *
│  ├─ tieneFuelleSelloCentralPouch: "No" *
│  ├─ width: 1-500 mm *
│  ├─ length: 1-500 mm *
│  └─ anchoFuelle: 0-500 mm *
│
├─ ESPECIFICACIONES SELLO (OPCIONALES):
│  └─ anchoSelloAleta, selloAnchoTransversal (como 3.C)
│
└─ ACCESORIOS (máx 3):
   └─ Mismo que 3.A
```

### 3.E - Otro Material + Con Fuelle

```
POUCH C/SELLO CENTRAL \ TIPO ALETA \ CON FUELLE (OTRO)
│
├─ blueprintFormat: "POUCH C/SELLO CENTRAL\TIPO ALETA\CON FUELLE (OTRO)"
├─ Descripción: Pouch sello central con otro material y fuelle
│
├─ CAMPOS OBLIGATORIOS:
│  ├─ tipoFormatoPouch: "SelloCentral"
│  ├─ materialSelloCentralPouch: "Otro" *
│  ├─ tieneFuelleSelloCentralPouch: "Sí" *
│  ├─ width: 1-500 mm *
│  ├─ length: 1-500 mm *
│  └─ anchoFuelle: 0-500 mm *
│
├─ CONFIGURACIÓN FLEXIBLE:
│  └─ Campos disponibles según necesidad específica
│
└─ ACCESORIOS (máx 3):
   └─ Mismo que 3.A
```

### 3.F - Otro Material + Sin Fuelle

```
POUCH C/SELLO CENTRAL \ TIPO ALETA \ SIN FUELLE (OTRO)
│
├─ blueprintFormat: "POUCH C/SELLO CENTRAL\TIPO ALETA\SIN FUELLE (OTRO)"
├─ Descripción: Pouch sello central con otro material sin fuelle
│
├─ CAMPOS OBLIGATORIOS:
│  ├─ tipoFormatoPouch: "SelloCentral"
│  ├─ materialSelloCentralPouch: "Otro" *
│  ├─ tieneFuelleSelloCentralPouch: "No" *
│  ├─ width: 1-500 mm *
│  ├─ length: 1-500 mm *
│  └─ anchoFuelle: 0-500 mm *
│
├─ CONFIGURACIÓN FLEXIBLE:
│  └─ Campos disponibles según necesidad
│
└─ ACCESORIOS (máx 3):
   └─ Mismo que 3.A
```

---

## 📊 FAMILIA 4: POUCH CON SELLO EN FUELLE (2 Combinaciones)

### 4.A - Tipo 4-1

```
POUCH C/SELLO EN FUELLE \ TIPO 4-1 \ FUELLE PROPIO
│
├─ blueprintFormat: "POUCH C/SELLO EN FUELLE\TIPO 4-1\FUELLE PROPIO"
├─ Descripción: Pouch sello en fuelle tipo 4-1
│
├─ CAMPOS OBLIGATORIOS:
│  ├─ tipoFormatoPouch: "SelloFuelle"
│  ├─ tipoSelloFuellePouch: "Tipo4-1" *
│  ├─ width: 1-500 mm *
│  ├─ length: 1-500 mm *
│  └─ anchoFuelle: 0-500 mm *
│
├─ VALIDACIONES:
│  ├─ Perímetro = 2 × (width + length)
│  ├─ Rango perímetro: 100-15000 mm
│  ├─ perimeterValidationStatus: Validado/Rechazado
│  └─ Cálculo: Perímetro = 2 × (width + length)
│
├─ ESPECIFICACIONES (OPCIONALES):
│  └─ anchoSelloLateral: mm (opcional)
│
├─ ACCESORIOS (máx 3):
│  ├─ Zipper + distancia
│  ├─ Valve + tipo + distancia
│  └─ Tin-Tie
│
└─ CÁLCULOS AUTOMÁTICOS:
   └─ Perímetro = 2 × (width + length)
```

### 4.B - Tipo 1-1

```
POUCH C/SELLO EN FUELLE \ TIPO 1-1 \ FUELLE PROPIO
│
├─ blueprintFormat: "POUCH C/SELLO EN FUELLE\TIPO 1-1\FUELLE PROPIO"
├─ Descripción: Pouch sello en fuelle tipo 1-1
│
├─ CAMPOS OBLIGATORIOS:
│  ├─ tipoFormatoPouch: "SelloFuelle"
│  ├─ tipoSelloFuellePouch: "Tipo1-1" *
│  ├─ width: 1-500 mm *
│  ├─ length: 1-500 mm *
│  └─ anchoFuelle: 0-500 mm *
│
├─ VALIDACIONES:
│  └─ Idénticas a 4.A (mismo rango perímetro)
│
├─ ESPECIFICACIONES (OPCIONALES):
│  └─ anchoSelloLateral: mm (opcional)
│
├─ ACCESORIOS (máx 3):
│  └─ Mismo que 4.A
│
└─ CÁLCULOS AUTOMÁTICOS:
   └─ Perímetro = 2 × (width + length)
```

---

## 🎯 Matriz de Decisión - Cascada Completa

```
NIVEL 0: FAMILIA
├─ tipoFormatoPouch = "StandUp" | "Plano" | "SelloCentral" | "SelloFuelle"

NIVEL 1: SUB-FAMILIA
├─ Si StandUp:
│  └─ tipoStandUpPouch = "SelloK" | "Normal" | "DoyPack"
│
├─ Si Plano:
│  └─ cantidadSellosPouchPlano = "DOS" | "TRES"
│
├─ Si SelloCentral:
│  └─ materialSelloCentralPouch = "PE_PE_PE" | "Aleta" | "Otro"
│     + tieneFuelleSelloCentralPouch = "Sí" | "No"
│
└─ Si SelloFuelle:
   └─ tipoSelloFuellePouch = "Tipo4-1" | "Tipo1-1"

NIVEL 2: COMBINACIONES (SOLO DOYPACK)
├─ Si DoyPack:
   ├─ formaDoyPackPouch = "Redonda" | "Cuadrada"
   └─ tipoFuelleStandUpPouch = "FuellePropio" | "FuelleInsertado"

NIVEL 3: CAMPOS ESPECÍFICOS
├─ Microperforado: SOLO si (SelloCentral + PE_PE_PE + Fuelle=Sí)
├─ anchoSelloLateral: SOLO si (Plano + Tres Sellos)
└─ Validaciones Doy Pack: SOLO si (StandUp + DoyPack)
```

---

## 📋 Tabla Resumen de Todas las Casuísticas

| # | Familia | Sub-familia | Combinación | Blueprint Format | Total Campos Oblig. | Especiales |
|:---:|:---|:---|:---|:---|:---:|:---|
| 1 | Stand Up | Sello K | - | POUCH STAND UP\TIPO K\FUELLE PROPIO | 5 | - |
| 2 | Stand Up | Normal | - | POUCH STAND UP\NORMAL\FUELLE PROPIO | 5 | - |
| 3 | Stand Up | Doy Pack | Redonda + Propio | POUCH STAND UP\DOY PACK REDONDO\FUELLE PROPIO | 7 | Validación Doy Pack |
| 4 | Stand Up | Doy Pack | Redonda + Insertado | POUCH STAND UP\DOY PACK REDONDO\FUELLE INSERTADO | 7 | Validación Doy Pack |
| 5 | Stand Up | Doy Pack | Cuadrada + Propio | POUCH STAND UP\DOY PACK CUADRADO\FUELLE PROPIO | 7 | Validación Doy Pack |
| 6 | Stand Up | Doy Pack | Cuadrada + Insertado | POUCH STAND UP\DOY PACK CUADRADO\FUELLE INSERTADO | 7 | Validación Doy Pack |
| 7 | Plano | Dos Sellos | - | POUCH PLANO\DOS SELLOS | 5 | - |
| 8 | Plano | Tres Sellos | - | POUCH PLANO\TRES SELLOS | 5 | anchoSelloLateral |
| 9 | Sello Central | PE-PE/PE | Con Fuelle | POUCH C/SELLO CENTRAL\TIPO ALETA\CON FUELLE (PE-PE/PE) | 7 | Microperforado |
| 10 | Sello Central | PE-PE/PE | Sin Fuelle | POUCH C/SELLO CENTRAL\TIPO ALETA\SIN FUELLE (PE-PE/PE) | 7 | - |
| 11 | Sello Central | Aleta | Con Fuelle | POUCH C/SELLO CENTRAL\TIPO ALETA\CON FUELLE | 7 | - |
| 12 | Sello Central | Aleta | Sin Fuelle | POUCH C/SELLO CENTRAL\TIPO ALETA\SIN FUELLE | 7 | - |
| 13 | Sello Central | Otro | Con Fuelle | POUCH C/SELLO CENTRAL\TIPO ALETA\CON FUELLE (OTRO) | 7 | Config. Flexible |
| 14 | Sello Central | Otro | Sin Fuelle | POUCH C/SELLO CENTRAL\TIPO ALETA\SIN FUELLE (OTRO) | 7 | Config. Flexible |
| 15 | Sello Fuelle | Tipo 4-1 | - | POUCH C/SELLO EN FUELLE\TIPO 4-1\FUELLE PROPIO | 5 | - |
| 16 | Sello Fuelle | Tipo 1-1 | - | POUCH C/SELLO EN FUELLE\TIPO 1-1\FUELLE PROPIO | 5 | - |

---

## 🔑 Reglas de Condicionalidad

### Regla 1: Validación Doy Pack
```
IF tipoFormatoPouch = "StandUp" AND tipoStandUpPouch = "DoyPack" THEN
  ├─ width: 80-230 mm (NOT 1-500)
  ├─ length: 134-340 mm (NOT 1-500)
  ├─ anchoFuelle: 0-3 mm (NOT 0-500)
  └─ Perímetro: 100-650 mm (NOT 100-15000)
END
```

### Regla 2: Microperforado
```
IF tipoFormatoPouch = "SelloCentral" AND 
   materialSelloCentralPouch = "PE_PE_PE" AND 
   tieneFuelleSelloCentralPouch = "Sí" THEN
  ├─ hasMicroperforado: visible (Sí/No)
  ├─ Si Sí → ladoAleta, tipoMicroperforado, separacionPuasAleta, distanciaLadoAleta
  └─ Si No → Campos ocultos
END
```

### Regla 3: Ancho Sello Lateral
```
IF tipoFormatoPouch = "Plano" AND cantidadSellosPouchPlano = "TRES" THEN
  └─ anchoSelloLateral: visible (opcional)
ELSE
  └─ anchoSelloLateral: oculto
END
```

### Regla 4: Ancho Fuelle Cerrado
```
IF tipoFormatoPouch = "SelloCentral" AND tieneFuelleSelloCentralPouch = "Sí" THEN
  └─ anchoFuelleCerrado: visible (opcional)
ELSE
  └─ anchoFuelleCerrado: oculto
END
```

### Regla 5: Accesorios
```
FOR CADA casuística POUCH:
  ├─ Máximo 3 accesorios totales
  ├─ Opción para eliminar
  └─ Si llega a 3, botón "Agregar" deshabilitado
END
```

---

## 📊 Estadísticas

| Métrica | Valor |
|:---|:---:|
| **Total Casuísticas** | 16 |
| **Familias** | 4 |
| **Stand Up Sub-familias** | 3 (con 4 Doy Pack) |
| **Plano Sub-familias** | 2 |
| **Sello Central Combinaciones** | 6 |
| **Sello Fuelle Sub-familias** | 2 |
| **Campos Obligatorios Comunes** | 5 (width, length, anchoFuelle + 2 cascada) |
| **Campos con Validación Especial** | 9 (4 Doy Pack + 5 otros) |
| **Campos Condicionales** | 12+ |
| **Cálculos Automáticos** | 3 (Perímetro, Ancho Total, Cálculos especiales) |

---

## ✅ Validaciones por Casuística

### Casuísticas Doy Pack (4)
```
Validaciones Especiales OBLIGATORIAS:
✓ width: 80-230 mm
✓ length: 134-340 mm
✓ anchoFuelle: 0-3 mm
✓ Perímetro: 100-650 mm
```

### Casuística Sello Central PE-PE/PE + Fuelle (1)
```
Validaciones Especiales:
✓ Microperforado disponible
✓ Ancho Total calculado automáticamente
```

### Casuística Plano Tres Sellos (1)
```
Validaciones Especiales:
✓ anchoSelloLateral visible (opcional)
```

### Todas Otras Casuísticas (10)
```
Validaciones Estándar:
✓ width: 1-500 mm
✓ length: 1-500 mm
✓ anchoFuelle: 0-500 mm
✓ Perímetro: 100-15000 mm
```

---

**Documento Completo - Árbol de Casuísticas POUCH** ✅

**16 Casuísticas únicas** | **4 Familias** | **Todas documentadas**
