# 🌳 ÁRBOLES DE DECISIÓN: LÁMINA, BOLSA, POUCH

**Versión:** 1.0  
**Fecha:** 2026-08-10  
**Scope:** Árboles de decisión completos para validación en cada tipo de envoltura

---

# 1. LÁMINA - ÁRBOL DE DECISIÓN (3 Casuísticas)

## 1.1 Estructura General

```
LÁMINA incluye 3 casuísticas:
├─ Lámina Genérica
├─ Lámina Tissue
└─ Lámina Food

TODAS comparten la MISMA lógica de validación (solo cambia Blueprint)
```

---

## 1.2 Árbol de Decisión LÁMINA - FLUJO COMPLETO

```
┌─────────────────────────────────────────────────────────────────┐
│                    START: GUARDAR LÁMINA                         │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
                    ┌──────────────────────┐
                    │ ¿Envoltura=LÁMINA?   │
                    └──────────────────────┘
                      │                  │
                   SÍ │                  │ NO
                      │                  └─→ ❌ SALTAR validaciones LÁMINA
                      │                      Guardar otros datos
                      ▼
        ┌─────────────────────────────────────┐
        │   [1] Validación Sección PRODUCTO   │
        └─────────────────────────────────────┘
                      │
     ┌────────────────┼────────────────┐
     ▼                ▼                ▼
[1.1] Tipo        [1.2] Clasificación [1.3] Aplicación
Formato           (Nuevo/Modificado)   Técnica
(LÁMINA)                               
 ✅              ❓                    ❓
 VALID           IF Nuevo:            IF LÁMINA:
 (OK)            └─ Sales Type         ├─ Food
                 IF Modificado:        ├─ Pharma
                 └─ Skip Sales Type    ├─ General
                                       └─ Premium

     IF error en [1.x] → ❌ BLOQUEAR submit
     ELSE → Continuar
                      │
                      ▼
        ┌─────────────────────────────────────┐
        │   [2] Validación Sección DISEÑO     │
        └─────────────────────────────────────┘
                      │
        ┌─────────────┴──────────────┐
        ▼                            ▼
[2.1] Sentido Bobinado          [2.2] Período Válido
(LÁMINA CORE)                   (Cálculo Automático)
                                
- 8 opciones con imagen          Perímetro = 2×(Width+Repetition)
- OBLIGATORIO                    Rango: 100-20000 mm
- DEFAULT: Genérica
                                IF Perímetro < 100:
     IF NULL → ❌ ERROR         └─ ❌ ERROR: "Min 100mm"
     IF NOT NULL → ✅ OK
                                IF Perímetro > 20000:
                                └─ ❌ ERROR: "Max 20000mm"
                                
                                IF OK → ✅ VALID
        │                       │
        └───────────────────────┘
                      │
                      ▼
        ┌─────────────────────────────────────┐
        │   [2.3] Fotoregistro (OPCIONAL)     │
        └─────────────────────────────────────┘
                      │
            ┌─────────┴──────────┐
            ▼                    ▼
      hasFotoregistro=No    hasFotoregistro=Sí
      │                     │
      ├─ Ocultar FR1        ├─ Mostrar FR1 section
      ├─ Limpiar datos      ├─ TODOS campos obligatorios
      └─ ✅ SKIP FR valid   │
                            ├─ [2.3.1] fr1Width (1-9999)
                            │   IF error → ❌ BLOQUEAR
                            │
                            ├─ [2.3.2] fr1Height (1-9999)
                            │   IF error → ❌ BLOQUEAR
                            │
                            ├─ [2.3.3] fr1RefHoriz (Izq/Der)
                            │   IF NULL → ❌ BLOQUEAR
                            │   ELSE → Recalcular márgenes
                            │
                            ├─ [2.3.4] fr1RefVert (Arr/Aba)
                            │   IF NULL → ❌ BLOQUEAR
                            │   ELSE → Recalcular márgenes
                            │
                            ├─ [2.3.5] fr1DistHoriz (0-9999)
                            │   IF error → ❌ BLOQUEAR
                            │   ELSE → Recalcular márgenes
                            │
                            ├─ [2.3.6] fr1DistVert (0-9999)
                            │   IF error → ❌ BLOQUEAR
                            │   ELSE → Recalcular márgenes
                            │
                            ├─ [2.3.7] Márgenes (Calculados)
                            │   ├─ MarginLeft = (refH=LEFT) ? distH : 0
                            │   ├─ MarginRight = (refH=RIGHT) ? distH : 0
                            │   ├─ MarginTop = (refV=TOP) ? distV : 0
                            │   └─ MarginBottom = (refV=BOTTOM) ? distV : 0
                            │
                            └─ [2.3.8] Coherencia Geométrica
                                ├─ X_FR1 = posición calc
                                ├─ Y_FR1 = posición calc
                                │
                                ├─ IF (X_FR1 + fr1Width) > Width
                                │   └─ ⚠️ WARNING: no bloquea
                                │
                                ├─ IF (Y_FR1 + fr1Height) > Repetition
                                │   └─ ⚠️ WARNING: no bloquea
                                │
                                ├─ IF X_FR1 < 0
                                │   └─ ⚠️ WARNING: no bloquea
                                │
                                └─ IF Y_FR1 < 0
                                    └─ ⚠️ WARNING: no bloquea
        │                       │
        └───────────────────────┘
                      │
                      ▼
        ┌─────────────────────────────────────┐
        │   [3] Validación ESTRUCTURA         │
        └─────────────────────────────────────┘
                      │
            ┌─────────┴──────────┐
            ▼                    ▼
      Material [SI]         Materials Modal
      (Read-Only)           (ESTRUCTURA validada)
      
      - Mostrar materiales
      - Read-only en ODISEO
      - Heredar en Modificado
      
      ├─ IF Material NULL
      │  └─ ❌ ERROR: "Material requerido"
      │
      ├─ Material debe estar en 405 combos
      │  IF NOT → ❌ ERROR: "Combinación no homologada"
      │
      └─ ✅ OK: Material válido
                      │
                      ▼
        ┌─────────────────────────────────────┐
        │   [4] Validación EMBALAJES          │
        └─────────────────────────────────────┘
                      │
            ┌─────────┴──────────────────────┐
            ▼                                ▼
      Acabados (Opcional)          Comentarios (Opcional)
      
      - Mate/Brillante              - Campo texto libre
      - Protección tinta            - Max 500 caracteres
      
      ├─ IF valor fuera de opciones
      │  └─ ❌ ERROR: "Acabado inválido"
      │
      └─ ✅ OK: Acabado válido
                      │
                      ▼
        ┌─────────────────────────────────────┐
        │   [FINAL] GUARDAR LÁMINA            │
        │   ✅ PROYECTO GUARDADO EXITOSAMENTE │
        └─────────────────────────────────────┘
```

