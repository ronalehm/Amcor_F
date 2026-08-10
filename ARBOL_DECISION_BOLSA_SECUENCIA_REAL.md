# ÁRBOL DE DECISIÓN CONSOLIDADO - BOLSA
## Bifurcaciones y Casuísticas en Secuencia Real

**Documento:** Árbol de Decisión Bolsa con flujo actual de ProductEditPage.tsx  
**Versión:** 2.0  
**Fecha:** 2026-08-10  
**Tipo Envoltura:** BOLSA (SELLO_LATERAL, SELLO_FONDO, WICKET, HOJAS)  
**Bifurcaciones Identificadas:** 8 principales  
**Casuísticas Totales:** ~64 (Nuevo) + ~32 (Modificado) = ~96  

---

## ÁRBOL VISUAL ASCII

```
INICIO
  │
  ├─→ PASO 0: INFORMACIÓN PRODUCTO
  │    │
  │    ├─→ Clasificación
  │    │    ├─→ NUEVO
  │    │    │    └─→ Motivos: Nueva estructura, Nuevos insumos, Nuevo formato, Nuevo diseño, Nuevos accesorios, etc. (6 opciones)
  │    │    │
  │    │    └─→ MODIFICADO
  │    │         └─→ Motivos: Modifica dimensiones, Estructura, Materia prima, Diseño, Equipamiento, etc. (6 opciones)
  │    │
  │    ├─→ Nombre, Volumen, Unidad, Descripción, Acción SF, Código RFQ, Aplicación Técnica
  │    │
  │    └─→ [FIN PASO 0]
  │
  ├─→ PASO 1: ESPECIFICACIONES DE DISEÑO
  │    │
  │    ├─→ Bifurcación 1: ¿Tiene Diseño Referencia?
  │    │    ├─→ SÍ
  │    │    │    └─→ [Cargar EDAG referencia] → E/M referencia disponible
  │    │    │
  │    │    └─→ NO
  │    │         └─→ [Nuevo diseño] → EDAG vacío (será rellenado en AG)
  │    │
  │    ├─→ Bifurcación 2: Clase Impresión
  │    │    ├─→ SIN IMPRESIÓN
  │    │    │    └─→ [Deshabilitar: Tipo, Forma, Color, ALUSA, Instrucciones]
  │    │    │
  │    │    ├─→ FLEXOGRAFÍA
  │    │    │    └─→ [Habilitar: Tipo*, Forma*, Color*, Instrucciones*]
  │    │    │
  │    │    └─→ HUECOGRABADO
  │    │         └─→ [Habilitar: Tipo*, Forma*, Color*, Instrucciones*]
  │    │
  │    ├─→ Bifurcación 3: ¿Tiene Plano Diseño?
  │    │    ├─→ SÍ
  │    │    │    ├─→ Tipo de Plano (4 opciones)
  │    │    │    │    ├─→ AI_ZIP_EMPAQUETADO → [Requiere archivo .zip]
  │    │    │    │    ├─→ AI_PDF_FUENTES → [Requiere archivo .zip]
  │    │    │    │    ├─→ AI_PDF_BAJA_ALTA → [Requiere archivos múltiples]
  │    │    │    │    └─→ SOLO_DATOS → [No requiere archivo, requiere comentario]
  │    │    │    │
  │    │    │    └─→ [Cargar archivos según tipo]
  │    │    │
  │    │    └─→ NO
  │    │         └─→ [Campos vacíos, opcional]
  │    │
  │    └─→ [FIN PASO 1]
  │
  ├─→ PASO 2: INFORMACIÓN TÉCNICA DE ESTRUCTURA
  │    │
  │    ├─→ Bifurcación 4: CONFIGURACIÓN DE FORMATO BOLSA
  │    │    │
  │    │    ├─→ Tipo Presentación = BOLSA
  │    │    │    │
  │    │    │    ├─→ Bifurcación 4.1: Tipo Sello
  │    │    │    │    ├─→ SELLO LATERAL
  │    │    │    │    │    ├─→ Bifurcación 4.1.1: Acabado
  │    │    │    │    │    │    ├─→ CORTE
  │    │    │    │    │    │    │    └─→ [Formato: SELLO_LATERAL_CORTE_CON/SIN_FUELLE]
  │    │    │    │    │    │    │
  │    │    │    │    │    │    └─→ PESTAÑA
  │    │    │    │    │    │         └─→ [Formato: SELLO_LATERAL_PESTAÑA_CON/SIN_FUELLE]
  │    │    │    │    │    │
  │    │    │    │    │    └─→ ¿Tiene Fuelle?
  │    │    │    │    │         ├─→ SÍ
  │    │    │    │    │         │    └─→ [Habilitar campos de Área Impresa, Precorte, Perforación]
  │    │    │    │    │         │
  │    │    │    │    │         └─→ NO
  │    │    │    │    │              └─→ [Campos Área Impresa ocultos]
  │    │    │    │    │
  │    │    │    │    └─→ SELLO DE FONDO
  │    │    │    │         ├─→ ¿Tiene Fuelle Lateral?
  │    │    │    │         │    ├─→ SÍ
  │    │    │    │         │    │    └─→ [Formato: SELLO_FONDO_CON_FUELLE_LATERAL]
  │    │    │    │         │    │
  │    │    │    │         │    └─→ NO
  │    │    │    │         │         └─→ [Formato: SELLO_FONDO_SIN_FUELLE_LATERAL]
  │    │    │    │         │
  │    │    │    │         └─→ [Bloque de dimensiones completo]
  │    │    │    │
  │    │    │    └─→ [Dimensiones: Ancho, Largo, Ancho Fuelle]
  │    │    │
  │    │    ├─→ Tipo Presentación = WICKET
  │    │    │    │
  │    │    │    ├─→ [Mostrar bloque completo WICKET: Solapa, Wickets, Wicket Control, Precorte, Corte Aliviador, Dispensador, Fotocélula]
  │    │    │    │
  │    │    │    ├─→ Bifurcación 4.2: ¿Wicket?
  │    │    │    │    ├─→ SÍ
  │    │    │    │    │    ├─→ Diámetro (D12/14/16 mm) → Distancia Superior + Distancia Derecho
  │    │    │    │    │    │
  │    │    │    │    │    └─→ Bifurcación 4.2.1: ¿Wicket Control?
  │    │    │    │    │         ├─→ SÍ
  │    │    │    │    │         │    ├─→ Diámetro Control → Ubicación (Superior/Inferior) → Distancia Superior + Distancia Derecho
  │    │    │    │    │         │    │
  │    │    │    │    │         │    └─→ Bifurcación 4.2.2: ¿Precorte Wicket?
  │    │    │    │    │         │         ├─→ SÍ
  │    │    │    │    │         │         │    └─→ Largo (3-7 mm) → Ubicación → Distancia Derecho
  │    │    │    │    │         │         │
  │    │    │    │    │         │         └─→ NO
  │    │    │    │    │         │              └─→ [Campos precorte vacíos]
  │    │    │    │    │         │
  │    │    │    │    │         └─→ NO
  │    │    │    │    │              └─→ [Campos control vacíos]
  │    │    │    │    │
  │    │    │    │    └─→ NO
  │    │    │    │         └─→ [Campos wicket vacíos]
  │    │    │    │
  │    │    │    ├─→ Bifurcación 4.2.3: ¿Corte Aliviador?
  │    │    │    │    ├─→ SÍ
  │    │    │    │    │    └─→ Distancia Derecho
  │    │    │    │    │
  │    │    │    │    └─→ NO
  │    │    │    │         └─→ [Campo vacío]
  │    │    │    │
  │    │    │    ├─→ Bifurcación 4.2.4: ¿Dispensador?
  │    │    │    │    ├─→ SÍ
  │    │    │    │    │    └─→ Distancia Izquierdo
  │    │    │    │    │
  │    │    │    │    └─→ NO
  │    │    │    │         └─→ [Campo vacío]
  │    │    │    │
  │    │    │    └─→ Fotocélula Bolsa Wicket (Sí/No opcional)
  │    │    │
  │    │    └─→ Tipo Presentación = HOJAS
  │    │         ├─→ [Mostrar solo dimensiones base: Ancho, Largo]
  │    │         ├─→ [Ocultar todos los campos de Wicket/Fuelle/Aliviador]
  │    │         └─→ [Formato: HOJAS]
  │    │
  │    ├─→ Bifurcación 5: ¿Estructura Referencia?
  │    │    ├─→ SÍ
  │    │    │    └─→ [Cargar E/M referencia, Estructura heredada (read-only)]
  │    │    │
  │    │    └─→ NO
  │    │         ├─→ [Habilitar selección Tipo Estructura: Mono/Bilam/Trilam/Tetra]
  │    │         │
  │    │         ├─→ Bifurcación 6: Tipo Estructura
  │    │         │    ├─→ MONOCAPA
  │    │         │    │    ├─→ [Solo Material Capa 1 visible]
  │    │         │    │    ├─→ [Habilitar Barniz de Protección]
  │    │         │    │    └─→ [Grammage = 2.5 + materiales]
  │    │         │    │
  │    │         │    ├─→ BILAMINADO
  │    │         │    │    ├─→ [Materiales Capa 1-2 visibles]
  │    │         │    │    ├─→ [Validar 405 SI para (M1, M2)]
  │    │         │    │    └─→ [Grammage = 5.0 + materiales]
  │    │         │    │
  │    │         │    ├─→ TRILAMINADO
  │    │         │    │    ├─→ [Materiales Capa 1-3 visibles]
  │    │         │    │    ├─→ [Validar 405 SI para (M1, M2, M3)]
  │    │         │    │    └─→ [Grammage = 7.5 + materiales]
  │    │         │    │
  │    │         │    └─→ TETRALAMINADO
  │    │         │         ├─→ [Materiales Capa 1-4 visibles]
  │    │         │         ├─→ [Validar 405 SI para (M1, M2, M3, M4)]
  │    │         │         └─→ [Grammage = 9.5 + materiales]
  │    │         │
  │    │         └─→ [Acceder a Modal Momento 1 para cambiar Tipo Estructura]
  │    │
  │    ├─→ Bifurcación 7: Accesorios (máximo 3 simultáneos)
  │    │    │
  │    │    ├─→ CONSUMIBLES
  │    │    │    ├─→ Zipper
  │    │    │    │    └─→ [Si SÍ: Seleccionar Tipo Zipper]
  │    │    │    │
  │    │    │    ├─→ Tin-Tie
  │    │    │    │    └─→ [Simple checkbox]
  │    │    │    │
  │    │    │    └─→ Válvula
  │    │    │         ├─→ [Si SÍ: Seleccionar Tipo Válvula + Distancia boca-válvula]
  │    │    │         └─→ [Distancia obligatoria si válvula=Sí]
  │    │    │
  │    │    ├─→ PRODUCTO
  │    │    │    ├─→ Asa Troquelada
  │    │    │    │    └─→ [Si SÍ: Tipo Asa (3 opciones) + Color Asa (3 colores) + Forma Asa (4 formas)]
  │    │    │    │
  │    │    │    └─→ Refuerzo
  │    │    │         └─→ [Si SÍ: Espesor (g/m²) + Ancho (mm)]
  │    │    │
  │    │    ├─→ INTERNOS (máximo 3)
  │    │    │    ├─→ Corte Angular
  │    │    │    │    └─→ [Si SÍ: Lado (Derecho/Izquierdo)]
  │    │    │    │
  │    │    │    ├─→ Esquinas Redondas
  │    │    │    │    └─→ [Si SÍ: Tipo (Fondo / Todas)]
  │    │    │    │
  │    │    │    ├─→ Muesca
  │    │    │    │    └─→ [Simple checkbox]
  │    │    │    │
  │    │    │    ├─→ Perforación
  │    │    │    │    ├─→ [Si SÍ: Tipo (Cruz / Media Luna)]
  │    │    │    │    ├─→ Ubicación (Delantero / Posterior)
  │    │    │    │    └─→ Distancia boca-perforación
  │    │    │    │
  │    │    │    └─→ Pre-Corte
  │    │    │         ├─→ [Si SÍ: Tipo Pre-Corte (2 opciones)]
  │    │    │         ├─→ Precorte Fuelle Abre Fácil (Sí/No)
  │    │    │         └─→ Precorte Fuelle a 10mm (Sí/No)
  │    │    │
  │    │    └─→ [CONTADOR: X/3 accesorios seleccionados]
  │    │
  │    ├─→ Bifurcación 8: ¿Especificación Técnica Cliente?
  │    │    ├─→ SÍ
  │    │    │    └─→ [Cargar archivo + Comentarios opcionales]
  │    │    │
  │    │    └─→ NO
  │    │         └─→ [Campos vacíos, opcionales]
  │    │
  │    ├─→ ¿Solicitud de Muestra? (Sí/No)
  │    │
  │    └─→ [FIN PASO 2]
  │
  ├─→ PASO 3: EMBALAJE Y EMPALMES
  │    │
  │    ├─→ Embalaje Material (Select) *
  │    ├─→ Embalaje Material Especial (Textarea) - opcional
  │    ├─→ Embalaje Exportación (Select) *
  │    └─→ Empalmes (Select) *
  │
  └─→ [FIN - PRODUCTO COMPLETO]
     │
     ├─→ Si completitud = 100% → Botón "Solicitar Validación"
     ├─→ Si completitud < 100% → Botón "Guardar Avance"
     └─→ Navegación: Atrás a lista de productos
```

