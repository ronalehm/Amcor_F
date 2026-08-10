# 📁 Integración: Persistencia de Fotoregistro en ProductEditPage

## 🎯 Objetivo
Documentar cómo se guardan y cargan los datos de fotoregistro en ProductEditPage para garantizar que los cambios se persisten correctamente.

---

## 📊 Campos de Fotoregistro en ProjectEditFormData

```typescript
// Form state fields related to photoregister
interface ProjectEditFormData {
  // Fotoregistro 1
  hasPhotoregister1: string;           // "Sí" | "No"
  fr1Width: string;                    // mm (número)
  fr1Height: string;                   // mm (número)
  fr1MarginLeft: string;               // mm (número)
  fr1MarginRight: string;              // mm (número)
  fr1MarginTop: string;                // mm (número)
  fr1MarginBottom: string;             // mm (número)
  
  // Fotoregistro 2
  hasPhotoregister2: string;           // "Sí" | "No"
  fr2Width: string;                    // mm (número)
  fr2Height: string;                   // mm (número)
  fr2MarginLeft: string;               // mm (número)
  fr2MarginRight: string;              // mm (número)
  fr2MarginTop: string;                // mm (número)
  fr2MarginBottom: string;             // mm (número)
}
```

---

## 🔄 Flujo de Persistencia

### 1️⃣ CARGAR (useEffect en ProductEditPage)

**Cuando:** Al abrir la página con un productCode

**Ubicación:** `ProductEditPage.tsx` - `useEffect([projectCode])`

**Lógica:**
```typescript
// Lectura desde proyecto existente
const project = getProjectByCode(projectCode);

// Mapeo de campos del proyecto al form
const convertedForm: ProjectEditFormData = {
  // ... otros campos ...
  
  // Fotoregistro 1 - LECTURA DIRECTA
  hasPhotoregister1: (project as any).hasPhotoregister1 || "",
  fr1Width: (project as any).fr1Width || "",
  fr1Height: (project as any).fr1Height || "",
  fr1MarginLeft: (project as any).fr1MarginLeft || "",
  fr1MarginRight: (project as any).fr1MarginRight || "",
  fr1MarginTop: (project as any).fr1MarginTop || "",
  fr1MarginBottom: (project as any).fr1MarginBottom || "",
  
  // Fotoregistro 2 - LECTURA DIRECTA
  hasPhotoregister2: (project as any).hasPhotoregister2 || "",
  fr2Width: (project as any).fr2Width || "",
  fr2Height: (project as any).fr2Height || "",
  fr2MarginLeft: (project as any).fr2MarginLeft || "",
  fr2MarginRight: (project as any).fr2MarginRight || "",
  fr2MarginTop: (project as any).fr2MarginTop || "",
  fr2MarginBottom: (project as any).fr2MarginBottom || "",
};

setForm(convertedForm);
```

**Validación:**
- ✅ Valores pueden estar vacíos (producto nuevo)
- ✅ Valores pueden ser strings numéricos ("100", "50.5")
- ⚠️ NO confundir con booleanos - son strings "Sí"/"No"

---

### 2️⃣ EDITAR (onChange handlers)

**Ubicación:** Componentes de entrada en PhotoregisterPanel

**Patrón:**
```typescript
// Cambiar dimensión de FR1
const handleFR1WidthChange = (value: string) => {
  updateField("fr1Width", value);
  
  // Trigger auto-recalc de márgenes
  // (manejado por PhotoregisterPanel)
};

// Cambiar márgenes de FR1
const handleFR1MarginChange = (margins: {left, right, top, bottom}) => {
  updateField("fr1MarginLeft", String(margins.left));
  updateField("fr1MarginRight", String(margins.right));
  updateField("fr1MarginTop", String(margins.top));
  updateField("fr1MarginBottom", String(margins.bottom));
};
```

**Reglas:**
- Siempre convertir a string para almacenar en form state
- Los cálculos internos de PhotoregisterPanel usan números
- `updateField()` maneja la actualización del estado

---

