# CLAUDE.md

Guidance for Claude Code when working in this repository.

## What This Is

**Where Was That** — a full-stack MERN app for logging and revisiting outdoor places (campsites, hikes, overlooks) with photos, notes, map pins, and favorites. Built and maintained solo by Michael, originally as a full-stack bootcamp capstone (supplemented with freeCodeCamp/Codecademy). Doubles as a portfolio piece / business card for his freelance practice, "Down By The River Development."

- **Frontend:** https://where-was-that.com (Firebase Hosting)
- **Backend:** Cloud Functions gen2 — `whereWasThatServer` (`https://us-central1-where-was-that-490000.cloudfunctions.net/whereWasThatServer`)
- **GCS bucket:** `where-was-that-images`
- **GCP project ID:** `where-was-that-490000`

> ⚠️ Three fragmented GCP projects exist historically: `where-was-that-490000`, `where-was-that-place`, `wherewasthat-auth`. This is a known learning-era artifact, not intentional architecture. Consolidation is a longer-term goal — don't assume a single GCP project when debugging infra.

## Stack

| Layer | Tech |
|---|---|
| Frontend | React 18 (CRA) + Redux Toolkit, React-Bootstrap, React Router |
| Backend | Node.js 22 + Express (ESM), deployed as Cloud Functions gen2 (`whereWasThatServer`) |
| Database | MongoDB Atlas + Mongoose |
| Auth | Passport Local + Google OAuth, JWT (Bearer token on protected routes) |
| Images | Multer (memory storage) → Sharp (compression) → Google Cloud Storage |
| Maps | Leaflet (react-leaflet) |
| Email | Resend (`emailService.js`, transactional); `contact@where-was-that.com` routes via Cloudflare → Gmail forwarding |
| Hosting | Firebase Hosting (frontend), Cloud Functions (backend) |
| CI/CD | GitHub Actions — `ci` (lint + build) and `deploy` (Firebase + Cloud Functions as independent parallel jobs) |
| Logging | Cloud Logging — `error-logs` bucket, 90-day retention, log router sink for `severity>=ERROR` |

> **Note:** unlike Michael's other current projects (michaelkaffel.com, Owl Chrysalis Medicine, Decolonize Healthcare), this frontend uses **React-Bootstrap**, not Tailwind CSS.

## Data Model

**`Place`** (`server/models/place.js`): `title`, `description`, `imageUrl`, `location`, `dateVisited`, `favorite`, `kindOfPlace` (enum: `campsite | hike | overlook`), `owner` (ref User), `notes: [notesSchema]`.
- Indexes: `owner`, `kindOfPlace`, `owner+kindOfPlace`, text index on `title`+`description`.
- **`title` is no longer unique** — the unique constraint was removed because it incorrectly prevented different users from creating places with the same title. Migration: `server/scripts/drop-title-index.js` (already run against production).
- `pre('deleteOne')` hook removes the associated GCS image file.
- `toJSON`/`toObject` transform converts `_id` → `id`, strips `__v`, normalizes `owner._id` and each note's `_id` → `id`.

**Notes** are embedded subdocuments (own schema, own index on `createdAt: -1`), not a separate collection or Redux slice.

**User**: `username`, `firstname`, `lastname`, `email` (unique), `googleId`, `admin`, password via `passport-local-mongoose` (`hash`/`salt`). Cascade-delete hook removes owned places and their images when a user is deleted.

## Redux Store Shape
userSlice: { user, token, isAuthenticated, loading, error }
placesSlice: { items, selectedPlaceId, filters, loading, error }
placesSlice.items[].notes[]


This was a full refactor from scratch against the API contract — old/unneeded slices were removed, notes stay embedded (no separate notes slice).

## Key File Locations

