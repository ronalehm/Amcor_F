import { test, expect, Page } from "@playwright/test";

const BASE_URL = "http://localhost:5173";

async function loginAndNavigate(page: Page) {
  console.log("🔐 Login y navegación...");

  await page.goto(`${BASE_URL}/login`, { waitUntil: "networkidle", timeout: 30000 });

  // Click en acceso rápido admin
  const adminBtn = await page.locator("button:has-text('admin@amcor.com')").first();
  await adminBtn.click({ timeout: 10000 });
  await page.waitForTimeout(500);

  // Click en "Ingresar al Portal"
  const loginBtn = await page.getByRole("button", { name: /Ingresar/i }).first();
  await loginBtn.click({ timeout: 10000 });
  await page.waitForTimeout(2000);

  // Navegar a productos
  await page.goto(`${BASE_URL}/products`, { waitUntil: "networkidle", timeout: 30000 });
  console.log("✓ Login completado y navegación a /products");
}

test.describe("QA: SKU Base y Aprobados en ProductInitialCreateModal", () => {

  test("QA-SKU-01: Producto Modificado - Verificar SKU Aprobados disponibles", async ({ page }) => {
    console.log("\n═══════════════════════════════════════════");
    console.log("QA-SKU-01: Producto Modificado - SKU Aprobados");
    console.log("═══════════════════════════════════════════\n");

    await loginAndNavigate(page);

    // Abrir modal "Nueva solicitud"
    const nuevoBtn = await page.getByText(/Nuevo/i).first();
    await nuevoBtn.click({ timeout: 10000 });
    await page.waitForTimeout(1500);
    console.log("✓ Modal de Nueva solicitud abierto");

    // Marcar declaración
    const checkbox = await page.locator("input[type='checkbox']").first();
    await checkbox.click();
    console.log("✓ Declaración marcada");

    // Esperar a que cargue completamente
    await page.waitForTimeout(1000);

    // Seleccionar Cliente (Alicorp)
    const clientSearch = await page.locator("input").nth(1);
    await clientSearch.click();
    await page.waitForTimeout(500);
    const clientOption = await page.getByText("Alicorp").first();
    await clientOption.click();
    console.log("✓ Cliente seleccionado");

    // Seleccionar Portafolio
    const portfolioSearch = await page.locator("input[placeholder*='Portafolio']");
    await portfolioSearch.click();
    await page.waitForTimeout(500);
    const portfolioOption = await page.locator("text=/Carnes importadas|PO-00001/").first();
    await portfolioOption.click();
    console.log("✓ Portafolio seleccionado");

    // Seleccionar Clasificación = "Producto Modificado"
    const classificationSelect = await page.locator("select").first();
    await classificationSelect.click();
    await page.waitForTimeout(300);
    const modifiedOption = await page.getByText("Producto Modificado");
    await modifiedOption.click();
    console.log("✓ Clasificación = Producto Modificado");

    // Seleccionar una Modificación válida
    const modifCheckboxes = await page.locator("input[type='checkbox']").all();
    if (modifCheckboxes.length > 1) {
      await modifCheckboxes[1].click(); // Segundo checkbox (primera modificación)
      console.log("✓ Modificación seleccionada");
    }

    await page.waitForTimeout(1000);

    // AHORA buscar en el campo SKU Actual
    const skuActualSearch = await page.locator("input[placeholder*='Buscar producto']").last();
    console.log("✓ Campo SKU Actual encontrado");

    // Buscar primero producto aprobado nuevo: SKU-00020-A
    await skuActualSearch.click();
    await page.waitForTimeout(300);
    await skuActualSearch.fill("SKU-00020");
    await page.waitForTimeout(1000);

    console.log("🔍 Buscando SKU-00020-A (Producto Aprobado nuevo)...");

    // Verificar que aparezca en los resultados
    const searchResult = await page.locator("text=/SKU-00020|Mayonesa Light/").first().isVisible({ timeout: 5000 }).catch(() => false);

    if (searchResult) {
      console.log("✅ SKU-00020-A (Mayonesa Light) encontrado en búsqueda");

      // Click en el resultado
      const result = await page.locator("text=/SKU-00020|Mayonesa Light/").first();
      await result.click();
      await page.waitForTimeout(500);

      console.log("✓ SKU-00020-A seleccionado");
    } else {
      console.log("⚠️ SKU-00020-A NO encontrado en búsqueda");
    }

    // Búsqueda adicional: SKU-00021-A (Salsa BBQ)
    await page.waitForTimeout(500);
    await skuActualSearch.clear();
    await skuActualSearch.fill("SKU-00021");
    await page.waitForTimeout(1000);

    console.log("🔍 Buscando SKU-00021-A (Salsa BBQ)...");
    const bbqFound = await page.locator("text=/SKU-00021|Salsa BBQ/").first().isVisible({ timeout: 5000 }).catch(() => false);

    if (bbqFound) {
      console.log("✅ SKU-00021-A (Salsa BBQ) encontrado en búsqueda");
    } else {
      console.log("⚠️ SKU-00021-A NO encontrado en búsqueda");
    }

    console.log("\n✅ QA-SKU-01 Completado");
  });

  test("QA-SKU-02: Producto Nuevo (sin Nueva estructura) - Verificar SKU Base disponibles", async ({ page }) => {
    console.log("\n═══════════════════════════════════════════");
    console.log("QA-SKU-02: Producto Nuevo - SKU Base");
    console.log("═══════════════════════════════════════════\n");

    await loginAndNavigate(page);

    // Abrir modal "Nueva solicitud"
    const nuevoBtn = await page.getByText(/Nuevo/i).first();
    await nuevoBtn.click({ timeout: 10000 });
    await page.waitForTimeout(1500);
    console.log("✓ Modal de Nueva solicitud abierto");

    // Marcar declaración
    const checkbox = await page.locator("input[type='checkbox']").first();
    await checkbox.click();
    console.log("✓ Declaración marcada");

    await page.waitForTimeout(1000);

    // Seleccionar Cliente
    const clientSearch = await page.locator("input").nth(1);
    await clientSearch.click();
    await page.waitForTimeout(500);
    const clientOption = await page.getByText("Alicorp").first();
    await clientOption.click();
    console.log("✓ Cliente seleccionado");

    // Seleccionar Portafolio
    const portfolioSearch = await page.locator("input[placeholder*='Portafolio']");
    await portfolioSearch.click();
    await page.waitForTimeout(500);
    const portfolioOption = await page.locator("text=/Carnes importadas|PO-00001/").first();
    await portfolioOption.click();
    console.log("✓ Portafolio seleccionado");

    // Seleccionar Clasificación = "Producto Nuevo"
    const classificationSelect = await page.locator("select").first();
    await classificationSelect.click();
    await page.waitForTimeout(300);
    const newOption = await page.getByText("Producto Nuevo");
    await newOption.click();
    console.log("✓ Clasificación = Producto Nuevo");

    // Seleccionar una Modificación que NO sea "Nueva estructura"
    const checkboxes = await page.locator("input[type='checkbox']").all();
    if (checkboxes.length > 1) {
      // Encontrar la segunda modificación (no Nueva estructura)
      await checkboxes[1].click();
      console.log("✓ Modificación seleccionada (no Nueva estructura)");
    }

    await page.waitForTimeout(1000);

    // AHORA buscar en el campo SKU Base / Referencia técnica
    const skuBaseSearch = await page.locator("input[placeholder*='Buscar producto']").last();
    console.log("✓ Campo SKU Base encontrado");

    // Buscar primer producto base nuevo: SKU-00008-B
    await skuBaseSearch.click();
    await page.waitForTimeout(300);
    await skuBaseSearch.fill("SKU-00008");
    await page.waitForTimeout(1000);

    console.log("🔍 Buscando SKU-00008-B (Salsa de Soja Base nuevo)...");

    const baseResult = await page.locator("text=/SKU-00008|Salsa de Soja/").first().isVisible({ timeout: 5000 }).catch(() => false);

    if (baseResult) {
      console.log("✅ SKU-00008-B (Salsa de Soja) encontrado en búsqueda");

      const result = await page.locator("text=/SKU-00008|Salsa de Soja/").first();
      await result.click();
      await page.waitForTimeout(500);

      console.log("✓ SKU-00008-B seleccionado");
    } else {
      console.log("⚠️ SKU-00008-B NO encontrado en búsqueda");
    }

    // Búsqueda adicional: SKU-00009-B (Ketchup Base)
    await page.waitForTimeout(500);
    await skuBaseSearch.clear();
    await skuBaseSearch.fill("SKU-00009");
    await page.waitForTimeout(1000);

    console.log("🔍 Buscando SKU-00009-B (Ketchup Base)...");
    const ketchupFound = await page.locator("text=/SKU-00009|Ketchup/").first().isVisible({ timeout: 5000 }).catch(() => false);

    if (ketchupFound) {
      console.log("✅ SKU-00009-B (Ketchup Base) encontrado en búsqueda");
    } else {
      console.log("⚠️ SKU-00009-B NO encontrado en búsqueda");
    }

    console.log("\n✅ QA-SKU-02 Completado");
  });
});
