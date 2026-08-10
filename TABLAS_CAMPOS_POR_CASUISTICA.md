# 📊 TABLAS DE CAMPOS POR CASUÍSTICA - 3 Formatos

**Versión:** 1.0  
**Fecha:** 2026-08-10  
**Total Casuísticas:** 3 LÁMINA + 8 BOLSA + 16 POUCH = **27 Casuísticas**

---

# PARTE 1: LÁMINA (3 Casuísticas)

## 📄 LÁMINA - Casuística 1: GENÉRICA

| # | Campo | Obligatorio | Tipo | Rango/Opciones | Validación | Cálculo |
|:---|:---|:---:|:---|:---|:---|:---|
| 1 | Envoltura | ✅ | Radio | LÁMINA | Solo lectura | - |
| 2 | Tipo Formato | ✅ | Dropdown | Genérica | Auto-set | - |
| 3 | Width (mm) | ✅ | Number | 1-9999 | onChange | - |
| 4 | Repetition (mm) | ✅ | Number | 1-9999 | onChange | - |
| 5 | **Perímetro (mm)** | ✅ | Display | 100-20000 | Auto-calc | 2×(width+repetition) |
| 6 | Validación Perímetro | ✅ | Badge | Validado/Rechazado | Auto | width+rep in range |
| 7 | Material Core [SI] | ✅ | Dropdown | [SI Catalog] | required | - |
| 8 | Diámetro Core (mm) | ✅ | Number | 76-152 | onChange | - |
| 9 | Variaciones Core | ⚪ | Checkbox | Múltiples | - | - |
| 10 | Sentido Bobinado | ✅ | Image Grid | 8 opciones | required | - |
| 11 | ¿Fotoregistro 1? | ⚪ | Radio | Sí/No | onChange | - |
| 12 | FR1 Width (mm) | ⚪ | Number | 1-9999 | visible if #11=Sí | - |
| 13 | FR1 Height (mm) | ⚪ | Number | 1-9999 | visible if #11=Sí | - |
| 14 | FR1 Ref Horiz | ⚪ | Dropdown | Left/Right | visible if #11=Sí | - |
| 15 | FR1 Ref Vert | ⚪ | Dropdown | Top/Bottom | visible if #11=Sí | - |
| 16 | FR1 Dist Horiz (mm) | ⚪ | Number | 0-9999 | visible if #11=Sí | - |
| 17 | FR1 Dist Vert (mm) | ⚪ | Number | 0-9999 | visible if #11=Sí | - |
| 18 | FR1 Margin Left | ⚪ | Display | - | visible if #11=Sí | Calc: ref_horiz |
| 19 | FR1 Margin Right | ⚪ | Display | - | visible if #11=Sí | Calc: ref_horiz |
| 20 | FR1 Margin Top | ⚪ | Display | - | visible if #11=Sí | Calc: ref_vert |
| 21 | FR1 Margin Bottom | ⚪ | Display | - | visible if #11=Sí | Calc: ref_vert |
| 22 | ¿Cuántos FR? | ⚪ | Radio | 1/2 | visible if #11=Sí | - |
| 23 | FR2 Modo | ⚪ | Radio | Automático/Manual | visible if #22=2 | - |
| 24 | FR2 Width (mm) | ⚪ | Number | 1-9999 | visible if #22=2 & Manual | - |
| 25 | FR2 Height (mm) | ⚪ | Number | 1-9999 | visible if #22=2 & Manual | - |
| 26 | Blueprint Format | ✅ | Display | "GENERICA" | Auto-generate | #2 |

**Story Points:** 13 | **Complejidad:** SIMPLE | **Niveles Cascada:** 1

---

## 📄 LÁMINA - Casuística 2: TISSUE

| # | Campo | Obligatorio | Tipo | Rango/Opciones | Validación | Cálculo |
|:---|:---|:---:|:---|:---|:---|:---|
| 1 | Envoltura | ✅ | Radio | LÁMINA | Solo lectura | - |
| 2 | Tipo Formato | ✅ | Dropdown | Tissue | Auto-set | - |
| 3 | Width (mm) | ✅ | Number | 1-9999 | onChange | - |
| 4 | Repetition (mm) | ✅ | Number | 1-9999 | onChange | - |
| 5 | **Perímetro (mm)** | ✅ | Display | 100-20000 | Auto-calc | 2×(width+repetition) |
| 6 | Validación Perímetro | ✅ | Badge | Validado/Rechazado | Auto | width+rep in range |
| 7 | Material Core [SI] | ✅ | Dropdown | [SI Catalog] | required | - |
| 8 | Diámetro Core (mm) | ✅ | Number | 76-152 | onChange | - |
| 9 | Variaciones Core | ⚪ | Checkbox | Múltiples | - | - |
| 10 | Sentido Bobinado | ✅ | Image Grid | 8 opciones | required | - |
| 11 | ¿Fotoregistro 1? | ⚪ | Radio | Sí/No | onChange | - |
| 12-21 | FR1 Completo | ⚪ | [Section] | (igual a Genérica) | visible if #11=Sí | - |
| 22 | ¿Cuántos FR? | ⚪ | Radio | 1/2 | visible if #11=Sí | - |
| 23-25 | FR2 Completo | ⚪ | [Section] | (igual a Genérica) | visible if #22=2 | - |
| 26 | Blueprint Format | ✅ | Display | "TISSUE" | Auto-generate | #2 |

**Story Points:** 13 | **Complejidad:** SIMPLE | **Niveles Cascada:** 1

**Diferencia con Genérica:** Solo tipo de formato ("TISSUE" vs "GENERICA")

---

## 📄 LÁMINA - Casuística 3: FOOD

