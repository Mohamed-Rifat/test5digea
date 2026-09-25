# 5Digea 💍 — Wedding Planning Platform

> **بالعربي باختصار:** 5Digea منصة مصرية لتخطيط الأفراح، بتوصّل العرسان بمقدمي خدمات الزفاف (قاعات، مصورين، ميكب، فساتين، ديكور، عربيات…). العرسان بيدوروا ويقارنوا ويحفظوا المفضلة ويتابعوا «خطة الفرح»، ومقدمو الخدمات بيديروا ملفهم وخدماتهم وتقييماتهم، والأدمن بيراجع ويعتمد كل حاجة قبل ما تظهر. الموقع عربي أولاً (RTL) مع دعم كامل للإنجليزي.

**Live:** https://test5digea.vercel.app · **API:** `NEXT_PUBLIC_API_URL` (ASP.NET — `WeddingPlatform.API`)

---

## Table of contents

1. [Tech stack](#tech-stack)
2. [Getting started](#getting-started)
3. [Environment variables](#environment-variables)
4. [Scripts](#scripts)
5. [Roles & route map](#roles--route-map)
6. [Features in detail](#features-in-detail)
7. [Architecture](#architecture)
8. [Project structure](#project-structure)
9. [UI kit: toasts, confirm dialog, loader](#ui-kit-toasts-confirm-dialog-loader)
10. [Internationalisation (AR / EN)](#internationalisation-ar--en)
11. [SEO & GEO](#seo--geo)
12. [Accessibility](#accessibility)
13. [Backend API reference](#backend-api-reference)
14. [Quality & testing](#quality--testing)
15. [Deployment](#deployment)
16. [Conventions](#conventions)
17. [Known limitations / backend recommendations](#known-limitations--backend-recommendations)

---

## Tech stack

| Layer | Choice |
|---|---|
| Framework | **Next.js 16** (App Router, Turbopack) + **React 19** |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS v4 (+ MUI v9 for some dashboard widgets, themed to the brand) |
| Font | **Cairo** (variable, self-hosted via `next/font/local` — Arabic + Latin, no Google Fonts request) |
| HTTP | Axios instance with auth + global loader interceptors (`src/lib/axios.ts`) |
| Charts | Recharts (admin & vendor dashboards) |
| Excel export | `xlsx` (vendor reviews export) |
| Icons | lucide-react, react-icons |
| Auth | JWT from the API, stored in `localStorage`, role read from the token |

---

## Getting started

```bash
npm install            # Node 20+ recommended
cp .env.example .env.local
npm run dev            # http://localhost:3000
```

Production:

```bash
npm run build
npm run start
```

---

## Environment variables

| Variable | Required | Purpose |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | ✅ | Base URL of the REST API (e.g. `https://jekamansy.runasp.net`). Used by the browser **and** by the server for SEO metadata, sitemap and JSON-LD. |
| `NEXT_PUBLIC_SITE_URL` | ✅ in prod | Public URL of the site (canonical URLs, sitemap, robots, Open Graph, `llms.txt`). Defaults to `https://test5digea.vercel.app`. |
| `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` | optional | Google Search Console token. |
| `NEXT_PUBLIC_INSTAGRAM_URL` / `NEXT_PUBLIC_FACEBOOK_URL` / `NEXT_PUBLIC_TIKTOK_URL` | optional | Official social profiles. Footer icons appear only for the ones that are set; they are also added to the Organization JSON-LD (`sameAs`). |

> All `NEXT_PUBLIC_*` values are inlined at **build time** — rebuild after changing them.

---

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Dev server with hot reload |
| `npm run build` | Production build (type-checks the whole app) |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint (Next core-web-vitals + TypeScript rules) — **0 errors** |

---

## Roles & route map

Roles come from the JWT claim `http://schemas.microsoft.com/ws/2008/06/identity/claims/role` (or `role`): **`User`** (couple), **`Vendor`**, **`Admin`**.

### Public (indexed by search engines)

| Route | Page |
|---|---|
| `/` | Home: hero video, categories, featured vendors & services, testimonials, app teaser |
| `/services` | Service marketplace — search, category / price / rating filters, sort, pagination, favorite & compare |
| `/services/[id]` | Service details — gallery + lightbox, packages & prices, vendor card, reviews, similar services, add to roadmap |
| `/vendors` | Vendor directory — search, category / governorate / rating filters |
| `/vendors/[id]` | Vendor profile — cover, bio, services (sort / filter), gallery, working hours, social links, contact |
| `/about` | Story & mission |
| `/contact` | Contact details + validated contact form (opens the visitor's mail app pre-filled) |
| `/support` | Help center: quick actions per role, resources, **FAQ** (also published as FAQPage structured data) |
| `/become-a-vendor` | Vendor application form (sent to the admin inbox) |

### Couple (`User`) — private, `noindex`

| Route | Page |
|---|---|
| `/favorites` | Saved vendors & services, compare from favorites |
| `/compare` | Side-by-side comparison (services, or vendors within one category) |
| `/roadmap` | Wedding roadmap: partner name, date, countdown, per-category progress, select vendor, mark done, write review |
| `/profile` | Account overview |
| `/change-password` | Change password |

### Auth — `noindex`

`/login` · `/register` · `/forgot-password` → `/verify-otp` → `/reset-password`

* Protected pages redirect guests to `/login?next=<page>`; after signing in the user returns to that page (only if their role may open it).
* A signed-in user opening `/login` is sent to their home page.

### Vendor dashboard `/vendor/*` — `noindex`

| Route | Page |
|---|---|
| `/vendor` | Dashboard: KPIs, profile completeness, attention panel, charts (ratings, monthly activity, status, performance radar), latest reviews & services |
| `/vendor/services`, `/new`, `/[id]` | Manage services: create, edit, prices, images (moderated), resubmit |
| `/vendor/profile` | Business profile, logo, gallery, contact, social links, working hours (edits go to admin review) |
| `/vendor/reviews` | Reviews with filters, drawer on mobile, **Excel export** |
| `/vendor/categories` | Assigned categories + request a new one |
| `/vendor/notifications` · `/support` · `/subscriptions` · `/security` | Notifications, help, plans, password |

New vendors see an onboarding flow (form → under review → welcome) until the admin approves them.

### Admin dashboard `/admin/*` — `noindex`

| Route | Page |
|---|---|
| `/admin` | Platform dashboard: stats, charts, latest requests, top vendors, locations |
| `/admin/vendors`, `/[id]` | Vendors: create, approve / reject / activate / deactivate, categories, details |
| `/admin/vendor-updates` | Review pending profile edits (side-by-side diff) |
| `/admin/services`, `/[id]` | Services & images moderation |
| `/admin/moderation` | Unified moderation queue (vendors, services, reviews, images) |
| `/admin/reviews` | Pending reviews + approved reviews visibility |
| `/admin/categories` | Categories CRUD + activate / deactivate |
| `/admin/messages` | Contact inbox (vendor applications, category requests, external vendor referrals) |
| `/admin/notifications` · `/admin/support` | Notifications, help |

---

## Features in detail

* **Discovery:** full-text search, filters, sorting, pagination and URL-synced filters on services and vendors.
* **Favorites** (couples only): heart button on cards/detail pages; guests are sent to login and returned afterwards.
* **Compare:** pick services (or vendors in one category) and compare prices, packages, ratings side by side.
* **Wedding roadmap:** create with partner name + date, live countdown, per-category status `NotStarted → VendorSelected → Completed`, pick a vendor, record an external vendor, write a review for completed items.
* **Reviews:** only couples with a roadmap item can review; every review is moderated before it appears.
* **Moderation workflow:** vendor profiles, profile edits, services, service images and reviews all go through admin approval, with rejection reasons and notifications.
* **Notifications:** bell with unread count (polled every 30 s) + notifications pages.
* **Session expiry:** countdown badge and warnings (1 h / 30 min / 10 min) before the JWT expires, then automatic logout.
* **Cross-tab auth sync:** logging in or out in one tab updates every open tab.
* **Bilingual & RTL**, responsive from 320 px phones to wide desktops.

---

## Architecture

```
Browser ──► Next.js (App Router)
              │  Server: layouts, metadata, JSON-LD, sitemap/robots/llms.txt (fetches public API data, cached 1h)
              │  Client: pages & dashboards (React 19, hooks in src/features/*)
              ▼
         Axios (src/lib/axios.ts) ── Bearer token ──► WeddingPlatform.API (ASP.NET)
```

* **Server-rendered public pages.** The auth provider is SSR-safe (it reports `isLoading` until hydration and reads the session with `useSyncExternalStore`), so every public page is rendered on the server with real HTML for crawlers. Dashboards are guarded on the client by `RoleGuard`.
* **Feature modules** (`src/features/<domain>`) own the API calls (`api.ts`) and React hooks (`hooks/`). UI never calls Axios directly.
* **Shared vendor state:** the vendor dashboard loads `/api/Vendors/me` once in `VendorProvider`; header, sidebar and pages read it through `useVendorContext()`.
* **Guests never hit private endpoints:** favorites / roadmap hooks only fetch for signed-in couples.

---

## Project structure

```text
src/
├── app/
│   ├── layout.tsx                 # Root: fonts, global metadata, JSON-LD, providers
│   ├── sitemap.ts · robots.ts · manifest.ts · llms.txt/route.ts · favicon.ico
│   ├── loading.tsx · not-found.tsx · globals.css · fonts/
│   ├── (public)/                  # Navbar + footer layout; each route has a layout.tsx with SEO metadata
│   ├── (auth)/                    # login, register, forgot/verify/reset password
│   ├── vendor/                    # layout.tsx (noindex) → components/vendor/VendorShell
│   └── admin/                     # layout.tsx (noindex) → components/admin/AdminShell
├── components/
│   ├── providers/                 # Auth, Toast, Confirm, Loading, MuiTheme, SessionExpiry
│   ├── layout/                    # SiteNavbar, footer, LanguageSwitcher, SkipLink
│   ├── seo/JsonLd.tsx
│   ├── guards/                    # AuthGuard, RoleGuard
│   ├── admin/ · vendor/ · public/ · reviews/ · notifications/ · shared/ · support/
├── context/                       # AuthContext, LanguageContext, VendorContext, CompareContext, SessionExpiryContext
├── features/<domain>/             # api.ts + hooks for auth, services, vendors, reviews, roadmap, favorites, …
├── lib/                           # axios, error helpers, i18n, translate-now, seo, site config, formatters, …
├── locales/{ar,en}/               # Translation dictionaries (Arabic is the source of truth for types)
└── types/                         # API DTO types
public/                            # Logo, icons (192/512/maskable/apple), og-image.jpg
```

---

## UI kit: toasts, confirm dialog, loader

**No `alert()` / `confirm()` / `prompt()` anywhere** — use these instead:

```tsx
import { useToast } from "@/components/providers/ToastProvider";
const { toast } = useToast();
toast(t("..."), "success");                       // "success" | "error" | "warning" | "info"
toast(msg, "error", { title: "…", duration: 8000 });
```

Toasts are accessible (`role="status"/"alert"`, `aria-live`), pause on hover/focus, show a progress bar, de-duplicate identical messages and keep at most 4 on screen.

```tsx
import { useConfirm } from "@/components/providers/ConfirmProvider";
const confirm = useConfirm();
if (!(await confirm({ message: t("..."), tone: "danger" }))) return;
```

The confirm dialog is a promise-based `alertdialog` with focus trap, Esc to cancel, and focus restore.

**Global loader:** every Axios request shows the animated 5Digea loader (`LoadingProvider` + `loading-bus`).

---

## Internationalisation (AR / EN)

* Dictionaries live in `src/locales/ar/*` and `src/locales/en/*`; `Translation` is typed from Arabic, so a missing English key fails the build.
* `useLanguage()` → `{ t, language, dir, isArabic, setLanguage }`. `t("section.key", { param })`.
* Outside components (hooks' catch blocks) use `translateNow("errors.loadServices")`.
* The chosen language is stored in `localStorage` (`5digea-language`) and applied to `<html lang dir>` before first paint.
* Letter-spacing utilities are neutralised in RTL so Arabic letters stay joined (Latin snippets can opt out with `lang="en"`).

---

## SEO & GEO

| Item | Where |
|---|---|
| Server-rendered HTML for all public pages | `context/AuthContext.tsx` (SSR-safe auth) |
| Title template, description, keywords, canonical, Open Graph, Twitter cards, robots | `app/layout.tsx`, `lib/seo.ts → buildMetadata()`, per-route `layout.tsx` |
| Dynamic metadata for every service & vendor (name, category, price “from”, image) | `app/(public)/services/[id]/layout.tsx`, `vendors/[id]/layout.tsx` |
| Structured data (JSON-LD) | Organization + WebSite (with SearchAction) on every page; `Service` + `Offer`s + Breadcrumb on services; `LocalBusiness` + `AggregateRating` + Breadcrumb on vendors; `FAQPage` on `/support` |
| `sitemap.xml` | `app/sitemap.ts` — static pages + every approved service & vendor (revalidated hourly) |
| `robots.txt` | `app/robots.ts` — private areas disallowed, AI crawlers (GPTBot, ClaudeBot, PerplexityBot, Google-Extended…) explicitly allowed on public pages |
| `llms.txt` (GEO) | `app/llms.txt/route.ts` — plain-language site summary for AI answer engines |
| Web app manifest & icons | `app/manifest.ts`, `public/icon-*.png`, `apple-touch-icon.png`, `favicon.ico` |
| Share image | `public/og-image.jpg` (1200×630) |
| `noindex` for dashboards, auth and personal pages | route metadata + `X-Robots-Tag` header for `/admin`, `/vendor` |
| Missing service/vendor → not-found page with `noindex` | `notFound()` in the `[id]` layouts |
| Performance | self-hosted font with `display: swap`, lazy images with `decoding="async"`, LCP image `fetchPriority="high"`, preconnect to API / ImageKit / Cloudinary, AVIF/WebP for `next/image` |
| Security headers | `next.config.ts` (nosniff, frame-options, referrer-policy, permissions-policy), `poweredByHeader: false` |

**After deploying:** set `NEXT_PUBLIC_SITE_URL` to the real domain, submit `https://<domain>/sitemap.xml` in Google Search Console and Bing Webmaster Tools, and add the verification token.

---

## Accessibility

* “Skip to content” link (first Tab stop) → `#main-content` on every layout.
* Visible, on-brand `:focus-visible` ring everywhere.
* Every icon-only button has an `aria-label`; all images have `alt`.
* One `<h1>` per page, no nested `<main>` landmarks.
* Dialogs use `role="dialog"/"alertdialog"`, `aria-modal`, Esc to close.
* `prefers-reduced-motion` respected for page, menu, toast and dialog animations.

---

## Backend API reference

Base: `NEXT_PUBLIC_API_URL`. Auth: `Authorization: Bearer <token>`.

| Area | Endpoints |
|---|---|
| Auth | `POST /api/Auth/login · register · forgot-password · verify-otp · reset-password · change-password`, `GET /api/Auth/me` |
| Categories | `GET /api/Categories`, `GET /api/Categories/{id}`, admin: `GET /admin/all`, `POST`, `PUT /{id}`, `PATCH /{id}/toggle-active`, `DELETE /{id}` |
| Services | `GET /api/Services`, `GET /search`, `GET /{id}`, `POST /compare`, vendor: `GET /me`, `POST`, `PUT /{id}`, `PUT /{id}/prices`, `POST /{id}/images`, `DELETE /{id}/images/{imageId}`, `POST /{id}/resubmit`; admin: `GET /admin/all`, `GET /admin/{id}`, `POST /{id}/approve · reject · activate · deactivate`, `POST /images/{id}/approve · reject` |
| Vendors | `GET /api/Vendors/search`, `GET /{id}`, `POST /compare`, vendor: `GET /me`, `PUT /{id}`, `POST /{id}/profile-image · gallery`, `DELETE /{id}/gallery/{imageId}`, `POST /{id}/resubmit`; admin: `POST /api/Vendors`, `GET /admin/all`, `GET /admin/{id}`, `POST /{id}/approve · reject · activate · deactivate`, `PUT /{id}/categories` |
| Reviews | `GET /api/reviews/service/{id}`, `GET /reviewable`, `POST /api/reviews`, `GET /me`; admin: `GET /admin/pending · admin/approved`, `POST /{id}/approve · reject · toggle-display` |
| Roadmap | `GET · POST · PUT /api/Roadmap`, `POST /categories/{id}/select-vendor`, `DELETE /categories/{id}/vendor`, `POST /categories/{id}/complete · uncomplete` |
| Favorites | `GET · POST · DELETE /api/Favorites` (`targetType`: 1 vendor, 2 service) |
| Notifications | `GET /api/notifications`, `GET /unread-count`, `POST /{id}/read`, `POST /read-all` |
| Moderation | `GET /api/moderation/queue`, `GET /api/moderation/dashboard` |
| Contact | `POST /api/contact-messages` (types 1 referral, 2 category request, 3 vendor application), admin: `GET /admin`, `PATCH /admin/{id}/handled` |

---

## Quality & testing

* `npx tsc --noEmit` → 0 errors · `npm run lint` → 0 errors · `npm run build` → OK.
* No `console.*` calls and no native browser dialogs in the codebase.
* The site was tested end-to-end (Playwright) against a mock of the API built from its Swagger schema: every route as guest / couple / vendor / admin, in Arabic and English, at 390 px and 1366 px, checking console errors, failed requests, horizontal overflow, headings, image alts and button labels; plus flows (login + redirect, contact form, favorites, roadmap creation, admin approve with confirm dialog, reviews export, cross-tab logout, keyboard skip link, navbar fit at 390 → 1920 px).

---

## Deployment

Vercel (recommended) or any Node host:

1. Set the environment variables above (at least `NEXT_PUBLIC_API_URL` and `NEXT_PUBLIC_SITE_URL`).
2. `npm run build && npm run start` (Vercel does this automatically).
3. Make sure the API allows CORS from the site origin.
4. Submit the sitemap to search engines.

---

## Conventions

* Keep API calls in `src/features/*/api.ts`, stateful logic in hooks, UI in components.
* Prefer TypeScript types over `any` (enforced by lint).
* Use toasts / `useConfirm` — never `alert()` / `confirm()`.
* No `console.log` in committed code.
* Every user-facing string goes through `t()` (both `ar` and `en`).
* New public route → add a `layout.tsx` with `buildMetadata()`; private route → `noIndex: true`.

---

## Known limitations / backend recommendations

* **No roadmap yet → HTTP 400.** `GET /api/Roadmap` answers 400 when the couple hasn't created a roadmap; browsers print that as a red network line in DevTools. Returning `200` with `null` (or `204`) would remove it.
* **No “general enquiry” contact type.** The contact form therefore opens the visitor's email app pre-filled. Adding a type `4 = General` to `ContactMessageType` would let the form post directly to the admin inbox.
* **Social links:** set the `NEXT_PUBLIC_*_URL` variables to show footer icons.
* `react-hooks/set-state-in-effect` is kept as a *warning* (41 places): it flags the standard “fetch in `useEffect`” pattern; migrating to a data library (e.g. TanStack Query) would clear it.

---

Made with ❤️ for couples planning their perfect wedding journey.
