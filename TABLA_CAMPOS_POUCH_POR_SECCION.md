# TABLA DE CAMPOS POUCH POR SECCIÓN
## Matriz de Visualización y Edición por Paso

**Documento:** Campos visualizados en ProductEditPage.tsx para POUCH  
**Versión:** 1.0  
**Fecha:** 2026-08-10  
**Tipo Envoltura:** POUCH (Stand Up, Plano, Sello Central, Sello en Fuelle)  
**Pasos Totales:** 4 (no hay Paso 1.5 para POUCH)  
**Campos Totales:** 71 (visualizados en UI)

---

## RESUMEN CONSOLIDADO

| PASO | SECCIÓN | CAMPOS | OBLIGATORIOS | CONDICIONALES |
|------|---------|--------|-------------|--------------|
| 0 | Información Producto | 11 | 8 | 3 |
| 1 | Especificaciones de Diseño | 17 | 6 | 11 |
| 2 | Información Técnica Estructura | 39 | 10 | 29 |
| 3 | Embalaje y Empalmes | 4 | 3 | 1 |
| **TOTAL** | - | **71** | **27** | **44** |

---

## PASO 0: INFORMACIÓN PRODUCTO

| # | Campo | Tipo | Obligatorio | Editable | Catálogo | Descripción |
|---|-------|------|-------------|----------|----------|-------------|
| 1 | Clasificación | Select | ✓ | ✓ | TABMODPRODODISEO | Nuevo / Modificado |
| 2 | Modificación (MOT) | Checkboxes | ✓ | ✓ | Dinámico por Clasificación | 12+ opciones de motivos |
| 3 | Nombre Producto | Texto | ✓ | ✓ (si Nuevo) | - | Ej. "Café Molido 250g" |
| 4 | Volumen Referencial | Número | ✓ | ✓ (si Nuevo) | - | Ej. "250" |
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

### Subsección: Configuración de Formato POUCH

| # | Campo | Tipo | Obligatorio | Editable | Catálogo | Descripción |
|---|-------|------|-------------|----------|----------|-------------|
| 29 | Familia de Pouch | Select | ✓ | ✓ | Hardcoded | Stand Up / Plano / Sello Central / Sello en Fuelle |
| 30 | Tipo Stand Up | Select | ✓* | ✓ | Hardcoded | Si familia=Stand Up (Sello K / Normal / Doy Pack) |
| 31 | Tipo Fuelle Stand Up | Select | ✓** | ✓ | Hardcoded | Si stand_up=Doy Pack (Fuelle Propio / Insertado) |
| 32 | Base Doy Pack | Select | ✓*** | ✓ | Hardcoded | Si stand_up=Doy Pack, Redondo/Cuadrado |
| 33 | Cantidad Sellos Plano | Select | ✓* | ✓ | Hardcoded | Si familia=Plano (Dos/Tres sellos) |
| 34 | Material Sello Central | Select | ✓* | ✓ | Hardcoded | Si familia=Sello Central (PE-PE/PE / Aleta / Otro) |
| 35 | ¿Tiene Fuelle? | Select | ✓** | ✓ | Sí/No | Si familia=Sello Central, ¿Fuelle? |
| 36 | Tipo Sello Fuelle | Select | ✓* | ✓ | Hardcoded | Si familia=Sello en Fuelle (Tipo 4-1 / Tipo 1-1) |

### Subsección: Dimensiones POUCH

| # | Campo | Tipo | Obligatorio | Editable | Catálogo | Descripción |
|---|-------|------|-------------|----------|----------|-------------|
| 37 | Ancho | Número | ✓ | ✓ | - | Rango dinámico según FDP |
| 38 | Largo | Número | ✓ | ✓ | - | Rango dinámico según FDP |
| 39 | Ancho Fuelle | Número | ✓ | ✓ | - | Rango dinámico según FDP |
| 40 | Doy Pack Base | Select | ✓* | ✓ | Hardcoded | Si doy_pack=Sí (Redondo/Cuadrado) |

### Subsección: Especificaciones Sello Central (Condicional)

| # | Campo | Tipo | Obligatorio | Editable | Catálogo | Descripción |
|---|-------|------|-------------|----------|----------|-------------|
| 41 | Ancho Pouch (Sello Central) | Número | ✓* | ✓ | - | Si familia=Sello Central |
| 42 | Largo Pouch (Sello Central) | Número | ✓* | ✓ | - | Si familia=Sello Central |
| 43 | Ancho Fuelle Cerrado | Número | ✓** | ✓ | - | Si tiene_fuelle=Sí |
| 44 | Ancho Sello Aleta | Select | ✓* | ✓ | Hardcoded | Si familia=Sello Central, Aleta (10/12/15 mm) |
| 45 | Ancho Sello Transversal | Número | ✓** | ✓ | - | Si material=PE-PE/PE |
| 46 | Microperforado Aleta | Select | ✗ | ✓ | Sí/No | Si familia=Sello Central, material=PE-PE/PE |
| 47 | Lado Aleta | Select | ✓* | ✓ | Hardcoded | Si microperforado_aleta=Sí (Derecho/Izquierdo) |
| 48 | Tipo Microperforado | Select | ✓* | ✓ | Hardcoded | Si microperforado_aleta=Sí (Total/Parcial) |
| 49 | Separación Puas Aleta | Select | ✓* | ✓ | Hardcoded | Si microperforado_aleta=Sí (3 opciones) |
| 50 | Distancia Lado Aleta | Número | ✓* | ✓ | - | Si microperforado_aleta=Sí |

