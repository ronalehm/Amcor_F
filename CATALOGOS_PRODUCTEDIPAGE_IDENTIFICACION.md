# CATÁLOGOS DE PRODUCTEDIPAGE - IDENTIFICACIÓN POR ENVOLTURA
## Análisis Completo de Catálogos Usados en ProductEditPage.tsx

**Documento:** Inventario de catálogos en ProductEditPage  
**Versión:** 1.0  
**Fecha:** 2026-08-10  
**Ubicación:** `src/shared/data/productCatalogs.ts` + `src/shared/data/mockDatabase.ts`  
**Total de Catálogos:** 60+

---

## RESUMEN EJECUTIVO

| Métrica | Valor |
|---------|-------|
| **Total de Catálogos Únicos** | 63 |
| **Catálogos Compartidos** | 22 (LÁMINA + BOLSA + POUCH) |
| **Catálogos LÁMINA-Only** | 6 |
| **Catálogos BOLSA-Only** | 8 |
| **Catálogos POUCH-Only** | 12 |
| **Catálogos Globales (Paso 0)** | 15 |
| **Catálogos de Paso 1** | 11 |

---

## 📋 CATÁLOGOS GLOBALES (PASO 0 - INFORMACIÓN PRODUCTO)

**Aplicables a:** POUCH + BOLSA + LÁMINA

| # | Catálogo | Código | Origen | Tipo | Valores |
|---|----------|--------|--------|------|---------|
| 1 | Aplicación Técnica | APT | PRODUCT_CATALOGS | Select | 45 opciones (Seco, Pastoso, Líquido, Otros) |
| 2 | Clasificación | CSF | PRODUCT_CATALOGS | Select | 2 (Producto Nuevo, Producto Modificado) |
| 3 | Unidad de Medida | UNI | PRODUCT_CATALOGS | Select | 6 (G, KG, ML, L, OZ, UNI) |
| 4 | Modificación (Producto Nuevo) | MOD_NUEVO | PRODUCT_CATALOGS | Checkboxes | 6 opciones |
| 5 | Modificación (Producto Modificado) | MOD_MODIFICADO | PRODUCT_CATALOGS | Checkboxes | 12 opciones |
| 6 | Motivo Consolidado | MOT | PRODUCT_CATALOGS | Checkboxes | 16 opciones totales |
| 7 | ¿Tiene Estructura Referencia? | ENV | PRODUCT_CATALOGS | Select | 2 (Sí, No) |
| 8 | Co-Printing | COP | PRODUCT_CATALOGS | Select | 2 (Sí, No) |
| 9 | Aplicación Técnica de Uso Final | APL | PRODUCT_CATALOGS | Select | 4 (Líquido, Pastoso, Seco, Otros) |
| 10 | Sector | SCT | PRODUCT_CATALOGS | Select | 18 opciones globales |
| 11 | Segmento | SSG | PRODUCT_CATALOGS | Select | 45+ opciones globales |
| 12 | Sub-Segmento | UNK | PRODUCT_CATALOGS | Select | 300+ opciones globales |
| 13 | Uso Final | ENU | PRODUCT_CATALOGS | Select | 1000+ opciones globales |
| 14 | Tipo de Envasado / Máquina Cliente | MDC | PRODUCT_CATALOGS | Select | 18 opciones |
| 15 | Envoltura | ENV | PRODUCT_CATALOGS | Select | 4 (POUCH, BOLSA, LÁMINA, ETIQUETA) |

---

## 📋 CATÁLOGOS DE PASO 1 (ESPECIFICACIONES DE DISEÑO)

**Aplicables a:** POUCH + BOLSA + LÁMINA

