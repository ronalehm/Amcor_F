# 📋 HISTORIA DE USUARIO: LÁMINA

**Código:** HU-LAMINA-001  
**Versión:** 1.0  
**Fecha:** 2026-08-10  
**Estado:** Aprobado  
**Puntos de Historia:** 21  

---

## 1. OBJETIVO

Permitir al usuario ODISEO crear y modificar especificaciones completas de productos con envoltura tipo **LÁMINA**.

---

## 2. PROPÓSITO

### Por qué se hace
- LÁMINA es uno de los 3 tipos de envoltura principales (junto a BOLSA y POUCH)
- Es el ÚNICO tipo de envoltura que permite Fotoregistro

### Usuarios Beneficiados
- Diseñadores ODISEO (crean nuevos productos)
- Gestores de Modificaciones (editan productos existentes)
- Validadores Técnicos (aprueban especificaciones)
- Equipo de Artes Gráficas (trabaja con diseños finales)

---

## 3. PASO A PASO

### Paso 1: Seleccionar Envoltura
- Usuario accede a ProductCreatePage
- Selecciona "Tipo de Envoltura": LÁMINA
- Sistema habilita campos específicos de LÁMINA
- Campos de BOLSA/POUCH se deshabilitan

### Paso 2: Información Básica
- Ingresa nombre del producto (min 5 caracteres)
- Selecciona cliente
- Selecciona segmento
- Selecciona tipo de proyecto

### Paso 3: Especificaciones de Diseño
- Selecciona clase de impresión (Flexo/Huecograbado/Sin Impresión)
- Si no es sin impresión: ingresa EDAG o marca como nuevo diseño
- Selecciona tipo y forma de impresión

### Paso 4: Estructura y Materiales
- Selecciona tipo de estructura (Mono/Bilam/Trilam/Tetralaminado)
- Para cada capa: selecciona material VALIDADA SI
- Sistema valida contra 405 combinaciones homologadas

### Paso 5: Especificaciones de Formato
- Selecciona tipo de formato LÁMINA
- Ingresa ancho (100-20,000 mm)
- Ingresa repetición (100-20,000 mm, ≤ ancho)

### Paso 6: Acabados y Configuración
- Selecciona acabado (Mate/Brillante/Protección)
- Selecciona sentido de embobinado
- Selecciona aplicación técnica
- Sistema auto-calcula grammage

### Paso 7: Fotoregistro (LÁMINA EXCLUSIVE)
- Selecciona si incluir fotoregistro (máximo 1)
- Si sí: configura tipo, ubicación, margen de detección
- Sistema valida que fotocelula esté dentro de perimetro válido (50-19950 mm)

### Paso 8: Revisión y Envío
- Revisa resumen de configuración
- Realiza validaciones finales
- Envía para revisión

---

## 4. REGLAS DE NEGOCIO

| Código | Regla | Razón |
|--------|-------|-------|
| RB-1 | Una vez seleccionada LÁMINA, campos de BOLSA/POUCH se deshabilitan | Estructuras diferentes |
| RB-2 | Solo LÁMINA puede tener Fotoregistro (máximo 1) | BOLSA/POUCH no tienen sistema de fotodetección |
| RB-3 | Producto Modificado NO puede editar estructura | Cambiar estructura = crear producto nuevo |
| RB-4 | Solo 405 combinaciones de materiales validadas por SI | Garantía de proceso y calidad |
| RB-5 | Ancho: 100-20,000 mm, Repetición ≤ Ancho | Limitaciones de maquinaria |
| RB-6 | Fotocelula entre 50-19950 mm desde bordes | Zonas críticas de procesamiento |
| RB-7 | Si Clase = "Sin Impresión" → EDAG no requerido | Simplificación de flujo |
| RB-8 | Se recomienda acabado Mate para Seco, Brillante para Líquido/Pastoso | Mejores resultados visuales |
| RB-9 | Producto Modificado hereda estructura del producto base | "Modificado" ≠ cambio de composición |
| RB-10 | Grammage calculado automáticamente ±10% tolerancia | Validación de integridad |

---

## 5. CRITERIOS DE VALIDACIÓN

**Campos Obligatorios:**
- Nombre (min 5 caracteres)
- Cliente (seleccionado)
- Segmento (seleccionado)
- Tipo Proyecto (seleccionado)
- Clase Impresión (seleccionado, excepto si Sin Impresión)
- Tipo Estructura (seleccionado)
- Material por capa (todos seleccionados)
- Ancho LÁMINA (100-20000 mm)
- Repetición (100-20000 mm, ≤ Ancho)
- Acabado (seleccionado)
- Aplicación Técnica (seleccionado)

**Si Fotoregistro = Sí:**
- Tipo Fotoregistro (seleccionado)
- Ubicación Fotocelula (50-19950 mm)
- Margen Detección (5-50 mm)

---

## 6. ÁRBOL DE DECISIÓN

