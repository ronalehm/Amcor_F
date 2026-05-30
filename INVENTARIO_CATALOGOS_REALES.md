# Inventario de Catálogos Reales Existentes en ODISEO

Documento generado: 2026-05-30

## Resumen Ejecutivo

**Total de catálogos encontrados:** 33  
**Ubicación principal:** `src/shared/data/projectCatalogStorage.ts` (27 catálogos) + `src/shared/data/mockDatabase.ts` (6 catálogos)  
**Total de items en catálogos:** ~250+ registros

---

## Catálogos en `src/shared/data/projectCatalogStorage.ts` (27 catálogos)

### 1. BLUEPRINT_FORMAT_CATALOG
- **Código:** `blueprintFormat`
- **Nombre:** Formato de Plano
- **Items:** 20 registros
- **Uso actual:** ProductCreatePage, ProductEditPage
- **¿Centralizar ahora?** SÍ - es obligatorio en formularios
- **Valores:** Sachet/Pillow, Doy Pack, Four Side Seal, Flow Pack, etc.

### 2. TECHNICAL_APPLICATION_CATALOG
- **Código:** `technicalApplication`
- **Nombre:** Aplicación Técnica
- **Items:** 13 registros
- **Uso actual:** Portfolio, Productos
- **¿Centralizar ahora?** SÍ - campo obligatorio
- **Valores:** VFFS, HFFS, Preformado, Flow Pack, etc.

### 3. UNIT_OF_MEASURE_CATALOG
- **Código:** `unitOfMeasure`
- **Nombre:** Unidad de Medida
- **Items:** 7 registros
- **Uso actual:** ProductCreatePage, ProductEditPage, Portfolio
- **¿Centralizar ahora?** SÍ - campo obligatorio (UM-001 a UM-007)
- **Valores:** unidad, millares, kilos, metros, millones_unidades, toneladas, rollos
- **Nota:** Diferente de `unitOfMeasureStorage.ts` que usa g, kg, ml, l, etc. (necesita revisión)

### 4. PRINT_CLASS_CATALOG
- **Código:** `printClass`
- **Nombre:** Clase de Impresión
- **Items:** 6 registros
- **Uso actual:** ProductCreatePage, ProductEditPage
- **¿Centralizar ahora?** SÍ
- **Valores:** Sencilla, Alta Definición, Ultra HD, ESG, Omnia, Sin Impresión

### 5. PRINT_TYPE_CATALOG
- **Código:** `printType`
- **Nombre:** Tipo de Impresión
- **Items:** 4 registros
- **Uso actual:** ProductCreatePage, ProductEditPage
- **¿Centralizar ahora?** SÍ
- **Valores:** Flexografía, Rotograbado, Digital, Sin Impresión

### 6. STRUCTURE_TYPE_CATALOG
- **Código:** `structureType`
- **Nombre:** Tipo de Estructura
- **Items:** 6 registros
- **Uso actual:** ProductCreatePage, ProductEditPage
- **¿Centralizar ahora?** SÍ
- **Valores:** Monocapa, Dúplex, Tríplex, Cuádruple, Coextruida, Laminada

### 7. LAYER_MATERIAL_CATALOG
- **Código:** `layerMaterial`
- **Nombre:** Material de Capa
- **Items:** 58 registros
- **Uso actual:** ProductCreatePage, ProductEditPage (materiales por capa)
- **¿Centralizar ahora?** SÍ - MÁS IMPORTANTE
- **Grupos:** BOPP (23), POLIESTER (4), PAPEL (6), COEX (9), ALUMINIO (3), AMPRIMA (1), PPCAST (4), BOPA (1), TERMOFORMADOS (7)
- **Nota:** Este es el catálogo más complejo y usado

### 8. ZIPPER_TYPE_CATALOG
- **Código:** `zipperType`
- **Nombre:** Tipo de Zipper
- **Items:** 5 registros
- **Uso actual:** ProductCreatePage, ProductEditPage
- **¿Centralizar ahora?** SÍ
- **Valores:** Slider, Standard, Wide, Child Resistant, Press-to-Close

### 9. VALVE_TYPE_CATALOG
- **Código:** `valveType`
- **Nombre:** Tipo de Válvula
- **Items:** 3 registros
- **Uso actual:** ProductCreatePage, ProductEditPage
- **¿Centralizar ahora?** SÍ
- **Valores:** Standard, High Flow, Low Profile

### 10. ROUNDED_CORNERS_TYPE_CATALOG
- **Código:** `roundedCornersType`
- **Nombre:** Tipo de Esquinas Redondeadas
- **Items:** 4 registros
- **Uso actual:** ProductCreatePage, ProductEditPage
- **¿Centralizar ahora?** SÍ
- **Valores:** Radio Pequeño (5mm), Radio Medio (10mm), Radio Grande (15mm), Personalizado

