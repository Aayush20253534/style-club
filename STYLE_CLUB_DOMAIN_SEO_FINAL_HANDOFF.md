# Style Club — Final Domain & SEO Handoff Checklist

This file is the practical checklist to finish SEO after the client gives you the final domain.

The Style Club codebase already has the technical SEO/security foundation, single-page semantic structure, sitemap, robots.txt, metadata, multi-location structured data, release verification, and production security checks.

The remaining work is mostly **domain configuration, deployment verification, Google Search Console, Google Business Profile/local SEO, business-data verification, and ongoing SEO monitoring**.

---

## 1. Get these details/access from the client first

Before touching production, collect:

- Final domain name.
- Domain registrar / DNS access, or ask the client to make DNS changes while you guide them.
- Preferred public hostname:
  - `https://example.com`
  - or `https://www.example.com`
- Google Search Console access, or permission to create the property.
- Google Business Profile ownership/manager access for all Style Club branches.
- Verified business details for every branch:
  - exact branch name
  - complete postal address
  - PIN code
  - branch phone number
  - opening hours
  - Google Maps listing/link
  - whether the branch is currently active
- Official business logo and preferred social profile URLs.
- Any existing Google Analytics / GA4 property access, if the client already has one.
- Confirmation of which product names/prices on the current website are real inventory versus editorial/mock content.

Do **not** invent business information just to make structured data look more complete.

---

# 2. Connect the final domain to deployment

Once the client gives you the domain, add it to the production deployment.

For Vercel:

1. Open the project.
2. Go to **Settings → Domains**.
3. Add the final client domain.
4. Configure the DNS records Vercel provides.
5. Wait until the domain is verified and HTTPS is active.

Make sure only one hostname is treated as the primary public version.

Example:

```text
Primary:
https://styleclubexample.com

Redirect:
https://www.styleclubexample.com
→ https://styleclubexample.com
```

or the reverse if the client wants `www`.

Do not leave both versions independently accessible without redirects.

Also verify:

```text
http://domain.com
→ https://domain.com

http://www.domain.com
→ preferred HTTPS hostname

https://www.domain.com
→ preferred HTTPS hostname
```

---

# 3. Set the production SITE_URL

The project uses `SITE_URL` for:

- canonical URL
- Open Graph URL
- sitemap.xml
- robots.txt
- JSON-LD entity IDs
- WebSite / WebPage / Organization structured data

Set:

```env
SITE_URL=https://FINAL-DOMAIN.com
```

Use the exact production origin:

```text
GOOD
https://styleclubexample.com

BAD
http://styleclubexample.com
https://styleclubexample.com/
https://styleclubexample.com/home
```

The project intentionally validates this.

### Vercel

Add:

```text
SITE_URL=https://FINAL-DOMAIN.com
```

to the **Production** environment.

Then redeploy.

### GitHub Actions

In:

```text
GitHub Repo
→ Settings
→ Secrets and variables
→ Actions
→ Variables
```

create:

```text
Name: SITE_URL
Value: https://FINAL-DOMAIN.com
```

This ensures CI builds and validates metadata using the real client domain rather than the fallback domain.

---

# 4. Run the complete production build verification

Before final deployment:

```powershell
npm ci
npm run release:verify
```

It should finish with:

```text
[security] Source checks passed.
found 0 vulnerabilities
[security] Production build checks passed.
[release] Source release checks passed.
[release] Built release checks passed.
```

Do not ignore a failed release check just because the page visually loads.

---

# 5. Run the live production verifier

After the final domain is deployed:

```powershell
$env:RELEASE_URL="https://FINAL-DOMAIN.com"
npm run release:check:live
```

Expected:

```text
[release] Live release checks passed.
```

The live checker verifies:

- homepage returns successfully
- HTTPS
- canonical URL uses the correct domain
- no accidental `noindex`
- security headers
- CSP
- robots.txt
- sitemap.xml
- JSON-LD
- five Style Club store entities
- critical images
- hero assets
- real 404 behavior

Do this **after every domain or deployment change**.

---

# 6. Manually check the important public URLs

Open:

```text
https://FINAL-DOMAIN.com/
https://FINAL-DOMAIN.com/robots.txt
https://FINAL-DOMAIN.com/sitemap.xml
```

Also test a fake URL:

```text
https://FINAL-DOMAIN.com/this-page-does-not-exist
```

It must return a proper 404.

The site is intentionally single-page.

The sitemap should therefore contain only:

```text
https://FINAL-DOMAIN.com/
```

Do not add fake URLs such as:

```text
/men
/women
/kids
/stores
/about
/contact
```

unless the website architecture is deliberately changed later.

---

# 7. Verify canonical and metadata in production

View page source and confirm:

### Title

```text
Style Club Prayagraj | Clothing for Men, Women & Kids
```

