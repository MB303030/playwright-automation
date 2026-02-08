// @ts-check
import { defineConfig, devices } from '@playwright/test';
import { URLS } from './constants/urls.js';

// Determine if we're in CI environment
const isCI = !!process.env.CI;

export default defineConfig({
  // 🎯 ROOT directory for ALL tests
  testDir: './tests',
  
  // 📊 Test Execution Settings
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 2 : 0,
  workers: isCI ? 2 : undefined,
  
  // 📈 Reporting
  reporter: [
    ['list'],
    ['html', {
      outputFolder: 'playwright-report',
      open: 'never',
    }],
    ['json', { outputFile: 'test-results/results.json' }],
    ['github']
  ],
  
  // 🔧 Global Test Settings
  use: {
    // Timeouts
    actionTimeout: 15000,
    navigationTimeout: 30000,
    
    // Base URL from your constants file
    baseURL: URLS.BASE,
    
    // Media capture
    screenshot: isCI ? 'only-on-failure' : 'on',
    video: isCI ? 'retain-on-failure' : 'off',
    trace: isCI ? 'retain-on-failure' : 'on-first-retry',
    
    // Browser settings - ALWAYS headless in CI
    headless: isCI ? true : false,
    ignoreHTTPSErrors: false,
    
    // Viewport
    viewport: { width: 1920, height: 1080 },
  },

  // ⚙️ Project-Specific Configurations
  projects: [
    // ===== CHROME DESKTOP =====
    {
      name: 'chrome',
      use: { 
        ...devices['Desktop Chrome'],
        channel: 'chrome',
        launchOptions: {
          args: ['--disable-dev-shm-usage', '--no-sandbox']
        }
      },
      // Run only if:
      // 1. No tags specified OR
      // 2. @chrome tag is present OR  
      // 3. @desktop tag is present OR
      // 4. @all-browsers tag is present
      grep: /@chrome|@desktop|@all-browsers/,
      grepInvert: /@mobile|@firefox-only|@safari-only/,
      timeout: 60000,
    },

    // ===== FIREFOX =====
    {
      name: 'firefox',
      use: { 
        ...devices['Desktop Firefox'],
        viewport: { width: 1920, height: 1080 },
      },
      // Run only if:
      // 1. @firefox tag is present OR
      // 2. @firefox-only tag is present OR
      // 3. @desktop tag is present OR
      // 4. @all-browsers tag is present
      grep: /@firefox|@firefox-only|@desktop|@all-browsers/,
      grepInvert: /@chrome-only|@safari-only|@mobile/,
      timeout: 60000,
    },

    // ===== SAFARI =====
    {
      name: 'safari',
      use: { 
        ...devices['Desktop Safari'],
        viewport: { width: 1920, height: 1080 },
      },
      // Run only if:
      // 1. @safari tag is present OR
      // 2. @safari-only tag is present OR
      // 3. @desktop tag is present OR
      // 4. @all-browsers tag is present
      grep: /@safari|@safari-only|@desktop|@all-browsers/,
      grepInvert: /@chrome-only|@firefox-only|@mobile/,
      timeout: 60000,
    },

    // ===== MOBILE CHROME =====
    {
      name: 'mobile-chrome',
      use: { 
        ...devices['Pixel 5'],
        viewport: { width: 393, height: 851 },
      },
      // Run only if:
      // 1. @mobile tag is present OR
      // 2. @mobile-chrome tag is present OR
      // 3. @all-browsers tag is present
      grep: /@mobile|@mobile-chrome|@all-browsers/,
      grepInvert: /@desktop-only/,
      timeout: 60000,
    },

    // ===== MOBILE SAFARI =====
    {
      name: 'mobile-safari',
      use: { 
        ...devices['iPhone 12'],
        viewport: { width: 390, height: 844 },
      },
      // Run only if:
      // 1. @mobile tag is present OR
      // 2. @mobile-safari tag is present OR
      // 3. @all-browsers tag is present
      grep: /@mobile|@mobile-safari|@all-browsers/,
      grepInvert: /@desktop-only/,
      timeout: 60000,
    },
  ],
  
  // ⏱️ Global Timeouts
  timeout: 60000,
  expect: {
    timeout: 10000,
  },
});