- `server/app.js` — Express app, MongoDB connection, middleware
- `server/index.js` — Cloud Functions entry point
- `server/gcs.js` — pure GCS upload/delete storage layer
- `server/utils/imageProcessing.js` — Sharp pipeline (EXIF auto-rotation, 1600px max width with `withoutEnlargement`, format-specific quality) sitting in front of GCS uploads
- `server/routes/users.js` — auth routes
- `server/routes/placeRouter.js` — places/notes routes, Multer memory storage
- `server/models/place.js` — Place schema, GCS cleanup hook
- `server/models/user.js` — User schema, cascade delete hook
- `server/authenticate.js` — Passport strategies
- `server/scripts/` — standalone maintenance scripts (see gotcha below re: model imports)
- `client/src/components/CategoryMap.js` — reusable Leaflet map for category pages
- `client/src/app/shared/baseUrl.js` — API base URL (env-switched)
- `client/.env` / `.env.production` — API URL per environment

## Architecture Quirks & Hard-Won Fixes

- **Cloud Functions pre-parses request bodies**, breaking `express.json()`/`express.urlencoded()` and `passport-local-mongoose`'s stream-based `authenticate()`. Fixed by bypassing Passport's built-in auth: manually fetch the user with `.select('+hash +salt')` and call the instance method `user.authenticate(password, callback)` directly.
- **Multipart form fields** get lost the same way — fixed with a `restoreRawBody` helper that reconstructs a Readable stream from `req.rawBody` and reattaches `file`/`body` to `req`.
- **Google OAuth** requires an absolute `callbackURL` (via `GOOGLE_CALLBACK_URL` env var) because of the Cloud Functions path prefix, plus middleware to parse `req.query` from `req.url` (arrives undefined otherwise).
- **GCS CORS** is handled via a `cors.json` policy applied with `gsutil`.
- **Sharp on Cloud Functions**: needs the `linux/amd64`/`linux-x64` binary target since Cloud Functions runs Linux even though local dev is Apple Silicon. Solved via a two-step lockfile strategy: `npm install`, then `npm install --os=linux --cpu=x64 --include=optional` — this captures both `darwin-arm64` and `linux-x64` variants before CI runs `npm ci` on `ubuntu-latest`.
- **Migrations before deploys**: run schema migrations against production Atlas *before* deploying code that assumes the new schema, to avoid a window of inconsistency (this is how the title-uniqueness migration was sequenced).
- **Standalone scripts**: avoid importing Mongoose models directly in one-off scripts — it pulls in module-scope side effects (e.g. GCS client initialization). Use `mongoose.connection.collection()` directly instead.
- **Firebase deploy action pitfall**: `FirebaseExtended/action-hosting-deploy@v0` internally calls `npx firebase-tools@latest` and ignores globally installed versions. Pinning requires calling `npx firebase-tools@13.29.1` directly rather than through the wrapper action.
- **Cloud Logging time range**: the Logs Explorer date picker does not auto-update — always verify the time range explicitly before concluding a trace/log doesn't exist.
- **GCP billing budgets are alert-only** — they do not hard-cap spend.

## What's Built & Working

- Local login + Google OAuth (production-verified)
- JWT auth on all protected routes
- Place CRUD with GCS image upload (Multer memory storage → Sharp compression → GCS), display, and cleanup on delete
- Favorite toggle
- Notes CRUD (embedded in places)
- Leaflet maps on place detail pages ("Open in Google Maps" link) and category pages (`CategoryMap`, markers for places with valid coords, popup linking to detail page)
- Redux (`userSlice`, `placesSlice`) fully wired to the API contract
- Full CI/CD via GitHub Actions with branch protection requiring CI to pass before merge to `main`
- Node.js 22 across CI/CD, Cloud Functions runtime, `package.json` engines, README
- Onboarding carousel on the homepage for logged-out users (five slides, custom nav, Bootstrap indicators)
- Structured error logging in `POST /places` and the production error handler in `app.js`
- Critical Mongoose NoSQL injection CVE patched via dependency audit

## Current Backlog

**🔴 Open**
- Review `middleware.js` query construction patterns and recommend further NoSQL injection mitigations (beyond the patched CVE) — queued from last session
- Filename sanitization for uploads
- Thumbnail generation for card views (lower priority)
- Year/month folder structure in GCS bucket (lower priority)

