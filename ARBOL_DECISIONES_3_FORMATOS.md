# 🎨 Árbol de Decisiones - 3 Formatos (POUCH, BOLSA, LÁMINA)

**Versión:** 1.0  
**Fecha:** 2026-08-10  
**Propósito:** Visualizar la cascada de decisiones condicionales para cada formato  

---

## 📊 FORMATO 1: POUCH

```
POUCH (tipoFormatoPouch)
│
├─ 1️⃣ STAND UP POUCH (tipoStandUpPouch)
│  │
│  ├─ A. Sello K
│  │  └─ ✅ POUCH STAND UP\TIPO K\FUELLE PROPIO
│  │     │
│  │     ├─ Dimensiones:
│  │     │  ├─ width: obligatorio (80-500 mm)
│  │     │  ├─ length: obligatorio (80-500 mm)
│  │     │  └─ anchoFuelle: obligatorio (0-500 mm)
│  │     │
│  │     └─ Accesorios (máx 3):
│  │        ├─ Zipper + distancia
│  │        ├─ Tin-Tie
│  │        └─ Valve + tipo + distancia
│  │
│  ├─ B. Normal
│  │  └─ ✅ POUCH STAND UP\NORMAL\FUELLE PROPIO
│  │     └─ [Igual que Sello K]
│  │
│  └─ C. Doy Pack
│     ├─ Base (formaDoyPackPouch): obligatorio
│     │  ├─ Redondo
│     │  └─ Cuadrado
│     │
│     ├─ Tipo Fuelle (tipoFuelleStandUpPouch): obligatorio
│     │  ├─ Fuelle Propio
│     │  └─ Fuelle Insertado
│     │
│     └─ Combinaciones (4):
│        ├─ Redondo + Propio → POUCH STAND UP\DOY PACK REDONDO\FUELLE PROPIO
│        ├─ Redondo + Insertado → POUCH STAND UP\DOY PACK REDONDO\FUELLE INSERTADO
│        ├─ Cuadrado + Propio → POUCH STAND UP\DOY PACK CUADRADO\FUELLE PROPIO
│        └─ Cuadrado + Insertado → POUCH STAND UP\DOY PACK CUADRADO\FUELLE INSERTADO
│           │
│           ├─ Validaciones especiales Doy Pack:
│           │  ├─ width: 80-230 mm ⚠️
│           │  ├─ length: 134-340 mm ⚠️
│           │  └─ anchoFuelle: 0-3 mm ⚠️
│           │
│           └─ Accesorios (máx 3):
│              └─ [Zipper, Valve, etc.]
│
├─ 2️⃣ POUCH PLANO (cantidadSellosPouchPlano)
│  │
│  ├─ A. Dos Sellos
│  │  └─ ✅ POUCH PLANO\DOS SELLOS
│  │     │
│  │     ├─ Dimensiones: width, length, anchoFuelle (obligatorios)
│  │     │
│  │     ├─ Especificaciones de Sello:
│  │     │  ├─ anchoSello (opcional)
│  │     │  └─ selloAnchoTransversal (opcional)
│  │     │
│  │     └─ Accesorios consumibles (máx 3):
│  │        ├─ Zipper + distancia
│  │        ├─ Notch + distancia
│  │        └─ Perforación + tipo + ubicación + distancia
│  │
│  └─ B. Tres Sellos
│     └─ ✅ POUCH PLANO\TRES SELLOS
│        │
│        ├─ Especificaciones de Sello:
│        │  ├─ anchoSello (opcional)
│        │  ├─ selloAnchoTransversal (opcional)
│        │  └─ anchoSelloLateral (opcional) [SOLO EN TRES SELLOS]
│        │
│        └─ Accesorios: [Igual que Dos Sellos]
│
├─ 3️⃣ POUCH CON SELLO CENTRAL
│  │
│  ├─ Material (materialSelloCentralPouch): obligatorio
│  │  ├─ PE-PE/PE
│  │  ├─ Aleta
│  │  └─ Otro material
│  │
│  ├─ Fuelle (tieneFuelleSelloCentralPouch): obligatorio
│  │  ├─ Sí
│  │  └─ No
│  │
│  └─ Combinaciones (6):
│     │
│     ├─ A. PE-PE/PE + Con Fuelle
│     │  └─ ✅ POUCH C/SELLO CENTRAL\TIPO ALETA\CON FUELLE (PE-PE/PE)
│     │     │
│     │     ├─ Dimensiones:
│     │     │  ├─ width, length (obligatorios)
│     │     │  └─ anchoFuelleCerrado (opcional)
│     │     │
│     │     ├─ Especificaciones:
│     │     │  ├─ anchoSelloAleta: 10/12/15 mm (opcional)
│     │     │  └─ selloAnchoTransversal (opcional)
│     │     │     └─ ✅ Cálculo: Ancho Total = anchoSelloAleta + selloAnchoTransversal
│     │     │
│     │     ├─ Microperforado (opcional):
│     │     │  └─ Si Sí:
│     │     │     ├─ ladoAleta (Derecho/Izquierdo)
│     │     │     ├─ tipoMicroperforado (Total/Parcial)
│     │     │     ├─ separacionPuasAleta (opciones)
│     │     │     └─ distanciaLadoAleta (mm)
│     │     │
│     │     └─ Accesorios (máx 3)
│     │
│     ├─ B. PE-PE/PE + Sin Fuelle
│     │  └─ ✅ POUCH C/SELLO CENTRAL\TIPO ALETA\SIN FUELLE (PE-PE/PE)
│     │     └─ [Igual que A, sin anchoFuelleCerrado]
│     │
│     ├─ C. Aleta + Con Fuelle
│     │  └─ ✅ POUCH C/SELLO CENTRAL\TIPO ALETA\CON FUELLE
│     │     └─ [Igual que A, sin campos de microperforado]
│     │
│     ├─ D. Aleta + Sin Fuelle
│     │  └─ ✅ POUCH C/SELLO CENTRAL\TIPO ALETA\SIN FUELLE
│     │     └─ [Igual que C, sin anchoFuelleCerrado]
│     │
│     ├─ E. Otro Material + Con Fuelle
│     │  └─ ✅ POUCH C/SELLO CENTRAL\TIPO ALETA\CON FUELLE (OTRO)
│     │     └─ [Configuración flexible]
│     │
│     └─ F. Otro Material + Sin Fuelle
│        └─ ✅ POUCH C/SELLO CENTRAL\TIPO ALETA\SIN FUELLE (OTRO)
│           └─ [Configuración flexible]
│
└─ 4️⃣ POUCH CON SELLO EN FUELLE
   │
   ├─ Tipo (tipoSelloFuellePouch): obligatorio
   │  ├─ Tipo 4-1
   │  └─ Tipo 1-1
   │
   ├─ A. Tipo 4-1
   │  └─ ✅ POUCH C/SELLO EN FUELLE\TIPO 4-1\FUELLE PROPIO
   │     │
   │     ├─ Dimensiones: width, length, anchoFuelle (obligatorios)
   │     │
   │     ├─ Especificaciones:
   │     │  └─ anchoSelloLateral (opcional)
   │     │
   │     ├─ Cálculos:
   │     │  ├─ Ancho Total = [calculado]
   │     │  └─ Perímetro = 2 * (width + length) ✅
   │     │
   │     └─ Accesorios (máx 3)
   │
   └─ B. Tipo 1-1
      └─ ✅ POUCH C/SELLO EN FUELLE\TIPO 1-1\FUELLE PROPIO
         └─ [Similar a Tipo 4-1]
```

