import { test, expect } from '@playwright/test';

const TEST_USER = {
    username: process.env.TEST_USER_USERNAME,
    password: process.env.TEST_USER_PASSWORD,
    firstName: process.env.TEST_USER_FIRSTNAME,
    lastName: process.env.TEST_USER_LASTNAME,
    email: process.env.TEST_USER_EMAIL
};



test('app loads', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Where Was That\?/);
});

test.describe('user journey', () => {
    let page;

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

        const hamburger = page.locator('.navbar-toggler');
        if (await hamburger.isVisible()) {
            await hamburger.click()
        }

        await expect(page.getByText(username)).toBeVisible();
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

        await page.getByRole('dialog').getByRole('button', { name: /log in/i }).click()
    })
});




// npx playwright test --headed

// npx playwright codegen http://localhost:3000