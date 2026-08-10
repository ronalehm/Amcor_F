# 📋 Lineamiento: Catálogos Sistema Integral vs ODISEO

**Versión:** 1.0  
**Fecha:** 2026-08-10  
**Impacto:** CRÍTICO - Determina arquitectura de sincronización y permisos  

---

## 🔴 CATÁLOGOS SISTEMA INTEGRAL (SI) - 6 Campos

Estos campos **VIENEN DEL SISTEMA INTEGRAL** y son **OBLIGATORIOS en algunos casos**:

| # | Campo | Tipo | Obligatorio | Módulo | Fuente |
|---|-------|------|:---:|---------|--------|
| 1️⃣ | **Aplicación Técnica** | Select | ✅ **OBLIGATORIO** | Paso 0 (Producto) | TECHNICAL_APPLICATION_CATALOG |
| 2️⃣ | **Forma de Impresión** | Select | ⚠️ Condicional | Paso 1 (Diseño) | PRODUCT_CATALOGS.formaDeImpresion |
| 3️⃣ | **Embalaje de material** | Select | ❌ OPCIONAL | Paso 3 (Embalaje) | MATERIAL_PACKAGING_CATALOG |
| 4️⃣ | **Embalaje de Productos de Exportación** | Select | ❌ OPCIONAL | Paso 3 (Embalaje) | EXPORT_PACKAGING_CATALOG |
| 5️⃣ | **Empalmes** | Select | ❌ OPCIONAL | Paso 3 (Embalaje) | SPLICES_CATALOG |
| 6️⃣ | **Material del Core** | Select | ❌ OPCIONAL | Paso 2 (Estructura) | coreMaterialOpt |

---

## 🟢 CATÁLOGOS ODISEO - TODO LO DEMÁS

Todos los demás campos/catálogos son **GESTIONADOS EN ODISEO**:

### Paso 0: Producto
- Clasificación (Producto Nuevo / Modificado)
- Modificación (MOT - Motivos de Modificación)
- Nombre del Producto
- Descripción
- Volumen Estimado
- Unidad de Medida
- Ejecutivo Comercial
- Portafolio Base
- Tipo de Proyecto
- Acción Salesforce
- Código RFQ
- Información Adicional Cliente
- Dirección de Entrega
- Comentario del Ejecutivo

### Paso 1: Diseño
- **Formato de Plano** (Genera según tipoFormatoPouch, tipoFormatoBolsa, tipoFormatoLamina)
- Clase de Impresión
- Tipo de Impresión
- Especificaciones Especiales
- Objetivo de Color
- Aprobador de Prensa
- Código de Referencia ALUSA
- Instrucciones de Trabajo
- Diseño de Referencia (EDAG)
- Plano de Diseño
- **Sentido de Bobinado** (8 opciones)
- **Datos de Fotoregistro** (FR1 y FR2 - SOLO LÁMINA)
- Configuración de Formato POUCH:
  - Familia de Pouch
  - Tipo de Stand Up
  - Doy Pack (Base y Fuelle)
  - Cantidad de Sellos
  - Material Sello Central
  - Tipo Sello en Fuelle
- Configuración de Formato BOLSA:
  - Tipo de Presentación
  - Tipo de Sello
  - Acabado
  - ¿Tiene Fuelle?
- Configuración de Formato LÁMINA:
  - Tipo de Lámina
- Dimensiones (width, length, repetition, anchoFuelle)
- Especificaciones de Sello
- Accesorios Consumibles (Zipper, Tin-Tie, Valve)
- Accesorios Internos (Corte Angular, Esquinas, Muesca, Perforación, Pre-Corte)
- Accesorios Producto (Asa, Refuerzo)

### Paso 2: Estructura
- Estructura de Referencia (E/M)
- Tipo de Estructura (Monocapa, Bilaminado, etc.)
- Solicitud de Muestra
- Materiales y Especificaciones (Capas 1-4)
- Especificaciones Técnicas de Estructura
- Especificación Técnica del Cliente
- **Core (Diámetro, Variación, Peso)** - Solo campos SI es Material del Core
- Barnices (Mate, Protección)

### Paso 3: Embalaje
- **Embalaje Especial**
- **Embalaje de Material Especial**

### Información Comercial
- Tipo de Venta
- Incoterm
- País de Destino
- Precio Objetivo
- Tipo de Moneda

---

