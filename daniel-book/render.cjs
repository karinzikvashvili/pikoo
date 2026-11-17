// Renders book.html to book.pdf and page previews in preview/. Usage: node render.cjs [page numbers...]
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');
(async () => {
  const b = await chromium.launch();
  const pg = await b.newPage({ deviceScaleFactor: 1 });
  await pg.goto('file://' + path.resolve(__dirname, 'book.html'));
  await pg.evaluate(() => document.fonts.ready);
  await pg.pdf({ path: path.resolve(__dirname, 'book.pdf'), width: '210mm', height: '297mm', printBackground: true, preferCSSPageSize: true });
  fs.mkdirSync(path.resolve(__dirname, 'preview'), { recursive: true });
  const secs = await pg.$$('section.page');
  const only = process.argv.slice(2).map(Number);
  for (let i = 0; i < secs.length; i++) {
    if (only.length && !only.includes(i + 1)) continue;
    await secs[i].screenshot({ path: path.resolve(__dirname, `preview/p${String(i + 1).padStart(2, '0')}.png`) });
  }
  // Text-fit check: any page whose frames/letter overflow their space?
  const over = await pg.$$eval('section.page', (ss) => ss.map((s, i) => {
    const bad = [...s.querySelectorAll('.art')].some((a) => a.clientHeight < 60);
    const boxes = [...s.querySelectorAll('.paper, .cap')];
    const art = [...s.querySelectorAll('.cap, .bubble')].some((c) => {
      const a = c.closest('.art'); if (!a) return false;
      const r = c.getBoundingClientRect(), q = a.getBoundingClientRect();
      return r.top < q.top - 1 || r.bottom > q.bottom + 1; });
    return bad || art || boxes.some((p) => p.scrollHeight > p.clientHeight + 2) ? i + 1 : null;
  }).filter(Boolean));
  console.log('pages with cramped art or overflowing text:', over.length ? over : 'none');
  await b.close();
})();