**🟡 Medium**
- `res.api()` response helper — standardize route responses (status: shipped per completed list — verify against latest branch before assuming still open)
- Extend user profile page frontend to support username/email change (backend `PATCH /users/me` already supports it via `allowedFields`)
- Admin panel (backend routes largely already implemented — `GET /users`, `DELETE /users/:userId`; needs `PATCH /users/:userId` for admin role/field updates, plus frontend `AdminPage`)
- Location Phase 2 — Nominatim address autocomplete on the place form; also improve reverse-geocode quality in "Find My Location" (currently only checks city/town/village fields)
- Playwright e2e testing — in progress on `feature/playwright-setup` (`tests/auth.spec.js`, `tests/places.spec.js`, `tests/notes.spec.js`)

**🟢 Low / Future**
- Cold-start resilience refinement (connection-await middleware exists; edge cases may remain)
- Transactional email flows: welcome email, forgot-username, forgot-password + reset (never confirm email existence in responses; single-use, 15–30 min expiry tokens)
- Backend hardening: zod validation, express-rate-limit, helmet, pino logging
- Consolidate the three fragmented GCP projects
- Potential migration from Cloud Functions to Cloud Run directly (would eliminate the `restoreRawBody` workaround)
- Dead code cleanup: unused `let url = process.env.MONGO_ATLAS` in `app.js`; dead `code: 11000` → 409 duplicate-key handler in `placeRouter.js` (unreachable now that the title unique constraint is gone)
- Minor bug: `req.header.origin` → `req.header('origin')` in `cors.js` (only affects a `console.log`, not behavior)
- Collapse separate category page structure (Campsites/Hikes/Overlooks → unified) — very low priority

> ⚠️ **Note on the bundled JSON docs** (`todo-backlog.json`, `architecture-map.json`, `database-schema.json`, `auth-flow.json`, `api-contract.json`, dated March 2026): several are stale relative to shipped work. In particular, Sharp compression is **shipped** (not pending), image storage is **GCS via Multer memory storage** (not local disk / `public/images`), and `title` is **no longer unique**. Treat this CLAUDE.md and `context.md` as the current source of truth; update the JSON docs to match in a follow-up pass.

## Dev Patterns & Workflow

- Arrow function components with separate `export default`; single quotes in JSX
- `async/await` without `.then()/.catch()`
- Conventional commits
- **Each change ships as its own PR**, validated through CI, merged before the next begins. Branch protection requires CI status checks to pass.
- **Infrastructure before features**: prerequisite fixes (runtime upgrades, dependency audits, lockfile hardening) ship as separate PRs before new functionality
- Documentation (`context.md`, `database-schema.json`, `todo-backlog.json`) is updated in the same PR or immediately after — flag this to Michael when it hasn't happened
- Draft a markdown PR description for non-trivial changes
- Local testing before deploy (verify compression behavior, logging output, etc.); spot-check production after deploy
- Log deferred decisions explicitly, with rationale (see below)
- Step-by-step verification: share terminal output/screenshots before proceeding — don't skip ahead
- Full data flow to keep in mind: React UI → Redux → Thunk → Express → MongoDB → Normalized JSON → Redux → React UI

### Deferred decisions (existing rationale, for context)
- 7 moderate `uuid` audit findings deliberately deferred — the fix path forces a breaking `@google-cloud/storage` downgrade
- A `{owner, title}` compound index was considered but not implemented

## API Surface (high-level)

- `POST /users/signup`, `POST /users/login`, `GET /users/auth/google`, `GET /users/auth/google/callback`
- `GET /users` (admin only), `DELETE /users/:userId` (admin only), `PATCH /users/me`, `DELETE /users/me`
- `GET /places`, `POST /places` (multipart, image), `GET /places/:placeId`, `PATCH /places/:placeId` (favorite), `DELETE /places/:placeId`
- `GET|POST /places/:placeId/notes`, `GET|PATCH|DELETE /places/:placeId/notes/:noteId`, `DELETE /places/:placeId/notes` (all notes)

Full request/response shapes are in `api-contract.json` — but re-verify against the actual route handlers before relying on it for anything touching images or the `title` field, since those parts are stale.


This was a full refactor from scratch against the API contract — old/unneeded slices were removed, notes stay embedded (no separate notes slice).

## Key File Locations

