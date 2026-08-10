# ÁRBOL DE DECISIÓN CONSOLIDADO - LÁMINA (Secuencia Real)

**Documento:** Árbol de Decisión basado en Estructura Real de ProductEditPage.tsx  
**Versión:** 2.0  
**Fecha:** 2026-08-10  
**Producto:** LÁMINA  
**Pasos:** 5 (Paso 0 → Paso 1 → Paso 1.5 → Paso 2 → Paso 3)

---

## FLUJO COMPLETO - SECUENCIA REAL

```
╔════════════════════════════════════════════════════════════════════════════╗
║ INICIO: CREAR PROYECTO LÁMINA                                            ║
╚════════════════════════════════════════════════════════════════════════════╝

┌─ PASO 0: INFORMACIÓN PRODUCTO
│
├─ [BIFURCACIÓN 1] Clasificación
│  │
│  ├─ "PRODUCTO NUEVO"
│  │  ├─ Nombre, Volumen, Unidad: EDITABLES ✓
│  │  ├─ Descripción breve: OBLIGATORIA ✓
│  │  └─ Ir a Modificación
│  │
│  └─ "PRODUCTO MODIFICADO"
│     ├─ Nombre, Volumen, Unidad: READ-ONLY 🔒
│     ├─ Descripción breve: EDITABLE ✓
│     └─ Ir a Modificación
│
├─ [SUBSECCIÓN] Modificación (MOT)
│  ├─ Checkboxes dinámicos según Clasificación
│  ├─ Si Clasificación = NUEVO: 6 opciones MOT
│  ├─ Si Clasificación = MODIFICADO: 6 opciones MOT diferentes
│  └─ Seleccionar 1 o más (OBLIGATORIO)
│
├─ [SUBSECCIÓN] Información Salesforce
│  ├─ Acción Salesforce (OPCIONAL, formato A-XXXXXX)
│  ├─ Código RFQ (OPCIONAL, texto libre)
│  └─ Auto-normaliza Acción
│
├─ [SUBSECCIÓN] Especificaciones Técnicas
│  ├─ Aplicación Técnica (OBLIGATORIO, Select 45+ opciones)
│  ├─ Código de Empaque del Cliente (OPCIONAL)
│  ├─ Comentarios (OPCIONAL, Textarea)
│  └─ Validación: Descripción + Aplicación OK
│
└─ ¿PASO 0 COMPLETADO?
   ├─ SÍ → Ir a PASO 1 (Diseño)
   └─ NO → BLOQUEO: Mostrar campos requeridos en ROJO

┌─ PASO 1: ESPECIFICACIONES DE DISEÑO
│
├─ [SUBSECCIÓN] Diseño de Referencia
│  │
│  ├─ ¿Tiene Diseño de referencia?
│  │  │
│  │  ├─ "Sí"
│  │  │  ├─ EDAG Referencia: OBLIGATORIO ✓
│  │  │  ├─ Botón "Consultar SI": ACTIVO
│  │  │  ├─ Si existe → Auto-llena printClass, printType, printForm
│  │  │  ├─ Si NO existe → ERROR "EDAG no encontrado"
│  │  │  └─ Ir a Impresión
│  │  │
│  │  └─ "No"
│  │     ├─ EDAG Referencia: DESHABILITADO (GRIS)
│  │     ├─ Nuevo Diseño: ALERTA ⚠️
│  │     └─ Ir a Impresión
│  │
│  └─ Validación: EDAG válido si Ref=Sí
│
├─ [SUBSECCIÓN] Impresión (Clase)
│  │
│  ├─ Seleccionar Clase Impresión
│  │  │
│  │  ├─ "Sin Impresión"
│  │  │  ├─ Tipo Impresión: GRIS (deshabilitado)
│  │  │  ├─ Forma Impresión: GRIS (deshabilitado)
│  │  │  ├─ Especificaciones Especiales: GRIS (deshabilitado)
│  │  │  ├─ Auto-limpia estos campos si existen valores
│  │  │  └─ Ir a Información Técnica
│  │  │
│  │  ├─ "Flexografía"
│  │  │  ├─ Tipo Impresión: OBLIGATORIO ✓ (Repetitivo/Continuo)
│  │  │  ├─ Forma Impresión: OBLIGATORIO ✓ (Dorso/Superficie)
│  │  │  ├─ Especificaciones Especiales: OPCIONAL
│  │  │  └─ Ir a Información Técnica
│  │  │
│  │  └─ "Huecograbado"
│  │     ├─ Tipo Impresión: OBLIGATORIO ✓
│  │     ├─ Forma Impresión: OBLIGATORIO ✓
│  │     ├─ Especificaciones Especiales: OPCIONAL
│  │     └─ Ir a Información Técnica
│  │
│  └─ Validación: Si Print ≠ Sin → Tipo + Forma REQUERIDOS
│
├─ [SUBSECCIÓN] Especificaciones Especiales
│  │
│  └─ ¿Especificaciones = "Otros (comentar cuáles)"?
│     │
│     ├─ SÍ → Comentarios de diseños especiales: VISIBLE + OBLIGATORIO
│     └─ NO → Comentarios: OCULTO
│
├─ [SUBSECCIÓN] Información Técnica de Diseño
│  ├─ Objetivo de color (OPCIONAL, Select)
│  ├─ Si Objetivo = "Otros" → Campo "Objetivo de color - otro": VISIBLE
│  ├─ Aprobador de prensa (OPCIONAL, Select)
│  ├─ Código de referencia ALUSA (OPCIONAL, Texto)
│  └─ Instrucciones de trabajo para diseño (OPCIONAL, Textarea)
│
├─ [SUBSECCIÓN] Carga de Planos de Diseño
│  │
│  ├─ ¿Tiene plano de diseño?
│  │  │
│  │  ├─ "Sí"
│  │  │  ├─ Tipo de plano: OBLIGATORIO ✓ (Select)
│  │  │  ├─ Archivos de plano: OBLIGATORIO ✓ (Upload)
│  │  │  ├─ Comentarios de plano: OPCIONAL (Textarea)
│  │  │  └─ Ir a Validación Paso 1
│  │  │
│  │  └─ "No"
│  │     ├─ Todos campos plano: AUTO-LIMPIAN
│  │     └─ Ir a Validación Paso 1
│  │
│  └─ Validación: Si Plano=Sí → Tipo + Archivos REQUERIDOS
│
└─ ¿PASO 1 COMPLETADO?
   ├─ SÍ → Ir a PASO 1.5 (Embobinado - LÁMINA EXCLUSIVE)
   └─ NO → ERROR: Mostrar campos inválidos

┌─ PASO 1.5: SENTIDO DE EMBOBINADO (LÁMINA EXCLUSIVE)
│
├─ ¿wrappingType = "LÁMINA"?
│  │
│  ├─ SÍ
│  │  ├─ Mostrar: Sentido de Embobinado (Selector visual)
│  │  ├─ Mostrar: Referencia de Sentido (Texto descriptivo)
│  │  ├─ Ambos campos: OPCIONALES
│  │  └─ Ir a Paso 2
│  │
│  └─ NO (BOLSA/POUCH)
│     ├─ PASO 1.5: COMPLETAMENTE OCULTO
│     ├─ Estos campos NO existen en BD para otros formatos
│     └─ Ir directamente a Paso 2
│
└─ ¿PASO 1.5 COMPLETADO?
   ├─ SÍ (o SALTADO si no LÁMINA) → Ir a PASO 2
   └─ Campos opcionales, no bloquean

┌─ PASO 2: INFORMACIÓN TÉCNICA DE ESTRUCTURA
│
├─ [SUBSECCIÓN] Especificaciones de Estructura
│  │
│  ├─ ¿Tiene estructura de referencia?
│  │  │
│  │  ├─ "Sí"
│  │  │  ├─ E/M Referencia: OPCIONAL (pero si llena, debe ser válido)
│  │  │  ├─ Botón "Consultar SI": ACTIVO
│  │  │  ├─ Si existe → Auto-llena datos de estructura
│  │  │  ├─ Si NO existe → WARNING (no bloquea)
│  │  │  └─ Ir a Componentes Dinámicos
│  │  │
│  │  └─ "No"
│  │     ├─ E/M Referencia: DESHABILITADO (GRIS)
│  │     ├─ Nueva Estructura: ALERTA
│  │     └─ Ir a Componentes Dinámicos
│  │
│  └─ Validación: E/M Referencia formato NNNNN-NN si se completa
│
├─ [COMPONENTES DINÁMICOS] Estructura LÁMINA
│  │
│  ├─ ¿wrappingType = "LÁMINA"?
│  │  │
│  │  ├─ SÍ → MOSTRAR: LaminaStructureTable
│  │  │  ├─ Tipo Estructura (Mono/Bilam/Trilam/Tetra): OBLIGATORIO ✓
│  │  │  ├─ Materiales Cap 1-4: Según tipo (1-4 capas)
│  │  │  ├─ Filtro SI VALIDADA: Solo materiales aprobados
│  │  │  ├─ Micrones Totales: Auto-calculado (lectura)
│  │  │  ├─ Combinación 405: Validada/Pendiente (badge)
│  │  │  ├─ Grammage: Auto-calculado ±10% (lectura)
│  │  │  │
│  │  │  ├─ RESTRICCIÓN: Si Producto Modificado
│  │  │  │  ├─ Tipo Estructura: READ-ONLY 🔒
│  │  │  │  ├─ Materiales: READ-ONLY 🔒
│  │  │  │  └─ Label: "Heredado del producto base"
│  │  │  │
│  │  │  └─ Si Producto Nuevo
│  │  │     ├─ Todos editables ✓
│  │  │     └─ Cambiar Tipo permite cambiar materiales
│  │  │
│  │  └─ NO → OCULTAR: LaminaStructureTable
│  │         MOSTRAR: PouchBolsaStructureTable (diferente)
│  │
│  ├─ [COMPONENTE] PhotoregisterAccordion
│  │  │
│  │  ├─ ¿wrappingType = "LÁMINA"?
│  │  │  │
│  │  │  ├─ SÍ → VISIBLE
│  │  │  │  ├─ Fotoregistro (Sí/No): OPCIONAL (Max 1)
│  │  │  │  ├─ Si Fotoregistro = "Sí"
│  │  │  │  │  ├─ Tipo FR: OBLIGATORIO ✓
│  │  │  │  │  ├─ Ubicación FR: OBLIGATORIO ✓ (Rango: 50-(Ancho-50))
│  │  │  │  │  ├─ Margen FR: OBLIGATORIO ✓ (5-50 mm)
│  │  │  │  │  └─ Contador: "1 de 1" (Max 1 restricción)
│  │  │  │  │
│  │  │  │  └─ Si Fotoregistro = "No"
│  │  │  │     └─ Campos FR: OCULTOS
│  │  │  │
│  │  │  └─ NO (BOLSA/POUCH) → COMPLETAMENTE OCULTO
│  │  │     └─ LÁMINA EXCLUSIVE: No se renderiza
│  │  │
│  │  └─ Validación FR: Si Fotoregistro=Sí → Tipo, Ubicación, Margen REQUERIDOS
│  │
│  └─ [COMPONENTE] CalculatedMeasuresAccordion
│     ├─ SIEMPRE VISIBLE (todos los formatos)
│     ├─ Muestra: Micrones, Grammage, Medidas calculadas
│     └─ Lectura solamente (no editable)
│
└─ ¿PASO 2 COMPLETADO?
   ├─ Validación:
   │  ├─ Tipo Estructura: REQUERIDO
   │  ├─ Materiales: Según tipo (1-4 capas)
   │  ├─ Si FR=Sí: Tipo, Ubicación, Margen requeridos
   │  └─ Combinación 405: Validada o Pendiente (no bloquea)
   │
   ├─ SÍ → Ir a PASO 3 (Embalaje)
   └─ NO → ERROR: Mostrar campos inválidos

┌─ PASO 3: EMBALAJE Y EMPALMES
│
├─ [CAMPOS UNIVERSALES] Aplicable a LÁMINA, BOLSA, POUCH
│  │
│  ├─ Embalaje de material (OPCIONAL, Select)
│  ├─ Embalaje de Productos de Exportación (OPCIONAL, Select)
│  ├─ Embalaje de material especial (OPCIONAL, Textarea)
│  └─ Empalmes (OPCIONAL, Select)
│
└─ ¿PASO 3 COMPLETADO?
   ├─ Validación: Todos opcionales (no bloquean)
   ├─ SÍ → Ir a VALIDACIÓN FINAL
   └─ NO → Sin errores (campos opcionales)

┌─ VALIDACIÓN FINAL (Pre-Guardado)
│
├─ ¿TODOS LOS PASOS COMPLETADOS?
│  ├─ Paso 0: Info Producto + MOT + Aplicación Técnica
│  ├─ Paso 1: Diseño + Impresión + Planos (si aplica)
│  ├─ Paso 1.5: Embobinado (LÁMINA)
│  ├─ Paso 2: Estructura + Materiales + FR (si aplica)
│  └─ Paso 3: Embalajes (todos opcionales)
│
├─ ¿VALIDACIONES LÓGICAS OK?
│  ├─ Clasificación no vacía
│  ├─ MOT seleccionado(s)
│  ├─ Aplicación Técnica seleccionada
│  ├─ Tipo Estructura seleccionado (Paso 2)
│  ├─ Materiales según tipo (1-4 capas)
│  ├─ Si FR=Sí: Ubicación en rango [50, Ancho-50]
│  ├─ Si FR=Sí: Margen en [5, 50]
│  ├─ Si Print ≠ Sin: Tipo + Forma impresión
│  └─ Si Plano=Sí: Tipo + Archivos cargados
│
└─ ¿RESULTADO?
   │
   ├─ TODO OK → Habilitar botones Guardar/Enviar
   │  ├─ Botón "GUARDAR BORRADOR"
   │  │  └─ Estado: "Borrador" (editable después)
   │  │
   │  └─ Botón "ENVIAR PARA REVISIÓN"
   │     ├─ Re-validar TODO
   │     ├─ Si OK → Cambiar estado a "En Revisión"
   │     ├─ Asignar a Validation Queue
   │     └─ Notificar equipo técnico
   │
   └─ ERRORES → BLOQUEO: Mostrar lista ROJA
      ├─ Listar campos faltantes/inválidos
      ├─ No permitir guardar
      └─ Usuario corrige → Revalidar

╔════════════════════════════════════════════════════════════════════════════╗
║ FIN: Proyecto LÁMINA creado/actualizado                                  ║
╚════════════════════════════════════════════════════════════════════════════╝
```