### Canonical

```html
<link rel="canonical" href="https://FINAL-DOMAIN.com">
```

### Robots

The homepage must be:

```text
index, follow
```

and must **not** contain:

```text
noindex
```

### Open Graph

Check that production source contains:

```text
og:title
og:description
og:url
og:image
```

### Twitter metadata

Check:

```text
twitter:card
twitter:title
twitter:description
twitter:image
```

Also open the OG image directly:

```text
https://FINAL-DOMAIN.com/og.jpg
```

---

# 8. Verify business information before final schema handoff

The current code correctly avoids inventing unverified data.

Before considering local SEO finished, confirm the client details for:

- Katra
- Civil Lines
- Naini
- Phaphamau
- Bharwari

Particularly verify:

## Katra

Current website data includes:

```text
Netram Chauraha, Old Katra, Prayagraj, UP 211002
098380 70333
```

Confirm this is still correct.

## Civil Lines

Current website has only a general Civil Lines address.

Get the client's **exact street address and PIN code** if available.

## Naini

Current data:

```text
Mewalal Ki Bagiya, Naini, Prayagraj
```

Confirm exact address and PIN code.

## Phaphamau

Current data includes:

```text
Banaras Road, near Phaphamau Bazar, UP 211013
```

Confirm this is the current official branch address.

## Bharwari

Current data is only:

```text
Bharwari, Uttar Pradesh
```

Get the full address and PIN code if possible.

### Also collect for each store if available

- separate branch phone number
- normal opening hours
- special/holiday hours
- official Google Maps link
- latitude/longitude only if verified from the actual listing

Then update `lib/data.ts` / structured data with **verified** information only.

---

# 9. Validate structured data

The production homepage currently publishes:

```text
Organization
WebSite
WebPage
5 × ClothingStore
5 × PostalAddress
```

After the final domain/business data is configured, test the production URL using:

### Google Rich Results Test

https://search.google.com/test/rich-results

### Schema.org Validator

https://validator.schema.org/

Fix:

- syntax errors
- invalid URLs
- missing/incorrect addresses
- wrong phone numbers
- incorrect map URLs

Do not blindly chase every optional warning.

Google recommends using the most specific appropriate `LocalBusiness` subtype and keeping real-world business information accurate.

Official reference:

https://developers.google.com/search/docs/appearance/structured-data/local-business

Organization structured-data reference:

https://developers.google.com/search/docs/appearance/structured-data/organization

---

# 10. Create Google Search Console property

For the final domain, use a **Domain property** if you have DNS access.

Example:

```text
styleclubexample.com
```

Do not enter:

```text
https://styleclubexample.com
```

for a Domain property.

A Domain property covers:

- HTTP
- HTTPS
- www
- non-www
- subdomains

Google requires DNS verification for Domain properties.

Official documentation:

https://support.google.com/webmasters/answer/34592

---

# 11. Verify Search Console using DNS

Google will give you a TXT verification record.

Add the TXT record at the domain's DNS provider.

Example shape:

```text
Type: TXT
Host: @
Value: google-site-verification=XXXXXXXX
```

Do not remove the verification record after verification unless you are sure another permanent verification method exists.

Then press:

```text
Verify
```

inside Search Console.

---

# 12. Submit the sitemap

Inside Search Console:

```text
Indexing
→ Sitemaps
```

submit:

```text
sitemap.xml
```

Google should resolve it as:

```text
https://FINAL-DOMAIN.com/sitemap.xml
```

The status should eventually become:

```text
Success
```

Official Google guidance:

https://support.google.com/webmasters/answer/10351509

---

# 13. Inspect and request indexing for the homepage

In Search Console:

```text
URL Inspection
```

enter:

```text
https://FINAL-DOMAIN.com/
```

Then:

1. Run **Test Live URL**.
2. Confirm it is indexable.
3. Confirm Google can load the page/resources.
4. Check structured-data detection.
5. Click **Request Indexing**.

Google states that requesting indexing does not guarantee immediate indexing and it can take time.

Official documentation:

https://support.google.com/webmasters/answer/9012289

Because Style Club intentionally has only one indexable page, this is much simpler than a multi-page website.

---

# 14. Confirm Google-selected canonical after indexing

After Google has indexed the site, open URL Inspection again.

Compare:

```text
User-declared canonical
```

with:

```text
Google-selected canonical
```

Both should be the final preferred HTTPS URL.

Example:

```text
https://FINAL-DOMAIN.com/
```

If Google chooses another hostname, check:

- `www` redirects
- HTTP redirects
- canonical tag
- SITE_URL
- Vercel domain configuration
- sitemap URLs
- internal links

---

# 15. Google Business Profile work — very important for local SEO

For a physical clothing retailer, Google Maps / Business Profile work is at least as important as website SEO.