- `server/app.js` — Express app, MongoDB connection, middleware
- `server/index.js` — Cloud Functions entry point
- `server/gcs.js` — pure GCS upload/delete storage layer
- `server/utils/imageProcessing.js` — Sharp pipeline (EXIF auto-rotation, 1600px max width with `withoutEnlargement`, format-specific quality) sitting in front of GCS uploads
- `server/routes/users.js` — auth routes
- `server/routes/placeRouter.js` — places/notes routes, Multer memory storage
- `server/models/place.js` — Place schema, GCS cleanup hook
- `server/models/user.js` — User schema, cascade delete hook
- `server/authenticate.js` — Passport strategies
- `server/scripts/` — standalone maintenance scripts (see gotcha below re: model imports)
- `client/src/components/CategoryMap.js` — reusable Leaflet map for category pages
- `client/src/app/shared/baseUrl.js` — API base URL (env-switched)
- `client/.env` / `.env.production` — API URL per environment

## Architecture Quirks & Hard-Won Fixes

- **Cloud Functions pre-parses request bodies**, breaking `express.json()`/`express.urlencoded()` and `passport-local-mongoose`'s stream-based `authenticate()`. Fixed by bypassing Passport's built-in auth: manually fetch the user with `.select('+hash +salt')` and call the instance method `user.authenticate(password, callback)` directly.
- **Multipart form fields** get lost the same way — fixed with a `restoreRawBody` helper that reconstructs a Readable stream from `req.rawBody` and reattaches `file`/`body` to `req`.
- **Google OAuth** requires an absolute `callbackURL` (via `GOOGLE_CALLBACK_URL` env var) because of the Cloud Functions path prefix, plus middleware to parse `req.query` from `req.url` (arrives undefined otherwise).
- **GCS CORS** is handled via a `cors.json` policy applied with `gsutil`.
- **Sharp on Cloud Functions**: needs the `linux/amd64`/`linux-x64` binary target since Cloud Functions runs Linux even though local dev is Apple Silicon. Solved via a two-step lockfile strategy: `npm install`, then `npm install --os=linux --cpu=x64 --include=optional` — this captures both `darwin-arm64` and `linux-x64` variants before CI runs `npm ci` on `ubuntu-latest`.
- **Migrations before deploys**: run schema migrations against production Atlas *before* deploying code that assumes the new schema, to avoid a window of inconsistency (this is how the title-uniqueness migration was sequenced).
- **Standalone scripts**: avoid importing Mongoose models directly in one-off scripts — it pulls in module-scope side effects (e.g. GCS client initialization). Use `mongoose.connection.collection()` directly instead.
- **Firebase deploy action pitfall**: `FirebaseExtended/action-hosting-deploy@v0` internally calls `npx firebase-tools@latest` and ignores globally installed versions. Pinning requires calling `npx firebase-tools@13.29.1` directly rather than through the wrapper action.
- **Cloud Logging time range**: the Logs Explorer date picker does not auto-update — always verify the time range explicitly before concluding a trace/log doesn't exist.
- **GCP billing budgets are alert-only** — they do not hard-cap spend.

## What's Built & Working

- Local login + Google OAuth (production-verified)
- JWT auth on all protected routes
- Place CRUD with GCS image upload (Multer memory storage → Sharp compression → GCS), display, and cleanup on delete
- Favorite toggle
- Notes CRUD (embedded in places)
- Leaflet maps on place detail pages ("Open in Google Maps" link) and category pages (`CategoryMap`, markers for places with valid coords, popup linking to detail page)
- Redux (`userSlice`, `placesSlice`) fully wired to the API contract
- Full CI/CD via GitHub Actions with branch protection requiring CI to pass before merge to `main`
- Node.js 22 across CI/CD, Cloud Functions runtime, `package.json` engines, README
- Onboarding carousel on the homepage for logged-out users (five slides, custom nav, Bootstrap indicators)
- Structured error logging in `POST /places` and the production error handler in `app.js`
- Critical Mongoose NoSQL injection CVE patched via dependency audit

## Current Backlog

**🔴 Open**
- Review `middleware.js` query construction patterns and recommend further NoSQL injection mitigations (beyond the patched CVE) — queued from last session
- Filename sanitization for uploads
- Thumbnail generation for card views (lower priority)
- Year/month folder structure in GCS bucket (lower priority)