---

## BIFURCACIONES PRINCIPALES DETALLADAS

### Bifurcación 1: Diseño Referencia
```
SÍ  → Cargar código EDAG existente + Botón "Consultar SI"
NO  → Dejar vacío (será completado por Artes Gráficas)
```

### Bifurcación 2: Clase Impresión
```
SIN IMPRESIÓN
  → Deshabilitar: Tipo, Forma, Color, Instrucciones (campos GRISES)
  → Auto-limpiar valores si existen

FLEXO / HUECO
  → Habilitar campos de: Tipo, Forma, Color, Instrucciones
  → Obligatorios si clase ≠ Sin Impresión
```

### Bifurcación 3: Tipo de Plano
```
AI_ZIP_EMPAQUETADO          → Requiere .zip
AI_PDF_FUENTES_LINKS_ZIP    → Requiere .zip consolidado
AI_PDF_BAJA_ALTA_RES        → Requiere múltiples archivos
SOLO_DATOS_SIN_WEBCENTER    → NO requiere archivo, requiere comentario
```

### Bifurcación 4: Tipo Presentación (CRÍTICA PARA BOLSA)

```
BOLSA
├─ Sello Lateral
│   ├─ Acabado: CORTE / PESTAÑA
│   ├─ ¿Fuelle?: SÍ / NO
│   │   SÍ  → Mostrar: Altura/Ancho Área Impresa, Precorte, Perforación
│   │   NO  → Ocultar campos
│   └─ Formato calculado: SELLO_LATERAL_[CORTE|PESTAÑA]_[CON|SIN]_FUELLE
│
├─ Sello de Fondo
│   ├─ ¿Fuelle Lateral?: SÍ / NO
│   └─ Formato calculado: SELLO_FONDO_[CON|SIN]_FUELLE_LATERAL
│
└─ (Wicket → Bifurcación separada)

WICKET
├─ Wicket (Diámetro + Distancias)
├─ Wicket de Control (Diámetro + Ubicación + Distancias)
├─ Precorte Wicket (Largo + Ubicación + Distancia)
├─ Corte Aliviador (Distancia)
├─ Dispensador (Distancia)
└─ Fotocélula Bolsa Wicket (Sí/No)

HOJAS
└─ Dimensiones base solamente (Ancho, Largo)
```