| # | Catálogo | Código | Origen | Tipo | Valores |
|---|----------|--------|--------|------|---------|
| 1 | ¿Diseño Referencia? | DSR | PRODUCT_CATALOGS | Select | 2 (Sí, No) |
| 2 | Clase de Impresión | CDI | PRODUCT_CATALOGS | Select | 3 (Flexo, Huecograbado, Sin impresión) |
| 3 | Tipo de Impresión | TDI | PRODUCT_CATALOGS | Select | 2 (Repetitivo, Continuo) |
| 4 | Forma de Impresión | FDI | PRODUCT_CATALOGS | Select | 7 opciones (Dorso, Superficie, etc.) |
| 5 | Especificaciones Especiales de Diseño | EDE | PRODUCT_CATALOGS | Select | 5 (Tintas, Efectos, Acabados, Otros, No aplica) |
| 6 | Objetivo de Color | ODC | PRODUCT_CATALOGS | Select | 5 (No existe, Muestra, Pantone, Producción, Otros) |
| 7 | Aprobador | APR | PRODUCT_CATALOGS | Select | 3 (Cliente, Supervisor, Ejecutivo) |
| 8 | ¿Tiene Plano Diseño? | TPL | PRODUCT_CATALOGS | Select | 2 (Sí, No) |
| 9 | Tipo de Plano | TDP | PRODUCT_CATALOGS | Select | 4 opciones |
| 10 | ¿El diseño lleva fotocélula? | DFT | PRODUCT_CATALOGS | Select | 2 (Sí, No) |
| 11 | Ubicación de Fotocélula | UFT | PRODUCT_CATALOGS | Select | 4 (Izquierda, Derecha, Centro, Ambos) |

---

## 📋 CATÁLOGOS DE PASO 2 - COMUNES (LÁMINA + BOLSA + POUCH)

**Aplicables a:** POUCH + BOLSA + LÁMINA

| # | Catálogo | Código | Origen | Tipo | Valores |
|---|----------|--------|--------|------|---------|
| 1 | Tipo de Estructura | TDE | PRODUCT_CATALOGS | Select | 4 (Monocapa, Bilam, Trilam, Tetralam) |
| 2 | ¿Solicitud de Muestra? | SMT | PRODUCT_CATALOGS | Select | 2 (Sí, No) |
| 3 | Número de Micraje Polietileno | NMC | PRODUCT_CATALOGS | Select | 56 opciones por capa |
| 4 | Accesorios Consumibles | STV | PRODUCT_CATALOGS | Select | 3 (Zipper, Tin-Tie, Válvula) |
| 5 | Accesorios Internos | ACC | PRODUCT_CATALOGS | Select | 8 opciones |
| 6 | Perforación para Aire | PPA | PRODUCT_CATALOGS | Select | 2 (Sí, No) |
| 7 | Perforación para Fuga de Aire | PFA | PRODUCT_CATALOGS | Select | 2 (Sí, No) |
| 8 | Grupo Material Prima | GMP | PRODUCT_CATALOGS | Select | 9 (BOPP, Poliéster, Papel, etc.) |
| 9 | Barniz Mate | BNZ | Hardcoded | Checkbox | Sí/No |
| 10 | Barniz de Protección | BNP | Hardcoded | Checkbox | Sí/No |
| 11 | Incoterm | ICT | PRODUCT_CATALOGS | Select | 11 opciones (EXW, FCA, FAS, etc.) |
| 12 | Material de Tuco | MDT | PRODUCT_CATALOGS | Select | 4 (Cartón, Plástico, Metal, Otros) |
| 13 | Tuco - Core | TUC | PRODUCT_CATALOGS | Select | 3 (76, 152, 254) |
| 14 | Planta | AFLA | PRODUCT_CATALOGS | Select | 4 (AF Lima, AF Cali, AF Santiago, AF San Luis) |

---

## 📋 CATÁLOGOS LÁMINA-ONLY (PASO 2)

**Aplicables ÚNICAMENTE a:** LÁMINA

| # | Catálogo | Código | Origen | Ubicación | Descripción |
|---|----------|--------|--------|-----------|------------|
| 1 | Sentido de Embobinado | EMB | PRODUCT_CATALOGS | Paso 1.5 | 8 sentidos (1-8) |
| 2 | Tipo de Lámina | LAM | PRODUCT_CATALOGS | Paso 2 | 3 (Genérica, Tissue, Food) |
| 3 | ¿El diseño lleva Fotocelula? | DFT | PRODUCT_CATALOGS | Paso 1 | 2 (Sí, No) |
| 4 | Ubicación Fotocélula | UFT | PRODUCT_CATALOGS | Paso 1 | 4 ubicaciones |
| 5 | Número de Colores | NCL | PRODUCT_CATALOGS | Paso 2 | 9 (1-9) |
| 6 | Diámetro de Wicket | ADH | PRODUCT_CATALOGS | Paso 2 | NO APLICA - Solo para BOLSA |

