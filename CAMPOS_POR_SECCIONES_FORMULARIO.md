# 📋 CAMPOS POR SECCIONES DEL FORMULARIO

**Versión:** 1.0  
**Fecha:** 2026-08-10  
**Secciones:** 4 (PRODUCTO, DISEÑO, ESTRUCTURA, EMBALAJES Y EMPALMES)

---

# FORMATO: LÁMINA

## 📄 LÁMINA - SECCIÓN 1: PRODUCTO

| # | Campo | Visible | Editable | Obligatorio | Validación | Complejidad | Modal/Interacción |
|:---|:---|:---:|:---:|:---:|:---|:---:|:---|
| 1.1 | Envoltura | ✅ | ❌ | ✅ | V1.11 | **Simple** | - |
| 1.2 | Tipo Formato | ✅ | ❌ | ✅ | V1.12 | **Simple** | - |
| 1.3 | Portfolio Code | ✅ | ✅ | ✅ | - | **Simple** | - |
| 1.4 | Project Name | ✅ | ✅ | ✅ | - | **Simple** | - |
| 1.5 | Project Description | ✅ | ✅ | ⚪ | - | **Simple** | - |
| 1.6 | Classification | ✅ | ✅ | ✅ | - | **Simple** | - |
| 1.7 | Technical Application | ✅ | ✅ | ✅ | - | **Simple** | - |
| 1.8 | Sale Type | ✅ | ✅ | ✅ | - | **Simple** | - |
| 1.9 | Blueprint Format | ✅ | ❌ | ✅ | V3.10 | **Compleja** | Auto-generated |

**Total Sección 1:** 9 campos | **Obligatorios:** 8 | **Validaciones:** 2 (Simple) + 1 (Compleja) | **Funcionalidades:** Auto-generate Blueprint

---

## 🎨 LÁMINA - SECCIÓN 2: DISEÑO

| # | Campo | Visible | Editable | Obligatorio | Validación | Complejidad | Modal/Interacción |
|:---|:---|:---:|:---:|:---:|:---|:---:|:---|
| 2.1 | Width (mm) | ✅ | ✅ | ✅ | V1.1 | **Simple** | onChange trigger |
| 2.2 | Repetition (mm) | ✅ | ✅ | ✅ | V1.2 | **Simple** | onChange trigger |
| 2.3 | **Perímetro (mm)** | ✅ | ❌ | ✅ | V2.1 | **Normal** | Auto-calc from W+R |
| 2.4 | Validación Perímetro | ✅ | ❌ | ✅ | V2.1 | **Normal** | Badge (Validado/Rechazado) |
| 2.5 | Diámetro Core (mm) | ✅ | ✅ | ✅ | V1.9 | **Simple** | onChange trigger |
| 2.6 | Variaciones Core | ✅ | ✅ | ⚪ | - | **Simple** | ODISEO checkbox |
| 2.7 | Sentido Bobinado | ✅ | ✅ | ✅ | V1.13 | **Simple** | Image Grid (8 opciones) |
| 2.8 | ¿Fotoregistro 1? | ✅ | ✅ | ⚪ | V2.9 | **Normal** | onChange show/hide FR1 section |
| 2.9-2.22 | FR1 Section (14 campos) | ✅* | ✅ | ⚪ | V2.9, V2.11, V2.12 | **Normal** | Márgenes calculados automáticamente |
| 2.23 | ¿Cuántos FR? | ✅* | ✅ | ⚪ | V2.10 | **Normal** | onChange show/hide FR2 |
| 2.24-2.26 | FR2 Section (3 campos) | ✅* | ✅ | ⚪ | V2.10 | **Normal** | IF Manual: editable; IF Automático: read-only (heredado) |

**Total Sección 2:** 26 campos | **Obligatorios:** 7 | **Validaciones:** 3 (Simple) + 7 (Normal) + 1 (Compleja) | **Funcionalidades:** 
- ✅ Perímetro auto-calc y validación
- ✅ Fotoregistro cascada (3 niveles)
- ✅ Márgenes calculados automáticamente
- ✅ FR2 modo (Automático/Manual)

---

## 🏗️ LÁMINA - SECCIÓN 3: ESTRUCTURA

| # | Campo | Visible | Editable | Obligatorio | Validación | Complejidad | Modal/Interacción |
|:---|:---|:---:|:---:|:---:|:---|:---:|:---|
| 3.1 | Material Core [SI] | ✅ | ✅ | ✅ | V1.10 | **Simple** | Dropdown [SI Catalog] |
| 3.2 | Editar Estructura | ✅ | ❌ | - | - | **Compleja** | **🔧 MODAL: MaterialsEditModal** |
| 3.3 | Estructura Visualización | ✅ | ❌ | - | - | **Compleja** | **📊 TABLA: LaminaStructureTable** (capas, materiales, micrones) |

**Total Sección 3:** 3 campos | **Obligatorios:** 1 | **Validaciones:** 1 (Simple) | **Funcionalidades:**
- ✅ Modal para editar estructura (capas, materiales, micrones)
- ✅ Tabla visual con validación de combinaciones
- ✅ 405 combinaciones homologadas validadas

---

## 📦 LÁMINA - SECCIÓN 4: EMBALAJES Y EMPALMES

