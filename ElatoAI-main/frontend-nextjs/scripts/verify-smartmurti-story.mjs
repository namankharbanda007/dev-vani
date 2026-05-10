import { readFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();

const checks = [
  {
    file: "app/pricing/page.tsx",
    mustInclude: ["NRI Launch Packages", "nriLaunchPackages"],
    mustExclude: ["Rs 5", "Rs 9", "fully production-ready", "/min"],
  },
  {
    file: "app/lib/pricing.ts",
    mustInclude: ["price: 11", "price: 21", "price: 51", "price: 101"],
    mustExclude: ["Rs", "INR"],
  },
  {
    file: "app/wallet/page.tsx",
    mustInclude: ["USD launch packages", "nriLaunchPackages"],
    mustExclude: ["Rs ", "₹", "INR"],
  },
  {
    file: "app/api/billing/deduct/route.ts",
    mustInclude: ["Minimum $"],
    mustExclude: ["₹", "Minimum ₹"],
  },
  {
    file: "app/palm-reading/page.tsx",
    mustInclude: ["Life Line", "Heart Line", "Head Line"],
    mustExclude: ["market invitation", "mavour mysticien gain", "or prediction liness"],
  },
  {
    file: "app/horoscope/page.tsx",
    mustInclude: ["Select a sign to see guidance"],
    mustExclude: ["--%"],
  },
  {
    file: "app/components/SiteFooter.tsx",
    mustInclude: ["Remote-first support"],
    mustExclude: ["Address will be published shortly"],
  },
  {
    file: "app/contact/page.tsx",
    mustInclude: ["Remote-first support"],
    mustExclude: ["will be published shortly"],
  },
  {
    file: "app/landing-2/page.tsx",
    mustInclude: ["redirect(\"/\")"],
    mustExclude: ["TAROT READING", "MATCH MAKING"],
  },
  {
    file: "app/lib/seo.ts",
    mustInclude: ["NRI launch packages"],
    mustExclude: ["prepaid wallet pricing"],
  },
];

const failures = [];

for (const check of checks) {
  const contents = readFileSync(join(root, check.file), "utf8");

  for (const expected of check.mustInclude ?? []) {
    if (!contents.includes(expected)) {
      failures.push(`${check.file} should include "${expected}"`);
    }
  }

  for (const forbidden of check.mustExclude ?? []) {
    if (contents.includes(forbidden)) {
      failures.push(`${check.file} should not include "${forbidden}"`);
    }
  }
}

if (failures.length > 0) {
  console.error("Smart Murti story regression check failed:");
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log("Smart Murti story regression check passed.");
