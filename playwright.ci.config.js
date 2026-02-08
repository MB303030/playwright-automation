// @ts-check
import { defineConfig, devices } from '@playwright/test';

// Environment configuration
const environments = {
  development: {
    baseURL: 'http://localhost:3000',
    apiURL: 'http://localhost:8080/api',
    timeout: 30000
  },
  staging: {
    baseURL: 'https://staging.example.com',
    apiURL: 'https://api.staging.example.com',
    timeout: 45000
  },
  production: {
    baseURL: 'https://example.com',
    apiURL: 'https://api.example.com',
    timeout: 60000
  }
};

// Get current environment from env variable or default to development
const ENV = process.env.ENVIRONMENT || 'development';
const envConfig = environments[ENV];

export default defineConfig({
  // 🎯 ROOT directory for ALL tests
  testDir: './tests',
  
  // 📊 Test Execution Settings
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 1,
  workers: process.env.CI ? 4 : undefined,
  
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
    navigationTimeout: envConfig.timeout,
    
    // Base URL from environment
    baseURL: envConfig.baseURL,
    
    // Media capture
    screenshot: process.env.CI ? 'only-on-failure' : 'on',
    video: process.env.CI ? 'retain-on-failure' : 'off',
    trace: process.env.CI ? 'retain-on-failure' : 'on-first-retry',
    
    // Browser settings
    headless: process.env.CI ? true : false,
    ignoreHTTPSErrors: false,
    
    // Viewport (can be overridden per project)
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

    // ===== CHROME HEADLESS (Fast CI) =====
    {
      name: 'chrome-headless',
      use: { 
        ...devices['Desktop Chrome'],
        launchOptions: {
          args: ['--headless', '--disable-dev-shm-usage', '--no-sandbox']
        }
      },
      grep: /@headless|@ci/,
      timeout: 45000,
      retries: 0,
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
  
  // 🌐 Web Server (uncomment and adjust as needed)
  // webServer: {
  //   command: `npm run start:${ENV}`,
  //   url: envConfig.baseURL,
  //   reuseExistingServer: !process.env.CI,
  //   timeout: 120 * 1000,
  // },
});