---

## 📊 FORMATO 2: BOLSA

```
BOLSA (tipoFormatoBolsa)
│
├─ 1️⃣ BOLSA (Presentación)
│  │
│  ├─ Sello (tipoSelloBolsa): obligatorio
│  │  ├─ Sello Lateral
│  │  └─ Sello de Fondo
│  │
│  ├─ Acabado (acabadoBolsa): obligatorio si Sello Lateral
│  │  ├─ Corte
│  │  └─ Pestaña
│  │
│  ├─ Fuelle (tieneFuelleBolsa): obligatorio
│  │  ├─ Sí
│  │  └─ No
│  │
│  └─ Combinaciones (Sello Lateral):
│     ├─ Lateral + Corte + Fondo → SELLO LATERAL\CORTE\CON FUELLE FONDO
│     ├─ Lateral + Corte + No Fondo → SELLO LATERAL\CORTE\SIN FUELLE FONDO
│     ├─ Lateral + Pestaña + Fondo → SELLO LATERAL\PESTAÑA\CON FUELLE FONDO
│     └─ Lateral + Pestaña + No Fondo → SELLO LATERAL\PESTAÑA\SIN FUELLE FONDO
│        │
│        ├─ Dimensiones:
│        │  ├─ width: obligatorio
│        │  ├─ length: obligatorio
│        │  ├─ anchoFuelle: obligatorio
│        │  ├─ alturaEnLaBolsa (opcional)
│        │  └─ anchoEnLaBolsa (opcional)
│        │
│        ├─ Accesorios Producto (máx 3):
│        │  ├─ Asa Troquelada
│        │  │  ├─ tipoAsa (Asida/Tirador/Anilla/Asa cosida)
│        │  │  ├─ colorAsa
│        │  │  └─ formaAsa
│        │  └─ Refuerzo
│        │     ├─ reinforcementThickness
│        │     └─ reinforcementWidth
│        │
│        └─ Accesorios Internos (máx 3):
│           ├─ Corte Angular + lado
│           ├─ Esquinas Redondas + tipo
│           ├─ Muesca + distancia
│           ├─ Perforación + tipo + ubicación + distancia
│           └─ Pre-Corte + tipo + distancia
│
│  └─ Combinaciones (Sello de Fondo):
│     ├─ Fondo + Fuelle Lateral → SELLO DE FONDO\CON FUELLE LATERAL
│     └─ Fondo + No Fuelle → SELLO DE FONDO\SIN FUELLE LATERAL
│        └─ [Igual que Sello Lateral pero sin campo Acabado]
│
├─ 2️⃣ WICKET
│  │
│  └─ ✅ WICKET
│     │
│     ├─ Dimensiones: width, length, anchoFuelle (obligatorios)
│     │
│     ├─ Solapa:
│     │  └─ anchoSolapa (opcional)
│     │
│     ├─ Wickets:
│     │  └─ hasWicket (Sí/No)
│     │     └─ Si Sí:
│     │        ├─ wicketDiameter (D 12/14/16 mm)
│     │        ├─ wicketDistSuperior (distancia mm)
│     │        └─ wicketDistDerecho (distancia mm)
│     │
│     ├─ Wicket de Control:
│     │  └─ hasWicketControl (Sí/No)
│     │     └─ Si Sí:
│     │        ├─ wicketControlDiameter
│     │        ├─ wicketControlUbicacion (Superior/Inferior)
│     │        ├─ wicketControlDistSuperior
│     │        └─ wicketControlDistDerecho
│     │
│     ├─ Precorte Wicket:
│     │  └─ hasPrecorteWicket (Sí/No)
│     │     └─ Si Sí:
│     │        ├─ precorteWicketLargo (3-7 mm)
│     │        ├─ precorteWicketUbicacion
│     │        └─ precorteWicketDistDerecho
│     │
│     ├─ Corte Aliviador:
│     │  └─ hasCortaAliviador (Sí/No)
│     │     └─ Si Sí:
│     │        └─ cortaAliviadorDistDerecho
│     │
│     ├─ Dispensador:
│     │  └─ hasDispensador (Sí/No)
│     │     └─ Si Sí:
│     │        └─ dispensadorDistIzquierdo
│     │
│     ├─ Fotocélula:
│     │  └─ hasFotocelulaBolsaWicket (Sí/No)
│     │
│     └─ Información para el Fuelle:
│        ├─ precutFuelleAbreFacil
│        └─ bagPerforationType (perforación)
│
└─ 3️⃣ HOJAS
   │
   └─ ✅ HOJAS
      └─ [Configuración flexible, pocos campos específicos]
```