| # | Campo | Visible | Editable | Obligatorio | Validación | Complejidad | Modal/Interacción |
|:---|:---|:---:|:---:|:---:|:---|:---:|:---|
| 4.1 | Acabados (Varniz, Lacas) | ✅ | ✅ | ⚪ | - | **Simple** | Checkbox (opcional) |
| 4.2 | Accesorios Consumibles | ✅ | ✅ | ⚪ | - | **Simple** | Checkbox (opcional) |
| 4.3 | Accesorios Internos | ✅ | ✅ | ⚪ | - | **Simple** | Checkbox (opcional) |
| 4.4 | Especificaciones Especiales | ✅ | ✅ | ⚪ | - | **Simple** | Text area (opcional) |
| 4.5 | Comentarios | ✅ | ✅ | ⚪ | - | **Simple** | Text area (opcional) |

**Total Sección 4:** 5 campos | **Obligatorios:** 0 | **Validaciones:** 0 | **Funcionalidades:** None (all optional)

---

**LÁMINA RESUMEN:**
- **Secciones:** 4
- **Campos Totales:** 43 (9 + 26 + 3 + 5)
- **Obligatorios:** 16
- **Validaciones Simples:** 7 (V1.1, V1.2, V1.9, V1.11, V1.12, V1.13, V2.9)
- **Validaciones Normales:** 9 (V2.1, V2.9, V2.10, V2.11, V2.12)
- **Validaciones Complejas:** 2 (V3.4 Cascada FR, V3.10 Blueprint)
- **Modales:** 1 (MaterialsEditModal)
- **Tablas Visuales:** 1 (LaminaStructureTable)
- **Cálculos:** 3 (Perímetro, Márgenes FR1, Márgenes FR2)

---

---

# FORMATO: BOLSA

## 📄 BOLSA - SECCIÓN 1: PRODUCTO

| # | Campo | Visible | Editable | Obligatorio | Validación | Complejidad | Modal/Interacción |
|:---|:---|:---:|:---:|:---:|:---|:---:|:---|
| 1.1 | Envoltura | ✅ | ❌ | ✅ | V1.11 | **Simple** | - |
| 1.2 | Presentación | ✅ | ❌ | ✅ | V1.12 | **Simple** | Radio (Bolsa/Wicket/Hojas) |
| 1.3 | Portfolio Code | ✅ | ✅ | ✅ | - | **Simple** | - |
| 1.4 | Project Name | ✅ | ✅ | ✅ | - | **Simple** | - |
| 1.5 | Project Description | ✅ | ✅ | ⚪ | - | **Simple** | - |
| 1.6 | Classification | ✅ | ✅ | ✅ | - | **Simple** | - |
| 1.7 | Technical Application | ✅ | ✅ | ✅ | - | **Simple** | - |
| 1.8 | Sale Type | ✅ | ✅ | ✅ | - | **Simple** | - |
| 1.9 | Blueprint Format | ✅ | ❌ | ✅ | V3.10 | **Compleja** | Auto-generated |

**Total Sección 1:** 9 campos | **Obligatorios:** 8 | **Validaciones:** 2 (Simple) + 1 (Compleja) | **Funcionalidades:** Auto-generate Blueprint

---

## 🎨 BOLSA - SECCIÓN 2: DISEÑO

| # | Campo | Visible | Editable | Obligatorio | Validación | Complejidad | Modal/Interacción |
|:---|:---|:---:|:---:|:---:|:---|:---:|:---|
| 2.1 | Tipo Sello | ✅ | ✅ | ✅ | V2.6 | **Normal** | Dropdown onChange trigger |
| 2.2 | Acabado | ✅* | ✅ | ✅* | V2.6 | **Normal** | IF Sello=Lateral: visible+obligatorio |
| 2.3 | Width (mm) | ✅ | ✅ | ✅ | V1.3 | **Simple** | onChange trigger |
| 2.4 | Length (mm) | ✅ | ✅ | ✅ | V1.4 | **Simple** | onChange trigger |
| 2.5 | ¿Tiene Fuelle? | ✅ | ✅ | ✅ | V2.4 | **Normal** | Radio onChange show/hide Fuelle |
| 2.6 | Ancho Fuelle (mm) | ✅* | ✅ | ✅* | V2.4, V1.7 | **Normal** | IF Fuelle=Sí: visible+obligatorio |
| 2.7 | **Perímetro (mm)** | ✅ | ❌ | ✅ | V2.2 | **Normal** | Auto-calc from W+L |
| 2.8 | Validación Perímetro | ✅ | ❌ | ✅ | V2.2 | **Normal** | Badge (Validado/Rechazado) |
| 2.9 | ¿Tiene Wicket? | ✅* | ✅ | ✅* | V2.8, V3.5 | **Normal** | IF Presentación=Wicket: show Wicket section |
| 2.10-2.16 | Wicket Section (7 campos) | ✅* | ✅ | ⚪ | V2.15, V2.8 | **Normal** | IF Wicket=Sí: show/validate fields |
| 2.17 | Especificaciones Sello | ✅ | ✅ | ⚪ | - | **Simple** | Text area (ODISEO) |

