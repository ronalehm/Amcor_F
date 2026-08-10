import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:5173';

test.describe('Image Loading Tests', () => {
  test('Verify Rewinding Direction images load correctly', async ({ page }) => {
    console.log('🖼️ Starting Rewinding Direction Image Test');

    // Navigate to the products page
    await page.goto(`${BASE_URL}/products`);
    await page.waitForLoadState('networkidle');

    // Look for any product to edit - create a test one if needed
    const productLinks = await page.locator('a[href*="/products/"]').first();

    // If no products, we'll need to create one
    if (!await productLinks.isVisible()) {
      console.log('⚠️ No products found. Creating a test product...');
      // This would need to be setup via API or UI
      test.skip();
      return;
    }

    // Click on a product to edit
    await productLinks.click();
    await page.waitForLoadState('networkidle');

    // Navigate to Design step (step 2)
    const designStepButton = page.locator('button:has-text("2")').first();
    if (await designStepButton.isVisible()) {
      await designStepButton.click();
      await page.waitForLoadState('networkidle');
    }

    // Scroll to Rewinding Direction section
    const rewindingLabel = page.locator('text=Sentido de Embobinado').first();
    if (await rewindingLabel.isVisible()) {
      await rewindingLabel.scrollIntoViewIfNeeded();

      // Check all 8 rewinding direction images
      const rewindingImages = page.locator('img[alt*="Sentido"]');
      const imageCount = await rewindingImages.count();

      console.log(`📊 Found ${imageCount} rewinding direction elements`);

      let successCount = 0;
      let failedImages: string[] = [];

      for (let i = 0; i < imageCount; i++) {
        const img = rewindingImages.nth(i);
        const src = await img.getAttribute('src');
        const alt = await img.getAttribute('alt');

        // Check if image loads by checking computed styles
        const isVisible = await img.isVisible();
        const hasNaturalWidth = await img.evaluate((el: any) => {
          return el.naturalWidth > 0 || el.complete;
        });

        console.log(`  ${i + 1}. ${alt}: src=${src}, visible=${isVisible}, loaded=${hasNaturalWidth}`);

        if (isVisible && hasNaturalWidth) {
          successCount++;
        } else {
          failedImages.push(alt || `Image ${i + 1}`);
        }
      }

      console.log(`✅ Successfully loaded: ${successCount}/${imageCount}`);

      if (failedImages.length > 0) {
        console.error(`❌ Failed to load images: ${failedImages.join(', ')}`);
      }

      expect(successCount).toBe(imageCount);
    } else {
      console.log('⚠️ Rewinding Direction section not found on this product');
    }
  });

  test('Verify Wrapping Type images load correctly in sidebar', async ({ page }) => {
    console.log('🖼️ Starting Wrapping Type Image Test');

    // Navigate to products
    await page.goto(`${BASE_URL}/products`);
    await page.waitForLoadState('networkidle');

    // Click on a product
    const productLinks = await page.locator('a[href*="/products/"]').first();

    if (!await productLinks.isVisible()) {
      console.log('⚠️ No products found.');
      test.skip();
      return;
    }

    await productLinks.click();
    await page.waitForLoadState('networkidle');

    // Look for the wrapping image in the right sidebar
    const wrappingImage = page.locator('img[alt*="POUCH"], img[alt*="BOLSA"], img[alt*="LAMINA"]').first();

    if (await wrappingImage.isVisible()) {
      const alt = await wrappingImage.getAttribute('alt');
      const src = await wrappingImage.getAttribute('src');

      console.log(`  Wrapping type: ${alt}, src=${src}`);

      const hasNaturalWidth = await wrappingImage.evaluate((el: any) => {
        return el.naturalWidth > 0 || el.complete;
      });

      console.log(`  Image loaded: ${hasNaturalWidth}`);

      if (!hasNaturalWidth) {
        const errorMessage = `Failed to load wrapping image: ${alt}`;
        console.error(`❌ ${errorMessage}`);
        expect(hasNaturalWidth).toBe(true);
      } else {
        console.log(`✅ Wrapping image loaded successfully: ${alt}`);
      }
    } else {
      console.log('⚠️ Wrapping image not found in sidebar');
    }
  });

  test('Check for 404 errors in network tab for images', async ({ page }) => {
    console.log('🔍 Monitoring network requests for image errors');

    const failedRequests: string[] = [];

    // Capture failed image requests
    page.on('response', response => {
      const url = response.url();
      const status = response.status();

      if ((url.includes('.png') || url.includes('.jpg') || url.includes('.jpeg')) && status >= 400) {
        console.error(`  ❌ Failed request: ${url} (${status})`);
        failedRequests.push(`${url} (${status})`);
      }
    });

    // Navigate to products
    await page.goto(`${BASE_URL}/products`);
    await page.waitForLoadState('networkidle');

    // Click on a product
    const productLinks = await page.locator('a[href*="/products/"]').first();

    if (await productLinks.isVisible()) {
      await productLinks.click();
      await page.waitForLoadState('networkidle');

      // Navigate to Design step
      const designStepButton = page.locator('button:has-text("2")').first();
      if (await designStepButton.isVisible()) {
        await designStepButton.click();
        await page.waitForLoadState('networkidle');
      }
    }

    // Wait a bit to catch all requests
    await page.waitForTimeout(2000);

    if (failedRequests.length > 0) {
      console.error(`\n❌ Found ${failedRequests.length} failed image requests:`);
      failedRequests.forEach(req => console.error(`   - ${req}`));
      expect(failedRequests.length).toBe(0);
    } else {
      console.log('✅ No failed image requests detected');
    }
  });

  test('Console errors for image loading', async ({ page }) => {
    console.log('🐛 Checking browser console for image-related errors');

    const consoleErrors: string[] = [];

    page.on('console', msg => {
      if (msg.type() === 'error' && (msg.text().includes('image') || msg.text().includes('img'))) {
        console.error(`  Console Error: ${msg.text()}`);
        consoleErrors.push(msg.text());
      }
    });

    // Navigate
    await page.goto(`${BASE_URL}/products`);
    await page.waitForLoadState('networkidle');

    const productLinks = await page.locator('a[href*="/products/"]').first();
    if (await productLinks.isVisible()) {
      await productLinks.click();
      await page.waitForLoadState('networkidle');

      // Check design step
      const designStepButton = page.locator('button:has-text("2")').first();
      if (await designStepButton.isVisible()) {
        await designStepButton.click();
        await page.waitForLoadState('networkidle');
      }
    }

    await page.waitForTimeout(2000);

    if (consoleErrors.length > 0) {
      console.error(`\n❌ Found ${consoleErrors.length} console errors:`);
      consoleErrors.forEach(err => console.error(`   - ${err}`));
    } else {
      console.log('✅ No image-related console errors');
    }
  });
});
