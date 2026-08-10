import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:5173';

test.describe('Image Visibility Debug Tests', () => {
  test('Debug: Rewinding Direction Image Rendering', async ({ page }) => {
    console.log('\n🔍 DEBUG: Analyzing Rewinding Direction Images\n');

    // Navigate to a product (we'll use the first available)
    await page.goto(`${BASE_URL}/products`);
    await page.waitForLoadState('networkidle');

    // Get any existing product or create one
    const createProductBtn = page.locator('button:has-text("Nuevo")').first();
    if (await createProductBtn.isVisible()) {
      console.log('📝 Creating test product...');
      await createProductBtn.click();
      // Handle modal if needed
      await page.waitForTimeout(2000);
    }

    // Try to find and click an existing product
    const productLink = page.locator('a[href*="/products/"]').first();
    if (await productLink.isVisible()) {
      await productLink.click();
      await page.waitForLoadState('networkidle');
    } else {
      console.log('⚠️ No products available, test skipped');
      test.skip();
      return;
    }

    // Navigate to Design step (Paso 2)
    await page.click('button:has-text("2")');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    // Look for Rewinding Direction section
    const rewindingSection = page.locator('text=Sentido de Embobinado').first();

    if (await rewindingSection.isVisible()) {
      console.log('✅ Rewinding Direction section found');
      await rewindingSection.scrollIntoViewIfNeeded();

      // Get all image containers
      const imageButtons = page.locator('button:has(img[alt*="Sentido"])');
      const count = await imageButtons.count();
      console.log(`📊 Found ${count} image buttons\n`);

      if (count === 0) {
        console.log('❌ No image buttons found!');

        // Debug: Check what HTML exists
        const html = await page.content();
        const rewindingMatch = html.match(/Sentido de Embobinado[\s\S]{0,500}/);
        if (rewindingMatch) {
          console.log('\n📋 HTML around Rewinding section:');
          console.log(rewindingMatch[0].substring(0, 300));
        }
      }

      for (let i = 0; i < Math.min(count, 3); i++) {
        const btn = imageButtons.nth(i);
        const img = btn.locator('img').first();

        const isVisible = await img.isVisible();
        const boundingBox = await img.boundingBox();
        const src = await img.getAttribute('src');
        const alt = await img.getAttribute('alt');

        // Get computed styles
        const computed = await img.evaluate((el: any) => {
          const style = window.getComputedStyle(el);
          return {
            display: style.display,
            visibility: style.visibility,
            opacity: style.opacity,
            width: style.width,
            height: style.height,
            naturalWidth: el.naturalWidth,
            naturalHeight: el.naturalHeight,
            complete: el.complete,
            currentSrc: el.currentSrc,
          };
        });

        console.log(`\n📸 Image ${i + 1}: ${alt}`);
        console.log(`   Visible: ${isVisible}`);
        console.log(`   BoundingBox: ${JSON.stringify(boundingBox)}`);
        console.log(`   Src: ${src}`);
        console.log(`   Display: ${computed.display}`);
        console.log(`   Visibility: ${computed.visibility}`);
        console.log(`   Opacity: ${computed.opacity}`);
        console.log(`   Natural Size: ${computed.naturalWidth}x${computed.naturalHeight}`);
        console.log(`   Complete: ${computed.complete}`);
      }
    } else {
      console.log('❌ Rewinding Direction section NOT found');

      // Check if we're on the right page
      const stepIndicators = page.locator('button:has-text("1"), button:has-text("2"), button:has-text("3")');
      console.log(`\n Available steps: ${await stepIndicators.count()}`);
    }
  });

  test('Debug: Check image file paths', async ({ page }) => {
    console.log('\n🔗 DEBUG: Checking Image File Paths\n');

    // Navigate to check the actual file paths
    await page.goto(`${BASE_URL}/assets/bobinado/sentido-1.png`);

    const status = page.url();
    console.log(`Request URL: ${status}`);

    // If it loaded as image, check response
    const response = await page.goto(`${BASE_URL}/assets/bobinado/sentido-1.png`, {
      waitUntil: 'networkidle',
    });

    if (response) {
      console.log(`Response Status: ${response.status()}`);
      console.log(`Content-Type: ${response.headers()['content-type']}`);
    }

    // Check if files exist
    const imagePaths = [
      '/assets/bobinado/sentido-1.png',
      '/assets/bobinado/sentido-2.png',
      '/assets/envolturas/bolsa.png',
      '/assets/envolturas/lamina.png',
      '/assets/envolturas/pouch.png',
    ];

    console.log('\n📁 Checking image file paths:\n');

    for (const path of imagePaths) {
      const fullUrl = `${BASE_URL}${path}`;
      try {
        const res = await page.request.get(fullUrl);
        const status = res.status();
        const contentType = res.headers()['content-type'] || 'unknown';

        const icon = status === 200 ? '✅' : '❌';
        console.log(`${icon} ${path}`);
        console.log(`   Status: ${status}, Type: ${contentType}`);
      } catch (error: any) {
        console.log(`❌ ${path}`);
        console.log(`   Error: ${error.message}`);
      }
    }
  });

  test('Debug: Check CSS for image containers', async ({ page }) => {
    console.log('\n🎨 DEBUG: Checking CSS and Layout\n');

    await page.goto(`${BASE_URL}/products`);
    await page.waitForLoadState('networkidle');

    const productLink = page.locator('a[href*="/products/"]').first();
    if (await productLink.isVisible()) {
      await productLink.click();
      await page.waitForLoadState('networkidle');

      // Go to Design step
      await page.click('button:has-text("2")');
      await page.waitForLoadState('networkidle');

      // Check the button styling
      const imageButton = page.locator('button:has(img[alt*="Sentido"])').first();

      if (await imageButton.isVisible()) {
        const computed = await imageButton.evaluate((el: any) => {
          const style = window.getComputedStyle(el);
          return {
            display: style.display,
            position: style.position,
            width: style.width,
            height: style.height,
            padding: style.padding,
            visibility: style.visibility,
            pointerEvents: style.pointerEvents,
            background: style.background,
            border: style.border,
          };
        });

        console.log('Button Container CSS:');
        Object.entries(computed).forEach(([key, value]) => {
          console.log(`  ${key}: ${value}`);
        });

        // Check img element CSS
        const img = imageButton.locator('img').first();
        const imgComputed = await img.evaluate((el: any) => {
          const style = window.getComputedStyle(el);
          return {
            display: style.display,
            maxWidth: style.maxWidth,
            maxHeight: style.maxHeight,
            objectFit: style.objectFit,
            width: style.width,
            height: style.height,
          };
        });

        console.log('\nImage CSS:');
        Object.entries(imgComputed).forEach(([key, value]) => {
          console.log(`  ${key}: ${value}`);
        });
      }
    }
  });
});