| # | Campo | Obligatorio | Tipo | Rango/Opciones | Validación | Cálculo |
|:---|:---|:---:|:---|:---|:---|:---|
| 1 | Envoltura | ✅ | Radio | LÁMINA | Solo lectura | - |
| 2 | Tipo Formato | ✅ | Dropdown | Food | Auto-set | - |
| 3 | Width (mm) | ✅ | Number | 1-9999 | onChange | - |
| 4 | Repetition (mm) | ✅ | Number | 1-9999 | onChange | - |
| 5 | **Perímetro (mm)** | ✅ | Display | 100-20000 | Auto-calc | 2×(width+repetition) |
| 6 | Validación Perímetro | ✅ | Badge | Validado/Rechazado | Auto | width+rep in range |
| 7 | Material Core [SI] | ✅ | Dropdown | [SI Catalog] | required | - |
| 8 | Diámetro Core (mm) | ✅ | Number | 76-152 | onChange | - |
| 9 | Variaciones Core | ⚪ | Checkbox | Múltiples | - | - |
| 10 | Sentido Bobinado | ✅ | Image Grid | 8 opciones | required | - |
| 11 | ¿Fotoregistro 1? | ⚪ | Radio | Sí/No | onChange | - |
| 12-21 | FR1 Completo | ⚪ | [Section] | (igual a Genérica) | visible if #11=Sí | - |
| 22 | ¿Cuántos FR? | ⚪ | Radio | 1/2 | visible if #11=Sí | - |
| 23-25 | FR2 Completo | ⚪ | [Section] | (igual a Genérica) | visible if #22=2 | - |
| 26 | Blueprint Format | ✅ | Display | "FOOD" | Auto-generate | #2 |

**Story Points:** 13 | **Complejidad:** SIMPLE | **Niveles Cascada:** 1

**Diferencia con Genérica:** Solo tipo de formato ("FOOD" vs "GENERICA")

---

# PARTE 2: BOLSA (8 Casuísticas)

## 🛍️ BOLSA - Casuística 1: BOLSA con Sello Lateral / Corte

| # | Campo | Obligatorio | Tipo | Rango/Opciones | Validación | Cálculo |
|:---|:---|:---:|:---|:---|:---|:---|
| 1 | Envoltura | ✅ | Radio | BOLSA | Solo lectura | - |
| 2 | Presentación | ✅ | Dropdown | Bolsa | Auto-set | - |
| 3 | Tipo Sello | ✅ | Dropdown | Lateral/Fondo | onChange | - |
| 4 | Acabado | ✅ | Dropdown | Corte/Pestaña | visible if #3=Lateral | - |
| 5 | ¿Tiene Fuelle? | ✅ | Radio | Sí/No | onChange | - |
| 6 | Width (mm) | ✅ | Number | 1-3000 | onChange | - |
| 7 | Length (mm) | ✅ | Number | 1-3000 | onChange | - |
| 8 | Ancho Fuelle (mm) | ⚪ | Number | 0-500 | visible if #5=Sí | - |
| 9 | **Perímetro (mm)** | ✅ | Display | 100-10000 | Auto-calc | 2×(width+length) |
| 10 | Validación Perímetro | ✅ | Badge | Validado/Rechazado | Auto | per in range |
| 11 | Material [SI] | ✅ | Dropdown | [SI Catalog] | required | - |
| 12 | Accesorios Producto | ⚪ | Modal | Máx 3 | - | - |
| 12a | - Asa Troquelada | ⚪ | Checkbox | - | - | - |
| 12b | - Refuerzo | ⚪ | Checkbox | - | - | - |
| 13 | Accesorios Internos | ⚪ | Modal | Máx 3 | - | - |
| 13a | - Corte Angular | ⚪ | Checkbox | - | - | - |
| 13b | - Esquinas Redondas | ⚪ | Checkbox | - | - | - |
| 13c | - Muesca | ⚪ | Checkbox | - | - | - |
| 13d | - Perforación | ⚪ | Checkbox | - | - | - |
| 13e | - Pre-Corte | ⚪ | Checkbox | - | - | - |
| 14 | Blueprint Format | ✅ | Display | "BOLSA LATERAL CORTE" | Auto-generate | #3,#4 |

**Story Points:** 16 | **Complejidad:** MEDIA | **Niveles Cascada:** 2

---

## 🛍️ BOLSA - Casuística 2: BOLSA con Sello Lateral / Pestaña

| # | Campo | Obligatorio | Tipo | Rango/Opciones | Validación | Cálculo |
|:---|:---|:---:|:---|:---|:---|:---|
| 1 | Envoltura | ✅ | Radio | BOLSA | Solo lectura | - |
| 2 | Presentación | ✅ | Dropdown | Bolsa | Auto-set | - |
| 3 | Tipo Sello | ✅ | Dropdown | Lateral/Fondo | onChange | - |
| 4 | Acabado | ✅ | Dropdown | Corte/Pestaña | visible if #3=Lateral | - |
| 5 | ¿Tiene Fuelle? | ✅ | Radio | Sí/No | onChange | - |
| 6 | Width (mm) | ✅ | Number | 1-3000 | onChange | - |
| 7 | Length (mm) | ✅ | Number | 1-3000 | onChange | - |
| 8 | Ancho Fuelle (mm) | ⚪ | Number | 0-500 | visible if #5=Sí | - |
| 9 | **Perímetro (mm)** | ✅ | Display | 100-10000 | Auto-calc | 2×(width+length) |
| 10 | Validación Perímetro | ✅ | Badge | Validado/Rechazado | Auto | per in range |
| 11 | Material [SI] | ✅ | Dropdown | [SI Catalog] | required | - |
| 12 | Accesorios Producto | ⚪ | Modal | Máx 3 | - | - |
| 12a | - Asa Troquelada | ⚪ | Checkbox | - | - | - |
| 12b | - Refuerzo | ⚪ | Checkbox | - | - | - |
| 13 | Accesorios Internos | ⚪ | Modal | Máx 3 | - | - |
| 13a | - Corte Angular | ⚪ | Checkbox | - | - | - |
| 13b | - Esquinas Redondas | ⚪ | Checkbox | - | - | - |
| 13c | - Muesca | ⚪ | Checkbox | - | - | - |
| 13d | - Perforación | ⚪ | Checkbox | - | - | - |
| 13e | - Pre-Corte | ⚪ | Checkbox | - | - | - |
| 14 | Blueprint Format | ✅ | Display | "BOLSA LATERAL PESTAÑA" | Auto-generate | #3,#4 |

