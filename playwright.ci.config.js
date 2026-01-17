// @ts-check
const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  // 🎯 SAME test directory
  testDir: './tests',

  // 🔥 CI should still be parallel, but controlled
  fullyParallel: true,
  forbidOnly: true,

  // 🧪 CI retry strategy
  retries: 2,
  workers: 4,

  // 📊 CI REPORTING (Allure only)
    reporter: [
    ['list'], // console output
    ['allure-playwright'], // Allure reporting
    ['playwright-html-reporter', { // HTML reporting
      outputFolder: 'playwright-report',
      open: false,
      showPerformance: true,
      showBrowser: true,
      showOS: true,
    }]
  ],

  // 🧪 TEST ARTIFACTS (VERY IMPORTANT FOR CI DEBUGGING)
  use: {
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'retain-on-failure',
    headless: true,
  },

  // 📱 + 💻 SAME project logic as local
  projects: [
    {
      name: 'chrome-web',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1920, height: 1080 },
      },
    },

    {
      name: 'mobile',
      grep: /@Mobile/,
      use: {
        ...devices['iPhone 12'],
        isMobile: true,
        hasTouch: true,
      },
    },
  ],
});
