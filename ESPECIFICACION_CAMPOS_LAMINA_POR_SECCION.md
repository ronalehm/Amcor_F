# 📊 ESPECIFICACIÓN DE CAMPOS POR SECCIÓN - LÁMINA

**Documento:** Campos, Obligatoriedad, Visibilidad y Origen  
**Fecha:** 2026-08-10  
**Para:** ProductEditPage - LÁMINA  

---

## TABLA MAESTRA: CAMPOS POR SECCIÓN

### 1️⃣ SECCIÓN: INFORMACIÓN DEL PRODUCTO

| # | Campo | Obligatorio | Visible | Tipo | Origen | Notas |
|---|-------|-----------|---------|------|--------|-------|
| 1.1 | Nombre del Producto | ✓ | ✓ | Texto | N/A | Min 5 caracteres |
| 1.2 | Código de Cliente | ✗ | ✓ | Texto | N/A | Referencia opcional |
| 1.3 | Clasificación | ✓ | ✓ | Select | ODISEO | Producto Nuevo / Modificado |
| 1.4 | Tipo de Proyecto | ✓ | ✓ | Select | ODISEO | Nuevo Equipamiento / Nuevos Insumos / Nueva Estructura |
| 1.5 | Producto Base | ✓* | ✓ | Select | ODISEO | Si Clasificación = Modificado |
| 1.6 | Cliente | ✓ | ✓ | Select | ODISEO | Con búsqueda y filtrado |
| 1.7 | Segmento de Negocio | ✓ | ✓ | Select | ODISEO | Depende de Cliente seleccionado |
| 1.8 | Contacto Principal | ✗ | ✓ | Select | ODISEO | Gerente/Jefe de Planta |
| 1.9 | Planta Origen | ✓ | ✓ | Select | ODISEO | AF Lima / AF Cali / AF Santiago / AF San Luis |
| 1.10 | Moneda | ✓ | ✓ | Select | ODISEO | PEN / USD / EUR |
| 1.11 | Incoterm | ✓ | ✓ | Select | ODISEO | FOB / CIF / DDP / Otros |
| 1.12 | País Destino | ✓ | ✓ | Select | ODISEO | Países América Latina |
| 1.13 | Tipo de Venta | ✓ | ✓ | Select | ODISEO | B2B / B2C / Retail / Distribuidor |
| 1.14 | Código Salesforce | ✓ | ✓ | Texto | N/A | Formato: A-123456 |
| 1.15 | Código RFQ | ✗ | ✓ | Texto | N/A | Formato: RFQ-2024-001 |
| 1.16 | Aplicación Técnica | ✓ | ✓ | Select | ODISEO | Seco / Pastoso / Líquido / Otros (45+ opciones) |
| 1.17 | Código Empaque Cliente | ✗ | ✓ | Texto | N/A | SKU del cliente |
| 1.18 | Comentarios Iniciales | ✗ | ✓ | TextArea | N/A | Max 500 caracteres |

**Total Sección 1: 18 campos (13 obligatorios)**

---

### 2️⃣ SECCIÓN: ESPECIFICACIONES DE DISEÑO

| # | Campo | Obligatorio | Visible | Tipo | Origen | Notas |
|---|-------|-----------|---------|------|--------|-------|
| 2.1 | Clase de Impresión | ✓ | ✓ | Select | ODISEO | Flexografía / Huecograbado / Sin Impresión |
| 2.2 | Tipo de Impresión | ✓** | ✓ | Select | ODISEO | Repetitivo / Continuo (**si Clase ≠ Sin Impr) |
| 2.3 | Forma de Impresión | ✓** | ✓ | Select | ODISEO | Dorso sin Laminado / Dorso con Laminado / Por Superficie |
| 2.4 | ¿Tiene Diseño Referencia? | ✓ | ✓ | Select | ODISEO | Sí / No |
| 2.5 | EDAG Referencia | ✓*** | ✓ | Texto | ODISEO | Formato: NNNNN-NN (***si Referencia=Sí) |
| 2.6 | Botón Cargar EDAG | ✗ | ✓ | Button | N/A | Carga propiedades automáticamente |
| 2.7 | Especificaciones Diseño Especiales | ✗ | ✓ | Multi-Select | ODISEO | Tintas Holográficas / Efectos Texturas / Barnices |
| 2.8 | Objetivo de Color | ✓** | ✓ | Select | ODISEO | 4 Colores / Pantone / Especial (**si Clase ≠ Sin Impr) |
| 2.9 | Co-Printing | ✗ | ✓ | Select | ODISEO | Sí / No |
| 2.10 | Solicitud de Muestra | ✗ | ✓ | Select | ODISEO | Sí / No |

**Total Sección 2: 10 campos (3-6 obligatorios)**

---

### 3️⃣ SECCIÓN: ESTRUCTURA Y MATERIALES