**🟡 Medium**
- `res.api()` response helper — standardize route responses (status: shipped per completed list — verify against latest branch before assuming still open)
- Extend user profile page frontend to support username/email change (backend `PATCH /users/me` already supports it via `allowedFields`)
- Admin panel (backend routes largely already implemented — `GET /users`, `DELETE /users/:userId`; needs `PATCH /users/:userId` for admin role/field updates, plus frontend `AdminPage`)
- Location Phase 2 — Nominatim address autocomplete on the place form; also improve reverse-geocode quality in "Find My Location" (currently only checks city/town/village fields)
- Playwright e2e testing — in progress on `feature/playwright-setup` (`tests/auth.spec.js`, `tests/places.spec.js`, `tests/notes.spec.js`)

**🟢 Low / Future**
- Cold-start resilience refinement (connection-await middleware exists; edge cases may remain)
- Transactional email flows: welcome email, forgot-username, forgot-password + reset (never confirm email existence in responses; single-use, 15–30 min expiry tokens)
- Backend hardening: zod validation, express-rate-limit, helmet, pino logging
- Consolidate the three fragmented GCP projects
- Potential migration from Cloud Functions to Cloud Run directly (would eliminate the `restoreRawBody` workaround)
- Dead code cleanup: unused `let url = process.env.MONGO_ATLAS` in `app.js`; dead `code: 11000` → 409 duplicate-key handler in `placeRouter.js` (unreachable now that the title unique constraint is gone)
- Minor bug: `req.header.origin` → `req.header('origin')` in `cors.js` (only affects a `console.log`, not behavior)
- Collapse separate category page structure (Campsites/Hikes/Overlooks → unified) — very low priority

> ⚠️ **Note on the bundled JSON docs** (`todo-backlog.json`, `architecture-map.json`, `database-schema.json`, `auth-flow.json`, `api-contract.json`, dated March 2026): several are stale relative to shipped work. In particular, Sharp compression is **shipped** (not pending), image storage is **GCS via Multer memory storage** (not local disk / `public/images`), and `title` is **no longer unique**. Treat this CLAUDE.md and `context.md` as the current source of truth; update the JSON docs to match in a follow-up pass.

## Dev Patterns & Workflow

- Arrow function components with separate `export default`; single quotes in JSX
- `async/await` without `.then()/.catch()`
- Conventional commits
- **Each change ships as its own PR**, validated through CI, merged before the next begins. Branch protection requires CI status checks to pass.
- **Infrastructure before features**: prerequisite fixes (runtime upgrades, dependency audits, lockfile hardening) ship as separate PRs before new functionality
- Documentation (`context.md`, `database-schema.json`, `todo-backlog.json`) is updated in the same PR or immediately after — flag this to Michael when it hasn't happened
- Draft a markdown PR description for non-trivial changes
- Local testing before deploy (verify compression behavior, logging output, etc.); spot-check production after deploy
- Log deferred decisions explicitly, with rationale (see below)
- Step-by-step verification: share terminal output/screenshots before proceeding — don't skip ahead
- Full data flow to keep in mind: React UI → Redux → Thunk → Express → MongoDB → Normalized JSON → Redux → React UI

### Deferred decisions (existing rationale, for context)
- 7 moderate `uuid` audit findings deliberately deferred — the fix path forces a breaking `@google-cloud/storage` downgrade
- A `{owner, title}` compound index was considered but not implemented

## API Surface (high-level)

- `POST /users/signup`, `POST /users/login`, `GET /users/auth/google`, `GET /users/auth/google/callback`
- `GET /users` (admin only), `DELETE /users/:userId` (admin only), `PATCH /users/me`, `DELETE /users/me`
- `GET /places`, `POST /places` (multipart, image), `GET /places/:placeId`, `PATCH /places/:placeId` (favorite), `DELETE /places/:placeId`
- `GET|POST /places/:placeId/notes`, `GET|PATCH|DELETE /places/:placeId/notes/:noteId`, `DELETE /places/:placeId/notes` (all notes)

Full request/response shapes are in `api-contract.json` — but re-verify against the actual route handlers before relying on it for anything touching images or the `title` field, since those parts are stale.

