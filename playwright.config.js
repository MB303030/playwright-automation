// @ts-check
import { defineConfig, devices } from '@playwright/test';

/**
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 1,
  workers: process.env.CI ? 1 : 1,
  reporter: 'html',
  
  use: {
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'retain-on-failure',
    headless: true
  },

  /* Configure projects for major browsers */
  projects: [
    // ===== ADD THIS NEW PROJECT FOR PERFORMANCE TESTS =====
    {
      name: 'chrome-performance',
      use: { 
        ...devices['Desktop Chrome'],
        // Performance-specific settings
        launchOptions: {
          args: ['--enable-features=PerformanceObserver']
        },
        // Consistent viewport for performance measurements
        viewport: { width: 1920, height: 1080 },
        // Disable animations for consistent timing
        contextOptions: {
          reducedMotion: 'reduce'
        }
      },
      // Run only performance tests with @Performance tag
      grep: /@Performance/,
      // Run sequentially for accurate timing
      fullyParallel: false,
    },
    
    // ===== MOBILE DEVICES (ADDED BELOW) =====
    {
      name: 'iphone-small',
      use: { 
        ...devices['iPhone SE'],
        isMobile: true,
        hasTouch: true,
      },
      grepInvert: /@Performance/, // Skip performance tests
    },
    {
      name: 'iphone-standard',
      use: { 
        ...devices['iPhone 12'],
        isMobile: true,
        hasTouch: true,
      },
      grepInvert: /@Performance/,
    },
    {
      name: 'iphone-large',
      use: { 
        ...devices['iPhone 12 Pro Max'],
        isMobile: true,
        hasTouch: true,
      },
      grepInvert: /@Performance/,
    },
    {
      name: 'android-standard',
      use: { 
        ...devices['Pixel 5'],
        isMobile: true,
        hasTouch: true,
      },
      grepInvert: /@Performance/,
    },
    {
      name: 'android-small',
      use: { 
        ...devices['Galaxy S21'],
        isMobile: true,
        hasTouch: true,
      },
      grepInvert: /@Performance/,
    },
    {
      name: 'tablet-ipad',
      use: { 
        ...devices['iPad (gen 7)'],
        isMobile: true,
        hasTouch: true,
      },
      grepInvert: /@Performance/,
    },
    
    // ===== KEEP YOUR EXISTING PROJECTS EXACTLY AS IS =====
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
      // Skip performance tests (they run in separate project)
      grepInvert: /@Performance/,
    },

    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    //   grepInvert: /@Performance/,
    // },

    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    //   grepInvert: /@Performance/,
    // },
  ],
});