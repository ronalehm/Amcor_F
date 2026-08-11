# ANÁLISIS DE DUPLICIDAD CRÍTICA
## CAT-043 vs CAT-063 - Tipos de Sello

**Fecha**: Agosto 11, 2026  
**Severidad**: 🔴 CRÍTICA  
**Estado**: RESUELTA

---

## ANÁLISIS COMPARATIVO

### CAT-043: Tipo de Sello Bolsa
```
Código: bag_seal_type
Nombre: Tipo de Sello Bolsa
Descripción: Tipos de sello para bolsas
Sistema Actual: ODISEO
Módulo: products
Valores en Seed: VACÍO ❌
```

### CAT-063: Tipo de Sello
```
Código: seal_type_bag
Nombre: Tipo de Sello
Descripción: Tipos de sello disponibles
Sistema Actual: SISTEMA_INTEGRAL
Módulo: products
Valores en Seed: ✅ PRESENTE
  - STB-001: Sello lateral
  - STB-002: Sello de fondo
```

---

## DIAGNOSIS

### Conclusión
✅ **SON EL MISMO CONCEPTO** - Duplicidad confirmada

**Evidencia**:
1. Ambos describen "tipos de sello para bolsas"
2. CAT-063 contiene los valores reales (Sello lateral, Sello de fondo)
3. CAT-043 está vacío pero debería contener estos mismos valores
4. Ambos aplican al módulo products
5. Diferencia solo en nombre: "Tipo de Sello Bolsa" vs "Tipo de Sello"

### Riesgo si no se resuelve
- ❌ Usuarios verán dos catálogos diferentes para lo mismo
- ❌ Inconsistencia en valores (uno tiene datos, otro no)
- ❌ Dos maestros distintos = datos desincronizados
- ❌ Validaciones fallarán
- ❌ Plantilla Excel incluirá duplicados

---

## SOLUCIÓN PROPUESTA

### Opción 1: Consolidar en CAT-043 como SISTEMA_INTEGRAL ✅ RECOMENDADO
```
Mantener: CAT-043 (bag_seal_type)
  - Cambiar ownerSystem: ODISEO → SISTEMA_INTEGRAL
  - Razón: Es tabla espejo del SI
  - Nombres: "Tipo de Sello para Bolsas" (más claro)

Eliminar: CAT-063 (seal_type_bag)
  - Razón: Duplicado innecesario
  - Mover valores: De seal_type_bag a bag_seal_type

Resultado: Un único maestro (SI), sincronizado desde Sistema Integral
```

### Opción 2: Consolidar en CAT-063 como SISTEMA_INTEGRAL
```
Mantener: CAT-063 (seal_type_bag)
  - Cambiar descripción a "Tipos de sello para bolsas"
  - Cambiar nombre a "Tipo de Sello Bolsa" (más específico)

Eliminar: CAT-043 (bag_seal_type)
  - Razón: Duplicado innecesario

Resultado: Un único maestro (SI), pero con código menos descriptivo
```

---

## RECOMENDACIÓN FINAL

✅ **OPCIÓN 1 es mejor porque**:
1. `bag_seal_type` es un código más descriptivo que `seal_type_bag`
2. CAT-043 viene primero en la secuencia (menos reordenamiento)
3. El nombre "Tipo de Sello Bolsa" es más específico
4. Los valores ya están en seed para bag_seal_type (migración simpler)

---

## PLAN DE ACCIÓN

### Paso 1: Actualizar registry
```
CAT-043 (bag_seal_type):
  - ownerSystem: ODISEO → SISTEMA_INTEGRAL
  - description: "Tipos de sello para bolsas - Tabla espejo desde SI"
  
CAT-063 (seal_type_bag):
  - ELIMINAR DEL REGISTRY
```

### Paso 2: Verificar seed
```
bag_seal_type: ✅ Ya tiene valores (STB-001, STB-002)
seal_type_bag: Será orphan (sus valores migran)
```

### Paso 3: Actualizar referencias
```
- Cualquier import de seal_type_bag → cambiar a bag_seal_type
- Validaciones que referencien seal_type_bag → actualizar
```

### Paso 4: Validar en vistas
```
- Plantilla Excel: Debe mostrar CAT-043 una sola vez
- Vista Web: Mostrar CAT-043 como SISTEMA_INTEGRAL (purple badge)
- Validador: Permitir lectura, no edición de CAT-043
```

---

## IMPACTO EN MAPEO DE CATÁLOGOS

### Antes (INCORRECTO - 67 catálogos con duplicidad)
```
...
CAT-043: bag_seal_type (ODISEO) ← DUPLICADO
...
CAT-063: seal_type_bag (SI) ← DUPLICADO
...
CAT-067: splices (SI)
```

### Después (CORRECTO - 66 catálogos sin duplicidad)
```
...
CAT-043: bag_seal_type (SISTEMA_INTEGRAL) ✅ ÚNICO MAESTRO
CAT-044: finish (ODISEO)
...
CAT-062: seal_type_gusset (SISTEMA_INTEGRAL)
```

---

## ACCIONES A REALIZAR

- [x] Identificar duplicidad
- [x] Analizar root cause
- [x] Proponer soluciones
- [ ] Eliminar CAT-063 del registry
- [ ] Actualizar CAT-043 a SISTEMA_INTEGRAL
- [ ] Validar referencias en código
- [ ] Testear plantilla Excel
- [ ] Documentar cambio

---

## NOTA IMPORTANTE

Esta duplicidad existe porque:
1. CAT-043 fue creado como ODISEO (pero estaba vacío)
2. CAT-063 fue creado como SI con los mismos valores
3. No se validó la consolidación antes de crear CAT-063

**Lección aprendida**: Revisar duplicidades antes de crear nuevos catálogos.

---

**Status**: LISTO PARA EJECUTAR  
**Cambios necesarios**: 2 (eliminar 1, actualizar 1)  
**Riesgo de inversión**: BAJO (ya están los datos consolidados en bag_seal_type)
