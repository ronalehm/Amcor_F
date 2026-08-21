# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: qa-sku-base-approved.spec.ts >> QA: SKU Base y Aprobados en ProductInitialCreateModal >> QA-SKU-02: Producto Nuevo (sin Nueva estructura) - Verificar SKU Base disponibles
- Location: tests\e2e\qa-sku-base-approved.spec.ts:127:3

# Error details

```
Test timeout of 300000ms exceeded.
```

```
Error: locator.click: Test timeout of 300000ms exceeded.
Call log:
  - waiting for locator('input[type=\'checkbox\']').first()

```

# Page snapshot

```yaml
- generic [ref=f1e4]:
  - banner [ref=f1e6]:
    - generic [ref=f1e7]:
      - button "Toggle sidebar" [ref=f1e8] [cursor=pointer]
      - generic [ref=f1e11]: AMCOR
    - textbox "Buscar\\u2026 (Ctrl + K)" [ref=f1e18]
    - generic [ref=f1e19]:
      - button "Notificaciones" [ref=f1e21] [cursor=pointer]:
        - generic [ref=f1e25]: "2"
      - button "Men\\u00fa de usuario" [ref=f1e27] [cursor=pointer]:
        - generic [ref=f1e28]: AS
        - generic [ref=f1e30]:
          - paragraph [ref=f1e31]: Administrador Sistema
          - paragraph [ref=f1e32]: Administrador
  - complementary [ref=f1e36]:
    - navigation [ref=f1e37]:
      - generic [ref=f1e38]:
        - link "Inicio" [ref=f1e39] [cursor=pointer]:
          - /url: /dashboard
        - link "Clientes" [ref=f1e46] [cursor=pointer]:
          - /url: /clients
        - link "Portafolio" [ref=f1e52] [cursor=pointer]:
          - /url: /portfolio
        - link "Productos" [ref=f1e56] [cursor=pointer]:
          - /url: /products
        - link "Usuarios" [ref=f1e62] [cursor=pointer]:
          - /url: /users
        - link "Catálogos" [ref=f1e69] [cursor=pointer]:
          - /url: /catalogs
      - generic [ref=f1e73]:
        - link "Soporte TI" [ref=f1e74] [cursor=pointer]:
          - /url: /soporte
        - link "Configuración" [ref=f1e83] [cursor=pointer]:
          - /url: /configuracion
  - main [ref=f1e88]:
    - generic [ref=f1e90]:
      - navigation [ref=f1e91]:
        - link "Inicio" [ref=f1e92] [cursor=pointer]:
          - /url: /inicio
        - generic [ref=f1e93]: Productos
        - generic [ref=f1e97]: Lista de Productos
      - heading "Gestión de Productos" [level=1] [ref=f1e104]
    - generic [ref=f1e106]:
      - generic [ref=f1e107]:
        - generic [ref=f1e110]:
          - paragraph [ref=f1e111]: Total productos
          - paragraph [ref=f1e112]: "2"
          - paragraph [ref=f1e113]: Registrados en plataforma
        - generic [ref=f1e121]:
          - paragraph [ref=f1e122]: En Preparación
          - paragraph [ref=f1e123]: "1"
          - paragraph [ref=f1e124]: Requieren información
        - generic [ref=f1e132]:
          - paragraph [ref=f1e133]: Completados
          - paragraph [ref=f1e134]: "0"
          - paragraph [ref=f1e135]: Listos para siguiente fase
      - generic [ref=f1e139]:
        - generic [ref=f1e140]:
          - generic [ref=f1e141]:
            - button "Todos los productos2" [ref=f1e142] [cursor=pointer]
            - button "Registrado1" [ref=f1e143] [cursor=pointer]
            - button "En Preparación1" [ref=f1e144] [cursor=pointer]
            - button "Completado0" [ref=f1e145] [cursor=pointer]
          - paragraph [ref=f1e146]: Mostrando 2 de 2 registros
        - generic [ref=f1e148]:
          - textbox "Buscar por código SKU, producto, cliente..." [ref=f1e150]
          - generic [ref=f1e151]:
            - button [ref=f1e152] [cursor=pointer]
            - generic [ref=f1e158]:
              - button "Nuevo" [active] [ref=f1e159] [cursor=pointer]
              - generic [ref=f1e163]:
                - generic [ref=f1e164]:
                  - paragraph [ref=f1e165]: Crear nuevo
                  - paragraph [ref=f1e166]: Selecciona qué deseas iniciar.
                - generic [ref=f1e167]:
                  - button "Nueva solicitud Registrar un nuevo producto preliminar." [ref=f1e168] [cursor=pointer]:
                    - generic [ref=f1e172]:
                      - generic [ref=f1e173]: Nueva solicitud
                      - generic [ref=f1e174]: Registrar un nuevo producto preliminar.
                  - button "Importar Productos Carga masiva de productos desde plantilla." [ref=f1e175] [cursor=pointer]:
                    - generic [ref=f1e180]:
                      - generic [ref=f1e181]: Importar Productos
                      - generic [ref=f1e182]: Carga masiva de productos desde plantilla.
      - generic [ref=f1e183]:
        - table [ref=f1e185]:
          - rowgroup [ref=f1e186]:
            - row [ref=f1e187]:
              - columnheader [ref=f1e188]:
                - button "Código SKU" [ref=f1e189] [cursor=pointer]
              - columnheader [ref=f1e194]:
                - button "Producto" [ref=f1e195] [cursor=pointer]
              - columnheader [ref=f1e200]:
                - button "Clasificación" [ref=f1e201] [cursor=pointer]
              - columnheader [ref=f1e206]:
                - button "Cliente" [ref=f1e207] [cursor=pointer]
              - columnheader "Planta de origen" [ref=f1e212]
              - columnheader "Envoltura" [ref=f1e213]
              - columnheader [ref=f1e214]:
                - button "Estado ODISEO" [ref=f1e215] [cursor=pointer]
              - columnheader [ref=f1e220]:
                - button "Responsable" [ref=f1e221] [cursor=pointer]
              - columnheader [ref=f1e226]:
                - button "Fecha de creación" [ref=f1e227] [cursor=pointer]
              - columnheader [ref=f1e231]:
                - button "Días desde creación" [ref=f1e232] [cursor=pointer]
              - columnheader "Acciones" [ref=f1e236]
          - rowgroup [ref=f1e237]:
            - row [ref=f1e238]:
              - cell "SKU-00002-A-01" [ref=f1e239]
              - cell "Doypack Mayonesa 1KG 1000 KG" [ref=f1e240]:
                - generic "Doypack Mayonesa 1KG 1000 KG" [ref=f1e242]
              - cell "Nuevo" [ref=f1e243]
              - cell "Alicorp S.A.A." [ref=f1e245]
              - cell "AF Lima" [ref=f1e246]
              - cell "POUCH" [ref=f1e247]
              - cell "Dado de alta" [ref=f1e248]
              - cell "Comercial" [ref=f1e250]
              - cell "01/02/2026" [ref=f1e252]
              - cell "200 días" [ref=f1e253]
              - cell [ref=f1e254]:
                - generic [ref=f1e255]:
                  - button "Ver producto" [ref=f1e256] [cursor=pointer]
                  - button "Editar producto" [ref=f1e260] [cursor=pointer]
                  - button "Copiar producto" [ref=f1e264] [cursor=pointer]
            - row [ref=f1e268]:
              - cell "SKU-00001-E-01" [ref=f1e269]
              - cell "Doypack Mayonesa 250 ml 500 KG" [ref=f1e270]:
                - generic "Doypack Mayonesa 250 ml 500 KG" [ref=f1e272]
              - cell "Nuevo" [ref=f1e273]
              - cell "Alicorp S.A.A." [ref=f1e275]
              - cell "AF Lima" [ref=f1e276]
              - cell "POUCH" [ref=f1e277]
              - cell "Dado de alta" [ref=f1e278]
              - cell "Comercial" [ref=f1e280]
              - cell "14/01/2026" [ref=f1e282]
              - cell "218 días" [ref=f1e283]
              - cell [ref=f1e284]:
                - generic [ref=f1e285]:
                  - button "Ver producto" [ref=f1e286] [cursor=pointer]
                  - button "Editar producto" [ref=f1e290] [cursor=pointer]
                  - button "Copiar producto" [ref=f1e294] [cursor=pointer]
        - generic [ref=f1e299]:
          - paragraph [ref=f1e300]: Mostrando 1 a 2 de 2 registros
          - generic [ref=f1e301]:
            - combobox [ref=f1e302]:
              - option "10 por página"
              - option "25 por página" [selected]
              - option "50 por página"
              - option "100 por página"
            - button "Anterior" [disabled] [ref=f1e303]
            - generic [ref=f1e304]: Página 1 de 1
            - button "Siguiente" [disabled] [ref=f1e305]
```

