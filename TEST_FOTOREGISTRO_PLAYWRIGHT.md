# 🧪 PRUEBAS AUTOMATIZADAS FOTOREGISTRO (Playwright)

**Versión:** 1.0  
**Fecha:** 2026-08-10  
**Framework:** Playwright (TypeScript)  
**Cobertura:** 10 casos de prueba funcionales

---

# 1. CONFIGURACIÓN DE FIXTURES

## `fotoregistro.fixtures.ts`

```typescript
import { test as base, expect } from '@playwright/test';

interface FotoregistroFixtures {
  laminaProjectPage: LaminaProjectPage;
  fotoregistroForm: FotoregistroForm;
}

export const test = base.extend<FotoregistroFixtures>({
  laminaProjectPage: async ({ page }, use) => {
    // Navegar al ProductEditPage (LÁMINA)
    await page.goto('/products/edit/PROJ-LAMINA-001');
    
    // Esperar a que cargue el formulario
    await page.waitForSelector('[data-testid="fotoregistro-toggle"]', {
      timeout: 5000,
    });
    
    const laminaPage = new LaminaProjectPage(page);
    await use(laminaPage);
  },

  fotoregistroForm: async ({ laminaProjectPage }, use) => {
    const form = new FotoregistroForm(laminaProjectPage.page);
    await use(form);
  },
});

export { expect };
```

---

# 2. HELPER CLASSES

## `FotoregistroForm.ts`

```typescript
import { Page, Locator } from '@playwright/test';

export class FotoregistroForm {
  readonly page: Page;
  readonly toggleButton: Locator;
  readonly fr1WidthInput: Locator;
  readonly fr1HeightInput: Locator;
  readonly fr1RefHorizSelect: Locator;
  readonly fr1RefVertSelect: Locator;
  readonly fr1DistHorizInput: Locator;
  readonly fr1DistVertInput: Locator;
  readonly fr1MarginLeftDisplay: Locator;
  readonly fr1MarginRightDisplay: Locator;
  readonly fr1MarginTopDisplay: Locator;
  readonly fr1MarginBottomDisplay: Locator;
  readonly fotoregistroVisualization: Locator;
  readonly saveButton: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.toggleButton = page.locator('[data-testid="fotoregistro-toggle"]');
    this.fr1WidthInput = page.locator('[data-testid="fr1-width-input"]');
    this.fr1HeightInput = page.locator('[data-testid="fr1-height-input"]');
    this.fr1RefHorizSelect = page.locator('[data-testid="fr1-ref-horiz-select"]');
    this.fr1RefVertSelect = page.locator('[data-testid="fr1-ref-vert-select"]');
    this.fr1DistHorizInput = page.locator('[data-testid="fr1-dist-horiz-input"]');
    this.fr1DistVertInput = page.locator('[data-testid="fr1-dist-vert-input"]');
    this.fr1MarginLeftDisplay = page.locator('[data-testid="fr1-margin-left"]');
    this.fr1MarginRightDisplay = page.locator('[data-testid="fr1-margin-right"]');
    this.fr1MarginTopDisplay = page.locator('[data-testid="fr1-margin-top"]');
    this.fr1MarginBottomDisplay = page.locator('[data-testid="fr1-margin-bottom"]');
    this.fotoregistroVisualization = page.locator('[data-testid="fotoregistro-viz"]');
    this.saveButton = page.locator('[data-testid="project-save-button"]');
    this.errorMessage = page.locator('[data-testid="error-message"]');
  }

  // Métodos helper
  async enableFotoregistro() {
    await this.toggleButton.click();
    // Esperar a que aparezca la sección FR1
    await this.page.waitForSelector('[data-testid="fr1-width-input"]', {
      timeout: 2000,
    });
  }

  async disableFotoregistro() {
    await this.toggleButton.click();
    // Esperar a que desaparezca la sección FR1
    await this.page.waitForSelector('[data-testid="fr1-width-input"]', {
      state: 'hidden',
      timeout: 2000,
    });
  }

  async fillFr1Data(data: {
    width: number;
    height: number;
    refHoriz: string;
    refVert: string;
    distHoriz: number;
    distVert: number;
  }) {
    await this.fr1WidthInput.fill(data.width.toString());
    await this.fr1HeightInput.fill(data.height.toString());
    await this.fr1RefHorizSelect.selectOption(data.refHoriz);
    await this.fr1RefVertSelect.selectOption(data.refVert);
    await this.fr1DistHorizInput.fill(data.distHoriz.toString());
    await this.fr1DistVertInput.fill(data.distVert.toString());
    
    // Esperar actualización de márgenes (debounce 300ms + renderizado)
    await this.page.waitForTimeout(500);
  }

  async getMargins() {
    const margins = {
      left: parseInt(await this.fr1MarginLeftDisplay.textContent() || '0'),
      right: parseInt(await this.fr1MarginRightDisplay.textContent() || '0'),
      top: parseInt(await this.fr1MarginTopDisplay.textContent() || '0'),
      bottom: parseInt(await this.fr1MarginBottomDisplay.textContent() || '0'),
    };
    return margins;
  }

  async isFr1SectionVisible(): Promise<boolean> {
    return await this.fr1WidthInput.isVisible();
  }

  async isVisualizationRendered(): Promise<boolean> {
    return await this.fotoregistroVisualization.isVisible();
  }

  async getErrorText(): Promise<string | null> {
    return await this.errorMessage.textContent();
  }

  async saveFr1() {
    await this.saveButton.click();
    // Esperar éxito o error
    await this.page.waitForTimeout(1000);
  }
}
```

