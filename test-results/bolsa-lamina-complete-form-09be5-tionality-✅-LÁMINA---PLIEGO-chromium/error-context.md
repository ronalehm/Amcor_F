# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: bolsa-lamina-complete-formats.spec.ts >> LÁMINA - All Formats Functionality >> ✅ LÁMINA - PLIEGO
- Location: tests\e2e\bolsa-lamina-complete-formats.spec.ts:153:5

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.fill: Test timeout of 30000ms exceeded.
Call log:
  - waiting for locator('input[placeholder*="Nombre"], input[placeholder*="nombre"]').first()

```

# Page snapshot

```yaml
- generic [ref=e2]:
  - generic [ref=e4]:
    - generic [ref=e5]:
      - heading "Restablecer contraseña" [level=2] [ref=e6]
      - paragraph [ref=e7]: Ingresa tu correo corporativo para enviarte las instrucciones de restablecimiento.
    - generic [ref=e8]:
      - generic [ref=e9]:
        - generic [ref=e10]: Correo corporativo *
        - textbox "usuario@amcor.com" [active] [ref=e11]
      - button "Enviar instrucciones" [ref=e12] [cursor=pointer]
    - button "Volver al inicio de sesión" [ref=e13] [cursor=pointer]
  - generic [ref=e14]:
    - generic [ref=e17]:
      - generic [ref=e18]: A
      - heading "ODISEO Portal" [level=1] [ref=e20]
      - paragraph [ref=e21]: Plataforma centralizada para la gestión de oportunidades comerciales, tracking de proyectos y aprobación técnica.
    - generic [ref=e23]:
      - generic [ref=e24]:
        - heading "Bienvenido de nuevo" [level=2] [ref=e25]
        - paragraph [ref=e26]: Inicia sesión con tu cuenta corporativa para continuar.
      - generic [ref=e27]:
        - generic [ref=e28]:
          - generic [ref=e29]:
            - generic [ref=e30]: Correo Electrónico
            - textbox "usuario@amcor.com" [ref=e31]
          - generic [ref=e32]:
            - generic [ref=e33]: Contraseña
            - textbox "••••••••" [ref=e34]
        - button "¿Olvidaste tu contraseña?" [ref=e36] [cursor=pointer]
        - button "Ingresar al Portal" [ref=e37] [cursor=pointer]
      - generic [ref=e38]:
        - heading "Cuentas de Acceso Rápido (Demo)" [level=3] [ref=e39]
        - generic [ref=e40]:
          - button "admin@amcor.com" [ref=e41] [cursor=pointer]
          - button "comercial@amcor.com" [ref=e46] [cursor=pointer]
          - button "customerservice@amcor.com" [ref=e51] [cursor=pointer]
          - button "masterdata@amcor.com" [ref=e56] [cursor=pointer]
