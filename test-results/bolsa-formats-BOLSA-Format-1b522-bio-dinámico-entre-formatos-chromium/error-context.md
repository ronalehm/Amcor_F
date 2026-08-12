# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: bolsa-formats.spec.ts >> BOLSA Formats - Automated QA Suite >> TEST 9: Cambio dinámico entre formatos
- Location: tests\e2e\bolsa-formats.spec.ts:245:3

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: page.fill: Test timeout of 30000ms exceeded.
Call log:
  - waiting for locator('input[placeholder*="Nombre"], input[placeholder*="nombre"]')

```

# Page snapshot

```yaml
- generic [ref=f1e3]:
  - generic [ref=f1e6]:
    - generic [ref=f1e7]: A
    - heading "ODISEO Portal" [level=1] [ref=f1e9]
    - paragraph [ref=f1e10]: Plataforma centralizada para la gestión de oportunidades comerciales, tracking de proyectos y aprobación técnica.
  - generic [ref=f1e12]:
    - generic [ref=f1e13]:
      - heading "Bienvenido de nuevo" [level=2] [ref=f1e14]
      - paragraph [ref=f1e15]: Inicia sesión con tu cuenta corporativa para continuar.
    - generic [ref=f1e16]:
      - generic [ref=f1e17]:
        - generic [ref=f1e18]:
          - generic [ref=f1e19]: Correo Electrónico
          - textbox "usuario@amcor.com" [ref=f1e20]
        - generic [ref=f1e21]:
          - generic [ref=f1e22]: Contraseña
          - textbox "••••••••" [ref=f1e23]
      - button "¿Olvidaste tu contraseña?" [ref=f1e25] [cursor=pointer]
      - button "Ingresar al Portal" [ref=f1e26] [cursor=pointer]
    - generic [ref=f1e27]:
      - heading "Cuentas de Acceso Rápido (Demo)" [level=3] [ref=f1e28]
      - generic [ref=f1e29]:
        - button "admin@amcor.com" [ref=f1e30] [cursor=pointer]
        - button "comercial@amcor.com" [ref=f1e35] [cursor=pointer]
        - button "customerservice@amcor.com" [ref=f1e40] [cursor=pointer]
        - button "masterdata@amcor.com" [ref=f1e45] [cursor=pointer]
