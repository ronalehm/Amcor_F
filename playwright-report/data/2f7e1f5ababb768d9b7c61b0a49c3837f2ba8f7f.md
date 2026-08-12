# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: bolsa-formats.spec.ts >> BOLSA Formats - Automated QA Suite >> TEST 10: Verificación de cálculo de adhesivos
- Location: tests\e2e\bolsa-formats.spec.ts:297:3

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: page.fill: Test timeout of 30000ms exceeded.
Call log:
  - waiting for locator('input[placeholder*="Nombre"]')

```

# Page snapshot

```yaml
- generic [ref=f1e2]:
  - generic [ref=f1e4]:
    - generic [ref=f1e5]:
      - heading "Restablecer contraseña" [level=2] [ref=f1e6]
      - paragraph [ref=f1e7]: Ingresa tu correo corporativo para enviarte las instrucciones de restablecimiento.
    - generic [ref=f1e8]:
      - generic [ref=f1e9]:
        - generic [ref=f1e10]: Correo corporativo *
        - textbox "usuario@amcor.com" [active] [ref=f1e11]
      - button "Enviar instrucciones" [ref=f1e12] [cursor=pointer]
    - button "Volver al inicio de sesión" [ref=f1e13] [cursor=pointer]
  - generic [ref=f1e14]:
    - generic [ref=f1e17]:
      - generic [ref=f1e18]: A
      - heading "ODISEO Portal" [level=1] [ref=f1e20]
      - paragraph [ref=f1e21]: Plataforma centralizada para la gestión de oportunidades comerciales, tracking de proyectos y aprobación técnica.
    - generic [ref=f1e23]:
      - generic [ref=f1e24]:
        - heading "Bienvenido de nuevo" [level=2] [ref=f1e25]
        - paragraph [ref=f1e26]: Inicia sesión con tu cuenta corporativa para continuar.
      - generic [ref=f1e27]:
        - generic [ref=f1e28]:
          - generic [ref=f1e29]:
            - generic [ref=f1e30]: Correo Electrónico
            - textbox "usuario@amcor.com" [ref=f1e31]
          - generic [ref=f1e32]:
            - generic [ref=f1e33]: Contraseña
            - textbox "••••••••" [ref=f1e34]
        - button "¿Olvidaste tu contraseña?" [ref=f1e36] [cursor=pointer]
        - button "Ingresar al Portal" [ref=f1e37] [cursor=pointer]
      - generic [ref=f1e38]:
        - heading "Cuentas de Acceso Rápido (Demo)" [level=3] [ref=f1e39]
        - generic [ref=f1e40]:
          - button "admin@amcor.com" [ref=f1e41] [cursor=pointer]
          - button "comercial@amcor.com" [ref=f1e46] [cursor=pointer]
          - button "customerservice@amcor.com" [ref=f1e51] [cursor=pointer]
          - button "masterdata@amcor.com" [ref=f1e56] [cursor=pointer]
```

# Test source

```ts
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
  255 |     await page.fill('input[placeholder*="Nombre"], input[placeholder*="nombre"]', 'BOLSA TEST 9 - Dynamic Change');
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
> 306 |     await page.fill('input[placeholder*="Nombre"]', 'BOLSA TEST 10 - Adhesivo');
      |                ^ Error: page.fill: Test timeout of 30000ms exceeded.
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