### Subsección: Especificaciones Sello Fuelle (Condicional)

| # | Campo | Tipo | Obligatorio | Editable | Catálogo | Descripción |
|---|-------|------|-------------|----------|----------|-------------|
| 51 | Ancho Pouch (Sello Fuelle) | Número | ✓* | ✓ | - | Si familia=Sello en Fuelle |
| 52 | Largo Pouch (Sello Fuelle) | Número | ✓* | ✓ | - | Si familia=Sello en Fuelle |
| 53 | Ancho Fuelle (Sello Fuelle) | Número | ✓* | ✓ | - | Si familia=Sello en Fuelle |
| 54 | Ancho Sello Lateral | Select | ✓* | ✓ | Hardcoded | Si sello_fuelle=Tipo 4-1 (10 mm) |
| 55 | Ancho Total Calculado | Número | Auto | ✗ | - | Auto-calculado |
| 56 | Perímetro Calculado | Número | Auto | ✗ | - | Auto-calculado |

### Subsección: Especificaciones Pouch Plano (Condicional)

| # | Campo | Tipo | Obligatorio | Editable | Catálogo | Descripción |
|---|-------|------|-------------|----------|----------|-------------|
| 57 | Ancho Sello (Plano) | Número | ✓* | ✓ | - | Si familia=Plano |
| 58 | Ancho Sello Transversal (Plano) | Número | ✓* | ✓ | - | Si familia=Plano |
| 59 | Ancho Sello Lateral (Plano) | Número | ✓** | ✓ | - | Si cantidad_sellos=Tres sellos |

### Subsección: Estructura Base (Común)

| # | Campo | Tipo | Obligatorio | Editable | Catálogo | Descripción |
|---|-------|------|-------------|----------|----------|-------------|
| 60 | ¿Estructura Referencia? | Select | ✓ | ✓ | Sí/No | Carga E/M o nueva |
| 61 | E/M Referencia | Texto | ✓* | ✓ | - | Si estructura_referencia=Sí |
| 62 | Tipo Estructura | Select | ✓ | ✗ | structure_type | Mono/Bilam/Trilam/Tetra (heredado) |
| 63 | Materiales Capas 1-4 | Tabla | ✓** | ✓* | 405 SI Validadas | Dinámico según Tipo Estructura |
| 64 | ¿Solicitud Muestra? | Select | ✓ | ✓ | Sí/No | - |
| 65 | Especificación Técnica Cliente | File | ✓* | ✓ | - | Si tiene_espectec_cliente=Sí |
| 66 | Barniz Mate | Checkbox | ✗ | ✓ | - | Acabado adicional |
| 67 | Barniz de Protección | Checkbox | ✗ | ✓ | - | Si Monocapa (solo Monocapa) |

---

## PASO 3: EMBALAJE Y EMPALMES

| # | Campo | Tipo | Obligatorio | Editable | Catálogo | Descripción |
|---|-------|------|-------------|----------|----------|-------------|
| 68 | Embalaje Material | Select | ✓ | ✓ | MATERIAL_PACKAGING | Cajas/Pallets/Bobinas |
| 69 | Embalaje Material Especial | Textarea | ✗ | ✓ | - | Condiciones especiales |
| 70 | Embalaje Exportación | Select | ✓ | ✓ | EXPORT_PACKAGING | - |
| 71 | Empalmes | Select | ✓ | ✓ | SPLICES_CATALOG | Tipos de empalmes |

---

## ACCESORIOS CONSUMIBLES (Parte de Paso 2)

Máximo 3 accesorios simultáneos en POUCH.

| Accesorio | Campos Asociados | Condicional |
|-----------|-----------------|------------|
| **Zipper** | Tipo Zipper | Depende de selección |
| **Tin-Tie** | — | Simple checkbox |
| **Válvula** | Tipo Válvula, Distancia boca-válvula | Depende de selección |

---

## ACCESORIOS PRODUCTO (Parte de Paso 2)

| Accesorio | Campos Asociados | Condicional |
|-----------|-----------------|------------|
| **Asa Troquelada** | Tipo Asa, Color Asa, Forma Asa | Depende de selección |
| **Refuerzo** | Espesor, Ancho | Depende de selección |

---

## ACCESORIOS INTERNOS (Parte de Paso 2)

Máximo 3 accesorios simultáneos en POUCH (excluyen especificaciones de sello).

