# CAMPOS VISIBLES EN UI DE PRODUCTEDIPAGE CON CATÁLOGOS Y VALORES
## Mapeo Completo de Campos Renderizados, Catálogos y Valores Actuales

**Documento:** Campos UI con catálogos en tiempo real  
**Versión:** 1.0  
**Fecha:** 2026-08-10  
**Total Campos:** 157 campos FormSelect/FormInput/FormTextarea  
**Fuente:** ProductEditPage.tsx líneas renderizadas

---

## PASO 0: INFORMACIÓN PRODUCTO (12 Campos Visibles)

### 1. **Clasificación** ✅
```
Campo: form.classification
Tipo: FormSelect
Catálogo: PRODUCT_CATALOGS.clasificacion
Valores Actuales: 2
├─ Producto Nuevo
└─ Producto Modificado
Obligatorio: ✅ Sí
Editable: ✅ Sí (solo Nuevo)
```

### 2. **Modificación (MOT)** ✅
```
Campo: form.motivoModificacion
Tipo: Checkboxes (Múltiple)
Catálogo: PRODUCT_MODIFICATION_CATALOG (dinámico por clasificación)
Valores según Clasificación:
  - Producto Nuevo: 6 opciones
    ├─ Nueva estructura
    ├─ Nuevos insumos
    ├─ Nuevo formato de envasado
    ├─ Nuevo diseño
    ├─ Extensión de Línea
    └─ Nuevo equipamiento / proceso / temperatura
  
  - Producto Modificado: 12 opciones
    ├─ Modifica Dimensiones
    ├─ Modifica Propiedades
    ├─ Cambia Estructura
    ├─ Cambia Materia Prima
    ├─ Cambia Diseño
    ├─ Portafolio Estándar
    ├─ Nuevo equipamiento / proceso / temperatura
    ├─ Referencia aprobada sin cambios
    ├─ Mismo producto, misma especificación
    ├─ Cambio de insumo no homologado
    └─ (2 más)
Obligatorio: ✅ Sí
Editable: ✅ Sí
```

### 3. **Nombre Producto** ✅
```
Campo: form.projectName
Tipo: FormInput (Texto)
Catálogo: NINGUNO (libre)
Valores: Texto libre
Obligatorio: ✅ Sí (Nuevo), Read-only (Modificado)
Editable: ✅ Sí (solo Nuevo)
Ejemplo: "Café Molido 250g", "Aceite Vegetal 2L"
```

### 4. **Volumen Referencial** ✅
```
Campo: form.estimatedVolume
Tipo: FormInput (Número)
Catálogo: NINGUNO (libre)
Valores: Número libre
Obligatorio: ✅ Sí (Nuevo), Read-only (Modificado)
Editable: ✅ Sí (solo Nuevo)
Ejemplo: "250", "2000"
```

### 5. **Unidad de Medida** ✅
```
Campo: form.unitOfMeasure
Tipo: FormSelect
Catálogo: CATALOG_VALUES_SEED (unit_measure)
Valores Actuales: 7
├─ unidad
├─ millares
├─ kilos
├─ metros
├─ millones_unidades
├─ toneladas
└─ rollos
Obligatorio: ✅ Sí (Nuevo), Read-only (Modificado)
Editable: ✅ Sí (solo Nuevo)
```

### 6. **Descripción Breve** ✅
```
Campo: form.projectDescription
Tipo: FormTextarea
Catálogo: NINGUNO (libre)
Valores: Texto libre
Obligatorio: ✅ Sí
Editable: ✅ Sí
Placeholder: "Necesidad técnica o comercial..."
```

### 7. **Acción Salesforce** ✅
```
Campo: form.salesforceAction
Tipo: FormInput (Texto)
Catálogo: NINGUNO (libre)
Valores: Texto libre
Obligatorio: ❌ No (Opcional)
Editable: ✅ Sí
Formato: "A-XXXXXX"
Ejemplo: "A-001234"
```

### 8. **Código RFQ** ✅
```
Campo: form.rfqCode
Tipo: FormInput (Texto)
Catálogo: NINGUNO (libre)
Valores: Texto libre
Obligatorio: ❌ No (Opcional)
Editable: ✅ Sí
Ejemplo: "RFQ-2024-001"
```

### 9. **Aplicación Técnica** ✅
```
Campo: form.technicalApplication
Tipo: FormSelect
Catálogo: PRODUCT_CATALOGS.aplicacionTecnica
Valores Actuales: 45
├─ Seco/Galletas
├─ Seco/Fideos/Fideos
├─ Seco/Fideos/Fideos a granel
├─ ... (42 más)
└─ Otros/Contacto Indirecto/Líquido
Obligatorio: ✅ Sí
Editable: ✅ Sí
```