| # | Campo | Obligatorio | Visible | Tipo | Origen | Notas |
|---|-------|-----------|---------|------|--------|-------|
| 3.1 | Tipo de Estructura | ✓ | ✓ | Select | ODISEO | Monocapa / Bilaminado / Trilaminado / Tetralaminado |
| 3.2 | Material Capa 1 | ✓ | ✓ | Select | SISTEMA_INTEGRAL | Filtro: VALIDADA (180+ opciones) |
| 3.3 | Micrones Capa 1 | ✓ | ✓ | Número | SISTEMA_INTEGRAL | Auto-calculado, read-only |
| 3.4 | Material Capa 2 | ✓* | ✓ | Select | SISTEMA_INTEGRAL | (*si Bilaminado+) |
| 3.5 | Micrones Capa 2 | ✓* | ✓ | Número | SISTEMA_INTEGRAL | Auto-calculado (*si Bilaminado+) |
| 3.6 | Material Capa 3 | ✓* | ✓ | Select | SISTEMA_INTEGRAL | (*si Trilaminado+) |
| 3.7 | Micrones Capa 3 | ✓* | ✓ | Número | SISTEMA_INTEGRAL | Auto-calculado (*si Trilaminado+) |
| 3.8 | Material Capa 4 | ✓* | ✓ | Select | SISTEMA_INTEGRAL | (*si Tetralaminado) |
| 3.9 | Micrones Capa 4 | ✓* | ✓ | Número | SISTEMA_INTEGRAL | Auto-calculado (*si Tetralaminado) |
| 3.10 | Micrones Totales | ✓ | ✓ | Número | SISTEMA_INTEGRAL | Suma auto-calculada, read-only |
| 3.11 | Combinación Homologada | ✓ | ✓ | Select | SISTEMA_INTEGRAL | Validada contra 405 combinaciones |
| 3.12 | Estado Validación | ✓ | ✓ | Badge | SISTEMA_INTEGRAL | ✓ Válida / ⚠ Pendiente / ✗ Rechazada |
| 3.13 | Adhesivos | ✓ | ✓ | Multi-Select | SISTEMA_INTEGRAL | Max 3: Poliuretano / Acrílico / Poliéster |
| 3.14 | Grammage (g/m²) | ✓ | ✓ | Número | SISTEMA_INTEGRAL | Auto-calculado ±10% tolerancia |

**Total Sección 3: 14 campos (8-10 obligatorios)**

---

### 4️⃣ SECCIÓN: EMBALAJES Y EMPALMES

| # | Campo | Obligatorio | Visible | Tipo | Origen | Notas |
|---|-------|-----------|---------|------|--------|-------|
| 4.1 | Tipo de Formato LÁMINA | ✓ | ✓ | Select | ODISEO | Tipo A (Pliego) / Tipo B (Rollo) / Tipo C (Perforado) |
| 4.2 | Ancho LÁMINA (mm) | ✓ | ✓ | Número | ODISEO | Rango: 100-20,000 mm (tolerancia ±2%) |
| 4.3 | Repetición (mm) | ✓ | ✓ | Número | ODISEO | Rango: 100-20,000 mm, ≤ Ancho |
| 4.4 | Acabado | ✓ | ✓ | Select | ODISEO | Mate / Brillante / Protección/Barniz |
| 4.5 | Sentido de Embobinado | ✓ | ✓ | Select | ODISEO | Longitudinal / Transversal |
| 4.6 | Material del Core | ✗ | ✓ | Select | ODISEO | Papel / Plástico / Aluminio / Otros |
| 4.7 | Perforación para Aire | ✗ | ✓ | Select | ODISEO | Sí / No |
| 4.8 | Ubicación de Perforaciones | ✗ | ✓ | Select | ODISEO | 4 Esquinas / 2 Lados / Centro / Otras |
| 4.9 | Fotocélula | ✗ | ✓ | Select | ODISEO | Sí / No |
| 4.10 | Ubicación Fotocélula | ✗** | ✓ | Número | ODISEO | mm desde margen (**si Fotocélula=Sí) |
| 4.11 | ¿Incluir Fotoregistro? | ✗ | ✓ | Radio | ODISEO | Sí / No (LÁMINA EXCLUSIVE, Max 1) |
| 4.12 | Tipo de Fotoregistro | ✓*** | ✓ | Select | ODISEO | Por Marca Código / Marcas Regulares / Sensor Dual |
| 4.13 | Ubicación Fotocelula FR (mm) | ✓*** | ✓ | Número | ODISEO | Rango: 50-19,950 mm (***si FR=Sí) |
| 4.14 | Margen de Detección FR (mm) | ✓*** | ✓ | Número | ODISEO | Rango: 5-50 mm (***si FR=Sí) |
| 4.15 | Pre-corte (Abre Fácil) | ✗ | ✓ | Select | ODISEO | 10mm / No Aplica |
| 4.16 | Ubicación Pre-corte | ✗** | ✓ | Select | ODISEO | Superior / Inferior / Lateral |
| 4.17 | Distancia Margen Derecho Precorte | ✗** | ✓ | Número | ODISEO | 0-500 mm (**si Pre-corte ≠ No) |

**Total Sección 4: 17 campos (5 obligatorios base)**

---

## RESUMEN CUANTITATIVO

### Totales Generales

| Métrica | Cantidad |
|---------|----------|
| **Total Campos** | 59 |
| **Obligatorios** | 26 |
| **Condicionales** | 18 |
| **Opcionales** | 15 |

### Por Origen Catalógico

| Origen | Cantidad | % |
|--------|----------|-----|
| ODISEO | 45 | 76% |
| SISTEMA_INTEGRAL | 14 | 24% |
| N/A | 0 | 0% |

---

**Fin del Documento - Válido para LÁMINA**