```
INICIO: Usuario selecciona LÁMINA
│
├─ ¿Clasificación?
│  ├─ Producto Nuevo → Estructura editable
│  └─ Producto Modificado → Estructura heredada (no editable)
│
├─ ¿Clase Impresión = "Sin Impresión"?
│  ├─ Sí → Deshabilitar campos de diseño
│  └─ No → Requerir EDAG/Diseño Nuevo, Tipo, Forma
│
├─ Estructura: Validar contra 405 combinaciones SI
│
├─ Dimensiones: 100-20000 mm, Repetición ≤ Ancho
│
├─ ¿Incluir Fotoregistro?
│  ├─ Sí → Validar ubicación (50-19950 mm)
│  └─ No → Omitir sección FR
│
└─ GUARDAR Y ENVIAR
```

---

## 7. CAMPOS Y VALIDACIÓN

| Campo | Tipo | Requerido | Validación | Valor Por Defecto |
|-------|------|-----------|-----------|-------------------|
| Nombre | Texto | ✓ | Min 5 caracteres | "" |
| Cliente | Select | ✓ | Select | "" |
| Segmento | Select | ✓ | Select | "" |
| Tipo Proyecto | Select | ✓ | Nuevo/Modificado | "Nuevo" |
| Clase Impresión | Select | ✓ | Flexo/Hueco/Sin Impr | "" |
| EDAG | Texto | ✓* | NNNNN-NN | "" |
| Tipo Impresión | Select | ✓* | Repetitivo/Continuo | "" |
| Forma Impresión | Select | ✓* | Dorso/Superficie | "" |
| Tipo Estructura | Select | ✓ | Mono/Bilam/Trilam/Tetra | "Bilaminado" |
| Material Cap 1 | Select | ✓ | VALIDADA SI | "" |
| Material Cap 2 | Select | ✓* | VALIDADA SI | "" |
| Material Cap 3 | Select | ✓* | VALIDADA SI | "" |
| Material Cap 4 | Select | ✓* | VALIDADA SI | "" |
| Tipo Formato | Select | ✓ | Tipo A/B/C | "" |
| Ancho LÁMINA | Número | ✓ | 100-20000 mm | "" |
| Repetición | Número | ✓ | 100-20000 mm | "" |
| Acabado | Select | ✓ | Mate/Brillante/Protección | "Brillante" |
| Embobinado | Select | ✓ | Longitudinal/Transversal | "Longitudinal" |
| Aplicación Técnica | Select | ✓ | Seco/Pastoso/Líquido | "" |
| ¿Fotoregistro? | Radio | ✗ | Sí/No | "No" |
| Tipo Fotoregistro | Select | ✓* | Marca/Regular/Sensor | "" |
| Ubicación Fotocelula | Número | ✓* | 50-19950 mm | "" |
| Margen Detección | Número | ✓* | 5-50 mm | "" |

*Requerido solo si condición aplica

---

## 8. MENSAJES PROPUESTOS

### ERRORES (RED)
```
ERR-001: "El nombre del producto debe tener al menos 5 caracteres"
ERR-002: "Seleccione un cliente para continuar"
ERR-003: "El ancho de LÁMINA debe estar entre 100 y 20,000 mm"
ERR-004: "La repetición no puede ser mayor que el ancho"
ERR-005: "La ubicación de la fotocelula debe estar entre 50 y {ancho-50} mm"
ERR-006: "El margen de detección debe estar entre 5 y 50 mm"
ERR-007: "Combinación de materiales no validada por el Sistema Integral"
ERR-008: "El producto base no puede ser editado por estructura (heredado)"
```

### ADVERTENCIAS (ORANGE)
```
WARN-001: "⚠️ Fotoregistro solo está disponible para LÁMINA"
WARN-002: "Se recomienda acabado Mate para aplicaciones Seco"
WARN-003: "Grammage está ±10% fuera del rango calculado"
WARN-004: "Cambiar envoltura limpiará todos los datos específicos"
```

### INFORMACIÓN (BLUE/GREEN)
```
INFO-001: "✓ Producto LÁMINA creado exitosamente"
INFO-002: "✓ La estructura está validada con las 405 combinaciones SI"
INFO-003: "ℹ️ Nuevo diseño - Será validado por Artes Gráficas en Momento 2"
INFO-004: "ℹ️ Fotoregistro LÁMINA: máximo 1 por producto"
```

---

## 9. CRITERIOS DE ACEPTACIÓN

✓ Usuario puede seleccionar LÁMINA como envoltura  
✓ Campos específicos de LÁMINA se habilitan correctamente  
✓ Campos de BOLSA/POUCH se deshabilitan y limpian  
✓ Estructura validada contra 405 combinaciones SI  
✓ Dimensiones validadas (100-20,000 mm)  
✓ Fotoregistro visible solo para LÁMINA (máximo 1)  
✓ Producto Modificado no permite editar estructura  
✓ Mensajes de error/advertencia mostrados correctamente  
✓ Proyecto se guarda y envía exitosamente  

---

**Fin de HU-LAMINA-001 v1.0**
