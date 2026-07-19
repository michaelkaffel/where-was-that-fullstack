# Where Was That — Project Context
 
## What It Is
A personal full-stack MERN app for logging and revisiting outdoor places — campsites, hikes, and overlooks — with photos, notes, map pins, and favorites. Built and maintained solo by Michael, originally as part of a full-stack bootcamp (supplemented with freeCodeCamp/Codecademy).
 
## Production URLs
- **Frontend:** `https://where-was-that.com` (Firebase Hosting, was `where-was-that-place.web.app`)
- **Backend:** `https://us-central1-where-was-that-490000.cloudfunctions.net/whereWasThatServer`
- **GCS bucket:** `where-was-that-images`
- **GCP project ID:** `where-was-that-490000`
## Stack
| Layer | Tech |
|---|---|
| Frontend | React 18 (CRA) + Redux Toolkit, React-Bootstrap for UI components |
| Backend | Node.js + Express (ESM), deployed as Cloud Functions gen2 / Cloud Run (`whereWasThatServer`) |
| Database | MongoDB Atlas + Mongoose |
| Auth | Passport Local + Google OAuth, JWT (Bearer token on protected routes) |
| Images | Multer (memory storage) → Google Cloud Storage |
| Maps | Leaflet (react-leaflet) |
| Email | Resend (transactional) |
| Hosting | Firebase Hosting (frontend), Google Cloud Functions (backend) |
| CI/CD | GitHub Actions — `ci` (lint + build) and `deploy` (Firebase + Cloud Functions in parallel) |
 
> Note: unlike your other current projects (michaelkaffel.com, OCM, Decolonize Healthcare), WWT's frontend uses **React-Bootstrap**, not Tailwind CSS.
 
## Data Model
**`Place`** (`server/models/place.js`): `title` (not unique — duplicate titles are allowed, both across different users and for the same user), `description`, `imageUrl`, `location`, `dateVisited`, `favorite`, `kindOfPlace` (enum: `campsite` | `hike` | `overlook`), `owner` (ref User), `notes: [notesSchema]`. Indexes on `owner`, `kindOfPlace`, `owner+kindOfPlace`, and a text index on `title`+`description`. A `pre('deleteOne')` hook removes the associated image file. A `toJSON`/`toObject` transform on `placeSchema` converts `_id` → `id`, strips `__v`, and recursively normalizes `owner._id` and each note's `_id` → `id`.
 
**Notes** are embedded subdocuments (own schema, own index on `createdAt: -1`, own `text`/`date`), not a separate collection/slice.
 
## Redux Store Shape
-userSlice:   { user, token, isAuthenticated, loading, error }
-placesSlice: { items, selectedPlaceId, filters, loading, error }
-placesSlice.items[].notes[]
 
This was a full refactor from scratch against the API contract — old/unneeded slices were removed, notes stay embedded (no separate notes slice).
 