Get owner/manager access to each valid physical Style Club location.

For each eligible branch, verify:

- official business name
- exact address
- map pin
- primary business category
- secondary categories if genuinely applicable
- phone number
- website
- opening hours
- holiday/special hours
- storefront photos
- interior photos
- product/category photos
- description
- attributes

Google explicitly recommends complete and accurate Business Profile information for local visibility.

Official guidance:

https://support.google.com/business/answer/7091

Hours guidance:

https://support.google.com/business/answer/15300403

---

# 16. Website link from Google Business Profile

Each Style Club Business Profile should use the final HTTPS website URL.

Because this project intentionally stays single-page, the website URL can be:

```text
https://FINAL-DOMAIN.com/
```

Do not create fake branch URLs solely to populate Google Business Profile.

If dedicated branch landing pages are created in the future, those URLs can later replace the homepage link.

---

# 17. Keep NAP information consistent

NAP means:

```text
Name
Address
Phone
```

The following should agree as closely as possible:

- website
- Google Business Profile
- Google Maps
- Facebook / Instagram business details
- local directories
- Justdial or relevant Indian directories
- any existing citations/listings

Avoid situations like:

```text
Website: Netram Chauraha
Google: Netram Square
Facebook: Old Katra Road
Directory: Katra Market
```

when they all refer to the same physical address.

Consistency makes entity matching easier for search engines and avoids confusing customers.

---

# 18. Review strategy

Do not buy reviews and do not fabricate them.

For genuine customers:

- encourage reviews naturally
- reply professionally
- respond to negative reviews constructively
- keep branch reviews on the correct branch listing

Google states that useful review responses and positive customer feedback can help a business stand out in local results.

Do **not** add `Review` or `AggregateRating` schema to the site unless the required underlying review content genuinely exists and complies with Google's structured-data rules.

---

# 19. Add fresh Business Profile photos

For each branch, aim to maintain real photos of:

- exterior/storefront
- entrance
- interior
- men's section
- women's section
- kids' section
- seasonal collections
- actual store team where appropriate

Google recommends adding photos/videos to help customers understand the business.

Do not substitute generic stock-fashion photos for the physical store listing itself.

---

# 20. Analytics setup

SEO can technically work without GA4, but you should install analytics so the client can measure results.

Recommended:

- Google Analytics 4
- Google Search Console

Track at minimum:

```text
page_view
phone click
Instagram click
Directions / Google Maps click
search usage
wishlist interaction
bag interaction
```

If Google Tag Manager is used later, review the CSP before adding scripts. Do not simply weaken CSP to `*`.

---

# 21. Connect Search Console and GA4

If the client uses GA4, associate Search Console with Analytics where appropriate.

This makes it easier to compare:

- organic landing traffic
- queries
- clicks
- impressions
- engagement

Search Console remains the authoritative source for Google Search query/impression data.

---

# 22. Check indexing after launch

After a few days, check Search Console:

```text
Indexing
→ Pages
```

For this single-page site you mainly care that the homepage becomes indexed.

Investigate if it shows:

```text
Crawled - currently not indexed
Discovered - currently not indexed
Duplicate
Alternate page
Blocked by robots.txt
Excluded by noindex
```

Do not panic immediately after launch. New domains can take time to be discovered/indexed.

---

# 23. Check Search Console security/manual-action reports

Periodically inspect:

```text
Security & Manual Actions
→ Manual actions

Security & Manual Actions
→ Security issues
```

Both should remain clean.

---

# 24. Search Console performance monitoring

After impressions begin appearing, monitor:

```text
Performance
→ Search results
```

Watch:

- queries
- clicks
- impressions
- CTR
- average position
- device split
- country
- date trends

Useful query groups may include searches around:

```text
Style Club Prayagraj
Style Club Katra
Style Club Civil Lines
Style Club Naini
Style Club Phaphamau
Style Club Bharwari
clothing store Prayagraj
fashion store Prayagraj
men clothing Prayagraj
women clothing Prayagraj
kidswear Prayagraj
```

Do not stuff these phrases into the page merely because they appear in Search Console.

Use them to understand real customer intent.

---

# 25. Verify branded search appearance

After indexing, manually search Google for:

```text
Style Club Prayagraj
Style Club Katra
Style Club Civil Lines
```

Check:

- correct website domain
- correct title
- correct business profiles
- correct addresses
- no outdated duplicate listing
- no wrong phone number

If an outdated domain exists, make sure it redirects correctly to the new domain where you control it.

---

# 26. Domain migration tasks if an old website/domain already exists

If Style Club already has an older indexed domain, do **not** simply abandon it.

You may need:

- permanent `301` redirects from old domain to new domain
- old URLs mapped to the closest appropriate destination
- old sitemap removal/update
- new Search Console property
- monitor indexing migration
- update Google Business Profile website links
- update social/profile links