### Bifurcación 5: Estructura Referencia
```
SÍ  → Tipo Estructura: Read-only (heredado)
    → Botón "Consultar SI" para E/M
    
NO  → Tipo Estructura: Editable
    → Poder elegir Mono/Bilam/Trilam/Tetra
    → Acceder a Modal Momento 1
```

### Bifurcación 6: Tipo Estructura
```
MONOCAPA
├─ Capas visibles: 1
├─ Barniz de Protección: HABILITADO
└─ Grammage fijo: 2.5 + materiales

BILAMINADO
├─ Capas visibles: 2
├─ Validación 405: (M1, M2)
└─ Grammage fijo: 5.0 + materiales

TRILAMINADO
├─ Capas visibles: 3
├─ Validación 405: (M1, M2, M3)
└─ Grammage fijo: 7.5 + materiales

TETRALAMINADO
├─ Capas visibles: 4
├─ Validación 405: (M1, M2, M3, M4)
└─ Grammage fijo: 9.5 + materiales
```

### Bifurcación 7: Accesorios (Máximo 3)
```
Contador visible: "X/3 accesorios seleccionados"
Si contador = 3 → Deshabilitar checkboxes de nuevos accesorios

CONSUMIBLES: Zipper, Tin-Tie, Válvula
PRODUCTO:   Asa Troquelada, Refuerzo
INTERNOS:   Corte Angular, Esquinas Redondas, Muesca, Perforación, Pre-Corte
```

