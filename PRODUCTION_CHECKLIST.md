# Style Club production release checklist

This repository is intentionally a single-page storefront. A release is ready
when source, security, build, and live deployment checks all pass without
creating additional public content routes.

## Before deployment

Run:

```powershell
npm ci
npm run release:verify
```

`release:verify` includes the security audit, TypeScript checks, production
build, built-output security checks, and release integrity checks.

The build must keep the public route surface limited to:

- `/`
- `/_not-found`
- `/apple-icon`
- `/icon`
- `/robots.txt`
- `/sitemap.xml`

The cinematic hero must retain 301 desktop frames and 151 mobile frames.

## Deployment configuration

Set `SITE_URL` to the final HTTPS production origin, without a trailing path:

```text
SITE_URL=https://example.com
```

Set the same value as the GitHub Actions repository variable named `SITE_URL`
so CI validates metadata against the real production origin.

Do not put secrets in `NEXT_PUBLIC_*`.

## After deployment

Run the live verifier against the exact public domain:

```powershell
$env:RELEASE_URL="https://example.com"
npm run release:check:live
```

The live verifier checks:

- HTTP success and HTTPS canonical origin
- index/follow metadata
- Open Graph/Twitter metadata
- Organization/WebSite/WebPage plus five ClothingStore entities
- `robots.txt`
- homepage-only `sitemap.xml`
- production security headers and CSP
- critical storefront/hero assets
- real 404 behaviour for an unknown route

## Search handoff

After the final domain is stable:

1. Add and verify the domain property in Google Search Console.
2. Submit `/sitemap.xml`.
3. Inspect the homepage URL and request indexing.
4. Keep business name, address, phone and map details consistent with the
   verified Google Business Profile/store listings.
5. Do not add Product, Offer, Review or AggregateRating schema until the client
   confirms the underlying inventory, pricing and review data.

## Release rule

Do not bypass a failing `release:verify`, `security:verify`, or live release
check just because the site looks correct in a browser. Visual inspection does
not validate canonical metadata, crawlability, structured data, headers, or
deployment drift.