**Total Sección 2:** 17 campos | **Obligatorios:** 7 | **Validaciones:** 2 (Simple) + 7 (Normal) + 1 (Compleja) | **Funcionalidades:**
- ✅ Cascada Sello (Lateral/Fondo) con Acabado condicional (V3.7)
- ✅ Perímetro auto-calc y validación
- ✅ Fuelle condicional (V2.4)
- ✅ Wicket cascada (3 niveles - V3.5)

---

## 🏗️ BOLSA - SECCIÓN 3: ESTRUCTURA

| # | Campo | Visible | Editable | Obligatorio | Validación | Complejidad | Modal/Interacción |
|:---|:---|:---:|:---:|:---:|:---|:---:|:---|
| 3.1 | Material [SI] | ✅ | ✅ | ✅ | V1.10 | **Simple** | Dropdown [SI Catalog] |
| 3.2 | Editar Estructura | ✅ | ❌ | - | - | **Compleja** | **🔧 MODAL: MaterialsEditModal** |
| 3.3 | Estructura Visualización | ✅ | ❌ | - | - | **Compleja** | **📊 TABLA: MaterialsStructureTable** (capas, materiales, micrones) |

**Total Sección 3:** 3 campos | **Obligatorios:** 1 | **Validaciones:** 1 (Simple) | **Funcionalidades:**
- ✅ Modal para editar estructura
- ✅ Tabla visual con validación de combinaciones

---

## 📦 BOLSA - SECCIÓN 4: EMBALAJES Y EMPALMES

| # | Campo | Visible | Editable | Obligatorio | Validación | Complejidad | Modal/Interacción |
|:---|:---|:---:|:---:|:---:|:---|:---:|:---|
| 4.1 | Asa Troquelada | ✅ | ✅ | ⚪ | V2.13 | **Normal** | **➕ MODAL: AccessoriesSelectionModal** (máx 3) |
| 4.1a | - Tipo Asa | ✅* | ✅ | ⚪ | - | **Simple** | IF Asa=Sí: show subfields |
| 4.1b | - Color Asa | ✅* | ✅ | ⚪ | - | **Simple** | IF Asa=Sí: show subfields |
| 4.2 | Refuerzo | ✅ | ✅ | ⚪ | V2.13 | **Normal** | ➕ MODAL: AccessoriesSelectionModal (máx 3) |
| 4.2a | - Tipo Refuerzo | ✅* | ✅ | ⚪ | - | **Simple** | IF Refuerzo=Sí: show subfields |
| 4.3 | Corte Angular | ✅ | ✅ | ⚪ | V2.13 | **Normal** | ➕ MODAL: AccessoriesSelectionModal (máx 3 total internos) |
| 4.4 | Esquinas Redondas | ✅ | ✅ | ⚪ | V2.13 | **Normal** | ➕ MODAL |
| 4.5 | Muesca | ✅ | ✅ | ⚪ | V2.13 | **Normal** | ➕ MODAL |
| 4.6 | Perforación | ✅ | ✅ | ⚪ | V2.13 | **Normal** | ➕ MODAL |
| 4.7 | Pre-Corte | ✅ | ✅ | ⚪ | V2.13 | **Normal** | ➕ MODAL |
| 4.8 | Acabados (Varniz) | ✅ | ✅ | ⚪ | - | **Simple** | Checkbox (opcional) |
| 4.9 | Accesorios Consumibles | ✅ | ✅ | ⚪ | - | **Simple** | Checkbox (opcional) |
| 4.10 | Accesorios Internos (otros) | ✅ | ✅ | ⚪ | - | **Simple** | Checkbox (opcional) |
| 4.11 | Especificaciones Especiales | ✅ | ✅ | ⚪ | - | **Simple** | Text area (opcional) |
| 4.12 | Comentarios | ✅ | ✅ | ⚪ | - | **Simple** | Text area (opcional) |

**Total Sección 4:** 15 campos | **Obligatorios:** 0 | **Validaciones:** 7 (Normal - máx 3 accesorios) | **Funcionalidades:**
- ✅ **Accesorios Modal** (máx 3 totales)
- ✅ Accesorios Producto: Asa + Refuerzo (2 tipos, máx 3)
- ✅ Accesorios Internos: Corte, Esquinas, Muesca, Perforación, Pre-Corte (5 tipos, máx 3)
- ✅ Subfields condicionales por tipo accesorio

---

**BOLSA RESUMEN:**
- **Secciones:** 4
- **Campos Totales:** 44 (9 + 17 + 3 + 15)
- **Obligatorios:** 16
- **Validaciones Simples:** 6
- **Validaciones Normales:** 12
- **Validaciones Complejas:** 2 (V3.7 Cascada Sello, V3.5 Wicket)
- **Modales:** 2 (MaterialsEditModal, AccessoriesSelectionModal)
- **Tablas Visuales:** 1 (MaterialsStructureTable)
- **Cálculos:** 1 (Perímetro)
- **Accesorios:** 7 tipos (máx 3 totales)

---

---

# FORMATO: POUCH

## 📄 POUCH - SECCIÓN 1: PRODUCTO