---

## 📊 FORMATO 3: LÁMINA

```
LÁMINA (tipoFormatoLamina)
│
├─ Tipo (tipoFormatoLamina): obligatorio
│  ├─ Genérica
│  ├─ Tissue
│  └─ Food
│
└─ LÁMINA ESTÁNDAR
   │
   ├─ ✅ Formato de Plano: GENÉRICA / TISSUE / FOOD
   │  (Se genera automáticamente basado en tipoFormatoLamina)
   │
   ├─ Dimensiones:
   │  ├─ width (Ancho de Lámina): obligatorio
   │  └─ repetition (Repetición): obligatorio
   │
   ├─ Co-printing (opcional):
   │  ├─ coPrinting (Sí/No)
   │  └─ Si Sí:
   │     └─ codesToPrint (códigos a imprimir)
   │
   ├─ 🎨 DATOS DE FOTOREGISTRO (SOLO LÁMINA) ⭐
   │  │
   │  ├─ ¿Tiene Fotoregistro?: hasPhotoregister1 (Sí/No/Sin responder)
   │  │  │
   │  │  ├─ Si No:
   │  │  │  └─ [Todos los campos de FR se limpian]
   │  │  │
   │  │  └─ Si Sí:
   │  │     │
   │  │     ├─ ¿Cuántos Fotoregistros?: countFotoregistros (1 o 2)
   │  │     │
   │  │     ├─ FOTOREGISTRO 1 (OBLIGATORIO si hasPhotoregister1 = Sí)
   │  │     │  │
   │  │     │  ├─ Dimensiones:
   │  │     │  │  ├─ fr1Width (obligatorio)
   │  │     │  │  └─ fr1Height (obligatorio)
   │  │     │  │
   │  │     │  ├─ Referencia (reconstruida desde márgenes):
   │  │     │  │  ├─ horizontal: right / left
   │  │     │  │  └─ vertical: bottom / top
   │  │     │  │
   │  │     │  ├─ Distancia (reconstruida desde márgenes):
   │  │     │  │  ├─ horizontal: mm
   │  │     │  │  └─ vertical: mm
   │  │     │  │
   │  │     │  └─ Márgenes Calculados:
   │  │     │     ├─ fr1MarginLeft
   │  │     │     ├─ fr1MarginRight
   │  │     │     ├─ fr1MarginTop
   │  │     │     └─ fr1MarginBottom
   │  │     │        └─ ✅ Cálculo: margin = referencia + distancia
   │  │     │
   │  │     └─ FOTOREGISTRO 2 (CONDICIONAL si countFotoregistros = 2)
   │  │        │
   │  │        ├─ Modo: Automático / Manual
   │  │        │
   │  │        ├─ Si Automático:
   │  │        │  ├─ Dimensiones: igual que FR1 (heredadas)
   │  │        │  └─ Márgenes: ✅ Calculados automáticamente
   │  │        │     └─ Fórmula: Simétrico al FR1
   │  │        │
   │  │        └─ Si Manual:
   │  │           ├─ Dimensiones: fr2Width, fr2Height (editable)
   │  │           └─ Márgenes:
   │  │              ├─ fr2MarginLeft
   │  │              ├─ fr2MarginRight
   │  │              ├─ fr2MarginTop
   │  │              └─ fr2MarginBottom
   │
   ├─ Core (SOLO LÁMINA):
   │  ├─ coreMaterial: obligatorio [SI - CATALOGO]
   │  ├─ coreDiameter: obligatorio
   │  ├─ externalDiameter: obligatorio
   │  ├─ externalVariationPlus: opcional
   │  └─ externalVariationMinus: opcional
   │
   └─ Accesorios (máx 3):
      └─ [Puede tener accesorios similares a POUCH/BOLSA,
         aunque generalmente LÁMINA no tiene]
```

