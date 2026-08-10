# ANEXO 2: ÁRBOL DE DECISIÓN CONSOLIDADO - LÁMINA

**Documento:** Árbol Completo de Decisión con 48 Casuísticas  
**Versión:** 1.0  
**Fecha:** 2026-08-05  
**Producto:** LÁMINA  
**Scope:** 7 Niveles de decisión | Flujo completo Inicio → Fin

---

## RESUMEN EJECUTIVO

- **Niveles:** 7 (Clasificación → Información → Diseño → Estructura → Embalajes → Validación → Guardar)
- **Casuísticas totales:** 48
  - Producto Nuevo: 32 rutas de decisión
  - Producto Modificado: 16 rutas de decisión
- **Puntos de bifurcación:** 12+
- **Validaciones críticas:** 25+
- **Restricciones:** 10 principales

---

## ÁRBOL COMPLETO - FLUJO DETALLADO

```
╔════════════════════════════════════════════════════════════════════════════╗
║ INICIO: CREAR PRODUCTO LÁMINA                                            ║
╚════════════════════════════════════════════════════════════════════════════╝

┌─ NIVEL 1: CLASIFICACIÓN [BIFURCACIÓN PRINCIPAL]
│
├─ Opción A: "PRODUCTO NUEVO"
│  │
│  ├─ Estructura: EDITABLE ✓
│  ├─ Materialess: EDITABLES ✓
│  ├─ Todas los campos: DISPONIBLES
│  ├─ Casuísticas en este branch: 32
│  └─ Ir a Nivel 2 (Información Básica)
│
└─ Opción B: "PRODUCTO MODIFICADO"
   │
   ├─ Requisito: Debe seleccionar producto base
   ├─ ¿Existe producto base en BD?
   │  │
   │  ├─ SÍ → Heredar datos completos
   │  │       Estructura: READ-ONLY (candado 🔒)
   │  │       Materiales: READ-ONLY (candado 🔒)
   │  │       Editables: Ancho, Repetición, Acabado, FR
   │  │       Casuísticas en este branch: 16
   │  │       Ir a Nivel 2
   │  │
   │  └─ NO → ERROR: "Seleccionar producto base"
   │          Mostrar lista productos disponibles
   │          Mostrar: Nombre, Estructura, Estado
   │          User debe seleccionar o CANCELAR
   │
   └─ Restricción Permanente: Clasificación NO SE PUEDE CAMBIAR post-creación

┌─ NIVEL 2: INFORMACIÓN BÁSICA [REQUERIDA SIEMPRE]
│
├─ Campos obligatorios:
│  ├─ Nombre (Min 5 caracteres)
│  ├─ Cliente (Select con filtro dinámico)
│  ├─ Segmento (Depende cliente)
│  ├─ Planta (AF Lima/Cali/Santiago/San Luis)
│  ├─ Moneda (PEN/USD/EUR)
│  ├─ País (Seleccionar)
│  ├─ Tipo Venta (B2B/B2C/Retail/Distribuidor)
│  ├─ Código SF (Formato A-XXXXXX)
│  ├─ Aplicación Técnica (45+ opciones)
│  └─ Incoterm (FOB/CIF/DDP)
│
├─ Validación: ¿TODOS COMPLETADOS?
│  │
│  ├─ SÍ → Ir a Nivel 3 (Diseño)
│  │
│  └─ NO → BLOQUEO: Mostrar error "Campos faltantes"
│           Listar campos: ROJO 🔴
│           Usuario corrige → revalidar
│
└─ Nota: Información NO cambia por clasificación

┌─ NIVEL 3: DISEÑO [CONDICIONAL POR IMPRESIÓN]
│
└─ Bifurcación: ¿CLASE IMPRESION?
   │
   ├─ Opción 3a: "SIN IMPRESIÓN"
   │  │
   │  ├─ Deshabilitar campos (GRIS):
   │  │  ├─ Tipo Impresión (auto-limpia)
   │  │  ├─ Forma Impresión (auto-limpia)
   │  │  ├─ Objetivo Color (auto-limpia)
   │  │  └─ EDAG (auto-limpia)
   │  │
   │  ├─ Estos campos pasan a OPCIONALES
   │  ├─ UI: Mostrar tooltip "No aplica para Sin Impresión"
   │  │
   │  ├─ Validación: SALTADA para diseño
   │  └─ Ir a Nivel 4 (Estructura)
   │
   ├─ Opción 3b: "FLEXOGRAFÍA" [Casuísticas: 3-16]
   │  │
   │  ├─ HABILITAR y REQUERIR:
   │  │  ├─ Tipo Impresión ✓ (Repetitivo/Continuo)
   │  │  ├─ Forma Impresión ✓ (Dorso/Superficie)
   │  │  └─ Objetivo Color ✓ (4c/Pantone/Especial)
   │  │
   │  ├─ Bifurcación: ¿DISEÑO REFERENCIA?
   │  │  │
   │  │  ├─ Opción 3b-i: "SÍ" → EDAG REQUERIDO ✓
   │  │  │  │
   │  │  │  ├─ Botón "Cargar" activo
   │  │  │  ├─ ¿Existe EDAG?
   │  │  │  │  ├─ SÍ → Auto-llenar campos
   │  │  │  │  └─ NO → ERROR: "EDAG no encontrado"
   │  │  │  │
   │  │  │  └─ Ir a Nivel 4
   │  │  │
   │  │  └─ Opción 3b-ii: "NO" → "Nuevo Diseño" [ALERTA]
   │  │     │
   │  │     ├─ EDAG deshabilitado (GRIS)
   │  │     ├─ Mostrar warning: "Se creará nuevo diseño"
   │  │     ├─ Tipo, Forma, Color: obligatorios ✓
   │  │     │
   │  │     └─ Ir a Nivel 4
   │  │
   │  ├─ Validación final diseño: ¿OK?
   │  │  ├─ SÍ → Ir a Nivel 4
   │  │  └─ NO → ERROR (campos faltantes)
   │  │
   │  └─ Casuísticas: 8 (2 × Ref SÍ/NO × 4 capas)
   │
   └─ Opción 3c: "HUECOGRABADO" [Casuísticas: idéntico a Flexografía]
      │
      ├─ HABILITAR y REQUERIR: Mismo que 3b
      │  ├─ Tipo Impresión ✓
      │  ├─ Forma Impresión ✓
      │  └─ Objetivo Color ✓
      │
      ├─ Bifurcación: ¿DISEÑO REFERENCIA?
      │  ├─ SÍ → EDAG requerido ✓
      │  └─ NO → Nuevo Diseño (ALERTA)
      │
      ├─ Validación: ¿OK?
      │  ├─ SÍ → Ir a Nivel 4
      │  └─ NO → ERROR
      │
      └─ Casuísticas: 8 (idéntico a Flexografía)

┌─ NIVEL 4: ESTRUCTURA [CONDICIONAL POR TIPO]
│
└─ Bifurcación: ¿TIPO ESTRUCTURA?
   │
   ├─ Opción 4a: "MONOCAPA" [Casuísticas: 8]
   │  │
   │  ├─ Material Cap 1: REQUERIDO ✓
   │  │  └─ Filtro: Solo SI VALIDADA
   │  │
   │  ├─ Capas 2-4: OCULTAS
   │  │  └─ Auto-limpia si existen valores previos
   │  │
   │  ├─ Auto-calcular:
   │  │  ├─ Micrones Totales (SI)
   │  │  └─ Grammage (SI) ±10%
   │  │
   │  ├─ Validación 405 SI:
   │  │  ├─ ¿Existe (M1)?
   │  │  │  ├─ SÍ → Badge "✅ Validada"
   │  │  │  └─ NO → Badge "⚠️ Pendiente Validación Técnica"
   │  │  │
   │  │  └─ No bloquea guardado (ADVERTENCIA)
   │  │
   │  ├─ Restricción Modificado:
   │  │  ├─ Si PRODUCTO MODIFICADO: Material READ-ONLY 🔒
   │  │  └─ Si PRODUCTO NUEVO: Material EDITABLE ✓
   │  │
   │  └─ Ir a Nivel 5 (Embalajes)
   │
   ├─ Opción 4b: "BILAMINADO" [Casuísticas: 8]
   │  │
   │  ├─ Materiales Cap 1, 2: REQUERIDOS ✓✓
   │  │  ├─ Cap 1: Filtro SI VALIDADA
   │  │  └─ Cap 2: Filtro SI VALIDADA
   │  │
   │  ├─ Capas 3-4: OCULTAS
   │  │  └─ Auto-limpia si existen
   │  │
   │  ├─ Validación cruzada: M1 ≠ M2 (si aplica)
   │  │
   │  ├─ Auto-calcular:
   │  │  ├─ Micrones Totales (M1 + M2)
   │  │  └─ Grammage (SI) ±10%
   │  │
   │  ├─ Validación 405 SI:
   │  │  ├─ ¿Existe (M1, M2)?
   │  │  │  ├─ SÍ → Badge "✅ Validada"
   │  │  │  └─ NO → Badge "⚠️ Pendiente"
   │  │  │
   │  │  └─ ADVERTENCIA si pendiente
   │  │
   │  ├─ Restricción Modificado:
   │  │  ├─ Estructura READ-ONLY 🔒
   │  │  └─ Materiales READ-ONLY 🔒
   │  │
   │  └─ Ir a Nivel 5
   │
   ├─ Opción 4c: "TRILAMINADO" [Casuísticas: 8]
   │  │
   │  ├─ Materiales Cap 1, 2, 3: REQUERIDOS ✓✓✓
   │  │  ├─ Cap 1: Filtro SI VALIDADA
   │  │  ├─ Cap 2: Filtro SI VALIDADA
   │  │  └─ Cap 3: Filtro SI VALIDADA
   │  │
   │  ├─ Capa 4: OCULTA
   │  │  └─ Auto-limpia si existe
   │  │
   │  ├─ Validación secuencial:
   │  │  ├─ M1 → M2 → M3
   │  │  └─ M1 ≠ M3 (generalmente)
   │  │
   │  ├─ Auto-calcular:
   │  │  ├─ Micrones Totales (M1 + M2 + M3)
   │  │  └─ Grammage (SI) ±10%
   │  │
   │  ├─ Validación 405 SI:
   │  │  ├─ ¿Existe (M1, M2, M3)?
   │  │  │  ├─ SÍ → Badge "✅ Validada"
   │  │  │  └─ NO → Badge "⚠️ Pendiente"
   │  │  │
   │  │  └─ No bloquea
   │  │
   │  ├─ Restricción Modificado: READ-ONLY 🔒
   │  │
   │  └─ Ir a Nivel 5
   │
   └─ Opción 4d: "TETRALAMINADO" [Casuísticas: 8]
      │
      ├─ Materiales Cap 1, 2, 3, 4: REQUERIDOS ✓✓✓✓
      │  ├─ Cap 1: Filtro SI VALIDADA
      │  ├─ Cap 2: Filtro SI VALIDADA
      │  ├─ Cap 3: Filtro SI VALIDADA
      │  └─ Cap 4: Filtro SI VALIDADA
      │
      ├─ Validación secuencial:
      │  └─ M1 → M2 → M3 → M4
      │
      ├─ Auto-calcular:
      │  ├─ Micrones Totales (M1+M2+M3+M4)
      │  └─ Grammage (SI) ±10%
      │
      ├─ Validación 405 SI:
      │  ├─ ¿Existe (M1,M2,M3,M4)?
      │  │  ├─ SÍ → ✅ Validada
      │  │  └─ NO → ⚠️ Pendiente
      │  │
      │  └─ ADVERTENCIA
      │
      ├─ Restricción Modificado: READ-ONLY 🔒
      │
      └─ Ir a Nivel 5

┌─ NIVEL 5: EMBALAJES Y EMPALMES [SIEMPRE EDITABLE]
│
├─ Campos obligatorios:
│  ├─ Tipo Formato (Select: Tipo A/B/C) ✓
│  ├─ Ancho (Número: 100-20,000 mm) ✓
│  │  └─ Efecto: Recalcula [50, Ancho-50] para FR
│  │
│  ├─ Repetición (Número: 100-20,000 mm) ✓
│  │  └─ Validación: ≤ Ancho (error si incumple)
│  │
│  ├─ Acabado (Select: Mate/Brillante/Protección) ✓
│  │  └─ Advertencia si no recomendado
│  │
│  └─ Embobinado (Select: Longitudinal/Transversal) ✓
│
├─ Configuración adicional (OPCIONAL):
│  ├─ Material Core (Select)
│  ├─ Perforación Aire (Sí/No)
│  ├─ Fotocélula (Sí/No)
│  └─ Pre-corte (Sí/No)
│
└─ FOTOREGISTRO [LÁMINA EXCLUSIVE, CONDICIONAL]
   │
   ├─ Visible: SOLO si wrappingType = "LÁMINA"
   ├─ Oculto: Para BOLSA/POUCH
   │
   └─ Bifurcación: ¿INCLUIR FOTOREGISTRO?
      │
      ├─ Opción 5a: "NO" [Casuísticas: 24]
      │  │
      │  ├─ Sección FR: COLAPSADA
      │  ├─ Campos FR: OCULTOS
      │  ├─ Auto-limpia si existen valores
      │  │
      │  └─ Ir a Nivel 6 (Validación)
      │
      └─ Opción 5b: "SÍ" [Casuísticas: 24]
         │
         ├─ RESTRICCIÓN: Max 1 FR por LÁMINA ⚠️
         │  └─ Contador: "1 de 1"
         │
         ├─ Campos obligatorios:
         │  ├─ Tipo FR (Select: Marca/Regulares/Sensor) ✓
         │  ├─ Ubicación FR (Número: 50-(Ancho-50) mm) ✓
         │  │  └─ Rango DINÁMICO (depende Ancho)
         │  │
         │  └─ Margen FR (Número: 5-50 mm) ✓
         │
         ├─ Validación Ubicación:
         │  ├─ Mín: 50
         │  ├─ Máx: Ancho - 50
         │  └─ Ejemplo: Ancho=1000 → [50, 950]
         │
         ├─ Validación Margen:
         │  ├─ Mín: 5
         │  ├─ Máx: 50
         │  └─ Exacto: No decimal
         │
         ├─ Cuando Ancho cambia:
         │  ├─ Recalcular Max Ubicación
         │  ├─ Si Ubicación > nuevo Max
         │  │  └─ ERROR: "Ubicación fuera de rango"
         │  │     Usuario corrige
         │  │
         │  └─ Tooltip actualizado
         │
         └─ Ir a Nivel 6

┌─ NIVEL 6: VALIDACIÓN FINAL [CHECKLIST ANTES DE GUARDAR]
│
├─ Validación 1: ¿CAMPOS OBLIGATORIOS?
│  ├─ Información Básica: 10 campos ✓
│  ├─ Diseño: 1 campo (Clase Impresión) + condicionales ✓
│  ├─ Estructura: 1-4 campos (según tipo) ✓
│  ├─ Embalajes: 4 campos ✓
│  └─ Si FR=Sí: 3 campos adicionales ✓
│
├─ Validación 2: ¿RANGOS NUMÉRICOS?
│  ├─ Ancho: 100 ≤ X ≤ 20,000 ✓
│  ├─ Repetición: 100 ≤ X ≤ 20,000 AND X ≤ Ancho ✓
│  ├─ Ubicación FR: 50 ≤ X ≤ (Ancho-50) ✓
│  └─ Margen FR: 5 ≤ X ≤ 50 ✓
│
├─ Validación 3: ¿LÓGICA CONSISTENTE?
│  ├─ Print Class vs Diseño campos
│  ├─ Estructura vs Materiales
│  ├─ Producto Mod: Estructura heredada
│  ├─ FR: Solo si LÁMINA + Sí seleccionado
│  └─ Repetición ≤ Ancho
│
├─ Validación 4: ¿405 SI?
│  ├─ Combinación validada: ✅
│  ├─ Combinación pendiente: ⚠️ (no bloquea)
│  └─ Material no existe: ❌ ERROR
│
├─ Validación 5: ¿GRAMMAGE?
│  ├─ Dentro ±10%: ✅
│  ├─ Fuera ±10%: ⚠️ ADVERTENCIA (no bloquea)
│  │
│  └─ Tooltip muestra: "Calculado: XXX ± YY g/m²"
│
└─ Validación 6: ¿RESULTADO FINAL?
   │
   ├─ TODO OK:
   │  ├─ Mostrar: ✅ "Listo para guardar"
   │  ├─ Botones: Habilitar
   │  └─ Ir a Nivel 7
   │
   └─ ERRORES:
      ├─ Mostrar: Lista ROJA 🔴
      ├─ Listar: Campos problemáticos
      ├─ Bloques: No guardar
      └─ Usuario corrige → revalidar (Nivel 6)

┌─ NIVEL 7: GUARDAR/ENVIAR [FINAL]
│
├─ Botón "GUARDAR BORRADOR"
│  ├─ Re-validar TODO
│  ├─ Estado: "Borrador" (permite edición posterior)
│  ├─ Guardar en DB
│  ├─ Mostrar: ✅ "Borrador guardado"
│  └─ Usuario puede editar nuevamente
│
└─ Botón "ENVIAR PARA REVISIÓN"
   ├─ Re-validar TODO (Nivel 6 completo)
   ├─ ¿Validación OK?
   │  ├─ SÍ →
   │  │  ├─ Crear proyecto en BD con estado "En Revisión"
   │  │  ├─ Asignar a: Validation Queue
   │  │  ├─ Crear audit log
   │  │  ├─ Mostrar: ✅ "Producto LÁMINA enviado exitosamente"
   │  │  └─ Email a equipo técnico
   │  │
   │  └─ NO →
   │     ├─ Mostrar: ❌ "No puede enviar, corrija errores"
   │     ├─ Listar: Campos faltantes
   │     └─ Bloquear: No envía

╔════════════════════════════════════════════════════════════════════════════╗
║ FIN: Producto LÁMINA creado/actualizado                                  ║
╚════════════════════════════════════════════════════════════════════════════╝
```

