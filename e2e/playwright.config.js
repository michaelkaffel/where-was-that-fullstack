import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config({ path: resolve(process.cwd(), '.env'), quiet: true });

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: 'html',

  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    ignoreHTTPSErrors: true,
  },

  projects: [
    // {
    //   name: 'desktop chromium',
    //   use: { ...devices['Desktop Chrome'] },
    // },
    {
      name: 'mobile safari',
      use: { ...devices['iPhone 14'] },
    },
    // {
    //   name: 'mobile chromium',
    //   use: { ...devices['Pixel 7'] },
    // },
  ],
});

