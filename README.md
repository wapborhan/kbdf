# KBDF — Phase 1 scaffold
1. `npm install`  2. copy `.env.example` to `.env.local` and fill it  3. `npm run dev`
Done: public site, Google-only login, sidebar dashboard (overview stats, donors/requests tables with filters, users), roles admin/moderator/user, date picker + textarea forms.
Data: all listings/search/filter/pagination run in SERVER components via URL params (lib/queries.js). Dashboard reads the user from an httpOnly session cookie (/api/session). Mutations call API routes with the Firebase token, then router.refresh().
Pages: /volunteers (also /volunteer, /volentear redirect) lists volunteers who are approved AND ticked the public-listing consent box in their profile.
SEO: set NEXT_PUBLIC_SITE_URL to your real domain (canonical, sitemap, Open Graph). Icons: app/icon.svg, favicon.ico, apple-icon.png.
Setup: 1) start MongoDB locally (mongodb://localhost:27017/kbdfDB) 2) npm run db:check 3) Firebase console > enable Google sign-in, add domains 4) set ADMIN_EMAILS in .env.local. New users register via Google as role "user" and wait for admin/moderator approval; volunteers add/edit requests that need approval.
