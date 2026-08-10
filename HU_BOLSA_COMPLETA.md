# 🛍️ HU: BOLSA - Configuración y Validaciones Completas

**Versión:** 2.0  
**Fecha:** 2026-08-10  
**Story Points:** 16  
**Prioridad:** Alta  

---

## 📋 Resumen Ejecutivo

Implementar flujo completo de configuración para productos BOLSA incluyendo:
- Selección jerárquica: Presentación → Sello → Acabado → Fuelle
- Validación de dimensiones (width, length, anchoFuelle)
- Cálculo automático de perímetro
- Validación de perímetro con rango permitido
- Configuración de accesorios (Producto e Internos) - máximo 3 cada uno
- Configuración especial de Wicket (si aplica)

---

## 🎯 Requisitos Funcionales

### RF-1: Selección de Presentación (Nivel 0)
**Descripción:** Usuario selecciona presentación de bolsa  
**Criterio de Aceptación:**
- ✅ Campo "Tipo de Presentación" es obligatorio (*)
- ✅ Opciones: Bolsa, Wicket, Hojas
- ✅ Cambiar presentación limpia campos dependientes
- ✅ Mostrar vista previa de la presentación

**Tipos:**
```typescript
tipoFormatoBolsa: "Bolsa" | "Wicket" | "Hojas"
```

### RF-2: Selección de Sello (Nivel 1 - Bolsa)
**Descripción:** Usuario selecciona tipo de sello para Bolsa  
**Criterio de Aceptación:**
- ✅ Campo "Tipo de Sello" es obligatorio (*) si tipoFormatoBolsa = "Bolsa"
- ✅ Opciones: Sello Lateral, Sello de Fondo
- ✅ Cambiar sello afecta campos disponibles en Nivel 2

**Tipos:**
```typescript
tipoSelloBolsa: "Lateral" | "Fondo"
```

### RF-3: Selección de Acabado (Nivel 2 - Solo Sello Lateral)
**Descripción:** Usuario selecciona acabado si sello es Lateral  
**Criterio de Aceptación:**
- ✅ Campo "Acabado" es obligatorio (*) SOLO si tipoSelloBolsa = "Lateral"
- ✅ Opciones: Corte, Pestaña
- ✅ Si tipoSelloBolsa = "Fondo" → Campo NO visible
- ✅ Cambiar acabado limpia campos sub-dependientes

**Tipos:**
```typescript
acabadoBolsa: "Corte" | "Pestaña" // Solo si Lateral
```

### RF-4: Selección de Fuelle (Nivel 2)
**Descripción:** Usuario selecciona si bolsa tiene fuelle  
**Criterio de Aceptación:**
- ✅ Campo "¿Tiene Fuelle?" es obligatorio (*) si tipoFormatoBolsa = "Bolsa"
- ✅ Opciones: Sí, No
- ✅ Si Sí → Mostrar campo "Tipo de Fuelle"
- ✅ Campo "Ancho Fuelle" es obligatorio (*) solo si Fuelle = Sí

**Tipos:**
```typescript
tieneFuelleBolsa: "Sí" | "No"
tipoFuelleBolsa: string; // Depende de sello
anchoFuelle: string; // Obligatorio si Fuelle = Sí, rango: 0-500 mm
```

### RF-5: Validación de Dimensiones - BOLSA
**Descripción:** Validar dimensiones de la bolsa  
**Criterio de Aceptación:**
- ✅ width es obligatorio (*) - rango 1-3000 mm
- ✅ length es obligatorio (*) - rango 1-3000 mm
- ✅ anchoFuelle es obligatorio (*) si tieneFuelleBolsa = "Sí" - rango 0-500 mm
- ✅ alturaEnLaBolsa es opcional
- ✅ anchoEnLaBolsa es opcional
- ✅ Validar en tiempo real (onChange)
- ✅ Mostrar error si está fuera de rango
- ✅ Bloquear submit si hay errores

**Validaciones:**
```typescript
const validateBolsaDimensions = (
  width: number,
  length: number,
  anchoFuelle: number | null,
  tieneFuelleBolsa: string
): ValidationResult => {
  const errors: string[] = [];
  
  if (!width || width <= 0 || width > 3000) {
    errors.push("Width debe estar entre 1 y 3000 mm");
  }
  
  if (!length || length <= 0 || length > 3000) {
    errors.push("Length debe estar entre 1 y 3000 mm");
  }
  
  if (tieneFuelleBolsa === "Sí") {
    if (anchoFuelle === null || anchoFuelle < 0 || anchoFuelle > 500) {
      errors.push("Ancho Fuelle debe estar entre 0 y 500 mm");
    }
  }
  
  return { isValid: errors.length === 0, errors };
};
```

