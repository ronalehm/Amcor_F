import { chromium } from 'playwright';

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1600, height: 1200 } });

try {
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  
  // Look for text that indicates the design section
  const hasDesignRefLabel = await page.locator('text=¿Tiene Diseño de referencia?').isVisible();
  console.log('Design reference label visible:', hasDesignRefLabel);
  
  // Try to find the unified EDAG field
  const etagRefLabel = await page.locator('text=EDAG Referencia').isVisible().catch(() => false);
  console.log('EDAG Referencia field visible:', etagRefLabel);
  
  await page.screenshot({ path: './design-section.png' });
  console.log('Screenshot saved');
} catch (error) {
  console.error('Error:', error.message);
} finally {
  await browser.close();
}