If the old site has meaningful search visibility, domain migration should be handled carefully rather than treating the new domain as an unrelated site.

---

# 27. Bing Webmaster Tools — optional but worthwhile

After Google is complete, also consider:

https://www.bing.com/webmasters/

Add/verify the site and submit:

```text
https://FINAL-DOMAIN.com/sitemap.xml
```

Google is the priority, but submitting to Bing costs very little effort.

---

# 28. Social/profile link cleanup

Update the final domain on:

- Instagram bio
- Facebook page
- Google Business Profile
- WhatsApp business profile if used
- YouTube if applicable
- directory listings
- advertising profiles

This helps establish one consistent official website.

---

# 29. Final technical SEO QA

Before telling the client SEO setup is complete, confirm all of these:

- [ ] Final domain uses HTTPS.
- [ ] Preferred hostname selected.
- [ ] All alternate hostnames redirect to the preferred domain.
- [ ] `SITE_URL` updated in Vercel.
- [ ] `SITE_URL` GitHub Actions variable updated.
- [ ] New production deployment completed.
- [ ] `npm run release:verify` passes.
- [ ] `npm run release:check:live` passes.
- [ ] Canonical uses final domain.
- [ ] No `noindex`.
- [ ] `robots.txt` loads.
- [ ] `sitemap.xml` loads.
- [ ] Sitemap contains only the homepage.
- [ ] OG image loads.
- [ ] 404 behavior works.
- [ ] Structured data validates.
- [ ] All five branches use verified real-world details.
- [ ] Search Console Domain property verified.
- [ ] Sitemap submitted in Search Console.
- [ ] Homepage tested using URL Inspection.
- [ ] Indexing requested.
- [ ] Google Business Profiles reviewed/verified.
- [ ] Business Profile website URLs changed to new domain.
- [ ] NAP consistency checked.
- [ ] Opening hours verified.
- [ ] Google Maps pins verified.
- [ ] Analytics configured if client wants reporting.
- [ ] Search Console checked again after indexing.

Once these are complete, the **initial SEO implementation and launch setup are complete**.

---

# 30. What is NOT a one-time task

SEO is not permanently finished after launch.

The following should continue monthly or quarterly:

## Search Console

Check:

- indexing
- crawl problems
- manual actions
- security issues
- performance trends
- branded vs non-branded queries

## Google Business Profile

Keep updated:

- opening hours
- holiday hours
- photos
- branch information
- reviews/replies

## Business data

Update the website when:

- branch opens/closes
- phone changes
- address changes
- opening hours change

## Dependency/security maintenance

Keep:

```powershell
npm audit
npm run release:verify
```

passing.

Review Dependabot PRs rather than ignoring them indefinitely.

## Content

If the client later wants stronger non-branded organic growth, you can consider adding genuinely useful content such as:

- seasonal collection updates
- fashion guides
- store/event announcements
- verified product/category content

But do not create low-quality SEO pages just to manufacture URLs.

The current architecture is intentionally a premium single-page storefront.

---

# 31. Recommended monthly client SEO report

Once Search Console has enough data, send a short monthly report containing:

```text
Organic clicks
Organic impressions
Average CTR
Top search queries
Top branded queries
Top local queries
Google Business Profile calls/directions if available
Important indexing issues
Changes completed this month
Next month's actions
```

Avoid promising rankings or traffic numbers you cannot control.

---

# 32. When you can call the initial SEO work complete

You can treat the **initial SEO project/setup** as completed when:

1. The final client domain is live.
2. HTTPS and canonical redirects are correct.
3. Production verification passes.
4. Search Console is verified.
5. Sitemap is submitted.
6. Homepage is indexable and indexing has been requested.
7. Google Business Profiles are accurate and linked.
8. Real branch data is reflected correctly on the website/schema.
9. No security/manual-action/indexing blockers exist.
10. Analytics/reporting is configured if included in the client scope.

After that, SEO moves from **implementation** to **ongoing optimization and monitoring**.

---

# Official references

Google Search Console property setup:

https://support.google.com/webmasters/answer/34592

Google URL Inspection / requesting indexing:

https://support.google.com/webmasters/answer/9012289

Google Search Console sitemap/indexing guidance:

https://support.google.com/webmasters/answer/10351509

Google Local Business structured data:

https://developers.google.com/search/docs/appearance/structured-data/local-business

Google Organization structured data:

https://developers.google.com/search/docs/appearance/structured-data/organization

Google Business Profile local ranking guidance:

https://support.google.com/business/answer/7091

Google Business Profile hours:

https://support.google.com/business/answer/15300403

Google Rich Results Test:

https://search.google.com/test/rich-results

Schema.org Validator:

https://validator.schema.org/