**Story Points:** 16 | **Complejidad:** MEDIA | **Niveles Cascada:** 2

---

## 🛍️ BOLSA - Casuística 3: BOLSA con Sello Fondo

| # | Campo | Obligatorio | Tipo | Rango/Opciones | Validación | Cálculo |
|:---|:---|:---:|:---|:---|:---|:---|
| 1 | Envoltura | ✅ | Radio | BOLSA | Solo lectura | - |
| 2 | Presentación | ✅ | Dropdown | Bolsa | Auto-set | - |
| 3 | Tipo Sello | ✅ | Dropdown | Lateral/Fondo | onChange | - |
| 4 | Acabado | ⚪ | Dropdown | - | oculto (Fondo) | - |
| 5 | ¿Tiene Fuelle? | ✅ | Radio | Sí/No | onChange | - |
| 6 | Width (mm) | ✅ | Number | 1-3000 | onChange | - |
| 7 | Length (mm) | ✅ | Number | 1-3000 | onChange | - |
| 8 | Ancho Fuelle (mm) | ⚪ | Number | 0-500 | visible if #5=Sí | - |
| 9 | **Perímetro (mm)** | ✅ | Display | 100-10000 | Auto-calc | 2×(width+length) |
| 10 | Validación Perímetro | ✅ | Badge | Validado/Rechazado | Auto | per in range |
| 11 | Material [SI] | ✅ | Dropdown | [SI Catalog] | required | - |
| 12 | Accesorios Producto | ⚪ | Modal | Máx 3 | - | - |
| 12a | - Asa Troquelada | ⚪ | Checkbox | - | - | - |
| 12b | - Refuerzo | ⚪ | Checkbox | - | - | - |
| 13 | Accesorios Internos | ⚪ | Modal | Máx 3 | - | - |
| 13a | - Corte Angular | ⚪ | Checkbox | - | - | - |
| 13b | - Esquinas Redondas | ⚪ | Checkbox | - | - | - |
| 13c | - Muesca | ⚪ | Checkbox | - | - | - |
| 13d | - Perforación | ⚪ | Checkbox | - | - | - |
| 13e | - Pre-Corte | ⚪ | Checkbox | - | - | - |
| 14 | Blueprint Format | ✅ | Display | "BOLSA SELLO FONDO" | Auto-generate | #3 |

**Story Points:** 16 | **Complejidad:** MEDIA | **Niveles Cascada:** 1

---

## 🛍️ BOLSA - Casuística 4: WICKET (Base)

| # | Campo | Obligatorio | Tipo | Rango/Opciones | Validación | Cálculo |
|:---|:---|:---:|:---|:---|:---|:---|
| 1 | Envoltura | ✅ | Radio | BOLSA | Solo lectura | - |
| 2 | Presentación | ✅ | Dropdown | Wicket | Auto-set | - |
| 3 | Tipo Sello | ⚪ | Dropdown | - | oculto | - |
| 4 | Acabado | ⚪ | Dropdown | - | oculto | - |
| 5 | ¿Tiene Fuelle? | ✅ | Radio | Sí/No | onChange | - |
| 6 | Width (mm) | ✅ | Number | 1-3000 | onChange | - |
| 7 | Length (mm) | ✅ | Number | 1-3000 | onChange | - |
| 8 | Ancho Fuelle (mm) | ⚪ | Number | 0-500 | visible if #5=Sí | - |
| 9 | **Perímetro (mm)** | ✅ | Display | 100-10000 | Auto-calc | 2×(width+length) |
| 10 | Validación Perímetro | ✅ | Badge | Validado/Rechazado | Auto | per in range |
| 11 | Material [SI] | ✅ | Dropdown | [SI Catalog] | required | - |
| 12 | ¿Tiene Wicket? | ✅ | Radio | Sí/No | onChange | - |
| 13 | Diámetro Wicket | ⚪ | Dropdown | D12/D14/D16 | visible if #12=Sí | - |
| 14 | Control Wicket | ⚪ | Dropdown | Sencillo/Doble | visible if #12=Sí | - |
| 15 | Wicket Precorte | ⚪ | Radio | Sí/No | visible if #12=Sí | - |
| 16 | Wicket Dispensador | ⚪ | Radio | Sí/No | visible if #12=Sí | - |
| 17 | Wicket Fotocélula | ⚪ | Radio | Sí/No | visible if #12=Sí | - |
| 18 | Accesorios Producto | ⚪ | Modal | Máx 3 | - | - |
| 19 | Accesorios Internos | ⚪ | Modal | Máx 3 | - | - |
| 20 | Blueprint Format | ✅ | Display | "WICKET" | Auto-generate | #2 |

**Story Points:** 16 | **Complejidad:** MEDIA | **Niveles Cascada:** 2

---

## 🛍️ BOLSA - Casuística 5: HOJAS