### 11. POUCH_PERFORATION_TYPE_CATALOG
- **Código:** `pouchPerforationType`
- **Nombre:** Tipo de Perforación Pouch
- **Items:** 4 registros
- **Uso actual:** ProductCreatePage, ProductEditPage
- **¿Centralizar ahora?** SÍ
- **Valores:** Lineal Horizontal, Lineal Vertical, Punteado, Microperforación

### 12. BAG_PERFORATION_TYPE_CATALOG
- **Código:** `bagPerforationType`
- **Nombre:** Tipo de Perforación Bolsa
- **Items:** 5 registros
- **Uso actual:** ProductCreatePage, ProductEditPage
- **¿Centralizar ahora?** SÍ
- **Valores:** Euroslot, Sombrero, Doble Sombrero, En O, En Delta

### 13. PRE_CUT_TYPE_CATALOG
- **Código:** `preCutType`
- **Nombre:** Tipo de Pre-Corte
- **Items:** 4 registros
- **Uso actual:** ProductCreatePage, ProductEditPage
- **¿Centralizar ahora?** SÍ
- **Valores:** Lineal, V, Curvo, En Arco

### 14. SALE_TYPE_CATALOG
- **Código:** `saleType`
- **Nombre:** Tipo de Venta (Nacional/Internacional)
- **Items:** 2 registros
- **Uso actual:** ProductCreatePage, ProductEditPage
- **¿Centralizar ahora?** SÍ
- **Valores:** Nacional, Internacional

### 15. INCOTERM_CATALOG
- **Código:** `incoterm`
- **Nombre:** Incoterm
- **Items:** 11 registros
- **Uso actual:** ProductCreatePage, ProductEditPage, Comercial
- **¿Centralizar ahora?** SÍ
- **Valores:** EXW, FCA, CPT, CIP, DAP, DPU, DDP, FAS, FOB, CFR, CIF

### 16. DESTINATION_COUNTRY_CATALOG
- **Código:** `destinationCountry`
- **Nombre:** País de Destino
- **Items:** 20 registros
- **Uso actual:** ProductCreatePage, ProductEditPage
- **¿Centralizar ahora?** SÍ
- **Valores:** Perú, Chile, Colombia, Ecuador, Argentina, Brasil, Bolivia, Uruguay, Paraguay, Venezuela, México, USA, Canadá, Panamá, Costa Rica, Guatemala, El Salvador, Honduras, Nicaragua, Rep. Dominicana

### 17. CURRENCY_TYPE_CATALOG
- **Código:** `currencyType`
- **Nombre:** Tipo de Moneda
- **Items:** 3 registros
- **Uso actual:** ProductCreatePage, ProductEditPage
- **¿Centralizar ahora?** SÍ
- **Valores:** Soles (PEN), Dólares (USD), Euros (EUR)

### 18. PAYMENT_TERMS_CATALOG
- **Código:** `paymentTerms`
- **Nombre:** Términos de Pago
- **Items:** 6 registros
- **Uso actual:** Potencialmente Portfolio, Comercial
- **¿Centralizar ahora?** SÍ
- **Valores:** Contado, 30 días, 45 días, 60 días, 90 días, 15 días

### 19. CORE_MATERIAL_CATALOG
- **Código:** `coreMaterial`
- **Nombre:** Material del Core/Tuco
- **Items:** 3 registros
- **Uso actual:** ProductCreatePage, ProductEditPage
- **¿Centralizar ahora?** SÍ
- **Valores:** Cartón, Plástico, Metal

### 20. PERUVIAN_PRODUCT_LOGO_CATALOG
- **Código:** `peruvianProductLogo`
- **Nombre:** Logo Producto Peruano
- **Items:** 3 registros
- **Uso actual:** ProductCreatePage, ProductEditPage
- **¿Centralizar ahora?** SÍ
- **Valores:** Sí, No, A definir

### 21. PRINTING_FOOTER_CATALOG
- **Código:** `printingFooter`
- **Nombre:** Pie de Imprenta
- **Items:** 3 registros
- **Uso actual:** ProductCreatePage, ProductEditPage
- **¿Centralizar ahora?** SÍ
- **Valores:** Estándar Amcor, Personalizado Cliente, Sin Pie de Imprenta

### 22. PROJECT_CLASSIFICATION_CATALOG
- **Código:** `classification`
- **Nombre:** Clasificación de Proyecto
- **Items:** 3 registros
- **Uso actual:** ProductCreatePage, ProductEditPage
- **¿Centralizar ahora?** SÍ - CRÍTICO para refactoring
- **Valores:** Nuevo, Modificado, Estándar

