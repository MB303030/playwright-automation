const { defineConfig, devices } = require('@playwright/test');
const path = require('path');

module.exports = defineConfig({
  testDir: './tests',
  
  fullyParallel: true,
  forbidOnly: true,
  retries: 2,
  workers: 4,

  reporter:  [
    ['list'],
    ['allure-playwright'],
    ['html', { 
      outputFolder: 'playwright-report',
      open: 'never'
    }],
    // Add json reporter for better CI integration
    ['json', { outputFile: 'test-results/test-results.json' }]
  ],

  // 🧪 TEST ARTIFACTS - FIXED PATH CONFIGURATION
  use: {
    // Store screenshots in test-results folder
    screenshot: {
      mode: 'only-on-failure',
      fullPage: true,
    },
    
    // Store videos in test-results folder  
    video: {
      mode: 'retain-on-failure',
      size: { width: 1920, height: 1080 }
    },
    
    // Store traces in test-results folder
    trace: 'retain-on-failure',
    
    headless: true,
    
    // Base path for all artifacts
    baseURL: process.env.BASE_URL || 'http://localhost:3000',
  },

  // 📱 + 💻 Project configuration
  projects: [
    {
      name: 'chrome-web',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1920, height: 1080 },
        // Project-specific screenshot settings
        screenshot: 'only-on-failure',
        video: 'retain-on-failure',
        trace: 'retain-on-failure',
      },
    },
    {
      name: 'mobile',
      grep: /@Mobile/,
      use: {
        ...devices['iPhone 12'],
        isMobile: true,
        hasTouch: true,
        // Project-specific screenshot settings
        screenshot: 'only-on-failure',
        video: 'retain-on-failure',
        trace: 'retain-on-failure',
      },
    },
  ],

  // Global output directory for all artifacts
  outputDir: 'test-results/',
});