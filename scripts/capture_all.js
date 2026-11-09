import puppeteer from 'puppeteer-core';

const pages = [
  { id: 'dashboard', filename: 'screenshot_dashboard.png' },
  { id: 'acts', filename: 'screenshot_acts.png' },
  { id: 'rules', filename: 'screenshot_rules.png' },
  { id: 'amendments', filename: 'screenshot_amendments.png' },
  { id: 'search', filename: 'screenshot_search.png' },
  { id: 'notes', filename: 'screenshot_notes.png' },
  { id: 'bookmarks', filename: 'screenshot_bookmarks.png' },
  { id: 'subscription', filename: 'screenshot_subscription.png' },
  { id: 'help', filename: 'screenshot_help.png' },
  { id: 'login', filename: 'screenshot_login.png', unauth: true },
  { id: 'signup', filename: 'screenshot_signup.png', unauth: true }
];

async function capture() {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1670, height: 940 });
  await page.goto('http://localhost:5000', { waitUntil: 'networkidle0' });

  for (const item of pages) {
    await page.evaluate((pageId, isUnauth) => {
      if (isUnauth) {
        window.setAuthenticated(false);
      } else {
        window.setAuthenticated(true);
      }
      window.setAppPage(pageId);
    }, item.id, item.unauth || false);

    // Give time for state update and images to settle
    await new Promise(r => setTimeout(r, 600));

    await page.screenshot({ path: item.filename });
    console.log(`Captured ${item.filename}`);
  }

  await browser.close();
  console.log('All 11 pages captured successfully!');
}

capture().catch(err => {
  console.error(err);
  process.exit(1);
});
