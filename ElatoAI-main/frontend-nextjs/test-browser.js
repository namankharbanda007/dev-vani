const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--use-fake-ui-for-media-stream', '--use-fake-device-for-media-stream']
  });
  
  const page = await browser.newPage();
  
  page.on('console', msg => {
    console.log(`[BROWSER ${msg.type().toUpperCase()}] ${msg.text()}`);
  });

  page.on('pageerror', error => {
    console.log('PAGE ERROR STRACE:', error.message);
  });

  try {
    console.log('Navigating to http://localhost:3001/pandit...');
    await page.goto('http://localhost:3001/pandit', { waitUntil: 'networkidle2' });
    
    console.log('Waiting for Join Call button...');
    await page.waitForSelector('button[type="submit"]', { timeout: 10000 });
    
    console.log('Clicking Join Call...');
    await page.click('button[type="submit"]');

    // Wait a bit to let any subsequent loads crash
    await new Promise(r => setTimeout(r, 5000));
    
  } catch (e) {
    console.log('Puppeteer Script Exception:', e);
  } finally {
    await browser.close();
  }
})();