---

## TABLA DE CASUÍSTICAS SIMPLIFICADA

### Bifurcaciones Principales

| Bifurcación | Opción A | Opción B | Opción C |
|---|---|---|---|
| 1. Clasificación | Producto Nuevo | Producto Modificado | - |
| 2. Diseño Referencia | Sí (carga EDAG) | No (nuevo diseño) | - |
| 3. Clase Impresión | Sin Impresión | Flexografía | Huecograbado |
| 4. Tiene Plano | Sí (req. tipo+arch) | No (auto-limpia) | - |
| 5. Tiene Struct Ref | Sí (carga E/M) | No (nueva struct) | - |
| 6. Tipo Estructura | Mono | Bilam/Trilam/Tetra | - |
| 7. Fotoregistro | Sí (req. 3 campos) | No (oculto) | - |
| 8. Tipo Envoltura | LÁMINA (muestra FR+Emb) | BOLSA/POUCH (oculta) | - |

---

## ESTADÍSTICAS DE FLUJO

```
PASOS:                  5 (Paso 0 → 1 → 1.5 → 2 → 3)
BIFURCACIONES:          8 principales
CASUÍSTICAS BASE:       ~32 (Producto Nuevo combinaciones)
CASUÍSTICAS MOD:        ~16 (Producto Modificado combinaciones)
TOTAL RUTAS:            ~48

CAMPOS OBLIGATORIOS:    9 base
CAMPOS CONDICIONALES:   8 (según selecciones)
CAMPOS OPCIONALES:      20

VALIDACIONES CRÍTICAS:  12+
RESTRICCIONES:          10
LÁMINA EXCLUSIVE:       2 secciones (Paso 1.5 + Fotoregistro en Paso 2)
```

