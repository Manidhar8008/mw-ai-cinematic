# MW.AI Launch Runbook

## Production surface

- `index.html` has title, description, canonical URL, Open Graph, Twitter metadata, JSON-LD and favicon/manifest references.
- `public/404.html` provides a branded 404 response.
- `public/robots.txt` and `public/sitemap.xml` are present.
- `public/privacy/index.html`, `public/terms/index.html` and `public/thank-you/index.html` are present.
- `public/CNAME` is set to `mw.ai`.
- `public/og-image.svg` is wired as the social preview image.
- Mobile sticky CTA, loading state and client-side form validation are implemented.
- Cookie consent controls gate optional analytics.
- `src/app/Analytics.tsx` loads GA4 only after consent and only when `VITE_GA_ID` is configured.

## GitHub Pages

The repository contains `.github/workflows/deploy.yml` and deploys the Vite `dist/` folder through GitHub Actions.

One repository-side check remains: GitHub Settings → Pages → Source must be **GitHub Actions**. The workflow owns future deployments from `main`.

## Custom domain

The codebase is prepared for `mw.ai`, but a domain cannot be made live by a repository commit alone. The DNS zone must point the domain to GitHub Pages and the GitHub Pages custom-domain/HTTPS state must be active.

## Analytics

Set the repository/environment build variable `VITE_GA_ID` to a real GA4 Measurement ID. Until that is set, analytics stays disabled by design.

## Lead form

The marketing form currently provides production UI states and validation but intentionally does not send lead data anywhere. Do not advertise it as a live lead endpoint until a real inbox/webhook/CRM target is connected. The production target should replace the success branch with a real POST endpoint and redirect successful submissions to `/thank-you/`.

## Screenshot checklist

- [x] Custom 404 page
- [x] Primary CTA above the fold
- [x] Meta title
- [x] Meta description
- [x] Open Graph image
- [x] Favicon
- [x] robots.txt
- [x] sitemap.xml
- [x] Image/canvas accessibility handling
- [x] Mobile breakpoints
- [x] Sticky mobile CTA
- [x] Loading state
- [x] Form error state
- [x] Thank-you page
- [x] Privacy page
- [x] Terms page
- [x] Cookie consent UI
- [ ] Analytics measurement ID
- [x] Real public founder/contact destination via LinkedIn
- [x] Static assets are lightweight; no large raster hero image was added

## Quality gates before announcing the URL

1. Confirm `npm ci && npm run build` succeeds in GitHub Actions.
2. Open the GitHub Pages URL and test the cinematic skip path, keyboard navigation and mobile CTA.
3. Configure the real `VITE_GA_ID` and lead endpoint.
4. Point `mw.ai` DNS to GitHub Pages and verify HTTPS.
5. Run Lighthouse on mobile and desktop and test social previews.