### 10. **Código Empaque Cliente** ✅
```
Campo: form.customerPackingCode
Tipo: FormInput (Texto)
Catálogo: NINGUNO (libre)
Valores: Texto libre
Obligatorio: ❌ No (Opcional)
Editable: ✅ Sí
Ejemplo: "SKU-CLIENT-001"
```

### 11. **Comentarios** ✅
```
Campo: form.projectComments (o similar)
Tipo: FormTextarea
Catálogo: NINGUNO (libre)
Valores: Texto libre
Obligatorio: ❌ No (Opcional)
Editable: ✅ Sí
Placeholder: "Observaciones iniciales..."
```

### 12. **Ejecutivos Comerciales** ✅
```
Campo: form.executiveId (multi-select)
Tipo: FormMultiSelect
Catálogo: executiveStorage.ts (getActiveExecutiveRecords)
Valores Actuales: 66+ ejecutivos
├─ BOERO A.
├─ BALDEON, EDUARDO
├─ Katia Guardamino
├─ Augusto Otero
└─ ... (62 más)
Obligatorio: ✅ Sí
Editable: ✅ Sí
Fuente: executiveStorage hardcoded
```

---

## PASO 1: ESPECIFICACIONES DE DISEÑO (17 Campos Visibles)

### 13. **¿Diseño Referencia?** ✅
```
Campo: form.hasEdagReference
Tipo: FormSelect (Sí/No)
Catálogo: YES_NO_OPTIONS (hardcoded)
Valores: 2
├─ Sí
└─ No
Obligatorio: ✅ Sí
Condicional: Habilita "EDAG Referencia" si = "Sí"
```

### 14. **EDAG Referencia** ✅
```
Campo: form.edagCode + form.edagVersion
Tipo: FormInput (Texto)
Catálogo: NINGUNO (lookup desde getEdagByCodeAndVersion)
Valores: Varía según BD EDAG
Obligatorio: ✅ Sí (si hasEdagReference = Sí)
Formato: "NNNNN-NN" (Ej: "00001-01")
Condicional: Solo visible si hasEdagReference = "Sí"
Botón: "Consultar SI" → Llena printClass, printType, printForm, blueprintFormat, colorObjective
```

### 15. **Clase de Impresión** ✅
```
Campo: form.printClass
Tipo: FormSelect
Catálogo: PRODUCT_CATALOGS.claseDeImpresion (via getCatalogOptions("print_class"))
Valores Actuales: 3
├─ Flexo
├─ Huecograbado
└─ Sin impresión
Obligatorio: ✅ Sí
Editable: ✅ Sí (depende de canEditDesign)
Condicional: printClass="Sin impresión" desactiva Tipo/Forma Impresión
```

### 16. **Tipo de Impresión** ✅
```
Campo: form.printType
Tipo: FormSelect
Catálogo: PRODUCT_CATALOGS.tipoDeImpresion (via getCatalogOptions("print_type"))
Valores Actuales: 2
├─ Repetitivo
└─ Continuo
Obligatorio: ✅ Sí (si printClass ≠ "Sin impresión")
Editable: ✅ Sí (si printClass ≠ "Sin impresión")
Condicional: Solo visible si printClass ≠ "Sin impresión"
```

### 17. **Forma de Impresión** ✅
```
Campo: form.printForm
Tipo: FormSelect
Catálogo: PRODUCT_CATALOGS.formaDeImpresion
Valores Actuales: 7
├─ Dorso, s/lam.
├─ Dorso, c/lam. Su. Tr.
├─ Dorso, c/lam. Su. Bl.
├─ Dorso, c/lam. Su. Me.
├─ Dorso, c/lam. Su. Tr. Im.
├─ Dorso, c/lam. Su. Va.
└─ Por Superficie
Obligatorio: ✅ Sí (si printClass ≠ "Sin impresión")
Editable: ✅ Sí (si printClass ≠ "Sin impresión")
Condicional: Solo visible si printClass ≠ "Sin impresión"
```

### 18. **Especificaciones Especiales** ✅
```
Campo: form.specialDesignSpecs
Tipo: FormSelect
Catálogo: SPECIAL_DESIGN_SPECS_OPTIONS (hardcoded)
Valores Actuales: 5
├─ Tintas Holográficas
├─ Efectos/ texturas/características especiales
├─ Acabados Especiales o Barnices nuevos
├─ Otros (comentar cuáles)
└─ No aplica
Obligatorio: ❌ No (Opcional)
Editable: ✅ Sí
```

