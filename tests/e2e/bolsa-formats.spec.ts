import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:5173';

// Test data for each BOLSA format
const BOLSA_TEST_CASES = [
  {
    name: 'TEST 1: SELLO LATERAL\\CORTE\\CON FUELLE FONDO',
    tipoPresentacionBolsa: 'Bolsa sellada',
    tipoSelloBolsa: 'Sello lateral',
    acabadoBolsa: 'Corte',
    tieneFuelleBolsa: 'Sí',
    tipoFuelleBolsa: 'Fondo',
    printClass: 'Flexo',
    expectedFieldsVisible: ['tipoSelloBolsa', 'acabadoBolsa', 'tieneFuelleBolsa', 'tipoFuelleBolsa', 'printType'],
    expectedFieldsHidden: ['hasCortaAliviador', 'hasDispensador'],
  },
  {
    name: 'TEST 2: SELLO LATERAL\\PESTAÑA\\CON FUELLE FONDO',
    tipoPresentacionBolsa: 'Bolsa sellada',
    tipoSelloBolsa: 'Sello lateral',
    acabadoBolsa: 'Pestaña',
    tieneFuelleBolsa: 'Sí',
    tipoFuelleBolsa: 'Fondo',
    printClass: 'Huecograbado',
    expectedFieldsVisible: ['tipoSelloBolsa', 'acabadoBolsa', 'tieneFuelleBolsa', 'tipoFuelleBolsa', 'printType'],
    expectedFieldsHidden: ['hasCortaAliviador'],
  },
  {
    name: 'TEST 3: SELLO LATERAL\\PESTAÑA\\SIN FUELLE FONDO',
    tipoPresentacionBolsa: 'Bolsa sellada',
    tipoSelloBolsa: 'Sello lateral',
    acabadoBolsa: 'Pestaña',
    tieneFuelleBolsa: 'No',
    tipoFuelleBolsa: '',
    printClass: 'Sin impresión',
    expectedFieldsVisible: ['tipoSelloBolsa', 'acabadoBolsa', 'tieneFuelleBolsa'],
    expectedFieldsHidden: ['tipoFuelleBolsa', 'printType'],
  },
  {
    name: 'TEST 4: SELLO LATERAL\\CORTE\\SIN FUELLE FONDO',
    tipoPresentacionBolsa: 'Bolsa sellada',
    tipoSelloBolsa: 'Sello lateral',
    acabadoBolsa: 'Corte',
    tieneFuelleBolsa: 'No',
    tipoFuelleBolsa: '',
    printClass: 'Flexo',
    expectedFieldsVisible: ['tipoSelloBolsa', 'acabadoBolsa', 'tieneFuelleBolsa'],
    expectedFieldsHidden: ['tipoFuelleBolsa'],
  },
  {
    name: 'TEST 5: SELLO DE FONDO\\CON FUELLE LATERAL',
    tipoPresentacionBolsa: 'Bolsa sellada',
    tipoSelloBolsa: 'Sello de fondo',
    acabadoBolsa: '',
    tieneFuelleBolsa: 'Sí',
    tipoFuelleBolsa: 'Lateral',
    printClass: 'Flexo',
    expectedFieldsVisible: ['tipoSelloBolsa', 'tieneFuelleBolsa', 'tipoFuelleBolsa'],
    expectedFieldsHidden: ['acabadoBolsa'],
  },
  {
    name: 'TEST 6: SELLO DE FONDO\\SIN FUELLE LATERAL',
    tipoPresentacionBolsa: 'Bolsa sellada',
    tipoSelloBolsa: 'Sello de fondo',
    acabadoBolsa: '',
    tieneFuelleBolsa: 'No',
    tipoFuelleBolsa: '',
    printClass: 'Sin impresión',
    expectedFieldsVisible: ['tipoSelloBolsa', 'tieneFuelleBolsa'],
    expectedFieldsHidden: ['acabadoBolsa', 'tipoFuelleBolsa'],
  },
  {
    name: 'TEST 7: WICKET',
    tipoPresentacionBolsa: 'Wicket',
    tipoSelloBolsa: '',
    acabadoBolsa: '',
    tieneFuelleBolsa: '',
    tipoFuelleBolsa: '',
    printClass: 'Flexo',
    expectedFieldsVisible: ['anchoSolapa', 'hasWicket', 'hasWicketControl'],
    expectedFieldsHidden: ['tipoSelloBolsa', 'acabadoBolsa', 'tieneFuelleBolsa'],
  },
  {
    name: 'TEST 8: HOJAS',
    tipoPresentacionBolsa: 'Hojas',
    tipoSelloBolsa: '',
    acabadoBolsa: '',
    tieneFuelleBolsa: '',
    tipoFuelleBolsa: '',
    printClass: 'Sin impresión',
    expectedFieldsVisible: ['tipoPresentacionBolsa'],
    expectedFieldsHidden: ['tipoSelloBolsa', 'acabadoBolsa', 'tieneFuelleBolsa', 'anchoSolapa'],
  },
];