## 🔄 Flujo de Sincronización

### Lectura (LOAD)
```
1. Usuario abre ProductEditPage
   ↓
2. getProjectByCode() retorna registro local (ODISEO)
   ↓
3. Para campos SI (6 catálogos):
   - Mostrar valor guardado localmente
   - Si necesario, sincronizar con SI para validar
   ↓
4. Para campos ODISEO (TODO LO DEMÁS):
   - Mostrar valor guardado localmente
```

### Escritura (SAVE)
```
1. Usuario modifica campos en ProductEditPage
   ↓
2. updateField() actualiza estado local (form)
   ↓
3. handleSubmit() → updateProjectRecord()
   ↓
4. Para campos SI:
   - Guardar localmente
   - **IMPORTANTE:** Si es Producto Nuevo, enviar a SI
   - Si es Producto Modificado, NO enviar a SI (hereda del base)
   ↓
5. Para campos ODISEO:
   - Guardar localmente
   - No sincronizar con SI
```

---

## 📊 Matriz de Responsabilidad

| Campo | Gestión | Sincronización | Permisos | Validación |
|-------|---------|---|----------|-----------|
| **Aplicación Técnica** | SI | ✅ Lee SI, guarda local | Según rol | Catálogo SI |
| **Forma de Impresión** | SI | ✅ Lee SI, guarda local | Según rol | Catálogo SI |
| **Embalaje Material** | SI | ✅ Lee SI, guarda local | Según rol | Catálogo SI |
| **Embalaje Exportación** | SI | ✅ Lee SI, guarda local | Según rol | Catálogo SI |
| **Empalmes** | SI | ✅ Lee SI, guarda local | Según rol | Catálogo SI |
| **Material Core** | SI | ✅ Lee SI, guarda local | Según rol | Catálogo SI |
| **TODO LO DEMÁS** | ODISEO | ❌ NO sincroniza | Según MOT | Local |

---

## 🎯 Implicaciones en el Código

### ProductEditPage.tsx

#### 1. Inicialización de Catálogos

```typescript
// CATÁLOGOS SI - Se cargan desde mockDatabase
import {
  TECHNICAL_APPLICATION_CATALOG,
  MATERIAL_PACKAGING_CATALOG,
  EXPORT_PACKAGING_CATALOG,
  SPLICES_CATALOG
} from "../../../shared/data/mockDatabase";

// CATÁLOGOS ODISEO - Se cargan desde productCatalogs
import { PRODUCT_CATALOGS } from "../../../shared/data/productCatalogs";

// CATÁLOGOS ODISEO ESPECÍFICOS - Se cargan de otros módulos
import { getActiveUnitMeasureOptions } from "../../../shared/data/unitMeasureCatalog";
import { getActiveMaterialGroupOptions } from "../../../shared/data/productMaterialCatalog";
```

#### 2. Renderizado de Campos

```typescript
// CAMPO SI - Aplicación Técnica (OBLIGATORIO)
<FormSelect
  label="Aplicación Técnica *"
  value={form.technicalApplication || ""}
  onChange={(value) => updateField("technicalApplication", value)}
  options={TECHNICAL_APPLICATION_CATALOG.map((item) => ({
    value: item.code,
    label: item.name,
  }))}
  placeholder="-- Seleccione --"
  disabled={!canEdit}  // Permisos según MOT
  error={getError("technicalApplication")}
/>

// CAMPO ODISEO - Clasificación
<FormSelect
  label="Clasificación *"
  value={form.classification}
  onChange={(value) => {
    updateField("classification", value);
    updateField("projectType", "");
  }}
  options={classificationOpt}
  placeholder="-- Seleccione --"
  // NO hay sincronización con SI
  error={getError("classification")}
/>
```

#### 3. Validaciones

```typescript
// VALIDACIÓN CAMPO SI
if (!form.technicalApplication) {
  errors.technicalApplication = "Aplicación Técnica es obligatoria";
}

// VALIDACIÓN CAMPO ODISEO
if (!form.classification) {
  errors.classification = "Clasificación es obligatoria";
}
```

#### 4. Persistencia

```typescript
// En handleSubmit → updateProjectRecord()

// CAMPO SI - Se guarda localmente
technicalApplication: (project as any).technicalApplication || "",

// CAMPO ODISEO - Se guarda localmente
classification: form.classification,
projectType: form.projectType,
```

---

## ⚠️ Casos Especiales

