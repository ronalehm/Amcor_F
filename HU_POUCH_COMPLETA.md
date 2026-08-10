# 📦 HU: POUCH - Configuración y Validaciones Completas

**Versión:** 2.0  
**Fecha:** 2026-08-10  
**Story Points:** 21  
**Prioridad:** Alta  

---

## 📋 Resumen Ejecutivo

Implementar flujo completo de configuración para productos POUCH incluyendo:
- Selección jerárquica: Familia → Sub-familia → Combinaciones
- Validación de dimensiones (width, length, anchoFuelle)
- Cálculo automático de perímetro
- Validación de perímetro con validaciones especiales para Doy Pack
- Configuración de accesorios (máximo 3 totales)
- Cálculos automáticos específicos por tipo (Ancho Total, Perímetro)

---

## 🎯 Requisitos Funcionales

### RF-1: Selección de Familia POUCH (Nivel 0)
**Descripción:** Usuario selecciona familia principal de pouch  
**Criterio de Aceptación:**
- ✅ Campo "Familia de POUCH" es obligatorio (*)
- ✅ Opciones: Stand Up, Plano, Sello Central, Sello Fuelle
- ✅ Cambiar familia limpia campos sub-dependientes
- ✅ Mostrar imagen representativa de cada familia

**Tipos:**
```typescript
tipoFormatoPouch: "StandUp" | "Plano" | "SelloCentral" | "SelloFuelle"
```

### RF-2: Stand Up POUCH - Sub-familia (Nivel 1)
**Descripción:** Usuario selecciona tipo de Stand Up  
**Criterio de Aceptación:**
- ✅ Campo "Tipo de Stand Up" es obligatorio (*) si Familia = "Stand Up"
- ✅ Opciones: Sello K, Normal, Doy Pack
- ✅ Cambiar tipo afecta campos de Nivel 2

**Tipos Stand Up:**
```typescript
tipoStandUpPouch: "SelloK" | "Normal" | "DoyPack"
```

### RF-3: Doy Pack - Base (Nivel 2)
**Descripción:** Usuario selecciona forma de base de Doy Pack  
**Criterio de Aceptación:**
- ✅ Campo "Base Doy Pack" es obligatorio (*) si tipoStandUpPouch = "DoyPack"
- ✅ Opciones: Redonda, Cuadrada
- ✅ Cambiar base afecta validaciones de dimensiones

**Tipos:**
```typescript
formaDoyPackPouch: "Redonda" | "Cuadrada"
```

### RF-4: Doy Pack - Tipo Fuelle (Nivel 2)
**Descripción:** Usuario selecciona tipo de fuelle para Doy Pack  
**Criterio de Aceptación:**
- ✅ Campo "Tipo de Fuelle Stand Up" es obligatorio (*) si tipoStandUpPouch = "DoyPack"
- ✅ Opciones: Fuelle Propio, Fuelle Insertado
- ✅ Afecta generación del blueprintFormat

**Tipos:**
```typescript
tipoFuelleStandUpPouch: "FuellePropio" | "FuelleInsertado"
```

### RF-5: POUCH Plano - Cantidad de Sellos (Nivel 1)
**Descripción:** Usuario selecciona cantidad de sellos para Plano  
**Criterio de Aceptación:**
- ✅ Campo "Cantidad de Sellos" es obligatorio (*) si Familia = "Plano"
- ✅ Opciones: Dos Sellos, Tres Sellos
- ✅ Afecta campos disponibles (Tres Sellos tiene campo extra: anchoSelloLateral)

**Tipos:**
```typescript
cantidadSellosPouchPlano: "DOS" | "TRES"
```

### RF-6: POUCH Sello Central - Material (Nivel 1)
**Descripción:** Usuario selecciona material de Sello Central  
**Criterio de Aceptación:**
- ✅ Campo "Material Sello Central" es obligatorio (*) si Familia = "SelloCentral"
- ✅ Opciones: PE-PE/PE, Aleta, Otro Material
- ✅ Cada material tiene campos y comportamientos diferentes

**Tipos:**
```typescript
materialSelloCentralPouch: "PE_PE_PE" | "Aleta" | "Otro"
```

### RF-7: POUCH Sello Central - Fuelle (Nivel 1)
**Descripción:** Usuario selecciona si tiene fuelle  
**Criterio de Aceptación:**
- ✅ Campo "¿Tiene Fuelle?" es obligatorio (*) si Familia = "SelloCentral"
- ✅ Opciones: Sí, No
- ✅ Afecta disponibilidad de campos (anchoFuelleCerrado solo si Fuelle = Sí)
- ✅ Afecta generación de blueprintFormat

