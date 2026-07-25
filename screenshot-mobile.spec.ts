import { test, devices } from '@playwright/test';

test('capture mobile screenshot', async ({ page }) => {
  await page.goto('http://localhost:8080');
  await page.setViewportSize({ width: 390, height: 844 });
  await page.screenshot({ path: 'mobile-screenshot.png', fullPage: true });
});