| # | Campo | Visible | Editable | Obligatorio | Validación | Complejidad | Modal/Interacción |
|:---|:---|:---:|:---:|:---:|:---|:---:|:---|
| 1.1 | Envoltura | ✅ | ❌ | ✅ | V1.11 | **Simple** | - |
| 1.2 | Familia | ✅ | ✅ | ✅ | - | **Simple** | Radio (Stand Up/Plano/SelloCentral/SelloFuelle) |
| 1.3 | Portfolio Code | ✅ | ✅ | ✅ | - | **Simple** | - |
| 1.4 | Project Name | ✅ | ✅ | ✅ | - | **Simple** | - |
| 1.5 | Project Description | ✅ | ✅ | ⚪ | - | **Simple** | - |
| 1.6 | Classification | ✅ | ✅ | ✅ | - | **Simple** | - |
| 1.7 | Technical Application | ✅ | ✅ | ✅ | - | **Simple** | - |
| 1.8 | Sale Type | ✅ | ✅ | ✅ | - | **Simple** | - |
| 1.9 | Blueprint Format | ✅ | ❌ | ✅ | V3.10 | **Compleja** | Auto-generated (15+ variantes) |

**Total Sección 1:** 9 campos | **Obligatorios:** 8 | **Validaciones:** 1 (Simple) + 1 (Compleja) | **Funcionalidades:** Auto-generate Blueprint

---

## 🎨 POUCH - SECCIÓN 2: DISEÑO

| # | Campo | Visible | Editable | Obligatorio | Validación | Complejidad | Modal/Interacción |
|:---|:---|:---:|:---:|:---:|:---|:---:|:---|
| 2.1 | Sub-familia StandUp | ✅* | ✅ | ✅* | - | **Simple** | IF Familia=StandUp: Dropdown (Sello K/Normal/Doy Pack) |
| 2.2 | Base DoyPack | ✅* | ✅ | ✅* | - | **Simple** | IF SubFam=DoyPack: Radio (Redonda/Cuadrada) |
| 2.3 | Fuelle Tipo DoyPack | ✅* | ✅ | ✅* | - | **Simple** | IF SubFam=DoyPack: Radio (Propio/Insertado) |
| 2.4 | Cantidad Sellos Plano | ✅* | ✅ | ✅* | - | **Simple** | IF Familia=Plano: Radio (Dos/Tres) |
| 2.5 | Material SelloCentral | ✅* | ✅ | ✅* | - | **Simple** | IF Familia=SelloCentral: Dropdown (PE-PE/PE/Aleta/Otro) |
| 2.6 | Tipo SelloFuelle | ✅* | ✅ | ✅* | - | **Simple** | IF Familia=SelloFuelle: Dropdown (4-1/1-1) |
| 2.7 | Width (mm) | ✅ | ✅ | ✅ | V1.5, V3.6 | **Normal** | onChange trigger; ESPECIAL rangos si DoyPack |
| 2.8 | Length (mm) | ✅ | ✅ | ✅ | V1.6, V3.6 | **Normal** | onChange trigger; ESPECIAL rangos si DoyPack |
| 2.9 | ¿Tiene Fuelle? | ✅ | ✅ | ✅ | V2.5 | **Normal** | Radio onChange show/hide Fuelle |
| 2.10 | Ancho Fuelle (mm) | ✅* | ✅ | ✅* | V2.5, V3.6 | **Normal** | IF Fuelle=Sí: visible+obligatorio; ESPECIAL rangos si DoyPack |
| 2.11 | **Perímetro (mm)** | ✅ | ❌ | ✅ | V2.3, V3.6 | **Normal** | Auto-calc from W+L; ESPECIAL rangos si DoyPack |
| 2.12 | Validación Perímetro | ✅ | ❌ | ✅ | V2.3, V3.6 | **Normal** | Badge (Validado/Rechazado); ESPECIAL si DoyPack |
| 2.13 | ¿Tiene Microperforado? | ✅* | ✅ | ⚪ | V3.9 | **Compleja** | IF Material=PE-PE/PE AND Fuelle=Sí: show radio |
| 2.14-2.17 | Microperforado Section (4 campos) | ✅* | ✅ | ⚪ | V2.18, V2.19, V2.20, V3.9 | **Normal** | IF Microperforado=Sí: show/validate fields |
| 2.18 | Ancho Sello Aleta (mm) | ✅* | ✅ | ⚪ | V2.17 | **Normal** | IF Material=PE-PE/PE: show (10/12/15) |
| 2.19 | Sello Ancho Transversal | ✅* | ✅ | ⚪ | - | **Normal** | IF Material=PE-PE/PE: show |
| 2.20 | **Ancho Total Calculado** | ✅* | ❌ | ⚪ | V2.16 | **Normal** | IF Material=PE-PE/PE: Auto-calc #18+#19 |
| 2.21 | Ancho Sello Lateral Plano | ✅* | ✅ | ⚪ | V2.7 | **Normal** | IF Familia=Plano AND Cantidad=Tres: visible+obligatorio |

**Total Sección 2:** 21 campos | **Obligatorios:** 8 | **Validaciones:** 5 (Simple) + 11 (Normal) + 2 (Compleja) | **Funcionalidades:**
- ✅ **Cascada Stand Up → Doy Pack** (V3.1, 4 niveles, ESPECIAL rangos)
- ✅ **Cascada Plano** (V3.2, 2 niveles)
- ✅ **Cascada Sello Central PE-PE/PE + Microperforado** (V3.3, V3.9, 4 niveles)
- ✅ Perímetro auto-calc con rangos ESPECIALES para Doy Pack (V3.6)
- ✅ Ancho Total calculado automáticamente (V2.16)
- ✅ Dimensiones con validación especial si Doy Pack (V3.6)