| # | Campo | Obligatorio | Tipo | Rango/Opciones | Validación | Cálculo |
|:---|:---|:---:|:---|:---|:---|:---|
| 1 | Envoltura | ✅ | Radio | BOLSA | Solo lectura | - |
| 2 | Presentación | ✅ | Dropdown | Hojas | Auto-set | - |
| 3 | Tipo Sello | ⚪ | Dropdown | - | oculto | - |
| 4 | Acabado | ⚪ | Dropdown | - | oculto | - |
| 5 | ¿Tiene Fuelle? | ✅ | Radio | Sí/No | onChange | - |
| 6 | Width (mm) | ✅ | Number | 1-3000 | onChange | - |
| 7 | Length (mm) | ✅ | Number | 1-3000 | onChange | - |
| 8 | Ancho Fuelle (mm) | ⚪ | Number | 0-500 | visible if #5=Sí | - |
| 9 | **Perímetro (mm)** | ✅ | Display | 100-10000 | Auto-calc | 2×(width+length) |
| 10 | Validación Perímetro | ✅ | Badge | Validado/Rechazado | Auto | per in range |
| 11 | Material [SI] | ✅ | Dropdown | [SI Catalog] | required | - |
| 12 | Accesorios Producto | ⚪ | Modal | Máx 3 | - | - |
| 13 | Accesorios Internos | ⚪ | Modal | Máx 3 | - | - |
| 14 | Blueprint Format | ✅ | Display | "HOJAS" | Auto-generate | #2 |

**Story Points:** 16 | **Complejidad:** MEDIA | **Niveles Cascada:** 0

---

**Nota:** Documentaré las 3 casuísticas de BOLSA faltantes (que hacen 8 total) en siguiente sección.

### BOLSA - Casuísticas 6, 7, 8 (Variaciones con/sin Fuelle)

Estos son tratados como *subcasuísticas* de las anteriores (Lateral Corte, Lateral Pestaña, Fondo, Wicket, Hojas) donde el valor de "¿Tiene Fuelle?" (Sí/No) crea las variaciones. Por lo tanto, podríamos contar:

- Bolsa Lateral Corte + Fuelle
- Bolsa Lateral Corte sin Fuelle  
- Bolsa Lateral Pestaña + Fuelle
- Bolsa Lateral Pestaña sin Fuelle
- Bolsa Fondo + Fuelle
- Bolsa Fondo sin Fuelle

Total = 6 casuísticas BOLSA (sin Wicket ni Hojas)

**Entonces: BOLSA tiene 6 casuísticas, no 8** (Si consideramos Wicket y Hojas como variantes separadas, serían 8).

---

# PARTE 3: POUCH (16 Casuísticas)

## 📦 POUCH - Casuística 1: STAND UP - Sello K

| # | Campo | Obligatorio | Tipo | Rango/Opciones | Validación | Cálculo |
|:---|:---|:---:|:---|:---|:---|:---|
| 1 | Envoltura | ✅ | Radio | POUCH | Solo lectura | - |
| 2 | Familia | ✅ | Radio | Stand Up | Auto-set | - |
| 3 | Sub-familia | ✅ | Dropdown | Sello K/Normal/Doy Pack | onChange | - |
| 4 | ¿Tiene Fuelle? | ✅ | Radio | Sí/No | onChange | - |
| 5 | Width (mm) | ✅ | Number | 1-500 | onChange | - |
| 6 | Length (mm) | ✅ | Number | 1-500 | onChange | - |
| 7 | Ancho Fuelle (mm) | ⚪ | Number | 0-500 | visible if #4=Sí | - |
| 8 | **Perímetro (mm)** | ✅ | Display | 100-15000 | Auto-calc | 2×(width+length) |
| 9 | Validación Perímetro | ✅ | Badge | Validado/Rechazado | Auto | per in range |
| 10 | Material [SI] | ✅ | Dropdown | [SI Catalog] | required | - |
| 11 | Accesorios | ⚪ | Modal | Máx 3 | - | - |
| 11a | - Zipper | ⚪ | Checkbox | - | - | - |
| 11b | - Valve | ⚪ | Checkbox | - | - | - |
| 11c | - Tin-Tie | ⚪ | Checkbox | - | - | - |
| 12 | Blueprint Format | ✅ | Display | "POUCH STAND UP\SELLO K" | Auto-generate | #3 |

**Story Points:** 21 | **Complejidad:** ALTA | **Niveles Cascada:** 1

---

## 📦 POUCH - Casuística 2: STAND UP - Normal

| # | Campo | Obligatorio | Tipo | Rango/Opciones | Validación | Cálculo |
|:---|:---|:---:|:---|:---|:---|:---|
| 1 | Envoltura | ✅ | Radio | POUCH | Solo lectura | - |
| 2 | Familia | ✅ | Radio | Stand Up | Auto-set | - |
| 3 | Sub-familia | ✅ | Dropdown | Sello K/Normal/Doy Pack | onChange | - |
| 4 | ¿Tiene Fuelle? | ✅ | Radio | Sí/No | onChange | - |
| 5 | Width (mm) | ✅ | Number | 1-500 | onChange | - |
| 6 | Length (mm) | ✅ | Number | 1-500 | onChange | - |
| 7 | Ancho Fuelle (mm) | ⚪ | Number | 0-500 | visible if #4=Sí | - |
| 8 | **Perímetro (mm)** | ✅ | Display | 100-15000 | Auto-calc | 2×(width+length) |
| 9 | Validación Perímetro | ✅ | Badge | Validado/Rechazado | Auto | per in range |
| 10 | Material [SI] | ✅ | Dropdown | [SI Catalog] | required | - |
| 11 | Accesorios | ⚪ | Modal | Máx 3 | - | - |
| 11a | - Zipper | ⚪ | Checkbox | - | - | - |
| 11b | - Valve | ⚪ | Checkbox | - | - | - |
| 11c | - Tin-Tie | ⚪ | Checkbox | - | - | - |
| 12 | Blueprint Format | ✅ | Display | "POUCH STAND UP\NORMAL" | Auto-generate | #3 |

**Story Points:** 21 | **Complejidad:** ALTA | **Niveles Cascada:** 1

---

## 📦 POUCH - Casuística 3: STAND UP - Doy Pack Redonda / Fuelle Propio

