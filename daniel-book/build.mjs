// Builds book.html (print layout, exact Hebrew text overlaid on the art) and prompts.md
// (one image prompt per frame). Usage: node build.mjs
import { pages, speakers, STYLE, LIKENESS } from './book-data.mjs';
import { existsSync, writeFileSync } from 'node:fs';

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const artPath = (f) => `art/${f}`;
const hasArt = (f) => f && existsSync(new URL(`./art/${f}`, import.meta.url));

function rows(frames) {
  // 16:9 frames take a full row; consecutive 4:3 frames pair up two per row.
  const out = [];
  for (let i = 0; i < frames.length; i++) {
    const f = frames[i], g = frames[i + 1];
    const half = (x) => x && (x.ratio === '4:3' || x.black);
    if (half(f) && half(g)) { f._half = g._half = true; out.push([f, g]); i++; } else out.push([f]);
  }
  return out;
}

function frameHTML(f) {
  if (f.black) return `<div class="frame black"><p>${esc(f.caption)}</p></div>`;
  const n = f.n || [];
  const caps = n.map((t) => `<p>${esc(t)}</p>`).join('');
  // Speaker side in the art: f.side = {D:'l'|'r', K:'l'|'r'}; default first speaker right.
  const order = [...new Set((f.d || []).map(([w]) => w))];
  const side = (w) => (f.side && f.side[w]) || (order.indexOf(w) === 0 ? 'r' : 'l');
  const bubbles = (f.d || []).map(([who, t]) =>
    `<div class="bubble ${side(who)}${f.tail && f.tail[who] ? ' ' + f.tail[who] : ''}" data-who="${speakers[who]}">${esc(t)}</div>`).join('');
  const img = hasArt(f.art)
    ? `<div class="img" style="background-image:url('${artPath(f.art)}');background-position:${f.pos || 'center 35%'}"></div>`
    : `<div class="img ph"><span>איור בהכנה</span><small>${esc(f.art)}</small></div>`;
  // Narration: cream box on the panel's left side; under dialogue it becomes a bottom box.
  const len = n.join(' ').length;
  const cls = f.d || f._half || f.capSide === 'bottom' ? 'bottom' : len < 40 ? 'tiny' : len > 260 ? 'wide' : '';
  const box = caps ? `<div class="cap ${f.capSide || ''} ${cls}">${caps}</div>` : '';
  const label = '';
  return `<div class="frame"><div class="art">${img}${label}${box}<div class="bubbles">${bubbles}</div></div></div>`;
}

function pageHTML(p) {
  if (p.cover) {
    const f = p.frames[0];
    const img = hasArt(f.art) ? `background-image:url('${artPath(f.art)}')` : '';
    return `<section class="page cover ${img ? '' : 'ph'}" style="${img}">
      <h1><span class="num">37</span><span class="rest">גוונים של דניאל</span></h1></section>`;
  }
  const head = `<header><div class="run"><span class="brush">37 גוונים של דניאל</span><span class="tag">עמוד ${p.n}</span></div>
      <h2><span>${esc(p.title)}</span></h2><div class="sub">${esc(p.sub)} <i>♡</i></div></header>`;
  if (p.letter) {
    const f = p.frames[0];
    const img = hasArt(f.art) ? `<div class="img" style="background-image:url('${artPath(f.art)}')"></div>`
      : `<div class="img ph"><span>איור בהכנה</span></div>`;
    return `<section class="page letter">${head}<div class="hero">${img}</div>
      <div class="paper">${p.letterText.map((t) => `<p>${esc(t)}</p>`).join('')}</div>
      </section>`;
  }
  const body = rows(p.frames).map((r) => `<div class="row">${r.map(frameHTML).join('')}</div>`).join('');
  return `<section class="page">${head}<div class="grid">${body}</div></section>`;
}

const html = `<!doctype html><html lang="he" dir="rtl"><head><meta charset="utf-8">
<title>37 גוונים של דניאל</title><link rel="stylesheet" href="fonts/fonts.css"><link rel="stylesheet" href="book.css"></head>
<body>${pages.map(pageHTML).join('\n')}</body></html>`;
writeFileSync(new URL('./book.html', import.meta.url), html);

// ---- prompts.md
const refName = { D: 'char-daniel.png + daniel-photo.jpg', K: 'char-karin.png + karin-photo.jpg' };
let md = '# פרומפטים לאיורים — 37 גוונים של דניאל\n\nלכל פריים: להעלות את קבצי הרפרנס המצוינים (מתוך art/) ולהדביק את הפרומפט. לשמור את התוצאה בשם הקובץ המצוין בתיקיית art/ ולהריץ `node build.mjs`.\n\n';
for (const p of pages) {
  md += `## עמוד ${p.n} — ${p.title}\n\n`;
  p.frames.forEach((f, i) => {
    if (f.black) { md += `### פריים ${i + 1} — מסגרת שחורה (ללא איור)\n\n`; return; }
    const who = f.refs.split('').map((r) => LIKENESS[r]);
    const subj = f.refs === 'DK'
      ? `Characters: ${who[0]}; and ${who[1]}.`
      : `Character: ${who[0]}.`;
    const r = f._half ? '3:4 (portrait)' : f.ratio === '3:4' ? '3:4' : '16:9';
    md += `### פריים ${i + 1} → \`art/${f.art}\` (יחס ${r}; רפרנס: ${f.refs.split('').map((r) => refName[r]).join(' + ')})\n\n`;
    md += '```\n' + `Comic panel, aspect ratio ${r}.${f._half ? ' Keep the top third empty for speech balloons / bottom quarter simple for a caption.' : ' Keep the left third calm (for a caption box).'} ${subj} Scene: ${f.scene} ${STYLE}` + '\n```\n\n';
  });
}
writeFileSync(new URL('./prompts.md', import.meta.url), md);
console.log('built', pages.length, 'pages');