---

## 🏗️ POUCH - SECCIÓN 3: ESTRUCTURA

| # | Campo | Visible | Editable | Obligatorio | Validación | Complejidad | Modal/Interacción |
|:---|:---|:---:|:---:|:---:|:---|:---:|:---|
| 3.1 | Material [SI] | ✅ | ✅ | ✅ | V1.10 | **Simple** | Dropdown [SI Catalog] |
| 3.2 | Editar Estructura | ✅ | ❌ | - | - | **Compleja** | **🔧 MODAL: MaterialsEditModal** |
| 3.3 | Estructura Visualización | ✅ | ❌ | - | - | **Compleja** | **📊 TABLA: MaterialsStructureTable** (capas, materiales, micrones) |

**Total Sección 3:** 3 campos | **Obligatorios:** 1 | **Validaciones:** 1 (Simple) | **Funcionalidades:**
- ✅ Modal para editar estructura
- ✅ Tabla visual con validación de combinaciones

---

## 📦 POUCH - SECCIÓN 4: EMBALAJES Y EMPALMES

| # | Campo | Visible | Editable | Obligatorio | Validación | Complejidad | Modal/Interacción |
|:---|:---|:---:|:---:|:---:|:---|:---:|:---|
| 4.1 | Zipper | ✅ | ✅ | ⚪ | V2.13 | **Normal** | **➕ MODAL: AccessoriesSelectionModal** (máx 3 total) |
| 4.1a | - Tipo Zipper | ✅* | ✅ | ⚪ | - | **Simple** | IF Zipper=Sí: show subfield |
| 4.2 | Valve | ✅ | ✅ | ⚪ | V2.13 | **Normal** | ➕ MODAL: AccessoriesSelectionModal (máx 3 total) |
| 4.2a | - Tipo Valve | ✅* | ✅ | ⚪ | - | **Simple** | IF Valve=Sí: show subfield |
| 4.3 | Tin-Tie | ✅ | ✅ | ⚪ | V2.13 | **Normal** | ➕ MODAL: AccessoriesSelectionModal (máx 3 total) |
| 4.3a | - Tipo Tin-Tie | ✅* | ✅ | ⚪ | - | **Simple** | IF Tin-Tie=Sí: show subfield |
| 4.4 | Especificaciones Sello | ✅ | ✅ | ⚪ | - | **Simple** | Text area (ODISEO, opcional) |
| 4.5 | Acabados (Varniz) | ✅ | ✅ | ⚪ | - | **Simple** | Checkbox (opcional) |
| 4.6 | Accesorios Consumibles | ✅ | ✅ | ⚪ | - | **Simple** | Checkbox (opcional) |
| 4.7 | Accesorios Internos | ✅ | ✅ | ⚪ | - | **Simple** | Checkbox (opcional) |
| 4.8 | Especificaciones Especiales | ✅ | ✅ | ⚪ | - | **Simple** | Text area (opcional) |
| 4.9 | Comentarios | ✅ | ✅ | ⚪ | - | **Simple** | Text area (opcional) |

**Total Sección 4:** 12 campos | **Obligatorios:** 0 | **Validaciones:** 3 (Normal - máx 3 accesorios) | **Funcionalidades:**
- ✅ **Accesorios Modal** (máx 3 totales)
- ✅ Accesorios: Zipper, Valve, Tin-Tie (3 tipos, máx 3 totales)
- ✅ Subfields condicionales por tipo accesorio

---

**POUCH RESUMEN:**
- **Secciones:** 4
- **Campos Totales:** 45 (9 + 21 + 3 + 12)
- **Obligatorios:** 17
- **Validaciones Simples:** 6
- **Validaciones Normales:** 15
- **Validaciones Complejas:** 5 (V3.1 Cascada StandUp, V3.2 Cascada Plano, V3.3 Cascada SelloCentral, V3.6 Doy Pack, V3.9 Fuelle+Micro)
- **Modales:** 2 (MaterialsEditModal, AccessoriesSelectionModal)
- **Tablas Visuales:** 1 (MaterialsStructureTable)
- **Cálculos:** 2 (Perímetro, Ancho Total)
- **Accesorios:** 3 tipos (máx 3 totales)
- **Cascadas:** 4 niveles (máximo complejidad)

---

---

# MATRIZ COMPARATIVA: SECCIONES POR FORMATO

## SECCIÓN 1: PRODUCTO (Igual en todos)

| Aspecto | LÁMINA | BOLSA | POUCH |
|:---|:---:|:---:|:---:|
| Campos | 9 | 9 | 9 |
| Obligatorios | 8 | 8 | 8 |
| Validaciones | 2 Simple + 1 Compleja | 2 Simple + 1 Compleja | 1 Simple + 1 Compleja |
| Modales | 0 | 0 | 0 |
| Cascadas | 0 | 0 | 0 |
| Blueprint | Auto-generate (3 variantes) | Auto-generate (5 variantes) | Auto-generate (15+ variantes) |

---

