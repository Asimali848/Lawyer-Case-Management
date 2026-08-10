const fs = require("fs");
const path = require("path");

const siteUrl = "https://judgmentcalc.com";
const distDir = path.join(process.cwd(), "dist");
const templatePath = path.join(distDir, "index.html");

const pages = [
  {
    path: "/about-us/",
    title: "About Us",
    description:
      "Learn the story behind JudgmentCalc, attorney-built judgment interest software designed to help attorneys calculate interest, manage judgment cases, and simplify judgment enforcement.",
  },
  {
    path: "/contact-us/",
    title: "Contact Us JudgmentCalc | Support & Consultation",
    description:
      "Contact Us JudgmentCalc for product questions, technical support, pricing, or to book a consultation. We're here to help attorneys and law firms.",
  },
  {
    path: "/interest-rate/",
    title: "Post-Judgment Interest Rates | JudgmentCalc",
    description:
      "Review current and historical post-judgment interest rates for accurate judgment interest calculations and enforcement planning.",
  },
  {
    path: "/privacy-policy/",
    title: "Privacy Policy | JudgmentCalc",
    description:
      "Read the JudgmentCalc Privacy Policy to learn how we collect, use, store, and protect your personal information when using our website and services.",
  },
  {
    path: "/terms-and-conditions/",
    title: "Terms & Conditions | JudgmentCalc",
    description:
      "Read the JudgmentCalc Terms & Conditions to understand our website policies, subscription terms, billing, account responsibilities, and acceptable use of our platform.",
  },
];

function escapeAttribute(value) {
  return value.replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}

function replaceMeta(html, selector, value) {
  const escaped = escapeAttribute(value);
  const pattern = new RegExp(`(<meta\\s+${selector}\\s+content=")[^"]*("\\s*\\/?>)`, "i");
  return html.replace(pattern, `$1${escaped}$2`);
}

function renderPage(template, page) {
  const url = `${siteUrl}${page.path}`;
  let html = template.replace(/<title>[^<]*<\/title>/i, `<title>${page.title}</title>`);
  html = replaceMeta(html, 'name="description"', page.description);
  html = replaceMeta(html, 'property="og:title"', page.title);
  html = replaceMeta(html, 'property="og:description"', page.description);
  html = replaceMeta(html, 'property="og:url"', url);
  html = replaceMeta(html, 'name="twitter:title"', page.title);
  html = replaceMeta(html, 'name="twitter:description"', page.description);
  html = html.replace(/(<link\s+rel="canonical"\s+href=")[^"]*("\s*\/?>)/i, `$1${url}$2`);
  return html;
}

if (!fs.existsSync(templatePath)) {
  throw new Error("dist/index.html does not exist. Run this script after the Vite build.");
}

const template = fs.readFileSync(templatePath, "utf8");

for (const page of pages) {
  const outputDir = path.join(distDir, page.path.slice(1));
  fs.mkdirSync(outputDir, { recursive: true });
  fs.writeFileSync(path.join(outputDir, "index.html"), renderPage(template, page), "utf8");
}

console.log(`Generated server-visible SEO metadata for ${pages.length} public routes.`);
