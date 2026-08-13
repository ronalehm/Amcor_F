import { test, expect } from "@playwright/test";

test.describe("QA: CLASIFICACIÓN y MODIFICACIÓN(ES) - Campos Dependientes", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:5173");
    // Navegar a crear producto
    await page.click("a:has-text('Crear Producto')");
    await page.waitForLoadingState("networkidle");
  });

  test("QA-1: Seleccionar 'Producto Nuevo' debe mostrar las opciones de modificación para Producto Nuevo", async ({
    page,
  }) => {
    // 1. Seleccionar CLASIFICACIÓN = "Producto Nuevo"
    await page.click("select:visible");
    const selects = page.locator("select");
    const clasificacionSelect = selects.nth(0);

    await clasificacionSelect.selectOption("Producto Nuevo");

    // 2. Verificar que aparece la sección MODIFICACIÓN(ES)
    const modificacionSection = page.locator("text=Modificación(es)");
    await expect(modificacionSection).toBeVisible({
      timeout: 5000,
    });

    // 3. Seleccionar la primera opción de modificación para Producto Nuevo
    const modificacionSelect = page.locator("select").nth(1);
    const options = await modificacionSelect.locator("option").allTextContents();

    console.log("Opciones disponibles para 'Producto Nuevo':", options);

    // 4. Verificar que hay opciones disponibles
    expect(options.length).toBeGreaterThan(1); // Al menos más que la opción vacía

    // 5. Las opciones esperadas para Producto Nuevo son:
    // Nueva estructura, Nuevos insumos, Nuevo formato de envasado, Diseño nuevo, Extensión de Línea, Nuevo equipamiento
    const expectedOptions = [
      "Nueva estructura",
      "Nuevos insumos",
      "Nuevo formato de envasado",
    ];

    for (const expected of expectedOptions) {
      const optionExists = options.some((opt) =>
        opt.toLowerCase().includes(expected.toLowerCase())
      );
      expect(
        optionExists,
        `Opción '${expected}' debe estar disponible para Producto Nuevo`
      ).toBeTruthy();
    }

    await modificacionSelect.selectOption("Nueva estructura");
    const selectedValue = await modificacionSelect.inputValue();
    expect(selectedValue).toBeTruthy();

    console.log("✅ QA-1 PASÓ: Producto Nuevo muestra opciones correctas");
  });

  test("QA-2: Seleccionar 'Producto Modificado' debe mostrar las opciones de modificación para Producto Modificado", async ({
    page,
  }) => {
    // 1. Seleccionar CLASIFICACIÓN = "Producto Modificado"
    const selects = page.locator("select");
    const clasificacionSelect = selects.nth(0);

    await clasificacionSelect.selectOption("Producto Modificado");

    // 2. Verificar que aparece la sección MODIFICACIÓN(ES)
    const modificacionSection = page.locator("text=Modificación(es)");
    await expect(modificacionSection).toBeVisible({
      timeout: 5000,
    });

    // 3. Seleccionar la opciones de modificación para Producto Modificado
    const modificacionSelect = page.locator("select").nth(1);
    const options = await modificacionSelect.locator("option").allTextContents();

    console.log("Opciones disponibles para 'Producto Modificado':", options);

    // 4. Verificar que hay opciones disponibles
    expect(options.length).toBeGreaterThan(1); // Al menos más que la opción vacía

    // 5. Las opciones esperadas para Producto Modificado son:
    // Modifica Dimensiones, Modifica Propiedades, Cambia Estructura, Cambia Materia Prima, Cambia Diseño, Portafolio Estándar
    const expectedOptions = [
      "Modifica Dimensiones",
      "Modifica Propiedades",
      "Cambia Estructura",
      "Cambia Materia Prima",
    ];

    for (const expected of expectedOptions) {
      const optionExists = options.some((opt) =>
        opt.toLowerCase().includes(expected.toLowerCase())
      );
      expect(
        optionExists,
        `Opción '${expected}' debe estar disponible para Producto Modificado`
      ).toBeTruthy();
    }

    await modificacionSelect.selectOption("Modifica Dimensiones");
    const selectedValue = await modificacionSelect.inputValue();
    expect(selectedValue).toBeTruthy();

    console.log("✅ QA-2 PASÓ: Producto Modificado muestra opciones correctas");
  });

  test("QA-3: Cambiar de CLASIFICACIÓN debe actualizar las opciones de MODIFICACIÓN(ES)", async ({
    page,
  }) => {
    const selects = page.locator("select");
    const clasificacionSelect = selects.nth(0);
    const modificacionSelect = page.locator("select").nth(1);

    // 1. Seleccionar "Producto Nuevo"
    await clasificacionSelect.selectOption("Producto Nuevo");
    await page.waitForLoadingState("networkidle");

    const optionsNuevo = await modificacionSelect
      .locator("option")
      .allTextContents();
    console.log("Opciones para Producto Nuevo:", optionsNuevo);

    // 2. Cambiar a "Producto Modificado"
    await clasificacionSelect.selectOption("Producto Modificado");
    await page.waitForLoadingState("networkidle");

    const optionsModificado = await modificacionSelect
      .locator("option")
      .allTextContents();
    console.log("Opciones para Producto Modificado:", optionsModificado);

    // 3. Verificar que las opciones son diferentes
    expect(optionsNuevo).not.toEqual(optionsModificado);

    console.log("✅ QA-3 PASÓ: Las opciones cambian según la clasificación");
  });

  test("QA-4: El campo MODIFICACIÓN(ES) debe estar vacío si no se selecciona CLASIFICACIÓN", async ({
    page,
  }) => {
    // 1. NO seleccionar nada en CLASIFICACIÓN
    // 2. Verificar que el campo MODIFICACIÓN(ES) NO aparece
    const modificacionSection = page.locator("text=Modificación(es)");

    const isVisible = await modificacionSection.isVisible().catch(() => false);
    expect(isVisible).toBeFalsy();

    console.log("✅ QA-4 PASÓ: Modificación no aparece sin clasificación");
  });
});