## Key File Locations
- `server/app.js` — Express app, MongoDB connection, middleware
- `server/index.js` — Cloud Functions entry point
- `server/gcs.js` — GCS upload/delete helpers
- `server/routes/users.js` — auth routes
- `server/routes/placeRouter.js` — places/notes routes, Multer memory storage
- `server/models/place.js` — Place schema, GCS cleanup hook
- `server/models/user.js` — User schema, cascade delete hook
- `server/authenticate.js` — Passport strategies
- `server/utils/imageProcessing.js` — sharp-based compression (resize/rotate re-encode) called from placeRouter.js before GCS upload
- `server/scripts/drop-title-index.js` — one-off migration script; drops the legacy unique index on `Place.title`
- `client/src/components/CategoryMap.js` — reusable Leaflet map for category pages
- `client/src/app/shared/baseUrl.js` — API base URL (env-switched)
- `client/.env` / `.env.production` — API URL per environment
## Architecture Quirks Worth Remembering
- **Cloud Functions pre-parses request bodies**, which breaks `express.json()`/`express.urlencoded()` and, more painfully, breaks `passport-local-mongoose`'s stream-based `authenticate()`. Login was fixed by bypassing Passport's built-in auth: manually fetching the user with `.select('+hash +salt')` and calling the instance method `user.authenticate(password, callback)` directly.
- **Multipart form fields** get lost the same way — fixed with a `restoreRawBody` helper that reconstructs a Readable stream from `req.rawBody` and reattaches both `file` and `body` to `req`.
- **Google OAuth** required an absolute `callbackURL` (via `GOOGLE_CALLBACK_URL` env var) because of the Cloud Functions path prefix, plus middleware to parse `req.query` from `req.url` since it arrived undefined.
- **GCS CORS** handled via a `cors.json` policy applied with `gsutil`.
Sharp (for image compression) needs the `linux/amd64` binary target since Cloud Functions runs Linux even though local dev is Apple Silicon. Implemented 2026-07-18 — package-lock.json was regenerated with `npm install --os=linux --cpu=x64 --include=optional` to capture both platform binaries; CI's `npm ci` on ubuntu-latest validates this on every push.
## Decisions Log
- **2026-07-01 — Place titles are not unique.** `title` originally had a global `unique: true` constraint, which silently blocked any two users from ever using the same title anywhere in the app — the likely cause of a POST /places 500 a friend hit. Considered scoping uniqueness per-owner via a compound `{owner, title}` index, but decided against enforcing uniqueness at all; titles can now repeat freely, both across users and within one user's own places. The old `title_1` index was dropped directly against MongoDB Atlas via `server/scripts/drop-title-index.js` (run locally with `MONGODB_URI` from `.env`, before deploying the schema change). The `code: 11000` duplicate-key → 409 handler added to `placeRouter.js` during the earlier debugging session is now dead code for `title` specifically and can be removed or left as a harmless fallback for other future unique indexes.
- **2026-07-18 — Node runtime bumped to 22; server dependencies patched; image compression shipped.** Node 20 reached EOL (2026-04-30); CI and Cloud Functions both moved to Node 22. `npm audit fix` resolved 21 of 28 vulnerabilities (including a critical Mongoose NoSQL-injection issue); the remaining 7 moderate `uuid` findings are deferred since the only fix path forces a breaking `@google-cloud/storage` downgrade. Image compression via `sharp` (resize to 1600px max width, EXIF auto-rotate, format-specific re-encode) added to `POST /places`, tested locally with portrait/landscape/oversized images; GCS `Cache-Control` (already set to 1yr) confirmed intact on compressed uploads.
## What's Built & Working
- Local login + Google OAuth (production-verified)
- JWT auth on all protected routes
- Place CRUD with GCS image upload, display, and cleanup on delete
- Favorite toggle
- Notes CRUD (embedded in places)
- Leaflet map on place detail pages (with "Open in Google Maps" link) and category pages (`CategoryMap` component, markers for places with valid `location.lat`/`lng`, popup with link to detail page, map center = average of valid coords, `zoom={9}`/`zoom={12}`)
- Redux architecture (`userSlice`, `placesSlice`) fully refactored and wired to the API contract
- ESLint configured in both `client/` and `server/`
- Full CI/CD pipeline via GitHub Actions
## Current Backlog
**🔴 High Priority**
- Filename sanitization for uploaded images (compression shipped 2026-07-18 — see Decisions Log)
**🟡 Medium Priority**
- `res.api()` response helper — standardize route responses, prevent serialization bugs
- Project-wide `.toObject()` audit — ensure routes use `.toJSON()`-aware patterns everywhere (follow-up to the notes `_id`/`id` bug)
**🟢 Low Priority / Future**
- Cold-start resilience — top-level `mongoose.connect()` can leave requests arriving before the connection is established
- Backend API hardening — zod validation, express-rate-limit, helmet, pino logging
- Cypress/Playwright e2e tests — CI pipeline has a placeholder job, no tests written yet
- Analytics — not set up yet
- Collapse separate category page structure (Campsites/Hikes/Overlooks → unified) — very low priority
## Dev Patterns
- Arrow function components with separate `export default`, single quotes in JSX
- `async/await` without `.then()/.catch()`
- Conventional commits, feature branch → build → manual typo review → commit → PR → merge to main
- Step-by-step verification: share terminal output/screenshots before proceeding, no skipping ahead
- Full data flow always considered: React UI → Redux → Thunk → Express → MongoDB → Normalized JSON → Redux → React UI