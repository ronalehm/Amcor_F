# TABLA DE CAMPOS LÁMINA POR SECCIONES

**Versión:** 2.0 (CORREGIDA)  
**Producto:** LÁMINA  
**Scope:** Campos visualizados en UI ProductEditPage  
**Nota:** Basado en lectura de código fuente real

---

## PASO 0: INFORMACIÓN PRODUCTO

### Subsección: Clasificación y Modificación

| # | Campo | Obligatorio | Editable | Catálogo | Tipo |
|---|-------|-----------|----------|----------|------|
| 1 | Clasificación | ✓ | ✓ | ODISEO | Select (Nuevo/Modificado) |
| 2 | Modificación (MOT) | ✓ | ✓ | ODISEO | Checkboxes (dinámicos) |

### Subsección: Información del Producto

| # | Campo | Obligatorio | Editable | Catálogo | Tipo |
|---|-------|-----------|----------|----------|------|
| 3 | Nombre del Producto | ✓ | ✓/🔒* | Ninguno | Texto |
| 4 | Volumen Referencial | ✓ | ✓/🔒* | Ninguno | Número |
| 5 | Unidad | ✓ | ✓/🔒* | ODISEO | Select (UDM) |
| 6 | Descripción breve de la necesidad | ✓ | ✓ | Ninguno | Textarea |

### Subsección: Información Salesforce

| # | Campo | Obligatorio | Editable | Catálogo | Tipo |
|---|-------|-----------|----------|----------|------|
| 7 | **Acción Salesforce** | ✗ | ✓ | Ninguno | Texto (A-XXXXXX) |
| 8 | **Código RFQ** | ✗ | ✓ | Ninguno | Texto |

### Subsección: Especificaciones Técnicas

| # | Campo | Obligatorio | Editable | Catálogo | Tipo |
|---|-------|-----------|----------|----------|------|
| 9 | Aplicación Técnica | ✓ | ✓ | ODISEO | Select |
| 10 | Código de Empaque del Cliente | ✗ | ✓ | Ninguno | Texto |
| 11 | Comentarios | ✗ | ✓ | Ninguno | Textarea |

**Total Paso 0:** 11 campos | Obligatorios: 6 | Opcionales: 5 | Catálogos ODISEO: 3

---

## PASO 1: ESPECIFICACIONES DE DISEÑO (Sección 2)

### Subsección: Diseño de Referencia

| # | Campo | Obligatorio | Editable | Catálogo | Tipo | Condición |
|---|-------|-----------|----------|----------|------|-----------|
| 12 | ¿Tiene Diseño de referencia? | ✓ | ✓ | Ninguno | Select (Sí/No) | Siempre |
| 13 | EDAG Referencia | ✓* | ✓* | Ninguno | Texto (NNNNN-NN) | Si Ref=Sí |
| 14 | Botón Consultar SI | - | - | SI | Acción | Si Ref=Sí |

### Subsección: Impresión

| # | Campo | Obligatorio | Editable | Catálogo | Tipo | Condición |
|---|-------|-----------|----------|----------|------|-----------|
| 15 | Impresión (Clase) | ✓ | ✓ | ODISEO | Select | Siempre |
| 16 | Tipo de Impresión | ✓* | ✓* | ODISEO | Select | Si Print ≠ Sin Impr |
| 17 | Forma de Impresión | ✓* | ✓* | ODISEO | Select | Si Print ≠ Sin Impr |

### Subsección: Especificaciones Especiales

| # | Campo | Obligatorio | Editable | Catálogo | Tipo | Condición |
|---|-------|-----------|----------|----------|------|-----------|
| 18 | Especificaciones Especiales | ✗ | ✓ | Ninguno | Select | Si Print ≠ Sin Impr |
| 19 | Comentarios Diseños Especiales | ✗ | ✓ | Ninguno | Textarea | Si Especif=Otros |

### Subsección: Información Técnica de Diseño

| # | Campo | Obligatorio | Editable | Catálogo | Tipo | Condición |
|---|-------|-----------|----------|----------|------|-----------|
| 20 | Objetivo de color | ✗ | ✓ | Ninguno | Select | Siempre |
| 21 | Objetivo de color - otro | ✗ | ✓ | Ninguno | Texto | Si Objetivo=Otros |
| 22 | Aprobador de prensa | ✗ | ✓ | Ninguno | Select | Siempre |
| 23 | Código de referencia (ALUSA) | ✗ | ✓ | Ninguno | Texto | Siempre |
| 24 | Instrucciones de trabajo para diseño | ✗ | ✓ | Ninguno | Textarea | Siempre |