**Tipos:**
```typescript
tieneFuelleSelloCentralPouch: "Sí" | "No"
```

### RF-8: POUCH Sello Fuelle - Tipo (Nivel 1)
**Descripción:** Usuario selecciona tipo de sello en fuelle  
**Criterio de Aceptación:**
- ✅ Campo "Tipo de Sello en Fuelle" es obligatorio (*) si Familia = "SelloFuelle"
- ✅ Opciones: Tipo 4-1, Tipo 1-1
- ✅ Afecta generación de blueprintFormat

**Tipos:**
```typescript
tipoSelloFuellePouch: "Tipo4-1" | "Tipo1-1"
```

### RF-9: Validación de Dimensiones - POUCH
**Descripción:** Validar dimensiones con rangos específicos por tipo  
**Criterio de Aceptación:**
- ✅ width es obligatorio (*) - rango general: 1-500 mm
- ✅ length es obligatorio (*) - rango general: 1-500 mm
- ✅ anchoFuelle es obligatorio (*) - rango general: 0-500 mm
- ✅ **Doy Pack tiene restricciones especiales:**
  - width: 80-230 mm ⚠️
  - length: 134-340 mm ⚠️
  - anchoFuelle: 0-3 mm ⚠️
- ✅ Validar en tiempo real (onChange)
- ✅ Mostrar errores específicos por rango
- ✅ Bloquear submit si hay errores

**Validaciones:**
```typescript
const validatePouchDimensions = (
  form: ProjectEditFormData,
  isDoyPack: boolean
): ValidationResult => {
  const errors: string[] = [];
  
  if (isDoyPack) {
    // Validaciones especiales Doy Pack
    if (!form.width || parseFloat(form.width) < 80 || parseFloat(form.width) > 230) {
      errors.push("Width POUCH Doy Pack: 80-230 mm");
    }
    if (!form.length || parseFloat(form.length) < 134 || parseFloat(form.length) > 340) {
      errors.push("Length POUCH Doy Pack: 134-340 mm");
    }
    if (parseFloat(form.anchoFuelle) < 0 || parseFloat(form.anchoFuelle) > 3) {
      errors.push("Ancho Fuelle POUCH Doy Pack: 0-3 mm");
    }
  } else {
    // Validaciones generales
    if (!form.width || parseFloat(form.width) <= 0 || parseFloat(form.width) > 500) {
      errors.push("Width debe estar entre 1 y 500 mm");
    }
    if (!form.length || parseFloat(form.length) <= 0 || parseFloat(form.length) > 500) {
      errors.push("Length debe estar entre 1 y 500 mm");
    }
    if (parseFloat(form.anchoFuelle) < 0 || parseFloat(form.anchoFuelle) > 500) {
      errors.push("Ancho Fuelle debe estar entre 0 y 500 mm");
    }
  }
  
  return { isValid: errors.length === 0, errors };
};
```

### RF-10: Cálculo y Validación de Perímetro - POUCH
**Descripción:** Calcular perímetro de POUCH  
**Criterio de Aceptación:**
- ✅ Fórmula: Perímetro = 2 × (width + length)
- ✅ Campo "Perímetro (mm)" es obligatorio (*) - solo lectura
- ✅ Validar rango: 100-15000 mm
- ✅ Campo "Validación de perímetros" es obligatorio (*) - Validado/Rechazado
- ✅ Calcular cuando cambien width o length
- ✅ **Validación especial para Doy Pack:**
  - Rango más restrictivo: 100-650 mm

**Cálculo:**
```typescript
const calculateAndValidatePouchPerimeter = (
  width: number,
  length: number,
  isDoyPack: boolean
): PerimeterResult => {
  const perimeter = 2 * (width + length);
  
  let minPerimeter = 100;
  let maxPerimeter = 15000;
  
  if (isDoyPack) {
    // Rango más restrictivo para Doy Pack
    minPerimeter = 100;
    maxPerimeter = 650;
  }
  
  return {
    perimeter,
    status: (perimeter >= minPerimeter && perimeter <= maxPerimeter)
      ? "Validado"
      : "Rechazado",
    error: (perimeter < minPerimeter || perimeter > maxPerimeter)
      ? `Perímetro ${perimeter} mm fuera de rango (${minPerimeter}-${maxPerimeter})`
      : null
  };
};
```