---

## 1.3 Resumen de Validaciones LÁMINA

```
LÁMINA - Checklist de Validaciones

[SECCIÓN 1] PRODUCTO
└─ [1.1] ✅ Envoltura (LÁMINA)
└─ [1.2] ✅ Formato (Genérica/Tissue/Food)
└─ [1.3] ✅ Portfolio Code
└─ [1.4] ✅ Nombre Proyecto
└─ [1.5] ✅ Descripción Proyecto
└─ [1.6] ❓ Clasificación (Nuevo/Modificado)
└─ [1.7] ❓ Aplicación Técnica
└─ [1.8] ❓ Tipo Venta

[SECCIÓN 2] DISEÑO
└─ [2.1] ✅ Sentido Bobinado (8 opciones)
└─ [2.2] ✅ Perímetro (auto-calc, 100-20000mm)
└─ [2.3] ⚪ Fotoregistro (opcional)
    ├─ IF Sí:
    │  ├─ fr1Width (1-9999) *
    │  ├─ fr1Height (1-9999) *
    │  ├─ fr1RefHoriz (Izq/Der) *
    │  ├─ fr1RefVert (Arr/Aba) *
    │  ├─ fr1DistHoriz (0-9999) *
    │  ├─ fr1DistVert (0-9999) *
    │  └─ Márgenes (calculados)
    └─ IF No: skip

[SECCIÓN 3] ESTRUCTURA
└─ [3.1] ✅ Material [SI] (405 combos validados)

[SECCIÓN 4] EMBALAJES
└─ [4.1] ⚪ Acabados (opcional)
└─ [4.2] ⚪ Comentarios (opcional)

RESULTADO: ✅ GUARDAR
```

---

# 2. BOLSA - ÁRBOL DE DECISIÓN (5 Casuísticas)

## 2.1 Estructura General

