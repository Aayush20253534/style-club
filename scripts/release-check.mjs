import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const checkDist = process.argv.includes("--dist");
const checkLive = process.argv.includes("--live");
const errors = [];

const EXPECTED_TITLE = "Style Club Prayagraj | Clothing for Men, Women & Kids";
const EXPECTED_DESCRIPTION =
  "Explore men’s, women’s and kids’ fashion at Style Club, with stores in Katra, Civil Lines, Naini and Phaphamau in Prayagraj, plus Bharwari in Kaushambi.";

const EXPECTED_ROUTES = [
  "/",
  "/_not-found",
  "/apple-icon",
  "/icon",
  "/robots.txt",
  "/sitemap.xml",
];

const INTERNAL_APP_ROUTES = new Set(["/_global-error"]);

const STORE_IDS = ["katra", "civil-lines", "naini", "phaphamau", "bharwari"];
const STORE_NAMES = ["Katra", "Civil Lines", "Naini", "Phaphamau", "Bharwari"];

const CRITICAL_ASSETS = [
  "public/og.jpg",
  "public/brand/storefront.jpg",
  "public/brand/interior.jpg",
  "public/sequence/desktop/f_001.webp",
  "public/sequence/desktop/f_301.webp",
  "public/sequence/mobile/f_001.webp",
  "public/sequence/mobile/f_151.webp",
  "public/sequence/final-desktop.webp",
  "public/sequence/final-mobile.webp",
];

const fail = (message) => errors.push(message);
const fileExists = (file) => fs.existsSync(path.join(root, file));
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
const normalPath = (file) => file.split(path.sep).join("/");

function walk(relativeDir) {
  const absolute = path.join(root, relativeDir);
  if (!fs.existsSync(absolute)) return [];

  const files = [];
  for (const entry of fs.readdirSync(absolute, { withFileTypes: true })) {
    const relative = path.join(relativeDir, entry.name);
    if (entry.isDirectory()) files.push(...walk(relative));
    else files.push(normalPath(relative));
  }
  return files;
}

function finish(label) {
  if (errors.length) {
    console.error(`[release] ${label} failed:`);
    for (const error of errors) console.error(`- ${error}`);
    process.exit(1);
  }
  console.log(`[release] ${label} passed.`);
}

function assertIncludes(content, snippet, label) {
  if (!content.includes(snippet)) fail(`${label} is missing ${snippet}.`);
}