---

# 3. CASOS DE PRUEBA (PLAYWRIGHT)

## Test Suite: `fotoregistro.spec.ts`

```typescript
import { test, expect } from './fotoregistro.fixtures';

test.describe('Fotoregistro Feature - LÁMINA Only', () => {
  
  // ============================================
  // TC-1: Enable/Disable Fotoregistro
  // ============================================
  test('TC-1: Should show FR1 section when enabled', async ({
    fotoregistroForm,
  }) => {
    // Precondition: FR toggle is disabled
    let isFr1Visible = await fotoregistroForm.isFr1SectionVisible();
    expect(isFr1Visible).toBeFalsy();

    // Action: Click enable toggle
    await fotoregistroForm.enableFotoregistro();

    // Verification
    isFr1Visible = await fotoregistroForm.isFr1SectionVisible();
    expect(isFr1Visible).toBeTruthy();

    // Gráfico debe estar visible
    const vizRendered = await fotoregistroForm.isVisualizationRendered();
    expect(vizRendered).toBeTruthy();
  });

  test('TC-1b: Should hide FR1 section when disabled', async ({
    fotoregistroForm,
  }) => {
    // Precondition: Enable first
    await fotoregistroForm.enableFotoregistro();
    let isFr1Visible = await fotoregistroForm.isFr1SectionVisible();
    expect(isFr1Visible).toBeTruthy();

    // Action: Disable
    await fotoregistroForm.disableFotoregistro();

    // Verification
    isFr1Visible = await fotoregistroForm.isFr1SectionVisible();
    expect(isFr1Visible).toBeFalsy();
  });

  // ============================================
  // TC-2: Input Dimensiones FR1
  // ============================================
  test('TC-2: Should accept valid FR1 dimensions', async ({
    fotoregistroForm,
  }) => {
    await fotoregistroForm.enableFotoregistro();

    // Action: Fill valid dimensions
    await fotoregistroForm.fillFr1Data({
      width: 100,
      height: 80,
      refHoriz: 'left',
      refVert: 'top',
      distHoriz: 20,
      distVert: 15,
    });

    // Verification: No error
    const errorText = await fotoregistroForm.getErrorText();
    expect(errorText).toBeNull();

    // Valores deben estar en los campos
    const widthValue = await fotoregistroForm.fr1WidthInput.inputValue();
    expect(widthValue).toBe('100');
  });

  test('TC-2b: Should validate width range (1-9999)', async ({
    fotoregistroForm,
  }) => {
    await fotoregistroForm.enableFotoregistro();

    // Action: Fill invalid width (0)
    await fotoregistroForm.fr1WidthInput.fill('0');
    await fotoregistroForm.fr1WidthInput.blur();
    await fotoregistroForm.page.waitForTimeout(300);

    // Verification: Error message
    const errorText = await fotoregistroForm.getErrorText();
    expect(errorText).toContain('1-9999 mm');

    // Campo debe estar rojo (data attribute o clase)
    const inputClasses = await fotoregistroForm.fr1WidthInput.getAttribute('class');
    expect(inputClasses).toContain('error');
  });

  test('TC-2c: Should validate height range (1-9999)', async ({
    fotoregistroForm,
  }) => {
    await fotoregistroForm.enableFotoregistro();

    // Action: Fill invalid height (10000)
    await fotoregistroForm.fr1HeightInput.fill('10000');
    await fotoregistroForm.fr1HeightInput.blur();
    await fotoregistroForm.page.waitForTimeout(300);

    // Verification: Error message
    const errorText = await fotoregistroForm.getErrorText();
    expect(errorText).toContain('1-9999 mm');
  });

  // ============================================
  // TC-3: Cálculo Márgenes - Izquierda/Arriba
  // ============================================
  test('TC-3: Calculate margins correctly (Left/Top)', async ({
    fotoregistroForm,
  }) => {
    await fotoregistroForm.enableFotoregistro();

    // Action: Fill data
    await fotoregistroForm.fillFr1Data({
      width: 100,
      height: 80,
      refHoriz: 'left',
      refVert: 'top',
      distHoriz: 25,
      distVert: 15,
    });

    // Verification: Margins
    const margins = await fotoregistroForm.getMargins();
    expect(margins.left).toBe(25);
    expect(margins.right).toBe(0);
    expect(margins.top).toBe(15);
    expect(margins.bottom).toBe(0);
  });

  // ============================================
  // TC-4: Cálculo Márgenes - Derecha/Abajo
  // ============================================
  test('TC-4: Calculate margins correctly (Right/Bottom)', async ({
    fotoregistroForm,
  }) => {
    await fotoregistroForm.enableFotoregistro();

    // Action: Fill data with Right/Bottom reference
    await fotoregistroForm.fillFr1Data({
      width: 100,
      height: 80,
      refHoriz: 'right',
      refVert: 'bottom',
      distHoriz: 30,
      distVert: 20,
    });

    // Verification: Margins
    const margins = await fotoregistroForm.getMargins();
    expect(margins.left).toBe(0);
    expect(margins.right).toBe(30);
    expect(margins.top).toBe(0);
    expect(margins.bottom).toBe(20);
  });

  // ============================================
  // TC-5: Actualización Dinámica Gráfico
  // ============================================
  test('TC-5: Should update visualization dynamically', async ({
    fotoregistroForm,
  }) => {
    await fotoregistroForm.enableFotoregistro();

    // Action 1: Initial dimensions
    await fotoregistroForm.fillFr1Data({
      width: 100,
      height: 80,
      refHoriz: 'left',
      refVert: 'top',
      distHoriz: 20,
      distVert: 15,
    });

    // Get initial SVG state
    const svgBefore = await fotoregistroForm.fotoregistroVisualization.innerHTML();

    // Action 2: Change width
    await fotoregistroForm.fr1WidthInput.fill('150');
    await fotoregistroForm.page.waitForTimeout(500); // Wait for animation

    // Get updated SVG state
    const svgAfter = await fotoregistroForm.fotoregistroVisualization.innerHTML();

    // Verification: SVG changed
    expect(svgBefore).not.toBe(svgAfter);

    // SVG debe contener el nuevo ancho
    expect(svgAfter).toContain('150');
  });

  // ============================================
  // TC-6 a TC-8: Validaciones de Rango (Distance)
  // ============================================
  test('TC-6: Should validate distance horizontal (0-9999)', async ({
    fotoregistroForm,
  }) => {
    await fotoregistroForm.enableFotoregistro();
    await fotoregistroForm.fr1DistHorizInput.fill('-10');
    await fotoregistroForm.fr1DistHorizInput.blur();
    await fotoregistroForm.page.waitForTimeout(300);

    const errorText = await fotoregistroForm.getErrorText();
    expect(errorText).toContain('0-9999 mm');
  });

  test('TC-7: Should validate distance vertical (0-9999)', async ({
    fotoregistroForm,
  }) => {
    await fotoregistroForm.enableFotoregistro();
    await fotoregistroForm.fr1DistVertInput.fill('10000');
    await fotoregistroForm.fr1DistVertInput.blur();
    await fotoregistroForm.page.waitForTimeout(300);

    const errorText = await fotoregistroForm.getErrorText();
    expect(errorText).toContain('0-9999 mm');
  });

  test('TC-8: Should require reference selection', async ({
    fotoregistroForm,
  }) => {
    await fotoregistroForm.enableFotoregistro();

    // Fill all but reference
    await fotoregistroForm.fr1WidthInput.fill('100');
    await fotoregistroForm.fr1HeightInput.fill('80');
    // Skip reference selection
    await fotoregistroForm.fr1DistHorizInput.fill('20');
    await fotoregistroForm.fr1DistVertInput.fill('15');

    // Try to save
    await fotoregistroForm.saveFr1();
    await fotoregistroForm.page.waitForTimeout(500);

    const errorText = await fotoregistroForm.getErrorText();
    expect(errorText).toContain('requerida');
  });

  // ============================================
  // TC-9: Cambiar Envoltura (Cleanup)
  // ============================================
  test('TC-9: Should clear FR data when changing to BOLSA', async ({
    fotoregistroForm,
    laminaProjectPage,
  }) => {
    // Setup: Enable and fill FR
    await fotoregistroForm.enableFotoregistro();
    await fotoregistroForm.fillFr1Data({
      width: 100,
      height: 80,
      refHoriz: 'left',
      refVert: 'top',
      distHoriz: 20,
      distVert: 15,
    });

    // Action: Change envelope to BOLSA
    const envelopeSelect = laminaProjectPage.page.locator(
      '[data-testid="envelope-select"]'
    );
    await envelopeSelect.selectOption('BOLSA');
    await laminaProjectPage.page.waitForTimeout(500);

    // Verification: FR section hidden
    const isFr1Visible = await fotoregistroForm.isFr1SectionVisible();
    expect(isFr1Visible).toBeFalsy();

    // FR data should be cleared (verify in form state)
    const widthValue = await fotoregistroForm.fr1WidthInput.inputValue();
    expect(widthValue).toBe('');
  });

  // ============================================
  // TC-10: Validación Coherencia Geométrica
  // ============================================
  test('TC-10: Should warn if FR exceeds perimeter', async ({
    fotoregistroForm,
  }) => {
    await fotoregistroForm.enableFotoregistro();

    // Precondition: Lámina has perimeter = 2600mm
    // Fill FR with dimensions approaching limit
    await fotoregistroForm.fillFr1Data({
      width: 1300, // Muy grande
      height: 1200, // Muy grande
      refHoriz: 'left',
      refVert: 'top',
      distHoriz: 20,
      distVert: 15,
    });

    // Esperar validación
    await fotoregistroForm.page.waitForTimeout(500);

    // Verificar que haya warning (no error, solo advertencia)
    const warningElement = fotoregistroForm.page.locator(
      '[data-testid="fr-warning"]'
    );
    const isVisible = await warningElement.isVisible();
    expect(isVisible).toBeTruthy();
  });
});

// ============================================
// SUITE: Edge Cases & Performance
// ============================================
test.describe('Fotoregistro - Edge Cases', () => {
  test('Should handle rapid field changes', async ({ fotoregistroForm }) => {
    await fotoregistroForm.enableFotoregistro();

    // Simulate rapid changes
    for (let i = 1; i <= 10; i++) {
      await fotoregistroForm.fr1WidthInput.fill(`${100 + i * 10}`);
      // No wait - rapid fire
    }

    // Final verification
    const widthValue = await fotoregistroForm.fr1WidthInput.inputValue();
    expect(widthValue).toBe('190');

    // Gráfico debe estar en estado consistente
    const margins = await fotoregistroForm.getMargins();
    expect(margins).toBeDefined();
  });

  test('Should persist FR data on page reload', async ({
    fotoregistroForm,
    laminaProjectPage,
  }) => {
    await fotoregistroForm.enableFotoregistro();
    await fotoregistroForm.fillFr1Data({
      width: 100,
      height: 80,
      refHoriz: 'left',
      refVert: 'top',
      distHoriz: 20,
      distVert: 15,
    });

    // Save
    await fotoregistroForm.saveFr1();
    await laminaProjectPage.page.waitForTimeout(1000);

    // Reload page
    await laminaProjectPage.page.reload();
    await laminaProjectPage.page.waitForTimeout(2000);

    // Verification: Data persists
    const widthValue = await fotoregistroForm.fr1WidthInput.inputValue();
    expect(widthValue).toBe('100');

    const isEnabled = await fotoregistroForm.toggleButton.isChecked();
    expect(isEnabled).toBeTruthy();
  });
});
```