```
BOLSA incluye 5 casuísticas:
├─ Bolsa Lateral Corte (con/sin aleta)
├─ Bolsa Lateral Pestaña (con/sin aleta)
├─ Bolsa Fondo (con/sin aleta)
├─ Bolsa Wicket
└─ Bolsa Hojas

TODAS comparten validaciones similares pero con variaciones específicas
```

---

## 2.2 Árbol de Decisión BOLSA - FLUJO COMPLETO

```
┌─────────────────────────────────────────────────────────────────┐
│                    START: GUARDAR BOLSA                          │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
                    ┌──────────────────────┐
                    │ ¿Envoltura=BOLSA?    │
                    └──────────────────────┘
                      │                  │
                   SÍ │                  │ NO
                      │                  └─→ ❌ SALTAR validaciones BOLSA
                      │
                      ▼
        ┌─────────────────────────────────────┐
        │   [1] Validación Sección PRODUCTO   │
        └─────────────────────────────────────┘
                      │
     ┌────────────────┼────────────────┐
     ▼                ▼                ▼
[1.1] Tipo        [1.2] Presentación  [1.3] Aplicación
Formato           (Sello)             Técnica
(BOLSA)           
 ✅              ❓                    ❓
 VALID           ├─ Lateral Corte     IF BOLSA:
 (OK)            ├─ Lateral Pestaña   ├─ Food
                 ├─ Fondo             ├─ Pharma
                 ├─ Wicket            ├─ General
                 └─ Hojas             └─ Premium
                 
     IF error → ❌ BLOQUEAR            IF error → ❌ BLOQUEAR
                      │
                      ▼
        ┌─────────────────────────────────────┐
        │   [2] Validación Sección DISEÑO     │
        └─────────────────────────────────────┘
                      │
        ┌─────────────┴──────────────┐
        ▼                            ▼
[2.1] Dimensiones               [2.2] Período Válido
(Width, Length)                 (Cálculo Automático)

- Width: 10-9999 mm              Perímetro = 2×(Width+Length)
- Length: 10-9999 mm             Rango: 100-10000 mm
- OBLIGATORIOS
                                 IF Perímetro < 100:
IF Width < 10 or > 9999:         └─ ❌ ERROR: "Min 100mm"
└─ ❌ ERROR: "Rango inválido"
                                 IF Perímetro > 10000:
IF Length < 10 or > 9999:        └─ ❌ ERROR: "Max 10000mm"
└─ ❌ ERROR: "Rango inválido"
                                 IF OK → ✅ VALID
        │                       │
        └───────────────────────┘
                      │
                      ▼
        ┌─────────────────────────────────────┐
        │   [2.3] Tipo de Asa (Condicional)   │
        └─────────────────────────────────────┘
                      │
            ┌─────────┴──────────┐
            ▼                    ▼
      Lateral Corte/Pestaña   Fondo/Wicket/Hojas
      
      IF Lateral:
      ├─ [2.3.1] ¿Incluye Asa?
      │  ├─ NO → Skip asa fields
      │  └─ SÍ → 
      │      ├─ Tipo Asa: 6 opciones (ASA-001 to ASA-006)
      │      ├─ Color Asa: 9 opciones (COL-001 to COL-009)
      │      └─ Refuerzo: 5 opciones (REF-001 to REF-005)
      │
      └─ IF error → ❌ BLOQUEAR
      
      IF Fondo/Wicket/Hojas:
      └─ Skip asa fields
                      │
                      ▼
        ┌─────────────────────────────────────┐
        │   [2.4] Fuelle (Condicional)        │
        └─────────────────────────────────────┘
                      │
            ┌─────────┴──────────┐
            ▼                    ▼
      Lateral/Fondo/Wicket    Hojas
      
      IF NOT Hojas:
      ├─ ¿Fuelle?
      │  ├─ NO → Skip fuelle fields
      │  └─ SÍ →
      │      ├─ [2.4.1] Fuelle Width (1-999 mm)
      │      │   IF error → ❌ BLOQUEAR
      │      │
      │      └─ [2.4.2] ¿Acabado Fuelle?
      │          (Soldadura, Doblado, Pegado)
      │          IF error → ❌ BLOQUEAR
      │
      └─ IF error → ❌ BLOQUEAR
      
      IF Hojas:
      └─ Skip fuelle
                      │
                      ▼
        ┌─────────────────────────────────────┐
        │   [2.5] Accesorios Internos         │
        └─────────────────────────────────────┘
                      │
            ┌─────────┴──────────┐
            ▼                    ▼
      Seleccionar Accesorios  Contador
      (Máx 3 totales)         (Auto-suma)
      
      - Agarradera
      - Refuerzo Esquina
      - Doypack Zipper
      - Válvula
      - Ventana
      - Perfume Pack
      - Otros
      
      IF cantidad > 3:
      └─ ❌ ERROR: "Máx 3 accesorios"
      
      IF cantidad ≤ 3:
      └─ ✅ OK: Accesorios válidos
                      │
                      ▼
        ┌─────────────────────────────────────┐
        │   [2.6] Wicket (Condicional)        │
        └─────────────────────────────────────┘
                      │
            ┌─────────┴──────────┐
            ▼                    ▼
      IF Presentación=Wicket   IF NOT Wicket
      
      ├─ OBLIGATORIO:           └─ Skip wicket fields
      │  ├─ ¿Incluye Wicket?
      │  └─ Diámetro:
      │      ├─ D12 (12 mm)
      │      ├─ D14 (14 mm)
      │      └─ D16 (16 mm)
      │
      ├─ Métodos Control:
      │  ├─ Sensor
      │  └─ Manual
      │
      └─ IF error → ❌ BLOQUEAR
                      │
                      ▼
        ┌─────────────────────────────────────┐
        │   [2.7] NO Fotoregistro (BLOQUEADO) │
        └─────────────────────────────────────┘
                      │
              ┌───────┴───────┐
              ▼               ▼
        ¿Hay datos FR?   ✅ OK: No FR
        
        IF SÍ:
        ├─ ❌ ERROR: "FR1 inconsistentes"
        ├─ Limpiar datos
        └─ ❌ BLOQUEAR submit
        
        IF NO:
        └─ Continuar
                      │
                      ▼
        ┌─────────────────────────────────────┐
        │   [3] Validación ESTRUCTURA         │
        └─────────────────────────────────────┘
                      │
      - Material [SI] (405 combos)
      - Adhesivo [SI]
      
      IF Material NULL:
      └─ ❌ ERROR: "Material requerido"
      
      IF NOT en 405 combos:
      └─ ❌ ERROR: "No homologado"
      
      ✅ OK: Estructura válida
                      │
                      ▼
        ┌─────────────────────────────────────┐
        │   [4] Validación EMBALAJES          │
        └─────────────────────────────────────┘
                      │
      - Acabados (opcional)
      - Especificaciones (opcional)
      - Comentarios (opcional)
      
      ✅ OK: Embalajes válidos
                      │
                      ▼
        ┌─────────────────────────────────────┐
        │   [FINAL] GUARDAR BOLSA             │
        │   ✅ PROYECTO GUARDADO EXITOSAMENTE │
        └─────────────────────────────────────┘
```

