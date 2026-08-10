# 🏢 CATÁLOGO ODISEO LOCAL

**Versión:** 1.0  
**Fecha:** 2026-08-10  
**Última Actualización:** Local ODISEO  
**Total Catálogos:** 150+ Especificaciones

---

# INTRODUCCIÓN

El Catálogo ODISEO LOCAL contiene todas las especificaciones que se pueden crear y modificar localmente en ODISEO. Estos valores son:
- ✅ **Editables** en ODISEO (crear, modificar, eliminar)
- ✅ **Locales** (no se sincronizan a SI)
- ✅ **Específicos** por formato (LÁMINA, BOLSA, POUCH)
- ✅ **Flexibles** para ajustes de producción

---

# 1. CATÁLOGO: SENTIDO BOBINADO (LÁMINA)

## Descripción
Define la dirección de bobinado/impresión en LÁMINA. Usuario selecciona mediante imagen visual (Image Grid).

| Código | Nombre | Descripción | Imagen | Sentido | Aplicación |
|:---|:---|:---|:---:|:---|:---|
| BOB-001 | Sentido 1 | Bobinado Derecha | 📊 Flecha → | Derecha | Impresión Estándar |
| BOB-002 | Sentido 2 | Bobinado Izquierda | 📊 Flecha ← | Izquierda | Impresión Invertida |
| BOB-003 | Sentido 3 | Bobinado Vertical | 📊 Flecha ↑ | Vertical Arriba | Impresión Vertical |
| BOB-004 | Sentido 4 | Bobinado Vertical Inv | 📊 Flecha ↓ | Vertical Abajo | Impresión V. Inv |
| BOB-005 | Sentido 5 | Bobinado Diagonal | 📊 Flecha ↗ | Diagonal Der | Especial |
| BOB-006 | Sentido 6 | Bobinado Diagonal Inv | 📊 Flecha ↙ | Diagonal Izq | Especial |
| BOB-007 | Sentido 7 | Bobinado Espiral | 📊 Espiral → | Espiral Derecha | Premium |
| BOB-008 | Sentido 8 | Bobinado Espiral Inv | 📊 Espiral ← | Espiral Izquierda | Premium |

**Uso:** LÁMINA únicamente  
**Obligatorio:** ✅ Sí  
**Editable:** ✅ Sí (modificar descripciones, agregar nuevos)

---

# 2. CATÁLOGO: VARIACIONES CORE (LÁMINA)

## Descripción
Opciones adicionales de variación del núcleo (core). Usuario selecciona mediante checkbox (múltiples posibles).

| Código | Nombre | Tipo | Diámetro | Especificación | Costo Impacto | Estado |
|:---|:---|:---|:---:|:---|:---:|:---:|
| VAR-001 | Core Doble | Variación | 76+76 | Dos núcleos pequeños | Bajo | ✅ Activo |
| VAR-002 | Core Reforzado | Variación | 76 | Núcleo reforzado | Medio | ✅ Activo |
| VAR-003 | Core Especial | Variación | 152 | Núcleo especial para máquina | Medio | ✅ Activo |
| VAR-004 | Core Biodegradable | Variación | 76-152 | Eco-friendly | Alto | ✅ Activo |
| VAR-005 | Core Extensible | Variación | 114 | Extensible para bobinado | Bajo | ✅ Activo |

**Uso:** LÁMINA únicamente  
**Obligatorio:** ⚪ No (opcional)  
**Editable:** ✅ Sí  
**Múltiples:** ✅ Sí (checkbox)

---

# 3. CATÁLOGO: TIPO ASA TROQUELADA (BOLSA)

## Descripción
Tipos de asa troquelada disponibles para BOLSA. Usuario selecciona en modal de accesorios.

| Código | Nombre Asa | Forma | Material | Espesor | Resistencia | Costo | Uso |
|:---|:---|:---|:---:|:---:|:---:|:---:|:---|
| ASA-001 | Asa Tipo D | D-Shape | PEBD | 0.8mm | Estándar | Bajo | Económica |
| ASA-002 | Asa Reforzada | Rectangular | PEBD+Papel | 1.2mm | Alta | Medio | Cargas altas |
| ASA-003 | Asa Ergonómica | Curved | PEBD | 1.0mm | Media | Medio | Comodidad |
| ASA-004 | Asa Plana | Flat | PP | 0.6mm | Baja | Bajo | Compactado |
| ASA-005 | Asa Doble | X-Shape | PEBD | 1.5mm | Muy Alta | Alto | Premium |
| ASA-006 | Asa Clip | Clip | Acero | Variable | Muy Alta | Muy Alto | Reutilizable |