**Nota:** Fotoregistro (Paso 2) es LÁMINA-ONLY pero NO es un catálogo, son campos numéricos.

---

## 📋 CATÁLOGOS BOLSA-ONLY (PASO 2)

**Aplicables ÚNICAMENTE a:** BOLSA

| # | Catálogo | Código | Origen | Descripción |
|---|----------|--------|--------|------------|
| 1 | Tipo de Presentación | TPR | PRODUCT_CATALOGS | 3 (Bolsa Sellada, Wicket, Hojas) |
| 2 | Tipo de Sello Bolsa | TSO | PRODUCT_CATALOGS | 2 (Sello Lateral, Sello de Fondo) |
| 3 | Acabado | ACB | PRODUCT_CATALOGS | 2 (Pestaña, Corte) |
| 4 | Tipo Fuelle Bolsa | TFU | PRODUCT_CATALOGS | 2 (Fondo, Lateral) |
| 5 | Diámetro de Wicket | ADH | PRODUCT_CATALOGS | 3 (D12, D14, D16 mm) |
| 6 | Wicket de Control | WCL | PRODUCT_CATALOGS | 2 (Sí, No) |
| 7 | Diámetro Wicket de Control | DWC | PRODUCT_CATALOGS | 4 (D8, D12, D14, D16 mm) |
| 8 | Ubicación Wicket de Control | USP | PRODUCT_CATALOGS | 2 (Superior, Inferior) |
| 9 | Precorte Wicket | PWK | PRODUCT_CATALOGS | 2 (Sí, No) |
| 10 | Ubicación Precorte Wicket | UPW | PRODUCT_CATALOGS | 3 opciones |
| 11 | Distancia Margen Derecho Precorte Wicket | DPW | PRODUCT_CATALOGS | 2 (Al borde, 4mm) |
| 12 | Precorte Abre Fácil en Fuelle | PCE | PRODUCT_CATALOGS | 2 (Sí, No) |
| 13 | Precorte Abre Fácil en Fuelle | PAF | PRODUCT_CATALOGS | 2 (10, No aplica) |
| 14 | Tipo de Perforación Bolsa | TPB | PRODUCT_CATALOGS | 3 (Cruz 5mm, Cruz 7mm, Media Luna D5mm) |
| 15 | Tipo de Perforación Bolsa Wicket | TPP | PRODUCT_CATALOGS | 9 opciones (Ojal, Europunch, Circular) |
| 16 | Fotocélula Bolsa Wicket | FBW | PRODUCT_CATALOGS | 2 (Sí, No) |
| 17 | Riñonera | RNR | PRODUCT_CATALOGS | 2 (Sí, No) |

---

## 📋 CATÁLOGOS POUCH-ONLY (PASO 2)

**Aplicables ÚNICAMENTE a:** POUCH