### Subsección: Carga de Planos de Diseño

| # | Campo | Obligatorio | Editable | Catálogo | Tipo | Condición |
|---|-------|-----------|----------|----------|------|-----------|
| 25 | ¿Tiene plano de diseño? | ✓ | ✓ | Ninguno | Select (Sí/No) | Siempre |
| 26 | Tipo de plano | ✓* | ✓* | Ninguno | Select | Si Plano=Sí |
| 27 | Archivos de plano | ✓* | ✓* | Ninguno | Upload | Si Plano=Sí |
| 28 | Comentarios de plano | ✗ | ✓ | Ninguno | Textarea | Si Plano=Sí |

**Total Paso 1:** 17 campos | Obligatorios: 3 (+ 4 condicionales) | Catálogos ODISEO: 3

---

## PASO 1.5: SENTIDO DE EMBOBINADO (LÁMINA EXCLUSIVE)

| # | Campo | Obligatorio | Editable | Catálogo | Tipo | Notas |
|---|-------|-----------|----------|----------|------|-------|
| 29 | Sentido de Embobinado | ✗ | ✓ | ODISEO | Selector Visual | Solo LÁMINA |
| 30 | Referencia de sentido | ✗ | ✓ | Ninguno | Texto | Descriptivo |

**Total Paso 1.5:** 2 campos | Opcionales: 2 | LÁMINA EXCLUSIVE: Sí

---

## PASO 2: INFORMACIÓN TÉCNICA DE ESTRUCTURA (Sección 3)

### Subsección: Especificaciones de Estructura

| # | Campo | Obligatorio | Editable | Catálogo | Tipo | Condición |
|---|-------|-----------|----------|----------|------|-----------|
| 31 | ¿Tiene estructura de referencia? | ✗ | ✓ | Ninguno | Select (Sí/No) | Siempre |
| 32 | E/M Referencia | ✗* | ✓* | Ninguno | Texto (NNNNN-NN) | Si Ref=Sí |
| 33 | Botón Consultar SI | - | - | SI | Acción | Si Ref=Sí |

**Total Paso 2 (Estructura):** 3 campos base + componentes dinámicos | Opcionales: 3

---

## PASO 3: EMBALAJE Y EMPALMES (Sección 4)

| # | Campo | Obligatorio | Editable | Catálogo | Tipo | Notas |
|---|-------|-----------|----------|----------|------|-------|
| 34 | Embalaje de material | ✗ | ✓ | ODISEO | Select | Material packaging |
| 35 | Embalaje de Productos de Exportación | ✗ | ✓ | ODISEO | Select | Export packaging |
| 36 | Embalaje de material especial | ✗ | ✓ | Ninguno | Textarea | Condiciones especiales |
| 37 | Empalmes | ✗ | ✓ | ODISEO | Select | Splices catalog |

**Total Paso 3:** 4 campos | Opcionales: 4 | Catálogos ODISEO: 3

**Nota:** Las dimensiones específicas (Ancho, Repetición, Fotoregistro) se manejan en componentes dinámicos según el tipo de envoltura seleccionado.

---

## SECCIÓN 3: ESTRUCTURA

| # | Campo | Obligatorio | Editable | Catálogo | Tipo | Condición/Nota |
|---|-------|-----------|----------|----------|------|-----------------|
| 17 | Tipo Estructura | ✓ | ✓/🔒* | ODISEO | Select | Si MOD: Read-only |
| 18 | Material Capa 1 | ✓ | ✓/🔒* | SI | Select | Siempre VALIDADA |
| 19 | Material Capa 2 | ✓+ | ✓/🔒* | SI | Select | Si Bilam+, VALIDADA |
| 20 | Material Capa 3 | ✓+ | ✓/🔒* | SI | Select | Si Trilam+, VALIDADA |
| 21 | Material Capa 4 | ✓+ | ✓/🔒* | SI | Select | Si Tetra, VALIDADA |
| 22 | Micrones Totales | ✓ | ✗ | Ninguno | Badge | Auto-calculado SI |
| 23 | Combinación 405 | ✓ | ✗ | SI | Badge | Validada/Pendiente |
| 24 | Grammage | ✓ | ✗ | Ninguno | Número | Auto-calculado ±10% |

**Total Sección 3:** 8 campos | Obligatorios: 1 (+ 3 condicionales) | Read-only si MOD: 1+4 | Catálogos SI: 5