## SECCIÓN 2: DISEÑO (Mayoría de Complejidad)

| Aspecto | LÁMINA | BOLSA | POUCH |
|:---|:---:|:---:|:---:|
| Campos | 26 | 17 | 21 |
| Obligatorios | 7 | 7 | 8 |
| Validaciones Simples | 7 (rangos) | 2 | 5 |
| Validaciones Normales | 7 | 7 | 11 |
| Validaciones Complejas | 1 (Cascada FR) | 1 (Cascada Sello) | 2 (DoyPack + Microperforado) |
| Cálculos | 3 (perímetro, FR márgenes ×2) | 1 (perímetro) | 2 (perímetro, ancho total) |
| Cascadas Niveles | 3 (FR) | 3 (Sello+Wicket) | 4 (StandUp→DoyPack, SelloCentral+Micro) |
| Condicionales | 12 | 9 | 14 |
| Campos Calculados | 4 | 1 | 2 |

**Observación:** POUCH es MÁS COMPLEJA por:
- Múltiples cascadas en paralelo (Stand Up, Plano, Sello Central)
- Validaciones especiales Doy Pack (4 rangos diferentes)
- Microperforado condicional (5 campos adicionales)

---

## SECCIÓN 3: ESTRUCTURA (Igual en todos)

| Aspecto | LÁMINA | BOLSA | POUCH |
|:---|:---:|:---:|:---:|
| Campos | 3 | 3 | 3 |
| Obligatorios | 1 | 1 | 1 |
| Modales | 1 (MaterialsEditModal) | 1 | 1 |
| Tablas Visuales | 1 (LaminaStructureTable) | 1 (MaterialsStructureTable) | 1 (MaterialsStructureTable) |
| Validaciones | 1 Simple | 1 Simple | 1 Simple |
| Funcionalidades | Material [SI], Editar Estructura, Visualizar Capas | Idem | Idem |

---

## SECCIÓN 4: EMBALAJES Y EMPALMES

| Aspecto | LÁMINA | BOLSA | POUCH |
|:---|:---:|:---:|:---:|
| Campos | 5 | 15 | 12 |
| Obligatorios | 0 | 0 | 0 |
| Accesorios | 0 | 7 tipos (Asa, Refuerzo, Corte, Esquinas, Muesca, Perforación, Pre-Corte) | 3 tipos (Zipper, Valve, Tin-Tie) |
| Máx Accesorios | N/A | 3 totales (mixto Producto+Internos) | 3 totales |
| Modales | 0 | 1 (AccessoriesSelectionModal) | 1 (AccessoriesSelectionModal) |
| Validaciones | 0 | 7 (count accesorios) | 3 (count accesorios) |
| Funcionalidades | Checkboxes opcionales | Accesorios Modal + Subfields | Accesorios Modal + Subfields |

---

# MATRIZ CONSOLIDADA: VALIDACIONES POR SECCIÓN

## VALIDACIONES LÁMINA

```
SECCIÓN 1 (PRODUCTO):
├─ V1.11: Obligatorio Envoltura (Simple)
├─ V1.12: Obligatorio Tipo Formato (Simple)
└─ V3.10: Blueprint Format auto-generation (Compleja)

SECCIÓN 2 (DISEÑO):
├─ V1.1: Rango Width 1-9999 (Simple)
├─ V1.2: Rango Repetition 1-9999 (Simple)
├─ V2.1: Cálculo y Validación Perímetro (Normal)
├─ V1.9: Rango Diámetro Core 76-152 (Simple)
├─ V1.13: Obligatorio Sentido Bobinado (Simple)
├─ V2.9: FR1 Condicional (Normal)
├─ V2.11: Márgenes FR1 Calculados (Normal)
├─ V2.12: Distancias FR 0-9999 (Normal)
├─ V2.10: FR2 Condicional (Normal)
└─ V3.4: Cascada Fotoregistro (Compleja, 4 niveles)

SECCIÓN 3 (ESTRUCTURA):
└─ V1.10: Obligatorio Material [SI] (Simple)

SECCIÓN 4 (EMBALAJES):
└─ Ninguna (todos opcionales)
```

---

## VALIDACIONES BOLSA

```
SECCIÓN 1 (PRODUCTO):
├─ V1.11: Obligatorio Envoltura (Simple)
├─ V1.12: Obligatorio Presentación (Simple)
└─ V3.10: Blueprint Format auto-generation (Compleja)

SECCIÓN 2 (DISEÑO):
├─ V1.3: Rango Width 1-3000 (Simple)
├─ V1.4: Rango Length 1-3000 (Simple)
├─ V2.2: Cálculo y Validación Perímetro (Normal)
├─ V2.6: Acabado Condicional (Normal)
├─ V2.4: Fuelle Condicional (Normal)
├─ V1.7: Rango Ancho Fuelle 0-500 (Simple)
├─ V2.8: Wicket Condicional (Normal)
├─ V2.15: Diámetro Wicket enum (Normal)
├─ V3.7: Cascada Sello Lateral/Fondo (Compleja, 3 niveles)
└─ V3.5: Cascada Wicket (Compleja, 3 niveles)

SECCIÓN 3 (ESTRUCTURA):
└─ V1.10: Obligatorio Material [SI] (Simple)

SECCIÓN 4 (EMBALAJES):
└─ V2.13: Máximo 3 Accesorios (Normal, ×7 campos)
```