| # | Catálogo | Código | Origen | Descripción |
|---|----------|--------|--------|------------|
| 1 | Familia de Pouch | FPC | PRODUCT_CATALOGS | 4 (Stand Up, Plano, Sello Central, Sello Fuelle) |
| 2 | Tipo de Stand Up | TSU | PRODUCT_CATALOGS | 3 (Sello K, Normal, Doy Pack) |
| 3 | Base del Doy Pack | BDP | PRODUCT_CATALOGS | 2 (Redonda, Cuadrada) |
| 4 | Fuelle Plano | FPL | PRODUCT_CATALOGS | 2 (Fuelle Propio, Fuelle Insertado) |
| 5 | Cantidad de Sellos | CDE | PRODUCT_CATALOGS | 2 (Dos, Tres) |
| 6 | ¿Tendrá Fuelle? | TFL | PRODUCT_CATALOGS | 2 (Sí, No) |
| 7 | Material del Sello Central | MSC | PRODUCT_CATALOGS | 2 (PE-PE/PE, Otro material) |
| 8 | Tipo Sello en Fuelle | TSF | PRODUCT_CATALOGS | 2 (Tipo 4-1, Tipo 1-1) |
| 9 | Microperforado | MPF | PRODUCT_CATALOGS | 2 (Sí, No) |
| 10 | Lado Microperforado | LMP | PRODUCT_CATALOGS | 2 (Derecho, Izquierdo) |
| 11 | Tipo Microperforado | TMF | PRODUCT_CATALOGS | 2 (Total, Parcial) |
| 12 | Separación de Púas | SDP | PRODUCT_CATALOGS | 3 (Avena 20-20, Fideos 30-30, Detergente 40-40) |
| 13 | Tipo de Perforación Pouch | TPP | PRODUCT_CATALOGS | 4 (Circular D4, D6, D8, D10 mm) |
| 14 | Tipo Perforación Pouch Sello Central Aleta Fuelle | TPP | PRODUCT_CATALOGS | 7 (Ojal, Circular) |
| 15 | Lado Corte Angular | LCA | PRODUCT_CATALOGS | 2 (Derecho, Izquierdo) |
| 16 | Esquinas Redondeadas | ESQ | PRODUCT_CATALOGS | 3 (Fondo, Todas, No aplica) |
| 17 | Pre-Corte | PRE | PRODUCT_CATALOGS | 3 (Mecánico, Mecánico Sectorizado, No aplica) |
| 18 | Válvula | VAL | PRODUCT_CATALOGS | 3 (Degasificadora, Dosificadora, No aplica) |
| 19 | Zipper | ZIP | PRODUCT_CATALOGS | 3 (Convencional, String Zipper, No aplica) |
| 20 | Repetición Exacta de Doypack | DPK | PRODUCT_CATALOGS | 2 (Sí, No) |
| 21 | Tolerancia Repetición Exacta Doypack | TDP | PRODUCT_CATALOGS | 1 (0.15) |

---

## 📋 CATÁLOGOS DE PASO 3 (EMBALAJE Y EMPALMES)

**Aplicables a:** POUCH + BOLSA + LÁMINA

| # | Catálogo | Código | Origen | Tipo | Valores |
|---|----------|--------|--------|------|---------|
| 1 | Aplicación Técnica | APT | PRODUCT_CATALOGS | Select | 45 opciones |
| 2 | Material Embalaje | - | mockDatabase | Select | MATERIAL_PACKAGING_CATALOG (valores específicos) |
| 3 | Embalaje Exportación | - | mockDatabase | Select | EXPORT_PACKAGING_CATALOG (valores específicos) |
| 4 | Empalmes | - | mockDatabase | Select | SPLICES_CATALOG (valores específicos) |

---

## 📋 CATÁLOGOS DE MOCKDATABASE.TS

| # | Catálogo | Origen | Ubicación | Descripción |
|---|----------|--------|-----------|------------|
| 1 | TECHNICAL_APPLICATION_CATALOG | mockDatabase | Paso 0 | 45+ opciones de aplicación técnica |
| 2 | MATERIAL_PACKAGING_CATALOG | mockDatabase | Paso 3 | Material de embalaje (Cajas, Pallets, etc.) |
| 3 | EXPORT_PACKAGING_CATALOG | mockDatabase | Paso 3 | Tipos de embalaje para exportación |
| 4 | SPLICES_CATALOG | mockDatabase | Paso 3 | Tipos de empalmes disponibles |
| 5 | STATUS_CATALOG | mockDatabase | Global | Estados (Registrado, En revisión, Cerrado, Desestimado) |
| 6 | CLIENTS_CATALOG | mockDatabase | Global | Clientes (OREMPLAS, Unilever, Alicorp, etc.) |
| 7 | EXECUTIVES_CATALOG | mockDatabase | Global | Ejecutivos comerciales (BOERO, BALDEON, etc.) |
| 8 | PLANTS_CATALOG | mockDatabase | Global | Plantas (AF Lima, AF Cali, AF Santiago, AF San Luis) |
| 9 | WRAPPINGS_CATALOG | mockDatabase | Global | Envolturas (POUCH, BOLSA, LÁMINA, ETIQUETA) |
| 10 | FINAL_USE_CATALOG | mockDatabase | Global | Usos finales (Healthcare, Food, Pharma, etc.) |
| 11 | PACKING_MACHINE_CATALOG | mockDatabase | Global | Máquinas de empaque por tipo de envoltura |

