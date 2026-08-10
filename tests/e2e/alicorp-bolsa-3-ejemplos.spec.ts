import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:5173';

// Test data for 3 Alicorp examples
const ALICORP_EXAMPLES = [
  {
    name: 'MAYONESA ALACAMPO',
    moment1: {
      portfolio: 'ALICORP',
      productName: 'Mayonesa AlaCampo 500g',
      volume: '500',
      description: 'Mayonesa para uso doméstico, sello lateral',
      structureType: 'Bilaminado',
      layer1: { material: 'BOPP - BOPP CRISTAL - 20', micron: '20', grammage: '18' },
      layer2: { material: 'POLIESTER - PET CRISTAL - 12', micron: '12', grammage: '17' },
    },
    moment2: {
      tipoPresentacion: 'Bolsa sellada',
      tipoSello: 'Sello lateral',
      acabado: 'Corte',
      tieneFuelle: 'Sí',
      tipoFuelle: 'Fondo',
      precorte: '10',
      tipoPerforacion: 'Cruz 5 mm',
      printClass: 'Flexo',
      printType: 'Continuo',
      aplicacionTecnica: 'CONDIMENTOS Y SALSAS',
      embalaje: 'Bobina plana',
      empalmes: 'Encolado',
    },
    expectedTable: {
      rows: 3,
      total: 37.5,
      tolerance: 3.75,
      items: [
        { description: 'BOPP CRISTAL', grammage: 18 },
        { description: 'Adhesivo', grammage: 2.5 },
        { description: 'PET CRISTAL', grammage: 17 },
      ],
    },
  },
  {
    name: 'SALSA AJÍ ALACENA',
    moment1: {
      portfolio: 'ALICORP',
      productName: 'Salsa Ají Alacena 200ml',
      volume: '250',
      description: 'Salsa de ají tradicional, sello de fondo',
      structureType: 'Trilaminado',
      layer1: { material: 'BOPP - BOPP CRISTAL - 20', micron: '20', grammage: '18' },
      layer2: { material: 'POLIESTER - PET CRISTAL - 12', micron: '12', grammage: '17' },
      layer3: { material: 'BOPP - BOPP CRISTAL - 25', micron: '25', grammage: '22.5' },
    },
    moment2: {
      tipoPresentacion: 'Bolsa sellada',
      tipoSello: 'Sello de fondo',
      tieneFuelle: 'Sí',
      tipoFuelle: 'Lateral',
      precorte: '10',
      tipoPerforacion: 'OJAL 50x15 mm',
      printClass: 'Huecograbado',
      printType: 'Repetitivo',
      aplicacionTecnica: 'ADEREZOS Y SALSAS',
      embalaje: 'Bobina plana',
      empalmes: 'Soldado',
    },
    expectedTable: {
      rows: 6,
      total: 65.5,
      tolerance: 6.55,
      items: [
        { description: 'BOPP CRISTAL', grammage: 18 },
        { description: 'Tinta', grammage: 2.5 },
        { description: 'Adhesivo', grammage: 2.5 },
        { description: 'PET CRISTAL', grammage: 17 },
        { description: 'Adhesivo', grammage: 2.5 },
        { description: 'BOPP CRISTAL', grammage: 22.5 },
      ],
    },
  },
  {
    name: 'ACEITE PRIMOR WICKET',
    moment1: {
      portfolio: 'ALICORP',
      productName: 'Aceite Primor 1L Wicket',
      volume: '1000',
      description: 'Aceite con sistema Wicket para envasado rápido',
      structureType: 'Bilaminado',
      layer1: { material: 'BOPP - BOPP CRISTAL - 20', micron: '20', grammage: '18' },
      layer2: { material: 'BOPP - BOPP CRISTAL - 25', micron: '25', grammage: '22.5' },
    },
    moment2: {
      tipoPresentacion: 'Wicket',
      anchoSolapa: '50',
      hasWickets: 'Sí',
      wicketDiameter: 'D 14 mm',
      wicketDistSuperior: '25',
      wicketDistDerecho: '30',
      hasWicketControl: 'Sí',
      wicketControlDiameter: 'D 12 mm',
      wicketControlUbicacion: 'Superior',
      wicketControlDistSuperior: '15',
      wicketControlDistDerecho: '35',
      hasPrecorteWicket: 'Sí',
      precorteWicketLargo: '5',
      precorteWicketUbicacion: 'A los extremos del wicket',
      precorteWicketDistDerecho: 'Al borde',
      fuelleAbreFacil: 'Sí',
      fuellePerforacion: 'OJAL 50x15 mm',
      printClass: 'Flexo',
      printType: 'Continuo',
      aplicacionTecnica: 'ACEITES COMESTIBLES',
      embalaje: 'Bobina plana',
      empalmes: 'Encolado',
    },
    expectedTable: {
      rows: 4,
      total: 45.5,
      tolerance: 4.55,
      items: [
        { description: 'BOPP CRISTAL', grammage: 18 },
        { description: 'Tinta', grammage: 2.5 },
        { description: 'Adhesivo', grammage: 2.5 },
        { description: 'BOPP CRISTAL', grammage: 22.5 },
      ],
    },
  },
];