### 3️⃣ GUARDAR (handleSubmit)

**Ubicación:** `ProductEditPage.tsx` - `handleSubmit()`

**Mapeo de campos hacia updateProjectRecord():**
```typescript
updateProjectRecord(projectCode, {
  // ... otros campos ...
  
  // Fotoregistro 1 - ESCRITURA EN BD
  hasPhotoregister1: form.hasPhotoregister1 as BooleanLike,
  fr1Width: form.fr1Width,
  fr1Height: form.fr1Height,
  fr1MarginLeft: form.fr1MarginLeft,
  fr1MarginRight: form.fr1MarginRight,
  fr1MarginTop: form.fr1MarginTop,
  fr1MarginBottom: form.fr1MarginBottom,
  
  // Fotoregistro 2 - ESCRITURA EN BD
  hasPhotoregister2: form.hasPhotoregister2 as BooleanLike,
  fr2Width: form.fr2Width,
  fr2Height: form.fr2Height,
  fr2MarginLeft: form.fr2MarginLeft,
  fr2MarginRight: form.fr2MarginRight,
  fr2MarginTop: form.fr2MarginTop,
  fr2MarginBottom: form.fr2MarginBottom,
  
  updatedAt: now,
} as ProjectRecord);
```

**Validaciones antes de guardar:**
```typescript
// 1️⃣ Validar que FR cabe en lámina
if (hasPhotoregister1 && !validateFR1FitsInLamina(...)) {
  errors.fr1Width = "El fotoregistro 1 no cabe en la lámina";
  return; // Bloquear envío
}

// 2️⃣ Validar que valores son números válidos
const fr1W = parseNumberInput(form.fr1Width);
if (hasPhotoregister1 && (fr1W === null || fr1W <= 0)) {
  errors.fr1Width = "Ancho debe ser un número positivo";
  return;
}

// 3️⃣ No guardar si hay errores de validación
if (Object.keys(validationErrors).length > 0) {
  setSubmitAttempted(true);
  return;
}
```

---

## 🗄️ Estructura en ProjectRecord (Storage)

```typescript
// En projectStorage.ts - ProjectRecord interface
interface ProjectRecord {
  // ... otros campos ...
  
  // Fotoregistro
  hasPhotoregister1?: string | boolean | BooleanLike;
  fr1Width?: string;
  fr1Height?: string;
  fr1MarginLeft?: string;
  fr1MarginRight?: string;
  fr1MarginTop?: string;
  fr1MarginBottom?: string;
  
  hasPhotoregister2?: string | boolean | BooleanLike;
  fr2Width?: string;
  fr2Height?: string;
  fr2MarginLeft?: string;
  fr2MarginRight?: string;
  fr2MarginTop?: string;
  fr2MarginBottom?: string;
}
```

---

## 🔐 Conversión de Tipos

### String ↔ Número (en PhotoregisterPanel)

**Lectura desde form (string → número):**
```typescript
const fr1Width = parseNumberInput(form.fr1Width) || 0;
// parseNumberInput() maneja:
// - Strings vacíos → null
// - "100" → 100
// - "50.5" → 50.5
// - "50,5" (formato local) → 50.5
```

**Escritura en form (número → string):**
```typescript
updateField("fr1Width", String(calculatedWidth));
// Convierte: 100.5 → "100.5"
```

---

## 🧪 Casos de Persistencia Testeados

### CT-1: Guardar producto nuevo sin fotoregistro
**Given:** Producto nuevo  
**When:** Usuario selecciona "No" en "¿Lleva fotoregistro?"  
**Then:** Todos los campos de FR quedan vacíos en BD

### CT-2: Guardar producto con FR1 completo
**Given:** Producto con FR1  
**When:** Usuario ingresa datos y hace submit  
**Then:** Todos los 7 campos de FR1 se guardan correctamente

### CT-3: Cargar producto con datos de FR
**Given:** Producto guardado con FR1 y FR2  
**When:** Se abre ProductEditPage  
**Then:** Los datos se cargan en form state correctamente