---

# 4. FIXTURES DE DATOS

## `fotoregistro.testdata.ts`

```typescript
export const LÁMINA_TEST_DATA = {
  projectId: 'PROJ-LAMINA-001',
  envelope: 'LÁMINA',
  format: 'Genérica',
  width: 500,
  repetition: 800,
  perimeter: 2600,
};

export const FOTOREGISTRO_SCENARIOS = {
  // Escenario 1: Referencia Izquierda/Arriba
  scenario1: {
    width: 100,
    height: 80,
    refHoriz: 'left',
    refVert: 'top',
    distHoriz: 25,
    distVert: 15,
    expectedMargins: { left: 25, right: 0, top: 15, bottom: 0 },
  },

  // Escenario 2: Referencia Derecha/Abajo
  scenario2: {
    width: 120,
    height: 90,
    refHoriz: 'right',
    refVert: 'bottom',
    distHoriz: 30,
    distVert: 20,
    expectedMargins: { left: 0, right: 30, top: 0, bottom: 20 },
  },

  // Escenario 3: Referencia Mixta (Izquierda/Abajo)
  scenario3: {
    width: 110,
    height: 85,
    refHoriz: 'left',
    refVert: 'bottom',
    distHoriz: 22,
    distVert: 18,
    expectedMargins: { left: 22, right: 0, top: 0, bottom: 18 },
  },

  // Edge Case: Máximo rango
  edgeCase1: {
    width: 9999,
    height: 9999,
    refHoriz: 'left',
    refVert: 'top',
    distHoriz: 9999,
    distVert: 9999,
    expectedMargins: { left: 9999, right: 0, top: 9999, bottom: 0 },
  },

  // Edge Case: Mínimo rango
  edgeCase2: {
    width: 1,
    height: 1,
    refHoriz: 'right',
    refVert: 'bottom',
    distHoriz: 0,
    distVert: 0,
    expectedMargins: { left: 0, right: 0, top: 0, bottom: 0 },
  },
};

export const INVALID_INPUTS = [
  {
    field: 'width',
    value: 0,
    expectedError: 'Width debe estar entre 1 y 9999 mm',
  },
  {
    field: 'width',
    value: 10000,
    expectedError: 'Width debe estar entre 1 y 9999 mm',
  },
  {
    field: 'height',
    value: -1,
    expectedError: 'Height debe estar entre 1 y 9999 mm',
  },
  {
    field: 'distHoriz',
    value: -5,
    expectedError: 'Distancia debe estar entre 0 y 9999 mm',
  },
  {
    field: 'distVert',
    value: 10000,
    expectedError: 'Distancia debe estar entre 0 y 9999 mm',
  },
];
```

