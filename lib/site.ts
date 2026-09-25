const DEFAULT_SITE_URL = "https://styleclubindia.com";

function isLocalHost(hostname: string) {
  return hostname === "localhost" || hostname === "127.0.0.1";
}

export function normalizeSiteUrl(value: string) {
  const url = new URL(value.trim());

  if (url.username || url.password) throw new Error("SITE_URL must not contain credentials.");
  if (url.search || url.hash) throw new Error("SITE_URL must not contain a query string or hash.");
  if (url.pathname !== "/") throw new Error("SITE_URL must be an origin only, without a path.");

  const localHttp = url.protocol === "http:" && isLocalHost(url.hostname);
  if (url.protocol !== "https:" && !localHttp) {
    throw new Error("SITE_URL must use HTTPS outside local development.");
  }

  return url.origin;
}

export function getSiteUrl() {
  return normalizeSiteUrl(
    process.env.SITE_URL ??
      process.env.NEXT_PUBLIC_SITE_URL ??
      DEFAULT_SITE_URL,
  );
}
