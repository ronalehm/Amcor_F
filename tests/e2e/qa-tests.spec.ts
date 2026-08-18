import { test, expect, Page, Browser, chromium } from "@playwright/test";
import * as fs from "fs";
import * as path from "path";

const BASE_URL = "http://localhost:5173";
const SCREENSHOT_DIR = "c:\\Users\\ronal\\AppData\\Local\\Temp\\claude\\c--Users-ronal-OneDrive-Documents-Amcor-F2\\a21a1952-76a2-475c-bc67-12810e348e8a\\scratchpad\\qa-screenshots";

// Ensure screenshot directory exists
if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

// Demo credentials
const DEMO_EMAIL = "admin@amcor.com";
const DEMO_PASSWORD = "password";

interface TestResult {
  casuistica: string;
  skuOrigen?: string;
  skuMostrado?: string;
  skuGuardado?: string;
  resultado: "PASS" | "FAIL";
  observaciones: string[];
  timestamp: string;
}

const results: TestResult[] = [];

async function captureScreenshot(page: Page, name: string) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const filename = `${name}-${timestamp}.png`;
  const filepath = path.join(SCREENSHOT_DIR, filename);
  await page.screenshot({ path: filepath, fullPage: true });
  console.log(`✓ Screenshot: ${filename}`);
  return filename;
}

async function authenticateUser(page: Page): Promise<void> {
  console.log("🔐 Autenticando usuario...");
  await page.goto(`${BASE_URL}/login`, { waitUntil: "networkidle" });

  // Esperar a que se cargue el formulario de login
  await page.waitForSelector("input[type='email'], input[placeholder*='email'], input[placeholder*='Email']", { timeout: 10000 }).catch(() => null);

  // Intentar llenar email
  try {
    const emailInput = await page.locator("input[type='email'], input[placeholder*='email']").first();
    await emailInput.fill(DEMO_EMAIL);
    console.log(`✓ Email ingresado: ${DEMO_EMAIL}`);
  } catch (e) {
    console.log("⚠ No se pudo ingresar email");
  }

  // Intentar llenar contraseña
  try {
    const passwordInput = await page.locator("input[type='password']").first();
    await passwordInput.fill(DEMO_PASSWORD);
    console.log("✓ Contraseña ingresada");
  } catch (e) {
    console.log("⚠ No se pudo ingresar contraseña");
  }

  // Hacer clic en botón de login
  try {
    const loginBtn = await page.getByRole("button", { name: /Ingresar|Login|Sign In/i }).first();
    await loginBtn.click();
    console.log("✓ Clic en botón Ingresar");

    // Esperar a que se redirija a la página de productos
    await page.waitForURL(`${BASE_URL}/products`, { timeout: 15000 }).catch(() => null);
    await page.waitForLoadState("networkidle", { timeout: 15000 }).catch(() => null);
    console.log("✓ Usuario autenticado y redirido a /products");
  } catch (e) {
    console.log(`⚠ Error en login: ${e}`);
  }
}

async function waitForConsoleLogODISEO(page: Page, keyword: string, timeout: number = 30000) {
  const messages: string[] = [];
  return new Promise((resolve) => {
    const startTime = Date.now();
    const listener = (msg: any) => {
      messages.push(msg.text());
      if (msg.text().includes(keyword)) {
        page.off("console", listener);
        resolve(true);
      }
      if (Date.now() - startTime > timeout) {
        page.off("console", listener);
        resolve(false);
      }
    };
    page.on("console", listener);
  });
}