| Accesorio | Campos Asociados | Condicional |
|-----------|-----------------|------------|
| **Corte Angular** | Lado Corte Angular | Depende de selección |
| **Esquinas Redondas** | Tipo Esquinas Redondas | Depende de selección |
| **Muesca** | — | Simple checkbox |
| **Perforación** | Tipo Perforación, Ubicación, Distancia | Depende de selección |
| **Pre-Corte** | Tipo Pre-Corte, Precorte Fuelle A10mm | Depende de selección |

---

## RESTRICCIONES POR FAMILIA POUCH

### POUCH - Stand Up

#### Sello K
- **Campos específicos:** Ninguno adicional
- **Dimensiones:** Ancho, Largo, Ancho Fuelle (todos obligatorios)
- **Accesorios:** Todos permitidos

#### Normal
- **Campos específicos:** Ninguno adicional
- **Dimensiones:** Ancho, Largo, Ancho Fuelle (todos obligatorios)
- **Accesorios:** Todos permitidos

#### Doy Pack
- **Campos específicos:** Tipo Fuelle (Propio/Insertado), Base Doy Pack (Redondo/Cuadrado)
- **Dimensiones:** Ancho, Largo, Ancho Fuelle (todos obligatorios)
- **Restricciones Ancho/Largo:** Rango específico para Doy Pack (80-230mm × 134-340mm)
- **Accesorios:** Todos permitidos

### POUCH - Plano

- **Campos específicos:** Cantidad Sellos (Dos/Tres), Ancho Sello + Ancho Transversal (Obligatorios)
- **Ancho Sello Lateral:** Solo si Cantidad=Tres sellos
- **Accesorios Consumibles:** Zipper (con distancia), Notch (con distancia), Perforación (con distancia)
- **Accesorios Internos:** Todos permitidos

### POUCH - Sello Central

#### Material PE-PE/PE
- **Campos específicos:** Ancho Sello Transversal, Microperforado (Sí/No)
- **Si Microperforado=Sí:** Lado, Tipo, Separación Puas, Distancia Lado
- **¿Fuelle?:** SÍ/NO → Ancho Fuelle Cerrado si SÍ
- **Accesorios:** Todos permitidos

#### Material Aleta
- **Campos específicos:** Ancho Sello Aleta (10/12/15 mm)
- **¿Fuelle?:** SÍ/NO
- **Accesorios:** Zipper, Tin-Tie (Consumibles)

#### Material Otro
- **Campos limitados:** Solo dimensiones
- **Accesorios:** Limitados

### POUCH - Sello en Fuelle

#### Tipo 4-1
- **Campos específicos:** Ancho Sello Lateral (10 mm), Ancho Total, Perímetro (auto-calculados)
- **Dimensiones:** Ancho, Largo, Ancho Fuelle (obligatorios)
- **Accesorios:** Consumibles (Zipper, Tin-Tie, Valve)

#### Tipo 1-1
- **Campos específicos:** Ancho Sello Lateral (10 mm)
- **Dimensiones:** Ancho, Largo, Ancho Fuelle (obligatorios)
- **Accesorios:** Consumibles

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
| Auto | Auto-calculado por sistema |
| SI VALIDADA | Solo materiales con estado VALIDADA del Sistema Integral |

---

## DIFERENCIAS POUCH vs LÁMINA vs BOLSA

| Aspecto | LÁMINA | BOLSA | POUCH |
|--------|--------|-------|-------|
| Paso 1.5 (Sentido Embobinado) | ✓ SÍ | ✗ NO | ✗ NO |
| Fotoregistro | ✓ SÍ | ✗ NO | ✗ NO |
| Core (Diámetro, etc.) | ✓ SÍ | ✗ NO | ✗ NO |
| Familias Formato | 3 simples | 3 complejas | 4 muy complejas |
| Accesorios máximo | Ilimitados | 3 máx | 3 máx |
| Especificaciones Sello | ✗ NO | ✗ NO | ✓ SÍ (dinámico) |
| Wicket | ✗ NO | ✓ SÍ | ✗ NO |
| Doy Pack | ✗ NO | ✗ NO | ✓ SÍ (con restricciones) |
| Microperforado | ✗ NO | ✗ NO | ✓ SÍ (Sello Central) |

---

## PUNTOS CRÍTICOS DE VALIDACIÓN

1. **Familia de Pouch** → Determina campos de Formato visibles y obligatorios
2. **Tipo Stand Up** → Si Stand Up, valida Tipo Fuelle (Doy Pack) y Base
3. **Cantidad Sellos** → Si Plano, número de sellos determina campos de Sello
4. **Material Sello Central** → Determina campos (PE-PE/PE vs Aleta vs Otro)
5. **¿Fuelle?** → Habilita campos de especificaciones (Sello Central/Plano)
6. **Tipo Sello Fuelle** → Tipo 4-1 vs Tipo 1-1 con campos diferentes
7. **Accesorios limitados** → Máximo 3 simultáneos (contador visible)
8. **Estructura Referencia** → Bloquea edición de Tipo Estructura si heredado
9. **Clasificación Modificado** → Read-only Nombre, Volumen, Unidad
10. **Rango Doy Pack** → Ancho 80-230mm, Largo 134-340mm (restricción específica)

---

**Documento completo v1.0 | 2026-08-10**