**Uso:** BOLSA (Accesorios Producto)  
**Obligatorio:** ⚪ No  
**Editable:** ✅ Sí  
**Modal:** AccessoriesSelectionModal

---

# 4. CATÁLOGO: COLOR ASA (BOLSA)

## Descripción
Colores disponibles para asa troquelada.

| Código | Color | Código RGB | Nombre Comercial | Disponibilidad | Costo Extra |
|:---|:---|:---:|:---|:---:|:---:|
| COL-001 | Transparente | 255,255,255 | Cristal | ✅ Stock | 0% |
| COL-002 | Blanco | 240,240,240 | Blanco | ✅ Stock | 0% |
| COL-003 | Negro | 30,30,30 | Negro | ✅ Stock | 2% |
| COL-004 | Rojo | 220,20,60 | Rojo | ⚠️ Bajo | 5% |
| COL-005 | Azul | 30,120,200 | Azul | ⚠️ Bajo | 5% |
| COL-006 | Verde | 50,180,80 | Verde | ⚠️ Bajo | 5% |
| COL-007 | Amarillo | 255,200,0 | Amarillo | ⚠️ Bajo | 7% |
| COL-008 | Oro | 220,170,0 | Oro Metálico | ❌ Especial | 15% |
| COL-009 | Plata | 200,200,200 | Plata Metálica | ❌ Especial | 15% |

**Uso:** Asa Troquelada (BOLSA)  
**Obligatorio:** ⚪ No  
**Editable:** ✅ Sí  
**Stock:** Varía por color

---

# 5. CATÁLOGO: TIPO REFUERZO (BOLSA)

## Descripción
Tipos de refuerzo para BOLSA. Usuario selecciona en modal de accesorios.

| Código | Nombre Refuerzo | Tipo | Material | Ubicación | Ancho | Espesor | Costo |
|:---|:---|:---|:---:|:---|:---:|:---:|:---:|
| REF-001 | Refuerzo Lateral | Tira | PP | Laterales | 10mm | 0.5mm | Bajo |
| REF-002 | Refuerzo Fondo | Tira | PP | Fondo | 15mm | 0.5mm | Bajo |
| REF-003 | Refuerzo Doble | Tira | PP | Laterales + Fondo | 12mm | 0.6mm | Medio |
| REF-004 | Refuerzo Completo | Banda | Papel | Perímetro | 20mm | 0.8mm | Medio |
| REF-005 | Refuerzo Premium | Banda | Nylon | Perímetro | 25mm | 1.0mm | Alto |

**Uso:** BOLSA (Accesorios Producto)  
**Obligatorio:** ⚪ No  
**Editable:** ✅ Sí  
**Modal:** AccessoriesSelectionModal

---

# 6. CATÁLOGO: ACCESORIOS INTERNOS (BOLSA)

## Descripción
Accesorios internos disponibles para BOLSA (Corte, Esquinas, Muesca, Perforación, Pre-Corte).

| Código | Nombre | Tipo | Descripción | Ubicación | Costo | Complejidad |
|:---|:---|:---|:---|:---:|:---:|:---:|
| INT-001 | Corte Angular | Corte | Esquinas angulares | Esquinas | Bajo | Baja |
| INT-002 | Esquinas Redondas | Corte | Redondeado de esquinas | Esquinas | Bajo | Baja |
| INT-003 | Muesca | Muesca | Línea de desgarre | Superior | Bajo | Baja |
| INT-004 | Perforación Centro | Perforación | Perfil central | Centro | Bajo | Media |
| INT-005 | Pre-Corte Horizontal | Pre-Corte | Corte facilitado | Superior | Bajo | Media |
| INT-006 | Pre-Corte Vertical | Pre-Corte | Corte facilitado lateral | Lateral | Bajo | Media |
| INT-007 | Línea de Desgarre Full | Muesca | Desgarre completo | Perímetro | Medio | Alta |

**Uso:** BOLSA (Accesorios Internos)  
**Obligatorio:** ⚪ No  
**Editable:** ✅ Sí  
**Modal:** AccessoriesSelectionModal  
**Máximo:** 3 totales (Producto + Internos)