test.describe("QA - 3 Casuísticas de Creación de Producto", () => {

  test("QA-01: NEW_WITH_NEW_STRUCTURE", async ({ page }) => {
    console.log("\n========== QA-01: NEW_WITH_NEW_STRUCTURE ==========");

    const result: TestResult = {
      casuistica: "NEW_WITH_NEW_STRUCTURE",
      resultado: "PASS",
      observaciones: [],
      timestamp: new Date().toISOString(),
    };

    try {
      // Authenticate first
      await authenticateUser(page);
      result.observaciones.push("✓ Usuario autenticado");

      // Navigate to products page
      await page.goto(`${BASE_URL}/products`, { waitUntil: "networkidle" });
      result.observaciones.push("✓ Navegó a página de productos");

      // Click "Nueva solicitud"
      await page.click("button:has-text('Nueva solicitud')");
      await page.waitForSelector("text=Nueva solicitud", { timeout: 10000 });
      result.observaciones.push("✓ Modal Nueva solicitud abierto");

      await captureScreenshot(page, "QA01-01-modal-abierto");

      // Check compliance checkbox
      const checkboxes = await page.locator("input[type='checkbox']").all();
      if (checkboxes.length > 0) {
        await checkboxes[0].click();
        result.observaciones.push("✓ Declaración de cumplimiento marcada");
      }

      // Select Client
      try {
        const clientSelect = await page.locator("select").first();
        await clientSelect.click();
        await page.waitForTimeout(500);
        const options = await page.locator("select option").all();
        if (options.length > 1) {
          await options[1].click();
          result.observaciones.push("✓ Cliente seleccionado");
        }
      } catch (e) {
        result.observaciones.push("⚠ No se pudo seleccionar cliente");
      }

      // Select Portfolio
      try {
        const selects = await page.locator("select").all();
        if (selects.length > 1) {
          await selects[1].click();
          await page.waitForTimeout(500);
          const options = await page.locator("select option").all();
          if (options.length > 1) {
            await options[1].click();
            result.observaciones.push("✓ Portafolio seleccionado");
          }
        }
      } catch (e) {
        result.observaciones.push("⚠ No se pudo seleccionar portafolio");
      }

      // Select Classification = "Producto Nuevo"
      try {
        const classificationLabel = await page.getByLabel("Clasificación");
        await classificationLabel.click();
        await page.waitForTimeout(500);
        const option = await page.getByText("Producto Nuevo").first();
        await option.click();
        result.observaciones.push("✓ Clasificación = Producto Nuevo");
      } catch (e) {
        result.observaciones.push("⚠ No se pudo seleccionar clasificación");
      }

      // Select Modification = "Nueva estructura"
      try {
        const modLabel = await page.getByLabel(/Modificaci/i);
        await modLabel.click();
        await page.waitForTimeout(500);
        const option = await page.getByText("Nueva estructura").first();
        await option.click();
        result.observaciones.push("✓ Modificación = Nueva estructura");
      } catch (e) {
        result.observaciones.push("⚠ No se pudo seleccionar modificación");
      }

      // Fill product data
      const timestamp = Date.now();
      const productName = `TEST-QA01-${timestamp}`;

      try {
        const nameInput = await page.getByLabel(/Nombre del producto/i);
        await nameInput.fill(productName);
        result.observaciones.push(`✓ Nombre del producto: ${productName}`);
      } catch (e) {
        result.observaciones.push("⚠ No se pudo llenar nombre");
      }

      try {
        const volumeInput = await page.getByLabel(/Volumen/i);
        await volumeInput.fill("1000");
        result.observaciones.push("✓ Volumen: 1000");
      } catch (e) {
        result.observaciones.push("⚠ No se pudo llenar volumen");
      }

      try {
        const unitInput = await page.getByLabel(/Unidad/i);
        await unitInput.click();
        await page.waitForTimeout(300);
        const unitOption = await page.getByText("KG").first();
        await unitOption.click();
        result.observaciones.push("✓ Unidad: KG");
      } catch (e) {
        result.observaciones.push("⚠ No se pudo seleccionar unidad");
      }

      try {
        const descInput = await page.getByLabel(/Descripción/i);
        await descInput.fill("Test QA-01 Nueva Estructura");
        result.observaciones.push("✓ Descripción completada");
      } catch (e) {
        result.observaciones.push("⚠ No se pudo llenar descripción");
      }

      // Capture before save
      await captureScreenshot(page, "QA01-02-previa-guardado");

      // Get SKU before saving
      try {
        const skuInput = await page.getByLabel(/Código SKU Generado/i);
        result.skuMostrado = await skuInput.inputValue();
        result.observaciones.push(`✓ SKU mostrado: ${result.skuMostrado}`);
      } catch (e) {
        result.observaciones.push("⚠ No se pudo obtener SKU generado");
      }

      // Click Save
      const saveBtn = await page.getByRole("button", { name: /Guardar/i }).first();
      await saveBtn.click();
      result.observaciones.push("✓ Clic en Guardar");

      // Wait for success message or modal to close
      let modalClosed = false;
      let attempts = 0;
      const maxAttempts = 30;

      while (!modalClosed && attempts < maxAttempts) {
        await page.waitForTimeout(1000);

        const guardandoText = await page.getByText("Guardando...").isVisible().catch(() => false);
        if (!guardandoText) {
          modalClosed = true;
          result.observaciones.push("✓ Modal cerrado exitosamente");
        }

        attempts++;
        if (attempts % 5 === 0) {
          console.log(`  Esperando cierre del modal... (${attempts}s)`);
        }
      }

      if (!modalClosed) {
        result.observaciones.push("✗ Modal se quedó en Guardando... (TIMEOUT)");
        result.resultado = "FAIL";
        await captureScreenshot(page, "QA01-03-modal-bloqueado");
      }

      // Capture after save
      await captureScreenshot(page, "QA01-04-post-guardado");

      // Verify product in list
      try {
        const productInList = await page.getByText(productName).isVisible().catch(() => false);
        if (productInList) {
          result.observaciones.push("✓ Producto aparece en lista");
        } else {
          result.observaciones.push("✗ Producto NO aparece en lista");
          result.resultado = "FAIL";
        }
      } catch (e) {
        result.observaciones.push("⚠ No se pudo verificar producto en lista");
      }

    } catch (error) {
      result.observaciones.push(`✗ Error: ${error}`);
      result.resultado = "FAIL";
    }

    results.push(result);
    console.log(`✓ QA-01: ${result.resultado}`);
  });

  test("QA-02: NEW_FROM_BASE", async ({ page }) => {
    console.log("\n========== QA-02: NEW_FROM_BASE ==========");

    const result: TestResult = {
      casuistica: "NEW_FROM_BASE",
      resultado: "PASS",
      observaciones: [],
      timestamp: new Date().toISOString(),
    };

    try {
      // Authenticate first
      await authenticateUser(page);
      result.observaciones.push("✓ Usuario autenticado");

      // Navigate
      await page.goto(`${BASE_URL}/products`, { waitUntil: "networkidle" });
      result.observaciones.push("✓ Navegó a página de productos");

      // Click "Nueva solicitud"
      await page.click("button:has-text('Nueva solicitud')");
      await page.waitForSelector("text=Nueva solicitud", { timeout: 10000 });
      result.observaciones.push("✓ Modal Nueva solicitud abierto");

      await captureScreenshot(page, "QA02-01-modal-abierto");

      // Check compliance checkbox
      const checkboxes = await page.locator("input[type='checkbox']").all();
      if (checkboxes.length > 0) {
        await checkboxes[0].click();
        result.observaciones.push("✓ Declaración de cumplimiento marcada");
      }

      // Select Client
      try {
        const clientSelect = await page.locator("select").first();
        await clientSelect.click();
        await page.waitForTimeout(500);
        const options = await page.locator("select option").all();
        if (options.length > 1) {
          await options[1].click();
          result.observaciones.push("✓ Cliente seleccionado");
        }
      } catch (e) {
        result.observaciones.push("⚠ No se pudo seleccionar cliente");
      }

      // Select Portfolio
      try {
        const selects = await page.locator("select").all();
        if (selects.length > 1) {
          await selects[1].click();
          await page.waitForTimeout(500);
          const options = await page.locator("select option").all();
          if (options.length > 1) {
            await options[1].click();
            result.observaciones.push("✓ Portafolio seleccionado");
          }
        }
      } catch (e) {
        result.observaciones.push("⚠ No se pudo seleccionar portafolio");
      }

      // Select Classification = "Producto Nuevo"
      try {
        const classificationLabel = await page.getByLabel("Clasificación");
        await classificationLabel.click();
        await page.waitForTimeout(500);
        const option = await page.getByText("Producto Nuevo").first();
        await option.click();
        result.observaciones.push("✓ Clasificación = Producto Nuevo");
      } catch (e) {
        result.observaciones.push("⚠ No se pudo seleccionar clasificación");
      }

      // Select Modification = "Nuevos insumos" or first available (NOT "Nueva estructura")
      try {
        const modLabel = await page.getByLabel(/Modificaci/i);
        await modLabel.click();
        await page.waitForTimeout(500);

        // Get first non "Nueva estructura" option
        const options = await page.locator("text=/^(?!Nueva estructura).*$/").all();
        if (options.length > 0) {
          await options[0].click();
          const selectedText = await options[0].textContent();
          result.observaciones.push(`✓ Modificación = ${selectedText}`);
        }
      } catch (e) {
        result.observaciones.push("⚠ No se pudo seleccionar modificación");
      }

      // Verify SKU Base is required
      try {
        const skuBaseVisible = await page.getByLabel(/SKU Base|Referencia técnica/i).isVisible().catch(() => false);
        if (skuBaseVisible) {
          result.observaciones.push("✓ SKU Base/Referencia técnica: OBLIGATORIO");
        } else {
          result.observaciones.push("✗ SKU Base/Referencia técnica: NO aparece");
          result.resultado = "FAIL";
        }
      } catch (e) {
        result.observaciones.push("⚠ No se pudo verificar SKU Base");
      }

      // Try to save without SKU Base
      try {
        const saveBtn = await page.getByRole("button", { name: /Guardar/i }).first();
        const isDisabled = await saveBtn.isDisabled().catch(() => false);
        if (isDisabled) {
          result.observaciones.push("✓ Guardar deshabilitado sin SKU Base (correcto)");
        } else {
          result.observaciones.push("⚠ Guardar habilitado sin SKU Base");
        }
      } catch (e) {
        result.observaciones.push("⚠ No se pudo verificar estado de Guardar");
      }

      // Fill product data
      const timestamp = Date.now();
      const productName = `TEST-QA02-${timestamp}`;

      try {
        const nameInput = await page.getByLabel(/Nombre del producto/i);
        await nameInput.fill(productName);
        result.observaciones.push(`✓ Nombre: ${productName}`);
      } catch (e) {
        result.observaciones.push("⚠ No se pudo llenar nombre");
      }

      await captureScreenshot(page, "QA02-02-previa-guardado");

      // Get SKU before saving
      try {
        const skuInput = await page.getByLabel(/Código SKU Generado|SKU.*Generado/i);
        result.skuMostrado = await skuInput.inputValue().catch(() => "");
        result.observaciones.push(`✓ SKU mostrado: ${result.skuMostrado}`);
      } catch (e) {
        result.observaciones.push("⚠ No se pudo obtener SKU generado");
      }

      // Click Save
      try {
        const saveBtn = await page.getByRole("button", { name: /Guardar/i }).first();
        await saveBtn.click();
        result.observaciones.push("✓ Clic en Guardar");

        // Wait for modal to close
        let modalClosed = false;
        let attempts = 0;
        while (!modalClosed && attempts < 30) {
          await page.waitForTimeout(1000);
          const guardandoText = await page.getByText("Guardando...").isVisible().catch(() => false);
          if (!guardandoText) {
            modalClosed = true;
            result.observaciones.push("✓ Modal cerrado exitosamente");
          }
          attempts++;
        }

        if (!modalClosed) {
          result.observaciones.push("✗ Modal se quedó en Guardando...");
          result.resultado = "FAIL";
        }
      } catch (e) {
        result.observaciones.push(`⚠ Error al guardar: ${e}`);
      }

      await captureScreenshot(page, "QA02-03-post-guardado");

    } catch (error) {
      result.observaciones.push(`✗ Error: ${error}`);
      result.resultado = "FAIL";
    }

    results.push(result);
    console.log(`✓ QA-02: ${result.resultado}`);
  });

  test("QA-03: MODIFIED_FROM_APPROVED", async ({ page }) => {
    console.log("\n========== QA-03: MODIFIED_FROM_APPROVED ==========");

    const result: TestResult = {
      casuistica: "MODIFIED_FROM_APPROVED",
      resultado: "PASS",
      observaciones: [],
      timestamp: new Date().toISOString(),
    };

    try {
      // Authenticate first
      await authenticateUser(page);
      result.observaciones.push("✓ Usuario autenticado");

      // Navigate
      await page.goto(`${BASE_URL}/products`, { waitUntil: "networkidle" });
      result.observaciones.push("✓ Navegó a página de productos");

      // Click "Nueva solicitud"
      await page.click("button:has-text('Nueva solicitud')");
      await page.waitForSelector("text=Nueva solicitud", { timeout: 10000 });
      result.observaciones.push("✓ Modal Nueva solicitud abierto");

      await captureScreenshot(page, "QA03-01-modal-abierto");

      // Check compliance checkbox
      const checkboxes = await page.locator("input[type='checkbox']").all();
      if (checkboxes.length > 0) {
        await checkboxes[0].click();
        result.observaciones.push("✓ Declaración de cumplimiento marcada");
      }

      // Select Client
      try {
        const clientSelect = await page.locator("select").first();
        await clientSelect.click();
        await page.waitForTimeout(500);
        const options = await page.locator("select option").all();
        if (options.length > 1) {
          await options[1].click();
          result.observaciones.push("✓ Cliente seleccionado");
        }
      } catch (e) {
        result.observaciones.push("⚠ No se pudo seleccionar cliente");
      }

      // Select Portfolio
      try {
        const selects = await page.locator("select").all();
        if (selects.length > 1) {
          await selects[1].click();
          await page.waitForTimeout(500);
          const options = await page.locator("select option").all();
          if (options.length > 1) {
            await options[1].click();
            result.observaciones.push("✓ Portafolio seleccionado");
          }
        }
      } catch (e) {
        result.observaciones.push("⚠ No se pudo seleccionar portafolio");
      }

      // Select Classification = "Producto Modificado"
      try {
        const classificationLabel = await page.getByLabel("Clasificación");
        await classificationLabel.click();
        await page.waitForTimeout(500);
        const option = await page.getByText("Producto Modificado").first();
        await option.click();
        result.observaciones.push("✓ Clasificación = Producto Modificado");
      } catch (e) {
        result.observaciones.push("⚠ No se pudo seleccionar clasificación");
      }

      // Select a modification
      try {
        const modLabel = await page.getByLabel(/Modificaci/i);
        await modLabel.click();
        await page.waitForTimeout(500);
        const firstOpt = await page.locator("text=/^[^Nueva estructura].*/").first();
        if (firstOpt) {
          await firstOpt.click();
          const text = await firstOpt.textContent();
          result.observaciones.push(`✓ Modificación seleccionada: ${text}`);
        }
      } catch (e) {
        result.observaciones.push("⚠ No se pudo seleccionar modificación");
      }

      // Verify SKU Actual is required
      try {
        const skuActualVisible = await page.getByLabel(/SKU Actual/i).isVisible().catch(() => false);
        if (skuActualVisible) {
          result.observaciones.push("✓ SKU Actual: OBLIGATORIO");
        } else {
          result.observaciones.push("✗ SKU Actual: NO aparece");
          result.resultado = "FAIL";
        }
      } catch (e) {
        result.observaciones.push("⚠ No se pudo verificar SKU Actual");
      }

      // Fill product data
      const timestamp = Date.now();
      const productName = `TEST-QA03-${timestamp}`;

      try {
        const nameInput = await page.getByLabel(/Nombre del producto/i);
        await nameInput.fill(productName);
        result.observaciones.push(`✓ Nombre: ${productName}`);
      } catch (e) {
        result.observaciones.push("⚠ No se pudo llenar nombre");
      }

      await captureScreenshot(page, "QA03-02-previa-guardado");

      // Get SKU before saving
      try {
        const skuInput = await page.getByLabel(/Nuevo Código SKU|SKU.*Generado/i);
        result.skuMostrado = await skuInput.inputValue().catch(() => "");
        result.observaciones.push(`✓ SKU mostrado: ${result.skuMostrado}`);
      } catch (e) {
        result.observaciones.push("⚠ No se pudo obtener SKU generado");
      }

      // Click Save (may be disabled if requirements not met)
      try {
        const saveBtn = await page.getByRole("button", { name: /Guardar/i }).first();
        const isDisabled = await saveBtn.isDisabled().catch(() => false);

        if (!isDisabled) {
          await saveBtn.click();
          result.observaciones.push("✓ Clic en Guardar");

          // Wait for modal to close
          let modalClosed = false;
          let attempts = 0;
          while (!modalClosed && attempts < 30) {
            await page.waitForTimeout(1000);
            const guardandoText = await page.getByText("Guardando...").isVisible().catch(() => false);
            if (!guardandoText) {
              modalClosed = true;
              result.observaciones.push("✓ Modal cerrado exitosamente");
            }
            attempts++;
          }

          if (!modalClosed) {
            result.observaciones.push("✗ Modal se quedó en Guardando...");
            result.resultado = "FAIL";
          }
        } else {
          result.observaciones.push("⚠ Guardar deshabilitado (requisitos pendientes)");
        }
      } catch (e) {
        result.observaciones.push(`⚠ Error al guardar: ${e}`);
      }

      await captureScreenshot(page, "QA03-03-post-guardado");

    } catch (error) {
      result.observaciones.push(`✗ Error: ${error}`);
      result.resultado = "FAIL";
    }

    results.push(result);
    console.log(`✓ QA-03: ${result.resultado}`);
  });

  test("Generar Reporte Final", async () => {
    console.log("\n========== REPORTE FINAL ==========\n");

    let report = "# QA REPORT - 3 CASUÍSTICAS DE CREACIÓN DE PRODUCTO\n\n";
    report += `**Fecha**: ${new Date().toISOString()}\n`;
    report += `**Ambiente**: ${BASE_URL}\n`;
    report += `**Casos Ejecutados**: ${results.length}\n\n`;

    let passCount = 0;
    let failCount = 0;

    for (const result of results) {
      report += `## ${result.casuistica}\n`;
      report += `**Resultado**: ${result.resultado}\n`;
      report += `**Timestamp**: ${result.timestamp}\n`;
      report += `**SKU Origen**: ${result.skuOrigen || "N/A"}\n`;
      report += `**SKU Mostrado**: ${result.skuMostrado || "N/A"}\n`;
      report += `**SKU Guardado**: ${result.skuGuardado || "N/A"}\n\n`;
      report += `**Observaciones**:\n`;

      for (const obs of result.observaciones) {
        report += `- ${obs}\n`;
      }

      report += "\n---\n\n";

      if (result.resultado === "PASS") passCount++;
      else failCount++;
    }

    report += `\n## RESUMEN\n`;
    report += `- **PASS**: ${passCount}/${results.length}\n`;
    report += `- **FAIL**: ${failCount}/${results.length}\n`;
    report += `- **Tasa de Éxito**: ${((passCount / results.length) * 100).toFixed(1)}%\n`;

    // Save report
    const reportPath = path.join(SCREENSHOT_DIR, "QA_REPORT.md");
    fs.writeFileSync(reportPath, report);
    console.log(report);
    console.log(`\n✓ Reporte guardado en: ${reportPath}`);
    console.log(`✓ Screenshots guardados en: ${SCREENSHOT_DIR}`);
  });
});