### 23. PROJECT_SUBCLASSIFICATION_CATALOG
- **Código:** `subClassification`
- **Nombre:** Sub-clasificación
- **Items:** 5 registros
- **Uso actual:** ProductCreatePage, ProductEditPage
- **¿Centralizar ahora?** SÍ - CRÍTICO para refactoring
- **Valores:** SFDC - R&D, SFDC - Técnica, Estructura, Extensiones en línea, No aplica

### 24. SALESFORCE_ACTION_CATALOG
- **Código:** `salesforceAction`
- **Nombre:** Acción Salesforce
- **Items:** 3 registros
- **Uso actual:** ProductCreatePage, ProductEditPage, Integración Salesforce
- **¿Centralizar ahora?** SÍ
- **Valores:** Nueva oportunidad, Oportunidad existente, No aplica

### 25. PROJECT_TYPE_CATALOG
- **Código:** `projectType`
- **Nombre:** Tipo de Proyecto
- **Items:** 3 registros
- **Uso actual:** ProductCreatePage, ProductEditPage
- **¿Centralizar ahora?** SÍ
- **Valores:** Proyecto, Muestra, Ambos

### 26. YES_NO_CATALOG
- **Código:** `yesNo`
- **Nombre:** Sí/No
- **Items:** 2 registros
- **Uso actual:** Genérico en muchos formularios
- **¿Centralizar ahora?** SÍ
- **Valores:** Sí, No

### 27. ARTWORK_FILE_TYPE_CATALOG
- **Código:** `artworkFileType`
- **Nombre:** Tipo de Archivo de Arte
- **Items:** 7 registros
- **Uso actual:** Documentos de arte, Proyecto
- **¿Centralizar ahora?** SÍ
- **Valores:** PDF, AI, EPS, PSD, CDR, TIF/TIFF, JPG/JPEG

---

## Catálogos en `src/shared/data/mockDatabase.ts` (6 catálogos)

### 28. STATUS_CATALOG
- **Código:** `status`
- **Nombre:** Estados de Proyecto
- **Items:** 4 registros
- **Uso actual:** Portfolio, Proyectos
- **¿Centralizar ahora?** SÍ
- **Valores:** Registrado, En revisión, Cerrado, Desestimado

### 29. CLIENTS_CATALOG
- **Código:** `clients`
- **Nombre:** Catálogo de Clientes
- **Items:** 5 registros (mock)
- **Uso actual:** Portfolio, Proyectos
- **¿Centralizar ahora?** NO - Estos son MOCK, no datos reales
- **Nota:** Conectar a `clientStorage.ts` en lugar de mantener datos mock aquí

### 30. EXECUTIVES_CATALOG
- **Código:** `executives`
- **Nombre:** Ejecutivos Comerciales
- **Items:** 4 registros (mock)
- **Uso actual:** Portfolio, Proyectos
- **¿Centralizar ahora?** NO - MOCK, consultar `executiveStorage.ts`
- **Nota:** Ya hay `getActiveExecutiveRecords()` en `executiveStorage.ts`

### 31. PLANTS_CATALOG
- **Código:** `plants`
- **Nombre:** Plantas/Instalaciones
- **Items:** 4 registros
- **Uso actual:** Portfolio
- **¿Centralizar ahora?** SÍ
- **Valores:** AF Lima, AF San Luis, AF Cali, AF Santiago Norte

### 32. WRAPPINGS_CATALOG
- **Código:** `wrappings`
- **Nombre:** Tipos de Envoltura
- **Items:** 4 registros
- **Uso actual:** Portfolio, Productos
- **¿Centralizar ahora?** SÍ - CRÍTICO
- **Valores:** POUCH, BOLSA, LÁMINA, ETIQUETA
- **Nota:** Mantener solo POUCH, BOLSA, LAMINA según especificación

### 33. FINAL_USE_CATALOG
- **Código:** `finalUse`
- **Nombre:** Uso Final
- **Items:** 10+ registros
- **Uso actual:** Portfolio, SmartCatalogSearch
- **¿Centralizar ahora?** SÍ - YA ESTÁ ESTRUCTURADO
- **Valores:** Adhesive Bandages, etc.
- **Nota:** Incluye taxonomy (sector, segment, subsegment)

---

## Archivos con datos de catálogos relacionados

### `src/shared/data/unitOfMeasureStorage.ts`
- **Contiene:** UNITS_OF_MEASURE (g, kg, ml, l, m, cm, mm)
- **Conflicto:** Diferente a UNIT_OF_MEASURE_CATALOG en projectCatalogStorage.ts
- **¿Centralizar ahora?** Necesita revisión - determinar cuál es la fuente correcta

