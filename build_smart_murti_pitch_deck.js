const fs = require("fs");
const path = require("path");
const pptxgen = require("pptxgenjs");
const sharp = require("sharp");

const ROOT = "C:/Users/NAMAN KHARBANDA/Downloads/ElatoAI-main (2)";
const OUT = path.join(ROOT, "deck_output");
const ASSETS = path.join(OUT, "assets");
const SHOTS = "C:/tmp/smartmurti_deck_shots";
const LOGO = path.join(ROOT, "ElatoAI-main/frontend-nextjs/public/assets/landing/logo.png");
const PANDIT_SOURCE = path.join(SHOTS, "Ascroll_01.png");

fs.mkdirSync(ASSETS, { recursive: true });
fs.mkdirSync(path.join(OUT, "previews"), { recursive: true });

const panditFull = path.join(ASSETS, "pandit-consistent-full.png");
const panditFace = path.join(ASSETS, "pandit-consistent-face.png");

const C = {
  cream: "F8F1E2",
  cream2: "FFF8EA",
  ink: "241A14",
  muted: "675546",
  wine: "5A123B",
  wine2: "7A204E",
  gold: "B77A17",
  gold2: "E3B04B",
  saffron: "C86B1F",
  line: "D8C39C",
  white: "FFFFFF",
  green: "476340",
};

const fonts = {
  head: "Georgia",
  body: "Aptos",
};
let SHAPE;

function addBg(slide) {
  slide.background = { color: C.cream };
  slide.addShape(SHAPE.rect, {
    x: 0,
    y: 0,
    w: 13.333,
    h: 7.5,
    fill: { color: C.cream },
    line: { color: C.cream },
  });
  slide.addShape(SHAPE.line, {
    x: 0.42,
    y: 7.08,
    w: 12.5,
    h: 0,
    line: { color: C.line, transparency: 35, width: 1 },
  });
}

function footer(slide, num) {
  slide.addImage({ path: LOGO, x: 0.48, y: 7.14, w: 1.05, h: 0.22 });
  slide.addText(`Investor pitch 2026  |  ${num}`, {
    x: 10.9,
    y: 7.08,
    w: 1.95,
    h: 0.22,
    fontFace: fonts.body,
    fontSize: 7.5,
    color: "8D7B66",
    align: "right",
    margin: 0,
  });
}

function kicker(slide, text, x, y, w = 3.8) {
  slide.addText(text.toUpperCase(), {
    x,
    y,
    w,
    h: 0.28,
    fontFace: fonts.body,
    fontSize: 9,
    bold: true,
    charSpace: 1.1,
    color: C.gold,
    margin: 0,
  });
}

function title(slide, text, x, y, w, fs = 28, color = C.ink) {
  slide.addText(text, {
    x,
    y,
    w,
    h: 1.1,
    fontFace: fonts.head,
    fontSize: fs,
    bold: true,
    color,
    breakLine: false,
    fit: "shrink",
    margin: 0,
  });
}

function body(slide, text, x, y, w, h, fs = 15, color = C.muted, bold = false) {
  slide.addText(text, {
    x,
    y,
    w,
    h,
    fontFace: fonts.body,
    fontSize: fs,
    color,
    bold,
    breakLine: false,
    fit: "shrink",
    valign: "top",
    margin: 0.02,
  });
}

function pill(slide, text, x, y, w, opts = {}) {
  slide.addShape(SHAPE.roundRect, {
    x,
    y,
    w,
    h: 0.36,
    rectRadius: 0.08,
    fill: { color: opts.fill || C.white, transparency: opts.transparency || 0 },
    line: { color: opts.line || C.line, transparency: 10 },
  });
  slide.addText(text, {
    x: x + 0.12,
    y: y + 0.08,
    w: w - 0.24,
    h: 0.14,
    fontFace: fonts.body,
    fontSize: 8.3,
    bold: true,
    color: opts.color || C.wine,
    align: "center",
    margin: 0,
    fit: "shrink",
  });
}

function softBox(slide, x, y, w, h, fill = C.white) {
  slide.addShape(SHAPE.roundRect, {
    x,
    y,
    w,
    h,
    rectRadius: 0.08,
    fill: { color: fill, transparency: 0 },
    line: { color: C.line, transparency: 10, width: 1 },
    shadow: { type: "outer", color: "A9854A", opacity: 0.12, blur: 1, angle: 45, distance: 1 },
  });
}

function addPandit(slide, x, y, w, h, face = false) {
  slide.addImage({ path: face ? panditFace : panditFull, x, y, w, h });
}