---

## 🔄 Comparativa Nivel 1

| Decisión Principal | POUCH | BOLSA | LÁMINA |
|:---:|:---:|:---:|:---:|
| **Campo** | tipoFormatoPouch | tipoFormatoBolsa | tipoFormatoLamina |
| **Opciones** | 4 familias | 3 presentaciones | 3 tipos |
| **Obligatorio** | ✅ SÍ | ✅ SÍ | ✅ SÍ |
| **Sub-decisiones** | 15+ | 10+ | 0 (directo) |

---

## 📈 Complejidad Comparativa

```
LÁMINA:
  Nivel 0: Tipo (Genérica/Tissue/Food)
  Nivel 1: Dimensiones (width, repetition)
  Nivel 2: Fotoregistro (IF Si → Dimensiones, Referencias, Distancias, Márgenes)
  Nivel 3: Core (Material, Diámetro, etc.)
  
  Flujo: SIMPLE → LINEAL (máximo 3 niveles)

BOLSA:
  Nivel 0: Tipo de Presentación (Bolsa/Wicket/Hojas)
  Nivel 1: Sello (Lateral/Fondo)
  Nivel 2: Acabado/Fuelle (depende del Sello)
  Nivel 3: Wicket si es Wicket (múltiples sub-campos)
  
  Flujo: MODERADO → RAMIFICADO (máximo 4 niveles)

POUCH:
  Nivel 0: Familia (Stand Up/Plano/Sello Central/Sello Fuelle)
  Nivel 1: Sub-familia (Sello K/Normal/Doy Pack/Sellos/Material/Tipo)
  Nivel 2: Combinaciones (Base + Fuelle, Material + Fuelle, etc.)
  Nivel 3: Campos específicos (Microperforado, Wicket, etc.)
  
  Flujo: COMPLEJO → ALTAMENTE RAMIFICADO (máximo 4 niveles, múltiples ramas)
```