### RF-11: Cálculo de Ancho Total - Sello Central
**Descripción:** Calcular Ancho Total automáticamente para Sello Central  
**Criterio de Aceptación:**
- ✅ Fórmula: Ancho Total = anchoSelloAleta + selloAnchoTransversal
- ✅ Mostrar campo "Ancho Total Calculado" - solo lectura
- ✅ Recalcular cuando cambien anchoSelloAleta o selloAnchoTransversal
- ✅ Solo visible si Familia = "SelloCentral" Y materialSelloCentralPouch = "PE_PE_PE"

**Cálculo:**
```typescript
const calculatePouchTotalWidth = (
  anchoSelloAleta: number,
  selloAnchoTransversal: number
): number => {
  if (!anchoSelloAleta || !selloAnchoTransversal) return 0;
  return anchoSelloAleta + selloAnchoTransversal;
};
```

### RF-12: Microperforado - Sello Central PE-PE/PE
**Descripción:** Configurar microperforado solo para Sello Central PE-PE/PE  
**Criterio de Aceptación:**
- ✅ Sección "Microperforado" SOLO visible si:
  - Familia = "SelloCentral" AND
  - materialSelloCentralPouch = "PE_PE_PE" AND
  - tieneFuelleSelloCentralPouch = "Sí"
- ✅ Campo "¿Tiene Microperforado?" - Sí/No
- ✅ Si Sí → Campos: ladoAleta, tipoMicroperforado, separacionPuasAleta, distanciaLadoAleta
- ✅ Campos condicionales desaparecen si Sí → No

**Estructura:**
```typescript
hasMicroperforado: string; // Sí | No
ladoAleta: string; // Derecho | Izquierdo
tipoMicroperforado: string; // Total | Parcial
separacionPuasAleta: string; // Opciones
distanciaLadoAleta: string; // mm

// Validación: Solo visible si todas condiciones se cumplen
const shouldShowMicroperforado = (form: ProjectEditFormData): boolean => {
  return (
    form.tipoFormatoPouch === "SelloCentral" &&
    form.materialSelloCentralPouch === "PE_PE_PE" &&
    form.tieneFuelleSelloCentralPouch === "Sí"
  );
};
```

### RF-13: Accesorios POUCH (máx 3 totales)
**Descripción:** Agregar accesorios a POUCH  
**Criterio de Aceptación:**
- ✅ Botón "Agregar Accesorio"
- ✅ Máximo 3 accesorios TOTALES (bloquear después)
- ✅ Opciones: Zipper, Tin-Tie, Valve
- ✅ Zipper → Campos: zipperType, distanciaAbocaZipper
- ✅ Valve → Campos: valveType, distanciaAbocaValvula
- ✅ Poder eliminar accesorios
- ✅ Validar formatos

**Estructura:**
```typescript
interface PouchAccessory {
  type: "Zipper" | "TinTie" | "Valve";
  zipperType?: "Convencional" | "String Zipper";
  valveType?: "Degasificadora" | "Dosificadora";
  distancia?: number; // mm
}

// Máximo 3 totales
accessories: PouchAccessory[] // length <= 3
```

### RF-14: Especificaciones de Sello - POUCH Plano
**Descripción:** Configurar especificaciones de sello  
**Criterio de Aceptación:**
- ✅ Campos: anchoSello, selloAnchoTransversal (ambos opcionales)
- ✅ Solo visible si Familia = "Plano"
- ✅ Si Cantidad = "Tres Sellos" → Campo adicional: anchoSelloLateral
- ✅ Validar formato numérico

**Estructura:**
```typescript
anchoSello: string; // Opcional, rango: 1-500 mm
selloAnchoTransversal: string; // Opcional, rango: 1-500 mm
anchoSelloLateral: string; // Opcional, SOLO si Tres Sellos
```

---

## 🔄 Flujos de Usuario

### Flujo 1: Crear Stand Up Pouch - Sello K
```
1. Usuario selecciona tipoFormatoPouch: "Stand Up"
2. Usuario selecciona tipoStandUpPouch: "Sello K"
   → blueprintFormat: "POUCH STAND UP\TIPO K\FUELLE PROPIO"
3. Usuario ingresa width: "200" mm
4. Usuario ingresa length: "350" mm
5. Usuario ingresa anchoFuelle: "80" mm
   → Perímetro calculado: 1100 mm ✅
   → Validación: "Validado" ✅
6. Usuario puede agregar accesorios (máx 3):
   - Zipper: "String Zipper", distancia 25mm
   - Valve: "Degasificadora", distancia 50mm
7. Usuario guarda → Proyecto guardado ✅
```