| # | Campo | Obligatorio | Tipo | Rango/Opciones | Validación | Cálculo |
|:---|:---|:---:|:---|:---|:---|:---|
| 1 | Envoltura | ✅ | Radio | POUCH | Solo lectura | - |
| 2 | Familia | ✅ | Radio | Stand Up | Auto-set | - |
| 3 | Sub-familia | ✅ | Dropdown | Sello K/Normal/Doy Pack | onChange | - |
| 4 | Base | ✅ | Radio | Redonda/Cuadrada | visible if #3=DoyPack | - |
| 5 | Fuelle Tipo | ✅ | Radio | Propio/Insertado | visible if #3=DoyPack | - |
| 6 | ¿Tiene Fuelle? | ✅ | Radio | Sí | auto-set (Doy Pack) | - |
| 7 | Width (mm) | ✅ | Number | **80-230** ⚠️ | onChange | ESPECIAL |
| 8 | Length (mm) | ✅ | Number | **134-340** ⚠️ | onChange | ESPECIAL |
| 9 | Ancho Fuelle (mm) | ✅ | Number | **0-3** ⚠️ | onChange | ESPECIAL |
| 10 | **Perímetro (mm)** | ✅ | Display | **100-650** ⚠️ | Auto-calc | 2×(width+length) |
| 11 | Validación Perímetro | ✅ | Badge | Validado/Rechazado | Auto | **Doy Pack range** |
| 12 | Material [SI] | ✅ | Dropdown | [SI Catalog] | required | - |
| 13 | Accesorios | ⚪ | Modal | Máx 3 | - | - |
| 13a | - Zipper | ⚪ | Checkbox | - | - | - |
| 13b | - Valve | ⚪ | Checkbox | - | - | - |
| 13c | - Tin-Tie | ⚪ | Checkbox | - | - | - |
| 14 | Blueprint Format | ✅ | Display | "POUCH STAND UP\DOY PACK REDONDA\FUELLE PROPIO" | Auto-generate | #4,#5 |

**Story Points:** 21 | **Complejidad:** ALTA | **Niveles Cascada:** 3 + VALIDACIONES ESPECIALES**

⚠️ **NOTA:** Validaciones MUCHO MÁS RESTRICTIVAS que POUCH general

---

## 📦 POUCH - Casuística 4: STAND UP - Doy Pack Redonda / Fuelle Insertado

| # | Campo | Obligatorio | Tipo | Rango/Opciones | Validación | Cálculo |
|:---|:---|:---:|:---|:---|:---|:---|
| 1 | Envoltura | ✅ | Radio | POUCH | Solo lectura | - |
| 2 | Familia | ✅ | Radio | Stand Up | Auto-set | - |
| 3 | Sub-familia | ✅ | Dropdown | Sello K/Normal/Doy Pack | onChange | - |
| 4 | Base | ✅ | Radio | Redonda/Cuadrada | visible if #3=DoyPack | - |
| 5 | Fuelle Tipo | ✅ | Radio | Propio/Insertado | visible if #3=DoyPack | - |
| 6 | ¿Tiene Fuelle? | ✅ | Radio | Sí | auto-set (Doy Pack) | - |
| 7 | Width (mm) | ✅ | Number | **80-230** ⚠️ | onChange | ESPECIAL |
| 8 | Length (mm) | ✅ | Number | **134-340** ⚠️ | onChange | ESPECIAL |
| 9 | Ancho Fuelle (mm) | ✅ | Number | **0-3** ⚠️ | onChange | ESPECIAL |
| 10 | **Perímetro (mm)** | ✅ | Display | **100-650** ⚠️ | Auto-calc | 2×(width+length) |
| 11 | Validación Perímetro | ✅ | Badge | Validado/Rechazado | Auto | **Doy Pack range** |
| 12 | Material [SI] | ✅ | Dropdown | [SI Catalog] | required | - |
| 13 | Accesorios | ⚪ | Modal | Máx 3 | - | - |
| 14 | Blueprint Format | ✅ | Display | "POUCH STAND UP\DOY PACK REDONDA\FUELLE INSERTADO" | Auto-generate | #4,#5 |

**Story Points:** 21 | **Complejidad:** ALTA | **Niveles Cascada:** 3 + VALIDACIONES ESPECIALES**

---

## 📦 POUCH - Casuística 5: STAND UP - Doy Pack Cuadrada / Fuelle Propio

| # | Campo | Obligatorio | Tipo | Rango/Opciones | Validación | Cálculo |
|:---|:---|:---:|:---|:---|:---|:---|
| 1 | Envoltura | ✅ | Radio | POUCH | Solo lectura | - |
| 2 | Familia | ✅ | Radio | Stand Up | Auto-set | - |
| 3 | Sub-familia | ✅ | Dropdown | Sello K/Normal/Doy Pack | onChange | - |
| 4 | Base | ✅ | Radio | Redonda/Cuadrada | visible if #3=DoyPack | - |
| 5 | Fuelle Tipo | ✅ | Radio | Propio/Insertado | visible if #3=DoyPack | - |
| 6 | ¿Tiene Fuelle? | ✅ | Radio | Sí | auto-set (Doy Pack) | - |
| 7 | Width (mm) | ✅ | Number | **80-230** ⚠️ | onChange | ESPECIAL |
| 8 | Length (mm) | ✅ | Number | **134-340** ⚠️ | onChange | ESPECIAL |
| 9 | Ancho Fuelle (mm) | ✅ | Number | **0-3** ⚠️ | onChange | ESPECIAL |
| 10 | **Perímetro (mm)** | ✅ | Display | **100-650** ⚠️ | Auto-calc | 2×(width+length) |
| 11 | Validación Perímetro | ✅ | Badge | Validado/Rechazado | Auto | **Doy Pack range** |
| 12 | Material [SI] | ✅ | Dropdown | [SI Catalog] | required | - |
| 13 | Accesorios | ⚪ | Modal | Máx 3 | - | - |
| 14 | Blueprint Format | ✅ | Display | "POUCH STAND UP\DOY PACK CUADRADA\FUELLE PROPIO" | Auto-generate | #4,#5 |