---

## 2.3 Resumen de Validaciones BOLSA

```
BOLSA - Checklist de Validaciones

[SECCIÓN 1] PRODUCTO
└─ [1.1] ✅ Envoltura (BOLSA)
└─ [1.2] ✅ Presentación (Sello: Lateral/Fondo/Wicket/Hojas)
└─ [1.3] ✅ Aplicación Técnica
└─ [1.4-1.8] Igual LÁMINA

[SECCIÓN 2] DISEÑO
└─ [2.1] ✅ Dimensiones (Width, Length: 10-9999 mm)
└─ [2.2] ✅ Perímetro (auto-calc, 100-10000mm)
└─ [2.3] ❓ Asa (si Lateral)
    ├─ Tipo Asa (6 opciones)
    ├─ Color Asa (9 opciones)
    └─ Refuerzo (5 opciones)
└─ [2.4] ❓ Fuelle (si NOT Hojas)
    ├─ Fuelle Width (1-999 mm)
    └─ Acabado Fuelle
└─ [2.5] ⚪ Accesorios Internos (máx 3)
└─ [2.6] ❓ Wicket (si Presentación=Wicket)
    ├─ ¿Incluye?
    ├─ Diámetro (D12/D14/D16)
    └─ Control (Sensor/Manual)
└─ [2.7] ❌ Fotoregistro (BLOQUEADO - NO disponible)

[SECCIÓN 3] ESTRUCTURA
└─ [3.1] ✅ Material [SI] (405 combos)

[SECCIÓN 4] EMBALAJES
└─ [4.1] ⚪ Acabados
└─ [4.2] ⚪ Especificaciones
└─ [4.3] ⚪ Comentarios

RESULTADO: ✅ GUARDAR
```