test.describe('BOLSA Formats - Automated QA Suite', () => {
  test.beforeEach(async ({ page }) => {
    // Login or navigate to product creation
    await page.goto(`${BASE_URL}/products`);
  });

  BOLSA_TEST_CASES.forEach((testCase, index) => {
    test(`${testCase.name}`, async ({ page }) => {
      // Navigate to create new product
      await page.goto(`${BASE_URL}/products`);

      // Wait for page to load
      await page.waitForSelector('button', { timeout: 5000 }).catch(() => null);

      // Click "Crear Nuevo Producto" or similar button
      const createButton = await page.locator('text=Crear Nuevo Producto, Crear producto, Nueva ficha').first();
      if (await createButton.isVisible()) {
        await createButton.click();
      }

      // ====== PASO 0: INFORMACIÓN DEL PRODUCTO ======
      await page.waitForSelector('input[placeholder*="Nombre"]', { timeout: 5000 }).catch(() => null);

      const productName = `BOLSA TEST ${index + 1} - ${testCase.name.split(':')[1] || 'Test'}`;

      await page.fill('input[placeholder*="Nombre"], input[placeholder*="nombre"]', productName);
      await page.fill('input[placeholder*="Volumen"], input[placeholder*="Cantidad"]', String(500 + index * 100));

      // Select Unit
      const unitSelect = await page.locator('select, [role="combobox"]').nth(1);
      if (await unitSelect.isVisible()) {
        await unitSelect.click();
        await page.click('text=KGS, text=kg');
      }

      // Fill description
      await page.fill('textarea', `Prueba QA para formato BOLSA ${index + 1}`);

      // Select classification
      await page.click('text=Clasificación');
      await page.click('text=Producto Nuevo');

      // ====== PASO 1: DISEÑO - CONFIGURACIÓN DE FORMATO ======

      // Select Tipo Presentación
      await page.click('text=Tipo de presentación');
      await page.click(`text=${testCase.tipoPresentacionBolsa}`);

      // Wait for conditional fields
      await page.waitForTimeout(500);

      // If Bolsa sellada, select Tipo Sello
      if (testCase.tipoSelloBolsa) {
        const tipoSelloLocator = page.locator('text=Tipo de Sello').first();
        if (await tipoSelloLocator.isVisible()) {
          await tipoSelloLocator.click();
          await page.click(`text=${testCase.tipoSelloBolsa}`);
        }
      }

      // If Sello lateral, select Acabado
      if (testCase.acabadoBolsa && testCase.tipoSelloBolsa === 'Sello lateral') {
        const acabadoLocator = page.locator('text=Acabado').first();
        if (await acabadoLocator.isVisible()) {
          await acabadoLocator.click();
          await page.click(`text=${testCase.acabadoBolsa}`);
        }
      }

      // If Bolsa sellada, select Fuelle
      if (testCase.tieneFuelleBolsa) {
        const fuelleLocator = page.locator('text=¿Lleva Fuelle').first();
        if (await fuelleLocator.isVisible()) {
          await fuelleLocator.click();
          await page.click(`text=${testCase.tieneFuelleBolsa}`);
        }
      }

      // If has Fuelle, select Tipo Fuelle
      if (testCase.tipoFuelleBolsa && testCase.tieneFuelleBolsa === 'Sí') {
        const tipoFuelleLocator = page.locator('text=Tipo de Fuelle').first();
        if (await tipoFuelleLocator.isVisible()) {
          await tipoFuelleLocator.click();
          await page.click(`text=${testCase.tipoFuelleBolsa}`);
        }
      }

      // Select Print Class
      await page.click('text=Impresión, text=Clase de Impresión');
      await page.click(`text=${testCase.printClass}`);

      // ====== PASO 2: ESTRUCTURA ======

      // Select structure type
      await page.click('text=Tipo de Estructura');
      await page.click('text=Bilaminado');

      // Fill in layers (BOPP)
      await page.click('text=Capa 1');
      await page.fill('input[placeholder*="Material"], input[placeholder*="BOPP"]', 'BOPP - BOPP CRISTAL - 20');
      await page.click('text=BOPP CRISTAL - 20');

      // Add layer 2
      await page.click('text=Capa 2');
      await page.fill('input[placeholder*="Material"]', 'PET - PET CRISTAL - 12');
      await page.click('text=PET CRISTAL - 12');

      // Select sample request
      await page.click('text=¿Solicitud de muestra');
      await page.click('text=Sí');

      // ====== PASO 3: EMBALAJE ======

      // Select packaging material
      await page.click('text=Embalaje de material');
      await page.click('text=Bobina plana');

      // Select splices
      await page.click('text=Empalmes');
      await page.click('text=Encolado');

      // ====== VALIDATIONS ======

      // Check that expected fields are visible
      for (const fieldLabel of testCase.expectedFieldsVisible) {
        const fieldLocator = page.locator(`text=${fieldLabel}, label:has-text("${fieldLabel}")`).first();
        expect(await fieldLocator.isVisible({ timeout: 2000 }).catch(() => false)).toBeTruthy();
      }

      // Check that expected fields are hidden
      for (const fieldLabel of testCase.expectedFieldsHidden) {
        const fieldLocator = page.locator(`text=${fieldLabel}, label:has-text("${fieldLabel}")`).first();
        const isVisible = await fieldLocator.isVisible({ timeout: 1000 }).catch(() => false);
        if (isVisible) {
          expect(isVisible).toBeFalsy();
        }
      }

      // Verify completion percentage increases
      const completionPercentage = await page.locator('text=/\\d+%/').first().textContent();
      const percentage = parseInt(completionPercentage || '0');
      expect(percentage).toBeGreaterThan(0);

      console.log(`✅ ${testCase.name} - Completion: ${percentage}%`);
    });
  });

  // Test 9: Dynamic format change
  test('TEST 9: Cambio dinámico entre formatos', async ({ page }) => {
    await page.goto(`${BASE_URL}/products`);

    // Create new product
    const createButton = await page.locator('button').first();
    if (await createButton.isVisible()) {
      await createButton.click();
    }

    // Fill basic info
    await page.fill('input[placeholder*="Nombre"], input[placeholder*="nombre"]', 'BOLSA TEST 9 - Dynamic Change');
    await page.fill('input[placeholder*="Volumen"]', '1000');

    // Step 1: Sello Lateral
    await page.click('text=Tipo de presentación');
    await page.click('text=Bolsa sellada');
    await page.click('text=Tipo de Sello');
    await page.click('text=Sello lateral');

    // Verify Acabado appears
    let acabadoVisible = await page.locator('text=Acabado').isVisible().catch(() => false);
    expect(acabadoVisible).toBeTruthy();

    // Step 2: Change to Sello de Fondo
    await page.click('text=Tipo de Sello');
    await page.click('text=Sello de fondo');

    // Wait and verify Acabado disappears
    await page.waitForTimeout(300);
    acabadoVisible = await page.locator('text=Acabado').isVisible().catch(() => false);
    expect(acabadoVisible).toBeFalsy();

    // Step 3: Change to Wicket
    await page.click('text=Tipo de presentación');
    await page.click('text=Wicket');

    // Verify Wicket fields appear
    const wicketFieldsVisible = await page.locator('text=Ancho de solapa, text=Wickets').first().isVisible().catch(() => false);
    expect(wicketFieldsVisible).toBeTruthy();

    // Step 4: Change to Hojas
    await page.click('text=Tipo de presentación');
    await page.click('text=Hojas');

    // Verify special Wicket fields disappear
    const wicketSpecialVisible = await page.locator('text=Ancho de solapa').isVisible().catch(() => false);
    expect(wicketSpecialVisible).toBeFalsy();

    console.log('✅ TEST 9: Cambio dinámico entre formatos - PASS');
  });

  // Test: Adhesive calculation verification
  test('TEST 10: Verificación de cálculo de adhesivos', async ({ page }) => {
    await page.goto(`${BASE_URL}/products`);

    // Create product with Trilaminado structure
    const createButton = await page.locator('button').first();
    if (await createButton.isVisible()) {
      await createButton.click();
    }

    await page.fill('input[placeholder*="Nombre"]', 'BOLSA TEST 10 - Adhesivo');
    await page.fill('input[placeholder*="Volumen"]', '750');

    // Setup BOLSA
    await page.click('text=Tipo de presentación');
    await page.click('text=Bolsa sellada');

    // Structure: Trilaminado
    await page.click('text=Tipo de Estructura');
    await page.click('text=Trilaminado');

    // Add layers
    await page.fill('input[placeholder*="Material"]', 'BOPP - BOPP CRISTAL - 20');
    await page.click('text=BOPP CRISTAL - 20');

    await page.fill('input[placeholder*="Material"]', 'PET - PET CRISTAL - 12');
    await page.click('text=PET CRISTAL - 12');

    await page.fill('input[placeholder*="Material"]', 'BOPP - BOPP CRISTAL - 25');
    await page.click('text=BOPP CRISTAL - 25');

    // Verify adhesive rows in table (should be 2 for Trilaminado)
    const adhesiveRows = await page.locator('text=Adhesivo').count();
    expect(adhesiveRows).toBe(2);

    // Verify each adhesive has 2.5 gramaje
    const adhesiveGrammages = await page.locator('td:has-text("2.5")').count();
    expect(adhesiveGrammages).toBeGreaterThanOrEqual(2);

    console.log('✅ TEST 10: Cálculo de adhesivos - PASS');
  });
});