### RF-6: Cálculo y Validación de Perímetro - BOLSA
**Descripción:** Calcular perímetro de la bolsa  
**Criterio de Aceptación:**
- ✅ Fórmula: Perímetro = 2 × (width + length)
- ✅ Campo "Perímetro (mm)" es obligatorio (*) - solo lectura
- ✅ Validar rango: 100-10000 mm
- ✅ Si está fuera de rango → mostrar error
- ✅ Campo "Validación de perímetros" es obligatorio (*) - Validado/Rechazado
- ✅ Calcular cuando cambien width o length

**Cálculo:**
```typescript
const calculateAndValidateBolsaPerimeter = (
  width: number,
  length: number
): PerimeterResult => {
  const perimeter = 2 * (width + length);
  const MIN_PERIMETER = 100;
  const MAX_PERIMETER = 10000;
  
  return {
    perimeter,
    status: (perimeter >= MIN_PERIMETER && perimeter <= MAX_PERIMETER)
      ? "Validado"
      : "Rechazado",
    error: (perimeter < MIN_PERIMETER || perimeter > MAX_PERIMETER)
      ? `Perímetro ${perimeter} mm fuera de rango (${MIN_PERIMETER}-${MAX_PERIMETER})`
      : null
  };
};
```

### RF-7: Accesorios Producto (máx 3)
**Descripción:** Agregar accesorios de tipo Producto  
**Criterio de Aceptación:**
- ✅ Botón "Agregar Accesorio Producto"
- ✅ Máximo 3 accesorios (bloquear después)
- ✅ Opciones: Asa Troquelada, Refuerzo
- ✅ Si Asa Troquelada → Campos: tipoAsa, colorAsa, formaAsa
- ✅ Si Refuerzo → Campos: reinforcementThickness, reinforcementWidth
- ✅ Poder eliminar accesorios
- ✅ Validar formato de campos

**Estructura:**
```typescript
interface BolsaAccessoryProducto {
  type: "AsaTroquelada" | "Refuerzo";
  asaType?: "Asida" | "Tirador" | "Anilla" | "Asa cosida";
  asaColor?: string;
  asaShape?: "Circular" | "Plana" | "Rectangular" | "Ovalada";
  reinforcementThickness?: string;
  reinforcementWidth?: string;
}

// Máximo 3
accessories_producto: BolsaAccessoryProducto[] // length <= 3
```

### RF-8: Accesorios Internos (máx 3)
**Descripción:** Agregar accesorios internos a la bolsa  
**Criterio de Aceptación:**
- ✅ Botón "Agregar Accesorio Interno"
- ✅ Máximo 3 accesorios (bloquear después)
- ✅ Opciones: Corte Angular, Esquinas Redondas, Muesca, Perforación, Pre-Corte
- ✅ Cada opción tiene campos específicos
- ✅ Poder eliminar accesorios
- ✅ Validar formato de campos

**Estructura:**
```typescript
interface BolsaAccessoryInterno {
  type: "CorteAngular" | "EsquinasRedondas" | "Muesca" | "Perforacion" | "PreCorte";
  lado?: "Derecho" | "Izquierdo";
  esquinasType?: string;
  distancia?: number; // mm
  perforationType?: string;
  ubicacion?: "Superior" | "Inferior" | "Delantero" | "Posterior";
  preCutType?: string;
}

// Máximo 3
accessories_interno: BolsaAccessoryInterno[] // length <= 3
```

### RF-9: Configuración de Wicket (Nivel 1 - Solo si tipoFormatoBolsa = "Wicket")
**Descripción:** Configurar parámetros de bolsa con Wicket  
**Criterio de Aceptación:**
- ✅ Campo "¿Tiene Wicket?" - Sí/No
- ✅ Si Sí → Campos: wicketDiameter (D 12/14/16), wicketDistSuperior, wicketDistDerecho
- ✅ Campo "¿Tiene Wicket Control?" - Sí/No (condicional)
- ✅ Campo "¿Tiene Pre-corte Wicket?" - Sí/No (condicional)
- ✅ Campo "¿Tiene Corte Aliviador?" - Sí/No (condicional)
- ✅ Campo "¿Tiene Dispensador?" - Sí/No (condicional)
- ✅ Campo "¿Tiene Fotocélula?" - Sí/No (condicional)