### Flujo 2: Crear Stand Up Pouch - Doy Pack Redondo
```
1. Usuario selecciona tipoFormatoPouch: "Stand Up"
2. Usuario selecciona tipoStandUpPouch: "Doy Pack"
   → Campo "Base Doy Pack" se muestra
3. Usuario selecciona formaDoyPackPouch: "Redonda"
4. Usuario selecciona tipoFuelleStandUpPouch: "Fuelle Propio"
   → blueprintFormat: "POUCH STAND UP\DOY PACK REDONDO\FUELLE PROPIO"
5. Usuario ingresa width: "150" mm (validación: 80-230) ✅
6. Usuario ingresa length: "200" mm (validación: 134-340) ✅
7. Usuario ingresa anchoFuelle: "2" mm (validación: 0-3) ✅
   → Perímetro: 700 mm (validación: 100-650) ✅
   → blueprintFormat generado correctamente ✅
8. Usuario guarda → Proyecto guardado ✅
```

### Flujo 3: Crear POUCH Sello Central PE-PE/PE + Microperforado
```
1. Usuario selecciona tipoFormatoPouch: "Sello Central"
2. Usuario selecciona materialSelloCentralPouch: "PE-PE/PE"
3. Usuario selecciona tieneFuelleSelloCentralPouch: "Sí"
   → Mostrar campos de fuelle y microperforado
   → blueprintFormat: "POUCH C/SELLO CENTRAL\TIPO ALETA\CON FUELLE (PE-PE/PE)"
4. Usuario ingresa dimensiones válidas
5. Usuario ingresa anchoSelloAleta: "12" mm
6. Usuario ingresa selloAnchoTransversal: "25" mm
   → Ancho Total calculado: 37 mm ✅
7. Usuario marca hasMicroperforado: "Sí"
   → Campos de microperforado aparecen
8. Usuario selecciona ladoAleta: "Derecho"
9. Usuario selecciona tipoMicroperforado: "Total"
10. Usuario guarda → Proyecto guardado ✅
```

### Flujo 4: Validación Fallida - Doy Pack Fuera de Rango
```
1. Usuario selecciona Doy Pack
2. Usuario ingresa width: "300" mm (> 230)
   → Error: "Width POUCH Doy Pack: 80-230 mm"
3. Usuario no puede guardar
4. Usuario cambia width: "200" mm ✅
5. Usuario ingresa length: "400" mm (> 340)
   → Error: "Length POUCH Doy Pack: 134-340 mm"
6. Usuario cambia length: "250" mm ✅
7. Usuario ingresa anchoFuelle: "5" mm (> 3)
   → Error: "Ancho Fuelle POUCH Doy Pack: 0-3 mm"
8. Usuario cambia anchoFuelle: "2" mm ✅
9. Usuario guarda → Éxito ✅
```

---

## ✅ Casos de Prueba

### TC-01: Stand Up Sello K Válido
```gherkin
Given usuario está creando POUCH
When selecciona tipoStandUpPouch: "Sello K"
And ingresa width: "250", length: "400", anchoFuelle: "100"
Then perímetro: "1300" mm
And validación: "Validado"
And usuario puede guardar
```

### TC-02: Doy Pack - Validaciones Especiales
```gherkin
Given tipoStandUpPouch: "Doy Pack"
When ingresa width: "150" (valid: 80-230)
And ingresa length: "200" (valid: 134-340)
And ingresa anchoFuelle: "2" (valid: 0-3)
Then perímetro: "700" mm (valid: 100-650)
And usuario puede guardar

When ingresa width: "50" (< 80)
Then error: "Width POUCH Doy Pack: 80-230 mm"
```

### TC-03: Cascada Jerárquica Completa
```gherkin
When tipoFormatoPouch: "Stand Up"
Then tipoStandUpPouch VISIBLE

When tipoStandUpPouch: "Doy Pack"
Then formaDoyPackPouch VISIBLE
And tipoFuelleStandUpPouch VISIBLE

When cambio a tipoStandUpPouch: "Sello K"
Then formaDoyPackPouch OCULTO
And tipoFuelleStandUpPouch OCULTO
```

