// @ts-check
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  // 🎯 ROOT directory for ALL tests
  testDir: './tests',
  
  fullyParallel: true,  // Changed to true for parallel execution
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 4 : 4,  // More workers for parallel
  
  reporter: [
    ['allure-playwright'],
    ['list'],
    ['playwright-html-reporter', {
      outputFolder: 'playwright-report',
      open: true,
      showPerformance: true,
      showBrowser: true,
      showOS: true,
    }]
  ],
  
  use: {
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'retain-on-failure',
    headless: true,
  },

  /* 🎯 UPDATED: Simpler Project Structure */
  projects: [
    // ===== CHROME: ALL WEB TESTS =====
    {
      name: 'chrome-web',
      // Remove testMatch - finds ALL tests in testDir
      use: { 
        ...devices['Desktop Chrome'],
        viewport: { width: 1920, height: 1080 },
      },
      // Differentiate performance vs functional by tags
      // (performance tests have @Performance tag)
    },

    // ===== MOBILE: ALL MOBILE TESTS =====
    {
      name: 'mobile',
      // Use grep to ONLY run mobile-tagged tests
      grep: /@Mobile/,
      use: { 
        ...devices['iPhone 12'],
        isMobile: true,
        hasTouch: true,
      },
    },
  ],
});