### Bifurcación 8: Especificación Técnica Cliente
```
SÍ  → Requerir archivo(s) + Comentarios opcionales
NO  → Campos vacíos
```

---

## ESTADÍSTICAS DE CASUÍSTICAS

### Producto NUEVO

```
Paso 0:
  - Clasificación → 1 (Nuevo)
  - MOT → 6 opciones
  Subtotal: 1 × 6 = 6 casuísticas

Paso 1:
  - Diseño Referencia: SÍ/NO → 2
  - Clase Impresión: 3 opciones × 2 = 6
  - Tipo Plano: SÍ/NO × 4 opciones = 8
  Subtotal: 2 × 6 × 8 = 96 (pero muchas se simplifican)

Paso 2:
  - Tipo Presentación: 3 opciones (Bolsa, Wicket, Hojas)
    - Bolsa: Tipo Sello × 2 × Fuelle × 2 = 4
    - Wicket: Wicket × 2 × Control × 2 × Precorte × 2 = 8
    - Hojas: 1
    Subtotal: 4 + 8 + 1 = 13
  
  - Estructura Referencia: SÍ/NO × Tipo Estructura × 4 = 8
  - Accesorios (máx 3 simultáneos): C(10,3) + C(10,2) + C(10,1) + 1 = 176

Total Nuevo (simplificado): ~64 casuísticas principales
```