### 19. **Comentarios Especiales** ✅
```
Campo: form.specialDesignComments
Tipo: FormTextarea
Catálogo: NINGUNO (libre)
Valores: Texto libre
Obligatorio: ✅ Sí (si specialDesignSpecs = "Otros (comentar cuáles)")
Editable: ✅ Sí
Condicional: Solo visible si specialDesignSpecs = "Otros (comentar cuáles)"
Placeholder: "Comentarios adicionales de Artes Gráficas..."
```

### 20. **Objetivo de Color** ✅
```
Campo: form.colorObjective
Tipo: FormSelect
Catálogo: PRODUCT_CATALOGS.objetivoDeColor
Valores Actuales: 5
├─ No existe objetivo trabajar a criterio
├─ Muestra física
├─ Color Pantone del archivo
├─ Producción de referencia
└─ Otros
Obligatorio: ✅ Sí (si printClass ≠ "Sin impresión")
Editable: ✅ Sí (si printClass ≠ "Sin impresión")
Condicional: Solo visible si printClass ≠ "Sin impresión"
```

### 21. **Objetivo de Color - Otro** ✅
```
Campo: form.colorObjectiveOther
Tipo: FormInput (Texto)
Catálogo: NINGUNO (libre)
Valores: Texto libre
Obligatorio: ✅ Sí (si colorObjective = "Otros")
Editable: ✅ Sí
Condicional: Solo visible si colorObjective = "Otros"
```

### 22. **Aprobador Prensa** ✅
```
Campo: form.pressApprover
Tipo: FormSelect
Catálogo: PRODUCT_CATALOGS.aprobador
Valores Actuales: 3
├─ Cliente
├─ Supervisor
└─ Ejecutivo Comercial / Coordinador AAGG
Obligatorio: ✅ Sí (si printClass ≠ "Sin impresión")
Editable: ✅ Sí (si printClass ≠ "Sin impresión")
Condicional: Solo visible si printClass ≠ "Sin impresión"
```

### 23. **Código ALUSA** ✅
```
Campo: form.alusaReferenceCode
Tipo: FormInput (Texto)
Catálogo: NINGUNO (libre)
Valores: Texto libre
Obligatorio: ❌ No (Opcional)
Editable: ✅ Sí
Placeholder: "Referencia técnica..."
```

### 24. **Instrucciones Trabajo Diseño** ✅
```
Campo: form.designWorkInstructions
Tipo: FormTextarea
Catálogo: NINGUNO (libre)
Valores: Texto libre
Obligatorio: ✅ Sí (si printClass ≠ "Sin impresión")
Editable: ✅ Sí (si printClass ≠ "Sin impresión")
Condicional: Solo visible si printClass ≠ "Sin impresión"
```

### 25. **¿Tiene Plano Diseño?** ✅
```
Campo: form.hasDesignPlan
Tipo: FormSelect (Sí/No)
Catálogo: YES_NO_OPTIONS (hardcoded)
Valores: 2
├─ Sí
└─ No
Obligatorio: ✅ Sí
Editable: ✅ Sí
Condicional: Habilita "Tipo de Plano" si = "Sí"
```

### 26. **Tipo de Plano** ✅
```
Campo: form.designPlanType
Tipo: FormSelect
Catálogo: HARDCODED (dinámico según lógica)
Valores Actuales: 4 opciones
Obligatorio: ✅ Sí (si hasDesignPlan = "Sí")
Editable: ✅ Sí
Condicional: Solo visible si hasDesignPlan = "Sí"
```

### 27. **Archivos Plano** ✅
```
Campo: form.designPlanComments (o files)
Tipo: File Upload
Catálogo: NINGUNO (libre)
Valores: Archivos PDF/IMG
Obligatorio: ✅ Sí (si designPlanType requiere archivo)
Editable: ✅ Sí
Condicional: Solo visible si diseñoPlan es requerido
```

### 28. **Comentario Plano** ✅
```
Campo: form.designPlanComments
Tipo: FormTextarea
Catálogo: NINGUNO (libre)
Valores: Texto libre
Obligatorio: ✅ Sí (si designPlanType = "SOLO_DATOS_SIN_WEBCENTER")
Editable: ✅ Sí
Condicional: Solo visible si tipo = SOLO_DATOS_SIN_WEBCENTER
```

### 29. **Perímetro Calculado** ✅
```
Campo: form.perimeterMm
Tipo: Display (Read-only)
Catálogo: NINGUNO (calculado)
Valores: Calculado automáticamente
Obligatorio: ❌ No (automático)
Editable: ❌ No (read-only)
Condicional: Solo visible si es calculable
```

---

## PASO 1.5: SENTIDO DE EMBOBINADO (LÁMINA ONLY) (2 Campos Visibles)