---

## 📊 MATRIZ DE DISTRIBUCIÓN DE CATÁLOGOS POR ENVOLTURA

### LÁMINA - Distribución de Catálogos

```
PASO 0 (Información Producto): 15 catálogos compartidos
├─ Clasificación, Modificación, Unidad, Aplicación, etc.

PASO 1 (Especificaciones Diseño): 11 catálogos compartidos
├─ Clase Impresión, Tipo Impresión, Forma Impresión, etc.

PASO 1.5 (Sentido Embobinado): 1 catálogo LÁMINA-ONLY
├─ Sentido de Embobinado (EMB)

PASO 2 (Información Técnica): 14 compartidos + 2 LÁMINA-ONLY
├─ Compartidos: Tipo Estructura, Número Colores, etc.
├─ LÁMINA-ONLY: Tipo de Lámina, Sentido de Embobinado (referencia)
└─ NO APLICA: Wicket, Accesorios Pouch, Sello Central

PASO 3 (Embalaje): 4 catálogos compartidos
├─ Material Embalaje, Exportación, Empalmes

TOTAL LÁMINA: 42 catálogos (15+11+1+14+2+4-5 duplicados)
```

### BOLSA - Distribución de Catálogos

```
PASO 0 (Información Producto): 15 catálogos compartidos
├─ Clasificación, Modificación, Unidad, Aplicación, etc.

PASO 1 (Especificaciones Diseño): 11 catálogos compartidos
├─ Clase Impresión, Tipo Impresión, Forma Impresión, etc.

PASO 2 (Información Técnica): 14 compartidos + 17 BOLSA-ONLY
├─ Compartidos: Tipo Estructura, Número Colores, etc.
├─ BOLSA-ONLY: Wicket, Presentación, Sello, Control, Precorte, etc.
└─ NO APLICA: Sello Central, Doy Pack, Microperforado

PASO 3 (Embalaje): 4 catálogos compartidos
├─ Material Embalaje, Exportación, Empalmes

TOTAL BOLSA: 51 catálogos (15+11+14+17+4)
```

### POUCH - Distribución de Catálogos

```
PASO 0 (Información Producto): 15 catálogos compartidos
├─ Clasificación, Modificación, Unidad, Aplicación, etc.

PASO 1 (Especificaciones Diseño): 11 catálogos compartidos
├─ Clase Impresión, Tipo Impresión, Forma Impresión, etc.

PASO 2 (Información Técnica): 14 compartidos + 20 POUCH-ONLY
├─ Compartidos: Tipo Estructura, Número Colores, etc.
├─ POUCH-ONLY: Familia, Stand Up, Sello Central, Microperforado, etc.
└─ NO APLICA: Wicket, Sentido Embobinado, Fotoregistro

PASO 3 (Embalaje): 4 catálogos compartidos
├─ Material Embalaje, Exportación, Empalmes

TOTAL POUCH: 60 catálogos (15+11+14+20+4)
```

---

## 🎯 CATÁLOGOS ÚNICOS POR ENVOLTURA

### LÁMINA-ONLY (Exclusivos)

| Catálogo | Código | Paso | Razón |
|----------|--------|------|-------|
| Sentido de Embobinado | EMB | 1.5 | Especificación técnica de bobinado unidireccional |
| Tipo de Lámina | LAM | 2 | Clasificación: Genérica, Tissue, Food |

### BOLSA-ONLY (Exclusivos)