### CT-4: Editar y guardar cambios en FR
**Given:** Producto con FR1 existente  
**When:** Usuario edita ancho y hace submit  
**Then:** Valor nuevo se guarda y se carga en siguiente sesión

### CT-5: Limpiar datos de FR al cambiar estado
**Given:** Producto con FR1  
**When:** Usuario cambia "¿Lleva fotoregistro?" a "No"  
**Then:** Todos los campos de FR1 se limpian antes de guardar

### CT-6: Migración de formatos antiguos
**Given:** Producto con datos en formato antiguo  
**When:** Se abre en ProductEditPage  
**Then:** Datos se mapean correctamente al nuevo formato

---

## ⚠️ Puntos Críticos de Integración

### 1. Normalización de Booleanos
```typescript
// IMPORTANTE: hasPhotoregister1 es STRING, NO boolean
// ✅ Correcto:
form.hasPhotoregister1 = "Sí"; // string
form.hasPhotoregister1 = "No"; // string

// ❌ Incorrecto:
form.hasPhotoregister1 = true;  // boolean
form.hasPhotoregister1 = false; // boolean

// Conversión para guardar:
hasPhotoregister1: form.hasPhotoregister1 as BooleanLike
// BooleanLike = "Sí" | "No" | true | false | "true" | "false"
```

### 2. Campos Opcionales vs Obligatorios
```typescript
// Solo validar FR si hasPhotoregister1 = "Sí"
if (form.hasPhotoregister1 === "Sí") {
  if (!form.fr1Width || !form.fr1Height) {
    errors.fr1Width = "Dimensiones obligatorias si hay fotoregistro";
  }
}

// Si hasPhotoregister1 = "No", permitir campos vacíos
```

### 3. Precisión Decimal
```typescript
// Guardar con máxima precisión (floats)
const margin = 10.5; // 1 decimal
updateField("fr1MarginLeft", String(margin)); // "10.5"

// NO redondear arbitrariamente
// Redondear solo en presentación visual (2 decimales)
```

### 4. Sincronización Temporal
```typescript
// En handleSubmit - actualizar timestamp
const now = new Date().toISOString();
updateProjectRecord(projectCode, {
  // ... datos de FR ...
  updatedAt: now,  // IMPORTANTE: actualizar timestamp
});
```

---

## 🔄 Flujo Completo: Crear → Editar → Guardar

### Sesión 1: Usuario crea producto con FR
```
1. Click "Nuevo producto" → ProductEditPage abre
2. form.hasPhotoregister1 = "" (vacío)
3. Usuario selecciona "Sí" → form.hasPhotoregister1 = "Sí"
4. Usuario ingresa datos:
   - form.fr1Width = "100"
   - form.fr1Height = "80"
   - form.fr1MarginLeft = "10"
   - etc.
5. Click "Solicitar Producto" → handleSubmit()
6. Validación: ✅ Pasa
7. updateProjectRecord(productCode, {
     hasPhotoregister1: "Sí",
     fr1Width: "100",
     ...
     updatedAt: "2026-08-10T12:30:00Z"
   })
8. Navigate("/products")
```

### Sesión 2: Usuario edita el producto
```
1. Click en producto → ProductEditPage abre
2. useEffect([projectCode]) dispara
3. getProjectByCode(productCode) retorna proyecto guardado
4. convertedForm mapea valores:
   - form.hasPhotoregister1 = "Sí" (cargado)
   - form.fr1Width = "100" (cargado)
   - ...
5. setForm(convertedForm)
6. PhotoregisterPanel muestra datos cargados ✅
7. Usuario edita:
   - form.fr1Width = "120" (nuevo)
8. PhotoregisterPanel recalcula márgenes automáticamente
9. Click "Guardar" → handleSubmit()
10. updateProjectRecord() guarda nuevos valores
11. updatedAt actualiza a hora actual
```

### Sesión 3: Usuario abre otra vez
```
1. getProjectByCode() retorna registro con datos más recientes
2. form.fr1Width = "120" (la última edición)
3. Ciclo se repite...
```