function addArrow(slide, x1, y1, x2, y2, color = C.gold) {
  slide.addShape(SHAPE.line, {
    x: x1,
    y: y1,
    w: x2 - x1,
    h: y2 - y1,
    line: { color, width: 2, beginArrowType: "none", endArrowType: "triangle" },
  });
}

function addMetric(slide, value, label, x, y, w = 2.5) {
  slide.addText(value, {
    x,
    y,
    w,
    h: 0.55,
    fontFace: fonts.head,
    fontSize: 26,
    bold: true,
    color: C.wine,
    align: "center",
    margin: 0,
  });
  slide.addText(label, {
    x,
    y: y + 0.62,
    w,
    h: 0.35,
    fontFace: fonts.body,
    fontSize: 9,
    color: C.muted,
    bold: true,
    align: "center",
    margin: 0,
    fit: "shrink",
  });
}

function addPhone(slide, x, y, w, h, titleText = "Smart Pandit") {
  slide.addShape(SHAPE.roundRect, {
    x,
    y,
    w,
    h,
    rectRadius: 0.14,
    fill: { color: "191411" },
    line: { color: "33261E", width: 1.2 },
    shadow: { type: "outer", color: "6D4E2D", opacity: 0.22, blur: 2, angle: 45, distance: 2 },
  });
  slide.addShape(SHAPE.roundRect, {
    x: x + 0.12,
    y: y + 0.2,
    w: w - 0.24,
    h: h - 0.4,
    rectRadius: 0.08,
    fill: { color: "103927" },
    line: { color: "265C45", transparency: 30 },
  });
  slide.addText(titleText, {
    x: x + 0.28,
    y: y + 0.38,
    w: w - 0.56,
    h: 0.22,
    fontFace: fonts.body,
    fontSize: 8.5,
    bold: true,
    color: "EBD6A5",
    margin: 0,
  });
  const rows = ["Namaste. I can guide today's puja.", "Invite family into one room.", "Prepare samagri, then begin."];
  rows.forEach((r, i) => {
    slide.addShape(SHAPE.roundRect, {
      x: x + 0.25,
      y: y + 0.85 + i * 0.55,
      w: w - 0.5,
      h: 0.36,
      rectRadius: 0.05,
      fill: { color: i === 1 ? "213D35" : "173028" },
      line: { color: "4B7A62", transparency: 55 },
    });
    slide.addText(r, {
      x: x + 0.38,
      y: y + 0.94 + i * 0.55,
      w: w - 0.76,
      h: 0.1,
      fontFace: fonts.body,
      fontSize: 6.6,
      color: "EDE7D5",
      margin: 0,
      fit: "shrink",
    });
  });
  pill(slide, "Talk to Smart Pandit", x + 0.35, y + h - 0.78, w - 0.7, {
    fill: C.wine,
    line: C.wine,
    color: C.white,
  });
}

async function prepAssets() {
  await sharp(PANDIT_SOURCE)
    .extract({ left: 840, top: 70, width: 415, height: 535 })
    .png()
    .toFile(panditFull);
  await sharp(PANDIT_SOURCE)
    .extract({ left: 875, top: 75, width: 270, height: 255 })
    .resize(640, 604)
    .png()
    .toFile(panditFace);
}