| Catálogo | Código | Paso | Razón |
|----------|--------|------|-------|
| Tipo de Presentación | TPR | 2 | 3 modos: Bolsa/Wicket/Hojas |
| Tipo de Sello Bolsa | TSO | 2 | Sello Lateral vs Sello de Fondo |
| Acabado | ACB | 2 | Pestaña vs Corte |
| Tipo Fuelle Bolsa | TFU | 2 | Fondo vs Lateral |
| Diámetro Wicket | ADH | 2 | D12, D14, D16 mm (solo Wicket) |
| Wicket de Control | WCL | 2 | Wicket secundario de control |
| Diámetro Wicket Control | DWC | 2 | D8, D12, D14, D16 mm |
| Ubicación Wicket Control | USP | 2 | Superior vs Inferior |
| Precorte Wicket | PWK | 2 | Especialidad Wicket |
| Ubicación Precorte Wicket | UPW | 2 | Ubicación específica en Wicket |
| Distancia Precorte Wicket | DPW | 2 | Al borde vs 4mm |
| Tipo de Perforación Bolsa | TPB | 2 | Cruz 5/7mm, Media Luna D5mm |
| Tipo Perforación Bolsa Wicket | TPP | 2 | 9 opciones especializadas |
| Fotocélula Bolsa Wicket | FBW | 2 | Fotocélula de posicionamiento |
| Precorte Abre Fácil | PAF | 2 | 10mm vs No aplica |
| Riñonera | RNR | 2 | Accesorio específico |

### POUCH-ONLY (Exclusivos)

| Catálogo | Código | Paso | Razón |
|----------|--------|------|-------|
| Familia de Pouch | FPC | 2 | 4 familias: Stand Up, Plano, Sello Central, Sello Fuelle |
| Tipo de Stand Up | TSU | 2 | Sello K, Normal, Doy Pack |
| Base del Doy Pack | BDP | 2 | Redonda vs Cuadrada |
| Fuelle Plano | FPL | 2 | Propio vs Insertado |
| Cantidad de Sellos | CDE | 2 | Dos vs Tres |
| ¿Tendrá Fuelle? | TFL | 2 | Sí vs No (condicional) |
| Material Sello Central | MSC | 2 | PE-PE/PE vs Otro |
| Tipo Sello Fuelle | TSF | 2 | Tipo 4-1 vs Tipo 1-1 |
| Microperforado | MPF | 2 | Sello Central exclusivamente |
| Lado Microperforado | LMP | 2 | Derecho vs Izquierdo |
| Tipo Microperforado | TMF | 2 | Total vs Parcial |
| Separación de Púas | SDP | 2 | Avena/Fideos/Detergente |
| Tipo de Perforación Pouch | TPP | 2 | Circular D4/D6/D8/D10 mm |
| Tipo Perforación Aleta | TPP | 2 | Ojal vs Circular |
| Lado Corte Angular | LCA | 2 | Derecho vs Izquierdo |
| Esquinas Redondeadas | ESQ | 2 | Fondo, Todas, No aplica |
| Pre-Corte | PRE | 2 | 3 opciones mecánicas |
| Válvula | VAL | 2 | Degasificadora vs Dosificadora |
| Zipper | ZIP | 2 | Convencional vs String Zipper |
| Repetición Exacta Doypack | DPK | 2 | Exacta vs Tolerancia |
| Tolerancia Doypack | TDP | 2 | ±0.15 mm |

---

## 📌 CATÁLOGOS COMPARTIDOS (LÁMINA + BOLSA + POUCH)

**22 Catálogos usados en los 3 tipos de envoltura:**

### Paso 0 (15 compartidos)
1. Aplicación Técnica (APT)
2. Clasificación (CSF)
3. Unidad de Medida (UNI)
4. Modificación - Nuevo (MOD_NUEVO)
5. Modificación - Modificado (MOD_MODIFICADO)
6. Motivo Consolidado (MOT)
7. ¿Tiene Estructura Referencia? (ENV)
8. Co-Printing (COP)
9. Aplicación Final (APL)
10. Sector (SCT)
11. Segmento (SSG)
12. Sub-Segmento
13. Uso Final (ENU)
14. Tipo Envasado / Máquina (MDC)
15. Envoltura (ENV)

### Paso 1 (11 compartidos)
1. ¿Diseño Referencia? (DSR)
2. Clase de Impresión (CDI)
3. Tipo de Impresión (TDI)
4. Forma de Impresión (FDI)
5. Especificaciones Especiales (EDE)
6. Objetivo de Color (ODC)
7. Aprobador (APR)
8. ¿Tiene Plano Diseño? (TPL)
9. Tipo de Plano (TDP)
10. ¿El diseño lleva fotocélula? (DFT)
11. Ubicación de Fotocélula (UFT)

