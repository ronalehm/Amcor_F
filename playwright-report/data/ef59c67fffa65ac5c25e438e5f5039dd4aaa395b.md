# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: bolsa-formats.spec.ts >> BOLSA Formats - Automated QA Suite >> TEST 7: WICKET
- Location: tests\e2e\bolsa-formats.spec.ts:104:5

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
  22  |     acabadoBolsa: 'Pestaña',
  23  |     tieneFuelleBolsa: 'Sí',
  24  |     tipoFuelleBolsa: 'Fondo',
  25  |     printClass: 'Huecograbado',
  26  |     expectedFieldsVisible: ['tipoSelloBolsa', 'acabadoBolsa', 'tieneFuelleBolsa', 'tipoFuelleBolsa', 'printType'],
  27  |     expectedFieldsHidden: ['hasCortaAliviador'],
  28  |   },
  29  |   {
  30  |     name: 'TEST 3: SELLO LATERAL\\PESTAÑA\\SIN FUELLE FONDO',
  31  |     tipoPresentacionBolsa: 'Bolsa sellada',
  32  |     tipoSelloBolsa: 'Sello lateral',
  33  |     acabadoBolsa: 'Pestaña',
  34  |     tieneFuelleBolsa: 'No',
  35  |     tipoFuelleBolsa: '',
  36  |     printClass: 'Sin impresión',
  37  |     expectedFieldsVisible: ['tipoSelloBolsa', 'acabadoBolsa', 'tieneFuelleBolsa'],
  38  |     expectedFieldsHidden: ['tipoFuelleBolsa', 'printType'],
  39  |   },
  40  |   {
  41  |     name: 'TEST 4: SELLO LATERAL\\CORTE\\SIN FUELLE FONDO',
  42  |     tipoPresentacionBolsa: 'Bolsa sellada',
  43  |     tipoSelloBolsa: 'Sello lateral',
  44  |     acabadoBolsa: 'Corte',
  45  |     tieneFuelleBolsa: 'No',
  46  |     tipoFuelleBolsa: '',
  47  |     printClass: 'Flexo',
  48  |     expectedFieldsVisible: ['tipoSelloBolsa', 'acabadoBolsa', 'tieneFuelleBolsa'],
  49  |     expectedFieldsHidden: ['tipoFuelleBolsa'],
  50  |   },
  51  |   {
  52  |     name: 'TEST 5: SELLO DE FONDO\\CON FUELLE LATERAL',
  53  |     tipoPresentacionBolsa: 'Bolsa sellada',
  54  |     tipoSelloBolsa: 'Sello de fondo',
  55  |     acabadoBolsa: '',
  56  |     tieneFuelleBolsa: 'Sí',
  57  |     tipoFuelleBolsa: 'Lateral',
  58  |     printClass: 'Flexo',
  59  |     expectedFieldsVisible: ['tipoSelloBolsa', 'tieneFuelleBolsa', 'tipoFuelleBolsa'],
  60  |     expectedFieldsHidden: ['acabadoBolsa'],
  61  |   },
  62  |   {
  63  |     name: 'TEST 6: SELLO DE FONDO\\SIN FUELLE LATERAL',
  64  |     tipoPresentacionBolsa: 'Bolsa sellada',
  65  |     tipoSelloBolsa: 'Sello de fondo',
  66  |     acabadoBolsa: '',
  67  |     tieneFuelleBolsa: 'No',
  68  |     tipoFuelleBolsa: '',
  69  |     printClass: 'Sin impresión',
  70  |     expectedFieldsVisible: ['tipoSelloBolsa', 'tieneFuelleBolsa'],
  71  |     expectedFieldsHidden: ['acabadoBolsa', 'tipoFuelleBolsa'],
  72  |   },
  73  |   {
  74  |     name: 'TEST 7: WICKET',
  75  |     tipoPresentacionBolsa: 'Wicket',
  76  |     tipoSelloBolsa: '',
  77  |     acabadoBolsa: '',
  78  |     tieneFuelleBolsa: '',
  79  |     tipoFuelleBolsa: '',
  80  |     printClass: 'Flexo',
  81  |     expectedFieldsVisible: ['anchoSolapa', 'hasWicket', 'hasWicketControl'],
  82  |     expectedFieldsHidden: ['tipoSelloBolsa', 'acabadoBolsa', 'tieneFuelleBolsa'],
  83  |   },
  84  |   {
  85  |     name: 'TEST 8: HOJAS',
  86  |     tipoPresentacionBolsa: 'Hojas',
  87  |     tipoSelloBolsa: '',
  88  |     acabadoBolsa: '',
  89  |     tieneFuelleBolsa: '',
  90  |     tipoFuelleBolsa: '',
  91  |     printClass: 'Sin impresión',
  92  |     expectedFieldsVisible: ['tipoPresentacionBolsa'],
  93  |     expectedFieldsHidden: ['tipoSelloBolsa', 'acabadoBolsa', 'tieneFuelleBolsa', 'anchoSolapa'],
  94  |   },
  95  | ];
  96  | 
  97  | test.describe('BOLSA Formats - Automated QA Suite', () => {
  98  |   test.beforeEach(async ({ page }) => {
  99  |     // Login or navigate to product creation
  100 |     await page.goto(`${BASE_URL}/products`);
  101 |   });
  102 | 
  103 |   BOLSA_TEST_CASES.forEach((testCase, index) => {
  104 |     test(`${testCase.name}`, async ({ page }) => {
  105 |       // Navigate to create new product
  106 |       await page.goto(`${BASE_URL}/products`);
  107 | 
  108 |       // Wait for page to load
  109 |       await page.waitForSelector('button', { timeout: 5000 }).catch(() => null);
  110 | 
  111 |       // Click "Crear Nuevo Producto" or similar button
  112 |       const createButton = await page.locator('text=Crear Nuevo Producto, Crear producto, Nueva ficha').first();
  113 |       if (await createButton.isVisible()) {
  114 |         await createButton.click();
  115 |       }
  116 | 
  117 |       // ====== PASO 0: INFORMACIÓN DEL PRODUCTO ======
  118 |       await page.waitForSelector('input[placeholder*="Nombre"]', { timeout: 5000 }).catch(() => null);
  119 | 
  120 |       const productName = `BOLSA TEST ${index + 1} - ${testCase.name.split(':')[1] || 'Test'}`;
  121 | 
> 122 |       await page.fill('input[placeholder*="Nombre"], input[placeholder*="nombre"]', productName);
      |                  ^ Error: page.fill: Test timeout of 30000ms exceeded.
  123 |       await page.fill('input[placeholder*="Volumen"], input[placeholder*="Cantidad"]', String(500 + index * 100));
  124 | 
  125 |       // Select Unit
  126 |       const unitSelect = await page.locator('select, [role="combobox"]').nth(1);
  127 |       if (await unitSelect.isVisible()) {
  128 |         await unitSelect.click();
  129 |         await page.click('text=KGS, text=kg');
  130 |       }
  131 | 
  132 |       // Fill description
  133 |       await page.fill('textarea', `Prueba QA para formato BOLSA ${index + 1}`);
  134 | 
  135 |       // Select classification
  136 |       await page.click('text=Clasificación');
  137 |       await page.click('text=Producto Nuevo');
  138 | 
  139 |       // ====== PASO 1: DISEÑO - CONFIGURACIÓN DE FORMATO ======
  140 | 
  141 |       // Select Tipo Presentación
  142 |       await page.click('text=Tipo de presentación');
  143 |       await page.click(`text=${testCase.tipoPresentacionBolsa}`);
  144 | 
  145 |       // Wait for conditional fields
  146 |       await page.waitForTimeout(500);
  147 | 
  148 |       // If Bolsa sellada, select Tipo Sello
  149 |       if (testCase.tipoSelloBolsa) {
  150 |         const tipoSelloLocator = page.locator('text=Tipo de Sello').first();
  151 |         if (await tipoSelloLocator.isVisible()) {
  152 |           await tipoSelloLocator.click();
  153 |           await page.click(`text=${testCase.tipoSelloBolsa}`);
  154 |         }
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
```