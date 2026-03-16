![Playwright](https://img.shields.io/badge/tested%20with-Playwright-45ba4b?logo=playwright)
![Status](https://img.shields.io/badge/tests-passing-brightgreen)

# E2E Tests — Where Was That?

End-to-end tests for the Where Was That? application using [Playwright](https://playwright.dev). The suite runs against the local development server and covers the full user journey from registration through account deletion.

---

## Setup

### 1. Install dependencies

```bash
cd e2e
npm install
npx playwright install
```

### 2. Create `.env`

```
BASE_URL=https://localhost:3000
TEST_USER_USERNAME=your_test_username
TEST_USER_PASSWORD=your_test_password
TEST_USER_FIRSTNAME=Test
TEST_USER_LASTNAME=User
TEST_USER_EMAIL=testuser@example.com
```

The test user is registered fresh on each run and deleted at the end. Use credentials that don't conflict with a real account.

### 3. Add a fixture image

Place any JPEG at `fixtures/test-image.jpeg`. It is used for the image upload test and is not committed to the repo.

### 4. Start the local dev server

Both the client and server must be running before executing the suite.

### 5. Run the tests

```bash
npx playwright test
```

To watch the browser:

```bash
npx playwright test --headed
```

To view the last test report:

```bash
npx playwright show-report
```

---

## Suite Structure

```
e2e/
├── fixtures/              # Static test assets (test image — not committed)
├── pages/                 # Page object models (scaffolded for future use)
├── tests/
│   └── userJourney.spec.js
├── .env                   # Local credentials (gitignored)
├── playwright.config.js
└── package.json
```

---

## Test Flow

All tests in the `user journey` describe block share a single browser context, so session state persists across them in order.

| Test | What it does |
|------|--------------|
| `app loads` | Standalone — verifies the page title loads correctly |
| `user can register` | Fills the registration form, confirms username appears in the navbar, logs out |
| `user can log in` | Logs in with test credentials, confirms username appears in the navbar |
| `user can add a place` | Navigates to Hiking Trails, opens the accordion form, fills all fields, uploads an image, submits, and asserts the new card appears |
| `user can delete a place` | Finds the card created in the previous test by title and deletes it |
| `user can delete account` | Navigates to the profile page, triggers the delete flow, confirms the confirmation modal, and asserts redirect to home |

---

## Notable Implementation Details

**`data-testid` attributes added to the React app:**
- `add-place-toggle` on `Accordion.Header` in `AccordionForPlaceForm.jsx` — the only reliable locator for the accordion toggle across all three place type pages
- `delete-place-btn` on the trash icon in `PlaceCard.jsx`
- `hero-signup-btn` and `hero-login-btn` on the landing page hero buttons — the only viewport-agnostic locators for those elements

**Image upload gate:** `processImage16x9` processes the uploaded file through an async canvas operation before calling Formik's `setFieldValue`. The test waits for `img[alt="Preview"]` to appear before submitting — without this, the form submits with `values.image === null`.

**`openNav` helper:** Checks `aria-expanded` on the Bootstrap navbar toggler before clicking. Clicking an already-open Bootstrap navbar would close it, breaking any test that tries to interact with nav links immediately after.

**Shared `placeTitle`:** Declared as a `let` at the describe scope and assigned (without `const`) inside the add test. Using `const` would shadow the outer variable and leave it `undefined` in the delete test.

---

## Configuration

- **Browser:** Mobile Safari (primary user base is mobile)
- **Viewport:** iPhone SE
- **Workers:** 1 (no parallelism — tests share session state)
- **`ignoreHTTPSErrors: true`** — required for the self-signed SSL cert on the local dev server

---

## Backlog

- Favorites toggle test
- Notes CRUD test
- Explicit logout test
- CI/CD integration (suite currently runs locally only)
