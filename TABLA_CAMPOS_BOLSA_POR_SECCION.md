# TABLA DE CAMPOS BOLSA POR SECCIÓN
## Matriz de Visualización y Edición por Paso

**Documento:** Campos visualizados en ProductEditPage.tsx para BOLSA  
**Versión:** 1.0  
**Fecha:** 2026-08-10  
**Tipo Envoltura:** BOLSA (Sello Lateral, Fondo, Wicket, Hojas)  
**Pasos Totales:** 4 (no hay Paso 1.5 para BOLSA)  
**Campos Totales:** 62 (visualizados en UI)

---

## RESUMEN CONSOLIDADO

| PASO | SECCIÓN | CAMPOS | OBLIGATORIOS | CONDICIONALES |
|------|---------|--------|-------------|--------------|
| 0 | Información Producto | 11 | 8 | 3 |
| 1 | Especificaciones de Diseño | 17 | 6 | 11 |
| 2 | Información Técnica Estructura | 28 | 8 | 20 |
| 3 | Embalaje y Empalmes | 4 | 3 | 1 |
| **TOTAL** | - | **62** | **25** | **35** |

---

## PASO 0: INFORMACIÓN PRODUCTO

| # | Campo | Tipo | Obligatorio | Editable | Catálogo | Descripción |
|---|-------|------|-------------|----------|----------|-------------|
| 1 | Clasificación | Select | ✓ | ✓ | TABMODPRODODISEO | Nuevo / Modificado |
| 2 | Modificación (MOT) | Checkboxes | ✓ | ✓ | Dinámico por Clasificación | 12+ opciones de motivos |
| 3 | Nombre Producto | Texto | ✓ | ✓ (si Nuevo) | - | Ej. "Aceite Vegetal 2L" |
| 4 | Volumen Referencial | Número | ✓ | ✓ (si Nuevo) | - | Ej. "2000" |
| 5 | Unidad Medida | Select | ✓ | ✓ (si Nuevo) | TABUNIMEDODISEO | KGS, LTS, UNIDADES, etc. |
| 6 | Descripción Breve | Textarea | ✓ | ✓ | - | Necesidad técnica o comercial |
| 7 | Acción Salesforce | Texto | ✗ | ✓ | - | Formato: A-XXXXXX |
| 8 | Código RFQ | Texto | ✗ | ✓ | - | Ej. "RFQ-2024-001" |
| 9 | Aplicación Técnica | Select | ✓ | ✓ | TECHNICAL_APPLICATION | 45+ opciones |
| 10 | Código Empaque Cliente | Texto | ✗ | ✓ | - | Ej. "SKU-CLIENT-001" |
| 11 | Comentarios | Textarea | ✗ | ✓ | - | Observaciones iniciales |

---

## PASO 1: ESPECIFICACIONES DE DISEÑO

| # | Campo | Tipo | Obligatorio | Editable | Catálogo | Descripción |
|---|-------|------|-------------|----------|----------|-------------|
| 12 | ¿Diseño Referencia? | Select | ✓ | ✓ | Sí/No | Carga EDAG o nuevo diseño |
| 13 | EDAG Referencia | Texto | ✓* | ✓ | - | Si tiene_referencia=Sí, Formato: NNNNN-NN |
| 14 | Clase Impresión | Select | ✓ | ✓ | print_class | Flexo / Huecograbado / Sin impresión |
| 15 | Tipo Impresión | Select | ✓* | ✓ | print_type | Si printClass ≠ Sin impresión |
| 16 | Forma Impresión | Select | ✓* | ✓ | PRODUCT_CATALOGS | Si printClass ≠ Sin impresión |
| 17 | Especificaciones Especiales | Select | ✗ | ✓ | Hardcoded | Tintas, Efectos, Acabados, Otros |
| 18 | Comentarios Especiales | Textarea | ✗ | ✓ | - | Si especiales = Otros |
| 19 | Objetivo Color | Select | ✓* | ✓ | Hardcoded | Si printClass ≠ Sin impresión |
| 20 | Objetivo Color - Otro | Texto | ✓** | ✓ | - | Si objetivo = "Otros" |
| 21 | Aprobador Prensa | Select | ✓* | ✓ | Hardcoded | Si printClass ≠ Sin impresión |
| 22 | Código ALUSA | Texto | ✗ | ✓ | - | Referencia técnica |
| 23 | Instrucciones Trabajo Diseño | Textarea | ✓* | ✓ | - | Si printClass ≠ Sin impresión |
| 24 | ¿Tiene Plano Diseño? | Select | ✓ | ✓ | Sí/No | - |
| 25 | Tipo de Plano | Select | ✓*** | ✓ | Hardcoded | Si tiene_plano=Sí, 4 opciones |
| 26 | Archivos Plano | File | ✓*** | ✓ | - | Si requiere_archivo & tiene_plano=Sí |
| 27 | Comentario Plano | Textarea | ✓*** | ✓ | - | Si tipo = SOLO_DATOS_SIN_WEBCENTER |
| 28 | Perímetro Calculado | Número | ✗ | Auto | - | Lectura automática (si calculable) |

