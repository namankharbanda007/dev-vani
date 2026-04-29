const fs = require("fs");
const path = require("path");
const sharp = require(path.join(
  __dirname,
  "..",
  "..",
  "frontend-nextjs",
  "node_modules",
  "sharp"
));

const WIDTH = 1920;
const HEIGHT = 1080;

const repoRoot = path.resolve(__dirname, "..", "..");
const outDir = path.join(__dirname, "rendered-slides");

const assets = {
  panditHero: path.join(repoRoot, "frontend-nextjs", "public", "products", "smart-pandit-home.jpg"),
  panditIsolated: path.join(repoRoot, "frontend-nextjs", "public", "products", "smart-pandit.jpg"),
  panditTemple: path.join(repoRoot, "frontend-nextjs", "public", "products", "pandit-temple.jpg"),
  panditHand: path.join(repoRoot, "frontend-nextjs", "public", "products", "pandit-hand.jpg"),
};

const palette = {
  night: "#111826",
  deep: "#15263f",
  marine: "#223a5d",
  ivory: "#f8f2e8",
  sand: "#eadac2",
  saffron: "#d56b1d",
  saffronSoft: "#efbb80",
  gold: "#f4d39b",
  forest: "#2c473a",
  jade: "#3b6b57",
  smoke: "#dfe5ec",
  ink: "#22314f",
  body: "#5c554d",
  white: "#ffffff",
  blush: "#f6e6d8",
  danger: "#d44e34",
};