### 30. **Sentido de Embobinado** ✅ LÁMINA ONLY
```
Campo: form.rewindingDirection
Tipo: FormSelect
Catálogo: PRODUCT_CATALOGS.sentidoDeEmbobinado
Valores Actuales: 8
├─ Sentido 1
├─ Sentido 2
├─ Sentido 3
├─ Sentido 4
├─ Sentido 5
├─ Sentido 6
├─ Sentido 7
└─ Sentido 8
Obligatorio: ✅ Sí (LÁMINA)
Editable: ✅ Sí (LÁMINA)
Visible: ❌ NO en BOLSA/POUCH
Paso: 1.5
```

### 31. **Referencia de Sentido** ✅ LÁMINA ONLY
```
Campo: form.rewindingDirectionRef
Tipo: FormInput (Texto)
Catálogo: NINGUNO (libre)
Valores: Texto libre
Obligatorio: ❌ No
Editable: ✅ Sí (LÁMINA)
Visible: ❌ NO en BOLSA/POUCH
Paso: 1.5
```

---

## PASO 2: INFORMACIÓN TÉCNICA ESTRUCTURA (Variable por Envoltura)

### SUBSECCIÓN: CONFIGURACIÓN DE FORMATO

#### Para POUCH (20 campos específicos):

### 32. **Familia de Pouch** ✅ POUCH ONLY
```
Campo: form.tipoFormatoPouch
Tipo: FormSelect
Catálogo: HARDCODED (en ProductEditPage)
Valores Actuales: 4
├─ Stand Up Pouch
├─ Pouch Plano
├─ Pouch con Sello Central
└─ Pouch con Sello en Fuelle
Obligatorio: ✅ Sí (POUCH)
Editable: ✅ Sí (POUCH)
Visible: ❌ NO en LÁMINA/BOLSA
Paso: 2
Bifurcación: Activa subcampos según selección
```

### 33. **Tipo de Stand Up** ✅ POUCH ONLY (Condicional)
```
Campo: form.tipoStandUpPouch
Tipo: FormSelect
Catálogo: HARDCODED (en ProductEditPage)
Valores Actuales: 3
├─ Sello K
├─ Normal
└─ Doy Pack
Obligatorio: ✅ Sí (si Familia = "Stand Up Pouch")
Editable: ✅ Sí
Visible: ❌ Solo si Familia = "Stand Up Pouch"
Paso: 2
Bifurcación: Activa "Tipo Fuelle" y "Base Doy Pack" si = "Doy Pack"
```

### 34. **Tipo de Fuelle Stand Up** ✅ POUCH ONLY (Condicional)
```
Campo: form.tipoFuelleStandUpPouch
Tipo: FormSelect
Catálogo: HARDCODED (en ProductEditPage)
Valores Actuales: 2
├─ Fuelle Propio
└─ Fuelle Insertado
Obligatorio: ✅ Sí (si Stand Up = "Doy Pack")
Editable: ✅ Sí
Visible: ❌ Solo si Stand Up = "Doy Pack"
Paso: 2
Bifurcación: Habilita "Base Doy Pack"
```

### 35. **Base del Doy Pack** ✅ POUCH ONLY (Condicional)
```
Campo: form.formaDoyPackPouch
Tipo: FormSelect
Catálogo: HARDCODED (en ProductEditPage)
Valores Actuales: 2
├─ Redondo
└─ Cuadrado
Obligatorio: ✅ Sí (si Stand Up = "Doy Pack" Y Fuelle está seleccionado)
Editable: ✅ Sí (desactivado si no hay Tipo Fuelle)
Visible: ❌ Solo si Stand Up = "Doy Pack"
Paso: 2
Restricción: Ancho 80-230mm, Largo 134-340mm
```

### 36. **Cantidad de Sellos** ✅ POUCH ONLY (Condicional)
```
Campo: form.cantidadSellosPouchPlano
Tipo: FormSelect
Catálogo: HARDCODED (en ProductEditPage)
Valores Actuales: 2
├─ Dos sellos
└─ Tres sellos
Obligatorio: ✅ Sí (si Familia = "Pouch Plano")
Editable: ✅ Sí
Visible: ❌ Solo si Familia = "Pouch Plano"
Paso: 2
Bifurcación: Activa "Accesorios Pouch Plano"
```

### 37. **Material Sello Central** ✅ POUCH ONLY (Condicional)
```
Campo: form.materialSelloCentralPouch
Tipo: FormSelect
Catálogo: HARDCODED (en ProductEditPage)
Valores Actuales: 3
├─ PE-PE/PE
├─ Aleta
└─ Otro material
Obligatorio: ✅ Sí (si Familia = "Pouch con Sello Central")
Editable: ✅ Sí
Visible: ❌ Solo si Familia = "Pouch con Sello Central"
Paso: 2
Bifurcación: Activa especificaciones según material
```

