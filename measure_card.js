const { chromium } = require('@playwright/test');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle', timeout: 30000 });

  // Wait for NEW ARRIVALS section
  await page.waitForSelector('text=NEW ARRIVALS', { timeout: 10000 }).catch(() => {});
  await page.waitForTimeout(1500);

  const data = await page.evaluate(() => {
    // Find 新着商品 section header
    const headers = Array.from(document.querySelectorAll('div'));
    let newArrivalsSection = null;
    for (const el of headers) {
      if (el.textContent?.includes('NEW ARRIVALS') && el.textContent?.includes('新着商品')) {
        newArrivalsSection = el;
        break;
      }
    }

    // Get the grid inside 新着商品
    let newArrivalsCard = null;
    if (newArrivalsSection) {
      const parent = newArrivalsSection.closest('[style*="marginBottom"]') || newArrivalsSection.parentElement;
      const grid = parent?.querySelector('[style*="grid-template-columns"]');
      if (grid) {
        newArrivalsCard = grid.children[0];
      }
    }

    // Fallback: get all product cards and find the ones in new-arrivals area
    if (!newArrivalsCard) {
      const allGrids = Array.from(document.querySelectorAll('[style*="repeat(4,1fr)"]'));
      // New arrivals is the 2nd grid (featured=1st, new arrivals=2nd)
      const grid = allGrids[1];
      if (grid) newArrivalsCard = grid.children[0];
    }

    if (!newArrivalsCard) return { error: 'NEW ARRIVALS card not found' };

    const cardRect = newArrivalsCard.getBoundingClientRect();
    const cardStyle = window.getComputedStyle(newArrivalsCard);

    // Measure internal elements
    const imgContainer = newArrivalsCard.querySelector('[style*="padding: 8px"]') ||
                         newArrivalsCard.querySelector('[style*="padding:8px"]') ||
                         newArrivalsCard.children[0];

    const textBlock = newArrivalsCard.children[1];
    const button = newArrivalsCard.querySelector('button');

    let brandH = 0, titleH = 0, badgeH = 0, priceH = 0, buttonH = 0, imgH = 0;

    if (imgContainer) {
      imgH = imgContainer.getBoundingClientRect().height;
    }
    if (textBlock) {
      const textChildren = textBlock.children;
      if (textChildren[0]) brandH = textChildren[0].getBoundingClientRect().height;
      if (textChildren[1]) titleH = textChildren[1].getBoundingClientRect().height;
      if (textChildren[2]) {
        const t = textChildren[2];
        // Could be badge or price div
        if (t.textContent?.match(/[SABC]|NEW/)) badgeH = t.getBoundingClientRect().height;
        else priceH = t.getBoundingClientRect().height;
      }
      if (textChildren[3]) priceH = textChildren[3].getBoundingClientRect().height;
    }
    if (button) buttonH = button.getBoundingClientRect().height;

    return {
      card: {
        width: Math.round(cardRect.width),
        height: Math.round(cardRect.height),
        padding: cardStyle.padding,
      },
      imgContainerH: Math.round(imgH),
      brandH: Math.round(brandH),
      titleH: Math.round(titleH),
      badgeH: Math.round(badgeH),
      priceH: Math.round(priceH),
      buttonH: Math.round(buttonH),
    };
  });

  console.log('=== 新着商品 第1カード実寸 ===');
  console.log(JSON.stringify(data, null, 2));

  // Also measure Apple and Accessories first cards
  const data2 = await page.evaluate(() => {
    const allGrids = Array.from(document.querySelectorAll('[style*="repeat(4,1fr)"]'));
    // 0=注目, 1=新着, 2=apple, 3=accessories (approx)
    const results = {};
    const labels = ['注目商品一覧', '新着商品', 'Apple', 'Accessories'];
    allGrids.slice(0, 4).forEach((grid, i) => {
      const card = grid.children[0];
      if (card) {
        const r = card.getBoundingClientRect();
        results[labels[i] || `grid${i}`] = { width: Math.round(r.width), height: Math.round(r.height) };
      }
    });
    return results;
  });

  console.log('\n=== セクション別カード高さ比較 ===');
  console.log(JSON.stringify(data2, null, 2));

  await browser.close();
})();