const deck = [
  {
    kicker: "LIVE AI PANDIT FOR GLOBAL HINDU FAMILIES",
    title: ["Instant spiritual access", "for Hindu families", "worldwide"],
    body: [
      "A live multilingual AI Pandit for urgent guidance,",
      "voice conversations, and family puja across countries and time zones.",
    ],
    chips: ["Urgent Smart Pandit guidance", "Live family puja", "Multilingual voice"],
    mode: "cover",
    titleSize: 78,
  },
  {
    kicker: "THE PROBLEM",
    title: ["Trusted spiritual access", "is still fragmented"],
    body: [
      "Especially for NRI families, a simple spiritual need becomes a coordination problem.",
    ],
    points: [
      "Local pandits are often unavailable, expensive, or geography-bound.",
      "Calling India means time-zone friction and family coordination overhead.",
      "YouTube is passive. Astrology apps are transactional and solo.",
    ],
    mode: "problem",
  },
  {
    kicker: "STATUS QUO",
    title: ["What people do today", "still leaves a gap"],
    compare: [
      ["Local pandit", "Trusted", "Slow to arrange", "Not global"],
      ["YouTube / livestreams", "Always on", "Passive", "No family interaction"],
      ["Astrology apps", "Convenient", "Transactional", "Not ritual-first"],
    ],
    footer: "Families want trust, immediacy, language comfort, and shared participation in one place.",
    mode: "statusquo",
  },
  {
    kicker: "THE SOLUTION",
    title: ["Like a trusted family pandit,", "except instant, global,", "and affordable"],
    body: [
      "Users can talk to Smart Pandit immediately.",
      "Then bring relatives from India, the US, Canada, Dubai, or anywhere else into the same live puja.",
    ],
    steps: ["Need arises", "Talk to Smart Pandit", "Invite family", "Continue through WhatsApp"],
    mode: "solution",
    titleSize: 72,
  },
  {
    kicker: "PRODUCT",
    title: ["One product,", "three layers of value"],
    cards: [
      ["Urgent guidance", "Health, peace, protection, relationship, and decision support through instant voice or chat."],
      ["Live family puja", "A premium shared ritual room where family members join one guided spiritual session."],
      ["Persistent memory", "Language, family context, ritual history, and recurring needs improve every future session."],
    ],
    mode: "product",
  },
  {
    kicker: "WHY NOW",
    title: ["Three shifts make this", "possible right now"],
    cards: [
      ["01", "Voice AI is finally good enough for emotionally sensitive real-time interaction."],
      ["02", "Global Hindu families already coordinate rituals across borders without a proper product."],
      ["03", "Trust compounds when the system remembers the family's spiritual context over time."],
    ],
    mode: "whynow",
  },
  {
    kicker: "DIFFERENTIATION",
    title: ["Not a generic chatbot", "with a spiritual skin"],
    moat: [
      ["Ritual correctness", "Guidance shaped around sacred flow, not just text answers."],
      ["Family coordination", "Built for many relatives joining one moment, not solo sessions only."],
      ["Multilingual voice", "Comfort and trust increase when the conversation sounds familiar."],
      ["Spiritual memory", "A family's history compounds into a harder-to-copy relationship."],
    ],
    quote: "A competitor can copy a bot. They cannot copy a family's spiritual memory with the product.",
    mode: "moat",
  },
  {
    kicker: "BEACHHEAD CUSTOMER",
    title: ["Start narrow:", "diaspora Hindu families with urgent needs"],
    persona: [
      "Who they are: families abroad managing rituals across cities, countries, and time zones.",
      "When they convert: health scares, protection, peace, family stress, decisions, housewarming, or puja needs.",
      "Why they pay: faster access, lower friction, lower cost, and the whole family can join.",
    ],
    mode: "customer",
  },
  {
    kicker: "GO TO MARKET",
    title: ["Distribution is family sharing,", "not ad theater"],
    loop: [
      "Urgent need drives the first session",
      "WhatsApp brings the user back in",
      "Invite links pull family into puja",
      "Repeat sacred usage builds trust and retention",
    ],
    mode: "gtm",
  },
  {
    kicker: "BUSINESS MODEL",
    title: ["Monetize around", "moments of need"],
    ladder: [
      ["Entry", "One-off guidance sessions", "High-intent first use"],
      ["Repeat", "Wallet / prepaid usage", "Low-friction re-entry"],
      ["Premium", "Live family puja", "Higher-value family ritual moments"],
    ],
    footer: "Subscription can come later after repeat sacred usage is proven.",
    mode: "business",
  },
  {
    kicker: "CURRENT STATUS",
    title: ["Product built.", "Now show the sharpest proof."],
    built: ["Web experience", "Mobile app", "AI Pandit voice + chat", "Family room + live puja"],
    placeholders: ["Total users", "Paid sessions", "Repeat paid usage", "Family session participation"],
    mode: "traction",
  },
  {
    kicker: "VISION",
    title: ["Become the spiritual operating layer", "for Hindu families globally"],
    arc: [
      "Urgent guidance",
      "Live family puja",
      "Persistent family memory",
      "Long-term trusted relationship",
      "Future hardware layer",
    ],
    mode: "vision",
  },
  {
    kicker: "THANK YOU",
    title: ["A trusted family pandit,", "now instant, affordable,", "and global"],
    body: [
      "Smartmurti AI Private Limited",
      "www.smartmurti.com",
      "Built for FutureX / investor conversations",
    ],
    mode: "closing",
    titleSize: 74,
  },
];

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function readDataUri(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const mime =
    ext === ".png"
      ? "image/png"
      : ext === ".jpg" || ext === ".jpeg"
        ? "image/jpeg"
        : "application/octet-stream";
  return `data:${mime};base64,${fs.readFileSync(filePath).toString("base64")}`;
}

function escapeXml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function wrapText(text, maxChars) {
  const lines = [];
  const words = String(text).split(/\s+/).filter(Boolean);
  let line = "";
  for (const word of words) {
    const candidate = line ? `${line} ${word}` : word;
    if (!line || candidate.length <= maxChars) {
      line = candidate;
    } else {
      lines.push(line);
      line = word;
    }
  }
  if (line) {
    lines.push(line);
  }
  return lines;
}

function textBlock(lines, x, y, size, lineHeight, fill, family, weight = 400, letterSpacing = 0) {
  return `<text x="${x}" y="${y}" fill="${fill}" font-family="${family}" font-size="${size}" font-weight="${weight}" letter-spacing="${letterSpacing}">${
    lines
      .map((line, index) => {
        const dy = index === 0 ? 0 : lineHeight;
        return `<tspan x="${x}" dy="${dy}">${escapeXml(line)}</tspan>`;
      })
      .join("")
  }</text>`;
}