---

## TABLA RESUMEN CASUÍSTICAS (48 Total)

### Casuísticas PRODUCTO NUEVO (32)

| # | Clasificación | Estructura | Print | Referencia | Fotoregistro | Ruta |
|---|---|---|---|---|---|---|
| 1 | NUEVO | Mono | Sin Impr | - | No | A→2→3a→4a→5a→6→7 |
| 2 | NUEVO | Mono | Sin Impr | - | Sí | A→2→3a→4a→5b→6→7 |
| 3 | NUEVO | Mono | Flexo | Sí | No | A→2→3b-i→4a→5a→6→7 |
| 4 | NUEVO | Mono | Flexo | Sí | Sí | A→2→3b-i→4a→5b→6→7 |
| 5 | NUEVO | Mono | Flexo | No | No | A→2→3b-ii→4a→5a→6→7 |
| 6 | NUEVO | Mono | Flexo | No | Sí | A→2→3b-ii→4a→5b→6→7 |
| 7 | NUEVO | Mono | Hueco | Sí | No | A→2→3c-i→4a→5a→6→7 |
| 8 | NUEVO | Mono | Hueco | Sí | Sí | A→2→3c-i→4a→5b→6→7 |
| 9 | NUEVO | Bilam | Sin Impr | - | No | A→2→3a→4b→5a→6→7 |
| 10 | NUEVO | Bilam | Sin Impr | - | Sí | A→2→3a→4b→5b→6→7 |
| 11 | NUEVO | Bilam | Flexo | Sí | No | A→2→3b-i→4b→5a→6→7 |
| 12 | NUEVO | Bilam | Flexo | Sí | Sí | A→2→3b-i→4b→5b→6→7 |
| 13 | NUEVO | Bilam | Flexo | No | No | A→2→3b-ii→4b→5a→6→7 |
| 14 | NUEVO | Bilam | Flexo | No | Sí | A→2→3b-ii→4b→5b→6→7 |
| 15 | NUEVO | Trilam | Sin Impr | - | No | A→2→3a→4c→5a→6→7 |
| 16 | NUEVO | Trilam | Sin Impr | - | Sí | A→2→3a→4c→5b→6→7 |
| 17 | NUEVO | Trilam | Flexo | Sí | No | A→2→3b-i→4c→5a→6→7 |
| 18 | NUEVO | Trilam | Flexo | Sí | Sí | A→2→3b-i→4c→5b→6→7 |
| 19 | NUEVO | Trilam | Flexo | No | No | A→2→3b-ii→4c→5a→6→7 |
| 20 | NUEVO | Trilam | Flexo | No | Sí | A→2→3b-ii→4c→5b→6→7 |
| 21 | NUEVO | Tetra | Sin Impr | - | No | A→2→3a→4d→5a→6→7 |
| 22 | NUEVO | Tetra | Sin Impr | - | Sí | A→2→3a→4d→5b→6→7 |
| 23 | NUEVO | Tetra | Flexo | Sí | No | A→2→3b-i→4d→5a→6→7 |
| 24 | NUEVO | Tetra | Flexo | Sí | Sí | A→2→3b-i→4d→5b→6→7 |
| 25 | NUEVO | Tetra | Flexo | No | No | A→2→3b-ii→4d→5a→6→7 |
| 26 | NUEVO | Tetra | Flexo | No | Sí | A→2→3b-ii→4d→5b→6→7 |
| 27 | NUEVO | Tetra | Hueco | Sí | No | A→2→3c-i→4d→5a→6→7 |
| 28 | NUEVO | Tetra | Hueco | Sí | Sí | A→2→3c-i→4d→5b→6→7 |
| 29 | NUEVO | Tetra | Hueco | No | No | A→2→3c-ii→4d→5a→6→7 |
| 30 | NUEVO | Tetra | Hueco | No | Sí | A→2→3c-ii→4d→5b→6→7 |
| 31 | NUEVO | (Varias) | Hueco | No | No | A→2→3c-ii→(4x)→5a→6→7 |
| 32 | NUEVO | (Varias) | Hueco | No | Sí | A→2→3c-ii→(4x)→5b→6→7 |