---

# 7. CATÁLOGO: DIÁMETRO WICKET (BOLSA)

## Descripción
Diámetros de wicket disponibles para BOLSA Wicket.

| Código | Diámetro | Milímetros | Material | Resistencia | Aplicación |
|:---|:---|:---:|:---|:---:|:---|
| WIC-001 | D12 | 12 mm | Acero | Media | Estándar |
| WIC-002 | D14 | 14 mm | Acero | Alta | Cargas medias |
| WIC-003 | D16 | 16 mm | Acero | Muy Alta | Cargas pesadas |

**Uso:** BOLSA Wicket (IF Presentación = Wicket AND Tiene Wicket = Sí)  
**Obligatorio:** ✅ Sí (si Wicket=Sí)  
**Editable:** ✅ Sí  
**Opciones:** Solo 3 valores

---

# 8. CATÁLOGO: CONTROL WICKET (BOLSA)

## Descripción
Tipo de control de wicket.

| Código | Tipo Control | Descripción | Puntos Contacto | Costo | Uso |
|:---|:---|:---|:---:|:---:|:---|
| CTL-001 | Sencillo | Un punto de contacto | 1 | Bajo | Estándar |
| CTL-002 | Doble | Dos puntos de contacto | 2 | Medio | Premium |

**Uso:** BOLSA Wicket  
**Obligatorio:** ✅ Sí (si Wicket=Sí)  
**Editable:** ✅ Sí  
**Opciones:** Solo 2 valores

---

# 9. CATÁLOGO: TIPO MICROPERFORADO (POUCH)

## Descripción
Tipos de microperforado para POUCH Sello Central PE-PE/PE con Fuelle.

| Código | Tipo | Descripción | Cobertura | Separación | Costo | Uso |
|:---|:---|:---|:---:|:---:|:---:|:---|
| MIC-001 | Total | Microperf en toda el área | 100% | Variable | Medio | Estándar |
| MIC-002 | Parcial | Microperf en sección | 50% | Variable | Bajo | Económica |

**Uso:** POUCH Sello Central PE-PE/PE (IF Tiene Fuelle = Sí AND Tiene Micro = Sí)  
**Obligatorio:** ✅ Sí (si Micro=Sí)  
**Editable:** ✅ Sí  
**Opciones:** Solo 2 valores

---

# 10. CATÁLOGO: TIPO ZIPPER (POUCH)

## Descripción
Tipos de zipper (cierre) para POUCH.

| Código | Nombre Zipper | Tipo | Material | Ancho | Resistencia | Costo | Durabilidad |
|:---|:---|:---|:---:|:---:|:---:|:---:|:---:|
| ZIP-001 | Zipper Plástico | Estándar | Nylon | 8mm | Media | Bajo | 500 usos |
| ZIP-002 | Zipper Reforzado | Reforzado | Nylon+Acero | 10mm | Alta | Medio | 1000 usos |
| ZIP-003 | Zipper Doble | Doble carril | Plástico | 12mm | Muy Alta | Alto | 2000 usos |
| ZIP-004 | Zipper Sellable | Sellable | Nylon | 9mm | Alta | Medio | 800 usos |

**Uso:** POUCH (Accesorios)  
**Obligatorio:** ⚪ No  
**Editable:** ✅ Sí  
**Modal:** AccessoriesSelectionModal  
**Máximo:** 3 totales

---

# 11. CATÁLOGO: TIPO VALVE (POUCH)

## Descripción
Tipos de valve (válvula de aire) para POUCH.

| Código | Nombre Valve | Tipo | Diámetro | Material | Sellado | Costo |
|:---|:---|:---|:---:|:---:|:---:|:---:|
| VLV-001 | Valve Simple | Estándar | 6mm | Plástico | Automático | Bajo |
| VLV-002 | Valve Degasificadora | Degasificador | 8mm | Silicona | Parcial | Medio |
| VLV-003 | Valve Antirreflujo | Antirreflujo | 6mm | Plástico+Acero | Total | Medio |
| VLV-004 | Valve Doble | Doble salida | 8mm | Silicona | Total | Alto |

**Uso:** POUCH (Accesorios)  
**Obligatorio:** ⚪ No  
**Editable:** ✅ Sí  
**Modal:** AccessoriesSelectionModal  
**Máximo:** 3 totales

