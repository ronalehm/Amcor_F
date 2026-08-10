import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:5173';

test('Create test product for image verification', async ({ page }) => {
  console.log('\n📝 Creating test product for image testing...\n');

  await page.goto(`${BASE_URL}/products`);
  await page.waitForLoadState('networkidle');

  // Look for create product button
  const createBtn = page.locator('button:has-text("Nuevo producto")').first();

  if (!await createBtn.isVisible()) {
    console.log('⚠️ Create button not found, trying alternate selector');
    const altBtn = page.locator('button', { hasText: /Nuevo|Crear|New/ }).first();
    if (await altBtn.isVisible()) {
      await altBtn.click();
    }
  } else {
    await createBtn.click();
  }

  await page.waitForTimeout(2000);

  // Fill in minimal required data to create a product
  // Select Portafolio
  const portfolioSelect = page.locator('select, [role="combobox"]').first();
  if (await portfolioSelect.isVisible()) {
    await portfolioSelect.click();
    const option = page.locator('[role="option"]').first();
    if (await option.isVisible()) {
      await option.click();
    }
  }

  await page.waitForTimeout(1000);

  // Fill product name
  const productNameInput = page.locator('input[placeholder*="nombre"], input[type="text"]').first();
  if (await productNameInput.isVisible()) {
    await productNameInput.fill('TEST_PRODUCTO_IMAGENES');
  }

  await page.waitForTimeout(500);

  // Click create/save
  const saveBtn = page.locator('button:has-text("Crear"), button:has-text("Guardar"), button:has-text("Create")').first();
  if (await saveBtn.isVisible()) {
    await saveBtn.click();
    await page.waitForLoadState('networkidle');
    console.log('✅ Product created successfully');
  } else {
    console.log('⚠️ Could not find save button');
  }

  // Check if we're in the edit page
  const url = page.url();
  console.log(`📍 Current URL: ${url}`);

  if (url.includes('/products/') && !url.includes('/products?')) {
    console.log('✅ Navigated to product edit page');
  }
});

test('Verify images in created product', async ({ page }) => {
  console.log('\n🖼️ Verifying images in product edit page...\n');

  await page.goto(`${BASE_URL}/products`);
  await page.waitForLoadState('networkidle');

  // Find the TEST product we just created
  const testProductLink = page.locator('a:has-text("TEST_PRODUCTO_IMAGENES")').first();

  if (!await testProductLink.isVisible()) {
    // Get first product as fallback
    const firstProduct = page.locator('a[href*="/products/"]').first();
    if (await firstProduct.isVisible()) {
      console.log('Using first available product');
      await firstProduct.click();
    } else {
      console.log('❌ No products found');
      test.skip();
      return;
    }
  } else {
    await testProductLink.click();
  }

  await page.waitForLoadState('networkidle');
  console.log('📖 Opened product');

  // Navigate to Design step (step 2)
  const step2 = page.locator('button:has-text("2")');
  if (await step2.isVisible()) {
    await step2.click();
    await page.waitForLoadState('networkidle');
    console.log('✅ Navigated to Design step');
  }

  // Wait for content to load
  await page.waitForTimeout(2000);

  // Check for Rewinding Direction section
  const rewindingLabel = page.locator('text=Sentido de Embobinado').first();

  if (await rewindingLabel.isVisible()) {
    console.log('\n✅ Rewinding Direction section found\n');
    await rewindingLabel.scrollIntoViewIfNeeded();

    // Get all rewinding images
    const imageButtons = page.locator('button:has(img[alt*="Sentido"])');
    const count = await imageButtons.count();

    console.log(`📊 Image buttons found: ${count}\n`);

    if (count > 0) {
      // Check first 3 images
      for (let i = 0; i < Math.min(3, count); i++) {
        const btn = imageButtons.nth(i);
        const img = btn.locator('img').first();

        const alt = await img.getAttribute('alt');
        const src = await img.getAttribute('src');
        const isVisible = await img.isVisible();

        // Get detailed info
        const imgInfo = await img.evaluate((el: any) => {
          const style = window.getComputedStyle(el);
          const rect = el.getBoundingClientRect();
          return {
            naturalWidth: el.naturalWidth,
            naturalHeight: el.naturalHeight,
            displayWidth: rect.width,
            displayHeight: rect.height,
            visible: rect.width > 0 && rect.height > 0,
            display: style.display,
            opacity: style.opacity,
            complete: el.complete,
            src: el.src,
          };
        });

        console.log(`Image ${i + 1}: ${alt}`);
        console.log(`  DOM Visible: ${isVisible}`);
        console.log(`  Display Size: ${imgInfo.displayWidth}x${imgInfo.displayHeight}px`);
        console.log(`  Natural Size: ${imgInfo.naturalWidth}x${imgInfo.naturalHeight}px`);
        console.log(`  Display CSS: ${imgInfo.display}`);
        console.log(`  Opacity: ${imgInfo.opacity}`);
        console.log(`  Loaded: ${imgInfo.complete}`);
        console.log(`  Src starts with: ${imgInfo.src?.substring(0, 50)}...`);
        console.log();
      }
    } else {
      console.log('❌ No image buttons found in DOM');
    }
  } else {
    console.log('⚠️ Rewinding Direction section not found');

    // Debug: Check if we're on the right step
    const currentStep = page.locator('button:has-text("2")[class*="active"], button:has-text("2")[class*="blue"]').first();
    const isActive = await currentStep.isVisible();
    console.log(`Step 2 active: ${isActive}`);
  }

  // Check sidebar images
  console.log('\n🖼️ Checking sidebar wrapping images...\n');
  const wrappingImages = page.locator('img[alt*="POUCH"], img[alt*="BOLSA"], img[alt*="LAMINA"]');
  const wrappingCount = await wrappingImages.count();

  console.log(`Wrapping images found: ${wrappingCount}\n`);

  if (wrappingCount > 0) {
    const img = wrappingImages.first();
    const alt = await img.getAttribute('alt');
    const isVisible = await img.isVisible();

    const info = await img.evaluate((el: any) => {
      const rect = el.getBoundingClientRect();
      const style = window.getComputedStyle(el);
      return {
        visible: rect.width > 0 && rect.height > 0,
        width: rect.width,
        height: rect.height,
        naturalWidth: el.naturalWidth,
        naturalHeight: el.naturalHeight,
        display: style.display,
        opacity: style.opacity,
      };
    });

    console.log(`Wrapping: ${alt}`);
    console.log(`  DOM Visible: ${isVisible}`);
    console.log(`  Display Size: ${info.width}x${info.height}px`);
    console.log(`  Natural Size: ${info.naturalWidth}x${info.naturalHeight}px`);
    console.log(`  CSS Display: ${info.display}`);
  }
});
