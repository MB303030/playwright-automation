// @ts-check
import { defineConfig, devices } from '@playwright/test';

/**
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : 2,
  
  // 🎯 FIXED REPORTER SECTION (merge both into one):
  reporter: [
    ['html'],  // Default HTML
    ['playwright-html-reporter', {  // Enhanced version
      outputFolder: 'playwright-report',  // Changed from 'html-report-enhanced'
      open: true,
      // Adds performance sections
      showPerformance: true,
      showBrowser: true,
      showOS: true
    }]
  ],
  
  use: {
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'retain-on-failure',
    headless: true
  },

  /* Configure projects for major browsers */
  projects: [
    // ===== PERFORMANCE PROJECT (UNCHANGED) =====
    {
      name: 'chrome-performance',
      use: { 
        ...devices['Desktop Chrome'],
        launchOptions: {
          args: ['--enable-features=PerformanceObserver']
        },
        viewport: { width: 1920, height: 1080 },
        contextOptions: {
          reducedMotion: 'reduce'
        }
      },
      // Run only performance tests with @Performance tag
      grep: /@Performance/,
      // Run sequentially for accurate timing
      fullyParallel: false,
    },
    
    // ===== MOBILE DEVICES (ONLY RUN @Mobile TAGGED TESTS) =====
    {
      name: 'iphone-12',
      use: { 
        ...devices['iPhone 12'],
        isMobile: true,
        hasTouch: true,
      },
      grep: /@Mobile/, // ⭐ ONLY run tests with @Mobile tag
    },
    {
      name: 'pixel-5',
      use: { 
        ...devices['Pixel 5'],
        isMobile: true,
        hasTouch: true,
      },
      grep: /@Mobile/, // ⭐ ONLY run tests with @Mobile tag
    },
    
    // ===== DESKTOP BROWSERS (UNCHANGED - SKIP @Mobile & @Performance) =====
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
      // Skip performance tests AND mobile tests
      grepInvert: /@Performance|@Mobile/,
    },

    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    //   grepInvert: /@Performance|@Mobile/,
    // },

    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    //   grepInvert: /@Performance|@Mobile/,
    // },
  ],
});  // 🎯 Only ONE closing brace and semicolon!