---

# 3. POUCH - ÁRBOL DE DECISIÓN (16 Casuísticas)

## 3.1 Estructura General

```
POUCH incluye 16 casuísticas agrupadas en 4 familias:

1. STAND UP (4 casuísticas)
   ├─ Stand Up K (con/sin plano)
   └─ Stand Up Normal (con/sin plano)

2. DOY PACK (6 casuísticas - VALIDACIONES EXTREMADAMENTE RESTRICTIVAS)
   ├─ Doy Pack Red (con/sin plano)
   ├─ Doy Pack Cuad Propio (con/sin plano)
   └─ Doy Pack Insertado (con/sin plano)

3. PLANO (4 casuísticas)
   ├─ Plano 2 Sellos (con/sin plano)
   └─ Plano 3 Sellos (con/sin plano)

4. SELLO CENTRAL (4 variantes)
   ├─ Sello Central PE (con/sin microperforado)
   ├─ Sello Central Aleta (con/sin microperforado)
   ├─ Sello Central Otro +Fuelle (con/sin microperforado)
   └─ Sello Central Otro -Fuelle (con/sin microperforado)
```

---

## 3.2 Árbol de Decisión POUCH - FLUJO COMPLETO

```
┌─────────────────────────────────────────────────────────────────┐
│                    START: GUARDAR POUCH                          │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
                    ┌──────────────────────┐
                    │ ¿Envoltura=POUCH?    │
                    └──────────────────────┘
                      │                  │
                   SÍ │                  │ NO
                      │                  └─→ ❌ SALTAR validaciones POUCH
                      │
                      ▼
        ┌─────────────────────────────────────┐
        │   [1] Validación Sección PRODUCTO   │
        └─────────────────────────────────────┘
                      │
     ┌────────────────┼────────────────┐
     ▼                ▼                ▼
[1.1] Tipo        [1.2] Familia        [1.3] Aplicación
Formato           (Cascada 4 niveles)  Técnica
(POUCH)           
 ✅              ❓                    ❓
 VALID           ├─ Stand Up           IF POUCH:
 (OK)            │  ├─ K                ├─ Food
                 │  └─ Normal           ├─ Pharma
                 ├─ Doy Pack *          ├─ General
                 │  ├─ Red              └─ Premium
                 │  ├─ Cuad Propio
                 │  └─ Insertado
                 ├─ Plano
                 │  ├─ 2 Sellos
                 │  └─ 3 Sellos
                 └─ Sello Central
                    ├─ PE
                    ├─ Aleta
                    └─ Otro ±Fuelle
     
     IF error → ❌ BLOQUEAR            * = VALIDACIONES ESPECIALES
                      │
                      ▼
        ┌─────────────────────────────────────┐
        │   [2] Validación Sección DISEÑO     │
        └─────────────────────────────────────┘
                      │
        ┌─────────────┴──────────────┐
        ▼                            ▼
[2.1] Dimensiones               [2.2] Período Válido
(Width, Length)                 (Cálculo Automático)

- Width: 30-9999 mm              Perímetro = 2×(Width+Length)
- Length: 30-9999 mm
- OBLIGATORIOS                   IF NOT Doy Pack:
                                 ├─ Rango: 100-15000 mm
IF Width < 30 or > 9999:         └─ IF error → ❌ BLOQUEAR
└─ ❌ ERROR: "Rango inválido"
                                 IF Doy Pack:
IF Length < 30 or > 9999:        ├─ SPECIAL RESTRICTION
└─ ❌ ERROR: "Rango inválido"    ├─ Rango: 100-650 mm (10% normal)
                                 ├─ Width: 80-230 mm
     IF error → ❌ BLOQUEAR      ├─ Length: 134-340 mm
                                 └─ IF error → ❌ BLOQUEAR SEVERO
        │                       │
        └───────────────────────┘
                      │
                      ▼
        ┌─────────────────────────────────────┐
        │   [2.3] FUELLE (Condicional)        │
        └─────────────────────────────────────┘
                      │
        ┌─────────────┴──────────────────┐
        ▼                                ▼
    NO Sello Central                Sello Central
    
    ├─ Fuelle Width (0-999 mm)     ├─ ¿Fuelle?
    │  IF error → ❌ BLOQUEAR      │  ├─ NO → Skip
    │                              │  └─ SÍ →
    ├─ IF Fuelle > 0:              │      ├─ Fuelle Width (0-3mm) **
    │  └─ ¿Acabado Fuelle?         │      └─ IF error → ❌ BLOQUEAR
    │      (Soldadura/etc)         │
    │                              └─ ** = RESTRICCIÓN SEVERA
    └─ ✅ OK: Fuelle válido           (Doy Pack: 0-3mm solo)
                      │
                      ▼
        ┌─────────────────────────────────────┐
        │   [2.4] Fotoregistro (BLOQUEADO)    │
        └─────────────────────────────────────┘
                      │
              ┌───────┴───────┐
              ▼               ▼
        ¿Hay datos FR?   ✅ OK: No FR
        
        IF SÍ:
        ├─ ❌ ERROR: "FR1 inconsistentes"
        ├─ Limpiar datos
        └─ ❌ BLOQUEAR submit
        
        IF NO:
        └─ Continuar
                      │
                      ▼
        ┌─────────────────────────────────────┐
        │   [2.5] Accesorios (MAX 3)          │
        └─────────────────────────────────────┘
                      │
        - Zipper: 4 opciones (ZIP-001 to ZIP-004)
        - Valve: 4 opciones (VLV-001 to VLV-004)
        - Tin-Tie: 4 opciones (TIN-001 to TIN-004)
        
        IF cantidad > 3:
        └─ ❌ ERROR: "Máx 3 accesorios"
        
        IF cantidad ≤ 3:
        └─ ✅ OK: Accesorios válidos
                      │
                      ▼
        ┌─────────────────────────────────────┐
        │   [2.6] Microperforado (Condicional)│
        └─────────────────────────────────────┘
                      │
        ┌─────────────┴──────────────────┐
        ▼                                ▼
    Sello Central                   OTHER
    (PE/Aleta/Otro)
    
    IF Sello Central + Fuelle=YES:  ├─ Microperforado NO
    ├─ ¿Microperforado?             │  disponible
    │  ├─ NO → Skip                 │
    │  └─ SÍ →                      └─ ✅ Skip
    │      ├─ Tipo: 2 opciones
    │      │  (MIC-001, MIC-002)
    │      │
    │      └─ IF error → ❌ BLOQUEAR
    
    IF Sello Central + Fuelle=NO:
    └─ Microperforado NO disponible
                      │
                      ▼
        ┌─────────────────────────────────────┐
        │   [3] Validación ESTRUCTURA         │
        └─────────────────────────────────────┘
                      │
      - Material [SI] (405 combos)
      - Adhesivo [SI]
      
      ┌─────────────┴──────────────────┐
      ▼                                ▼
  NOT Doy Pack                   Doy Pack SPECIAL
  
  ├─ Material: 405 combos        ├─ Material RESTRINGIDO
  └─ IF error → ❌ BLOQUEAR      │  ├─ Nylon-PE (Alta resist)
                                 │  └─ PET-Al-PE (Máxima resist)
                                 │
                                 ├─ IF Material NO en lista
                                 │  └─ ⚠️ WARNING o ❌ ERROR
                                 │
                                 └─ Adhesivo: ADH-002 preferido
      
      IF error → ❌ BLOQUEAR
                      │
                      ▼
        ┌─────────────────────────────────────┐
        │   [4] Validación EMBALAJES          │
        └─────────────────────────────────────┘
                      │
      - Acabados (opcional)
      - Especificaciones (opcional)
      - Comentarios (opcional)
      
      ✅ OK: Embalajes válidos
                      │
                      ▼
        ┌─────────────────────────────────────┐
        │   [FINAL] GUARDAR POUCH             │
        │   ✅ PROYECTO GUARDADO EXITOSAMENTE │
        └─────────────────────────────────────┘
```

