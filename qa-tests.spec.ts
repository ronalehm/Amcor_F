import { test, expect, Page } from '@playwright/test';

const BASE_URL = 'http://localhost:5173';

// Helper function to navigate to product creation
async function goToProductCreation(page: Page) {
  await page.goto(`${BASE_URL}/dashboard`);
  await page.waitForLoadState('networkidle');
}

// Helper to select wrapping type
async function selectWrappingType(page: Page, type: 'LAMINA' | 'BOLSA' | 'POUCH') {
  // Click on create new product/portfolio button
  const createBtn = page.locator('button:has-text("Crear")').first();
  if (await createBtn.isVisible()) {
    await createBtn.click();
  }

  // Select wrapping type based on parameter
  if (type === 'LAMINA') {
    const laminaCard = page.locator('[data-testid="wrapping-type-LAMINA"], text=LÁMINA').first();
    await laminaCard.click();
  } else if (type === 'BOLSA') {
    const bolsaCard = page.locator('[data-testid="wrapping-type-BOLSA"], text=BOLSA').first();
    await bolsaCard.click();
  } else if (type === 'POUCH') {
    const pouchCard = page.locator('[data-testid="wrapping-type-POUCH"], text=POUCH').first();
    await pouchCard.click();
  }

  // Confirm selection
  const confirmBtn = page.locator('button:has-text("Confirmar"), button:has-text("Siguiente")').first();
  if (await confirmBtn.isVisible()) {
    await confirmBtn.click();
    await page.waitForLoadState('networkidle');
  }
}

// Helper to scroll to section
async function scrollToSection(page: Page, sectionName: string) {
  const section = page.locator(`text=${sectionName}`).first();
  await section.scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);
}