---

## PASO 2: INFORMACIÓN TÉCNICA DE ESTRUCTURA

### Subsección: Configuración de Formato BOLSA

| # | Campo | Tipo | Obligatorio | Editable | Catálogo | Descripción |
|---|-------|------|-------------|----------|----------|-------------|
| 29 | Tipo Presentación | Select | ✓ | ✓ | Hardcoded | Bolsa / Wicket / Hojas |
| 30 | Tipo Sello (Bolsa) | Select | ✓* | ✓ | Hardcoded | Si tipo_presentación=Bolsa, Lateral/Fondo |
| 31 | Acabado Sello Lateral | Select | ✓** | ✓ | Hardcoded | Si sello=Lateral, Corte/Pestaña |
| 32 | ¿Tiene Fuelle? | Select | ✓* | ✓ | Sí/No | Si tipo_presentación=Bolsa |
| 33 | Tipo Fuelle | Select | ✗ | ✓ | Hardcoded | Si fuelle=Sí (valores específicos) |

### Subsección: Dimensiones BOLSA

| # | Campo | Tipo | Obligatorio | Editable | Catálogo | Descripción |
|---|-------|------|-------------|----------|----------|-------------|
| 34 | Ancho | Número | ✓ | ✓ | - | Rango dinámico según FDP |
| 35 | Largo | Número | ✓ | ✓ | - | Rango dinámico según FDP |
| 36 | Ancho Fuelle Cerrado | Número | ✓ | ✓ | - | Rango dinámico según FDP |
| 37 | Altura Área Impresa | Número | ✗ | ✓ | - | Si fuelle lateral=Sí |
| 38 | Ancho Área Impresa | Número | ✗ | ✓ | - | Si fuelle lateral=Sí |

### Subsección: Especificaciones Wicket (Condicional)

| # | Campo | Tipo | Obligatorio | Editable | Catálogo | Descripción |
|---|-------|------|-------------|----------|----------|-------------|
| 39 | ¿Wicket? | Select | ✗ | ✓ | Sí/No | Si tipo_presentación=Wicket |
| 40 | Diámetro Wicket | Select | ✓* | ✓ | Hardcoded | Si wicket=Sí (D12/14/16 mm) |
| 41 | Dist. Margen Superior Wicket | Número | ✓* | ✓ | - | Si wicket=Sí |
| 42 | Dist. Margen Derecho Wicket | Número | ✓* | ✓ | - | Si wicket=Sí |
| 43 | ¿Wicket Control? | Select | ✗ | ✓ | Sí/No | - |
| 44 | Diámetro Wicket Control | Select | ✓* | ✓ | Hardcoded | Si wicket_control=Sí |
| 45 | Ubicación Wicket Control | Select | ✓* | ✓ | Hardcoded | Si wicket_control=Sí (Superior/Inferior) |
| 46 | Dist. Margen Superior Control | Número | ✓* | ✓ | - | Si wicket_control=Sí |
| 47 | Dist. Margen Derecho Control | Número | ✓* | ✓ | - | Si wicket_control=Sí |
| 48 | ¿Precorte Wicket? | Select | ✗ | ✓ | Sí/No | - |
| 49 | Precorte Largo | Select | ✓* | ✓ | Hardcoded | Si precorte_wicket=Sí (3-7 mm) |
| 50 | Precorte Ubicación | Select | ✓* | ✓ | Hardcoded | Si precorte_wicket=Sí |
| 51 | Precorte Dist. Derecho | Select | ✓* | ✓ | Hardcoded | Si precorte_wicket=Sí |
| 52 | ¿Corte Aliviador? | Select | ✗ | ✓ | Sí/No | - |
| 53 | Corte Aliviador Dist. Derecho | Número | ✓* | ✓ | - | Si corte_aliviador=Sí |
| 54 | ¿Dispensador? | Select | ✗ | ✓ | Sí/No | - |
| 55 | Dispensador Dist. Izquierdo | Número | ✓* | ✓ | - | Si dispensador=Sí |
| 56 | ¿Fotocélula Bolsa Wicket? | Select | ✗ | ✓ | Sí/No | - |

### Subsección: Estructura Base (Común)

| # | Campo | Tipo | Obligatorio | Editable | Catálogo | Descripción |
|---|-------|------|-------------|----------|----------|-------------|
| 57 | ¿Estructura Referencia? | Select | ✓ | ✓ | Sí/No | Carga E/M o nueva |
| 58 | E/M Referencia | Texto | ✓* | ✓ | - | Si estructura_referencia=Sí |
| 59 | Tipo Estructura | Select | ✓ | ✗ | structure_type | Mono/Bilam/Trilam/Tetra (heredado) |
| 60 | Materiales Capas 1-4 | Tabla | ✓** | ✓* | 405 SI Validadas | Dinámico según Tipo Estructura |
| 61 | ¿Solicitud Muestra? | Select | ✓ | ✓ | Sí/No | - |
| 62 | Especificación Técnica Cliente | File | ✓* | ✓ | - | Si tiene_espectec_cliente=Sí |