---

## 3.3 Resumen de Validaciones POUCH

```
POUCH - Checklist de Validaciones

[SECCIÓN 1] PRODUCTO
└─ [1.1] ✅ Envoltura (POUCH)
└─ [1.2] ✅ Familia (Stand Up/Doy Pack/Plano/Sello Central)
└─ [1.3] ✅ Aplicación Técnica
└─ [1.4-1.8] Igual LÁMINA

[SECCIÓN 2] DISEÑO
└─ [2.1] ✅ Dimensiones (Width, Length: 30-9999 mm)
└─ [2.2] ✅ Perímetro (auto-calc)
    ├─ General: 100-15000 mm
    └─ Doy Pack: 100-650 mm (SPECIAL - 10% restricción)
        ├─ Width: 80-230 mm (SEVERO)
        └─ Length: 134-340 mm (SEVERO)
└─ [2.3] ⚪ Fuelle (0-999 mm)
    └─ Doy Pack: 0-3 mm (EXTREME)
└─ [2.4] ❌ Fotoregistro (BLOQUEADO - NO disponible)
└─ [2.5] ⚪ Accesorios (Zipper/Valve/Tin-Tie, máx 3)
└─ [2.6] ❓ Microperforado (si Sello Central + Fuelle=Sí)
    └─ 2 opciones (MIC-001, MIC-002)

[SECCIÓN 3] ESTRUCTURA
└─ [3.1] ✅ Material [SI]
    ├─ General: 405 combos
    └─ Doy Pack: RESTRINGIDO (Nylon-PE, PET-Al-PE)
└─ [3.2] ✅ Adhesivo [SI]
    └─ Doy Pack: ADH-002 preferido

[SECCIÓN 4] EMBALAJES
└─ [4.1] ⚪ Acabados
└─ [4.2] ⚪ Especificaciones
└─ [4.3] ⚪ Comentarios

RESULTADO: ✅ GUARDAR
```