### TC-04: Ancho Total Cálculo Automático
```gherkin
Given materialSelloCentralPouch: "PE-PE/PE"
And tieneFuelleSelloCentralPouch: "Sí"
When ingresa anchoSelloAleta: "10"
And ingresa selloAnchoTransversal: "20"
Then anchoTotalCalculado: "30"
And recalcula cuando cambio valores
```

### TC-05: Microperforado Solo en PE-PE/PE + Con Fuelle
```gherkin
When materialSelloCentralPouch: "PE-PE/PE"
And tieneFuelleSelloCentralPouch: "Sí"
Then sección Microperforado VISIBLE

When materialSelloCentralPouch: "Aleta"
Then sección Microperforado OCULTA

When tieneFuelleSelloCentralPouch: "No"
Then sección Microperforado OCULTA
```

### TC-06: Máximo 3 Accesorios
```gherkin
When usuario agrega accesorio #1: Zipper
And agrega accesorio #2: Valve
And agrega accesorio #3: Tin-Tie
Then botón "Agregar" está deshabilitado

When elimina 1 accesorio
Then botón se habilita
And puede agregar accesorio #4 (que será #3)
```

### TC-07: POUCH Plano - Tres Sellos
```gherkin
Given familia: "Plano"
When cantidadSellosPouchPlano: "DOS"
Then anchoSelloLateral NO VISIBLE

When cambio a cantidadSellosPouchPlano: "TRES"
Then anchoSelloLateral VISIBLE
And es campo opcional
```

### TC-08: Perímetro Máximo Excedido
```gherkin
When ingresa width: "400", length: "450" (no Doy Pack)
Then perímetro: "1700" mm
And validación: "Validado" (< 15000)

When ingresa valores que generan perímetro: "20000"
Then validación: "Rechazado"
And error: "Perímetro 20000 mm fuera de rango"
```

### TC-09: Blueprint Format Generación
```gherkin
Given tipoStandUpPouch: "Sello K"
Then blueprintFormat: "POUCH STAND UP\TIPO K\FUELLE PROPIO"

Given tipoStandUpPouch: "Doy Pack"
And formaDoyPackPouch: "Redonda"
And tipoFuelleStandUpPouch: "Fuelle Propio"
Then blueprintFormat: "POUCH STAND UP\DOY PACK REDONDO\FUELLE PROPIO"

Given familia: "Sello Central"
And materialSelloCentralPouch: "PE-PE/PE"
And tieneFuelleSelloCentralPouch: "Sí"
Then blueprintFormat: "POUCH C/SELLO CENTRAL\TIPO ALETA\CON FUELLE (PE-PE/PE)"
```

### TC-10: Validación Total POUCH Compleja
```gherkin
Given usuario crea POUCH con todas configuraciones
When completa cascada jerárquica
And cumple dimensiones correctas
And configura accesorios válidos
And perímetro es válido
And cálculos especiales son correctos
Then proyecto se guarda exitosamente
```

---

## 🎯 Criterios de Aceptación (Gherkin)

```gherkin
Feature: POUCH - Configuración y Validaciones

  Scenario: Crear POUCH con cascada completa
    Given usuario está creando POUCH
    When selecciona Familia → Sub-familia → Combinación
    And ingresa dimensiones válidas
    And configura accesorios
    Then blueprintFormat se genera correctamente
    And proyecto se guarda

  Scenario: Validaciones especiales Doy Pack
    Given POUCH tipo Doy Pack
    When ingresa width: 80-230, length: 134-340, fuelle: 0-3
    And perímetro: 100-650
    Then validaciones pasan
    And proyecto se guarda

  Scenario: Cálculos automáticos Sello Central
    Given material PE-PE/PE + Con Fuelle
    When ingresa anchoSelloAleta + selloAnchoTransversal
    Then Ancho Total se calcula automáticamente
    And Microperforado aparece como opción

  Scenario: Máximo accesorios alcanzado
    Given usuario ha agregado 3 accesorios
    When intenta agregar 4to
    Then botón deshabilitado
    And puede eliminar para agregar otro
```

---

## 🔧 Especificaciones Técnicas