---

## COMPARACIÓN: VIEJO vs NUEVO ÁRBOL

| Aspecto | Viejo Árbol | Nuevo Árbol (Real) |
|---|---|---|
| **Niveles** | 7 niveles artificiales | 5 pasos reales (Paso 0-3 + 1.5) |
| **Campos Ficticios** | Moneda, País, SF, Cliente | Eliminados - No existen |
| **Orden** | Información → Diseño → Estructura → Embalajes | CORRECTO: 0 → 1 → 1.5 → 2 → 3 |
| **Fotoregistro** | En Paso 5 (Embalajes) | EN PASO 2 (Estructura) en PhotoregisterAccordion |
| **Sentido Embobinado** | En Paso 3 (Estructura) | CORRECTO: En Paso 1.5 (Sentido de Embobinado) |
| **Materiales** | En Paso 4 (Estructura) | EN PASO 2 en LaminaStructureTable (componente dinámico) |
| **Componentes** | Ignorados | INCLUIDOS: LaminaStructureTable, PhotoregisterAccordion, CalculatedMeasuresAccordion |

---

## REFERENCIAS

- Tabla Campos LÁMINA: `TABLA_CAMPOS_LAMINA_POR_SECCION.md`
- ProductEditPage.tsx: Fuente de verdad (líneas 5070-7905)
- Componentes: LaminaStructureTable, PhotoregisterAccordion, CalculatedMeasuresAccordion, RewindingDirectionSelector

---

*Árbol de Decisión Consolidado v2.0 - Basado en Código Real | LÁMINA | 2026-08-10*