# Test source

```ts
  42  |     await checkbox.click();
  43  |     console.log("✓ Declaración marcada");
  44  | 
  45  |     // Esperar a que cargue completamente
  46  |     await page.waitForTimeout(1000);
  47  | 
  48  |     // Seleccionar Cliente (Alicorp)
  49  |     const clientSearch = await page.locator("input").nth(1);
  50  |     await clientSearch.click();
  51  |     await page.waitForTimeout(500);
  52  |     const clientOption = await page.getByText("Alicorp").first();
  53  |     await clientOption.click();
  54  |     console.log("✓ Cliente seleccionado");
  55  | 
  56  |     // Seleccionar Portafolio
  57  |     const portfolioSearch = await page.locator("input[placeholder*='Portafolio']");
  58  |     await portfolioSearch.click();
  59  |     await page.waitForTimeout(500);
  60  |     const portfolioOption = await page.locator("text=/Carnes importadas|PO-00001/").first();
  61  |     await portfolioOption.click();
  62  |     console.log("✓ Portafolio seleccionado");
  63  | 
  64  |     // Seleccionar Clasificación = "Producto Modificado"
  65  |     const classificationSelect = await page.locator("select").first();
  66  |     await classificationSelect.click();
  67  |     await page.waitForTimeout(300);
  68  |     const modifiedOption = await page.getByText("Producto Modificado");
  69  |     await modifiedOption.click();
  70  |     console.log("✓ Clasificación = Producto Modificado");
  71  | 
  72  |     // Seleccionar una Modificación válida
  73  |     const modifCheckboxes = await page.locator("input[type='checkbox']").all();
  74  |     if (modifCheckboxes.length > 1) {
  75  |       await modifCheckboxes[1].click(); // Segundo checkbox (primera modificación)
  76  |       console.log("✓ Modificación seleccionada");
  77  |     }
  78  | 
  79  |     await page.waitForTimeout(1000);
  80  | 
  81  |     // AHORA buscar en el campo SKU Actual
  82  |     const skuActualSearch = await page.locator("input[placeholder*='Buscar producto']").last();
  83  |     console.log("✓ Campo SKU Actual encontrado");
  84  | 
  85  |     // Buscar primero producto aprobado nuevo: SKU-00020-A
  86  |     await skuActualSearch.click();
  87  |     await page.waitForTimeout(300);
  88  |     await skuActualSearch.fill("SKU-00020");
  89  |     await page.waitForTimeout(1000);
  90  | 
  91  |     console.log("🔍 Buscando SKU-00020-A (Producto Aprobado nuevo)...");
  92  | 
  93  |     // Verificar que aparezca en los resultados
  94  |     const searchResult = await page.locator("text=/SKU-00020|Mayonesa Light/").first().isVisible({ timeout: 5000 }).catch(() => false);
  95  | 
  96  |     if (searchResult) {
  97  |       console.log("✅ SKU-00020-A (Mayonesa Light) encontrado en búsqueda");
  98  | 
  99  |       // Click en el resultado
  100 |       const result = await page.locator("text=/SKU-00020|Mayonesa Light/").first();
  101 |       await result.click();
  102 |       await page.waitForTimeout(500);
  103 | 
  104 |       console.log("✓ SKU-00020-A seleccionado");
  105 |     } else {
  106 |       console.log("⚠️ SKU-00020-A NO encontrado en búsqueda");
  107 |     }
  108 | 
  109 |     // Búsqueda adicional: SKU-00021-A (Salsa BBQ)
  110 |     await page.waitForTimeout(500);
  111 |     await skuActualSearch.clear();
  112 |     await skuActualSearch.fill("SKU-00021");
  113 |     await page.waitForTimeout(1000);
  114 | 
  115 |     console.log("🔍 Buscando SKU-00021-A (Salsa BBQ)...");
  116 |     const bbqFound = await page.locator("text=/SKU-00021|Salsa BBQ/").first().isVisible({ timeout: 5000 }).catch(() => false);
  117 | 
  118 |     if (bbqFound) {
  119 |       console.log("✅ SKU-00021-A (Salsa BBQ) encontrado en búsqueda");
  120 |     } else {
  121 |       console.log("⚠️ SKU-00021-A NO encontrado en búsqueda");
  122 |     }
  123 | 
  124 |     console.log("\n✅ QA-SKU-01 Completado");
  125 |   });
  126 | 
  127 |   test("QA-SKU-02: Producto Nuevo (sin Nueva estructura) - Verificar SKU Base disponibles", async ({ page }) => {
  128 |     console.log("\n═══════════════════════════════════════════");
  129 |     console.log("QA-SKU-02: Producto Nuevo - SKU Base");
  130 |     console.log("═══════════════════════════════════════════\n");
  131 | 
  132 |     await loginAndNavigate(page);
  133 | 
  134 |     // Abrir modal "Nueva solicitud"
  135 |     const nuevoBtn = await page.getByText(/Nuevo/i).first();
  136 |     await nuevoBtn.click({ timeout: 10000 });
  137 |     await page.waitForTimeout(1500);
  138 |     console.log("✓ Modal de Nueva solicitud abierto");
  139 | 
  140 |     // Marcar declaración
  141 |     const checkbox = await page.locator("input[type='checkbox']").first();
> 142 |     await checkbox.click();
      |                    ^ Error: locator.click: Test timeout of 300000ms exceeded.
  143 |     console.log("✓ Declaración marcada");
  144 | 
  145 |     await page.waitForTimeout(1000);
  146 | 
  147 |     // Seleccionar Cliente
  148 |     const clientSearch = await page.locator("input").nth(1);
  149 |     await clientSearch.click();
  150 |     await page.waitForTimeout(500);
  151 |     const clientOption = await page.getByText("Alicorp").first();
  152 |     await clientOption.click();
  153 |     console.log("✓ Cliente seleccionado");
  154 | 
  155 |     // Seleccionar Portafolio
  156 |     const portfolioSearch = await page.locator("input[placeholder*='Portafolio']");
  157 |     await portfolioSearch.click();
  158 |     await page.waitForTimeout(500);
  159 |     const portfolioOption = await page.locator("text=/Carnes importadas|PO-00001/").first();
  160 |     await portfolioOption.click();
  161 |     console.log("✓ Portafolio seleccionado");
  162 | 
  163 |     // Seleccionar Clasificación = "Producto Nuevo"
  164 |     const classificationSelect = await page.locator("select").first();
  165 |     await classificationSelect.click();
  166 |     await page.waitForTimeout(300);
  167 |     const newOption = await page.getByText("Producto Nuevo");
  168 |     await newOption.click();
  169 |     console.log("✓ Clasificación = Producto Nuevo");
  170 | 
  171 |     // Seleccionar una Modificación que NO sea "Nueva estructura"
  172 |     const checkboxes = await page.locator("input[type='checkbox']").all();
  173 |     if (checkboxes.length > 1) {
  174 |       // Encontrar la segunda modificación (no Nueva estructura)
  175 |       await checkboxes[1].click();
  176 |       console.log("✓ Modificación seleccionada (no Nueva estructura)");
  177 |     }
  178 | 
  179 |     await page.waitForTimeout(1000);
  180 | 
  181 |     // AHORA buscar en el campo SKU Base / Referencia técnica
  182 |     const skuBaseSearch = await page.locator("input[placeholder*='Buscar producto']").last();
  183 |     console.log("✓ Campo SKU Base encontrado");
  184 | 
  185 |     // Buscar primer producto base nuevo: SKU-00008-B
  186 |     await skuBaseSearch.click();
  187 |     await page.waitForTimeout(300);
  188 |     await skuBaseSearch.fill("SKU-00008");
  189 |     await page.waitForTimeout(1000);
  190 | 
  191 |     console.log("🔍 Buscando SKU-00008-B (Salsa de Soja Base nuevo)...");
  192 | 
  193 |     const baseResult = await page.locator("text=/SKU-00008|Salsa de Soja/").first().isVisible({ timeout: 5000 }).catch(() => false);
  194 | 
  195 |     if (baseResult) {
  196 |       console.log("✅ SKU-00008-B (Salsa de Soja) encontrado en búsqueda");
  197 | 
  198 |       const result = await page.locator("text=/SKU-00008|Salsa de Soja/").first();
  199 |       await result.click();
  200 |       await page.waitForTimeout(500);
  201 | 
  202 |       console.log("✓ SKU-00008-B seleccionado");
  203 |     } else {
  204 |       console.log("⚠️ SKU-00008-B NO encontrado en búsqueda");
  205 |     }
  206 | 
  207 |     // Búsqueda adicional: SKU-00009-B (Ketchup Base)
  208 |     await page.waitForTimeout(500);
  209 |     await skuBaseSearch.clear();
  210 |     await skuBaseSearch.fill("SKU-00009");
  211 |     await page.waitForTimeout(1000);
  212 | 
  213 |     console.log("🔍 Buscando SKU-00009-B (Ketchup Base)...");
  214 |     const ketchupFound = await page.locator("text=/SKU-00009|Ketchup/").first().isVisible({ timeout: 5000 }).catch(() => false);
  215 | 
  216 |     if (ketchupFound) {
  217 |       console.log("✅ SKU-00009-B (Ketchup Base) encontrado en búsqueda");
  218 |     } else {
  219 |       console.log("⚠️ SKU-00009-B NO encontrado en búsqueda");
  220 |     }
  221 | 
  222 |     console.log("\n✅ QA-SKU-02 Completado");
  223 |   });
  224 | });
  225 | 
```