---

# 4. COMPARATIVA: ÁRBOL DE DECISIÓN POR ENVOLTURA

## 4.1 Complejidad Relativa

```
COMPLEJIDAD DE VALIDACIÓN POR ENVOLTURA:

LÁMINA:
├─ Complejidad: MEDIA
├─ Campos: 15-20 (según FR)
├─ Validaciones: 8-9
├─ Cascadas: 1 (Fotoregistro opcional)
└─ Casos especiales: Fotoregistro + Perímetro cálculo

BOLSA:
├─ Complejidad: MEDIA-ALTA
├─ Campos: 20-25
├─ Validaciones: 12-15
├─ Cascadas: 3-4 (Asa, Fuelle, Wicket)
└─ Casos especiales: Máx 3 accesorios, Wicket condicional

POUCH:
├─ Complejidad: ALTA-MUY ALTA
├─ Campos: 25-30
├─ Validaciones: 18-20
├─ Cascadas: 4-5 (Familia, Fuelle, Microperforado)
└─ Casos especiales: Doy Pack EXTREMADAMENTE RESTRICTIVO
                     (10% de rangos normales)

RANKING COMPLEJIDAD:
1. POUCH (más compleja - 4 familias, Doy Pack restrictivo)
2. BOLSA (media-alta - múltiples cascadas)
3. LÁMINA (media - Fotoregistro simplifica el flujo)
```

---

## 4.2 Matriz de Triggers y Recálculos

```
LÁMINA:
├─ onChange Perímetro: RECALCULAR → Validación rango
├─ onChange Fotoregistro toggle: MOSTRAR/OCULTAR sección FR1
├─ onChange Ref Horiz/Vert: RECALCULAR márgenes + gráfico
└─ onChange Dist Horiz/Vert: RECALCULAR márgenes + gráfico

BOLSA:
├─ onChange Presentación (Sello): CAMBIAR cascada (Asa/Fuelle/Wicket)
├─ onChange Asa toggle: MOSTRAR/OCULTAR Tipo/Color/Refuerzo
├─ onChange Fuelle toggle: MOSTRAR/OCULTAR Fuelle Width
├─ onChange Perímetro: VALIDAR rango (100-10000)
└─ onChange Accesorios: CONTAR y VALIDAR máx 3

POUCH:
├─ onChange Familia: CASCADA 1 (Stand Up/Doy Pack/Plano/Sello)
├─ onChange Tipo: CASCADA 2 (K/Normal/Red/etc)
├─ onChange Fuelle: CAMBIAR rango (0-999 general vs 0-3 Doy Pack)
├─ onChange Microperforado: MOSTRAR/OCULTAR tipos
├─ onChange Período: VALIDAR rango (100-15000 vs 100-650)
└─ onChange Accesorios: CONTAR y VALIDAR máx 3
```

---

# 5. FLUJO DE CAMBIO DE ENVOLTURA (ALL 3)

