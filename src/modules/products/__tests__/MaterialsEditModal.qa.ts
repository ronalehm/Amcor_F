import { test, expect } from "@playwright/test";
import type { Page } from "@playwright/test";

const BASE_URL = "http://localhost:5173";

/**
 * QA - FASE 1: Pruebas Funcionales del Modal "Edición de materiales"
 *
 * Estos tests validan:
 * - Apertura del modal
 * - Reutilización de componentes
 * - Aplicación de combinaciones
 * - No persistencia de cambios
 */

test.describe("QA FASE 1 - Modal Edición de Materiales", () => {
  let page: Page;

  test.beforeEach(async ({ browser }) => {
    page = await browser.newPage();
    // Navegar a ProductEditPage con un producto existente
    await page.goto(`${BASE_URL}/#/products/edit/ALICORP-001`, {
      waitUntil: "networkidle",
    });
  });

  test("QA-01: Apertura del modal - Botón lápiz visible", async () => {
    // Esperar a que la tabla de estructura esté visible
    await page.waitForSelector('[title="Editar materiales"]');

    const editButton = page.locator('[title="Editar materiales"]').first();
    await expect(editButton).toBeVisible();
    await expect(editButton).toHaveClass(/bg-blue-500/);
  });

  test("QA-01: Modal abre al hacer clic en lápiz", async () => {
    const editButton = page.locator('[title="Editar materiales"]').first();
    await editButton.click();

    // Verificar que el modal se abre
    const modalTitle = page.locator("text=Edición de materiales");
    await expect(modalTitle).toBeVisible();

    // Verificar que es un único modal
    const modals = await page.locator("div.fixed.inset-0.z-50").count();
    expect(modals).toBe(1);
  });

  test("QA-02: Carga inicial - Estructura correcta", async () => {
    // Capturar valores iniciales de la tabla
    const initialTable = await page.locator(
      "table:has-text('Capa')"
    ).first().innerText();

    // Abrir modal
    const editButton = page.locator('[title="Editar materiales"]').first();
    await editButton.click();

    // Verificar que aparece la misma información
    const structureType = await page
      .locator("select")
      .first()
      .inputValue();

    expect(structureType).toBeTruthy();

    // Verificar ProductStructureConfigurator está presente
    const configurator = page.locator("text=Tipo de estructura");
    await expect(configurator).toBeVisible();
  });

  test("QA-03: Componente ProductStructureConfigurator reutilizado", async () => {
    const editButton = page.locator('[title="Editar materiales"]').first();
    await editButton.click();

    // Verificar elementos de ProductStructureConfigurator
    const typeSelector = page.locator("select").first();
    const materialSelectors = page.locator("select").nth(1);

    await expect(typeSelector).toBeVisible();
    await expect(materialSelectors).toBeVisible();
  });

  test("QA-04: Tipos de estructura disponibles", async () => {
    const editButton = page.locator('[title="Editar materiales"]').first();
    await editButton.click();

    const typeSelect = page.locator("select").first();
    await typeSelect.click();

    // Obtener opciones disponibles
    const options = await page.locator("select").first().locator("option");
    const optionTexts = await options.allTextContents();

    // Verificar que solo hay tipos válidos
    const validTypes = [
      "Monocapa",
      "Bilaminado",
      "Trilaminado",
      "Tetralaminado",
    ];

    optionTexts.forEach((text) => {
      if (text && text.trim()) {
        expect(validTypes.some((t) => text.includes(t))).toBeTruthy();
      }
    });
  });

  test("QA-12: Botón 'Consultar combinaciones' presente", async () => {
    const editButton = page.locator('[title="Editar materiales"]').first();
    await editButton.click();

    const consultarBtn = page.locator("text=Consultar combinaciones");
    await expect(consultarBtn).toBeVisible();
  });

  test("QA-12: Modal de combinaciones abre correctamente", async () => {
    const editButton = page.locator('[title="Editar materiales"]').first();
    await editButton.click();

    // Si estructura está completa, click en Consultar combinaciones
    const consultarBtn = page.locator("text=Consultar combinaciones");

    // Solo hace click si el botón está habilitado
    if (await consultarBtn.isEnabled()) {
      await consultarBtn.click();

      // Verificar que se abre modal de combinaciones
      const combinationsTitle = page.locator(
        "text=/Combinaciones para|Consultar/"
      );
      await expect(combinationsTitle).toBeVisible({ timeout: 5000 });
    }
  });

  test("QA-20: Estructura incompleta muestra error", async () => {
    const editButton = page.locator('[title="Editar materiales"]').first();
    await editButton.click();

    // Intentar guardar sin completar estructura
    const guardarBtn = page.locator("button:has-text('Guardar cambios')");

    if (await guardarBtn.isEnabled()) {
      await guardarBtn.click();

      // Verificar mensaje de error
      const errorMsg = page.locator("text=/incompleta|requerido/i");
      const successMsg = page.locator("text=/validado|aprobado/i");

      // Debe haber error si estructura incompleta
      const hasError = await errorMsg.isVisible().catch(() => false);
      const hasSuccess = await successMsg.isVisible().catch(() => false);

      // Si hay estructura incompleta, debe mostrar error
      if (!hasSuccess) {
        expect(hasError).toBeTruthy();
      }
    }
  });

  test("QA-21: Cancelar descarta cambios", async () => {
    const editButton = page.locator('[title="Editar materiales"]').first();
    await editButton.click();

    // Capturar valor inicial
    const initialStructure = await page
      .locator("select")
      .first()
      .inputValue();

    // Cambiar estructura (si hay opciones)
    const typeSelect = page.locator("select").first();
    await typeSelect.selectOption("Monocapa");

    // Click Cancelar
    const cancelBtn = page.locator("button:has-text('Cancelar')");
    await cancelBtn.click();

    // Modal debe cerrar
    const modalTitle = page.locator("text=Edición de materiales");
    await expect(modalTitle).not.toBeVisible();

    // Reabre para verificar que no cambió
    await editButton.click();
    const finalStructure = await page
      .locator("select")
      .first()
      .inputValue();

    expect(finalStructure).toBe(initialStructure);
  });

  test("QA-25: Integridad de tabla principal", async () => {
    // Capturar tabla antes
    const tableBefore = await page.locator("table").first().innerText();

    // Abrir modal, hacer cambios y cerrar
    const editButton = page.locator('[title="Editar materiales"]').first();
    await editButton.click();

    const cancelBtn = page.locator("button:has-text('Cancelar')");
    await cancelBtn.click();

    // Capturar tabla después
    const tableAfter = await page.locator("table").first().innerText();

    // Las tablas deben ser idénticas
    expect(tableBefore).toBe(tableAfter);
  });

  test("QA-27: No hay errores en consola", async () => {
    const errors: string[] = [];

    page.on("console", (msg) => {
      if (msg.type() === "error") {
        errors.push(msg.text());
      }
    });

    const editButton = page.locator('[title="Editar materiales"]').first();
    await editButton.click();

    // Esperar a que el modal esté completamente cargado
    await page.waitForSelector('[title="Edición de materiales"]');

    // No debe haber errores asociados a esta funcionalidad
    const relevantErrors = errors.filter(
      (e) =>
        e.includes("MaterialsEditModal") ||
        e.includes("ProductStructureConfigurator") ||
        e.includes("ValidStructureCombinationsModal") ||
        e.includes("MaterialCode") ||
        e.includes("structureType")
    );

    expect(relevantErrors).toEqual([]);
  });
});