---

## VALIDACIONES POUCH

```
SECCIÓN 1 (PRODUCTO):
├─ V1.11: Obligatorio Envoltura (Simple)
└─ V3.10: Blueprint Format auto-generation (Compleja, 15+ variantes)

SECCIÓN 2 (DISEÑO):
├─ V1.5: Rango Width 1-500 / 80-230 (Simple + Compleja)
├─ V1.6: Rango Length 1-500 / 134-340 (Simple + Compleja)
├─ V2.3: Cálculo y Validación Perímetro (Normal + Especial)
├─ V2.5: Fuelle Condicional (Normal)
├─ V1.8: Rango Ancho Fuelle 0-500 / 0-3 (Simple + Compleja)
├─ V2.16: Ancho Total Calculado (Normal)
├─ V2.17: Ancho Aleta enum 10/12/15 (Normal)
├─ V2.18: Separación Puas 0-50 (Normal)
├─ V2.19: Distancia Lado Aleta 0-500 (Normal)
├─ V2.20: Tipo Microperforado enum (Normal)
├─ V3.1: Cascada Stand Up → Doy Pack (Compleja, 4 niveles, ESPECIAL)
├─ V3.2: Cascada Plano (Compleja, 2 niveles)
├─ V3.3: Cascada Sello Central + Microperforado (Compleja, 4 niveles)
├─ V3.6: Validación ESPECIAL Doy Pack (Compleja, 4 rangos ESPECIALES)
└─ V3.9: Fuelle + Microperforado (Compleja, 3 niveles)

SECCIÓN 3 (ESTRUCTURA):
└─ V1.10: Obligatorio Material [SI] (Simple)

SECCIÓN 4 (EMBALAJES):
└─ V2.13: Máximo 3 Accesorios (Normal, ×3 campos)
```

---

# MATRIZ CONSOLIDADA: FUNCIONALIDADES ESPECIALES

## FUNCIONALIDADES LÁMINA

```
MODALES:
├─ MaterialsEditModal (Sección 3)
│  └─ Editar capas, materiales, micrones
│  └─ 405 combinaciones validadas

TABLAS VISUALES:
├─ LaminaStructureTable (Sección 3)
│  └─ Mostrar estructura de capas
│  └─ Última capa en Superficie a imprimir

CÁLCULOS AUTOMÁTICOS:
├─ Perímetro = 2×(width + repetition)
├─ FR1 Márgenes (4): left, right, top, bottom
└─ FR2 Márgenes (4): left, right, top, bottom

CASCADAS:
├─ Fotoregistro (3 niveles)
│  ├─ hasPhotoregister1 (Sí/No)
│  ├─ IF Sí: mostrar FR1 section (7 campos)
│  ├─ countFotoregistros (1/2)
│  └─ IF 2: mostrar FR2 section
│     ├─ Modo (Automático/Manual)
│     ├─ IF Automático: heredar de FR1
│     └─ IF Manual: editable

INTERACCIONES:
├─ Márgenes auto-calculados por referencia/distancia
├─ Blueprint auto-generated (3 variantes)
└─ Validación perímetro con badge color
```

---

## FUNCIONALIDADES BOLSA

```
MODALES:
├─ MaterialsEditModal (Sección 3)
│  └─ Editar capas, materiales, micrones
│  └─ 405 combinaciones validadas
│
└─ AccessoriesSelectionModal (Sección 4)
   └─ Agregar hasta 3 accesorios
   └─ Tipos: Asa, Refuerzo (Producto) + Corte, Esquinas, Muesca, Perforación, Pre-Corte (Internos)

TABLAS VISUALES:
├─ MaterialsStructureTable (Sección 3)
│  └─ Mostrar estructura de capas

CÁLCULOS AUTOMÁTICOS:
├─ Perímetro = 2×(width + length)
└─ Count accesorios validado (máx 3)

CASCADAS:
├─ Sello Selection (3 niveles)
│  ├─ Tipo Sello (Lateral/Fondo)
│  ├─ IF Lateral: mostrar Acabado (Corte/Pestaña) - OBLIGATORIO
│  └─ IF Fondo: ocultar Acabado
│
└─ Wicket Configuration (2 niveles)
   ├─ IF Presentación=Wicket: mostrar ¿Tiene Wicket? (Sí/No)
   ├─ IF Sí: mostrar 5 campos Wicket (diameter, control, precorte, dispensador, fotocélula)
   └─ IF No: ocultar campos

INTERACCIONES:
├─ Acabado condicional según Sello
├─ Fuelle condicional según ¿Tiene Fuelle?
├─ Wicket section condicional según Presentación
├─ Accesorios Modal con limit 3
├─ Blueprint auto-generated (5 variantes)
└─ Validación perímetro con badge color
```

---

## FUNCIONALIDADES POUCH

