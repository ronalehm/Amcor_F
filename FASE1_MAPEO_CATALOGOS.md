# FASE 1: MAPEO DE CATÁLOGOS ODISEO
## Documento Oficial de Referencia

**Fecha**: Agosto 2026  
**Total de Catálogos**: 67 (54 ODISEO + 13 Sistema Integral)  
**Estado**: ✅ Completado

---

## RESUMEN EJECUTIVO

| Métrica | Valor |
|---------|-------|
| **Total Catálogos** | 67 |
| **ODISEO (Editables)** | 54 |
| **Sistema Integral (Solo Lectura)** | 13 |
| **Módulos Cubiertos** | products, portfolio, clients, users |
| **Códigos Asignados** | CAT-001 a CAT-067 |

---

## MAPEO COMPLETO DE CATÁLOGOS

### TABLAS ESPEJO SISTEMA INTEGRAL (13)
Estos catálogos son solo consulta/sincronización. No editable desde ODISEO.

| CAT | Código | Nombre | Módulo | Descripción |
|-----|--------|--------|--------|-------------|
| CAT-001 | wrapping_type | Tipo de Envoltura | products | Tipos de envoltura (POUCH, BOLSA, LÁMINA) |
| CAT-023 | user_status | Estado de Usuario | users | Estados del ciclo de vida de usuarios |
| CAT-025 | packaging_machine | Tipo de Envasado | products | Tipos de envasado y máquinas de cliente |
| CAT-055 | client | Cliente | portfolio | Tabla espejo: Clientes del sistema |
| CAT-056 | executive | Ejecutivo Comercial | portfolio | Tabla espejo: Ejecutivos comerciales |
| CAT-057 | unit_measure | Unidad de Medida | products | Tabla espejo: Unidades de medida |
| CAT-058 | modification_new | Modificación Nuevo | products | Tabla espejo: Tipos modificación producto nuevo |
| CAT-059 | modification_modified | Modificación Modificado | products | Tabla espejo: Tipos modificación producto modificado |
| CAT-060 | seals_count | Cantidad de Sellos | products | Tabla espejo: Cantidad de sellos |
| CAT-061 | central_seal_material | Material Sello Central | products | Tabla espejo: Materiales para sello central |
| CAT-062 | seal_type_gusset | Tipo Sello en Fuelle | products | Tabla espejo: Tipos de sello para fuelle |
| CAT-063 | seal_type_bag | Tipo de Sello | products | Tabla espejo: Tipos de sello disponibles |
| CAT-067 | splices | Empalmes | products | Tabla espejo: Número de empalmes |

### CATÁLOGOS ODISEO - IMPRESIÓN Y ESTRUCTURA (5)
Editables vía plantilla. Aplica en: LÁMINA/BOLSA/POUCH (según formato)

| CAT | Código | Nombre | Aplica en | Valores |
|-----|--------|--------|-----------|---------|
| CAT-002 | print_class | Clase de Impresión | General | A, B, C, D, E, etc. |
| CAT-003 | print_type | Tipo de Impresión | General | Flexografía, Rotograbado, Digital, Sin Impresión |
| CAT-004 | structure_type | Tipo de Estructura | General | Monocapa, Bilaminado, Trilaminado, Tetralaminado |
| CAT-032 | special_design_specs | Especificaciones Diseño Especiales | General | Tintas Holográficas, Efectos especiales, etc. |
| CAT-033 | print_form | Forma de Impresión | General | Directa, Indirecta, etc. |

### CATÁLOGOS ODISEO - PRODUCTO (49)
Editables vía plantilla. Específicos por envolt ura/formato.

| CAT | Código | Nombre | Aplica en | Módulo |
|-----|--------|--------|-----------|--------|
| CAT-005 | final_use | Uso Final | General | portfolio |
| CAT-006 | plant | Planta de Origen | General | portfolio |
| CAT-007 | zipper_type | Tipo de Zipper | POUCH | products |
| CAT-008 | valve_type | Tipo de Válvula | POUCH | products |
| CAT-009 | rounded_corners_type | Esquinas Redondeadas | POUCH | products |
| CAT-010 | pouch_perforation_type | Perforación Pouch | POUCH | products |
| CAT-011 | eyelet_perforation_type | Perforación Ojal | POUCH | products |
| CAT-012 | bag_perforation_type | Perforación Bolsa | BOLSA | products |
| CAT-013 | wicket_perforation_type | Perforación Wicket | BOLSA | products |
| CAT-014 | precut_type | Tipo Pre-Corte | BOLSA | products |
| CAT-015 | core_material | Material del Core | General | products |
| CAT-016 | handle_type | Tipo de Asa | BOLSA | products |
| CAT-017 | handle_color | Color de Asa | BOLSA | products |
| CAT-018 | client_type | Tipo de Cliente | General | clients |
| CAT-019 | client_sector | Sector Cliente | General | clients |
| CAT-020 | client_country | País Cliente | General | clients |
| CAT-021 | user_role | Rol de Usuario | General | users |
| CAT-022 | user_area | Área de Usuario | General | users |
| CAT-024 | portfolio_status | Estado de Portafolio | General | portfolio |
| CAT-026 | product_line | Línea de Producto | General | portfolio |
| CAT-027 | market_segment | Segmento de Mercado | General | portfolio |
| CAT-028 | product_status | Estado de Producto | General | products |
| CAT-029 | application_technical | Aplicación Técnica | General | products |
| CAT-030 | classification | Clasificación | General | products |
| CAT-031 | format_plan | Formato de Plano | General | products |
| CAT-034 | number_colors | Número de Colores | General | products |
| CAT-035 | color_target | Objetivo de Color | General | products |
| CAT-036 | approver | Aprobador | General | products |
| CAT-037 | sub_segment | Sub-Segmento | General | products |
| CAT-038 | final_use_application | Aplicación Uso Final | General | products |
| CAT-039 | lamina_format | Formato Lámina | LÁMINA | products |
| CAT-040 | winding_direction | Sentido de Embobinado | LÁMINA | products |
| CAT-041 | photocell_location | Ubicación Fotocélula | LÁMINA | products |
| CAT-042 | presentation_type | Tipo de Presentación | BOLSA | products |
| CAT-043 | bag_seal_type | Tipo de Sello Bolsa | BOLSA | products |
| CAT-044 | finish | Acabado | BOLSA | products |
| CAT-045 | bag_bellows_type | Tipo de Fuelle Bolsa | BOLSA | products |
| CAT-046 | wicket_diameter | Diámetro de Wicket | BOLSA | products |
| CAT-047 | control_wicket_diameter | Diámetro Wicket Control | BOLSA | products |
| CAT-048 | control_wicket_location | Ubicación Wicket Control | BOLSA | products |
| CAT-049 | precut_wicket_location | Ubicación Precorte Wicket | BOLSA | products |
| CAT-050 | margin_distance | Distancia Margen | BOLSA | products |
| CAT-051 | stitching_separation | Separación de Púas | BOLSA | products |
| CAT-052 | pouch_family | Familia de Pouch | POUCH | products |
| CAT-053 | standup_type | Tipo de Stand Up | POUCH | products |
| CAT-054 | doypack_base | Base del Doypack | POUCH | products |
| CAT-064 | micron_pe | Micraje Polietileno | General | products |
| CAT-065 | material_packaging | Embalaje de Material | General | products |
| CAT-066 | export_packaging | Embalaje Exportación | General | products |