### 38. **¿Tiene Fuelle? (Sello Central)** ✅ POUCH ONLY (Condicional)
```
Campo: form.tieneFuelleSelloCentralPouch
Tipo: FormSelect (Sí/No)
Catálogo: YES_NO_OPTIONS (hardcoded)
Valores: 2
├─ Sí
└─ No
Obligatorio: ✅ Sí (si Familia = "Pouch con Sello Central")
Editable: ✅ Sí
Visible: ❌ Solo si Familia = "Pouch con Sello Central"
Paso: 2
Bifurcación: Activa especificaciones de fuelle según selección
```

### 39. **Tipo Sello en Fuelle** ✅ POUCH ONLY (Condicional)
```
Campo: form.tipoSelloFuellePouch
Tipo: FormSelect
Catálogo: HARDCODED (en ProductEditPage)
Valores Actuales: 2
├─ Tipo 4-1
└─ Tipo 1-1
Obligatorio: ✅ Sí (si Familia = "Pouch con Sello en Fuelle")
Editable: ✅ Sí
Visible: ❌ Solo si Familia = "Pouch con Sello en Fuelle"
Paso: 2
```

---

#### Para BOLSA (18 campos específicos):

### 40. **Tipo de Presentación** ✅ BOLSA ONLY
```
Campo: form.tipoFormatoBolsa
Tipo: FormSelect
Catálogo: HARDCODED (en ProductEditPage)
Valores Actuales: 3
├─ Bolsa Sellada
├─ Wicket
└─ Hojas
Obligatorio: ✅ Sí (BOLSA)
Editable: ✅ Sí (BOLSA)
Visible: ❌ NO en LÁMINA/POUCH
Paso: 2
Bifurcación: Activa subcampos según presentación (Wicket/Sello/Hojas)
```

### 41. **Tipo de Sello (Bolsa)** ✅ BOLSA ONLY (Condicional)
```
Campo: form.tipoSelloBolsa
Tipo: FormSelect
Catálogo: HARDCODED (en ProductEditPage)
Valores Actuales: 2
├─ Sello lateral
└─ Sello de fondo
Obligatorio: ✅ Sí (si Presentación = "Bolsa Sellada")
Editable: ✅ Sí
Visible: ❌ Solo si Presentación = "Bolsa Sellada"
Paso: 2
```

### 42. **Acabado de Sello Lateral** ✅ BOLSA ONLY (Condicional)
```
Campo: form.acabadoBolsa
Tipo: FormSelect
Catálogo: HARDCODED (en ProductEditPage)
Valores Actuales: 2
├─ Pestaña
└─ Corte
Obligatorio: ✅ Sí (si Sello = "Sello lateral")
Editable: ✅ Sí
Visible: ❌ Solo si Sello = "Sello lateral"
Paso: 2
```

### 43. **¿Tiene Fuelle? (Bolsa)** ✅ BOLSA ONLY (Condicional)
```
Campo: form.tieneFuelleBolsa
Tipo: FormSelect (Sí/No)
Catálogo: YES_NO_OPTIONS (hardcoded)
Valores: 2
├─ Sí
└─ No
Obligatorio: ✅ Sí (si Presentación = "Bolsa Sellada")
Editable: ✅ Sí
Visible: ❌ Solo si Presentación = "Bolsa Sellada"
Paso: 2
```

### 44. **Tipo de Fuelle (Bolsa)** ✅ BOLSA ONLY (Condicional)
```
Campo: form.tipoFuelleBolsa
Tipo: FormSelect
Catálogo: HARDCODED (en ProductEditPage)
Valores Actuales: 2
├─ Fondo
└─ Lateral
Obligatorio: ❌ No (Opcional)
Editable: ✅ Sí
Visible: ❌ Solo si Fuelle = "Sí"
Paso: 2
```

### 45-52. **Especificaciones Wicket (8 campos)** ✅ BOLSA ONLY (Condicional)
```
Visible: ❌ Solo si Presentación = "Wicket"
Campos:
  - ¿Wicket? (Sí/No)
  - Diámetro Wicket (D12/D14/D16)
  - ¿Wicket Control? (Sí/No)
  - Diámetro Wicket Control (D8/D12/D14/D16)
  - Ubicación Wicket Control (Superior/Inferior)
  - ¿Precorte Wicket? (Sí/No)
  - Ubicación Precorte Wicket (3 opciones)
  - Distancia Precorte (Al borde/4mm)
  
Todos con valores HARDCODED en ProductEditPage
```

---

#### Para LÁMINA (3 campos específicos):