```

# Test source

```ts
  62  |     name: 'PLIEGO',
  63  |     code: 'pliego',
  64  |     fields: {
  65  |       tipoFormato: 'Pliego',
  66  |       ancho: '600',
  67  |       largo: '800',
  68  |     },
  69  |     expectedFields: ['Tipo de Formato Lámina', 'Ancho', 'Largo'],
  70  |   },
  71  | ];
  72  | 
  73  | // Test BOLSA Formats
  74  | test.describe('BOLSA - All Formats Functionality', () => {
  75  |   test.beforeEach(async ({ page }) => {
  76  |     await page.goto(`${BASE_URL}/products`);
  77  |   });
  78  | 
  79  |   BOLSA_FORMATS.forEach((format) => {
  80  |     test(`✅ BOLSA - ${format.name}`, async ({ page }) => {
  81  |       console.log(`\n🧪 Testing BOLSA Format: ${format.name}`);
  82  | 
  83  |       // Create product
  84  |       await page.locator('button').first().click();
  85  |       await page.waitForTimeout(500);
  86  | 
  87  |       // Basic info
  88  |       const nameInput = page.locator('input[placeholder*="Nombre"], input[placeholder*="nombre"]').first();
  89  |       await nameInput.fill(`Test ${format.name}`);
  90  | 
  91  |       const volumeInput = page.locator('input[placeholder*="Volumen"], input[placeholder*="volumen"]').first();
  92  |       await volumeInput.fill('500');
  93  | 
  94  |       const descInput = page.locator('textarea').first();
  95  |       await descInput.fill(`Test ${format.name} format`);
  96  | 
  97  |       // Select BOLSA
  98  |       const envoltura = page.locator('select, [role="combobox"]').nth(0);
  99  |       await envoltura.click();
  100 |       await page.click('text=BOLSA');
  101 | 
  102 |       // Select structure type
  103 |       const structure = page.locator('select, [role="combobox"]').nth(1);
  104 |       await structure.click();
  105 |       await page.click('text=Bilaminado');
  106 | 
  107 |       // Select layers
  108 |       const layer1 = page.locator('input[placeholder*="Material"]').first();
  109 |       await layer1.fill('BOPP');
  110 |       await page.waitForTimeout(200);
  111 |       await page.click('text=BOPP').first();
  112 | 
  113 |       const layer2 = page.locator('input[placeholder*="Material"]').nth(1);
  114 |       await layer2.fill('PET');
  115 |       await page.waitForTimeout(200);
  116 |       await page.click('text=PET').first();
  117 | 
  118 |       // Create product
  119 |       const createBtn = page.locator('button:has-text("Crear"), button:has-text("Siguiente")').last();
  120 |       await createBtn.click();
  121 | 
  122 |       await page.waitForTimeout(1000);
  123 | 
  124 |       // Verify expected fields are visible
  125 |       console.log(`  📋 Checking expected fields for ${format.name}`);
  126 |       for (const expectedField of format.expectedFields) {
  127 |         const fieldExists = await page.locator(`text=${expectedField}`).isVisible({ timeout: 2000 }).catch(() => false);
  128 |         console.log(`    ${fieldExists ? '✓' : '✗'} ${expectedField}`);
  129 |         expect(fieldExists).toBe(true);
  130 |       }
  131 | 
  132 |       // Verify fields that should NOT appear
  133 |       if (format.shouldNotAppear) {
  134 |         console.log(`  🚫 Checking fields that should NOT appear`);
  135 |         for (const shouldNotField of format.shouldNotAppear) {
  136 |           const fieldDoesntExist = !(await page.locator(`text=${shouldNotField}`).isVisible({ timeout: 1000 }).catch(() => false));
  137 |           console.log(`    ${fieldDoesntExist ? '✓' : '✗'} ${shouldNotField} not visible`);
  138 |         }
  139 |       }
  140 | 
  141 |       console.log(`  ✅ ${format.name} - PASS`);
  142 |     });
  143 |   });
  144 | });
  145 | 
  146 | // Test LÁMINA Formats
  147 | test.describe('LÁMINA - All Formats Functionality', () => {
  148 |   test.beforeEach(async ({ page }) => {
  149 |     await page.goto(`${BASE_URL}/products`);
  150 |   });
  151 | 
  152 |   LAMINA_FORMATS.forEach((format) => {
  153 |     test(`✅ LÁMINA - ${format.name}`, async ({ page }) => {
  154 |       console.log(`\n🧪 Testing LÁMINA Format: ${format.name}`);
  155 | 
  156 |       // Create product
  157 |       await page.locator('button').first().click();
  158 |       await page.waitForTimeout(500);
  159 | 
  160 |       // Basic info
  161 |       const nameInput = page.locator('input[placeholder*="Nombre"], input[placeholder*="nombre"]').first();
> 162 |       await nameInput.fill(`Test Lámina ${format.name}`);
      |                       ^ Error: locator.fill: Test timeout of 30000ms exceeded.
  163 | 
  164 |       const volumeInput = page.locator('input[placeholder*="Volumen"], input[placeholder*="volumen"]').first();
  165 |       await volumeInput.fill('1000');
  166 | 
  167 |       const descInput = page.locator('textarea').first();
  168 |       await descInput.fill(`Test Lámina ${format.name} format`);
  169 | 
  170 |       // Select LÁMINA
  171 |       const envoltura = page.locator('select, [role="combobox"]').nth(0);
  172 |       await envoltura.click();
  173 |       await page.click('text=LÁMINA');
  174 | 
  175 |       // Select structure type
  176 |       const structure = page.locator('select, [role="combobox"]').nth(1);
  177 |       await structure.click();
  178 |       await page.click('text=Bilaminado');
  179 | 
  180 |       // Select layers
  181 |       const layer1 = page.locator('input[placeholder*="Material"]').first();
  182 |       await layer1.fill('BOPP');
  183 |       await page.waitForTimeout(200);
  184 |       await page.click('text=BOPP').first();
  185 | 
  186 |       const layer2 = page.locator('input[placeholder*="Material"]').nth(1);
  187 |       await layer2.fill('PET');
  188 |       await page.waitForTimeout(200);
  189 |       await page.click('text=PET').first();
  190 | 
  191 |       // Create product
  192 |       const createBtn = page.locator('button:has-text("Crear"), button:has-text("Siguiente")').last();
  193 |       await createBtn.click();
  194 | 
  195 |       await page.waitForTimeout(1000);
  196 | 
  197 |       // Verify expected fields are visible
  198 |       console.log(`  📋 Checking expected fields for Lámina ${format.name}`);
  199 |       for (const expectedField of format.expectedFields) {
  200 |         const fieldExists = await page.locator(`text=${expectedField}`).isVisible({ timeout: 2000 }).catch(() => false);
  201 |         console.log(`    ${fieldExists ? '✓' : '✗'} ${expectedField}`);
  202 |         expect(fieldExists).toBe(true);
  203 |       }
  204 | 
  205 |       console.log(`  ✅ Lámina ${format.name} - PASS`);
  206 |     });
  207 |   });
  208 | });
  209 | 
  210 | // Field Consistency Tests
  211 | test.describe('Field Naming Consistency - BOLSA vs LÁMINA', () => {
  212 |   test('Verify "Tipo de" prefix is consistent', async ({ page }) => {
  213 |     console.log('\n🔍 Checking "Tipo de" consistency');
  214 | 
  215 |     await page.goto(`${BASE_URL}/products`);
  216 | 
  217 |     // Create BOLSA product
  218 |     await page.locator('button').first().click();
  219 |     await page.waitForTimeout(500);
  220 | 
  221 |     const nameInput = page.locator('input[placeholder*="Nombre"], input[placeholder*="nombre"]').first();
  222 |     await nameInput.fill('Test Tipo de');
  223 | 
  224 |     // Check all "Tipo de" labels appear consistently
  225 |     const tipoDeFields = await page.locator('text=/Tipo de [A-Z]').count();
  226 |     console.log(`  Found ${tipoDeFields} fields starting with "Tipo de"`);
  227 | 
  228 |     expect(tipoDeFields).toBeGreaterThan(0);
  229 |   });
  230 | 
  231 |   test('Verify no "Dist." abbreviations exist', async ({ page }) => {
  232 |     console.log('\n🔍 Checking for abbreviations');
  233 | 
  234 |     await page.goto(`${BASE_URL}/products`);
  235 | 
  236 |     // Create product to navigate to fields
  237 |     await page.locator('button').first().click();
  238 |     await page.waitForTimeout(500);
  239 | 
  240 |     // Try to find any "Dist." labels (should be 0)
  241 |     const distLabels = await page.locator('text=/Dist\./').count();
  242 |     console.log(`  Found ${distLabels} labels with "Dist." abbreviation`);
  243 | 
  244 |     expect(distLabels).toBe(0);
  245 |   });
  246 | 
  247 |   test('Verify "¿Tiene Fuelle?" is used consistently', async ({ page }) => {
  248 |     console.log('\n🔍 Checking "¿Tiene Fuelle?" consistency');
  249 | 
  250 |     await page.goto(`${BASE_URL}/products`);
  251 | 
  252 |     // Navigate to page with fuelle fields
  253 |     await page.locator('button').first().click();
  254 |     await page.waitForTimeout(500);
  255 | 
  256 |     const fuelleFields = await page.locator('text=¿Tiene Fuelle?').count();
  257 |     console.log(`  Found ${fuelleFields} instances of "¿Tiene Fuelle?"`);
  258 | 
  259 |     // Should find it (or at least 0 of the old versions)
  260 |     const oldFuelleLabels = await page.locator('text=/¿Lleva Fuelle|¿Tendrá Fuelle/').count();
  261 |     console.log(`  Found ${oldFuelleLabels} instances of old fuelle labels`);
  262 | 
```