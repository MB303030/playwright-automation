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
    
    // ===== KEEP YOUR EXISTING PROJECTS (slightly modified) =====
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