import path from 'path';
import { test, expect } from '@playwright/test';

const TEST_USER = {
    username: process.env.TEST_USER_USERNAME,
    password: process.env.TEST_USER_PASSWORD,
    firstName: process.env.TEST_USER_FIRSTNAME,
    lastName: process.env.TEST_USER_LASTNAME,
    email: process.env.TEST_USER_EMAIL
};

// Reusable block to open hamburger menu if closed
async function openNav(page) {
    const hamburger = page.locator('.navbar-toggler');
    if (await hamburger.isVisible()) {
        const expanded = await hamburger.getAttribute('aria-expanded');
        if (expanded !== 'true') {
            await hamburger.click();
        }
    }
}


test('app loads', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Where Was That\?/);
});

test.describe('user journey', () => {
    let page;

    let placeTitle;

    test.beforeAll(async ({ browser }) => {
        page = await browser.newPage();
    });

    test.afterAll(async () => {
        await page.close();
    });

    test('user can register', async () => {
        const { username, password, firstName, lastName, email } = TEST_USER;

        await page.goto('/');

        const signUpBtn = page.getByTestId('hero-signup-btn');
        await signUpBtn.scrollIntoViewIfNeeded();
        await signUpBtn.click();


        await expect(page.getByRole('dialog')).toBeVisible();

        await page.locator('input[name="username"]').fill(username);
        await page.locator('input[name="password"]').fill(password);
        await page.locator('input[name="firstname"]').fill(firstName);
        await page.locator('input[name="lastname"]').fill(lastName);
        await page.locator('input[name="email"]').fill(email);

        await page.getByRole('dialog').getByRole('button', { name: 'Sign Up' }).click();

        // Confirm registration succeeded — username visible in nav
        await openNav(page);
        await expect(page.getByText(username)).toBeVisible();

        // Log out so the login test starts from a clean state
        await page.getByText('Log Out').click();

        // Wait for the hero login button to confirm we're logged out
        await expect(page.getByTestId('hero-login-btn')).toBeVisible();
    });

    test('user can log in', async () => {
        const { username, password } = TEST_USER;

        await page.goto('/');

        const loginBtn = page.getByTestId('hero-login-btn');
        await loginBtn.scrollIntoViewIfNeeded();
        await loginBtn.click();

        await expect(page.getByRole('dialog')).toBeVisible();

        await page.locator('input[name="username"]').fill(username);
        await page.locator('input[name="password"]').fill(password);

        await page.getByRole('dialog').getByRole('button', { name: /log in/i }).click();

        // Confirm login succeeded — username visible in nav
        await openNav(page);
        await expect(page.getByText(username)).toBeVisible();
    });

    test('user can add a place', async () => {

        // ── 1. Navigate to Hiking Trails
        await openNav(page);
        await page.getByRole('Button', { name: 'Hikes' }).click();
        await page.waitForURL('**/hiking-trails');

        // ── 2. Open the Add Hikes accordion
        await page.getByTestId('add-place-toggle').click();

        // ── 3. Fill the form
        placeTitle = `Playwright Hike ${Date.now()}`;

        await page.locator('input[name="title"]').fill(placeTitle);
        await page.locator('input[name="location.name"]').fill('Seattle, WA');
        await page.locator('input[name="dateVisited"]').fill('2025-06-01');
        await page.locator('textarea[name="description"]').fill('Added by Playwright automation');

        // ── 4. Upload image
        const fixturePath = path.join(__dirname, '../fixtures/test-image.jpeg');
        await page.locator('input[type="file"]').setInputFiles(fixturePath);

        // ── 5. Wait display image to appear
        await expect(page.locator('img[alt="Preview"]')).toBeVisible({ timeout: 10_000 });

        // ── 6. Submit
        await page.getByRole('button', { name: 'Add Hike!' }).click();

        // ── 7. Assert the new card appears below the form
        await expect(page.getByText(placeTitle)).toBeVisible({ timeout: 10_000 })
    });

    test('user can delete a place', async () => {
        const targetCard = page.locator('.card').filter({ hasText: placeTitle });
        await targetCard.getByTestId('delete-place-btn').click()
        
        await expect(page.getByText(placeTitle)).not.toBeVisible({ timeout: 10_000 })
    });

    test('user can delete account', async () => {
        const { username } = TEST_USER;

        // ── 1. Navigate to profile page via username link in nav
        await openNav(page);
        await page.getByText(username).click();
        await page.waitForURL('**/profile');

        // ── 2. Click "Delete My Account" to trigger the confirmation modal
        await page.getByRole('button', { name: 'Delete My Account'}).click();

        // ── 3. Confirm in the modal
        await expect(page.getByRole('dialog')).toBeVisible();
        await page.getByRole('dialog')
            .getByRole('button', { name:'Yes, delete my account' })
            .click();

        await page.getByRole('dialog').getByRole('button', { name: 'OK '}).click();

        await expect(page.getByTestId('hero-login-btn')).toBeVisible({ timeout: 10_000 })
    });
});




// npx playwright test --headed

// npx playwright codegen http://localhost:3000