---

## ESTRUCTURA DE NOMBRES PARA HOJAS EXCEL

### Convención
Cada catálogo tendrá una hoja con el siguiente nombre:

```
CAT-[XXX]_[Nombre_Sin_Espacios_NiCaracteresEspeciales]
```

### Ejemplos

| CAT | Nombre | Hoja Excel |
|-----|--------|-----------|
| CAT-002 | Clase de Impresión | CAT-002_Clase_de_Impresion |
| CAT-004 | Tipo de Estructura | CAT-004_Tipo_de_Estructura |
| CAT-010 | Tipo de Perforación Pouch | CAT-010_Tipo_de_Perforacion_Pouch |
| CAT-055 | Cliente | CAT-055_Cliente |
| CAT-067 | Empalmes | CAT-067_Empalmes |

---

## DISTRIBUCIÓN POR MÓDULO

| Módulo | ODISEO | Sistema Integral | Total |
|--------|--------|------------------|-------|
| **products** | 36 | 8 | 44 |
| **portfolio** | 8 | 2 | 10 |
| **clients** | 3 | 0 | 3 |
| **users** | 2 | 2 | 4 |
| **TOTAL** | 49 | 12 | 61* |

*Nota: 6 catálogos adicionales no asignados a módulo específico aún.

---

## DISTRIBUCIÓN POR ENVOLTURA/FORMATO

| Aplica en | Cantidad | Ejemplos |
|-----------|----------|----------|
| **General** | 38 | Aplicación Técnica, Estado Producto, Línea Producto |
| **LÁMINA** | 3 | Formato Lámina, Sentido Embobinado, Ubicación Fotocélula |
| **BOLSA** | 15 | Perforación Bolsa, Tipo Sello Bolsa, Diámetro Wicket |
| **POUCH** | 11 | Tipo Zipper, Tipo Válvula, Familia Pouch |

---

## CATÁLOGOS QUE NO APLICAN (EXCLUIDOS)

Según criterios de CA-12, NO se crearon catálogos para:

- ❌ Restricciones dimensionales (ancho, largo, fuelle, etc.)
- ❌ Rangos de validación
- ❌ Booleanos Sí/No
- ❌ Campos transaccionales
- ❌ Datos importados desde WebCenter
- ❌ Reglas de compatibilidad
- ❌ Reglas de activación de campos
- ❌ Tolerancias
- ❌ Validaciones de presentación/sello/acabado/fuelle

---

## PRÓXIMAS FASES

| Fase | Tarea | Dependencia |
|------|-------|-------------|
| **Fase 2** | Generador de Plantilla Excel | COMPLETADA (Fase 1) |
| **Fase 3** | Validador de Carga | COMPLETADA (Fase 1) |
| **Fase 4** | Vista Web | COMPLETADA (Fase 1) |
| **Fase 5** | Flujo Carga/Confirmación | COMPLETADA (Fase 1) |
| **Fase 6** | Trazabilidad y Bitácora | COMPLETADA (Fase 1) |
| **Fase 7** | Integración Sistema Integral | COMPLETADA (Fase 1) |

---

## NOTAS IMPORTANTES

1. **Código Catálogo es la clave**: CAT-XXX debe ser único e inmutable. Nunca cambiar.

2. **Tablas Espejo SI**: Los 12 catálogos del Sistema Integral NO se editan desde ODISEO. Solo se sincronizan desde SI.

3. **Plantilla Excel**: Tendrá 3 hojas fijas (Resumen, Detalle) + 67 hojas (una por catálogo).

4. **Validaciones de Carga**: Solo los 54 catálogos ODISEO permiten carga/actualización.

5. **Trazabilidad**: Fecha y usuario se generan automáticamente, no son editables en plantilla.

---

**Documento válido desde**: Agosto 2026  
**Próxima revisión**: Cuando se agreguen nuevos catálogos o se modifique la estructura SI