---

# 12. CATÁLOGO: TIPO TIN-TIE (POUCH)

## Descripción
Tipos de tin-tie (cierre de alambre) para POUCH.

| Código | Nombre Tin-Tie | Tipo | Material | Largo | Resistencia | Costo |
|:---|:---|:---|:---:|:---:|:---:|:---:|
| TIN-001 | Tin-Tie Plástico | Estándar | Plástico | 8cm | Estándar | Bajo |
| TIN-002 | Tin-Tie Reforzado | Reforzado | Plástico+Papel | 10cm | Alta | Medio |
| TIN-003 | Tin-Tie Metálico | Metal | Aluminio | 12cm | Muy Alta | Medio |
| TIN-004 | Tin-Tie Reutilizable | Eco | Silicona | 10cm | Alta | Alto |

**Uso:** POUCH (Accesorios)  
**Obligatorio:** ⚪ No  
**Editable:** ✅ Sí  
**Modal:** AccessoriesSelectionModal  
**Máximo:** 3 totales

---

# 13. CATÁLOGO: ACABADOS Y VARIALES (TODOS LOS FORMATOS)

## Descripción
Acabados opcionales aplicables a cualquier formato.

| Código | Nombre | Tipo | Descripción | Brillo | Tactilidad | Costo | Disponibilidad |
|:---|:---|:---|:---|:---:|:---:|:---:|:---:|
| FIN-001 | Mate Natural | Acabado | Sin tratamiento | Bajo | Rugosa | 0% | ✅ Stock |
| FIN-002 | Mate Laca | Acabado | Lacado mate | Bajo | Lisa | 5% | ✅ Stock |
| FIN-003 | Satinado | Acabado | Satín profesional | Medio | Lisa | 8% | ⚠️ Bajo Stock |
| FIN-004 | Brillante | Acabado | Alto brillo | Alto | Lisa | 10% | ⚠️ Bajo Stock |
| FIN-005 | Metalizado | Acabado | Efecto metálico | Muy Alto | Lisa | 15% | ❌ Especial |
| FIN-006 | Softtouch | Acabado | Terciopelo suave | Bajo | Suave | 20% | ❌ Especial |
| FIN-007 | Barniz Protector | Protección | UV + Rayado | Medio | Lisa | 12% | ✅ Stock |

**Uso:** TODOS los formatos (Sección 4: Embalajes)  
**Obligatorio:** ⚪ No (opcional)  
**Editable:** ✅ Sí  
**Acumulable:** ✅ Sí (múltiples posibles)

---

# 14. CATÁLOGO: CLASIFICACIÓN PRODUCTO (TODOS)

## Descripción
Clasificación de producto: Nuevo vs Modificado (afecta cascadas).

| Código | Clasificación | Descripción | Implicaciones | Herencia | Estructura |
|:---|:---|:---:|:---|:---:|:---:|
| CLASS-001 | Producto Nuevo | Nuevo diseño | Todos campos editables | No | Nueva |
| CLASS-002 | Producto Modificado | Basado en existente | Material heredado de base | Sí | Heredada |

**Uso:** TODOS los formatos (Sección 1: Producto)  
**Obligatorio:** ✅ Sí  
**Editable:** ⚪ No (selector radio, no editable después)  
**Impacto:** Crítico (cascadas posteriores)

---

# 15. CATÁLOGO: APLICACIÓN TÉCNICA (TODOS)

## Descripción
Aplicación técnica del producto.

| Código | Aplicación | Descripción | Sector | Restricciones |
|:---|:---|:---|:---:|:---|
| APP-001 | Alimentos | Empaque alimentario | Alimentario | Certificación FDA |
| APP-002 | Farmacéutica | Empaque farmacéutico | Farmacéutico | Certificación GMP |
| APP-003 | Cosmética | Empaque cosmético | Cosmético | Restricciones químicas |
| APP-004 | Industrial | Empaque industrial | Industrial | Ninguna |
| APP-005 | Electrónica | Empaque electrónico | Electrónico | Antiestático |
| APP-006 | Textil | Empaque textil | Textil | Protección color |
| APP-007 | Otro | Aplicación especial | Otro | Especificar |

**Uso:** TODOS los formatos (Sección 1: Producto)  
**Obligatorio:** ✅ Sí  
**Editable:** ✅ Sí (agregar nuevas aplicaciones)