---

## PASO 3: EMBALAJE Y EMPALMES

| # | Campo | Tipo | Obligatorio | Editable | Catálogo | Descripción |
|---|-------|------|-------------|----------|----------|-------------|
| 63 | Embalaje Material | Select | ✓ | ✓ | MATERIAL_PACKAGING | Cajas/Pallets/Bobinas |
| 64 | Embalaje Material Especial | Textarea | ✗ | ✓ | - | Condiciones especiales |
| 65 | Embalaje Exportación | Select | ✓ | ✓ | EXPORT_PACKAGING | - |
| 66 | Empalmes | Select | ✓ | ✓ | SPLICES_CATALOG | Tipos de empalmes |

---

## ACCESORIOS CONSUMIBLES (Parte de Paso 2)

Máximo 3 accesorios simultáneos en BOLSA.

| Accesorio | Campos Asociados | Condicional |
|-----------|-----------------|------------|
| **Zipper** | Tipo Zipper | Depende de selección |
| **Tin-Tie** | — | Simple checkbox |
| **Válvula** | Tipo Válvula, Distancia boca-válvula | Depende de selección |
| **Asa Troquelada** | Tipo Asa, Color Asa, Forma Asa | Depende de selección |
| **Refuerzo** | Espesor, Ancho | Depende de selección |

---

## ACCESORIOS INTERNOS (Parte de Paso 2)

Máximo 3 accesorios simultáneos en BOLSA (excluyen wicket/fuelle/aliviador).

| Accesorio | Campos Asociados | Condicional |
|-----------|-----------------|------------|
| **Corte Angular** | Lado Corte Angular | Depende de selección |
| **Esquinas Redondas** | Tipo Esquinas Redondas | Depende de selección |
| **Muesca** | — | Simple checkbox |
| **Perforación** | Tipo Perforación, Ubicación, Distancia | Depende de selección |
| **Pre-Corte** | Tipo Pre-Corte, Precorte Fuelle A10mm | Depende de selección |

---

## RESTRICCIONES POR TIPO PRESENTACIÓN

### BOLSA - Sello Lateral

- **Tipo Sello:** Lateral / Fondo (opcional)
- **Acabado:** Corte o Pestaña
- **Fuelle Lateral:** Sí/No
- **Campos activos:** Altura/Ancho Área Impresa (si fuelle)
- **Accesorios permitidos:** Todos

### BOLSA - Wicket (Formato: WICKET)

- **Campos específicos:** Solapa, Wickets, Wicket Control, Precorte, Corte Aliviador, Dispensador, Fotocélula
- **Accesorios limitados:** No permite Zipper, Valve en modo Wicket
- **Precorte en Fuelle:** Sí/No + Abre Fácil + Perforación tipo

### BOLSA - Hojas (Formato: HOJAS)

- **Campos limitados:** Solo dimensiones base
- **Accesorios:** Todos permitidos
- **Sin especificación de fuelle**

---

## LEYENDA DE SIMBOLOGÍA

| Símbolo | Significado |
|---------|------------|
| ✓ | Obligatorio siempre |
| ✓* | Obligatorio condicional (según campo padre) |
| ✓** | Obligatorio condicional (según clasificación/MOT) |
| ✓*** | Obligatorio condicional (según combinación de campos) |
| ✗ | Opcional |
| ✓ (si Nuevo) | Obligatorio solo para Producto Nuevo, read-only para Modificado |
| ✗ | Opcional siempre |
| Auto | Auto-calculado por sistema |
| SI VALIDADA | Solo materiales con estado VALIDADA del Sistema Integral |

---

## DIFERENCIAS BOLSA vs LÁMINA

| Aspecto | LÁMINA | BOLSA |
|--------|--------|-------|
| Paso 1.5 (Sentido Embobinado) | ✓ SÍ | ✗ NO |
| Fotoregistro | ✓ SÍ (máx 1) | ✗ NO |
| Core (Diámetro, etc.) | ✓ SÍ | ✗ NO |
| Configuración Formato | Simple (3 tipos) | Compleja (Bolsa/Wicket/Hojas) |
| Accesorios Consumibles | Zipper, Valve | Zipper, Valve, Asa, Refuerzo |
| Wicket & Specials | ✗ NO | ✓ SÍ |
| Dimensiones | Ancho + Repetición | Ancho + Largo + Fuelle |
| Accesorios Internos | Comunes | Comunes + Wicket-specific |

---

## PUNTOS CRÍTICOS DE VALIDACIÓN

1. **Tipo Presentación** → Determina campos de Formato visibles
2. **Tipo Sello** → Si Bolsa, valida Acabado
3. **¿Fuelle?** → Habilita campos de Área Impresa
4. **¿Wicket?** → Muestra bloque completo de especificaciones Wicket
5. **Accesorios limitados** → Máximo 3 simultáneos
6. **Estructura Referencia** → Bloquea edición de Tipo Estructura si heredado
7. **Clasificación Modificado** → Read-only Nombre, Volumen, Unidad

---

**Documento completo v1.0 | 2026-08-10**