### Casuísticas PRODUCTO MODIFICADO (16)

| # | Clasificación | Estructura | Print | Editable | Fotoregistro | Ruta |
|---|---|---|---|---|---|---|
| 33 | MODIFICADO | Heredada | Sin Impr | Ancho/Rep/FR | No | B→2→3a→4(RO)→5a→6→7 |
| 34 | MODIFICADO | Heredada | Sin Impr | Ancho/Rep/FR | Sí | B→2→3a→4(RO)→5b→6→7 |
| 35 | MODIFICADO | Heredada | Flexo | Ancho/Rep/FR | No | B→2→3b→4(RO)→5a→6→7 |
| 36 | MODIFICADO | Heredada | Flexo | Ancho/Rep/FR | Sí | B→2→3b→4(RO)→5b→6→7 |
| 37 | MODIFICADO | Heredada | Hueco | Ancho/Rep/FR | No | B→2→3c→4(RO)→5a→6→7 |
| 38 | MODIFICADO | Heredada | Hueco | Ancho/Rep/FR | Sí | B→2→3c→4(RO)→5b→6→7 |
| 39 | MODIFICADO | Heredada | Flexo Sí | Ancho/Rep/FR | No | B→2→3b-i→4(RO)→5a→6→7 |
| 40 | MODIFICADO | Heredada | Flexo Sí | Ancho/Rep/FR | Sí | B→2→3b-i→4(RO)→5b→6→7 |
| 41 | MODIFICADO | Heredada | Flexo No | Ancho/Rep/FR | No | B→2→3b-ii→4(RO)→5a→6→7 |
| 42 | MODIFICADO | Heredada | Flexo No | Ancho/Rep/FR | Sí | B→2→3b-ii→4(RO)→5b→6→7 |
| 43 | MODIFICADO | Heredada | Hueco Sí | Ancho/Rep/FR | No | B→2→3c-i→4(RO)→5a→6→7 |
| 44 | MODIFICADO | Heredada | Hueco Sí | Ancho/Rep/FR | Sí | B→2→3c-i→4(RO)→5b→6→7 |
| 45 | MODIFICADO | Heredada | Hueco No | Ancho/Rep/FR | No | B→2→3c-ii→4(RO)→5a→6→7 |
| 46 | MODIFICADO | Heredada | Hueco No | Ancho/Rep/FR | Sí | B→2→3c-ii→4(RO)→5b→6→7 |
| 47 | MODIFICADO | (4 tipos) | (Varias) | (Varias) | No | B→2→(3x)→4(RO)→5a→6→7 |
| 48 | MODIFICADO | (4 tipos) | (Varias) | (Varias) | Sí | B→2→(3x)→4(RO)→5b→6→7 |