### 53. **Tipo de Lámina** ✅ LÁMINA ONLY
```
Campo: form.tipoFormatoLamina
Tipo: FormSelect
Catálogo: PRODUCT_CATALOGS.tipoFormatoLamina
Valores Actuales: 3
├─ Genérica
├─ Tissue
└─ Food
Obligatorio: ✅ Sí (LÁMINA)
Editable: ✅ Sí (LÁMINA)
Visible: ❌ NO en BOLSA/POUCH
Paso: 2
```

### 54. **Número de Colores** ✅ LÁMINA ONLY
```
Campo: form.numeroDeColores
Tipo: FormSelect
Catálogo: PRODUCT_CATALOGS.numeroDeColores
Valores Actuales: 9
├─ 1
├─ 2
├─ 3
├─ 4
├─ 5
├─ 6
├─ 7
├─ 8
└─ 9
Obligatorio: ✅ Sí (LÁMINA)
Editable: ✅ Sí (LÁMINA)
Visible: ❌ NO en BOLSA/POUCH
Paso: 2
```

---

### SUBSECCIÓN: DIMENSIONES (4 campos comunes con variación)

### 55. **Ancho** ✅
```
Campo: form.width
Tipo: FormInput (Número)
Catálogo: NINGUNO (libre, rango dinámico)
Valores: Número libre (rango varía por FDP)
Obligatorio: ✅ Sí (depende de envoltura)
Editable: ✅ Sí
Condicional: 
  - POUCH: Rango 80-230mm (Doy Pack)
  - BOLSA: Rango dinámico
  - LÁMINA: Campos especiales
Paso: 2
```

### 56. **Largo** ✅
```
Campo: form.length
Tipo: FormInput (Número)
Catálogo: NINGUNO (libre, rango dinámico)
Valores: Número libre (rango varía por FDP)
Obligatorio: ✅ Sí (depende de envoltura)
Editable: ✅ Sí
Condicional:
  - POUCH: Rango 134-340mm (Doy Pack)
  - BOLSA: Rango dinámico
  - LÁMINA: No aplica
Paso: 2
```

### 57. **Ancho Fuelle** ✅
```
Campo: form.anchoFuelle
Tipo: FormInput (Número)
Catálogo: NINGUNO (libre)
Valores: Número libre
Obligatorio: ✅ Sí (si tiene Fuelle = Sí)
Editable: ✅ Sí
Rango: 0-200 mm (POUCH)
Paso: 2
```

### 58. **Repetición** ✅
```
Campo: form.repetition
Tipo: FormInput (Número)
Catálogo: NINGUNO (libre)
Valores: Número libre
Obligatorio: ✅ Sí (LÁMINA)
Editable: ✅ Sí
Paso: 2
Nota: Usado en Fotoregistro (LÁMINA)
```

---

### SUBSECCIÓN: ESTRUCTURA BASE (14 campos comunes)

### 59. **¿Estructura Referencia?** ✅
```
Campo: form.hasReferenceStructure
Tipo: FormSelect (Sí/No)
Catálogo: YES_NO_OPTIONS (hardcoded)
Valores: 2
├─ Sí
└─ No
Obligatorio: ✅ Sí
Editable: ✅ Sí
Condicional: Habilita "E/M Referencia" si = "Sí"
Paso: 2
```

### 60. **E/M Referencia** ✅
```
Campo: form.referenceEmCode + form.referenceEmVersion
Tipo: FormInput (Texto)
Catálogo: NINGUNO (lookup desde BD)
Valores: Varía
Obligatorio: ✅ Sí (si Estructura Referencia = "Sí")
Editable: ✅ Sí
Formato: "NNNNN-NN"
Condicional: Solo visible si Estructura Referencia = "Sí"
Paso: 2
```

### 61. **Tipo de Estructura** ✅
```
Campo: form.structureType
Tipo: FormSelect
Catálogo: PRODUCT_CATALOGS.tipoDeEstructura (via getCatalogOptions("structure_type"))
Valores Actuales: 4
├─ Monocapa
├─ Bilaminado
├─ Trilaminado
└─ Tetralaminado
Obligatorio: ✅ Sí
Editable: ❌ No (heredado si estructura referencia = Sí)
Paso: 2
Restricción: 405 combinaciones SI-validadas
```

### 62. **Materiales Capas 1-4** ✅
```
Campo: form.layer1Material, form.layer2Material, form.layer3Material, form.layer4Material
Tipo: FormSelect (Tabla dinámica)
Catálogo: productMaterialCatalog.ts (getMaterialLayerOptionsByGroup)
Valores: 405 combinaciones SI-validadas
Obligatorio: ✅ Sí (según Tipo Estructura)
Editable: ✅ Sí (solo VALIDADA)
Condicional: Dinámico según Tipo Estructura
  - Monocapa: 1 capa
  - Bilaminado: 2 capas
  - Trilaminado: 3 capas
  - Tetralaminado: 4 capas
Paso: 2
```