function brandLight(x = 116, y = 96, fill = palette.white) {
  return `
    ${textBlock(["SMART MURTI"], x, y, 26, 26, fill, "Arial", 700, 2)}
    ${textBlock(["SMARTMURTI AI PRIVATE LIMITED"], x, y + 38, 12, 16, fill, "Arial", 500, 1.8)}
  `;
}

function brandDark(x = 116, y = 96) {
  return `
    ${textBlock(["SMART MURTI"], x, y, 26, 26, palette.ink, "Arial", 700, 2)}
    ${textBlock(["SMARTMURTI AI PRIVATE LIMITED"], x, y + 38, 12, 16, palette.saffron, "Arial", 600, 1.8)}
  `;
}

function kicker(text, x, y, fill = palette.saffron) {
  return `
    ${textBlock([text], x, y, 22, 24, fill, "Arial", 700, 2)}
    <rect x="${x}" y="${y + 18}" width="108" height="4" rx="2" fill="${fill}" />
  `;
}

function panel(x, y, w, h, fill, stroke = "none", radius = 28, opacity = 1) {
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${radius}" fill="${fill}" fill-opacity="${opacity}" stroke="${stroke}" />`;
}

function chip(text, x, y, fill = "rgba(255,255,255,0.08)", stroke = "rgba(255,255,255,0.15)", color = palette.white) {
  const width = 180 + text.length * 4.8;
  return `
    <rect x="${x}" y="${y}" width="${width}" height="48" rx="24" fill="${fill}" stroke="${stroke}" />
    ${textBlock([text], x + 24, y + 31, 20, 22, color, "Arial", 600)}
  `;
}