**Story Points:** 21 | **Complejidad:** ALTA | **Niveles Cascada:** 3 + VALIDACIONES ESPECIALES**

---

## 📦 POUCH - Casuística 6: STAND UP - Doy Pack Cuadrada / Fuelle Insertado

| # | Campo | Obligatorio | Tipo | Rango/Opciones | Validación | Cálculo |
|:---|:---|:---:|:---|:---|:---|:---|
| 1 | Envoltura | ✅ | Radio | POUCH | Solo lectura | - |
| 2 | Familia | ✅ | Radio | Stand Up | Auto-set | - |
| 3 | Sub-familia | ✅ | Dropdown | Sello K/Normal/Doy Pack | onChange | - |
| 4 | Base | ✅ | Radio | Redonda/Cuadrada | visible if #3=DoyPack | - |
| 5 | Fuelle Tipo | ✅ | Radio | Propio/Insertado | visible if #3=DoyPack | - |
| 6 | ¿Tiene Fuelle? | ✅ | Radio | Sí | auto-set (Doy Pack) | - |
| 7 | Width (mm) | ✅ | Number | **80-230** ⚠️ | onChange | ESPECIAL |
| 8 | Length (mm) | ✅ | Number | **134-340** ⚠️ | onChange | ESPECIAL |
| 9 | Ancho Fuelle (mm) | ✅ | Number | **0-3** ⚠️ | onChange | ESPECIAL |
| 10 | **Perímetro (mm)** | ✅ | Display | **100-650** ⚠️ | Auto-calc | 2×(width+length) |
| 11 | Validación Perímetro | ✅ | Badge | Validado/Rechazado | Auto | **Doy Pack range** |
| 12 | Material [SI] | ✅ | Dropdown | [SI Catalog] | required | - |
| 13 | Accesorios | ⚪ | Modal | Máx 3 | - | - |
| 14 | Blueprint Format | ✅ | Display | "POUCH STAND UP\DOY PACK CUADRADA\FUELLE INSERTADO" | Auto-generate | #4,#5 |

**Story Points:** 21 | **Complejidad:** ALTA | **Niveles Cascada:** 3 + VALIDACIONES ESPECIALES**

---

## 📦 POUCH - Casuística 7: PLANO - Dos Sellos