async function buildPptx() {
  const pptx = new pptxgen();
  SHAPE = pptx.ShapeType;
  pptx.layout = "LAYOUT_WIDE";
  pptx.author = "Smart Murti";
  pptx.company = "Smart Murti";
  pptx.subject = "Smart Murti Investor Pitch Deck";
  pptx.title = "Smart Murti Investor Pitch Deck";
  pptx.lang = "en-US";
  pptx.theme = {
    headFontFace: fonts.head,
    bodyFontFace: fonts.body,
    lang: "en-US",
  };

  let s;

  s = pptx.addSlide();
  addBg(s);
  s.addImage({ path: LOGO, x: 0.65, y: 0.52, w: 1.25, h: 0.27 });
  kicker(s, "Investor pitch", 0.65, 1.38);
  title(s, "Instant Live AI Pandit for Hindu Families Worldwide", 0.65, 1.78, 6.1, 36, C.wine);
  body(s, "Smart Murti gives Hindu families trusted spiritual guidance and live family puja through a multilingual AI Pandit.", 0.68, 4.08, 4.9, 0.9, 17, C.ink);
  pill(s, "Urgent guidance  |  Live family puja  |  WhatsApp re-entry", 0.68, 5.32, 4.9);
  addPandit(s, 7.15, 0.55, 4.95, 5.75);
  footer(s, 1);

  s = pptx.addSlide();
  addBg(s);
  kicker(s, "The problem", 0.65, 0.58);
  title(s, "Trusted spiritual access is broken for diaspora families", 0.65, 0.95, 9.7, 30);
  body(s, "When a Hindu family abroad urgently needs a pandit, the experience is fragmented by geography, time zones, language, and trust.", 0.68, 1.92, 9.5, 0.55, 15, C.muted);
  softBox(s, 0.78, 3.1, 3.25, 1.35, C.cream2);
  body(s, "Urgent needs delayed", 1.02, 3.36, 2.7, 0.25, 17, C.wine, true);
  body(s, "Cannot quickly find a trusted local pandit for health, protection, or home rituals.", 1.02, 3.76, 2.6, 0.42, 10.5);
  softBox(s, 5.05, 2.78, 2.7, 1.0, C.white);
  body(s, "NRI mother\nin New Jersey", 5.42, 3.08, 1.95, 0.38, 14, C.ink, true);
  softBox(s, 9.05, 2.5, 3.1, 1.25, C.cream2);
  body(s, "Coordination friction", 9.32, 2.75, 2.35, 0.25, 16, C.wine, true);
  body(s, "Relatives in India want to join, but WhatsApp calls across time zones are chaotic.", 9.32, 3.12, 2.35, 0.38, 10);
  softBox(s, 9.05, 4.28, 3.1, 1.25, C.cream2);
  body(s, "Passive substitutes", 9.32, 4.53, 2.35, 0.25, 16, C.wine, true);
  body(s, "YouTube streams and per-minute astrology apps do not create a shared ritual.", 9.32, 4.9, 2.35, 0.38, 10);
  addArrow(s, 4.0, 3.75, 5.0, 3.35);
  addArrow(s, 7.75, 3.35, 9.0, 3.05);
  addArrow(s, 7.75, 3.4, 9.0, 4.85);
  footer(s, 2);

  s = pptx.addSlide();
  addBg(s);
  kicker(s, "Status quo", 0.65, 0.58);
  title(s, "Current tools miss the family ritual job", 0.65, 0.95, 8.4, 30);
  const cols = ["Local\nPandits", "YouTube\nStreams", "Astrology\nApps", "Smart\nMurti"];
  const rows = ["Instant 24/7 availability", "Interactive multilingual guidance", "Cross-border family joining", "Ritual correctness and devotional tone"];
  const x0 = 0.78, y0 = 2.18, cw0 = 3.85, cw = 2.08, rh = 0.75;
  softBox(s, x0, y0, cw0 + cw * 4, rh * 5 + 0.05, C.white);
  body(s, "Status quo matrix", x0 + 0.22, y0 + 0.24, 2.4, 0.22, 12, C.ink, true);
  cols.forEach((c, i) => {
    const fill = i === 3 ? C.wine : "F3E6CC";
    s.addShape(SHAPE.rect, { x: x0 + cw0 + i * cw, y: y0, w: cw, h: rh, fill: { color: fill }, line: { color: C.line } });
    body(s, c, x0 + cw0 + i * cw + 0.15, y0 + 0.18, cw - 0.3, 0.34, 10.5, i === 3 ? C.white : C.gold, true);
  });
  rows.forEach((r, ri) => {
    const y = y0 + rh * (ri + 1);
    s.addShape(SHAPE.rect, { x: x0, y, w: cw0, h: rh, fill: { color: ri % 2 ? "FBF4E7" : C.white }, line: { color: C.line } });
    body(s, r, x0 + 0.22, y + 0.22, cw0 - 0.38, 0.18, 10.8, C.ink, true);
    const vals = [
      ["-", "✓", "✓", "✓"],
      ["-", "-", "✓", "✓"],
      ["-", "-", "-", "✓"],
      ["✓", "-", "-", "✓"],
    ][ri];
    vals.forEach((v, ci) => {
      s.addShape(SHAPE.rect, { x: x0 + cw0 + ci * cw, y, w: cw, h: rh, fill: { color: ci === 3 ? C.wine : ri % 2 ? "FBF4E7" : C.white }, line: { color: C.line } });
      body(s, v, x0 + cw0 + ci * cw, y + 0.17, cw, 0.22, 19, ci === 3 ? C.gold2 : v === "✓" ? C.gold : "999999", true);
    });
  });
  body(s, "Smart Murti is not another content app. It is the first shared, interactive ritual layer for global families.", 1.0, 6.2, 10.8, 0.34, 15, C.wine, true);
  footer(s, 3);

  s = pptx.addSlide();
  addBg(s);
  kicker(s, "The product", 0.65, 0.58);
  title(s, "A trusted family pandit, now instant, affordable, and global", 0.65, 0.95, 9.5, 28);
  body(s, "The first session feels like calling your family pandit. The system speaks your language, remembers context, and lets the whole family join when the moment becomes a ritual.", 0.68, 1.78, 8.7, 0.55, 14.5);
  addPhone(s, 5.52, 2.35, 2.2, 3.75);
  addPandit(s, 8.1, 2.3, 2.7, 3.55);
  const labels = [
    ["Multilingual", "Hinglish, Hindi, English, and regional language support."],
    ["Context-aware", "Guidance based on family, ritual, and spiritual memory."],
    ["Always on", "WhatsApp and app re-entry for habit and urgency."],
  ];
  labels.forEach((l, i) => {
    softBox(s, 0.82, 2.55 + i * 1.15, 3.55, 0.78, C.cream2);
    body(s, l[0], 1.02, 2.72 + i * 1.15, 1.65, 0.17, 13.5, C.wine, true);
    body(s, l[1], 1.02, 2.98 + i * 1.15, 3.0, 0.22, 9.8);
    addArrow(s, 4.38, 2.95 + i * 1.15, 5.45, 3.2 + i * 0.42, C.gold);
  });
  footer(s, 4);

  s = pptx.addSlide();
  addBg(s);
  kicker(s, "Why now", 0.65, 0.58);
  title(s, "Real-time voice AI finally meets a real diaspora behavior", 0.65, 0.95, 10.1, 29);
  softBox(s, 0.9, 2.35, 5.15, 2.35, C.white);
  body(s, "Technological readiness", 1.23, 2.68, 3.7, 0.3, 18, C.gold, true);
  body(s, "Low-latency voice, multilingual conversation, and context retrieval can now carry the tone required for sacred rituals.", 1.23, 3.15, 3.9, 0.65, 13);
  s.addShape(SHAPE.arc, { x: 2.1, y: 4.02, w: 2.7, h: 0.75, line: { color: C.gold, width: 3, beginArrowType: "none", endArrowType: "triangle" }, adjustPoint: 0.35 });
  softBox(s, 7.15, 2.35, 5.15, 2.35, C.white);
  body(s, "Demographic demand", 7.48, 2.68, 3.7, 0.3, 18, C.gold, true);
  body(s, "NRI families already coordinate rituals across borders. The behavior exists. The platform does not.", 7.48, 3.15, 3.8, 0.55, 13);
  s.addShape(SHAPE.arc, { x: 8.35, y: 4.02, w: 2.7, h: 0.75, line: { color: C.wine, width: 3, beginArrowType: "none", endArrowType: "triangle" }, adjustPoint: 0.35 });
  body(s, "This is the opening: a sacred, voice-first product that feels personal, not like software.", 2.35, 5.65, 8.6, 0.5, 18, C.wine, true);
  footer(s, 5);

  s = pptx.addSlide();
  addBg(s);
  kicker(s, "The wedge", 0.65, 0.58);
  title(s, "Start with urgent 1:1 Smart Pandit guidance", 0.65, 0.95, 8.5, 30);
  body(s, "We do not ask families to learn new group software on day one. We start with the immediate front door for users in pain.", 0.68, 1.82, 8.8, 0.52, 15);
  const bullets = [
    ["High intent", "Health concerns, protection, peace, family stress, or relationship guidance."],
    ["Instant trust", "Calm, structured, spiritually grounded support exactly when local pandits are unavailable."],
  ];
  bullets.forEach((b, i) => {
    s.addShape(SHAPE.ellipse, { x: 0.88, y: 3.0 + i * 1.08, w: 0.12, h: 0.12, fill: { color: C.wine }, line: { color: C.wine } });
    body(s, b[0], 1.18, 2.88 + i * 1.08, 2.2, 0.3, 18, C.ink, true);
    body(s, b[1], 1.18, 3.28 + i * 1.08, 4.0, 0.35, 12.5);
  });
  softBox(s, 7.45, 2.55, 3.9, 2.45, C.white);
  body(s, "Sacred Concierge", 8.25, 3.02, 2.3, 0.3, 20, C.ink, true);
  ["Health", "Protection", "Peace"].forEach((p, i) => pill(s, p, 7.9 + i * 1.05, 3.65, 0.9, { fill: "FFF7E6" }));
  pill(s, "Talk to Smart Pandit now", 8.05, 4.28, 2.75, { fill: C.wine, line: C.wine, color: C.white });
  footer(s, 6);

  s = pptx.addSlide();
  addBg(s);
  kicker(s, "The flagship", 0.65, 0.58);
  title(s, "Live cross-border family puja becomes the premium moment", 0.65, 0.95, 10.6, 28);
  body(s, "Once trust is established through urgent guidance, the relationship upgrades to shared family rituals.", 0.68, 1.76, 8.2, 0.35, 15);
  softBox(s, 0.88, 2.6, 3.5, 1.1, C.cream2);
  body(s, "Shared spiritual moments", 1.12, 2.86, 2.7, 0.25, 16, C.wine, true);
  body(s, "Relatives in New Jersey, Toronto, and Delhi join the same ritual.", 1.12, 3.22, 2.75, 0.28, 10.5);
  softBox(s, 0.88, 4.08, 3.5, 1.1, C.cream2);
  body(s, "Focused ritual room", 1.12, 4.34, 2.7, 0.25, 16, C.wine, true);
  body(s, "Purpose-built for sacred focus, not a generic video call.", 1.12, 4.7, 2.75, 0.28, 10.5);
  addPhone(s, 6.1, 2.18, 1.7, 3.15, "Live Puja");
  addPandit(s, 6.42, 2.55, 1.0, 1.08, true);
  ["New Jersey", "Toronto", "Delhi"].forEach((city, i) => {
    const pts = [[5.35, 2.55], [8.55, 2.7], [7.45, 5.75]][i];
    s.addShape(SHAPE.ellipse, { x: pts[0], y: pts[1], w: 0.24, h: 0.24, fill: { color: C.gold }, line: { color: C.gold } });
    body(s, city, pts[0] + (i === 1 ? 0.35 : -0.25), pts[1] + 0.32, 1.5, 0.16, 11, C.ink, true);
    addArrow(s, pts[0] + 0.12, pts[1] + 0.12, 6.92, 3.88, C.gold);
  });
  footer(s, 7);

  s = pptx.addSlide();
  addBg(s);
  kicker(s, "The moat", 0.65, 0.58);
  title(s, "A competitor can copy an AI bot. They cannot copy a family’s spiritual memory.", 0.65, 0.95, 11.4, 27);
  body(s, "Every session makes Smart Murti more personalized, more trusted, and harder to replace.", 0.68, 1.82, 8.6, 0.35, 15);
  s.addShape(SHAPE.ellipse, { x: 5.8, y: 3.05, w: 1.4, h: 1.4, fill: { color: C.wine }, line: { color: C.gold, width: 2 } });
  body(s, "The\nFamily", 6.12, 3.38, 0.76, 0.38, 17, C.gold2, true);
  const nodes = [
    ["Child’s health puja", 8.1, 2.2],
    ["Housewarming guidance", 9.6, 3.7],
    ["Daily rituals", 8.7, 5.15],
    ["Language preferences", 3.9, 4.95],
    ["Past remedies", 3.2, 2.85],
  ];
  nodes.forEach(([n, x, y]) => {
    s.addShape(SHAPE.ellipse, { x, y, w: 0.35, h: 0.35, fill: { color: C.gold2 }, line: { color: C.gold } });
    addArrow(s, 6.5, 3.75, x + 0.17, y + 0.17, C.gold);
    body(s, n, x + 0.45, y + 0.07, 1.7, 0.22, 10.5, C.ink, true);
  });
  body(s, "Ritual continuity", 0.95, 3.05, 2.5, 0.3, 20, C.gold, true);
  body(s, "The system remembers family composition, past rituals, recurring issues, and language preferences.", 0.98, 3.55, 3.4, 0.55, 13);
  body(s, "Compounding trust", 0.95, 4.65, 2.5, 0.3, 20, C.gold, true);
  body(s, "Switching away gets harder with every sacred session.", 0.98, 5.13, 3.0, 0.35, 13);
  footer(s, 8);

  s = pptx.addSlide();
  addBg(s);
  kicker(s, "Beachhead customer", 0.65, 0.58);
  title(s, "The diaspora family organizer", 0.65, 0.95, 8.4, 30);
  body(s, "We are strictly targeting Hindu diaspora families experiencing cross-border coordination friction.", 0.68, 1.78, 8.3, 0.35, 15);
  softBox(s, 3.25, 2.45, 6.8, 3.35, C.white);
  const persona = [
    ["The buyer", "Mother, spouse, or family organizer handling spiritual, ritual, and health concerns."],
    ["The triggers", "Family health worries, major festivals, new home purchases, or life-direction moments."],
    ["The baseline", "Already values tradition, already spends money on rituals, already feels manual coordination pain."],
  ];
  persona.forEach((p, i) => {
    const y = 2.78 + i * 0.92;
    s.addShape(SHAPE.ellipse, { x: 3.65, y, w: 0.38, h: 0.38, fill: { color: C.gold2 }, line: { color: C.gold2 } });
    body(s, p[0], 4.25, y - 0.02, 2.2, 0.2, 13.5, C.wine, true);
    body(s, p[1], 4.25, y + 0.28, 4.85, 0.27, 9.6);
  });
  addPandit(s, 10.3, 2.1, 1.95, 2.35);
  footer(s, 9);

  s = pptx.addSlide();
  addBg(s);
  kicker(s, "Business model", 0.65, 0.58);
  title(s, "Wallet sessions compound into premium family usage", 0.65, 0.95, 10.5, 29);
  body(s, "We monetize moments of need first, then expand into higher-value family rituals and recurring spiritual continuity.", 0.68, 1.78, 9.5, 0.35, 15);
  const loop = [
    ["Urgent need", "Single-user 1:1 session"],
    ["WhatsApp re-entry", "Daily follow-up guidance"],
    ["Family invite", "Relatives join the ecosystem"],
    ["Live family puja", "Premium multi-user session"],
  ];
  loop.forEach((l, i) => {
    const positions = [[1.15, 3.85], [3.95, 2.55], [7.0, 2.55], [9.65, 3.85]][i];
    softBox(s, positions[0], positions[1], 2.3, 0.9, i === 3 ? "FFF2D4" : C.white);
    body(s, l[0], positions[0] + 0.18, positions[1] + 0.18, 1.9, 0.18, 13, C.wine, true);
    body(s, l[1], positions[0] + 0.18, positions[1] + 0.48, 1.85, 0.15, 8.8);
  });
  addArrow(s, 3.42, 4.25, 3.95, 3.25);
  addArrow(s, 6.25, 3.0, 7.0, 3.0);
  addArrow(s, 9.33, 3.25, 9.65, 4.25);
  addArrow(s, 9.65, 4.8, 3.45, 4.85);
  addPhone(s, 5.48, 3.52, 1.55, 2.55, "Wallet");
  footer(s, 10);

  s = pptx.addSlide();
  addBg(s);
  kicker(s, "Traction", 0.65, 0.58);
  title(s, "The product foundations are live. Now the investor metrics need to be locked.", 0.65, 0.95, 11.2, 27);
  const proofs = [
    ["Live web product", "Smart Pandit home, voice/chat, live family puja room"],
    ["Native app flow", "Mobile Smart Pandit, horoscope, bhajan, wallet, live puja"],
    ["WhatsApp habit engine", "Daily spiritual re-entry and follow-up surface"],
    ["Personalization layer", "Horoscope, family context, language, and guide memory"],
  ];
  proofs.forEach((p, i) => {
    const x = 0.95 + (i % 2) * 5.65;
    const y = 2.55 + Math.floor(i / 2) * 1.2;
    softBox(s, x, y, 4.95, 0.86, C.white);
    body(s, p[0], x + 0.22, y + 0.18, 2.5, 0.18, 13, C.wine, true);
    body(s, p[1], x + 0.22, y + 0.48, 4.2, 0.14, 8.8);
  });
  body(s, "Before sending this deck, replace this rail with the actual numbers investors will ask for:", 0.95, 5.3, 8.7, 0.2, 12, C.ink, true);
  ["families reached", "paid sessions", "30-day repeat", "avg family members per puja"].forEach((m, i) => {
    pill(s, m, 0.95 + i * 2.8, 5.85, 2.35, { fill: C.cream2 });
  });
  footer(s, 11);

  s = pptx.addSlide();
  addBg(s);
  kicker(s, "Economics", 0.65, 0.58);
  title(s, "High-margin digital services with premium ritual upside", 0.65, 0.95, 10.0, 29);
  const tableX = 0.9, tableY = 2.3;
  const headers = ["Service", "Pricing logic", "Why it works"];
  const widths = [2.4, 3.0, 5.2];
  headers.forEach((h, i) => {
    s.addShape(SHAPE.rect, { x: tableX + widths.slice(0, i).reduce((a, b) => a + b, 0), y: tableY, w: widths[i], h: 0.52, fill: { color: i === 2 ? C.wine : "F0DDB9" }, line: { color: C.line } });
    body(s, h, tableX + widths.slice(0, i).reduce((a, b) => a + b, 0) + 0.12, tableY + 0.17, widths[i] - 0.24, 0.1, 9.5, i === 2 ? C.white : C.ink, true);
  });
  [
    ["1:1 guidance", "wallet / session fee", "high urgency, quick conversion"],
    ["family puja", "premium event pricing", "emotional, multi-user willingness to pay"],
    ["membership", "monthly / annual", "predictable repeat rituals and priority access"],
    ["concierge", "high-ticket planning", "future monetization layer for high-value families"],
  ].forEach((r, ri) => {
    const y = tableY + 0.52 + ri * 0.58;
    r.forEach((v, ci) => {
      const x = tableX + widths.slice(0, ci).reduce((a, b) => a + b, 0);
      s.addShape(SHAPE.rect, { x, y, w: widths[ci], h: 0.58, fill: { color: ri % 2 ? "FBF4E7" : C.white }, line: { color: C.line, transparency: 15 } });
      body(s, v, x + 0.12, y + 0.19, widths[ci] - 0.24, 0.13, 8.8, ci === 0 ? C.wine : C.muted, ci === 0);
    });
  });
  addMetric(s, "wallet-first", "upfront cash flow", 1.0, 5.65, 2.5);
  addMetric(s, "ritual-led", "premium ARPU moments", 4.05, 5.65, 2.7);
  addMetric(s, "family graph", "built-in referral loop", 7.25, 5.65, 2.7);
  footer(s, 12);

  s = pptx.addSlide();
  addBg(s);
  kicker(s, "Team and use of funds", 0.65, 0.58);
  title(s, "A product-led team building the faith-tech operating layer", 0.65, 0.95, 10.8, 28);
  softBox(s, 0.9, 2.25, 4.2, 2.0, C.white);
  body(s, "Naman Kharbanda", 1.15, 2.52, 2.8, 0.24, 18, C.wine, true);
  body(s, "CEO & CTO\nAI + hardware integration, full-stack product, automation, international commerce growth.", 1.15, 2.95, 3.5, 0.7, 11.2);
  softBox(s, 5.45, 2.25, 4.2, 2.0, C.white);
  body(s, "Praveen Dhingra", 5.7, 2.52, 2.8, 0.24, 18, C.wine, true);
  body(s, "CFO & COO\nFinance, operations, equity markets, customer experience, scaling strategy.", 5.7, 2.95, 3.5, 0.7, 11.2);
  addPandit(s, 10.15, 2.0, 1.7, 2.05);
  body(s, "Use of funds", 0.95, 5.05, 2.2, 0.25, 18, C.gold, true);
  const funds = [["Product + UX", 30], ["R&D / platform IP", 25], ["Backend + infra", 20], ["GTM", 10], ["Working capital", 15]];
  funds.forEach((f, i) => {
    const x = 2.85 + i * 1.85;
    s.addShape(SHAPE.rect, { x, y: 5.25, w: 1.22, h: f[1] / 30 * 0.85, fill: { color: i % 2 ? C.gold : C.wine }, line: { color: i % 2 ? C.gold : C.wine } });
    body(s, `${f[1]}%`, x, 6.15, 1.22, 0.15, 9.5, C.ink, true);
    body(s, f[0], x - 0.18, 6.42, 1.58, 0.2, 7.4, C.muted, true);
  });
  footer(s, 13);

  s = pptx.addSlide();
  addBg(s);
  addImageSafeLogo(s);
  title(s, "The spiritual operating layer for Hindu families globally", 1.15, 1.1, 8.2, 34, C.wine);
  body(s, "Smart Murti begins with immediate access and trust. Over time, it becomes the default system for global Hindu families: guidance, shared ritual, family memory, and eventually dedicated household presence.", 1.18, 3.75, 7.6, 0.72, 16, C.ink);
  body(s, "A trusted family pandit, now instant, affordable, and global.", 1.18, 5.0, 7.6, 0.35, 18, C.gold, true);
  addPandit(s, 8.55, 1.15, 3.15, 3.7);
  body(s, "smartmurti.com  |  support@smartmurti.com", 1.18, 6.23, 5.5, 0.2, 10.5, C.muted, true);
  footer(s, 14);

  const outPath = path.join(OUT, "Smart_Murti_Investor_Pitch_Deck.pptx");
  await pptx.writeFile({ fileName: outPath });
  return outPath;
}