**Estructura:**
```typescript
// Solo para tipoFormatoBolsa = "Wicket"
hasWicket: "Sí" | "No";
wicketDiameter?: "D 12" | "D 14" | "D 16";
wicketDistSuperior?: string; // mm
wicketDistDerecho?: string; // mm

hasWicketControl: "Sí" | "No";
wicketControlDiameter?: string;
wicketControlUbicacion?: "Superior" | "Inferior";
// ... más campos

hasPrecorteWicket: "Sí" | "No";
// ...

hasCortaAliviador: "Sí" | "No";
// ...

hasDispensador: "Sí" | "No";
// ...

hasFotocelulaBolsaWicket: "Sí" | "No";
```

---

## 🔄 Flujos de Usuario

### Flujo 1: Crear BOLSA Sello Lateral + Corte + Con Fuelle
```
1. Usuario selecciona tipoFormatoBolsa: "Bolsa"
2. Usuario selecciona tipoSelloBolsa: "Lateral"
   → Mostrar campo "Acabado"
3. Usuario selecciona acabadoBolsa: "Corte"
4. Usuario selecciona tieneFuelleBolsa: "Sí"
   → Mostrar campo "Ancho Fuelle"
5. Usuario ingresa width: "200" mm
6. Usuario ingresa length: "350" mm
   → Perímetro calculado: 1100 mm ✅
   → Validación: "Validado" ✅
7. Usuario ingresa anchoFuelle: "50" mm
8. Usuario puede agregar accesorios (máx 3):
   - Asa Troquelada: tipoAsa = "Asida", colorAsa = "Rojo"
   - Refuerzo: espesor = "2mm", ancho = "50mm"
9. Usuario guarda → Proyecto guardado ✅
```

### Flujo 2: Crear BOLSA Wicket Compleja
```
1. Usuario selecciona tipoFormatoBolsa: "Wicket"
   → Campo "Tipo de Sello" OCULTO
   → Mostrar campos específicos de Wicket
2. Usuario ingresa width: "150", length: "250"
   → Perímetro: 800 mm "Validado" ✅
3. Usuario ingresa anchoFuelle: "30" mm
4. Usuario marca hasWicket: "Sí"
   → Mostrar campos: wicketDiameter, distancias
5. Usuario ingresa wicketDiameter: "D 14"
6. Usuario ingresa wicketDistSuperior: "25", wicketDistDerecho: "30"
7. Usuario marca hasWicketControl: "Sí"
   → Campos de control se muestran
8. Usuario marca hasPrecorteWicket: "Sí"
   → Campos de pre-corte se muestran
9. Usuario guarda → Proyecto guardado ✅
```

### Flujo 3: Validación Fallida - Perímetro Máximo Excedido
```
1. Usuario ingresa width: "2900", length: "2900"
   → Perímetro: 11600 mm
   → Validación: "Rechazado" ❌
   → Error: "Perímetro 11600 mm fuera de rango (100-10000)"
2. Usuario no puede guardar
3. Usuario cambia width: "2000"
   → Perímetro recalcula: 9800 mm
   → Validación: "Validado" ✅
4. Usuario guarda → Éxito ✅
```

### Flujo 4: Máximo de Accesorios Alcanzado
```
1. Usuario ha agregado 3 accesorios Producto
2. Usuario intenta agregar 4to accesorio
   → Botón "Agregar" deshabilitado
   → Mensaje: "Máximo 3 accesorios producto"
3. Usuario elimina 1 accesorio
   → Botón se habilita nuevamente
4. Usuario puede agregar nuevo accesorio
```

---

## ✅ Casos de Prueba

### TC-01: BOLSA Lateral Corte + Fuelle - Válida
```gherkin
Given usuario está creando BOLSA
When selecciona tipoSelloBolsa: "Lateral"
And selecciona acabadoBolsa: "Corte"
And selecciona tieneFuelleBolsa: "Sí"
And ingresa width: "250", length: "400"
And ingresa anchoFuelle: "60"
Then perímetro: "1300" mm
And validación: "Validado"
And usuario puede guardar
```

### TC-02: Cascada de Campos Condicionales
```gherkin
When tipoSelloBolsa: "Lateral"
Then acabadoBolsa VISIBLE

When tipoSelloBolsa: "Fondo"
Then acabadoBolsa OCULTO

When tieneFuelleBolsa: "Sí"
Then anchoFuelle OBLIGATORIO

When tieneFuelleBolsa: "No"
Then anchoFuelle OCULTO
```

### TC-03: Validación Fallida - Width Máximo
```gherkin
When ingresa width: "5000" (> 3000)
Then muestra error: "Width debe estar entre 1 y 3000 mm"
And no permite guardar
```

