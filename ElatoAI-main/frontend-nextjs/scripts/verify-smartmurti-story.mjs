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
    mustInclude: ["companyInfo.email", "companyInfo.registeredOffice", "companyInfo.cin"],
    mustExclude: ["Address will be published shortly", "Remote-first support", "support@smartmurti.com"],
  },
  {
    file: "app/contact/page.tsx",
    mustInclude: ["companyInfo.email", "companyInfo.registeredOffice", "companyInfo.cin", "companyInfo.website"],
    mustExclude: ["will be published shortly", "Remote-first support", "support@smartmurti.com"],
  },
  {
    file: "app/lib/company.ts",
    mustInclude: [
      "brandName: \"SMART मूर्ति\"",
      "SMARTMURTI AI PVT LTD",
      "connect@smartmurti.com",
      "Innov8 Okhla, 3rd Floor, 211, Okhla Industrial Estate Phase III, New Delhi 110020",
      "U47912DL2025PTC460200",
    ],
    mustExclude: ["support@smartmurti.com"],
  },
  {
    file: "app/components/brand/BrandLogo.tsx",
    mustInclude: ["companyInfo.brandName", "tracking-normal"],
    mustExclude: ["SMART Murti", "SmartMurti", "/assets/landing/logo.png"],
  },
  {
    file: "app/components/RootHomePage.tsx",
    mustInclude: ["BrandLogo href=\"/\""],
    mustExclude: ["/assets/landing/logo.png", "alt=\"Smart Murti\""],
  },
  {
    file: "app/landing-2/components/Header.tsx",
    mustInclude: ["BrandLogo href=\"/\""],
    mustExclude: ["/assets/landing/logo.png", "alt=\"Smart Murti\""],
  },
  {
    file: "app/pandit/components/CallScreen.tsx",
    mustInclude: ["<BrandLogo href=\"/\" size=\"sm\" />"],
    mustExclude: ["/assets/landing/logo.png", "SmartMurti Logo"],
  },
  {
    file: "app/astrologer/components/CallScreen.tsx",
    mustInclude: ["<BrandLogo href=\"/\" size=\"sm\" />"],
    mustExclude: ["/assets/landing/logo.png", "SmartMurti Logo"],
  },
  {
    file: "app/components/SiteFooter.tsx",
    mustInclude: ["<BrandLogo size=\"lg\"", "companyInfo.email", "companyInfo.registeredOffice", "companyInfo.cin"],
    mustExclude: ["Address will be published shortly", "Remote-first support", "support@smartmurti.com", "SMART Murti"],
  },
  {
    file: "app/lib/seo.ts",
    mustInclude: ["name: companyInfo.brandName", "NRI launch packages"],
    mustExclude: ["name: \"SMART Murti\"", "prepaid wallet pricing"],
  },
  {
    file: "app/manifest.ts",
    mustInclude: ["short_name: siteConfig.name"],
    mustExclude: ["SmartMurti"],
  },
  {
    file: "app/logo/page.tsx",
    mustInclude: ["BrandLogo size=\"xl\""],
    mustExclude: ["Smartmurti"],
  },
  {
    file: "app/landing-2/page.tsx",
    mustInclude: ["redirect(\"/\")"],
    mustExclude: ["TAROT READING", "MATCH MAKING"],
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