```

# Test source

```ts
  155 |       }
  156 | 
  157 |       // If Sello lateral, select Acabado
  158 |       if (testCase.acabadoBolsa && testCase.tipoSelloBolsa === 'Sello lateral') {
  159 |         const acabadoLocator = page.locator('text=Acabado').first();
  160 |         if (await acabadoLocator.isVisible()) {
  161 |           await acabadoLocator.click();
  162 |           await page.click(`text=${testCase.acabadoBolsa}`);
  163 |         }
  164 |       }
  165 | 
  166 |       // If Bolsa sellada, select Fuelle
  167 |       if (testCase.tieneFuelleBolsa) {
  168 |         const fuelleLocator = page.locator('text=¿Lleva Fuelle').first();
  169 |         if (await fuelleLocator.isVisible()) {
  170 |           await fuelleLocator.click();
  171 |           await page.click(`text=${testCase.tieneFuelleBolsa}`);
  172 |         }
  173 |       }
  174 | 
  175 |       // If has Fuelle, select Tipo Fuelle
  176 |       if (testCase.tipoFuelleBolsa && testCase.tieneFuelleBolsa === 'Sí') {
  177 |         const tipoFuelleLocator = page.locator('text=Tipo de Fuelle').first();
  178 |         if (await tipoFuelleLocator.isVisible()) {
  179 |           await tipoFuelleLocator.click();
  180 |           await page.click(`text=${testCase.tipoFuelleBolsa}`);
  181 |         }
  182 |       }
  183 | 
  184 |       // Select Print Class
  185 |       await page.click('text=Impresión, text=Clase de Impresión');
  186 |       await page.click(`text=${testCase.printClass}`);
  187 | 
  188 |       // ====== PASO 2: ESTRUCTURA ======
  189 | 
  190 |       // Select structure type
  191 |       await page.click('text=Tipo de Estructura');
  192 |       await page.click('text=Bilaminado');
  193 | 
  194 |       // Fill in layers (BOPP)
  195 |       await page.click('text=Capa 1');
  196 |       await page.fill('input[placeholder*="Material"], input[placeholder*="BOPP"]', 'BOPP - BOPP CRISTAL - 20');
  197 |       await page.click('text=BOPP CRISTAL - 20');
  198 | 
  199 |       // Add layer 2
  200 |       await page.click('text=Capa 2');
  201 |       await page.fill('input[placeholder*="Material"]', 'PET - PET CRISTAL - 12');
  202 |       await page.click('text=PET CRISTAL - 12');
  203 | 
  204 |       // Select sample request
  205 |       await page.click('text=¿Solicitud de muestra');
  206 |       await page.click('text=Sí');
  207 | 
  208 |       // ====== PASO 3: EMBALAJE ======
  209 | 
  210 |       // Select packaging material
  211 |       await page.click('text=Embalaje de material');
  212 |       await page.click('text=Bobina plana');
  213 | 
  214 |       // Select splices
  215 |       await page.click('text=Empalmes');
  216 |       await page.click('text=Encolado');
  217 | 
  218 |       // ====== VALIDATIONS ======
  219 | 
  220 |       // Check that expected fields are visible
  221 |       for (const fieldLabel of testCase.expectedFieldsVisible) {
  222 |         const fieldLocator = page.locator(`text=${fieldLabel}, label:has-text("${fieldLabel}")`).first();
  223 |         expect(await fieldLocator.isVisible({ timeout: 2000 }).catch(() => false)).toBeTruthy();
  224 |       }
  225 | 
  226 |       // Check that expected fields are hidden
  227 |       for (const fieldLabel of testCase.expectedFieldsHidden) {
  228 |         const fieldLocator = page.locator(`text=${fieldLabel}, label:has-text("${fieldLabel}")`).first();
  229 |         const isVisible = await fieldLocator.isVisible({ timeout: 1000 }).catch(() => false);
  230 |         if (isVisible) {
  231 |           expect(isVisible).toBeFalsy();
  232 |         }
  233 |       }
  234 | 
  235 |       // Verify completion percentage increases
  236 |       const completionPercentage = await page.locator('text=/\\d+%/').first().textContent();
  237 |       const percentage = parseInt(completionPercentage || '0');
  238 |       expect(percentage).toBeGreaterThan(0);
  239 | 
  240 |       console.log(`✅ ${testCase.name} - Completion: ${percentage}%`);
  241 |     });
  242 |   });
  243 | 
  244 |   // Test 9: Dynamic format change
  245 |   test('TEST 9: Cambio dinámico entre formatos', async ({ page }) => {
  246 |     await page.goto(`${BASE_URL}/products`);
  247 | 
  248 |     // Create new product
  249 |     const createButton = await page.locator('button').first();
  250 |     if (await createButton.isVisible()) {
  251 |       await createButton.click();
  252 |     }
  253 | 
  254 |     // Fill basic info
> 255 |     await page.fill('input[placeholder*="Nombre"], input[placeholder*="nombre"]', 'BOLSA TEST 9 - Dynamic Change');
      |                ^ Error: page.fill: Test timeout of 30000ms exceeded.
  256 |     await page.fill('input[placeholder*="Volumen"]', '1000');
  257 | 
  258 |     // Step 1: Sello Lateral
  259 |     await page.click('text=Tipo de presentación');
  260 |     await page.click('text=Bolsa sellada');
  261 |     await page.click('text=Tipo de Sello');
  262 |     await page.click('text=Sello lateral');
  263 | 
  264 |     // Verify Acabado appears
  265 |     let acabadoVisible = await page.locator('text=Acabado').isVisible().catch(() => false);
  266 |     expect(acabadoVisible).toBeTruthy();
  267 | 
  268 |     // Step 2: Change to Sello de Fondo
  269 |     await page.click('text=Tipo de Sello');
  270 |     await page.click('text=Sello de fondo');
  271 | 
  272 |     // Wait and verify Acabado disappears
  273 |     await page.waitForTimeout(300);
  274 |     acabadoVisible = await page.locator('text=Acabado').isVisible().catch(() => false);
  275 |     expect(acabadoVisible).toBeFalsy();
  276 | 
  277 |     // Step 3: Change to Wicket
  278 |     await page.click('text=Tipo de presentación');
  279 |     await page.click('text=Wicket');
  280 | 
  281 |     // Verify Wicket fields appear
  282 |     const wicketFieldsVisible = await page.locator('text=Ancho de solapa, text=Wickets').first().isVisible().catch(() => false);
  283 |     expect(wicketFieldsVisible).toBeTruthy();
  284 | 
  285 |     // Step 4: Change to Hojas
  286 |     await page.click('text=Tipo de presentación');
  287 |     await page.click('text=Hojas');
  288 | 
  289 |     // Verify special Wicket fields disappear
  290 |     const wicketSpecialVisible = await page.locator('text=Ancho de solapa').isVisible().catch(() => false);
  291 |     expect(wicketSpecialVisible).toBeFalsy();
  292 | 
  293 |     console.log('✅ TEST 9: Cambio dinámico entre formatos - PASS');
  294 |   });
  295 | 
  296 |   // Test: Adhesive calculation verification
  297 |   test('TEST 10: Verificación de cálculo de adhesivos', async ({ page }) => {
  298 |     await page.goto(`${BASE_URL}/products`);
  299 | 
  300 |     // Create product with Trilaminado structure
  301 |     const createButton = await page.locator('button').first();
  302 |     if (await createButton.isVisible()) {
  303 |       await createButton.click();
  304 |     }
  305 | 
  306 |     await page.fill('input[placeholder*="Nombre"]', 'BOLSA TEST 10 - Adhesivo');
  307 |     await page.fill('input[placeholder*="Volumen"]', '750');
  308 | 
  309 |     // Setup BOLSA
  310 |     await page.click('text=Tipo de presentación');
  311 |     await page.click('text=Bolsa sellada');
  312 | 
  313 |     // Structure: Trilaminado
  314 |     await page.click('text=Tipo de Estructura');
  315 |     await page.click('text=Trilaminado');
  316 | 
  317 |     // Add layers
  318 |     await page.fill('input[placeholder*="Material"]', 'BOPP - BOPP CRISTAL - 20');
  319 |     await page.click('text=BOPP CRISTAL - 20');
  320 | 
  321 |     await page.fill('input[placeholder*="Material"]', 'PET - PET CRISTAL - 12');
  322 |     await page.click('text=PET CRISTAL - 12');
  323 | 
  324 |     await page.fill('input[placeholder*="Material"]', 'BOPP - BOPP CRISTAL - 25');
  325 |     await page.click('text=BOPP CRISTAL - 25');
  326 | 
  327 |     // Verify adhesive rows in table (should be 2 for Trilaminado)
  328 |     const adhesiveRows = await page.locator('text=Adhesivo').count();
  329 |     expect(adhesiveRows).toBe(2);
  330 | 
  331 |     // Verify each adhesive has 2.5 gramaje
  332 |     const adhesiveGrammages = await page.locator('td:has-text("2.5")').count();
  333 |     expect(adhesiveGrammages).toBeGreaterThanOrEqual(2);
  334 | 
  335 |     console.log('✅ TEST 10: Cálculo de adhesivos - PASS');
  336 |   });
  337 | });
  338 | 
```