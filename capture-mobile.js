import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({
    viewport: { width: 390, height: 844 },
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_8 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.2 Mobile/15E148 Safari/604.1'
  });
  await page.goto('http://localhost:8080');
  await page.waitForTimeout(1000);
  
  // Click the hamburger menu (it has aria-label="Toggle menu")
  await page.click('button[aria-label="Toggle menu"]');
  await page.waitForTimeout(1000); // Wait for the menu to fade in

  await page.screenshot({ path: 'mobile-view.png', fullPage: true });
  await browser.close();
})();