**Notas:**
- `✓/🔒*` = Editable si PRODUCTO NUEVO, Read-only si PRODUCTO MODIFICADO
- `✓+` = Obligatorio condicional según Tipo Estructura
- Capas se ocultan según Tipo (Mono: solo 1, Bilam: 1-2, Trilam: 1-3, Tetra: 1-4)

---

## SECCIÓN 4: EMBALAJES Y EMPALMES

| # | Campo | Obligatorio | Editable | Catálogo | Tipo | LÁMINA Exclusive |
|---|-------|-----------|----------|----------|------|-----------------|
| 25 | Tipo Formato | ✓ | ✓ | ODISEO | Select | No |
| 26 | Ancho LÁMINA | ✓ | ✓ | Ninguno | Número (100-20k mm) | No |
| 27 | Repetición | ✓ | ✓ | Ninguno | Número (100-20k mm) | No |
| 28 | Acabado | ✓ | ✓ | ODISEO | Select | No |
| 29 | Embobinado | ✓ | ✓ | ODISEO | Select | Sí (solo LÁMINA) |
| 30 | Material Core | ✗ | ✓ | ODISEO | Select | No |
| 31 | Perforación Aire | ✗ | ✓ | ODISEO | Radio | No |
| 32 | Fotocélula | ✗ | ✓ | ODISEO | Radio | No |
| 33 | Pre-corte | ✗ | ✓ | ODISEO | Radio | No |
| 34 | **Fotoregistro** | ✗ | ✓ | Ninguno | Radio (Sí/No) | **SÍ (MAX 1)** |
| 35 | Tipo FR | ✓*** | ✓*** | ODISEO | Select | **SÍ (Si FR=Sí)** |
| 36 | Ubicación FR | ✓*** | ✓*** | Ninguno | Número (50-[Ancho-50]) | **SÍ (Si FR=Sí, dinámico)** |
| 37 | Margen FR | ✓*** | ✓*** | Ninguno | Número (5-50 mm) | **SÍ (Si FR=Sí)** |

**Total Sección 4:** 13 campos | Obligatorios: 6 (+ 3 condicionales FR) | LÁMINA Exclusive: 5 | Catálogos ODISEO: 7

**Notas:**
- `✗ GRIS` = Oculto/Deshabilitado si Clase Impresión = Sin Impresión
- `✓***` = Obligatorio condicional (si Fotoregistro = Sí)
- Fotoregistro es **LÁMINA EXCLUSIVE** - oculto para BOLSA/POUCH
- Rango Ubicación FR es **DINÁMICO**: se recalcula cuando Ancho cambia

---

## RESUMEN CONSOLIDADO

| Paso/Sección | Nombre | Total Campos | Obligatorios | Condicionales | Optionales | Catálogos |
|---|---|---|---|---|---|---|
| Paso 0 | Información Producto | 11 | 6 | 0 | 5 | ODISEO: 3 |
| Paso 1 | Especificaciones Diseño | 17 | 3 | 4 | 10 | ODISEO: 3 |
| Paso 1.5 | Sentido Embobinado | 2 | 0 | 0 | 2 | ODISEO: 1 |
| Paso 2 | Estructura | 3 | 0 | 0 | 3 | Ninguno |
| Paso 3 | Embalaje y Empalmes | 4 | 0 | 0 | 4 | ODISEO: 3 |
| **TOTAL LAMINA** | **Campos Visualizados** | **37** | **9** | **4** | **24** | **ODISEO: 10** |

**Notas:**
- Campos Obligatorios: 9 (base) + condicionales según selecciones
- Campos Editables: Base 37 - Algunos grises si condiciones no cumplen
- Campos LÁMINA Exclusive: Sentido de Embobinado (Paso 1.5)
- Campos SI: Botones de Consultar (en Diseño y Estructura)

---

## LEYENDA

| Símbolo | Significado |
|---------|-----------|
| ✓ | Obligatorio siempre |
| ✓* | Obligatorio condicional |
| ✓*** | Obligatorio condicional (Si Fotoregistro = Sí) |
| ✗ | Opcional |
| 🔒 | Read-only si PRODUCTO MODIFICADO |
| Auto | Auto-calculado (no editable) |
| ODISEO | Catálogo editable (ODISEO local) |
| SI | Catálogo Sistema Integral (180+ materiales validados) |
| Dinámico | Rango cambia según otro campo |

---

## RESTRICCIONES ESPECIALES POR SECCIÓN