```
MODALES:
├─ MaterialsEditModal (Sección 3)
│  └─ Editar capas, materiales, micrones
│  └─ 405 combinaciones validadas
│
└─ AccessoriesSelectionModal (Sección 4)
   └─ Agregar hasta 3 accesorios
   └─ Tipos: Zipper, Valve, Tin-Tie

TABLAS VISUALES:
├─ MaterialsStructureTable (Sección 3)
│  └─ Mostrar estructura de capas

CÁLCULOS AUTOMÁTICOS:
├─ Perímetro = 2×(width + length) [normal o DoyPack]
├─ Ancho Total = anchoSelloAleta + selloAnchoTransversal (Sello Central)
└─ Count accesorios validado (máx 3)

CASCADAS (4 PARALLELAS):
├─ CASCADA 1: Stand Up (3-4 niveles)
│  ├─ Familia = Stand Up
│  ├─ Sub-familia (Sello K / Normal / Doy Pack)
│  └─ IF Doy Pack:
│     ├─ Base (Redonda/Cuadrada)
│     ├─ Fuelle Tipo (Propio/Insertado)
│     └─ APLICAR VALIDACIONES ESPECIALES (4 rangos)
│
├─ CASCADA 2: Plano (2 niveles)
│  ├─ Familia = Plano
│  ├─ Cantidad Sellos (Dos/Tres)
│  └─ IF Tres: mostrar Ancho Sello Lateral (OBLIGATORIO)
│
├─ CASCADA 3: Sello Central PE-PE/PE (4 niveles)
│  ├─ Familia = Sello Central
│  ├─ Material (PE-PE/PE / Aleta / Otro)
│  ├─ IF PE-PE/PE:
│  │  ├─ Mostrar Sello Aleta + Transversal
│  │  ├─ Cálculo: Ancho Total = Aleta + Transversal
│  │  ├─ IF Fuelle=Sí:
│  │  │  ├─ Mostrar ¿Tiene Microperforado? (Sí/No)
│  │  │  ├─ IF Sí:
│  │  │  │  ├─ Mostrar Lado Aleta (Derecho/Izquierdo)
│  │  │  │  ├─ Mostrar Tipo Microperforado (Total/Parcial)
│  │  │  │  ├─ Mostrar Separación Puas (0-50 mm)
│  │  │  │  └─ Mostrar Distancia Lado Aleta (0-500 mm)
│  │  │  └─ IF No: ocultar campos
│  │  └─ IF Fuelle=No: ocultar Microperforado
│  └─ ELSE (Aleta/Otro): ocultar Sello Aleta + Transversal
│
└─ CASCADA 4: Sello Fuelle (1-2 niveles)
   ├─ Familia = Sello Fuelle
   └─ Tipo (4-1 / 1-1)

INTERACCIONES ESPECIALES:
├─ VALIDACIONES ESPECIALES DoyPack (V3.6):
│  ├─ Width: 80-230 mm (vs normal 1-500)
│  ├─ Length: 134-340 mm (vs normal 1-500)
│  ├─ Ancho Fuelle: 0-3 mm (vs normal 0-500)
│  ├─ Perímetro: 100-650 mm (vs normal 100-15000)
│  └─ BLOQUEAR si CUALQUIER campo fuera de rango
│
├─ Ancho Total auto-calculado en Sello Central PE-PE/PE
├─ Márgenes dinámicos para Microperforado (5 campos)
├─ Blueprint auto-generated (15+ variantes según cascadas)
├─ Validación perímetro con badge color y rango especial si DoyPack
└─ Accesorios Modal con limit 3
```

---

# RESUMEN EJECUTIVO: COMPLEJIDAD POR SECCIÓN

```
SECCIÓN 1 (PRODUCTO): 🟢 SIMPLE
└─ Igual en todos los formatos
└─ Solo 9 campos básicos
└─ 1 cascada: Blueprint auto-generation

SECCIÓN 2 (DISEÑO): 🔴 COMPLEJA
├─ LÁMINA: 26 campos (3 cascadas niveles, FR condicional)
├─ BOLSA: 17 campos (3 cascadas niveles, Sello+Wicket)
└─ POUCH: 21 campos (4 cascadas paralelas, Doy Pack ESPECIAL)
   └─ POUCH es MÁS COMPLEJA por múltiples cascadas + validaciones especiales

SECCIÓN 3 (ESTRUCTURA): 🟢 SIMPLE
└─ Igual en todos los formatos
└─ Solo 3 campos
└─ 1 modal: MaterialsEditModal

SECCIÓN 4 (EMBALAJES): 🟡 MEDIA
├─ LÁMINA: 5 campos (sin accesorios)
├─ BOLSA: 15 campos (7 tipos accesorios, 1 modal)
└─ POUCH: 12 campos (3 tipos accesorios, 1 modal)
```

---

**📋 DOCUMENTO COMPLETO - Campos por Secciones** ✅

**Estructura:**
- ✅ 3 Formatos (LÁMINA, BOLSA, POUCH)
- ✅ 4 Secciones cada uno
- ✅ Campos detallados por sección
- ✅ Validaciones referenciadas por ID
- ✅ Funcionalidades especiales indicadas
- ✅ Cascadas y condicionales documentadas
- ✅ Modales y tablas visuales señaladas

**Totales:**
- **LÁMINA:** 43 campos (9+26+3+5), 1 Modal, 3 Cascadas
- **BOLSA:** 44 campos (9+17+3+15), 2 Modales, 4 Cascadas
- **POUCH:** 45 campos (9+21+3+12), 2 Modales, 4 Cascadas Paralelas