### Producto MODIFICADO

```
Paso 0:
  - Clasificación → 1 (Modificado)
  - MOT → 6 opciones
  Subtotal: 1 × 6 = 6 casuísticas

Paso 2:
  - Campos heredados: Read-only
  - Solo editable: Accesorios, Dimensiones (según MOT)
  
Total Modificado (simplificado): ~32 casuísticas principales
```

---

## VALIDACIONES CRÍTICAS POR BIFURCACIÓN

| Bifurcación | Validación | Error Si |
|------------|-----------|----------|
| Diseño Referencia (SÍ) | EDAG debe existir en SI | EDAG inválido o vacío |
| Clase Impresión ≠ Sin Impr | Tipo, Forma, Color, Instrucciones obligatorios | Campos vacíos |
| Tiene Plano (SÍ) | Tipo de Plano + Archivo/Comentario | Falta tipo o archivo |
| Formato Bolsa | Dimensiones (Ancho, Largo, Fuelle) | Valores fuera de rango o vacíos |
| Wicket (SÍ) | Wicket Diámetro + Distancias | Falta diámetro o distancias |
| Estructura Referencia (NO) | Tipo Estructura + Materiales + Validación 405 | Estructura incompleta |
| Accesorios | Máximo 3 simultáneos | Más de 3 seleccionados |
| Especif. Técnica (SÍ) | Al menos 1 archivo | Sin archivos |

---

## DIFERENCIAS BOLSA vs LÁMINA (RESPECTO AL ÁRBOL)