### Paso 0: INFORMACIÓN PRODUCTO
- **Nombre del Producto:** Min 5 caracteres
- **Clasificación:** Producto Nuevo o Modificado (no se puede cambiar post-creación)
- **Modificación:** Checkboxes dinámicos según clasificación seleccionada
- **Nombre/Volumen/Unidad:** Si Producto Modificado → READ-ONLY 🔒
- **Acción Salesforce:** Formato A-XXXXXX (normalizado)
- **Código RFQ:** Opcional, ejemplo RFQ-2024-001
- **Aplicación Técnica:** Select de 45+ opciones técnicas

### Paso 1: ESPECIFICACIONES DE DISEÑO
- **Diseño de Referencia:**
  - Si "Sí" → EDAG Referencia OBLIGATORIO + Botón "Consultar SI"
  - Si "No" → Nuevo diseño (no se carga EDAG)
- **Impresión (Clase):**
  - Si "Sin Impresión" → Tipo, Forma, Especiales → GRISES (deshabilitados)
  - Si "Flexografía" o "Hueco" → Tipo, Forma → OBLIGATORIOS
- **Objetivo de Color:**
  - Si = "Otros" → Campo "Objetivo de color - otro" VISIBLE y OBLIGATORIO
- **Carga de Planos:**
  - Si "¿Tiene plano?" = "Sí" → Tipo plano y Archivos OBLIGATORIOS
  - Si "¿Tiene plano?" = "No" → Todos los campos de plano se auto-limpian

### Paso 1.5: SENTIDO DE EMBOBINADO
- **LÁMINA EXCLUSIVE:** Solo visible para envoltura tipo LÁMINA
- **Sentido Embobinado:** Selector visual (sin catálogo hardcoded)
- **Referencia de Sentido:** Texto descriptivo (opcional)
- **Oculto para:** BOLSA y POUCH

### Paso 2: INFORMACIÓN TÉCNICA DE ESTRUCTURA
- **Estructura de Referencia:**
  - Si "Sí" → E/M Referencia OPCIONAL + Botón "Consultar SI"
  - Si "No" → Campo oculto
- **Nota:** Componentes dinámicos (LaminaStructureTable, etc.) se renderizan según envoltura

### Paso 3: EMBALAJE Y EMPALMES
- **Embalaje de material:** Select de catálogo (MATERIAL_PACKAGING_CATALOG)
- **Embalaje de Exportación:** Select de catálogo (EXPORT_PACKAGING_CATALOG)
- **Embalaje especial:** Textarea libre para condiciones especiales
- **Empalmes:** Select de catálogo (SPLICES_CATALOG)
- **Nota:** Estos campos son universales (no LÁMINA exclusive)

---

## CAMPOS LÁMINA EXCLUSIVE vs OTROS FORMATOS

### En Paso 1.5: Sentido de Embobinado

| Campo | LÁMINA | BOLSA | POUCH | Notas |
|-------|--------|-------|-------|-------|
| **Sentido de Embobinado** | ✓ Visible | ✗ Oculto | ✗ Oculto | Selector visual de embobinado |
| **Referencia de Sentido** | ✓ Visible | ✗ Oculto | ✗ Oculto | Descripción del sentido |

### En Paso 2: Estructura (componentes dinámicos)

| Componente | LÁMINA | BOLSA | POUCH | Implementación |
|---|---|---|---|---|
| **LaminaStructureTable** | ✓ Visible | ✗ Oculto | ✗ Oculto | Mono/Bilam/Trilam/Tetra |
| **PouchBolsaStructureTable** | ✗ Oculto | ✓ Visible | ✓ Visible | Estructura específica por formato |
| **PhotoregisterAccordion** | ✓ MAX 1 | ✗ Oculto | ✗ Oculto | LÁMINA EXCLUSIVE |
| **CalculatedMeasuresAccordion** | ✓ Visible | ✓ Visible | ✓ Visible | Micrones y Grammage calculados |

### Notas sobre LÁMINA:
- **Embobinado:** Selector visual (no select de catálogo), solo en LÁMINA
- **Fotoregistro:** Máximo 1 por LÁMINA, completamente oculto en BOLSA/POUCH
- **Estructura:** UI completamente diferente (LaminaStructureTable vs PouchBolsaStructureTable)
- **Dimensiones:** Se manejan en componentes dinámicos (no en tabla estática)

---

*Tabla definitiva de campos LÁMINA por secciones visualizadas en UI | v1.0*
