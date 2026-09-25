import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const root = process.cwd();
const checkDist = process.argv.includes("--dist");
const errors = [];

const fail = (message) => errors.push(message);
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");

function walk(dir) {
  const absolute = path.join(root, dir);
  if (!fs.existsSync(absolute)) return [];

  const files = [];
  for (const entry of fs.readdirSync(absolute, { withFileTypes: true })) {
    const relative = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...walk(relative));
    else files.push(relative);
  }
  return files;
}

function trackedFiles() {
  try {
    const output = execFileSync("git", ["ls-files"], {
      cwd: root,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();
    return output ? output.split(/\r?\n/) : [];
  } catch {
    return [];
  }
}

function versionAtLeast(version, minimum) {
  const clean = String(version).replace(/^[^\d]*/, "").split("-")[0];
  const actual = clean.split(".").map((part) => Number.parseInt(part, 10) || 0);
  const required = minimum.split(".").map((part) => Number.parseInt(part, 10) || 0);

  for (let i = 0; i < Math.max(actual.length, required.length); i++) {
    const a = actual[i] ?? 0;
    const b = required[i] ?? 0;
    if (a > b) return true;
    if (a < b) return false;
  }
  return true;
}

function checkSource() {
  const tracked = trackedFiles();
  const trackedEnv = tracked.filter(
    (file) => path.basename(file).startsWith(".env") && file !== ".env.example",
  );
  if (trackedEnv.length) {
    fail(`Tracked environment files are not allowed: ${trackedEnv.join(", ")}`);
  }

  if (!fs.existsSync(path.join(root, "package-lock.json"))) {
    fail("package-lock.json is required for reproducible installs.");
  }

  const pkg = JSON.parse(read("package.json"));
  const nextVersion = pkg.dependencies?.next;
  if (!nextVersion || !versionAtLeast(nextVersion, "16.3.6")) {
    fail(`Next.js must be at least 16.3.6; found ${nextVersion ?? "missing"}.`);
  }

  const nextConfig = read("next.config.ts");
  const requiredConfigSnippets = [
    "poweredByHeader: false",
    "productionBrowserSourceMaps: false",
    "Content-Security-Policy",
    "Strict-Transport-Security",
    "X-Content-Type-Options",
    "X-Frame-Options",
    "Referrer-Policy",
    "Permissions-Policy",
    "Cross-Origin-Opener-Policy",
    "Origin-Agent-Cluster",
  ];
  for (const snippet of requiredConfigSnippets) {
    if (!nextConfig.includes(snippet)) fail(`next.config.ts is missing ${snippet}.`);
  }
  if (nextConfig.includes("'unsafe-eval'")) {
    fail("CSP must not allow 'unsafe-eval'.");
  }
  if (/script-src[^;\n]*\*/.test(nextConfig)) {
    fail("CSP script-src must not contain a wildcard source.");
  }

  const codeFiles = tracked.filter((file) =>
    /\.(?:js|jsx|mjs|cjs|ts|tsx)$/.test(file) &&
    !file.startsWith(".next/") &&
    !file.startsWith("node_modules/") &&
    file !== "scripts/security-check.mjs",
  );

  const forbiddenApis = [
    [/\beval\s*\(/, "eval()"],
    [/\bnew\s+Function\s*\(/, "new Function()"],
    [/\bdocument\.write\s*\(/, "document.write()"],
    [/\.innerHTML\s*=/, "direct innerHTML assignment"],
  ];

  const secretPatterns = [
    [/-----BEGIN [A-Z ]*PRIVATE KEY-----/, "private key material"],
    [/\bghp_[A-Za-z0-9]{20,}\b/, "GitHub personal access token"],
    [/\bgithub_pat_[A-Za-z0-9_]{20,}\b/, "GitHub fine-grained token"],
    [/\bsk-(?:live|test|proj)-[A-Za-z0-9_-]{16,}\b/, "secret API key"],
    [/\bAIza[0-9A-Za-z_-]{30,}\b/, "Google API key"],
  ];

  for (const file of codeFiles) {
    const content = read(file);

    for (const [pattern, label] of forbiddenApis) {
      if (pattern.test(content)) fail(`${file}: forbidden ${label} usage.`);
    }

    for (const [pattern, label] of secretPatterns) {
      if (pattern.test(content)) fail(`${file}: possible ${label} committed.`);
    }

    for (const match of content.matchAll(/process\.env\.(NEXT_PUBLIC_[A-Z0-9_]+)/g)) {
      if (/(?:SECRET|TOKEN|PASSWORD|PRIVATE|API_KEY|ACCESS_KEY)/.test(match[1])) {
        fail(`${file}: secret-like value ${match[1]} must not be exposed as NEXT_PUBLIC_*.`);
      }
    }

    if (content.includes("dangerouslySetInnerHTML") && !content.includes("serializeJsonLd(")) {
      fail(`${file}: dangerouslySetInnerHTML must use the JSON-LD safe serializer.`);
    }

    for (const match of content.matchAll(/<a\b[\s\S]*?>/g)) {
      const tag = match[0];
      if (!/\btarget\s*=\s*["']_blank["']/.test(tag)) continue;
      if (!/\brel\s*=\s*["'][^"']*(?:noreferrer|noopener)[^"']*["']/.test(tag)) {
        fail(`${file}: target="_blank" link is missing noreferrer/noopener.`);
      }
    }
  }

  if (errors.length) {
    console.error("[security] Source checks failed:");
    for (const error of errors) console.error(`- ${error}`);
    process.exit(1);
  }

  console.log("[security] Source checks passed.");
}

function checkBuild() {
  const buildId = path.join(root, ".next", "BUILD_ID");
  if (!fs.existsSync(buildId)) {
    fail(".next/BUILD_ID is missing. Run npm run build before security:check:dist.");
  }

  const manifestPath = path.join(root, ".next", "routes-manifest.json");
  if (!fs.existsSync(manifestPath)) {
    fail(".next/routes-manifest.json is missing.");
  } else {
    const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
    const emittedHeaders = new Map();

    for (const rule of manifest.headers ?? []) {
      for (const header of rule.headers ?? []) {
        emittedHeaders.set(String(header.key).toLowerCase(), String(header.value));
      }
    }

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

    for (const key of requiredHeaders) {
      if (!emittedHeaders.has(key)) fail(`Built routes manifest is missing ${key}.`);
    }

    const csp = emittedHeaders.get("content-security-policy") ?? "";
    if (csp.includes("'unsafe-eval'")) fail("Built CSP allows 'unsafe-eval'.");
    if (/script-src[^;]*\*/.test(csp)) fail("Built CSP script-src contains a wildcard.");
    if (!csp.includes("frame-ancestors 'none'")) fail("Built CSP must deny framing.");
    if (!csp.includes("object-src 'none'")) fail("Built CSP must disable plugins/objects.");
  }

  const sourceMaps = walk(".next/static").filter((file) => file.endsWith(".map"));
  if (sourceMaps.length) {
    fail(`Production browser source maps must remain disabled (${sourceMaps.length} found).`);
  }

  const accidentalEnv = walk(".next").filter((file) =>
    path.basename(file).startsWith(".env"),
  );
  if (accidentalEnv.length) {
    fail(`Environment files were copied into .next: ${accidentalEnv.join(", ")}`);
  }

  if (errors.length) {
    console.error("[security] Production build checks failed:");
    for (const error of errors) console.error(`- ${error}`);
    process.exit(1);
  }

  console.log("[security] Production build checks passed.");
}

if (checkDist) checkBuild();
else checkSource();
