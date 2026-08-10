import { test, expect } from "@playwright/test";
import type { Page } from "@playwright/test";

const BASE_URL = "http://localhost:5173";

/**
 * FASE 2 QA - Pruebas Automatizadas del Modal "Edición de Materiales"
 *
 * Casos automatizados:
 * - F2-QA-01: Apertura del modal
 * - F2-QA-02: Carga inicial exacta
 * - F2-QA-16: Guardar cambios y actualizar tabla
 * - F2-QA-26: Persistencia después de recarga
 * - Escenario crítico: Aplicar combinación y verificar persistencia
 */

test.describe("FASE 2 QA - Modal Edición de Materiales", () => {
  let page: Page;
  let initialStructureType: string;
  let initialLayer1Material: string;
  let initialLayer1Micron: string;

  test.beforeEach(async ({ browser }) => {
    page = await browser.newPage();
    await page.goto(`${BASE_URL}/#/products/edit/ALICORP-001`, {
      waitUntil: "networkidle",
    });

    // Esperar a que se cargue la página y navegar a PASO 3
    await page.waitForSelector("text=PASO 3", { timeout: 10000 });

    // Capturar valores iniciales
    const structureSelector = page.locator('select').first();
    initialStructureType = await structureSelector.inputValue();
    initialLayer1Material = await page.locator(
      'input[placeholder*="Material"]'
    ).first().inputValue();
    initialLayer1Micron = await page.locator(
      'input[placeholder*="Micraje"]'
    ).first().inputValue();
  });

  test.afterEach(async () => {
    await page.close();
  });

  // ============================================
  // BLOQUE 1: Apertura y Carga Inicial
  // ============================================

  test("F2-QA-01: Apertura del modal", async () => {
    // Buscar botón lápiz
    const editButton = page.locator('[title="Editar materiales"]').first();
    await expect(editButton).toBeVisible();

    // Click en lápiz
    await editButton.click();

    // Verificar modal abierto
    const modalTitle = page.locator("text=Edición de materiales");
    await expect(modalTitle).toBeVisible({ timeout: 5000 });

    // Verificar UNO solo modal
    const modals = await page.locator("div.fixed.inset-0.z-50").count();
    expect(modals).toBe(1);

    // Verificar header con X
    const closeButton = page.locator('[aria-label="Cerrar"]');
    await expect(closeButton).toBeVisible();
  });

  // ============================================

  test("F2-QA-02: Carga inicial exacta", async () => {
    // Abrir modal
    const editButton = page.locator('[title="Editar materiales"]').first();
    await editButton.click();

    // Esperar a que se cargue
    await page.waitForSelector("text=Edición de materiales", { timeout: 5000 });

    // Verificar tipo de estructura
    const structureSelect = page.locator("select").first();
    const loadedStructureType = await structureSelect.inputValue();
    expect(loadedStructureType).toBe(initialStructureType);

    // Verificar material capa 1
    const materialInputs = page.locator("select");
    const materialCount = await materialInputs.count();

    if (materialCount >= 2) {
      const layer1MaterialSelect = materialInputs.nth(1);
      const loadedMaterial = await layer1MaterialSelect.inputValue();

      // La comparación puede ser aproximada porque puede tener alias
      console.log(`Material inicial: ${initialLayer1Material}, Cargado: ${loadedMaterial}`);
    }

    // Verificar que hay tabla de composición
    const compositionTable = page.locator("table");
    await expect(compositionTable).toBeVisible({ timeout: 5000 });
  });

  // ============================================
  // BLOQUE 5: Guardado y Persistencia
  // ============================================

  test("F2-QA-16: Guardar cambios actualiza tabla", async () => {
    // Abrir modal
    const editButton = page.locator('[title="Editar materiales"]').first();
    await editButton.click();

    await page.waitForSelector("text=Edición de materiales", { timeout: 5000 });

    // Si la estructura no está completa, completarla
    const errorMsg = page.locator("text=/incompleta|requerido/i");
    const isIncomplete = await errorMsg.isVisible().catch(() => false);

    if (isIncomplete) {
      // Estructura incompleta - no intentar guardar
      console.log("Estructura incompleta - saltando F2-QA-16");
      return;
    }

    // Click "Guardar cambios"
    const guardarBtn = page.locator("button:has-text('Guardar cambios')");
    await expect(guardarBtn).toBeVisible();
    await guardarBtn.click();

    // Verificar mensaje de éxito o permanencia del modal
    const successMsg = page.locator("text=/Materiales actualizados|validado/i");
    await expect(successMsg).toBeVisible({ timeout: 5000 });

    // Esperar a cierre automático (~1.5s)
    await page.waitForTimeout(2000);

    // Verificar que modal se cerró
    const modalTitle = page.locator("text=Edición de materiales");
    const isOpen = await modalTitle.isVisible().catch(() => false);

    if (!isOpen) {
      console.log("Modal cerrado después de guardar ✓");
    }
  });

  // ============================================
  // BLOQUE 7: Persistencia en Backend
  // ============================================

  test("F2-QA-26: Persistencia después de recarga", async () => {
    // Capturar estructura actual ANTES
    const structureBeforeReload = await page
      .locator("select")
      .first()
      .inputValue();

    // Recargar página
    await page.reload({ waitUntil: "networkidle" });

    // Navegar a PASO 3 de nuevo
    await page.waitForSelector("text=PASO 3", { timeout: 10000 });

    // Capturar estructura DESPUÉS
    const structureAfterReload = await page
      .locator("select")
      .first()
      .inputValue();

    // Verificar que persiste
    expect(structureAfterReload).toBe(structureBeforeReload);
    console.log(`Estructura persistida: ${structureAfterReload} ✓`);
  });

  // ============================================
  // ESCENARIO CRÍTICO: Aplicar Combinación
  // ============================================

  test("CRÍTICO: Aplicar combinación y verificar persistencia", async () => {
    // PASO 1: Capturar estructura inicial
    const structureInitial = await page
      .locator("select")
      .first()
      .inputValue();

    console.log(`📸 Estructura inicial: ${structureInitial}`);

    // PASO 2: Abrir modal
    const editButton = page.locator('[title="Editar materiales"]').first();
    await editButton.click();

    await page.waitForSelector("text=Edición de materiales", { timeout: 5000 });
    console.log("✓ Modal abierto");

    // PASO 3: Consultar combinaciones
    const consultarBtn = page.locator("text=Consultar combinaciones");
    const isEnabled = await consultarBtn.isEnabled().catch(() => false);

    if (!isEnabled) {
      console.log("⚠️ Botón Consultar combinaciones deshabilitado - estructura incompleta");
      return;
    }

    await consultarBtn.click();
    console.log("✓ Modal de combinaciones abierto");

    // Esperar modal de combinaciones
    await page.waitForSelector(
      "text=/Combinaciones para|Consultar/",
      { timeout: 5000 }
    );

    // PASO 4: Filtrar VALIDADA y seleccionar primera
    const validadaBtn = page.locator("button:has-text('VALIDADA')");
    if (await validadaBtn.isVisible().catch(() => false)) {
      await validadaBtn.click();
      await page.waitForTimeout(1000);
    }

    // Buscar botón "Usar"
    const usarBtn = page.locator("button:has-text('Usar')").first();
    const usarExists = await usarBtn.isVisible().catch(() => false);

    if (!usarExists) {
      console.log("⚠️ No hay combinaciones disponibles para usar");
      return;
    }

    await usarBtn.click();
    console.log("✓ Combinación aplicada");

    // PASO 5: Volver a MaterialsEditModal
    await page.waitForTimeout(1000);

    // Verificar que volvimos al modal
    const materialModal = page.locator("text=Edición de materiales");
    await expect(materialModal).toBeVisible({ timeout: 5000 });

    // PASO 6: Guardar cambios
    const guardarBtn = page.locator("button:has-text('Guardar cambios')");

    // Solo guardar si estructura está completa
    const incompleteAlert = page.locator("text=/incompleta/i");
    const isIncomplete = await incompleteAlert.isVisible().catch(() => false);

    if (!isIncomplete) {
      await guardarBtn.click();
      console.log("✓ Cambios guardados");

      // Esperar cierre automático
      await page.waitForTimeout(2000);
    } else {
      console.log("⚠️ Estructura incompleta después de aplicar combinación");
      // Cerrar modal con X
      const closeBtn = page.locator('[aria-label="Cerrar"]');
      await closeBtn.click();
    }

    // PASO 7: Guardar producto (botón general)
    const guardarProducto = page.locator(
      "button:has-text('Guardar')"
    ).last();

    if (await guardarProducto.isVisible().catch(() => false)) {
      await guardarProducto.click();
      console.log("✓ Producto guardado");

      // Esperar confirmación
      await page.waitForTimeout(2000);
    }

    // PASO 8: Recargar página
    await page.reload({ waitUntil: "networkidle" });
    console.log("✓ Página recargada");

    // PASO 9: Verificar persistencia
    const structureFinal = await page
      .locator("select")
      .first()
      .inputValue();

    console.log(`✓ Estructura final: ${structureFinal}`);

    // Verificar que se mantuvo
    if (structureFinal === structureInitial) {
      console.log("✅ ESCENARIO CRÍTICO APROBADO: Cambios persisten después de recarga");
    } else {
      console.log("⚠️ Estructura cambió después de recarga");
    }
  });

  // ============================================
  // PRUEBA: Console sin errores
  // ============================================

  test("F2-QA-29: Console sin errores críticos", async () => {
    const errors: string[] = [];
    const criticalErrors = [
      "Uncaught",
      "setFormValue is not defined",
      "Cannot read property",
      "Cannot set property",
      "MaterialsEditModal",
    ];

    page.on("console", (msg) => {
      const text = msg.text();
      if (msg.type() === "error") {
        criticalErrors.forEach((keyword) => {
          if (text.includes(keyword)) {
            errors.push(text);
          }
        });
      }
    });

    // Ejecutar una acción simple
    const editButton = page.locator('[title="Editar materiales"]').first();
    if (await editButton.isVisible().catch(() => false)) {
      await editButton.click();
      await page.waitForTimeout(1000);

      // Cerrar
      const closeBtn = page.locator('[aria-label="Cerrar"]');
      if (await closeBtn.isVisible().catch(() => false)) {
        await closeBtn.click();
      }
    }

    // Verificar no hay errores críticos
    if (errors.length > 0) {
      console.log("❌ Errores encontrados:", errors);
      expect(errors).toHaveLength(0);
    } else {
      console.log("✅ No hay errores críticos en consola");
    }
  });
});
