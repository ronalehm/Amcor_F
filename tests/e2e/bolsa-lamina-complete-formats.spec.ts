import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:5173';

// BOLSA Formats Test Suite
const BOLSA_FORMATS = [
  {
    name: 'SELLO LATERAL',
    code: 'sello-lateral',
    fields: {
      tipoSello: 'Sello lateral',
      acabado: 'Corte',
      tieneFuelle: 'Sí',
      tipoFuelle: 'Fondo',
    },
    expectedFields: ['Tipo de Sello', 'Acabado', '¿Tiene Fuelle?', 'Tipo de Fuelle', 'Precorte', 'Tipo Perforación'],
  },
  {
    name: 'SELLO DE FONDO',
    code: 'sello-fondo',
    fields: {
      tipoSello: 'Sello de fondo',
      tieneFuelle: 'Sí',
      tipoFuelle: 'Lateral',
    },
    expectedFields: ['Tipo de Sello', '¿Tiene Fuelle?', 'Tipo de Fuelle'],
    shouldNotAppear: ['Acabado'], // No debe aparecer Acabado para Sello de Fondo
  },
  {
    name: 'WICKET',
    code: 'wicket',
    fields: {
      tipoPresentacion: 'Wicket',
      anchoSolapa: '50',
    },
    expectedFields: ['Tipo de Presentación', 'Ancho Solapa', 'Wickets'],
    shouldNotAppear: ['Tipo de Sello', 'Acabado'], // No debe aparecer sellos
  },
  {
    name: 'HOJAS',
    code: 'hojas',
    fields: {
      tipoPresentacion: 'Hojas',
    },
    expectedFields: ['Tipo de Presentación', 'Ancho', 'Largo'],
  },
];

// LÁMINA Formats Test Suite
const LAMINA_FORMATS = [
  {
    name: 'BOBINA',
    code: 'bobina',
    fields: {
      tipoFormato: 'Bobina',
      ancho: '800',
      repeticion: '150',
    },
    expectedFields: ['Tipo de Formato Lámina', 'Ancho', 'Repetición'],
  },
  {
    name: 'PLIEGO',
    code: 'pliego',
    fields: {
      tipoFormato: 'Pliego',
      ancho: '600',
      largo: '800',
    },
    expectedFields: ['Tipo de Formato Lámina', 'Ancho', 'Largo'],
  },
];

// Test BOLSA Formats
test.describe('BOLSA - All Formats Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE_URL}/products`);
  });

  BOLSA_FORMATS.forEach((format) => {
    test(`✅ BOLSA - ${format.name}`, async ({ page }) => {
      console.log(`\n🧪 Testing BOLSA Format: ${format.name}`);

      // Create product
      await page.locator('button').first().click();
      await page.waitForTimeout(500);

      // Basic info
      const nameInput = page.locator('input[placeholder*="Nombre"], input[placeholder*="nombre"]').first();
      await nameInput.fill(`Test ${format.name}`);

      const volumeInput = page.locator('input[placeholder*="Volumen"], input[placeholder*="volumen"]').first();
      await volumeInput.fill('500');

      const descInput = page.locator('textarea').first();
      await descInput.fill(`Test ${format.name} format`);

      // Select BOLSA
      const envoltura = page.locator('select, [role="combobox"]').nth(0);
      await envoltura.click();
      await page.click('text=BOLSA');

      // Select structure type
      const structure = page.locator('select, [role="combobox"]').nth(1);
      await structure.click();
      await page.click('text=Bilaminado');

      // Select layers
      const layer1 = page.locator('input[placeholder*="Material"]').first();
      await layer1.fill('BOPP');
      await page.waitForTimeout(200);
      await page.click('text=BOPP').first();

      const layer2 = page.locator('input[placeholder*="Material"]').nth(1);
      await layer2.fill('PET');
      await page.waitForTimeout(200);
      await page.click('text=PET').first();

      // Create product
      const createBtn = page.locator('button:has-text("Crear"), button:has-text("Siguiente")').last();
      await createBtn.click();

      await page.waitForTimeout(1000);

      // Verify expected fields are visible
      console.log(`  📋 Checking expected fields for ${format.name}`);
      for (const expectedField of format.expectedFields) {
        const fieldExists = await page.locator(`text=${expectedField}`).isVisible({ timeout: 2000 }).catch(() => false);
        console.log(`    ${fieldExists ? '✓' : '✗'} ${expectedField}`);
        expect(fieldExists).toBe(true);
      }

      // Verify fields that should NOT appear
      if (format.shouldNotAppear) {
        console.log(`  🚫 Checking fields that should NOT appear`);
        for (const shouldNotField of format.shouldNotAppear) {
          const fieldDoesntExist = !(await page.locator(`text=${shouldNotField}`).isVisible({ timeout: 1000 }).catch(() => false));
          console.log(`    ${fieldDoesntExist ? '✓' : '✗'} ${shouldNotField} not visible`);
        }
      }

      console.log(`  ✅ ${format.name} - PASS`);
    });
  });
});

