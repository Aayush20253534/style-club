# Security Policy

## Supported code

The `main` branch is the supported production line for this website.

Style Club is currently a static storefront experience. It has no application
database, user authentication, payment processing, or server-side booking API.
Security work therefore focuses on browser isolation, dependency hygiene,
client-state validation, build integrity, and preventing accidental secret
exposure.

## Reporting a vulnerability

Do not publish credentials, tokens, private data, or exploit details in a public
issue. Contact the repository maintainers privately, or use GitHub private
vulnerability reporting when it is enabled for the repository.

Include enough information to reproduce the issue safely:

- affected URL or component,
- reproduction steps,
- expected and observed behaviour,
- browser/runtime details when relevant,
- impact and any known prerequisites.

## Repository rules

- Never commit `.env` files other than `.env.example`.
- Never put secrets in `NEXT_PUBLIC_*` variables; those values are shipped to
  browsers.
- Keep `package-lock.json` committed and use `npm ci` in CI/deployment.
- Treat `localStorage`, query strings, hashes, and external data as untrusted.
- Keep production security headers and CSP checks passing.
- Run `npm run security:verify` before production handoff.