---

## ✅ Campos Obligatorios por Formato

### POUCH
1. ✅ tipoFormatoPouch
2. ✅ tipoStandUpPouch (si Stand Up)
3. ✅ formaDoyPackPouch (si Doy Pack)
4. ✅ tipoFuelleStandUpPouch (si Doy Pack)
5. ✅ cantidadSellosPouchPlano (si Plano)
6. ✅ materialSelloCentralPouch (si Sello Central)
7. ✅ tieneFuelleSelloCentralPouch (si Sello Central)
8. ✅ tipoSelloFuellePouch (si Sello Fuelle)
9. ✅ width, length, anchoFuelle (SIEMPRE)

**Total Obligatorios: 4-9 campos** (depende de rama)

### BOLSA
1. ✅ tipoFormatoBolsa
2. ✅ tipoSelloBolsa (si Bolsa)
3. ✅ acabadoBolsa (si Sello Lateral)
4. ✅ tieneFuelleBolsa (si Bolsa)
5. ✅ width, length, anchoFuelle (SIEMPRE)

**Total Obligatorios: 4-5 campos** (depende de rama)

### LÁMINA
1. ✅ tipoFormatoLamina
2. ✅ width, repetition (SIEMPRE)
3. ✅ coreMaterial (SIEMPRE)
4. ✅ coreDiameter (SIEMPRE)
5. ✅ externalDiameter (SIEMPRE)

**Total Obligatorios: 5 campos** (fijos, no depende de rama)

---

## 🎯 Conclusión: Orden de Complejidad

```
LÁMINA (SIMPLE)
  └─ Flujo LINEAL
  └─ 5 campos obligatorios
  └─ Sin cascadas profundas
  └─ Fotoregistro es OPCIONAL

BOLSA (MODERADA)
  └─ Flujo RAMIFICADO (3 ramas principales)
  └─ 4-5 campos obligatorios
  └─ Cascadas hasta 4 niveles
  └─ Wicket es complejo pero OPCIONAL

POUCH (COMPLEJA)
  └─ Flujo ALTAMENTE RAMIFICADO (4 familias + múltiples subfamilias)
  └─ 4-9 campos obligatorios
  └─ Cascadas hasta 4 niveles
  └─ Múltiples combinaciones de campos
```

---

**Documento Completo - Árboles de Decisiones Visualizados** ✅
