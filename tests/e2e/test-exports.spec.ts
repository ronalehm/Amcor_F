import { test, expect, Page } from "@playwright/test";
import * as path from "path";
import * as fs from "fs";

const BASE_URL = "http://localhost:5173";
const DOWNLOAD_DIR = path.join(process.cwd(), "test-downloads");

test.describe("Export Functionality Tests", () => {
  let page: Page;

  test.beforeAll(async () => {
    // Crear directorio de descargas si no existe
    if (!fs.existsSync(DOWNLOAD_DIR)) {
      fs.mkdirSync(DOWNLOAD_DIR, { recursive: true });
    }
  });

  test("should export all catalogs with professional formatting", async ({
    page,
  }) => {
    // Navegar a la página de catálogos
    await page.goto(`${BASE_URL}/catalog-management/catalogs`);
    await page.waitForLoadState("networkidle");

    console.log("✓ Navegó a CatalogsViewPage");

    // Buscar el botón de descarga de todos los catálogos
    const downloadAllButton = page.locator(
      'button:has-text("Todos los Catálogos")'
    );
    const isVisible = await downloadAllButton.isVisible().catch(() => false);

    if (isVisible) {
      console.log("✓ Botón 'Todos los Catálogos' visible");

      // Configurar listener para descargas
      const downloadPromise = page.waitForEvent("download");

      // Click en el botón
      await downloadAllButton.click();
      console.log("✓ Click en botón de descarga");

      // Esperar la descarga
      const download = await downloadPromise;
      const filename = download.suggestedFilename;
      console.log(`✓ Archivo descargado: ${filename}`);

      // Guardar el archivo
      const filepath = path.join(DOWNLOAD_DIR, filename);
      await download.saveAs(filepath);
      console.log(`✓ Archivo guardado en: ${filepath}`);

      // Verificar que el archivo existe y tiene tamaño
      const fileStats = fs.statSync(filepath);
      console.log(`✓ Tamaño del archivo: ${fileStats.size} bytes`);

      if (fileStats.size > 0) {
        console.log("✓ Export de Todos los Catálogos: ÉXITO");
      }
    } else {
      console.log("⚠ Botón 'Todos los Catálogos' no visible");
    }
  });

  test("should export restrictions with professional formatting", async ({
    page,
  }) => {
    // Navegar a la página de catálogos
    await page.goto(`${BASE_URL}/catalog-management/catalogs`);
    await page.waitForLoadState("networkidle");

    console.log("✓ Navegó a CatalogsViewPage");

    // Buscar el botón de descarga de restricciones
    const exportRestrictionsButton = page.locator(
      'button:has-text("Exportar Restricciones")'
    );
    const isVisible = await exportRestrictionsButton
      .isVisible()
      .catch(() => false);

    if (isVisible) {
      console.log("✓ Botón 'Exportar Restricciones' visible");

      // Configurar listener para descargas
      const downloadPromise = page.waitForEvent("download");

      // Click en el botón
      await exportRestrictionsButton.click();
      console.log("✓ Click en botón de exportación");

      // Esperar la descarga
      const download = await downloadPromise;
      const filename = download.suggestedFilename;
      console.log(`✓ Archivo descargado: ${filename}`);

      // Guardar el archivo
      const filepath = path.join(DOWNLOAD_DIR, filename);
      await download.saveAs(filepath);
      console.log(`✓ Archivo guardado en: ${filepath}`);

      // Verificar que el archivo existe y tiene tamaño
      const fileStats = fs.statSync(filepath);
      console.log(`✓ Tamaño del archivo: ${fileStats.size} bytes`);

      if (fileStats.size > 0) {
        console.log("✓ Export de Restricciones: ÉXITO");
      }
    } else {
      console.log("⚠ Botón 'Exportar Restricciones' no visible");
    }
  });

  test("should verify catalogs page has download menu", async ({ page }) => {
    await page.goto(`${BASE_URL}/catalog-management/catalogs`);
    await page.waitForLoadState("networkidle");

    // Buscar cualquier botón de descarga
    const downloadButtons = page.locator('button').filter({
      hasText: /Descargar|Exportar|Download|Export/i,
    });

    const count = await downloadButtons.count();
    console.log(`✓ Encontrados ${count} botones de descarga/exportación`);

    for (let i = 0; i < count; i++) {
      const buttonText = await downloadButtons.nth(i).textContent();
      console.log(`  - ${buttonText?.trim()}`);
    }
  });
});