function imageBox(href, x, y, w, h, radius = 34, stroke = "none") {
  const clipId = `clip-${Math.random().toString(36).slice(2)}`;
  return `
    <defs>
      <clipPath id="${clipId}">
        <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${radius}" />
      </clipPath>
    </defs>
    ${panel(x + 10, y + 14, w, h, "#000000", "none", radius, 0.18)}
    <image href="${href}" x="${x}" y="${y}" width="${w}" height="${h}" preserveAspectRatio="xMidYMid slice" clip-path="url(#${clipId})" />
    ${stroke !== "none" ? `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${radius}" fill="none" stroke="${stroke}" stroke-width="2"/>` : ""}
  `;
}

function listRows(items, x, y, color = palette.body, bullet = palette.saffron, maxChars = 54, size = 27, gap = 78) {
  return items
    .map((item, index) => {
      const rowY = y + index * gap;
      return `
        <circle cx="${x}" cy="${rowY - 12}" r="7" fill="${bullet}" />
        ${textBlock(wrapText(item, maxChars), x + 26, rowY, size, size + 10, color, "Arial", 400)}
      `;
    })
    .join("");
}

function stepNode(index, label, x, y, activeFill) {
  return `
    ${panel(x, y, 350, 120, palette.white, "rgba(255,255,255,0.08)", 26, 0.95)}
    <circle cx="${x + 54}" cy="${y + 60}" r="28" fill="${activeFill}" />
    ${textBlock([String(index)], x + 45, y + 71, 26, 28, palette.white, "Arial", 700)}
    ${textBlock(wrapText(label, 22), x + 104, y + 52, 27, 34, palette.ink, "Arial", 700)}
  `;
}

function ladderCard(title, subtitle, body, x, y, accent) {
  return `
    ${panel(x, y, 500, 280, palette.ivory, "rgba(34,49,79,0.1)", 28, 1)}
    <rect x="${x}" y="${y}" width="500" height="12" rx="12" fill="${accent}" />
    ${textBlock([title], x + 34, y + 76, 22, 24, accent, "Arial", 700, 2)}
    ${textBlock(wrapText(subtitle, 24), x + 34, y + 142, 44, 50, palette.ink, "Georgia", 700)}
    ${textBlock(wrapText(body, 34), x + 34, y + 226, 26, 34, palette.body, "Arial", 400)}
  `;
}

function slideShell(index) {
  const slide = deck[index];
  const heroScene = readDataUri(assets.panditTemple);
  const panditCutout = readDataUri(assets.panditIsolated);
  const panditRoom = readDataUri(assets.panditHero);
  const panditFigure = readDataUri(assets.panditHand);

  if (slide.mode === "cover") {
    const coverBody = wrapText(slide.body.join(" "), 54);
    return `
      <svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}">
        <defs>
          <linearGradient id="coverBg" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stop-color="${palette.night}" />
            <stop offset="55%" stop-color="${palette.deep}" />
            <stop offset="100%" stop-color="${palette.jade}" />
          </linearGradient>
          <linearGradient id="coverOverlay" x1="0" x2="1">
            <stop offset="0%" stop-color="rgba(17,24,38,0.96)" />
            <stop offset="62%" stop-color="rgba(17,24,38,0.74)" />
            <stop offset="100%" stop-color="rgba(17,24,38,0.18)" />
          </linearGradient>
        </defs>
        <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#coverBg)" />
        <image href="${heroScene}" x="0" y="0" width="${WIDTH}" height="${HEIGHT}" preserveAspectRatio="xMidYMid slice" opacity="0.3"/>
        <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#coverOverlay)" />
        <circle cx="1710" cy="148" r="240" fill="${palette.saffron}" opacity="0.12" />
        <circle cx="1710" cy="148" r="180" fill="${palette.gold}" opacity="0.1" />
        ${brandLight()}
        ${kicker(slide.kicker, 116, 162, palette.gold)}
        ${textBlock(slide.title, 116, 420, 88, 100, palette.white, "Georgia", 700)}
        ${textBlock(coverBody, 116, 706, 34, 42, "rgba(255,255,255,0.85)", "Arial", 400)}
        ${chip(slide.chips[0], 116, 856, "rgba(255,255,255,0.08)", "rgba(255,255,255,0.12)")}
        ${chip(slide.chips[1], 444, 856, "rgba(255,255,255,0.08)", "rgba(255,255,255,0.12)")}
        ${chip(slide.chips[2], 718, 856, "rgba(255,255,255,0.08)", "rgba(255,255,255,0.12)")}
        ${imageBox(heroScene, 1188, 126, 622, 796, 42)}
      </svg>
    `;
  }

  if (slide.mode === "problem") {
    const problemBody = wrapText(slide.body.join(" "), 52);
    const painQuote = wrapText(
      "The real pain is not faith. It is access, coordination, and trust at the moment of need.",
      28
    );
    return `
      <svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}">
        <rect width="${WIDTH}" height="${HEIGHT}" fill="${palette.ivory}" />
        <rect x="1120" y="0" width="800" height="${HEIGHT}" fill="${palette.night}" />
        <circle cx="1480" cy="870" r="360" fill="${palette.saffron}" opacity="0.14" />
        ${brandDark()}
        ${kicker(slide.kicker, 116, 162)}
        ${textBlock(slide.title, 116, 310, 80, 92, palette.ink, "Georgia", 700)}
        ${textBlock(problemBody, 116, 518, 34, 42, palette.body, "Arial", 400)}
        ${listRows(slide.points, 132, 650)}
        ${panel(1170, 126, 634, 250, "rgba(255,255,255,0.06)", "rgba(255,255,255,0.08)", 30)}
        ${textBlock(["London"], 1212, 212, 28, 34, palette.white, "Arial", 700)}
        ${textBlock(["7:30 PM"], 1212, 258, 28, 34, palette.white, "Arial", 700)}
        ${textBlock(["Parents need a puja tonight"], 1212, 300, 18, 24, "rgba(255,255,255,0.72)", "Arial", 400)}
        ${textBlock(["Delhi"], 1488, 212, 28, 34, palette.white, "Arial", 700)}
        ${textBlock(["12:00 AM"], 1488, 258, 28, 34, palette.white, "Arial", 700)}
        ${textBlock(["Grandparents are asleep"], 1488, 300, 18, 24, "rgba(255,255,255,0.72)", "Arial", 400)}
        ${panel(1170, 432, 634, 452, "rgba(255,255,255,0.06)", "rgba(255,255,255,0.08)", 30)}
        ${textBlock(painQuote, 1212, 530, 36, 46, palette.white, "Georgia", 700)}
        ${imageBox(panditFigure, 1420, 638, 244, 274, 30)}
      </svg>
    `;
  }

  if (slide.mode === "statusquo") {
    return `
      <svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}">
        <rect width="${WIDTH}" height="${HEIGHT}" fill="${palette.night}" />
        <rect x="0" y="0" width="${WIDTH}" height="180" fill="${palette.deep}" />
        ${brandLight()}
        ${kicker(slide.kicker, 116, 162, palette.saffronSoft)}
        ${textBlock(slide.title, 116, 322, 76, 86, palette.white, "Georgia", 700)}
        ${slide.compare
          .map((row, i) => {
            const x = 116 + i * 566;
            return `
              ${panel(x, 420, 500, 420, "rgba(255,255,255,0.04)", "rgba(255,255,255,0.09)", 30)}
              <rect x="${x}" y="420" width="500" height="12" rx="12" fill="${i === 0 ? palette.gold : i === 1 ? palette.saffron : palette.jade}" />
              ${textBlock([row[0]], x + 34, 506, 34, 38, palette.white, "Georgia", 700)}
              ${listRows([row[1], row[2], row[3]], x + 50, 600, "rgba(255,255,255,0.8)", i === 0 ? palette.gold : i === 1 ? palette.saffronSoft : "#7fd2ac", 26, 84)}
            `;
          })
          .join("")}
        ${panel(116, 900, 1688, 86, "rgba(255,255,255,0.07)", "rgba(255,255,255,0.12)", 22)}
        ${textBlock([slide.footer], 160, 954, 28, 32, palette.white, "Arial", 600)}
      </svg>
    `;
  }

  if (slide.mode === "solution") {
    const solutionBody = wrapText(slide.body.join(" "), 58);
    return `
      <svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}">
        <defs>
          <linearGradient id="sol" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stop-color="${palette.ivory}" />
            <stop offset="100%" stop-color="${palette.blush}" />
          </linearGradient>
        </defs>
        <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#sol)" />
        <circle cx="1590" cy="136" r="230" fill="${palette.saffronSoft}" opacity="0.36" />
        ${brandDark()}
        ${kicker(slide.kicker, 116, 162)}
        ${textBlock(slide.title, 116, 312, 72, 82, palette.ink, "Georgia", 700)}
        ${textBlock(solutionBody, 116, 556, 31, 40, palette.body, "Arial", 400)}
        <path d="M180 782 C460 706, 790 862, 1070 782 S1630 706, 1760 782" fill="none" stroke="${palette.saffron}" stroke-width="4" stroke-dasharray="10 12"/>
        ${stepNode(1, slide.steps[0], 116, 736, palette.saffron)}
        ${stepNode(2, slide.steps[1], 498, 668, palette.ink)}
        ${stepNode(3, slide.steps[2], 880, 736, palette.forest)}
        ${stepNode(4, slide.steps[3], 1262, 668, palette.saffron)}
        ${imageBox(heroScene, 1370, 180, 378, 510, 34)}
      </svg>
    `;
  }

  if (slide.mode === "product") {
    return `
      <svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}">
        <rect width="${WIDTH}" height="${HEIGHT}" fill="${palette.deep}" />
        <rect x="0" y="740" width="${WIDTH}" height="340" fill="${palette.ivory}" />
        ${brandLight()}
        ${kicker(slide.kicker, 116, 162, palette.gold)}
        ${textBlock(slide.title, 116, 304, 78, 88, palette.white, "Georgia", 700)}
        ${deck[4].cards
          .map((card, idx) => {
            const x = 116 + idx * 566;
            const topBand = idx === 0 ? palette.saffron : idx === 1 ? palette.gold : palette.jade;
            return `
              ${panel(x, 430, 500, 340, palette.white, "rgba(255,255,255,0.08)", 30)}
              <rect x="${x}" y="430" width="500" height="14" rx="14" fill="${topBand}" />
              ${textBlock([card[0]], x + 34, 514, 38, 42, palette.ink, "Georgia", 700)}
              ${textBlock(wrapText(card[1], 34), x + 34, 606, 28, 38, palette.body, "Arial", 400)}
            `;
          })
          .join("")}
        ${imageBox(panditCutout, 1452, 182, 276, 230, 26)}
      </svg>
    `;
  }

  if (slide.mode === "whynow") {
    return `
      <svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}">
        <rect width="${WIDTH}" height="${HEIGHT}" fill="${palette.ivory}" />
        <rect x="1180" y="0" width="740" height="${HEIGHT}" fill="${palette.forest}" />
        ${brandDark()}
        ${kicker(slide.kicker, 116, 162)}
        ${textBlock(slide.title, 116, 304, 78, 88, palette.ink, "Georgia", 700)}
        ${slide.cards
          .map((card, idx) => {
            const y = 430 + idx * 190;
            return `
              ${panel(116, y, 930, 150, palette.white, "rgba(34,49,79,0.08)", 26)}
              ${textBlock([card[0]], 156, y + 74, 26, 28, palette.saffron, "Arial", 700, 2)}
              ${textBlock(wrapText(card[1], 52), 256, y + 66, 32, 40, palette.ink, "Arial", 600)}
            `;
          })
          .join("")}
        ${imageBox(panditRoom, 1274, 144, 552, 792, 34)}
      </svg>
    `;
  }

  if (slide.mode === "moat") {
    const moatQuote = wrapText(deck[6].quote, 26);
    return `
      <svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}">
        <rect width="${WIDTH}" height="${HEIGHT}" fill="${palette.ivory}" />
        ${brandDark()}
        ${kicker(slide.kicker, 116, 162)}
        ${textBlock(slide.title, 116, 304, 78, 88, palette.ink, "Georgia", 700)}
        ${textBlock(["Smart Murti is a vertical AI system built around ritual correctness,", "family coordination, multilingual voice, and persistent spiritual memory."], 116, 494, 32, 40, palette.body, "Arial", 400)}
        ${panel(108, 584, 760, 364, palette.white, "rgba(34,49,79,0.08)", 30)}
        ${panel(940, 584, 872, 364, palette.deep, "none", 30)}
        ${deck[6].moat
          .map((item, idx) => {
            const col = idx % 2;
            const row = Math.floor(idx / 2);
            const x = 156 + col * 360;
            const y = 674 + row * 146;
            return `
              <circle cx="${x}" cy="${y - 14}" r="9" fill="${palette.saffron}" />
              ${textBlock([item[0]], x + 26, y - 2, 30, 34, palette.ink, "Arial", 700)}
              ${textBlock(wrapText(item[1], 24), x + 26, y + 38, 22, 28, palette.body, "Arial", 400)}
            `;
          })
          .join("")}
        ${textBlock(["The moat is not the avatar."], 990, 672, 28, 30, palette.gold, "Arial", 700, 2)}
        ${textBlock(moatQuote, 990, 770, 34, 42, palette.white, "Georgia", 700)}
        ${imageBox(panditCutout, 1462, 650, 220, 250, 24)}
      </svg>
    `;
  }

  if (slide.mode === "customer") {
    return `
      <svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}">
        <rect width="${WIDTH}" height="${HEIGHT}" fill="${palette.deep}" />
        <image href="${heroScene}" x="0" y="0" width="${WIDTH}" height="${HEIGHT}" preserveAspectRatio="xMidYMid slice" opacity="0.22"/>
        <rect width="${WIDTH}" height="${HEIGHT}" fill="rgba(21,38,63,0.82)" />
        ${brandLight()}
        ${kicker(slide.kicker, 116, 162, palette.gold)}
        ${textBlock(slide.title, 116, 304, 76, 88, palette.white, "Georgia", 700)}
        ${panel(116, 420, 1040, 452, "rgba(255,255,255,0.08)", "rgba(255,255,255,0.16)", 32)}
        ${listRows(deck[7].persona, 150, 534, palette.white, palette.gold, 62, 28, 126)}
        ${panel(1266, 420, 554, 452, "rgba(255,255,255,0.08)", "rgba(255,255,255,0.14)", 32)}
        ${textBlock(["Ideal first customer"], 1304, 492, 24, 28, palette.gold, "Arial", 700, 2)}
        ${textBlock(["NRI Hindu family", "with urgent spiritual", "or ritual needs"], 1304, 624, 54, 62, palette.white, "Georgia", 700)}
      </svg>
    `;
  }

  if (slide.mode === "gtm") {
    return `
      <svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}">
        <rect width="${WIDTH}" height="${HEIGHT}" fill="${palette.ivory}" />
        ${brandDark()}
        ${kicker(slide.kicker, 116, 162)}
        ${textBlock(slide.title, 116, 304, 76, 88, palette.ink, "Georgia", 700)}
        <circle cx="960" cy="720" r="244" fill="${palette.deep}" />
        <circle cx="960" cy="720" r="154" fill="${palette.ivory}" />
        ${textBlock(["WhatsApp", "re-entry"], 904, 708, 34, 40, palette.ink, "Arial", 700)}
        ${["0,0", "1,0", "0,1", "1,1"]
          .map((coords, idx) => {
            const [col, row] = coords.split(",").map(Number);
            const x = col === 0 ? 286 : 1224;
            const y = row === 0 ? 486 : 792;
            return `
              ${panel(x - 180, y - 70, 360, 140, palette.white, "rgba(34,49,79,0.1)", 24)}
              ${textBlock(wrapText(deck[8].loop[idx], 22), x - 136, y - 4, 27, 34, palette.ink, "Arial", 700)}
              <path d="M${col === 0 ? x + 180 : x - 180} ${y} Q960 720 ${col === 0 ? 776 : 1144} ${y + (row === 0 ? 110 : -110)}" fill="none" stroke="${idx % 2 === 0 ? palette.saffron : palette.forest}" stroke-width="4" stroke-dasharray="10 10"/>
            `;
          })
          .join("")}
      </svg>
    `;
  }

  if (slide.mode === "business") {
    return `
      <svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}">
        <rect width="${WIDTH}" height="${HEIGHT}" fill="${palette.night}" />
        ${brandLight()}
        ${kicker(slide.kicker, 116, 162, palette.saffronSoft)}
        ${textBlock(slide.title, 116, 304, 76, 88, palette.white, "Georgia", 700)}
        ${ladderCard(deck[9].ladder[0][0], deck[9].ladder[0][1], deck[9].ladder[0][2], 116, 430, palette.saffron)}
        ${ladderCard(deck[9].ladder[1][0], deck[9].ladder[1][1], deck[9].ladder[1][2], 710, 366, palette.gold)}
        ${ladderCard(deck[9].ladder[2][0], deck[9].ladder[2][1], deck[9].ladder[2][2], 1304, 300, palette.jade)}
        ${panel(116, 858, 1688, 96, "rgba(255,255,255,0.08)", "rgba(255,255,255,0.14)", 24)}
        ${textBlock([deck[9].footer], 160, 918, 28, 34, palette.white, "Arial", 600)}
      </svg>
    `;
  }

  if (slide.mode === "traction") {
    return `
      <svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}">
        <rect width="${WIDTH}" height="${HEIGHT}" fill="${palette.ivory}" />
        <rect x="0" y="0" width="${WIDTH}" height="220" fill="${palette.night}" />
        ${brandLight()}
        ${kicker(slide.kicker, 116, 162, palette.saffronSoft)}
        ${textBlock(slide.title, 116, 332, 76, 88, palette.ink, "Georgia", 700)}
        ${panel(116, 436, 740, 468, palette.white, "rgba(34,49,79,0.08)", 28)}
        ${textBlock(["Built already"], 156, 506, 26, 28, palette.saffron, "Arial", 700, 2)}
        ${listRows(deck[10].built, 170, 604, palette.ink, palette.forest, 28, 28, 82)}
        ${panel(926, 436, 878, 468, palette.deep, "none", 28)}
        ${textBlock(["Add live metrics before sending"], 972, 506, 30, 34, palette.gold, "Arial", 700, 2)}
        ${deck[10].placeholders
          .map((label, idx) => {
            const x = idx % 2 === 0 ? 972 : 1388;
            const y = idx < 2 ? 588 : 758;
            return `
              ${panel(x, y, 348, 116, "rgba(255,255,255,0.08)", "rgba(255,255,255,0.16)", 22)}
              ${textBlock([label], x + 26, y + 48, 22, 26, palette.saffronSoft, "Arial", 600, 1)}
              ${textBlock(["--"], x + 26, y + 90, 44, 48, palette.white, "Georgia", 700)}
            `;
          })
          .join("")}
      </svg>
    `;
  }

  if (slide.mode === "vision") {
    return `
      <svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}">
        <rect width="${WIDTH}" height="${HEIGHT}" fill="${palette.deep}" />
        <circle cx="260" cy="920" r="280" fill="${palette.saffron}" opacity="0.16" />
        ${brandLight()}
        ${kicker(slide.kicker, 116, 162, palette.gold)}
        ${textBlock(slide.title, 116, 304, 76, 88, palette.white, "Georgia", 700)}
        ${deck[11].arc
          .map((step, idx) => {
            const x = 136 + idx * 332;
            const y = 680 - idx * 58;
            const fill = idx < 4 ? palette.white : "rgba(255,255,255,0.1)";
            const stroke = idx < 4 ? "rgba(255,255,255,0.1)" : "rgba(244,211,155,0.28)";
            const textColor = idx < 4 ? palette.ink : palette.gold;
            return `
              ${panel(x, y, 284, 118, fill, stroke, 24)}
              ${textBlock(wrapText(step, 18), x + 26, y + 52, 28, 34, textColor, "Arial", idx < 4 ? 700 : 600)}
            `;
          })
          .join("")}
      </svg>
    `;
  }

  if (slide.mode === "closing") {
    return `
      <svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}">
        <rect width="${WIDTH}" height="${HEIGHT}" fill="${palette.night}" />
        <image href="${heroScene}" x="0" y="0" width="${WIDTH}" height="${HEIGHT}" preserveAspectRatio="xMidYMid slice" opacity="0.32"/>
        <rect width="${WIDTH}" height="${HEIGHT}" fill="rgba(17,24,38,0.66)" />
        ${brandLight()}
        ${kicker(slide.kicker, 116, 162, palette.gold)}
        ${textBlock(slide.title, 116, 404, 80, 92, palette.white, "Georgia", 700)}
        ${textBlock(slide.body, 116, 740, 34, 42, "rgba(255,255,255,0.85)", "Arial", 400)}
        ${panel(116, 848, 612, 74, "rgba(255,255,255,0.08)", "rgba(255,255,255,0.16)", 22)}
        ${textBlock(["support@smartmurti.com"], 148, 894, 26, 28, palette.gold, "Arial", 700)}
        ${imageBox(heroScene, 1228, 170, 582, 720, 34)}
      </svg>
    `;
  }

  throw new Error(`Unknown slide mode: ${slide.mode}`);
}

async function renderSlides() {
  ensureDir(outDir);
  for (let i = 0; i < deck.length; i += 1) {
    const svg = slideShell(i);
    const output = path.join(outDir, `image${i + 1}.png`);
    await sharp(Buffer.from(svg)).png().toFile(output);
  }
}

async function main() {
  ensureDir(outDir);
  await renderSlides();
  const manifest = {
    generatedAt: new Date().toISOString(),
    slideCount: deck.length,
    renderedSlides: deck.map((_, idx) => path.join(outDir, `image${idx + 1}.png`)),
  };
  fs.writeFileSync(path.join(__dirname, "deck-manifest.json"), JSON.stringify(manifest, null, 2));
  console.log(JSON.stringify(manifest, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