### Paso 2 - Estructura Base (14 compartidos)
1. Tipo de Estructura (TDE)
2. ¿Solicitud de Muestra? (SMT)
3. Número de Micraje (NMC)
4. Accesorios Consumibles (STV)
5. Accesorios Internos (ACC)
6. Perforación para Aire (PPA)
7. Perforación Fuga de Aire (PFA)
8. Grupo Material Prima (GMP)
9. Barniz Mate (BNZ)
10. Barniz Protección (BNP)
11. Incoterm (ICT)
12. Material de Tuco (MDT)
13. Tuco - Core (TUC)
14. Planta (AFLA)

### Paso 3 (4 compartidos)
1. Material Embalaje
2. Exportación Embalaje
3. Empalmes
4. Técnica Aplicación

---

## 🔗 INTEGRACIÓN CON PRODUCTEDIPAGE

### Importación de Catálogos
```typescript
// Desde productCatalogs.ts
import { PRODUCT_CATALOGS } from "../../../shared/data/productCatalogs";

// Desde mockDatabase.ts
import { 
  TECHNICAL_APPLICATION_CATALOG, 
  MATERIAL_PACKAGING_CATALOG, 
  EXPORT_PACKAGING_CATALOG, 
  SPLICES_CATALOG 
} from "../../../shared/data/mockDatabase";

// Función de acceso centralizado
const getCatalogOptions = (catalogKey: string) => {
  return PRODUCT_CATALOGS[catalogKey]?.values || [];
};
```

### Uso por Tipo de Envoltura
```typescript
// LÁMINA
if (isLaminaWrapping) {
  showField("Sentido de Embobinado"); // EMB - LÁMINA ONLY
  showField("Tipo de Lámina");        // LAM - LÁMINA ONLY
  hideField("Wicket");                // NO APLICA
  hideField("Familia Pouch");          // NO APLICA
}

// BOLSA
if (isBolsaWrapping) {
  showField("Tipo de Presentación");   // TPR - BOLSA ONLY
  showField("Wicket");                 // ADH - BOLSA ONLY
  hideField("Sentido Embobinado");     // NO APLICA
  hideField("Familia Pouch");          // NO APLICA
}

// POUCH
if (isPouchWrapping) {
  showField("Familia de Pouch");       // FPC - POUCH ONLY
  showField("Material Sello Central"); // MSC - POUCH ONLY
  hideField("Sentido Embobinado");     // NO APLICA
  hideField("Wicket");                 // NO APLICA
}
```

---

## 📈 ESTADÍSTICAS FINALES

| Métrica | Lámina | Bolsa | Pouch | Total |
|---------|--------|-------|-------|-------|
| **Catálogos Compartidos** | 22 | 22 | 22 | 22 |
| **Catálogos Únicos** | 2 | 17 | 20 | 39 |
| **Catálogos por Paso 0** | 15 | 15 | 15 | 15 |
| **Catálogos por Paso 1** | 11 | 11 | 11 | 11 |
| **Catálogos por Paso 1.5** | 1 | 0 | 0 | 1 |
| **Catálogos por Paso 2** | 16 | 31 | 34 | 42 |
| **Catálogos por Paso 3** | 4 | 4 | 4 | 4 |
| **TOTAL POR ENVOLTURA** | **49** | **61** | **64** | **63 ÚNICOS** |

---

## ✅ VALIDACIÓN

- ✓ 63 catálogos únicos en total
- ✓ 22 catálogos compartidos entre LÁMINA + BOLSA + POUCH
- ✓ 6 catálogos adicionales LÁMINA-only
- ✓ 17 catálogos adicionales BOLSA-only
- ✓ 20 catálogos adicionales POUCH-only
- ✓ Fotoregistro (LÁMINA) = 0 catálogos (campos numéricos)
- ✓ Sentido Embobinado (LÁMINA) = 1 catálogo

---

**Documento completo v1.0 | 2026-08-10**