```
┌─────────────────────────────────────────────────────────────────┐
│          USUARIO CAMBIA ENVOLTURA: Envoltura Selection          │
└─────────────────────────────────────────────────────────────────┘
                              │
                    ┌─────────┴─────────┐
                    │                   │
                    ▼                   ▼
            OLD Envoltura        NEW Envoltura
                    │                   │
                    ├───────────────────┤
                    ▼                   ▼
        ┌─────────────────────┐   ┌──────────────────┐
        │   Limpieza Datos    │   │  Activar Nuevos  │
        │   OLD Envoltura     │   │  Campos Envoltura│
        └─────────────────────┘   └──────────────────┘
                    │                   │
        ┌───────────┼───────────┐       │
        │           │           │       │
        ▼           ▼           ▼       ▼
    LÁMINA→      LÁMINA→      OTROS→   NEW
    BOLSA        POUCH        LÁMINA   FORM
    
    Clean:      Clean:       Clean:    Show:
    - FR1 *     - FR1 *      - Old      - Form fields
    - Sentido   - Sentido    - Old      - New cascades
    - etc       - etc        - Old
                             - etc
    
    Toast:      Toast:       Toast:    No action
    "FR limpiado" "FR limpiado" "Datos limpiados"
    (3s)        (3s)         (3s)

    * = Fotoregistro se limpia SIEMPRE cuando deja LÁMINA
```

---

# 6. RESUMEN: ORDEN DE EJECUCIÓN DE VALIDACIONES

## Paso a Paso (Submit)

```
┌─ SUBMIT: User presiona GUARDAR ─────────────────────────────────┐
│                                                                  │
│ 1. GUARDIA: ¿Qué envoltura? (IF/SWITCH)                        │
│    │                                                            │
│    ├─ LÁMINA → Ejecutar ÁRBOL LÁMINA (secciones 1-4)          │
│    ├─ BOLSA → Ejecutar ÁRBOL BOLSA (secciones 1-4)            │
│    └─ POUCH → Ejecutar ÁRBOL POUCH (secciones 1-4)            │
│                                                                  │
│ 2. SECCIÓN 1: Validar campos PRODUCTO (igual para todos)       │
│    - Envoltura, Formato, Clasificación, etc.                  │
│                                                                  │
│ 3. SECCIÓN 2: Validar campos DISEÑO (diferente por envoltura)  │
│    - LÁMINA: Perímetro, Fotoregistro, Sentido                 │
│    - BOLSA: Perímetro, Asa, Fuelle, Wicket, Accesorios       │
│    - POUCH: Perímetro*, Fuelle*, Microperforado, Accesorios   │
│             (* = diferentes rangos/restricciones)              │
│                                                                  │
│ 4. SECCIÓN 3: Validar ESTRUCTURA (Material SI, 405 combos)     │
│    - Igual para todos (mismo Material SI)                      │
│                                                                  │
│ 5. SECCIÓN 4: Validar EMBALAJES (Acabados, Comentarios)        │
│    - Igual para todos (campos opcionales)                      │
│                                                                  │
│ 6. DECISIÓN FINAL:                                             │
│    ├─ IF ANY error desde [1-5] → ❌ BLOQUEAR submit           │
│    │   - Mostrar mensajes error                               │
│    │   - Resaltar campos rojo                                 │
│    │                                                            │
│    └─ IF ALL OK (solo warnings permitidos) → ✅ GUARDAR      │
│        - Persistir en projectStorage                          │
│        - Mostrar "Proyecto guardado ✅"                        │
│                                                                  │
└────────────────────────────────────────────────────────────────┘
```

---

**🌳 ÁRBOLES DE DECISIÓN COMPLETOS** ✅

**Archivos incluidos:**
- ✅ LÁMINA: 1 árbol (3 casuísticas similares)
- ✅ BOLSA: 1 árbol (5 casuísticas con variaciones)
- ✅ POUCH: 1 árbol (16 casuísticas, 4 familias, Doy Pack especial)
- ✅ Comparativa: Complejidad, triggers, cambios envoltura
- ✅ Secuencia submit: Paso a paso

**Caracteres vistos:**
- ✅ Guardias (guards)
- ✅ Cascadas condicionales
- ✅ Recálculos automáticos
- ✅ Restricciones (normales vs extremas)
- ✅ Limpieza de datos
- ✅ Persistencia

**Listo para implementar en ProductEditPage.tsx**