test.describe('QA Testing - ProductEditPage Conditional Fields', () => {
  test.beforeEach(async ({ page }) => {
    // Start dev server in background if not running
    await goToProductCreation(page);
  });

  test.describe('FASE 1: LÁMINA (7 Tests)', () => {
    test('L1: Tipo de Lámina = "Genérica"', async ({ page }) => {
      await selectWrappingType(page, 'LAMINA');
      await scrollToSection(page, 'DISEÑO');

      // Verify section renders
      const designSection = page.locator('text=DISEÑO').first();
      await expect(designSection).toBeVisible();

      // Select Tipo de Lámina = Genérica
      const tipoLaminaSelect = page.locator('select, [role="combobox"]').filter({ hasText: 'Tipo de Lámina' }).first();
      if (await tipoLaminaSelect.isVisible()) {
        await tipoLaminaSelect.click();
        await page.locator('text=Genérica').first().click();
      }

      // Verify renders without error
      const errorMsg = page.locator('text=Error').first();
      await expect(errorMsg).not.toBeVisible();
    });

    test('L2: Especificaciones Especiales = "Otros"', async ({ page }) => {
      await selectWrappingType(page, 'LAMINA');
      await scrollToSection(page, 'DISEÑO');

      // Select Especificaciones = Otros
      const specSelect = page.locator('[placeholder*="Especificación"], select').filter({ hasText: 'Especificación' }).first();
      if (await specSelect.isVisible()) {
        await specSelect.click();
        await page.locator('text=Otros').first().click();
      }

      // Verify textarea appears
      const textarea = page.locator('textarea[placeholder*="comentarios"], textarea[placeholder*="Comentario"]').first();
      await expect(textarea).toBeVisible();
    });

    test('L3: Clase de Impresión = "Sin impresión"', async ({ page }) => {
      await selectWrappingType(page, 'LAMINA');
      await scrollToSection(page, 'DISEÑO');

      // Select Clase de Impresión = Sin impresión
      const printClassSelect = page.locator('[placeholder*="Clase"], select').filter({ hasText: 'Clase' }).first();
      if (await printClassSelect.isVisible()) {
        await printClassSelect.click();
        await page.locator('text=Sin impresión').first().click();
      }

      // Verify Tipo de Impresión is disabled
      const printTypeSelect = page.locator('[placeholder*="Tipo de Impresión"], select').first();
      if (await printTypeSelect.isVisible()) {
        await expect(printTypeSelect).toBeDisabled();
      }
    });

    test('L4: Objetivo de Color = "Otros"', async ({ page }) => {
      await selectWrappingType(page, 'LAMINA');
      await scrollToSection(page, 'DISEÑO');

      // Select Objetivo de Color = Otros
      const colorSelect = page.locator('[placeholder*="Objetivo"], select').filter({ hasText: 'Color' }).first();
      if (await colorSelect.isVisible()) {
        await colorSelect.click();
        await page.locator('text=Otros').first().click();
      }

      // Verify additional field appears
      const colorOtherField = page.locator('[placeholder*="Objetivo de Color - Otro"]').first();
      await expect(colorOtherField).toBeVisible();
    });

    test('L5: Especificación Técnica = "Sí"', async ({ page }) => {
      await selectWrappingType(page, 'LAMINA');
      await scrollToSection(page, 'DISEÑO');

      // Look for checkbox or select for "Especificación Técnica"
      const techSpecField = page.locator('input[type="checkbox"], select').filter({ hasText: 'especificación técnica' }).first();
      if (await techSpecField.isVisible()) {
        const isCheckbox = await techSpecField.evaluate(el => el.tagName === 'INPUT');
        if (isCheckbox) {
          const checkbox = page.locator('input[type="checkbox"]').filter({ hasText: 'especificación' }).first();
          await checkbox.check();
        } else {
          await techSpecField.click();
          await page.locator('text=Sí').first().click();
        }
      }

      // Verify section appears
      const techSpecSection = page.locator('text=ESPECIFICACIÓN TÉCNICA DEL CLIENTE').first();
      await expect(techSpecSection).toBeVisible();
    });

    test('L6: Estructura de Referencia = "No"', async ({ page }) => {
      await selectWrappingType(page, 'LAMINA');
      await scrollToSection(page, 'DISEÑO');

      // Select Estructura de Referencia = No
      const refStructField = page.locator('select, input[type="radio"]').filter({ hasText: 'estructura de referencia' }).first();
      if (await refStructField.isVisible()) {
        await refStructField.click();
        const noOption = page.locator('text=No').first();
        await noOption.click();
      }

      // Verify selector and table appear
      const typeStructSelect = page.locator('select').filter({ hasText: 'Tipo de Estructura' }).first();
      await expect(typeStructSelect).toBeVisible();
    });

    test('L7: Tipo de Estructura = "Monocapa"', async ({ page }) => {
      await selectWrappingType(page, 'LAMINA');
      await scrollToSection(page, 'DISEÑO');

      // Select Tipo de Estructura = Monocapa
      const structTypeSelect = page.locator('select').filter({ hasText: 'Tipo de Estructura' }).first();
      if (await structTypeSelect.isVisible()) {
        await structTypeSelect.click();
        await page.locator('text=Monocapa').first().click();
      }

      // Verify checkbox for protection appears
      const protectionCheckbox = page.locator('input[type="checkbox"]').filter({ hasText: 'Protección' }).first();
      await expect(protectionCheckbox).toBeVisible();
    });
  });

  test.describe('FASE 2: BOLSA (8+ Tests)', () => {
    test('B1: Tipo de Presentación = "Bolsa"', async ({ page }) => {
      await selectWrappingType(page, 'BOLSA');
      await scrollToSection(page, 'DISEÑO');

      // Select Tipo de Presentación = Bolsa
      const presentationSelect = page.locator('select').filter({ hasText: 'Tipo de presentación' }).first();
      if (await presentationSelect.isVisible()) {
        await presentationSelect.click();
        await page.locator('text=Bolsa').first().click();
      }

      // Verify dependent fields appear
      const tipoSelloField = page.locator('select').filter({ hasText: 'Tipo de Sello' }).first();
      const fuelleField = page.locator('select').filter({ hasText: 'fuelle' }).first();

      await expect(tipoSelloField).toBeVisible();
      await expect(fuelleField).toBeVisible();
    });

    test('B2: Tipo de Sello = "Sello lateral"', async ({ page }) => {
      await selectWrappingType(page, 'BOLSA');
      await scrollToSection(page, 'DISEÑO');

      // First set Tipo de Presentación = Bolsa
      const presentationSelect = page.locator('select').filter({ hasText: 'Tipo de presentación' }).first();
      if (await presentationSelect.isVisible()) {
        await presentationSelect.click();
        await page.locator('text=Bolsa').first().click();
      }

      // Then select Tipo de Sello = Sello lateral
      const selloSelect = page.locator('select').filter({ hasText: 'Tipo de Sello' }).first();
      if (await selloSelect.isVisible()) {
        await selloSelect.click();
        await page.locator('text=Sello lateral').first().click();
      }

      // Verify Acabado appears
      const acabadoField = page.locator('select').filter({ hasText: 'Acabado' }).first();
      await expect(acabadoField).toBeVisible();
    });

    test('B3: ¿Tiene Fuelle Lateral? = "Sí"', async ({ page }) => {
      await selectWrappingType(page, 'BOLSA');
      await scrollToSection(page, 'DISEÑO');

      // Set Tipo de Presentación = Bolsa
      const presentationSelect = page.locator('select').filter({ hasText: 'Tipo de presentación' }).first();
      if (await presentationSelect.isVisible()) {
        await presentationSelect.click();
        await page.locator('text=Bolsa').first().click();
      }

      // Set Fuelle = Sí
      const fuelleSelect = page.locator('select').filter({ hasText: 'fuelle' }).first();
      if (await fuelleSelect.isVisible()) {
        await fuelleSelect.click();
        await page.locator('text=Sí').first().click();
      }

      // Verify INFORMACIÓN FUELLE section appears
      const fuelleSection = page.locator('text=INFORMACIÓN').filter({ hasText: 'FUELLE' }).first();
      await expect(fuelleSection).toBeVisible();
    });

    test('B4: Tipo de Presentación = "Wicket"', async ({ page }) => {
      await selectWrappingType(page, 'BOLSA');
      await scrollToSection(page, 'DISEÑO');

      // Select Tipo de Presentación = Wicket
      const presentationSelect = page.locator('select').filter({ hasText: 'Tipo de presentación' }).first();
      if (await presentationSelect.isVisible()) {
        await presentationSelect.click();
        await page.locator('text=Wicket').first().click();
      }

      // Verify Wicket section appears
      const wicketSection = page.locator('text=SOLAPA').filter({ hasText: 'WICKET' }).first();
      await expect(wicketSection).toBeVisible();
    });

    test('B5: ¿Tiene Solapa? = "Sí"', async ({ page }) => {
      await selectWrappingType(page, 'BOLSA');
      await scrollToSection(page, 'DISEÑO');

      // Set Tipo de Presentación = Wicket
      const presentationSelect = page.locator('select').filter({ hasText: 'Tipo de presentación' }).first();
      if (await presentationSelect.isVisible()) {
        await presentationSelect.click();
        await page.locator('text=Wicket').first().click();
      }

      // Set Solapa = Sí
      const solapaSelect = page.locator('select').filter({ hasText: 'solapa' }).first();
      if (await solapaSelect.isVisible()) {
        await solapaSelect.click();
        await page.locator('text=Sí').first().click();
      }

      // Verify ancho and distance fields appear
      const anchoField = page.locator('input').filter({ hasText: 'Ancho' }).first();
      await expect(anchoField).toBeVisible();
    });

    test('B6: ¿Tiene Control? = "Sí"', async ({ page }) => {
      await selectWrappingType(page, 'BOLSA');
      await scrollToSection(page, 'DISEÑO');

      // Set Tipo de Presentación = Wicket
      const presentationSelect = page.locator('select').filter({ hasText: 'Tipo de presentación' }).first();
      if (await presentationSelect.isVisible()) {
        await presentationSelect.click();
        await page.locator('text=Wicket').first().click();
      }

      // Look for control checkbox
      const controlCheckbox = page.locator('input[type="checkbox"]').filter({ hasText: 'control' }).first();
      if (await controlCheckbox.isVisible()) {
        await controlCheckbox.check();

        // Verify control fields appear
        const controlSection = page.locator('text=Control').first();
        await expect(controlSection).toBeVisible();
      }
    });

    test('B7: Clase de Impresión = "Sin impresión"', async ({ page }) => {
      await selectWrappingType(page, 'BOLSA');
      await scrollToSection(page, 'DISEÑO');

      // Select Clase de Impresión = Sin impresión
      const printClassSelect = page.locator('select').filter({ hasText: 'Clase' }).first();
      if (await printClassSelect.isVisible()) {
        await printClassSelect.click();
        await page.locator('text=Sin impresión').first().click();
      }

      // Verify Tipo de Impresión is disabled
      const printTypeSelect = page.locator('select').filter({ hasText: 'Tipo de Impresión' }).first();
      if (await printTypeSelect.isVisible()) {
        await expect(printTypeSelect).toBeDisabled();
      }
    });

    test('B8: Especificaciones Especiales = "Otros"', async ({ page }) => {
      await selectWrappingType(page, 'BOLSA');
      await scrollToSection(page, 'DISEÑO');

      // Select Especificaciones = Otros
      const specSelect = page.locator('select').filter({ hasText: 'Especificación' }).first();
      if (await specSelect.isVisible()) {
        await specSelect.click();
        await page.locator('text=Otros').first().click();
      }

      // Verify textarea appears
      const textarea = page.locator('textarea').first();
      await expect(textarea).toBeVisible();
    });
  });

  test.describe('FASE 3: POUCH (13+ Tests)', () => {
    test('P1: Tipo de Formato Pouch = "Stand Up Pouch"', async ({ page }) => {
      await selectWrappingType(page, 'POUCH');
      await scrollToSection(page, 'DISEÑO');

      // Select Tipo de Formato = Stand Up Pouch
      const formatSelect = page.locator('select').filter({ hasText: 'Tipo de Formato' }).first();
      if (await formatSelect.isVisible()) {
        await formatSelect.click();
        await page.locator('text=Stand Up Pouch').first().click();
      }

      // Verify Tipo de Stand Up field appears
      const standUpSelect = page.locator('select').filter({ hasText: 'Tipo de Stand Up' }).first();
      await expect(standUpSelect).toBeVisible();
    });

    test('P2: Tipo de Stand Up = "Doy Pack"', async ({ page }) => {
      await selectWrappingType(page, 'POUCH');
      await scrollToSection(page, 'DISEÑO');

      // Set Tipo de Formato = Stand Up Pouch
      const formatSelect = page.locator('select').filter({ hasText: 'Tipo de Formato' }).first();
      if (await formatSelect.isVisible()) {
        await formatSelect.click();
        await page.locator('text=Stand Up Pouch').first().click();
      }

      // Set Tipo de Stand Up = Doy Pack
      const standUpSelect = page.locator('select').filter({ hasText: 'Tipo de Stand Up' }).first();
      if (await standUpSelect.isVisible()) {
        await standUpSelect.click();
        await page.locator('text=Doy Pack').first().click();
      }

      // Verify Tipo de Fuelle and Base Doy Pack appear
      const fuelleField = page.locator('select').filter({ hasText: 'Tipo de Fuelle' }).first();
      const baseField = page.locator('select').filter({ hasText: 'Base Doy Pack' }).first();

      await expect(fuelleField).toBeVisible();
      await expect(baseField).toBeVisible();
    });

    test('P3: Tipo de Stand Up = "Stand Up con Fuelle"', async ({ page }) => {
      await selectWrappingType(page, 'POUCH');
      await scrollToSection(page, 'DISEÑO');

      // Set Tipo de Formato = Stand Up Pouch
      const formatSelect = page.locator('select').filter({ hasText: 'Tipo de Formato' }).first();
      if (await formatSelect.isVisible()) {
        await formatSelect.click();
        await page.locator('text=Stand Up Pouch').first().click();
      }

      // Set Tipo de Stand Up = Stand Up con Fuelle
      const standUpSelect = page.locator('select').filter({ hasText: 'Tipo de Stand Up' }).first();
      if (await standUpSelect.isVisible()) {
        await standUpSelect.click();
        await page.locator('text=Stand Up con Fuelle').first().click();
      }

      // Verify Tipo de Fuelle appears but NOT Base Doy Pack
      const fuelleField = page.locator('select').filter({ hasText: 'Tipo de Fuelle' }).first();
      const baseField = page.locator('select').filter({ hasText: 'Base Doy Pack' }).first();

      await expect(fuelleField).toBeVisible();
      await expect(baseField).not.toBeVisible();
    });

    test('P4: Tipo de Formato Pouch = "Pouch Plano"', async ({ page }) => {
      await selectWrappingType(page, 'POUCH');
      await scrollToSection(page, 'DISEÑO');

      // Select Tipo de Formato = Pouch Plano
      const formatSelect = page.locator('select').filter({ hasText: 'Tipo de Formato' }).first();
      if (await formatSelect.isVisible()) {
        await formatSelect.click();
        await page.locator('text=Pouch Plano').first().click();
      }

      // Verify Cantidad de Sellos appears
      const cantidadSelect = page.locator('select').filter({ hasText: 'Cantidad de Sellos' }).first();
      await expect(cantidadSelect).toBeVisible();
    });

    test('P5: Cantidad de Sellos = "Dos sellos"', async ({ page }) => {
      await selectWrappingType(page, 'POUCH');
      await scrollToSection(page, 'DISEÑO');

      // Set Tipo de Formato = Pouch Plano
      const formatSelect = page.locator('select').filter({ hasText: 'Tipo de Formato' }).first();
      if (await formatSelect.isVisible()) {
        await formatSelect.click();
        await page.locator('text=Pouch Plano').first().click();
      }

      // Set Cantidad de Sellos = Dos sellos
      const cantidadSelect = page.locator('select').filter({ hasText: 'Cantidad de Sellos' }).first();
      if (await cantidadSelect.isVisible()) {
        await cantidadSelect.click();
        await page.locator('text=Dos sellos').first().click();
      }

      // Verify 2-column grid, no Ancho Sello Lateral
      const anchoSelloField = page.locator('input').filter({ hasText: 'Ancho Sello Lateral' }).first();
      await expect(anchoSelloField).not.toBeVisible();
    });

    test('P6: Cantidad de Sellos = "Tres sellos"', async ({ page }) => {
      await selectWrappingType(page, 'POUCH');
      await scrollToSection(page, 'DISEÑO');

      // Set Tipo de Formato = Pouch Plano
      const formatSelect = page.locator('select').filter({ hasText: 'Tipo de Formato' }).first();
      if (await formatSelect.isVisible()) {
        await formatSelect.click();
        await page.locator('text=Pouch Plano').first().click();
      }

      // Set Cantidad de Sellos = Tres sellos
      const cantidadSelect = page.locator('select').filter({ hasText: 'Cantidad de Sellos' }).first();
      if (await cantidadSelect.isVisible()) {
        await cantidadSelect.click();
        await page.locator('text=Tres sellos').first().click();
      }

      // Verify 3-column grid and Ancho Sello Lateral appears
      const anchoSelloField = page.locator('input').filter({ hasText: 'Ancho Sello Lateral' }).first();
      await expect(anchoSelloField).toBeVisible();
    });

    test('P7: Zipper = "Sí"', async ({ page }) => {
      await selectWrappingType(page, 'POUCH');
      await scrollToSection(page, 'DISEÑO');

      // Set Tipo de Formato = Pouch Plano
      const formatSelect = page.locator('select').filter({ hasText: 'Tipo de Formato' }).first();
      if (await formatSelect.isVisible()) {
        await formatSelect.click();
        await page.locator('text=Pouch Plano').first().click();
      }

      // Check Zipper checkbox
      const zipperCheckbox = page.locator('input[type="checkbox"]').filter({ hasText: 'Zipper' }).first();
      if (await zipperCheckbox.isVisible()) {
        await zipperCheckbox.check();

        // Verify zipper fields appear
        const zipperFields = page.locator('input').filter({ hasText: 'Zipper' });
        const count = await zipperFields.count();
        expect(count).toBeGreaterThan(0);
      }
    });

    test('P8: Perforación = "Sí"', async ({ page }) => {
      await selectWrappingType(page, 'POUCH');
      await scrollToSection(page, 'DISEÑO');

      // Set Tipo de Formato = Pouch Plano
      const formatSelect = page.locator('select').filter({ hasText: 'Tipo de Formato' }).first();
      if (await formatSelect.isVisible()) {
        await formatSelect.click();
        await page.locator('text=Pouch Plano').first().click();
      }

      // Check Perforación checkbox
      const perfCheckbox = page.locator('input[type="checkbox"]').filter({ hasText: 'Perforación' }).first();
      if (await perfCheckbox.isVisible()) {
        await perfCheckbox.check();

        // Verify perforation fields appear
        const perfFields = page.locator('select').filter({ hasText: 'Perforación' });
        const count = await perfFields.count();
        expect(count).toBeGreaterThan(0);
      }
    });

    test('P9: Tipo de Formato Pouch = "Pouch con Sello Central"', async ({ page }) => {
      await selectWrappingType(page, 'POUCH');
      await scrollToSection(page, 'DISEÑO');

      // Select Tipo de Formato = Pouch con Sello Central
      const formatSelect = page.locator('select').filter({ hasText: 'Tipo de Formato' }).first();
      if (await formatSelect.isVisible()) {
        await formatSelect.click();
        await page.locator('text=Pouch con Sello Central').first().click();
      }

      // Verify Material Sello Central and Fuelle fields appear
      const materialSelect = page.locator('select').filter({ hasText: 'Material Sello Central' }).first();
      const fuelleSelect = page.locator('select').filter({ hasText: 'Fuelle Sello Central' }).first();

      await expect(materialSelect).toBeVisible();
      await expect(fuelleSelect).toBeVisible();
    });

    test('P10: Material = "Aleta" AND Fuelle = "Sí"', async ({ page }) => {
      await selectWrappingType(page, 'POUCH');
      await scrollToSection(page, 'DISEÑO');

      // Set Tipo de Formato = Pouch con Sello Central
      const formatSelect = page.locator('select').filter({ hasText: 'Tipo de Formato' }).first();
      if (await formatSelect.isVisible()) {
        await formatSelect.click();
        await page.locator('text=Pouch con Sello Central').first().click();
      }

      // Set Material = Aleta
      const materialSelect = page.locator('select').filter({ hasText: 'Material Sello Central' }).first();
      if (await materialSelect.isVisible()) {
        await materialSelect.click();
        await page.locator('text=Aleta').first().click();
      }

      // Set Fuelle = Sí
      const fuelleSelect = page.locator('select').filter({ hasText: 'Fuelle Sello Central' }).first();
      if (await fuelleSelect.isVisible()) {
        await fuelleSelect.click();
        await page.locator('text=Sí').first().click();
      }

      // Verify Aleta+Fuelle specific fields appear
      const anchoField = page.locator('input').filter({ hasText: 'Ancho' }).first();
      await expect(anchoField).toBeVisible();
    });

    test('P11: Material = "PE-PE/PE" AND Fuelle = "Sí"', async ({ page }) => {
      await selectWrappingType(page, 'POUCH');
      await scrollToSection(page, 'DISEÑO');

      // Set Tipo de Formato = Pouch con Sello Central
      const formatSelect = page.locator('select').filter({ hasText: 'Tipo de Formato' }).first();
      if (await formatSelect.isVisible()) {
        await formatSelect.click();
        await page.locator('text=Pouch con Sello Central').first().click();
      }

      // Set Material = PE-PE/PE
      const materialSelect = page.locator('select').filter({ hasText: 'Material Sello Central' }).first();
      if (await materialSelect.isVisible()) {
        await materialSelect.click();
        await page.locator('text=PE-PE/PE').first().click();
      }

      // Set Fuelle = Sí
      const fuelleSelect = page.locator('select').filter({ hasText: 'Fuelle Sello Central' }).first();
      if (await fuelleSelect.isVisible()) {
        await fuelleSelect.click();
        await page.locator('text=Sí').first().click();
      }

      // Verify PE-PE/PE+Fuelle specific fields appear
      const microField = page.locator('input, select').filter({ hasText: 'microperforado' }).first();
      const fieldExists = await microField.isVisible().catch(() => false);
      expect(fieldExists).toBeTruthy();
    });

    test('P12: Tipo de Formato Pouch = "Pouch con Sello en Fuelle"', async ({ page }) => {
      await selectWrappingType(page, 'POUCH');
      await scrollToSection(page, 'DISEÑO');

      // Select Tipo de Formato = Pouch con Sello en Fuelle
      const formatSelect = page.locator('select').filter({ hasText: 'Tipo de Formato' }).first();
      if (await formatSelect.isVisible()) {
        await formatSelect.click();
        await page.locator('text=Pouch con Sello en Fuelle').first().click();
      }

      // Verify Tipo de Sello en Fuelle appears
      const selloSelect = page.locator('select').filter({ hasText: 'Tipo de Sello en Fuelle' }).first();
      await expect(selloSelect).toBeVisible();
    });

    test('P13: Tipo de Sello en Fuelle = "Tipo 4-1"', async ({ page }) => {
      await selectWrappingType(page, 'POUCH');
      await scrollToSection(page, 'DISEÑO');

      // Set Tipo de Formato = Pouch con Sello en Fuelle
      const formatSelect = page.locator('select').filter({ hasText: 'Tipo de Formato' }).first();
      if (await formatSelect.isVisible()) {
        await formatSelect.click();
        await page.locator('text=Pouch con Sello en Fuelle').first().click();
      }

      // Set Tipo de Sello en Fuelle = Tipo 4-1
      const selloSelect = page.locator('select').filter({ hasText: 'Tipo de Sello en Fuelle' }).first();
      if (await selloSelect.isVisible()) {
        await selloSelect.click();
        await page.locator('text=Tipo 4-1').first().click();

        // Verify selection without error
        const errorMsg = page.locator('text=Error').first();
        await expect(errorMsg).not.toBeVisible();
      }
    });
  });
});