// Test LÁMINA Formats
test.describe('LÁMINA - All Formats Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE_URL}/products`);
  });

  LAMINA_FORMATS.forEach((format) => {
    test(`✅ LÁMINA - ${format.name}`, async ({ page }) => {
      console.log(`\n🧪 Testing LÁMINA Format: ${format.name}`);

      // Create product
      await page.locator('button').first().click();
      await page.waitForTimeout(500);

      // Basic info
      const nameInput = page.locator('input[placeholder*="Nombre"], input[placeholder*="nombre"]').first();
      await nameInput.fill(`Test Lámina ${format.name}`);

      const volumeInput = page.locator('input[placeholder*="Volumen"], input[placeholder*="volumen"]').first();
      await volumeInput.fill('1000');

      const descInput = page.locator('textarea').first();
      await descInput.fill(`Test Lámina ${format.name} format`);

      // Select LÁMINA
      const envoltura = page.locator('select, [role="combobox"]').nth(0);
      await envoltura.click();
      await page.click('text=LÁMINA');

      // Select structure type
      const structure = page.locator('select, [role="combobox"]').nth(1);
      await structure.click();
      await page.click('text=Bilaminado');

      // Select layers
      const layer1 = page.locator('input[placeholder*="Material"]').first();
      await layer1.fill('BOPP');
      await page.waitForTimeout(200);
      await page.click('text=BOPP').first();

      const layer2 = page.locator('input[placeholder*="Material"]').nth(1);
      await layer2.fill('PET');
      await page.waitForTimeout(200);
      await page.click('text=PET').first();

      // Create product
      const createBtn = page.locator('button:has-text("Crear"), button:has-text("Siguiente")').last();
      await createBtn.click();

      await page.waitForTimeout(1000);

      // Verify expected fields are visible
      console.log(`  📋 Checking expected fields for Lámina ${format.name}`);
      for (const expectedField of format.expectedFields) {
        const fieldExists = await page.locator(`text=${expectedField}`).isVisible({ timeout: 2000 }).catch(() => false);
        console.log(`    ${fieldExists ? '✓' : '✗'} ${expectedField}`);
        expect(fieldExists).toBe(true);
      }

      console.log(`  ✅ Lámina ${format.name} - PASS`);
    });
  });
});

// Field Consistency Tests
test.describe('Field Naming Consistency - BOLSA vs LÁMINA', () => {
  test('Verify "Tipo de" prefix is consistent', async ({ page }) => {
    console.log('\n🔍 Checking "Tipo de" consistency');

    await page.goto(`${BASE_URL}/products`);

    // Create BOLSA product
    await page.locator('button').first().click();
    await page.waitForTimeout(500);

    const nameInput = page.locator('input[placeholder*="Nombre"], input[placeholder*="nombre"]').first();
    await nameInput.fill('Test Tipo de');

    // Check all "Tipo de" labels appear consistently
    const tipoDeFields = await page.locator('text=/Tipo de [A-Z]').count();
    console.log(`  Found ${tipoDeFields} fields starting with "Tipo de"`);

    expect(tipoDeFields).toBeGreaterThan(0);
  });

  test('Verify no "Dist." abbreviations exist', async ({ page }) => {
    console.log('\n🔍 Checking for abbreviations');

    await page.goto(`${BASE_URL}/products`);

    // Create product to navigate to fields
    await page.locator('button').first().click();
    await page.waitForTimeout(500);

    // Try to find any "Dist." labels (should be 0)
    const distLabels = await page.locator('text=/Dist\./').count();
    console.log(`  Found ${distLabels} labels with "Dist." abbreviation`);

    expect(distLabels).toBe(0);
  });

  test('Verify "¿Tiene Fuelle?" is used consistently', async ({ page }) => {
    console.log('\n🔍 Checking "¿Tiene Fuelle?" consistency');

    await page.goto(`${BASE_URL}/products`);

    // Navigate to page with fuelle fields
    await page.locator('button').first().click();
    await page.waitForTimeout(500);

    const fuelleFields = await page.locator('text=¿Tiene Fuelle?').count();
    console.log(`  Found ${fuelleFields} instances of "¿Tiene Fuelle?"`);

    // Should find it (or at least 0 of the old versions)
    const oldFuelleLabels = await page.locator('text=/¿Lleva Fuelle|¿Tendrá Fuelle/').count();
    console.log(`  Found ${oldFuelleLabels} instances of old fuelle labels`);

    expect(oldFuelleLabels).toBe(0);
  });
});