### TC-04: Máximo 3 Accesorios Producto
```gherkin
When usuario agrega accesorio Producto #1
And agrega accesorio Producto #2
And agrega accesorio Producto #3
Then botón "Agregar" está deshabilitado
And mensaje: "Máximo 3 accesorios"

When elimina 1 accesorio
Then botón "Agregar" se habilita
And puede agregar accesorio #4 (que será #3)
```

### TC-05: Máximo 3 Accesorios Internos
```gherkin
When usuario agrega accesorio Interno #1
And agrega accesorio Interno #2
And agrega accesorio Interno #3
Then botón "Agregar Interno" deshabilitado
And puede tener 3 Producto + 3 Internos (total 6)
```

### TC-06: Wicket - Campos Condicionales
```gherkin
When tipoFormatoBolsa: "Wicket"
Then tipoSelloBolsa OCULTO
And campos Wicket VISIBLES

When hasWicket: "Sí"
Then wicketDiameter OBLIGATORIO
And wicketDistSuperior OBLIGATORIO
And wicketDistDerecho OBLIGATORIO

When hasWicketControl: "Sí"
Then wicketControlDiameter OBLIGATORIO
And wicketControlUbicacion OBLIGATORIO
```

### TC-07: Cambiar Presentación Limpia Dependientes
```gherkin
Given usuario ha ingresado datos de BOLSA
When cambia tipoFormatoBolsa a "Wicket"
Then mantiene width, length, anchoFuelle (SIEMPRE VISIBLES)
And limpia tipoSelloBolsa, acabadoBolsa, tieneFuelleBolsa
And muestra campos de Wicket
```

### TC-08: Perímetro Mínimo
```gherkin
When ingresa width: "40", length: "10"
Then perímetro: "100" mm (justo en mínimo)
And validación: "Validado"
And usuario puede guardar

When ingresa width: "40", length: "9"
Then perímetro: "98" mm (< 100)
And validación: "Rechazado"
And no permite guardar
```

### TC-09: Superficie a Imprimir - NO Visible en BOLSA
```gherkin
Given usuario selecciona blueprintFormat: "SELLO..." (BOLSA)
Then sección "Datos de Fotoregistro" ESTÁ OCULTA
And "Superficie a imprimir" NO VISIBLE
```

### TC-10: Validación Total de BOLSA Wicket
```gherkin
Given usuario está en BOLSA Wicket
When ingresa todas dimensiones válidas
And configura Wicket completo
And agrega accesorios válidos
And cumple todas validaciones
Then proyecto se guarda exitosamente
```

---

## 🎯 Criterios de Aceptación (Gherkin)

```gherkin
Feature: BOLSA - Configuración y Validaciones

  Scenario: Crear BOLSA con todas validaciones pasadas
    Given usuario está creando BOLSA
    When completa cascada: Presentación → Sello → Acabado → Fuelle
    And ingresa dimensiones y accesorios válidos
    And perímetro es válido
    Then proyecto se guarda exitosamente

  Scenario: Bloquear si perímetro fuera de rango
    Given usuario ha ingresado width y length
    When perímetro está fuera de 100-10000 mm
    Then muestra error
    And no permite submit

  Scenario: Cascada de campos condicionales
    Given tipoSelloBolsa: "Lateral"
    When cambia a "Fondo"
    Then acabadoBolsa desaparece
    And tieneFuelleBolsa se comporta diferente

  Scenario: Máximo 3 accesorios por tipo
    Given usuario ha agregado 3 accesorios Producto
    When intenta agregar 4to
    Then botón deshabilitado
    And muestra mensaje de límite
```

---

## 🔧 Especificaciones Técnicas