---

## ESTADÍSTICAS CONSOLIDADAS

```
RESUMEN DEL ÁRBOL

Niveles de decisión:        7
Bifurcaciones principales:  12
Casuísticas NUEVO:          32
Casuísticas MODIFICADO:     16
TOTAL CASUÍSTICAS:          48

Campos obligatorios:        26 (44%)
Campos condicionales:       18 (31%)
Campos opcionales:          15 (25%)

Puntos de validación:       25+
Restricciones principales:  10
Reglas de negocio:          10

Estado de Guardado:
  - Borrador:               Editable
  - En Revisión:            Read-only
  - Aprobado:               Read-only
  - Rechazado:              Reeditable

Restricciones Críticas:
  1. Ancho: 100-20,000 mm
  2. Repetición: ≤ Ancho
  3. Fotoregistro: Max 1
  4. Ubicación FR: 50-(Ancho-50) mm
  5. Margen FR: 5-50 mm
  6. Estructura Mod: Heredada
  7. 405 SI: Validadas
  8. Grammage: ±10%
  9. Acabado: Recomendado
  10. Print Class: Condicional
```

---

## REFERENCIAS

- [[Restricción Producto Modificado]]
- [[Classification & Modification Structure]]
- [[Editable Fields for Nueva Estructura]]
- [[Dimensions & Accessories Relocation Complete]]

---

*Documento Anexo 2 - Árbol de Decisión Consolidado | LÁMINA | v1.0*
*Completa la documentación LÁMINA con Historia de Usuario, Especificación de Campos, Restricciones y Validaciones*