function addImageSafeLogo(slide) {
  slide.addImage({ path: LOGO, x: 1.15, y: 0.55, w: 1.25, h: 0.27 });
}

async function buildHtmlPreview() {
  const html = `<!doctype html>
<html><head><meta charset="utf-8"><style>
@page{size:16in 9in;margin:0}
body{margin:0;background:#ddd;font-family:Aptos,Arial,sans-serif;color:#241A14}
.slide{position:relative;width:1600px;height:900px;background:#${C.cream};page-break-after:always;overflow:hidden}
.logo{position:absolute;left:72px;bottom:32px;width:120px}.pandit{position:absolute;right:105px;top:76px;width:420px}.face{width:86px;border-radius:50%}
.k{font-size:17px;letter-spacing:2px;text-transform:uppercase;color:#${C.gold};font-weight:700}
h1{font-family:Georgia,serif;font-size:64px;line-height:1.04;color:#${C.wine};margin:0}
h2{font-family:Georgia,serif;font-size:48px;line-height:1.08;margin:0;color:#${C.ink}}
p{font-size:26px;line-height:1.25;margin:0;color:#${C.muted}}.small{font-size:18px}.box{border:2px solid #${C.line};border-radius:18px;background:#fff8ea;padding:22px}.wine{color:#${C.wine}}.gold{color:#${C.gold}}.foot{position:absolute;right:70px;bottom:34px;font-size:13px;color:#8D7B66}
.pill{display:inline-block;border:1.5px solid #${C.line};border-radius:999px;padding:10px 18px;font-size:16px;font-weight:700;color:#${C.wine};background:white}
</style></head><body>
${[
  ["Instant Live AI Pandit for Hindu Families Worldwide","Smart Murti gives Hindu families trusted spiritual guidance and live family puja through a multilingual AI Pandit."],
  ["Trusted spiritual access is broken for diaspora families","Geography, time zones, language, and trust turn sacred moments into coordination work."],
  ["Current tools miss the family ritual job","Local pandits, YouTube streams, and astrology apps each solve only one piece. Smart Murti creates the shared ritual layer."],
  ["A trusted family pandit, now instant, affordable, and global","Multilingual guidance, context-aware responses, and WhatsApp re-entry make the first session feel human."],
  ["Real-time voice AI finally meets a real diaspora behavior","The behavior exists. NRI families already coordinate rituals across borders. The platform does not."],
  ["Start with urgent 1:1 Smart Pandit guidance","The wedge is immediate pain: health, protection, peace, family stress, or relationship guidance."],
  ["Live cross-border family puja becomes the premium moment","Once trust is established, the relationship upgrades to shared family rituals."],
  ["A competitor can copy an AI bot","They cannot copy a family’s spiritual memory and accumulated trust."],
  ["The diaspora family organizer","The buyer already values tradition, already spends money on rituals, and already feels the manual coordination pain."],
  ["Wallet sessions compound into premium family usage","Urgent need becomes WhatsApp re-entry, family invite, and live family puja."],
  ["Product foundations are live","Now the investor metrics need to be locked: families reached, paid sessions, repeat usage, family members per puja."],
  ["High-margin digital services with premium ritual upside","Wallet-first guidance creates cash flow. Live family puja creates the premium ARPU moment."],
  ["A product-led team building the faith-tech operating layer","Naman leads product and AI. Praveen leads finance and operations."],
  ["The spiritual operating layer for Hindu families globally","A trusted family pandit, now instant, affordable, and global."]
].map((s,i)=>`<section class="slide"><img src="${LOGO.replaceAll("\\","/")}" class="logo"/><div style="position:absolute;left:90px;top:80px;width:${i===0?760:980}px"><div class="k">${i===0?"Investor pitch":"Smart Murti"}</div><h1 style="font-size:${i===0?66:54}px;margin-top:28px">${s[0]}</h1><p style="margin-top:34px;width:${i===0?650:850}px">${s[1]}</p>${i===0?'<div style="margin-top:40px"><span class="pill">Urgent guidance</span> <span class="pill">Live family puja</span> <span class="pill">WhatsApp re-entry</span></div>':""}</div><img src="${panditFull.replaceAll("\\","/")}" class="pandit"/><div class="foot">${i+1} / 14</div></section>`).join("")}
</body></html>`;
  const htmlPath = path.join(OUT, "Smart_Murti_Investor_Pitch_Deck_preview.html");
  fs.writeFileSync(htmlPath, html);
  return htmlPath;
}

async function main() {
  await prepAssets();
  const pptxPath = await buildPptx();
  const htmlPath = await buildHtmlPreview();
  console.log(JSON.stringify({ pptxPath, htmlPath, panditFull, panditFace }, null, 2));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