---

## 📋 Checklist de Integración

### Antes de implementar PhotoregisterPanel:
- [ ] Verificar que ProjectRecord tiene todos los campos de FR
- [ ] Agregar campos a FIELD_LABELS para labels correctos
- [ ] Agregar campos a STEP_FIELDS[1] (Paso de Diseño)
- [ ] Agregar campos a BASE_REQUIRED_FIELDS si es necesario

### Al implementar PhotoregisterPanel:
- [ ] Pasar form state como props
- [ ] Implementar onChange handlers que usen updateField()
- [ ] Validar datos al cargar (convertir strings a números)
- [ ] Mostrar datos cargados sin retrasos

### En handleSubmit:
- [ ] Incluir validación de FR cabe en lámina
- [ ] Mapear todos los 14 campos (7 por FR)
- [ ] Convertir "Sí"/"No" correctamente a BooleanLike
- [ ] Actualizar updatedAt con timestamp actual

### En handleCancel:
- [ ] Detectar si hay cambios en campos de FR
- [ ] Incluir en `hasUnsavedChanges()` check
- [ ] Mostrar modal de confirmación si hay cambios

---

## 🚀 Testing de Persistencia

### Unit Test Example
```typescript
describe("Fotoregistro Persistencia", () => {
  it("debe cargar datos de FR desde proyecto existente", () => {
    const project = {
      code: "PRJ-001",
      hasPhotoregister1: "Sí",
      fr1Width: "100",
      fr1Height: "80",
      fr1MarginLeft: "10",
      // ...
    };
    
    // Mapear como lo hace convertedForm
    const form = mapProjectToForm(project);
    
    expect(form.hasPhotoregister1).toBe("Sí");
    expect(form.fr1Width).toBe("100");
    expect(form.fr1Height).toBe("80");
  });

  it("debe guardar datos de FR en updateProjectRecord", () => {
    const form = {
      hasPhotoregister1: "Sí",
      fr1Width: "100",
      fr1Height: "80",
      // ...
    };
    
    updateProjectRecord("PRJ-001", {
      hasPhotoregister1: form.hasPhotoregister1,
      fr1Width: form.fr1Width,
      // ...
    });
    
    const saved = getProjectByCode("PRJ-001");
    expect(saved.fr1Width).toBe("100");
  });
});
```

### E2E Test Example
```typescript
describe("Fotoregistro E2E", () => {
  it("usuario puede crear, editar y recuperar datos de FR", async () => {
    // 1. Crear
    await page.goto("/products");
    await page.click("button:has-text('Nuevo producto')");
    await page.fill('input[name="projectName"]', "Test Product");
    await page.click('button:has-text("Crear")');
    
    // 2. Editar FR en Paso 1
    await page.click("button:has-text('2')"); // Go to Design
    await page.click('text=¿La lámina lleva fotoregistro?');
    await page.click('text=Sí');
    await page.fill('input[placeholder="Ancho"]', "100");
    
    // 3. Guardar
    await page.click("button:has-text('Guardar')");
    await expect(page).toHaveURL(/\/products/);
    
    // 4. Recuperar
    await page.click('text=Test Product');
    await page.click("button:has-text('2')");
    
    // 5. Verificar datos persistidos
    const widthValue = await page.inputValue('input[placeholder="Ancho"]');
    expect(widthValue).toBe("100");
  });
});
```

---

## 📞 Soporte

Si hay problemas de persistencia:

1. **Datos no se cargan:** 
   - Verificar que `getProjectByCode()` retorna el registro
   - Revisar mapeo en `convertedForm`
   - Debuggear `setForm()` call

2. **Datos no se guardan:**
   - Verificar que `updateProjectRecord()` es llamado
   - Revisar que validaciones no bloquean
   - Verificar localStorage o BD destino

3. **Datos corruptos:**
   - Verificar conversión string ↔ número
   - Revisar que no hay NaN o valores inválidos
   - Validar antes de guardar

