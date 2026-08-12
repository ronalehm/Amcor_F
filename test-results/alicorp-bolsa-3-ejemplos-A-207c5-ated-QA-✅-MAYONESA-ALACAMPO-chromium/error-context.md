# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: alicorp-bolsa-3-ejemplos.spec.ts >> Alicorp BOLSA 3 Ejemplos - Automated QA >> ✅ MAYONESA ALACAMPO
- Location: tests\e2e\alicorp-bolsa-3-ejemplos.spec.ts:137:5

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
  62  |       printClass: 'Huecograbado',
  63  |       printType: 'Repetitivo',
  64  |       aplicacionTecnica: 'ADEREZOS Y SALSAS',
  65  |       embalaje: 'Bobina plana',
  66  |       empalmes: 'Soldado',
  67  |     },
  68  |     expectedTable: {
  69  |       rows: 6,
  70  |       total: 65.5,
  71  |       tolerance: 6.55,
  72  |       items: [
  73  |         { description: 'BOPP CRISTAL', grammage: 18 },
  74  |         { description: 'Tinta', grammage: 2.5 },
  75  |         { description: 'Adhesivo', grammage: 2.5 },
  76  |         { description: 'PET CRISTAL', grammage: 17 },
  77  |         { description: 'Adhesivo', grammage: 2.5 },
  78  |         { description: 'BOPP CRISTAL', grammage: 22.5 },
  79  |       ],
  80  |     },
  81  |   },
  82  |   {
  83  |     name: 'ACEITE PRIMOR WICKET',
  84  |     moment1: {
  85  |       portfolio: 'ALICORP',
  86  |       productName: 'Aceite Primor 1L Wicket',
  87  |       volume: '1000',
  88  |       description: 'Aceite con sistema Wicket para envasado rápido',
  89  |       structureType: 'Bilaminado',
  90  |       layer1: { material: 'BOPP - BOPP CRISTAL - 20', micron: '20', grammage: '18' },
  91  |       layer2: { material: 'BOPP - BOPP CRISTAL - 25', micron: '25', grammage: '22.5' },
  92  |     },
  93  |     moment2: {
  94  |       tipoPresentacion: 'Wicket',
  95  |       anchoSolapa: '50',
  96  |       hasWickets: 'Sí',
  97  |       wicketDiameter: 'D 14 mm',
  98  |       wicketDistSuperior: '25',
  99  |       wicketDistDerecho: '30',
  100 |       hasWicketControl: 'Sí',
  101 |       wicketControlDiameter: 'D 12 mm',
  102 |       wicketControlUbicacion: 'Superior',
  103 |       wicketControlDistSuperior: '15',
  104 |       wicketControlDistDerecho: '35',
  105 |       hasPrecorteWicket: 'Sí',
  106 |       precorteWicketLargo: '5',
  107 |       precorteWicketUbicacion: 'A los extremos del wicket',
  108 |       precorteWicketDistDerecho: 'Al borde',
  109 |       fuelleAbreFacil: 'Sí',
  110 |       fuellePerforacion: 'OJAL 50x15 mm',
  111 |       printClass: 'Flexo',
  112 |       printType: 'Continuo',
  113 |       aplicacionTecnica: 'ACEITES COMESTIBLES',
  114 |       embalaje: 'Bobina plana',
  115 |       empalmes: 'Encolado',
  116 |     },
  117 |     expectedTable: {
  118 |       rows: 4,
  119 |       total: 45.5,
  120 |       tolerance: 4.55,
  121 |       items: [
  122 |         { description: 'BOPP CRISTAL', grammage: 18 },
  123 |         { description: 'Tinta', grammage: 2.5 },
  124 |         { description: 'Adhesivo', grammage: 2.5 },
  125 |         { description: 'BOPP CRISTAL', grammage: 22.5 },
  126 |       ],
  127 |     },
  128 |   },
  129 | ];
  130 | 
  131 | test.describe('Alicorp BOLSA 3 Ejemplos - Automated QA', () => {
  132 |   test.beforeEach(async ({ page }) => {
  133 |     await page.goto(`${BASE_URL}/products`);
  134 |   });
  135 | 
  136 |   ALICORP_EXAMPLES.forEach((example) => {
  137 |     test(`✅ ${example.name}`, async ({ page }) => {
  138 |       console.log(`\n🚀 Starting: ${example.name}`);
  139 | 
  140 |       // ========== MOMENTO 1: ProductInitialCreateModal ==========
  141 |       console.log(`  📋 MOMENTO 1: Creating product base...`);
  142 | 
  143 |       // Click "Crear Nuevo Producto"
  144 |       await page.locator('button').first().click();
  145 |       await page.waitForTimeout(500);
  146 | 
  147 |       // Pantalla 1: Seleccionar Portafolio
  148 |       const portfolioInput = page.locator('input[placeholder*="Portafolio"], input[placeholder*="portafolio"]').first();
  149 |       if (await portfolioInput.isVisible()) {
  150 |         await portfolioInput.fill(example.moment1.portfolio);
  151 |         await page.waitForTimeout(300);
  152 |         // Select first matching portfolio
  153 |         const portfolioOption = page.locator('text=/ALICORP.*MAYONESA|ALICORP.*ADEREZOS|ALICORP.*ACEITE/').first();
  154 |         if (await portfolioOption.isVisible()) {
  155 |           await portfolioOption.click();
  156 |         }
  157 |       }
  158 | 
  159 |       await page.waitForTimeout(500);
  160 | 
  161 |       // Pantalla 4: Estructura Base
> 162 |       await page.fill('input[placeholder*="Nombre"], input[placeholder*="nombre"]', example.moment1.productName);
      |                  ^ Error: page.fill: Test timeout of 30000ms exceeded.
  163 |       await page.fill('input[placeholder*="Volumen"], input[placeholder*="volumen"]', example.moment1.volume);
  164 |       await page.fill('textarea', example.moment1.description);
  165 | 
  166 |       // Select structure type
  167 |       const structureSelect = page.locator('select, [role="combobox"]').nth(1);
  168 |       if (await structureSelect.isVisible()) {
  169 |         await structureSelect.click();
  170 |         await page.click(`text=${example.moment1.structureType}`);
  171 |       }
  172 | 
  173 |       await page.waitForTimeout(500);
  174 | 
  175 |       // Pantalla 5: Layer 1
  176 |       const layer1Input = page.locator('input[placeholder*="Material"]').first();
  177 |       await layer1Input.fill(example.moment1.layer1.material.split(' - ')[0]);
  178 |       await page.waitForTimeout(200);
  179 |       await page.click(`text=${example.moment1.layer1.material}`);
  180 | 
  181 |       await page.waitForTimeout(300);
  182 | 
  183 |       // Pantalla 6: Layer 2
  184 |       const layer2Input = page.locator('input[placeholder*="Material"]').nth(1);
  185 |       await layer2Input.fill(example.moment1.layer2.material.split(' - ')[0]);
  186 |       await page.waitForTimeout(200);
  187 |       await page.click(`text=${example.moment1.layer2.material}`);
  188 | 
  189 |       // Layer 3 if Trilaminado
  190 |       if (example.moment1.layer3) {
  191 |         await page.waitForTimeout(300);
  192 |         const layer3Input = page.locator('input[placeholder*="Material"]').nth(2);
  193 |         await layer3Input.fill(example.moment1.layer3.material.split(' - ')[0]);
  194 |         await page.waitForTimeout(200);
  195 |         await page.click(`text=${example.moment1.layer3.material}`);
  196 |       }
  197 | 
  198 |       await page.waitForTimeout(500);
  199 | 
  200 |       // Pantalla 8: Confirmar y crear
  201 |       const createButton = page.locator('button:has-text("Crear"), button:has-text("Siguiente")').last();
  202 |       await createButton.click();
  203 | 
  204 |       console.log(`  ✅ MOMENTO 1 complete`);
  205 | 
  206 |       // ========== MOMENTO 2: ProductEditPage ==========
  207 |       console.log(`  📋 MOMENTO 2: Completing full product...`);
  208 | 
  209 |       await page.waitForTimeout(1000);
  210 | 
  211 |       // PASO 0: INFORMACIÓN DEL PRODUCTO
  212 |       await page.fill('input[placeholder*="Aplicación"], input[placeholder*="aplicación"]', example.moment2.aplicacionTecnica);
  213 | 
  214 |       // PASO 1: DISEÑO - CONFIGURACIÓN DE FORMATO
  215 |       if (example.moment2.tipoPresentacion === 'Wicket') {
  216 |         // Wicket-specific configuration
  217 |         await page.click('text=Tipo de presentación');
  218 |         await page.click(`text=${example.moment2.tipoPresentacion}`);
  219 | 
  220 |         await page.waitForTimeout(300);
  221 | 
  222 |         // Ancho de solapa
  223 |         const anchoSolapaInput = page.locator('input[placeholder*="Ancho"]').first();
  224 |         if (await anchoSolapaInput.isVisible()) {
  225 |           await anchoSolapaInput.fill(example.moment2.anchoSolapa);
  226 |         }
  227 | 
  228 |         // Wickets
  229 |         if (example.moment2.hasWickets === 'Sí') {
  230 |           await page.click('text=Wickets');
  231 |           await page.click(`text=${example.moment2.hasWickets}`);
  232 | 
  233 |           await page.waitForTimeout(300);
  234 | 
  235 |           // Fill Wicket fields
  236 |           const wicketDiameterSelect = page.locator('select, [role="combobox"]').nth(0);
  237 |           await wicketDiameterSelect.click();
  238 |           await page.click(`text=${example.moment2.wicketDiameter}`);
  239 | 
  240 |           const wicketDistSuperiorInput = page.locator('input[placeholder*="Distancia"]').nth(0);
  241 |           await wicketDistSuperiorInput.fill(example.moment2.wicketDistSuperior);
  242 | 
  243 |           const wicketDistDerechoInput = page.locator('input[placeholder*="Distancia"]').nth(1);
  244 |           await wicketDistDerechoInput.fill(example.moment2.wicketDistDerecho);
  245 |         }
  246 | 
  247 |         // Wicket de control
  248 |         if (example.moment2.hasWicketControl === 'Sí') {
  249 |           await page.click('text=Wicket de control');
  250 |           await page.click(`text=${example.moment2.hasWicketControl}`);
  251 | 
  252 |           await page.waitForTimeout(300);
  253 | 
  254 |           const wcDiameterSelect = page.locator('select, [role="combobox"]').nth(1);
  255 |           await wcDiameterSelect.click();
  256 |           await page.click(`text=${example.moment2.wicketControlDiameter}`);
  257 | 
  258 |           const wcUbicacionSelect = page.locator('select, [role="combobox"]').nth(2);
  259 |           await wcUbicacionSelect.click();
  260 |           await page.click(`text=${example.moment2.wicketControlUbicacion}`);
  261 | 
  262 |           const wcDistSuperiorInput = page.locator('input[placeholder*="Distancia"]').nth(2);
```