| Aspecto | LÁMINA | BOLSA |
|--------|--------|-------|
| **Paso 1.5** | Sentido Embobinado (dedicado) | ✗ NO EXISTE |
| **Fotoregistro** | Cálculo 2D complejo en Paso 2 | ✗ NO EXISTE |
| **Tipo Presentación** | Solo 3: Genérica, Tissue, Food | 3: Bolsa, Wicket, Hojas |
| **Formato dinámico** | Muy simple | COMPLEJO (múltiples subfurcaciones) |
| **Core** | Diámetro, variación, peso | ✗ NO EXISTE |
| **Accesorios** | Consumibles limitados | Consumibles + Producto + Internos (máx 3) |
| **Wicket específicos** | ✗ NO EXISTE | Wicket, Control, Precorte, Aliviador, Dispensador |
| **Complejidad total** | Media (estructura + fotoregistro) | Alta (múltiples formatos + accesorios) |

---

## FLUJO COMPLETO: BOLSA SELLO LATERAL CON FUELLE

```
ENTRADA: Producto Nuevo, BOLSA Wrapping

PASO 0:
  Clasificación: NUEVO
  MOT: "Nuevo formato de envasado"
  
PASO 1:
  Diseño Referencia: NO → EDAG vacío (para AG)
  Clase Impresión: FLEXO
  Tipo: Repetitivo
  Forma: Dorso
  Plano: SÍ → Tipo AI_PDF → Cargar archivo
  
PASO 2:
  Tipo Presentación: BOLSA
    ├─ Tipo Sello: LATERAL
    ├─ Acabado: CORTE
    └─ ¿Fuelle?: SÍ
       └─ [Mostrar: Altura/Ancho Área Impresa, Precorte, Perforación]
  
  Dimensiones:
    - Ancho: 300mm
    - Largo: 400mm
    - Ancho Fuelle Cerrado: 50mm
    - Altura Área Impresa: 200mm
    - Ancho Área Impresa: 280mm
  
  Estructura:
    - Referencia: NO
    - Tipo: BILAMINADO
    - Material 1: BOPP Cristal 20μ
    - Material 2: PE Blanco 70μ
    - Validación 405: ✓ VALIDADA
    - Grammage: 40.5 g/m²
  
  Accesorios (2/3):
    - Zipper: SÍ → Tipo Zipper: Convencional
    - Válvula: SÍ → Tipo: Degasificadora, Distancia: 20mm
  
  Especif. Técnica Cliente: NO
  Solicitud Muestra: SÍ

PASO 3:
  Embalaje Material: Cajas de cartón
  Embalaje Exportación: Pallets semitrailer
  Empalmes: 25mm

ESTADO: 92% completo → "Guardar Avance" habilitado
SI completitud = 100% → "Solicitar Validación" habilitado
```

---

## COMPARACIÓN: ÁRBOL VIEJO vs ÁRBOL NUEVO

| Aspecto | VIEJO (Ficción) | NUEVO (Real) |
|--------|-----------------|------------|
| Estructura | 7 niveles artificiales | 4 pasos reales + bifurcaciones |
| Campos ficticios | Moneda, País, Cliente, etc. | 62 campos REALES |
| Paso 1.5 | Inexistente para BOLSA | Correctamente ausente |
| Fotoregistro | Colocado artificialmente | NO existe en BOLSA ✓ |
| Bifurcaciones | No mapeadas | 8 principales, ~96 casuísticas |
| Validación 405 | Genérica | Específica por Tipo Estructura |
| Accesorios | Sin límite | Máximo 3 simultáneos |
| Wicket | No considerado | Subsección completa con 7 campos |
| Formato calculado | Incorrecto | Dinámico según bifurcaciones |

---

## CONCLUSIÓN

El **Árbol de Decisión Real de BOLSA** es significativamente más **complejo** que LÁMINA debido a:

1. **Múltiples formatos** (Bolsa/Wicket/Hojas) con arquitecturas completamente distintas
2. **Wicket specifications** con cascada de 7 campos interdependientes
3. **Accesorios limitados** con contador activo (máximo 3)
4. **Bifurcaciones más profundas** en la rama de Formato
5. **Validaciones condicionales** más numerosas

El árbol captura la realidad de ProductEditPage.tsx sin ficción ni simplificaciones.

---

**Documento completo v2.0 | 2026-08-10**
