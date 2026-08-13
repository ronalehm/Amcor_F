import { test, expect } from "@playwright/test";

test("Momento 2 Reference Data Autocomplete Flow", async ({ page }) => {
  console.log("🚀 Starting Momento 2 test");

  await page.goto("http://localhost:5173/products");
  await page.waitForLoadState("networkidle");
  console.log("✅ ProductListPage loaded");

  // Check localStorage initially
  const initialLS = await page.evaluate(() => localStorage.getItem("momento2ReferenceData"));
  console.log("Initial localStorage:", initialLS ? "has data" : "empty");
});