### Caso 1: Producto Nuevo
```
- Todos los campos SI se pueden editar (6 catálogos)
- Todos los campos ODISEO se pueden editar
- Al guardar: enviar TODOS los datos (SI + ODISEO) a updateProjectRecord()
```

### Caso 2: Producto Modificado
```
- Campos SI: HEREDADOS del producto base (no editable)
- Campos ODISEO: depende del MOT
- Al guardar: enviar solo campos ODISEO editables a updateProjectRecord()
```

### Caso 3: Nueva Estructura (MOT)
```
- Campos SI: SI son editables (porque es esencialmente "Producto Nuevo")
- Campos ODISEO: SI son editables
- Al guardar: enviar TODOS
```

### Caso 4: Misma Estructura (MOT)
```
- Campos SI: NO son editables (heredados)
- Campos ODISEO: NO son editables (excepto comentarios)
- Al guardar: enviar solo comentarios
```

---

## 📝 Checklist de Implementación

### En ProductEditPage.tsx

- [ ] Identificar los 6 campos SI
- [ ] Marcar como "Campo SI" en badges (opcional, para transparencia)
- [ ] Implementar lógica de deshabilitación según MOT y tipo de producto
- [ ] Para Producto Modificado: heredar valores SI del producto base
- [ ] Validaciones específicas por campo SI
- [ ] Persistencia correcta (sin enviar a SI, pero guardar localmente)

### En validationErrors

- [ ] Validaciones para campos SI: usar catálogos SI
- [ ] Validaciones para campos ODISEO: usar catálogos ODISEO
- [ ] Mensajes de error diferenciados (opcional)

### En updateProjectRecord

- [ ] Mapear correctamente los 6 campos SI
- [ ] Mapear correctamente todos los campos ODISEO
- [ ] Incluir conversiones de tipos (string ↔ boolean)
- [ ] Actualizar timestamps

### En Tests

- [ ] Verificar que campos SI se cargan correctamente
- [ ] Verificar que campos SI se guardan correctamente
- [ ] Verificar que campos ODISEO se cargan correctamente
- [ ] Verificar que campos ODISEO se guardan correctamente
- [ ] Verificar herencia de campos SI en Producto Modificado

---

## 📍 Referencias en Código

### Catálogos SI Actuales

```typescript
// 1. TECHNICAL_APPLICATION_CATALOG
// Ubicación: src/shared/data/mockDatabase.ts
// Uso: form.technicalApplication
// Obligatorio: SÍ

// 2. PRODUCT_CATALOGS.formaDeImpresion
// Ubicación: src/shared/data/productCatalogs.ts
// Uso: form.printForm
// Obligatorio: Condicional (si hay impresión)

// 3. MATERIAL_PACKAGING_CATALOG
// Ubicación: src/shared/data/mockDatabase.ts
// Uso: form.materialPackaging
// Obligatorio: NO

// 4. EXPORT_PACKAGING_CATALOG
// Ubicación: src/shared/data/mockDatabase.ts
// Uso: form.exportProductPackaging
// Obligatorio: NO

// 5. SPLICES_CATALOG
// Ubicación: src/shared/data/mockDatabase.ts
// Uso: form.splices
// Obligatorio: NO

// 6. coreMaterialOpt
// Ubicación: productCatalogs.ts
// Uso: form.coreMaterial
// Obligatorio: NO (solo LÁMINA)
```

### Catálogos ODISEO Actuales

- Clasificación (getActiveProductClassificationOptions)
- Modificación/MOT (getActiveModificationOptionsByClassification)
- Unidad de Medida (getActiveUnitMeasureOptions)
- Materiales (getAllMaterialLayerOptions)
- Ejecutivos (getActiveExecutiveRecords)
- Y TODOS los demás

---

## 🎯 Objetivo Final

Cada campo en ProductEditPage debe estar claramente identificado como:
- **[SI]** si viene de catálogos Sistema Integral (6 campos)
- **[ODISEO]** si es gestionado localmente (TODO LO DEMÁS)

Esto afecta:
1. **De dónde viene el catálogo** (SI vs local)
2. **Cómo se valida** (catálogo SI vs catálogo local)
3. **Cómo se persiste** (envío a SI vs guardado local)
4. **Qué permisos aplican** (herencia en Modificado)

---

**Documento de Lineamiento - Crítico para Implementación** ⚠️