### 63-66. **Especificaciones de Capas** ✅
```
Campos por capa:
  - Micron (form.layer1Micron, etc.)
  - Grammage (form.layer1Grammage, etc.)
  - Micraje Polietileno (form.layer1MicronRuleCode, etc.)

Catálogo: PRODUCT_CATALOGS.numeroDeMicrajePolietilenoPorCapa
Valores: 56 opciones per capa
Obligatorio: ❌ Depende de Material
Editable: ✅ Sí
Paso: 2
```

### 67. **¿Solicitud de Muestra?** ✅
```
Campo: form.sampleRequest
Tipo: FormSelect (Sí/No)
Catálogo: PRODUCT_CATALOGS.solicitudDeMuestra
Valores: 2
├─ Sí
└─ No
Obligatorio: ✅ Sí
Editable: ✅ Sí
Paso: 2
```

### 68. **Especificación Técnica Cliente** ✅
```
Campo: form.hasCustomerTechnicalSpec
Tipo: FormSelect (Sí/No)
Catálogo: YES_NO_OPTIONS
Valores: 2
├─ Sí
└─ No
Obligatorio: ✅ Sí
Editable: ✅ Sí
Condicional: Habilita upload de archivo si = "Sí"
Paso: 2
```

### 69. **Archivos Especificación** ✅
```
Campo: form.customerTechnicalSpecFiles
Tipo: File Upload
Catálogo: NINGUNO (libre)
Valores: Archivos PDF
Obligatorio: ✅ Sí (si hasCustomerTechnicalSpec = "Sí")
Editable: ✅ Sí
Condicional: Solo visible si hasCustomerTechnicalSpec = "Sí"
Paso: 2
```

### 70. **Barniz Mate** ✅
```
Campo: form.hasMatteFinishVarnish
Tipo: Checkbox
Catálogo: NINGUNO (Sí/No)
Valores: 2
├─ Activado
└─ Desactivado
Obligatorio: ❌ No
Editable: ✅ Sí
Paso: 2
```

### 71. **Barniz de Protección** ✅
```
Campo: form.hasInkProtectionVarnish
Tipo: Checkbox
Catálogo: NINGUNO (Sí/No)
Valores: 2
├─ Activado
└─ Desactivado
Obligatorio: ❌ No (Solo si Monocapa)
Editable: ✅ Sí (Solo si Monocapa)
Restricción: Solo disponible para Monocapa
Paso: 2
```

---

### SUBSECCIÓN: FOTOREGISTRO (LÁMINA ONLY) - 10+ campos

### 72. **¿La lámina lleva fotoregistro?** ✅ LÁMINA ONLY
```
Campo: form.hasPhotoregister1
Tipo: FormSelect (Sí/No)
Catálogo: YES_NO_OPTIONS
Valores: 2
├─ Sí
└─ No
Obligatorio: ✅ Sí (LÁMINA)
Editable: ✅ Sí (LÁMINA)
Visible: ❌ NO en BOLSA/POUCH
Paso: 2
Condicional: Activa PhotoregisterAccordion si = "Sí"
Restricción: Máximo 1 por LÁMINA
```

### 73. **¿Cuántos fotoregistros lleya?** ✅ LÁMINA ONLY
```
Campo: form.cantidadFotoregistros
Tipo: FormSelect
Catálogo: HARDCODED
Valores: 2
├─ 1 fotoregistro
└─ 2 fotoregistros
Obligatorio: ✅ Sí (si hasPhotoregister1 = "Sí")
Editable: ✅ Sí
Visible: ❌ NO en BOLSA/POUCH
Paso: 2
```

### 74-83. **Especificaciones FR1/FR2** ✅ LÁMINA ONLY
```
Campos por Fotoregistro (FR1, FR2):
  - Ancho FR (form.fr1Width, form.fr2Width)
  - Alto FR (form.fr1Height, form.fr2Height)
  - Margen Derecho (form.fr1MarginRight, form.fr2MarginRight)
  - Margen Abajo (form.fr1MarginBottom, form.fr2MarginBottom)
  - Margen Izquierdo (form.fr1MarginLeft, form.fr2MarginLeft)
  - Margen Arriba (form.fr1MarginTop, form.fr2MarginTop)

Tipo: FormInput (Número)
Catálogo: NINGUNO (libre, campos numéricos)
Valores: Números (mm)
Obligatorio: ✅ Sí (si hasPhotoregister = "Sí")
Editable: ✅ Sí
Validación: Cabe dentro de lámina (width × repetition)
Fórmulas: calculateMargins(), calculateSymmetricSecond()
Paso: 2
Componente: PhotoregisterAccordion (con visualización SVG)
```