### `src/shared/data/portfolioStorage.ts`
- **Contiene:** TECHNICAL_APPLICATION_OPTIONS (referencia a projectCatalogStorage)
- **¿Centralizar ahora?** Usar desde fuente centralizada

### `src/shared/components/catalog/`
- **Contiene:** SmartCatalogSearch, FinalUseCatalogModal
- **Nota:** Ya consume FINAL_USE_CATALOG - patrón correcto a mantener

---

## Catálogos NO ENCONTRADOS (pero sí mencionados en requete)

Estos campos mencionados en los 31 campos NO TIENEN catálogos reales aún:

- Gusset Type
- Base Doy Pack (variaciones específicas)
- Special Design Specs
- Other Accessories

**Acción:** No crear catálogos ficticios para estos.

---

## Recomendaciones para Centralización - FASE 1

### Prioridad CRÍTICA (iniciar inmediatamente)
1. **WRAPPINGS_CATALOG** - Tipo de envoltura (POUCH, BOLSA, LAMINA)
2. **PROJECT_CLASSIFICATION_CATALOG** - Clasificación (Nuevo/Modificado)
3. **PROJECT_SUBCLASSIFICATION_CATALOG** - Sub-clasificación
4. **LAYER_MATERIAL_CATALOG** - Materiales por capa (58 items)
5. **UNIT_OF_MEASURE_CATALOG** - Unidad de medida

### Prioridad ALTA (después de críticos)
6. **PRINT_CLASS_CATALOG** - Clase de impresión
7. **PRINT_TYPE_CATALOG** - Tipo de impresión
8. **STRUCTURE_TYPE_CATALOG** - Tipo de estructura
9. **INCOTERM_CATALOG** - Incoterms
10. **DESTINATION_COUNTRY_CATALOG** - Países
11. **CURRENCY_TYPE_CATALOG** - Monedas
12. **SALE_TYPE_CATALOG** - Venta Nacional/Internacional
13. **FINAL_USE_CATALOG** - Uso final (ya estructurado)
14. **PLANTS_CATALOG** - Plantas

### Prioridad MEDIA (consolidar después)
15. **BLUEPRINT_FORMAT_CATALOG** - Formato de plano
16. **TECHNICAL_APPLICATION_CATALOG** - Aplicación técnica
17. **ZIPPER_TYPE_CATALOG**
18. **VALVE_TYPE_CATALOG**
19. **ROUNDED_CORNERS_TYPE_CATALOG**
20. **POUCH_PERFORATION_TYPE_CATALOG**
21. **BAG_PERFORATION_TYPE_CATALOG**
22. **PRE_CUT_TYPE_CATALOG**
23. **PAYMENT_TERMS_CATALOG**
24. **CORE_MATERIAL_CATALOG**
25. **PERUVIAN_PRODUCT_LOGO_CATALOG**
26. **PRINTING_FOOTER_CATALOG**
27. **SALESFORCE_ACTION_CATALOG**
28. **PROJECT_TYPE_CATALOG**
29. **YES_NO_CATALOG**
30. **ARTWORK_FILE_TYPE_CATALOG**
31. **STATUS_CATALOG**

### NO CENTRALIZAR (son mock)
- **CLIENTS_CATALOG** → Usar clientStorage.ts
- **EXECUTIVES_CATALOG** → Usar executiveStorage.ts

---

## Conflictos a Resolver

### 1. Unidades de Medida
Hay DOS fuentes:
- `unitOfMeasureStorage.ts`: g, kg, ml, l, m, cm, mm (unidades físicas)
- `projectCatalogStorage.ts`: UNIT_OF_MEASURE_CATALOG con unidad, millares, kilos, metros, toneladas, rollos (unidades comerciales)

**Decisión:** Revisar uso en formularios para determinar cuál es la correcta.

### 2. WRAPPINGS_CATALOG tiene ETIQUETA
La especificación dice mantener solo POUCH, BOLSA, LAMINA.

**Decisión:** Filtrar o inactivar ETIQUETA en la centralización.

---

## Próximos Pasos

1. ✅ Inventario completo (HECHO)
2. ⏳ Crear `src/shared/catalogs/` structure
3. ⏳ Mover catálogos CRÍTICOS a la capa compartida
4. ⏳ Conectar módulo Gestión de Catálogos
5. ⏳ Crear restricciones (cuando se identifiquen reglas reales)
6. ⏳ Reemplazar hardcodes en módulos

---

## Estadísticas

| Métrica | Valor |
|---------|-------|
| Total catálogos | 33 |
| Items totales | ~250+ |
| Catálogos a centralizar FASE 1 | 27 |
| Catálogos mock | 2 |
| Catálogos duplicados | 1 (UNITS_OF_MEASURE) |
| Conflictos a resolver | 2 |