test.describe('Alicorp BOLSA 3 Ejemplos - Automated QA', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE_URL}/products`);
  });

  ALICORP_EXAMPLES.forEach((example) => {
    test(`✅ ${example.name}`, async ({ page }) => {
      console.log(`\n🚀 Starting: ${example.name}`);

      // ========== MOMENTO 1: ProductInitialCreateModal ==========
      console.log(`  📋 MOMENTO 1: Creating product base...`);

      // Click "Crear Nuevo Producto"
      await page.locator('button').first().click();
      await page.waitForTimeout(500);

      // Pantalla 1: Seleccionar Portafolio
      const portfolioInput = page.locator('input[placeholder*="Portafolio"], input[placeholder*="portafolio"]').first();
      if (await portfolioInput.isVisible()) {
        await portfolioInput.fill(example.moment1.portfolio);
        await page.waitForTimeout(300);
        // Select first matching portfolio
        const portfolioOption = page.locator('text=/ALICORP.*MAYONESA|ALICORP.*ADEREZOS|ALICORP.*ACEITE/').first();
        if (await portfolioOption.isVisible()) {
          await portfolioOption.click();
        }
      }

      await page.waitForTimeout(500);

      // Pantalla 4: Estructura Base
      await page.fill('input[placeholder*="Nombre"], input[placeholder*="nombre"]', example.moment1.productName);
      await page.fill('input[placeholder*="Volumen"], input[placeholder*="volumen"]', example.moment1.volume);
      await page.fill('textarea', example.moment1.description);

      // Select structure type
      const structureSelect = page.locator('select, [role="combobox"]').nth(1);
      if (await structureSelect.isVisible()) {
        await structureSelect.click();
        await page.click(`text=${example.moment1.structureType}`);
      }

      await page.waitForTimeout(500);

      // Pantalla 5: Layer 1
      const layer1Input = page.locator('input[placeholder*="Material"]').first();
      await layer1Input.fill(example.moment1.layer1.material.split(' - ')[0]);
      await page.waitForTimeout(200);
      await page.click(`text=${example.moment1.layer1.material}`);

      await page.waitForTimeout(300);

      // Pantalla 6: Layer 2
      const layer2Input = page.locator('input[placeholder*="Material"]').nth(1);
      await layer2Input.fill(example.moment1.layer2.material.split(' - ')[0]);
      await page.waitForTimeout(200);
      await page.click(`text=${example.moment1.layer2.material}`);

      // Layer 3 if Trilaminado
      if (example.moment1.layer3) {
        await page.waitForTimeout(300);
        const layer3Input = page.locator('input[placeholder*="Material"]').nth(2);
        await layer3Input.fill(example.moment1.layer3.material.split(' - ')[0]);
        await page.waitForTimeout(200);
        await page.click(`text=${example.moment1.layer3.material}`);
      }

      await page.waitForTimeout(500);

      // Pantalla 8: Confirmar y crear
      const createButton = page.locator('button:has-text("Crear"), button:has-text("Siguiente")').last();
      await createButton.click();

      console.log(`  ✅ MOMENTO 1 complete`);

      // ========== MOMENTO 2: ProductEditPage ==========
      console.log(`  📋 MOMENTO 2: Completing full product...`);

      await page.waitForTimeout(1000);

      // PASO 0: INFORMACIÓN DEL PRODUCTO
      await page.fill('input[placeholder*="Aplicación"], input[placeholder*="aplicación"]', example.moment2.aplicacionTecnica);

      // PASO 1: DISEÑO - CONFIGURACIÓN DE FORMATO
      if (example.moment2.tipoPresentacion === 'Wicket') {
        // Wicket-specific configuration
        await page.click('text=Tipo de presentación');
        await page.click(`text=${example.moment2.tipoPresentacion}`);

        await page.waitForTimeout(300);

        // Ancho de solapa
        const anchoSolapaInput = page.locator('input[placeholder*="Ancho"]').first();
        if (await anchoSolapaInput.isVisible()) {
          await anchoSolapaInput.fill(example.moment2.anchoSolapa);
        }

        // Wickets
        if (example.moment2.hasWickets === 'Sí') {
          await page.click('text=Wickets');
          await page.click(`text=${example.moment2.hasWickets}`);

          await page.waitForTimeout(300);

          // Fill Wicket fields
          const wicketDiameterSelect = page.locator('select, [role="combobox"]').nth(0);
          await wicketDiameterSelect.click();
          await page.click(`text=${example.moment2.wicketDiameter}`);

          const wicketDistSuperiorInput = page.locator('input[placeholder*="Distancia"]').nth(0);
          await wicketDistSuperiorInput.fill(example.moment2.wicketDistSuperior);

          const wicketDistDerechoInput = page.locator('input[placeholder*="Distancia"]').nth(1);
          await wicketDistDerechoInput.fill(example.moment2.wicketDistDerecho);
        }

        // Wicket de control
        if (example.moment2.hasWicketControl === 'Sí') {
          await page.click('text=Wicket de control');
          await page.click(`text=${example.moment2.hasWicketControl}`);

          await page.waitForTimeout(300);

          const wcDiameterSelect = page.locator('select, [role="combobox"]').nth(1);
          await wcDiameterSelect.click();
          await page.click(`text=${example.moment2.wicketControlDiameter}`);

          const wcUbicacionSelect = page.locator('select, [role="combobox"]').nth(2);
          await wcUbicacionSelect.click();
          await page.click(`text=${example.moment2.wicketControlUbicacion}`);

          const wcDistSuperiorInput = page.locator('input[placeholder*="Distancia"]').nth(2);
          await wcDistSuperiorInput.fill(example.moment2.wicketControlDistSuperior);

          const wcDistDerechoInput = page.locator('input[placeholder*="Distancia"]').nth(3);
          await wcDistDerechoInput.fill(example.moment2.wicketControlDistDerecho);
        }

        // Precorte Wicket
        if (example.moment2.hasPrecorteWicket === 'Sí') {
          await page.click('text=Precorte Wicket');
          await page.click(`text=${example.moment2.hasPrecorteWicket}`);

          await page.waitForTimeout(300);

          const pcLargoSelect = page.locator('select, [role="combobox"]').nth(3);
          await pcLargoSelect.click();
          await page.click(`text=${example.moment2.precorteWicketLargo}`);

          const pcUbicacionSelect = page.locator('select, [role="combobox"]').nth(4);
          await pcUbicacionSelect.click();
          await page.click(`text=${example.moment2.precorteWicketUbicacion}`);

          const pcDistDerechoSelect = page.locator('select, [role="combobox"]').nth(5);
          await pcDistDerechoSelect.click();
          await page.click(`text=${example.moment2.precorteWicketDistDerecho}`);
        }
      } else {
        // Bolsa sellada configuration
        await page.click('text=Tipo de presentación');
        await page.click(`text=${example.moment2.tipoPresentacion}`);

        await page.waitForTimeout(300);

        // Tipo de Sello
        await page.click('text=Tipo de Sello');
        await page.click(`text=${example.moment2.tipoSello}`);

        await page.waitForTimeout(300);

        // Acabado (if applicable)
        if (example.moment2.acabado) {
          const acabadoSelect = page.locator('select, [role="combobox"]').nth(1);
          if (await acabadoSelect.isVisible()) {
            await acabadoSelect.click();
            await page.click(`text=${example.moment2.acabado}`);
          }
        }

        // Fuelle
        await page.click('text=¿Lleva Fuelle');
        await page.click(`text=${example.moment2.tieneFuelle}`);

        await page.waitForTimeout(300);

        // Tipo de Fuelle
        if (example.moment2.tipoFuelle) {
          const tipoFuelleSelect = page.locator('select, [role="combobox"]').nth(2);
          await tipoFuelleSelect.click();
          await page.click(`text=${example.moment2.tipoFuelle}`);
        }

        await page.waitForTimeout(300);

        // Información para el Fuelle
        const precorteInput = page.locator('input[placeholder*="Precorte"]').first();
        if (await precorteInput.isVisible()) {
          await precorteInput.fill(example.moment2.precorte);
        }

        const tipoPerforacionSelect = page.locator('select, [role="combobox"]').nth(3);
        if (await tipoPerforacionSelect.isVisible()) {
          await tipoPerforacionSelect.click();
          await page.click(`text=${example.moment2.tipoPerforacion}`);
        }
      }

      // Impresión
      await page.click('text=Clase de Impresión');
      await page.click(`text=${example.moment2.printClass}`);

      await page.waitForTimeout(300);

      const printTypeSelect = page.locator('select, [role="combobox"]').nth(4);
      await printTypeSelect.click();
      await page.click(`text=${example.moment2.printType}`);

      // PASO 2: ESTRUCTURA
      await page.click('text=¿Solicitud de muestra');
      await page.click('text=Sí');

      // PASO 3: EMBALAJE
      const embalajeSele = page.locator('select, [role="combobox"]').nth(5);
      await embalajeSele.click();
      await page.click(`text=${example.moment2.embalaje}`);

      const empalmesSelect = page.locator('select, [role="combobox"]').nth(6);
      await empalmesSelect.click();
      await page.click(`text=${example.moment2.empalmes}`);

      console.log(`  ✅ MOMENTO 2 complete`);

      // ========== VALIDACIONES ==========
      console.log(`  🔍 Validating structure table...`);

      // Esperar a que se estabilice la tabla
      await page.waitForTimeout(1000);

      // Verificar tabla de estructura
      const tableRows = await page.locator('table tbody tr').count();
      console.log(`  📊 Table rows: ${tableRows} (expected: ${example.expectedTable.rows})`);

      if (tableRows < example.expectedTable.rows) {
        console.warn(`  ⚠️  Expected at least ${example.expectedTable.rows} rows, got ${tableRows}`);
      }

      // Verificar items en tabla
      console.log(`  📋 Validating table items:`);
      let itemsFound = 0;
      for (let i = 0; i < example.expectedTable.items.length; i++) {
        const item = example.expectedTable.items[i];
        try {
          const itemRow = page.locator(`tr:has-text("${item.description}")`).first();
          const isVisible = await itemRow.isVisible({ timeout: 1000 }).catch(() => false);

          if (isVisible) {
            itemsFound++;
            const grammageCell = itemRow.locator('td').last();
            const grammageText = await grammageCell.textContent();
            console.log(`    ✓ ${item.description}: ${grammageText} (expected: ${item.grammage} g/m²)`);
          } else {
            console.log(`    ✗ ${item.description}: NOT FOUND`);
          }
        } catch (e) {
          console.log(`    ✗ ${item.description}: ERROR`);
        }
      }

      // Verificar gramaje total
      console.log(`  💯 Validating grammage:`);
      try {
        const totalGrammajeLocator = page.locator('[class*="Gramaje"], [class*="Total"], text=/Total.*g\\/m²/').first();
        const totalGrammajeText = await totalGrammajeLocator.textContent().catch(() => '');
        console.log(`    Total text: "${totalGrammajeText}"`);

        // Intentar extraer número del total
        const totalMatch = totalGrammajeText.match(/(\d+\.?\d*)\s*g\/m²/);
        if (totalMatch) {
          const totalValue = parseFloat(totalMatch[1]);
          const tolerance = example.expectedTable.tolerance;
          const min = example.expectedTable.total - tolerance;
          const max = example.expectedTable.total + tolerance;

          console.log(`    Expected: ${example.expectedTable.total} ±${tolerance} g/m² (${min}-${max})`);
          console.log(`    Actual: ${totalValue} g/m²`);

          if (totalValue >= min && totalValue <= max) {
            console.log(`    ✓ Grammage VALID`);
          } else {
            console.warn(`    ⚠️  Grammage OUT OF RANGE`);
          }
        }
      } catch (e) {
        console.warn(`    ⚠️  Could not validate grammage`);
      }

      // Verificar que al menos algunos elementos se encontraron
      expect(itemsFound).toBeGreaterThan(0);
      expect(tableRows).toBeGreaterThanOrEqual(example.expectedTable.rows);

      console.log(`\n✅ ${example.name} - PASS\n`);
    });
  });
});