### Estructura ProjectEditFormData - BOLSA
```typescript
// Presentación
tipoFormatoBolsa: string; // Bolsa | Wicket | Hojas
blueprintFormat: string; // SELLO LATERAL\... | SELLO FONDO\... | WICKET | HOJAS

// Nivel 1: Sello (Bolsa)
tipoSelloBolsa: string; // Lateral | Fondo (si tipoFormatoBolsa = "Bolsa")

// Nivel 2: Acabado (Solo si Lateral)
acabadoBolsa: string; // Corte | Pestaña

// Nivel 2: Fuelle (Bolsa)
tieneFuelleBolsa: string; // Sí | No
tipoFuelleBolsa: string; // Depende de sello

// Dimensiones - OBLIGATORIOS
width: string; // Validar: 1-3000 mm
length: string; // Validar: 1-3000 mm
anchoFuelle: string; // Validar: 0-500 mm (si Fuelle = Sí)

// Dimensiones Adicionales - OPCIONALES
alturaEnLaBolsa: string; // Opcional
anchoEnLaBolsa: string; // Opcional

// Perímetro
perimeterMm: string; // Calculado: 2 * (width + length)
perimeterValidationStatus: string; // Validado | Rechazado
perimeterComment: string; // Comentario
dimensionCrossCheckStatus: string; // Estado de dimensiones

// Accesorios Producto
hasAsaTroquelada: string; // Sí | No
tipoAsa: string; // Asida | Tirador | Anilla | Asa cosida
colorAsa: string; // Color
formaAsa: string; // Forma
hasRefuerzo: string; // Sí | No
reinforcementThickness: string; // Espesor
reinforcementWidth: string; // Ancho

// Accesorios Internos
hasAngularCut: string; // Corte Angular: Sí | No
ladoCorteAngular: string; // Lado
hasRoundedCorners: string; // Esquinas: Sí | No
roundedCornersType: string; // Tipo
hasNotch: string; // Muesca: Sí | No
distanciaAbocaMuesca: string; // Distancia
hasPerforation: string; // Perforación: Sí | No
bagPerforationType: string; // Tipo
perforationLocation: string; // Ubicación
hasPreCut: string; // Pre-corte: Sí | No
preCutType: string; // Tipo

// Wicket (Solo si tipoFormatoBolsa = "Wicket")
hasWicket: string; // Sí | No
wicketDiameter: string; // D 12 | D 14 | D 16
wicketDistSuperior: string; // mm
wicketDistDerecho: string; // mm

hasWicketControl: string; // Sí | No
wicketControlDiameter: string;
wicketControlUbicacion: string; // Superior | Inferior
wicketControlDistSuperior: string;
wicketControlDistDerecho: string;

hasPrecorteWicket: string; // Sí | No
precorteWicketLargo: string; // 3-7 mm
precorteWicketUbicacion: string;
precorteWicketDistDerecho: string;

hasCortaAliviador: string; // Sí | No
cortaAliviadorDistDerecho: string;

hasDispensador: string; // Sí | No
dispensadorDistIzquierdo: string;

hasFotocelulaBolsaWicket: string; // Sí | No
```

### Validaciones en ProductEditPage.tsx
```typescript
// Validación de dimensiones BOLSA
const validateBolsaDimensions = (form: ProjectEditFormData): Errors => {
  const errors: Errors = {};
  
  if (!form.width || parseFloat(form.width) <= 0 || parseFloat(form.width) > 3000) {
    errors.width = "Width debe estar entre 1 y 3000 mm";
  }
  
  if (!form.length || parseFloat(form.length) <= 0 || parseFloat(form.length) > 3000) {
    errors.length = "Length debe estar entre 1 y 3000 mm";
  }
  
  if (form.tieneFuelleBolsa === "Sí") {
    if (!form.anchoFuelle || parseFloat(form.anchoFuelle) < 0 || parseFloat(form.anchoFuelle) > 500) {
      errors.anchoFuelle = "Ancho Fuelle debe estar entre 0 y 500 mm";
    }
  }
  
  return errors;
};

// Cálculo y validación de perímetro BOLSA
const calculateAndValidateBolsaPerimeter = (width: number, length: number) => {
  const perimeter = 2 * (width + length);
  const isValid = perimeter >= 100 && perimeter <= 10000;
  
  return {
    perimeter,
    status: isValid ? "Validado" : "Rechazado",
    error: !isValid ? `Perímetro ${perimeter} mm fuera de rango (100-10000)` : null
  };
};

// Validar máximo de accesorios
const validateMaxAccessories = (accessories: BolsaAccessory[], max = 3): boolean => {
  return accessories.length <= max;
};
```

---

## 📊 Dependencias

- `projectStorage.ts` - Guardar/cargar proyectos
- `dimensionRestrictionRules.ts` - Reglas de validación dimensional
- `productCatalogs.ts` - Catálogos ODISEO
- `PouchBolsaStructureTable.tsx` - Vista de estructura

---

## 🎯 Story Points: 16

**Desglose:**
- Cascada de campos condicionales: 5 pts
- Dimensiones + Validaciones: 4 pts
- Cálculo + Validación Perímetro: 3 pts
- Accesorios (Producto + Internos): 2 pts
- Wicket (campos condicionales): 1 pt
- Testing + Refinamientos: 1 pt

**Complejidad:** Media-Alta  
**Riesgo:** Medio - Cascadas complejas requieren testing exhaustivo

---

**Documento Completo - HU BOLSA v2** ✅
