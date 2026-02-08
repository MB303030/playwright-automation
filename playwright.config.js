// @ts-check
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  // 🎯 ROOT directory for ALL tests
  testDir: './tests',
  
  // 📊 Test Execution Settings
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 1,  // Changed: 1 retry locally can help with flaky tests
  workers: process.env.CI ? 4 : undefined,  // Let Playwright decide locally
  
  // 📈 Reporting
  reporter: [
    ['list'],
    ['html', {
      outputFolder: 'playwright-report',
      open: 'never',
    }],
    ['json', { outputFile: 'test-results/results.json' }],  // Added: For CI integration
    ['github']  // Added: Shows annotations in GitHub PRs
  ],
  
  // 🔧 Global Test Settings
  use: {
    // Global timeout per test
    actionTimeout: 15000,
    navigationTimeout: 30000,
    
    // Authentication (if your app needs it)
    // storageState: 'playwright/.auth/user.json',
    
    // Media capture
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'retain-on-failure',  // Consider 'on-first-retry' for CI
    
    // Browser settings
    headless: true,
    ignoreHTTPSErrors: false,  // Explicitly false for security tests
    
    // Viewport
    // viewport: { width: 1920, height: 1080 }, // Moved to project-specific
  },

  // ⚙️ Project-Specific Configurations
  projects: [
    // ===== CHROME: ALL WEB TESTS =====
    {
      name: 'chrome',
      use: { 
        ...devices['Desktop Chrome'],
        viewport: { width: 1920, height: 1080 },
        launchOptions: {
          args: ['--disable-dev-shm-usage', '--no-sandbox']  // Better for CI
        }
      },
      // Exclude mobile tests
      grepInvert: /@Mobile/,
    },

    // ===== FIREFOX: SMOKE TESTS =====
    {
      name: 'firefox',
      use: { 
        ...devices['Desktop Firefox'],
        viewport: { width: 1920, height: 1080 },
      },
      grep: /@Smoke/,  // Only run smoke tests on Firefox for speed
      retries: 0,  // No retries for smoke tests
    },

    // ===== MOBILE: ALL MOBILE TESTS =====
    {
      name: 'mobile-chrome',
      grep: /@Mobile/,
      use: { 
        ...devices['Pixel 5'],  // Consider adding Android too
      },
    },
    {
      name: 'mobile-safari',
      grep: /@Mobile/,
      use: { 
        ...devices['iPhone 12'],
        isMobile: true,
        hasTouch: true,
      },
    },
  ],
  
  // ⏱️ Global Timeouts
  timeout: 60000,  // 60 seconds per test
  expect: {
    timeout: 10000,  // 10 seconds for assertions
  },
  
  // 🌐 Web Server (if your app needs a dev server)
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  //   timeout: 120 * 1000,
  // },
});