| # | Campo | Obligatorio | Tipo | Rango/Opciones | Validación | Cálculo |
|:---|:---|:---:|:---|:---|:---|:---|
| 1 | Envoltura | ✅ | Radio | POUCH | Solo lectura | - |
| 2 | Familia | ✅ | Radio | Plano | Auto-set | - |
| 3 | Cantidad Sellos | ✅ | Radio | Dos/Tres | onChange | - |
| 4 | ¿Tiene Fuelle? | ✅ | Radio | Sí/No | onChange | - |
| 5 | Width (mm) | ✅ | Number | 1-500 | onChange | - |
| 6 | Length (mm) | ✅ | Number | 1-500 | onChange | - |
| 7 | Ancho Fuelle (mm) | ⚪ | Number | 0-500 | visible if #4=Sí | - |
| 8 | Ancho Sello Lateral | ⚪ | Number | - | oculto (#3=Dos) | - |
| 9 | **Perímetro (mm)** | ✅ | Display | 100-15000 | Auto-calc | 2×(width+length) |
| 10 | Validación Perímetro | ✅ | Badge | Validado/Rechazado | Auto | per in range |
| 11 | Material [SI] | ✅ | Dropdown | [SI Catalog] | required | - |
| 12 | Accesorios | ⚪ | Modal | Máx 3 | - | - |
| 13 | Blueprint Format | ✅ | Display | "POUCH PLANO\DOS SELLOS" | Auto-generate | #3 |

**Story Points:** 21 | **Complejidad:** ALTA | **Niveles Cascada:** 2

---

## 📦 POUCH - Casuística 8: PLANO - Tres Sellos

| # | Campo | Obligatorio | Tipo | Rango/Opciones | Validación | Cálculo |
|:---|:---|:---:|:---|:---|:---|:---|
| 1 | Envoltura | ✅ | Radio | POUCH | Solo lectura | - |
| 2 | Familia | ✅ | Radio | Plano | Auto-set | - |
| 3 | Cantidad Sellos | ✅ | Radio | Dos/Tres | onChange | - |
| 4 | ¿Tiene Fuelle? | ✅ | Radio | Sí/No | onChange | - |
| 5 | Width (mm) | ✅ | Number | 1-500 | onChange | - |
| 6 | Length (mm) | ✅ | Number | 1-500 | onChange | - |
| 7 | Ancho Fuelle (mm) | ⚪ | Number | 0-500 | visible if #4=Sí | - |
| 8 | Ancho Sello Lateral | ⚪ | Number | - | visible (#3=Tres) | - |
| 9 | **Perímetro (mm)** | ✅ | Display | 100-15000 | Auto-calc | 2×(width+length) |
| 10 | Validación Perímetro | ✅ | Badge | Validado/Rechazado | Auto | per in range |
| 11 | Material [SI] | ✅ | Dropdown | [SI Catalog] | required | - |
| 12 | Accesorios | ⚪ | Modal | Máx 3 | - | - |
| 13 | Blueprint Format | ✅ | Display | "POUCH PLANO\TRES SELLOS" | Auto-generate | #3 |

**Story Points:** 21 | **Complejidad:** ALTA | **Niveles Cascada:** 2

---

## 📦 POUCH - Casuística 9: SELLO CENTRAL - PE-PE/PE + Fuelle

| # | Campo | Obligatorio | Tipo | Rango/Opciones | Validación | Cálculo |
|:---|:---|:---:|:---|:---|:---|:---|
| 1 | Envoltura | ✅ | Radio | POUCH | Solo lectura | - |
| 2 | Familia | ✅ | Radio | Sello Central | Auto-set | - |
| 3 | Material | ✅ | Dropdown | PE-PE/PE/Aleta/Otro | onChange | - |
| 4 | ¿Tiene Fuelle? | ✅ | Radio | Sí/No | onChange | - |
| 5 | Width (mm) | ✅ | Number | 1-500 | onChange | - |
| 6 | Length (mm) | ✅ | Number | 1-500 | onChange | - |
| 7 | Ancho Fuelle (mm) | ⚪ | Number | 0-500 | visible if #4=Sí | - |
| 8 | **Perímetro (mm)** | ✅ | Display | 100-15000 | Auto-calc | 2×(width+length) |
| 9 | Validación Perímetro | ✅ | Badge | Validado/Rechazado | Auto | per in range |
| 10 | Material [SI] | ✅ | Dropdown | [SI Catalog] | required | - |
| 11 | ¿Tiene Microperforado? | ⚪ | Radio | Sí/No | visible if #3=PE-PE/PE & #4=Sí | - |
| 12 | Lado Aleta | ⚪ | Radio | Derecho/Izquierdo | visible if #11=Sí | - |
| 13 | Tipo Microperforado | ⚪ | Dropdown | Total/Parcial | visible if #11=Sí | - |
| 14 | Separación Puas (mm) | ⚪ | Number | - | visible if #11=Sí | - |
| 15 | Distancia Lado Aleta | ⚪ | Number | - | visible if #11=Sí | - |
| 16 | Ancho Sello Aleta (mm) | ⚪ | Number | 10/12/15 | visible if #3=PE-PE/PE | - |
| 17 | Sello Ancho Transversal | ⚪ | Number | - | visible if #3=PE-PE/PE | - |
| 18 | **Ancho Total Calculado** | ⚪ | Display | - | visible if #3=PE-PE/PE | #16+#17 |
| 19 | Accesorios | ⚪ | Modal | Máx 3 | - | - |
| 20 | Blueprint Format | ✅ | Display | "POUCH C/SELLO CENTRAL\TIPO ALETA\CON FUELLE (PE-PE/PE)" | Auto-generate | #3,#4 |

**Story Points:** 21 | **Complejidad:** ALTA | **Niveles Cascada:** 4 (MÁXIMA)**

---

## 📦 POUCH - Casuística 10: SELLO CENTRAL - PE-PE/PE sin Fuelle

| # | Campo | Obligatorio | Tipo | Rango/Opciones | Validación | Cálculo |
|:---|:---|:---:|:---|:---|:---|:---|
| 1 | Envoltura | ✅ | Radio | POUCH | Solo lectura | - |
| 2 | Familia | ✅ | Radio | Sello Central | Auto-set | - |
| 3 | Material | ✅ | Dropdown | PE-PE/PE/Aleta/Otro | onChange | - |
| 4 | ¿Tiene Fuelle? | ✅ | Radio | Sí/No | onChange | - |
| 5 | Width (mm) | ✅ | Number | 1-500 | onChange | - |
| 6 | Length (mm) | ✅ | Number | 1-500 | onChange | - |
| 7 | Ancho Fuelle (mm) | ⚪ | Number | - | oculto (#4=No) | - |
| 8 | **Perímetro (mm)** | ✅ | Display | 100-15000 | Auto-calc | 2×(width+length) |
| 9 | Validación Perímetro | ✅ | Badge | Validado/Rechazado | Auto | per in range |
| 10 | Material [SI] | ✅ | Dropdown | [SI Catalog] | required | - |
| 11 | ¿Tiene Microperforado? | ⚪ | Radio | - | oculto (#4=No) | - |
| 12-15 | Microperforado section | ⚪ | - | - | oculto | - |
| 16 | Ancho Sello Aleta (mm) | ⚪ | Number | 10/12/15 | visible if #3=PE-PE/PE | - |
| 17 | Sello Ancho Transversal | ⚪ | Number | - | visible if #3=PE-PE/PE | - |
| 18 | **Ancho Total Calculado** | ⚪ | Display | - | visible if #3=PE-PE/PE | #16+#17 |
| 19 | Accesorios | ⚪ | Modal | Máx 3 | - | - |
| 20 | Blueprint Format | ✅ | Display | "POUCH C/SELLO CENTRAL\TIPO ALETA\SIN FUELLE (PE-PE/PE)" | Auto-generate | #3,#4 |

**Story Points:** 21 | **Complejidad:** ALTA | **Niveles Cascada:** 3

---

## 📦 POUCH - Casuística 11: SELLO CENTRAL - Aleta + Fuelle

| # | Campo | Obligatorio | Tipo | Rango/Opciones | Validación | Cálculo |
|:---|:---|:---:|:---|:---|:---|:---|
| 1 | Envoltura | ✅ | Radio | POUCH | Solo lectura | - |
| 2 | Familia | ✅ | Radio | Sello Central | Auto-set | - |
| 3 | Material | ✅ | Dropdown | PE-PE/PE/Aleta/Otro | onChange | - |
| 4 | ¿Tiene Fuelle? | ✅ | Radio | Sí/No | onChange | - |
| 5 | Width (mm) | ✅ | Number | 1-500 | onChange | - |
| 6 | Length (mm) | ✅ | Number | 1-500 | onChange | - |
| 7 | Ancho Fuelle (mm) | ⚪ | Number | 0-500 | visible if #4=Sí | - |
| 8 | **Perímetro (mm)** | ✅ | Display | 100-15000 | Auto-calc | 2×(width+length) |
| 9 | Validación Perímetro | ✅ | Badge | Validado/Rechazado | Auto | per in range |
| 10 | Material [SI] | ✅ | Dropdown | [SI Catalog] | required | - |
| 11 | ¿Tiene Microperforado? | ⚪ | Radio | Sí/No | oculto (Material=Aleta) | - |
| 12-15 | Microperforado section | ⚪ | - | - | oculto | - |
| 16 | Ancho Sello Aleta (mm) | ⚪ | Number | - | oculto | - |
| 17 | Sello Ancho Transversal | ⚪ | Number | - | oculto | - |
| 18 | **Ancho Total Calculado** | ⚪ | Display | - | oculto | - |
| 19 | Accesorios | ⚪ | Modal | Máx 3 | - | - |
| 20 | Blueprint Format | ✅ | Display | "POUCH C/SELLO CENTRAL\TIPO ALETA\CON FUELLE" | Auto-generate | #3,#4 |

**Story Points:** 21 | **Complejidad:** ALTA | **Niveles Cascada:** 3

---

## 📦 POUCH - Casuística 12: SELLO CENTRAL - Aleta sin Fuelle

| # | Campo | Obligatorio | Tipo | Rango/Opciones | Validación | Cálculo |
|:---|:---|:---:|:---|:---|:---|:---|
| Similar a Casuística 11, pero con #4 = "No" |

**Story Points:** 21 | **Complejidad:** ALTA

---

## 📦 POUCH - Casuística 13: SELLO CENTRAL - Otro Material + Fuelle

| # | Campo | Obligatorio | Tipo | Rango/Opciones | Validación | Cálculo |
|:---|:---|:---:|:---|:---|:---|:---|
| Similar a Casuística 11, pero con #3 = "Otro" |

**Story Points:** 21 | **Complejidad:** ALTA

---

## 📦 POUCH - Casuística 14: SELLO CENTRAL - Otro Material sin Fuelle

| # | Campo | Obligatorio | Tipo | Rango/Opciones | Validación | Cálculo |
|:---|:---|:---:|:---|:---|:---|:---|
| Similar a Casuística 12, pero con #3 = "Otro" |

**Story Points:** 21 | **Complejidad:** ALTA

---

## 📦 POUCH - Casuística 15: SELLO FUELLE - Tipo 4-1

| # | Campo | Obligatorio | Tipo | Rango/Opciones | Validación | Cálculo |
|:---|:---|:---:|:---|:---|:---|:---|
| 1 | Envoltura | ✅ | Radio | POUCH | Solo lectura | - |
| 2 | Familia | ✅ | Radio | Sello Fuelle | Auto-set | - |
| 3 | Tipo Sello Fuelle | ✅ | Dropdown | 4-1/1-1 | onChange | - |
| 4 | ¿Tiene Fuelle? | ✅ | Radio | Sí | auto-set | - |
| 5 | Width (mm) | ✅ | Number | 1-500 | onChange | - |
| 6 | Length (mm) | ✅ | Number | 1-500 | onChange | - |
| 7 | Ancho Fuelle (mm) | ✅ | Number | 0-500 | onChange | - |
| 8 | **Perímetro (mm)** | ✅ | Display | 100-15000 | Auto-calc | 2×(width+length) |
| 9 | Validación Perímetro | ✅ | Badge | Validado/Rechazado | Auto | per in range |
| 10 | Material [SI] | ✅ | Dropdown | [SI Catalog] | required | - |
| 11 | Accesorios | ⚪ | Modal | Máx 3 | - | - |
| 12 | Blueprint Format | ✅ | Display | "POUCH C/SELLO EN FUELLE\TIPO 4-1\FUELLE PROPIO" | Auto-generate | #3 |

**Story Points:** 21 | **Complejidad:** ALTA | **Niveles Cascada:** 1

---

## 📦 POUCH - Casuística 16: SELLO FUELLE - Tipo 1-1

| # | Campo | Obligatorio | Tipo | Rango/Opciones | Validación | Cálculo |
|:---|:---|:---:|:---|:---|:---|:---|
| Similar a Casuística 15, pero con #3 = "1-1" |

**Story Points:** 21 | **Complejidad:** ALTA | **Niveles Cascada:** 1

---

# RESUMEN FINAL

## 📊 Estadísticas de Casuísticas

| Formato | Casuísticas | Total Campos | Campos Obligatorios | Campos Condicionales | Validaciones Especiales |
|:---|:---:|:---:|:---:|:---:|:---:|
| **LÁMINA** | 3 | 15-26 | 10 | 12 | Fotoregistro |
| **BOLSA** | 8 | 14-20 | 11 | 8 | Wicket |
| **POUCH** | 16 | 12-20 | 10 | 10 | **Doy Pack + Microperforado** |
| **TOTAL** | **27** | **14-26** | **10** | **10** | **3 tipos** |

## ✅ Validaciones Obligatorias Todas

```
✅ Width (dimensión 1)
✅ Length o Repetition (dimensión 2)
✅ Perímetro (cálculo automático)
✅ Validación Perímetro (rango)
✅ Validación Dimensiones (rangos)
✅ Material [SI] (obligatorio)
```

## 🔧 Cálculos Obligatorios Todos

```
✅ Perímetro = 2 × (dim1 + dim2)
✅ Validación Perímetro (range check)
✅ Blueprint Format (auto-generate)
```

## ⚠️ Validaciones ESPECIALES

### POUCH Doy Pack (Casuísticas 3-6)
- Width: 80-230 (vs normal 1-500)
- Length: 134-340 (vs normal 1-500)
- Ancho Fuelle: 0-3 (vs normal 0-500)
- Perímetro: 100-650 (vs normal 100-15000)

### SELLO CENTRAL PE-PE/PE (Casuísticas 9-10)
- Microperforado condicional
- Cálculo Ancho Total = Sello Aleta + Sello Transversal

**Total Story Points:** 50 (13 LÁMINA + 16 BOLSA + 21 POUCH)