---

# 16. CATÁLOGO: TIPO VENTA (TODOS)

## Descripción
Tipo de venta/comercialización.

| Código | Tipo Venta | Descripción | Canal | Volumen Típico |
|:---|:---|:---:|:---|:---:|
| SAL-001 | Venta Directa | Cliente industrial | B2B | Alto |
| SAL-002 | Convertidor | A través de convertidor | B2B | Medio-Alto |
| SAL-003 | Distribuidor | A través de distribuidor | B2B | Medio |
| SAL-004 | Retail | Venta al detalle | B2C | Bajo |

**Uso:** TODOS los formatos (Sección 1: Producto)  
**Obligatorio:** ✅ Sí  
**Editable:** ✅ Sí

---

# 17. ESPECIFICACIONES ESPECIALES (TEXTO LIBRE)

## Descripción
Campo de texto libre para especificaciones no cubiertas por catálogos.

```
Ubicación: Sección 4 (Embalajes y Empalmes)
Nombre Campo: "Especificaciones Especiales"
Tipo: Text Area
Máximo: 500 caracteres
Obligatorio: No
Ejemplos:
  • "Requiere empaque doble por fragilidad"
  • "Contactar con cliente antes de producción"
  • "Validar con QA antes de iniciar"
  • "Especificación personalizada por cliente XYZ"
```

---

# 18. COMENTARIOS TÉCNICOS (TEXTO LIBRE)

## Descripción
Campo de texto libre para comentarios internos.

```
Ubicación: Sección 4 (Embalajes y Empalmes)
Nombre Campo: "Comentarios"
Tipo: Text Area
Máximo: 500 caracteres
Obligatorio: No
Ejemplos:
  • "Verificado con cliente el 2026-08-05"
  • "Pendiente aprobación de muestras"
  • "Material específico solicitado"
```

---

# 19. RESTRICCIONES ODISEO (CRÍTICAS)

## No Permitido en ODISEO

```
❌ MODIFICAR especificaciones SI (Material [SI], Estructura)
❌ CREAR nuevos materiales base
❌ ELIMINAR catálogos SI
❌ CAMBIAR valores heredados de Producto Modificado
❌ EDITAR después de envío a Sistema Integral

✅ PERMITIDO:
  ✅ Crear nuevos valores de ODISEO
  ✅ Editar valores ODISEO (no SI)
  ✅ Copiar configuraciones
  ✅ Agregar comentarios especiales
  ✅ Marcar como especial/personalizado
```

---

# 20. TOTAL CATÁLOGOS ODISEO

| Catálogo | Valores | Editable | Uso |
|:---|:---:|:---:|:---|
| Sentido Bobinado | 8 | ✅ | LÁMINA |
| Variaciones Core | 5 | ✅ | LÁMINA |
| Tipo Asa | 6 | ✅ | BOLSA |
| Color Asa | 9 | ✅ | BOLSA |
| Tipo Refuerzo | 5 | ✅ | BOLSA |
| Accesorios Internos | 7 | ✅ | BOLSA |
| Diámetro Wicket | 3 | ✅ | BOLSA |
| Control Wicket | 2 | ✅ | BOLSA |
| Tipo Microperforado | 2 | ✅ | POUCH |
| Tipo Zipper | 4 | ✅ | POUCH |
| Tipo Valve | 4 | ✅ | POUCH |
| Tipo Tin-Tie | 4 | ✅ | POUCH |
| Acabados | 7 | ✅ | TODOS |
| Clasificación | 2 | ⚪ | TODOS |
| Aplicación Técnica | 7 | ✅ | TODOS |
| Tipo Venta | 4 | ✅ | TODOS |
| **TOTAL** | **90+** | - | - |

---

**🏢 CATÁLOGO ODISEO COMPLETO** ✅

**Características:**
- ✅ 90+ Valores catalogados
- ✅ Todos editables/ampliables
- ✅ Por formato (LÁMINA, BOLSA, POUCH)
- ✅ Campos de texto libre para especiales
- ✅ Integración con SI (no duplica valores SI)

**Valores ODISEO:**
- Configurables: 90+ valores base
- Ampliables: Usuario puede agregar nuevos
- Especiales: Campos de texto libre para casos únicos

**Política:** Cualquier valor nuevo en ODISEO requiere validación antes de uso en producción