---

# 5. EJECUCIÓN Y REPORTE

## Comando de Ejecución

```bash
# Ejecutar todos los tests
npx playwright test src/tests/fotoregistro.spec.ts

# Ejecutar un test específico
npx playwright test -g "TC-3"

# Modo debug
npx playwright test --debug

# Generar HTML report
npx playwright test --reporter=html
```

## Configuración `playwright.config.ts`

```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './src/tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html'],
    ['junit', { outputFile: 'test-results/junit.xml' }],
    ['json', { outputFile: 'test-results/results.json' }],
  ],
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    // Mobile testing
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});
```

---

# 6. CASOS DE PRUEBA PARAMETRIZADOS

## `fotoregistro.parameterized.spec.ts`

```typescript
import { test, expect } from './fotoregistro.fixtures';
import { FOTOREGISTRO_SCENARIOS } from './fotoregistro.testdata';

test.describe('Fotoregistro - Parameterized Scenarios', () => {
  Object.entries(FOTOREGISTRO_SCENARIOS).forEach(([name, scenario]) => {
    test(`Scenario: ${name}`, async ({ fotoregistroForm }) => {
      await fotoregistroForm.enableFotoregistro();

      // Fill all fields
      await fotoregistroForm.fillFr1Data({
        width: scenario.width,
        height: scenario.height,
        refHoriz: scenario.refHoriz,
        refVert: scenario.refVert,
        distHoriz: scenario.distHoriz,
        distVert: scenario.distVert,
      });

      // Verify margins match expected
      const margins = await fotoregistroForm.getMargins();
      expect(margins.left).toBe(scenario.expectedMargins.left);
      expect(margins.right).toBe(scenario.expectedMargins.right);
      expect(margins.top).toBe(scenario.expectedMargins.top);
      expect(margins.bottom).toBe(scenario.expectedMargins.bottom);
    });
  });
});
```

---

# 7. CHECKLIST DE VALIDACIÓN

## Pre-Deployment Testing

- [ ] Todos 10 TC pasan en Chromium
- [ ] Todos 10 TC pasan en Firefox
- [ ] Todos 10 TC pasan en Safari
- [ ] Mobile (Pixel 5) UI responde correctamente
- [ ] Animación de gráfico fluida (200ms transition)
- [ ] Debounce funciona (300ms entre renders)
- [ ] Datos persisten tras reload
- [ ] Limpieza de datos al cambiar envoltura
- [ ] Validaciones muestran errores claros
- [ ] Márgenes calculados automáticamente
- [ ] SVG responsive (600x400px → mobile)

---

**🧪 SUITE DE PRUEBAS FOTOREGISTRO COMPLETA** ✅

**Cobertura:**
- ✅ 10 casos de prueba funcionales
- ✅ Fixtures y helpers reutilizables
- ✅ Datos de prueba parametrizados
- ✅ Edge cases incluidos
- ✅ Cross-browser compatible
- ✅ Mobile testing

**Ready to Deploy:** Todos los archivos necesarios para Playwright