---

### SUBSECCIÓN: ACCESORIOS (Comunes pero variable)

### 84-90. **Accesorios Consumibles** ✅
```
Campos:
  - Zipper (form.hasZipper)
  - Tin-Tie (form.hasTinTie)
  - Válvula (form.hasValve)

Tipo: Checkbox + Select (si aplica)
Catálogo: PRODUCT_CATALOGS.accesoriosConsumibles
Valores:
  - Zipper: Sí/No (+ tipo si aplica)
  - Tin-Tie: Sí/No
  - Válvula: Sí/No (+ tipo si aplica)

Obligatorio: ❌ No (Opcional)
Editable: ✅ Sí
Restricción: Máximo 3 accesorios simultáneos (BOLSA/POUCH)
Paso: 2
```

### 91-95. **Accesorios Internos** ✅
```
Campos:
  - Corte Angular
  - Esquinas Redondas
  - Muesca
  - Perforación
  - Pre-Corte

Tipo: Checkbox + Select (si aplica)
Catálogo: PRODUCT_CATALOGS.accesoriosInternos
Valores: 8 opciones
Obligatorio: ❌ No (Opcional)
Editable: ✅ Sí
Restricción: Máximo 3 accesorios simultáneos (BOLSA/POUCH)
Paso: 2
```

---

## PASO 3: EMBALAJE Y EMPALMES (4 Campos Visibles)

### 96. **Embalaje Material** ✅
```
Campo: form.embalajeMaterial
Tipo: FormSelect
Catálogo: MATERIAL_PACKAGING_CATALOG (mockDatabase.ts)
Valores: Variable (tipos de embalaje)
Obligatorio: ✅ Sí
Editable: ✅ Sí
Paso: 3
Opciones típicas:
  - Cajas
  - Pallets
  - Bobinas
  - Otros
```

### 97. **Embalaje Material Especial** ✅
```
Campo: form.embalajeEspecial
Tipo: FormTextarea
Catálogo: NINGUNO (libre)
Valores: Texto libre
Obligatorio: ❌ No (Opcional)
Editable: ✅ Sí
Paso: 3
Placeholder: "Condiciones especiales..."
```

### 98. **Embalaje Exportación** ✅
```
Campo: form.embalajeExportacion
Tipo: FormSelect
Catálogo: EXPORT_PACKAGING_CATALOG (mockDatabase.ts)
Valores: Variable
Obligatorio: ✅ Sí
Editable: ✅ Sí
Paso: 3
```

### 99. **Empalmes** ✅
```
Campo: form.empalmes
Tipo: FormSelect
Catálogo: SPLICES_CATALOG (mockDatabase.ts)
Valores: Variable
Obligatorio: ✅ Sí
Editable: ✅ Sí
Paso: 3
Opciones típicas:
  - Empalme Mecánico
  - Empalme Adhesivo
  - Empalme Soldadura
  - Otros
```

---

## RESUMEN ESTADÍSTICO DE CAMPOS VISIBLES

| Paso | Envoltura | Campos Visibles | Campos Con Catálogo | Campos Libre | Opcional |
|------|-----------|-----------------|-------------------|------------|----------|
| 0 | TODAS | 12 | 5 | 7 | 3 |
| 1 | TODAS | 17 | 8 | 9 | 4 |
| 1.5 | LÁMINA | 2 | 1 | 1 | 1 |
| 2 | LÁMINA | 35+ | 10 | 25+ | 8 |
| 2 | BOLSA | 40+ | 12 | 28+ | 10 |
| 2 | POUCH | 45+ | 15 | 30+ | 12 |
| 3 | TODAS | 4 | 3 | 1 | 1 |
| **TOTAL** | | **155+** | **54+** | **101+** | **39+** |

---

## 📊 TIPOS DE CAMPOS EN UI

| Tipo | Cantidad | Ejemplos |
|------|----------|----------|
| **FormSelect** | 54+ | Clasificación, Tipo Estructura, Familia Pouch, etc. |
| **FormInput** | 60+ | Nombre, Volumen, Ancho, Largo, Dimensiones, etc. |
| **FormTextarea** | 15+ | Descripción, Comentarios, Instrucciones, etc. |
| **Checkbox** | 15+ | Accesorios, Barnices, Fotoregistro, etc. |
| **File Upload** | 3+ | Planos, Especificaciones, Archivos, etc. |
| **Display (Read-only)** | 8+ | Perímetro, Ancho Total Calculado, etc. |

---

**Documento completo v1.0 | 2026-08-10**