function decodeHtmlText(value) {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#(?:39|x27);/gi, "'")
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

function assertRenderedTitle(html, label) {
  const match = html.match(/<title>([\s\S]*?)<\/title>/i);
  if (!match) {
    fail(`${label} is missing <title>.`);
    return;
  }
  const actual = decodeHtmlText(match[1].trim());
  if (actual !== EXPECTED_TITLE) {
    fail(`${label} title mismatch. Expected "${EXPECTED_TITLE}", found "${actual}".`);
  }
}

function schemaTypes(value) {
  const types = Array.isArray(value?.["@type"]) ? value["@type"] : [value?.["@type"]];
  return new Set(types.filter(Boolean));
}

function validateJsonLd(jsonLd, label) {
  if (!jsonLd || jsonLd["@context"] !== "https://schema.org") {
    fail(`${label}: JSON-LD must use the Schema.org context.`);
    return;
  }

  const graph = Array.isArray(jsonLd["@graph"]) ? jsonLd["@graph"] : [];
  if (!graph.length) {
    fail(`${label}: JSON-LD @graph is missing.`);
    return;
  }

  const findType = (type) => graph.find((node) => schemaTypes(node).has(type));
  if (!findType("Organization")) fail(`${label}: Organization entity is missing.`);
  if (!findType("WebSite")) fail(`${label}: WebSite entity is missing.`);
  if (!findType("WebPage")) fail(`${label}: WebPage entity is missing.`);

  const stores = graph.filter((node) => schemaTypes(node).has("ClothingStore"));
  if (stores.length !== 5) {
    fail(`${label}: expected 5 ClothingStore entities, found ${stores.length}.`);
  }

  const ids = new Set();
  for (const store of stores) {
    if (typeof store["@id"] !== "string") {
      fail(`${label}: ClothingStore is missing a stable @id.`);
    } else if (ids.has(store["@id"])) {
      fail(`${label}: duplicate ClothingStore @id ${store["@id"]}.`);
    } else {
      ids.add(store["@id"]);
    }

    if (!store.address || store.address["@type"] !== "PostalAddress") {
      fail(`${label}: ${store.name ?? "ClothingStore"} is missing PostalAddress.`);
    }
    if (!store.parentOrganization?.["@id"]) {
      fail(`${label}: ${store.name ?? "ClothingStore"} is missing parentOrganization.`);
    }
  }

  for (const name of STORE_NAMES) {
    if (!stores.some((store) => store.name === `Style Club ${name}`)) {
      fail(`${label}: Style Club ${name} entity is missing.`);
    }
  }

  const forbiddenTypes = ["Product", "Offer", "AggregateRating", "Review"];
  for (const type of forbiddenTypes) {
    if (graph.some((node) => schemaTypes(node).has(type))) {
      fail(`${label}: unverified ${type} structured data must not be published.`);
    }
  }
}

function extractJsonLd(html) {
  const scripts = [];
  const pattern = /<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  for (const match of html.matchAll(pattern)) {
    try {
      scripts.push(JSON.parse(match[1]));
    } catch (error) {
      fail(`Rendered JSON-LD is invalid JSON: ${error instanceof Error ? error.message : String(error)}.`);
    }
  }
  return scripts;
}

function checkSource() {
  const requiredFiles = [
    "app/layout.tsx",
    "app/page.tsx",
    "app/robots.ts",
    "app/sitemap.ts",
    "lib/site.ts",
    "lib/structured-data.ts",
    "next.config.ts",
  ];

  for (const file of requiredFiles) {
    if (!fileExists(file)) fail(`Required release file is missing: ${file}.`);
  }
  for (const asset of CRITICAL_ASSETS) {
    if (!fileExists(asset)) fail(`Critical public asset is missing: ${asset}.`);
  }

  const pageFiles = walk("app").filter((file) => file.endsWith("/page.tsx") || file === "app/page.tsx");
  if (pageFiles.length !== 1 || pageFiles[0] !== "app/page.tsx") {
    fail(`Single-page contract violated. Found page routes: ${pageFiles.join(", ") || "none"}.`);
  }

  const desktopFrames = fileExists("public/sequence/desktop")
    ? fs.readdirSync(path.join(root, "public/sequence/desktop")).filter((file) => /^f_\d{3}\.webp$/.test(file))
    : [];
  const mobileFrames = fileExists("public/sequence/mobile")
    ? fs.readdirSync(path.join(root, "public/sequence/mobile")).filter((file) => /^f_\d{3}\.webp$/.test(file))
    : [];

  if (desktopFrames.length !== 301) {
    fail(`Desktop film must contain 301 frames; found ${desktopFrames.length}.`);
  }
  if (mobileFrames.length !== 151) {
    fail(`Mobile film must contain 151 frames; found ${mobileFrames.length}.`);
  }

  if (fileExists("app/layout.tsx")) {
    const layout = read("app/layout.tsx");
    assertIncludes(layout, EXPECTED_TITLE, "app/layout.tsx");
    assertIncludes(layout, EXPECTED_DESCRIPTION, "app/layout.tsx");
    assertIncludes(layout, "alternates: { canonical: SITE_URL }", "app/layout.tsx");
    assertIncludes(layout, 'index: true', "app/layout.tsx");
    assertIncludes(layout, 'follow: true', "app/layout.tsx");
    assertIncludes(layout, 'openGraph:', "app/layout.tsx");
    assertIncludes(layout, 'twitter:', "app/layout.tsx");
    assertIncludes(layout, "buildSiteJsonLd(SITE_URL)", "app/layout.tsx");
    assertIncludes(layout, "serializeJsonLd(jsonLd)", "app/layout.tsx");
  }

  if (fileExists("app/robots.ts")) {
    const robots = read("app/robots.ts");
    assertIncludes(robots, 'allow: "/"', "app/robots.ts");
    assertIncludes(robots, 'sitemap: `${base}/sitemap.xml`', "app/robots.ts");
    assertIncludes(robots, "host: base", "app/robots.ts");
  }

  if (fileExists("app/sitemap.ts")) {
    const sitemap = read("app/sitemap.ts");
    assertIncludes(sitemap, "url: base", "app/sitemap.ts");
    if (/\/(?:men|women|kids|stores|about|contact)\b/.test(sitemap)) {
      fail("app/sitemap.ts must remain homepage-only for the single-page site.");
    }
  }

  if (fileExists("lib/structured-data.ts")) {
    const schema = read("lib/structured-data.ts");
    for (const snippet of [
      '"@type": "Organization"',
      '"@type": "WebSite"',
      '"@type": "WebPage"',
      '"@type": "ClothingStore"',
      '"@type": "PostalAddress"',
      "parentOrganization",
      "mainEntity",
      "serializeJsonLd",
    ]) {
      assertIncludes(schema, snippet, "lib/structured-data.ts");
    }

    for (const id of STORE_IDS) {
      if (!schema.includes(`"${id}"`) && !read("lib/data.ts").includes(`id: "${id}"`)) {
        fail(`Store identifier ${id} is missing from structured-data inputs.`);
      }
    }

    for (const forbidden of ['"@type": "Product"', '"@type": "Offer"', '"@type": "AggregateRating"', '"@type": "Review"']) {
      if (schema.includes(forbidden)) fail(`Unverified structured data found: ${forbidden}.`);
    }
  }

  if (fileExists("app/page.tsx")) {
    const page = read("app/page.tsx");
    assertIncludes(page, "<ThreadSequence />", "app/page.tsx");
    assertIncludes(page, "<NewArrivals />", "app/page.tsx");
    assertIncludes(page, "<Departments />", "app/page.tsx");
    assertIncludes(page, "<Trending />", "app/page.tsx");
    assertIncludes(page, "<ShopTheLook />", "app/page.tsx");
    assertIncludes(page, "<WhyStyleClub />", "app/page.tsx");
    assertIncludes(page, "<Stores />", "app/page.tsx");
  }

  finish("Source release checks");
}

function routeFromAppPath(route) {
  if (route === "/page") return "/";
  if (route.endsWith("/page")) return route.slice(0, -5) || "/";
  if (route.endsWith("/route")) return route.slice(0, -6) || "/";
  return route;
}

function checkDistOutput() {
  const appPaths = ".next/server/app-paths-manifest.json";
  const homeHtml = ".next/server/app/index.html";

  if (!fileExists(".next/BUILD_ID")) {
    fail(".next/BUILD_ID is missing. Run npm run build before release:check:dist.");
  }

  if (!fileExists(appPaths)) {
    fail(`${appPaths} is missing.`);
  } else {
    const manifest = JSON.parse(read(appPaths));
    const routes = [...new Set(Object.keys(manifest).map(routeFromAppPath))]
      .filter((route) => !INTERNAL_APP_ROUTES.has(route))
      .sort();
    const expected = [...EXPECTED_ROUTES].sort();

    const unexpected = routes.filter((route) => !expected.includes(route));
    const missing = expected.filter((route) => !routes.includes(route));
    if (unexpected.length) fail(`Unexpected public app routes: ${unexpected.join(", ")}.`);
    if (missing.length) fail(`Expected app routes are missing: ${missing.join(", ")}.`);
  }

  if (!fileExists(homeHtml)) {
    fail(`${homeHtml} is missing.`);
  } else {
    const html = read(homeHtml);

    assertRenderedTitle(html, "rendered homepage");
    assertIncludes(html, EXPECTED_DESCRIPTION, "rendered homepage");
    if (!/<link[^>]+rel=["']canonical["'][^>]+href=["']https:\/\/[^"']+["']/i.test(html)) {
      fail("Rendered homepage is missing an HTTPS canonical URL.");
    }
    if (!/<meta[^>]+property=["']og:title["']/i.test(html)) fail("Rendered homepage is missing og:title.");
    if (!/<meta[^>]+property=["']og:url["']/i.test(html)) fail("Rendered homepage is missing og:url.");
    if (!/<meta[^>]+name=["']twitter:card["']/i.test(html)) fail("Rendered homepage is missing twitter:card.");
    if (!/<meta[^>]+name=["']robots["'][^>]+content=["'][^"']*index[^"']*follow/i.test(html)) {
      fail("Rendered homepage must be index,follow.");
    }
    if (/<meta[^>]+name=["']robots["'][^>]+content=["'][^"']*noindex/i.test(html)) {
      fail("Rendered homepage unexpectedly contains noindex.");
    }

    for (const anchor of ["new-arrivals", "departments", "trending", "the-look", "why", "stores"]) {
      if (!html.includes(`id="${anchor}"`)) fail(`Rendered homepage is missing #${anchor}.`);
    }

    assertIncludes(html, "/sequence/desktop/f_001.webp", "rendered homepage");
    assertIncludes(html, "/sequence/mobile/f_001.webp", "rendered homepage");

    const jsonLdScripts = extractJsonLd(html);
    if (!jsonLdScripts.length) {
      fail("Rendered homepage contains no JSON-LD.");
    } else {
      validateJsonLd(jsonLdScripts[0], "rendered homepage");
    }
  }

  finish("Built release checks");
}

async function fetchChecked(url, options = {}) {
  try {
    return await fetch(url, {
      redirect: "follow",
      signal: AbortSignal.timeout(15000),
      ...options,
    });
  } catch (error) {
    fail(`Request failed for ${url}: ${error instanceof Error ? error.message : String(error)}.`);
    return null;
  }
}

function canonicalFromHtml(html) {
  const match = html.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i);
  return match?.[1] ?? null;
}

async function checkLiveSite() {
  const input = process.env.RELEASE_URL ?? process.env.SITE_URL;
  if (!input) {
    fail("Set RELEASE_URL (preferred) or SITE_URL before running release:check:live.");
    finish("Live release checks");
    return;
  }

  let base;
  try {
    base = new URL(input);
  } catch {
    fail(`Invalid release URL: ${input}.`);
    finish("Live release checks");
    return;
  }

  if (base.protocol !== "https:") {
    fail("Live release verification requires HTTPS.");
    finish("Live release checks");
    return;
  }

  base.pathname = "/";
  base.search = "";
  base.hash = "";
  const origin = base.origin;
  const home = await fetchChecked(origin);
  if (!home) {
    finish("Live release checks");
    return;
  }

  if (!home.ok) fail(`Homepage returned HTTP ${home.status}.`);

  const requiredHeaders = [
    "content-security-policy",
    "strict-transport-security",
    "x-content-type-options",
    "x-frame-options",
    "referrer-policy",
    "permissions-policy",
    "cross-origin-opener-policy",
    "origin-agent-cluster",
  ];

  for (const header of requiredHeaders) {
    if (!home.headers.get(header)) fail(`Live homepage is missing ${header}.`);
  }

  const csp = home.headers.get("content-security-policy") ?? "";
  if (csp.includes("'unsafe-eval'")) fail("Live CSP allows 'unsafe-eval'.");
  if (!csp.includes("frame-ancestors 'none'")) fail("Live CSP must deny framing.");
  if (home.headers.get("x-content-type-options")?.toLowerCase() !== "nosniff") {
    fail("Live X-Content-Type-Options must be nosniff.");
  }
  if (home.headers.get("x-frame-options")?.toUpperCase() !== "DENY") {
    fail("Live X-Frame-Options must be DENY.");
  }

  const html = await home.text();
  assertRenderedTitle(html, "live homepage");
  assertIncludes(html, EXPECTED_DESCRIPTION, "live homepage");

  const canonical = canonicalFromHtml(html);
  if (!canonical) {
    fail("Live homepage has no canonical URL.");
  } else if (new URL(canonical).origin !== origin) {
    fail(`Live canonical origin ${new URL(canonical).origin} does not match ${origin}.`);
  }

  if (/<meta[^>]+name=["']robots["'][^>]+content=["'][^"']*noindex/i.test(html)) {
    fail("Live homepage unexpectedly contains noindex.");
  }

  const jsonLdScripts = extractJsonLd(html);
  if (!jsonLdScripts.length) fail("Live homepage contains no JSON-LD.");
  else validateJsonLd(jsonLdScripts[0], "live homepage");

  const robotsResponse = await fetchChecked(`${origin}/robots.txt`);
  if (robotsResponse) {
    if (!robotsResponse.ok) fail(`/robots.txt returned HTTP ${robotsResponse.status}.`);
    const robots = await robotsResponse.text();
    if (!/User-Agent:\s*\*/i.test(robots)) fail("robots.txt is missing User-Agent: *.");
    if (!/Allow:\s*\//i.test(robots)) fail("robots.txt is missing Allow: /.");
    if (!robots.includes(`${origin}/sitemap.xml`)) fail("robots.txt references the wrong sitemap origin.");
  }

  const sitemapResponse = await fetchChecked(`${origin}/sitemap.xml`);
  if (sitemapResponse) {
    if (!sitemapResponse.ok) fail(`/sitemap.xml returned HTTP ${sitemapResponse.status}.`);
    const sitemap = await sitemapResponse.text();
    const locations = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/gi)].map((match) => match[1]);
    if (locations.length !== 1 || new URL(locations[0]).origin !== origin || new URL(locations[0]).pathname !== "/") {
      fail(`Sitemap must contain only the homepage; found ${locations.join(", ") || "no URLs"}.`);
    }
  }

  for (const asset of [
    "/og.jpg",
    "/brand/storefront.jpg",
    "/sequence/desktop/f_001.webp",
    "/sequence/mobile/f_001.webp",
  ]) {
    const response = await fetchChecked(`${origin}${asset}`);
    if (response && !response.ok) fail(`${asset} returned HTTP ${response.status}.`);
  }

  const missingRoute = await fetchChecked(`${origin}/__release-check-missing-route__`);
  if (missingRoute && missingRoute.status !== 404) {
    fail(`Unknown route must return 404; received ${missingRoute.status}.`);
  }

  finish("Live release checks");
}

if (checkLive) await checkLiveSite();
else if (checkDist) checkDistOutput();
else checkSource();