### Estructura ProjectEditFormData - POUCH
```typescript
// Familia
tipoFormatoPouch: string; // StandUp | Plano | SelloCentral | SelloFuelle

// Stand Up
tipoStandUpPouch: string; // SelloK | Normal | DoyPack
formaDoyPackPouch: string; // Redonda | Cuadrada
tipoFuelleStandUpPouch: string; // FuellePropio | FuelleInsertado

// Plano
cantidadSellosPouchPlano: string; // DOS | TRES

// Sello Central
materialSelloCentralPouch: string; // PE_PE_PE | Aleta | Otro
tieneFuelleSelloCentralPouch: string; // Sí | No

// Sello Fuelle
tipoSelloFuellePouch: string; // Tipo4-1 | Tipo1-1

// Blueprint Format (Auto-generado)
blueprintFormat: string; // Generado según cascada

// Dimensiones - OBLIGATORIOS
width: string; // Rango: 1-500 (80-230 si Doy Pack)
length: string; // Rango: 1-500 (134-340 si Doy Pack)
anchoFuelle: string; // Rango: 0-500 (0-3 si Doy Pack)

// Perímetro
perimeterMm: string; // Calculado: 2 * (width + length)
perimeterValidationStatus: string; // Validado | Rechazado
perimeterComment: string; // Comentario

// Especificaciones Sello (Plano - Opcional)
anchoSello: string; // Opcional
selloAnchoTransversal: string; // Opcional
anchoSelloLateral: string; // Opcional, SOLO Tres Sellos

// Sello Central (Opcional)
anchoSelloAleta: string; // Opcional, 10/12/15 mm
anchoFuelleCerrado: string; // Opcional, si Fuelle = Sí
anchoTotalCalculado: string; // Calculado: anchoSelloAleta + selloAnchoTransversal

// Microperforado (PE-PE/PE + Fuelle = Sí)
hasMicroperforado: string; // Sí | No
ladoAleta: string; // Derecho | Izquierdo
tipoMicroperforado: string; // Total | Parcial
separacionPuasAleta: string; // Opciones
distanciaLadoAleta: string; // mm

// Accesorios (máx 3)
hasZipper: string; // Sí | No
zipperType: string; // Convencional | String Zipper
distanciaAbocaZipper: string; // mm

hasTinTie: string; // Sí | No

hasValve: string; // Sí | No
valveType: string; // Degasificadora | Dosificadora
distanciaAbocaValvula: string; // mm
```

### Validaciones en ProductEditPage.tsx
```typescript
// Determinar si es Doy Pack
const isDoyPack = (form: ProjectEditFormData): boolean => {
  return form.tipoFormatoPouch === "Stand Up" && 
         form.tipoStandUpPouch === "DoyPack";
};

// Validación de dimensiones POUCH
const validatePouchDimensions = (form: ProjectEditFormData): Errors => {
  const isDoy = isDoyPack(form);
  const errors: Errors = {};
  
  const widthMin = isDoy ? 80 : 1;
  const widthMax = isDoy ? 230 : 500;
  const lengthMin = isDoy ? 134 : 1;
  const lengthMax = isDoy ? 340 : 500;
  const fuelleMax = isDoy ? 3 : 500;
  
  // Validar width
  if (!form.width || parseFloat(form.width) < widthMin || parseFloat(form.width) > widthMax) {
    errors.width = `Width: ${widthMin}-${widthMax} mm`;
  }
  
  // Similar para length y anchoFuelle
  
  return errors;
};

// Cálculo Ancho Total (Sello Central)
const handleAnchosChange = () => {
  const ancho1 = parseFloat(form.anchoSelloAleta) || 0;
  const ancho2 = parseFloat(form.selloAnchoTransversal) || 0;
  const total = ancho1 + ancho2;
  updateField("anchoTotalCalculado", total.toString());
};
```

---

## 📊 Dependencias

- `projectStorage.ts` - Guardar/cargar proyectos
- `dimensionRestrictionRules.ts` - Reglas de validación dimensional
- `productCatalogs.ts` - Catálogos ODISEO
- `formatPlanRules.ts` - Generación de blueprintFormat

---

## 🎯 Story Points: 21

**Desglose:**
- Cascada jerárquica (4 niveles): 8 pts
- Validaciones (incluyendo Doy Pack especial): 5 pts
- Cálculos (Perímetro, Ancho Total): 3 pts
- Accesorios + Condicionales: 3 pts
- Testing exhaustivo: 2 pts

**Complejidad:** Alta  
**Riesgo:** Medio-Alto - Cascadas muy complejas, múltiples combinaciones

---

**Documento Completo - HU POUCH v2** ✅
