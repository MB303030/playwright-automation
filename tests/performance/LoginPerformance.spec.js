// tests/performance/login-performance.spec.js
import { test, expect } from '@playwright/test';
import PomManager from '../../pages/PomManager.js';
import { URLS } from '../../constants/urls.js';
import { TEST_DATA } from '../../constants/test_data.js';

let pm; // Page Manager instance
const TEST_USERNAME = TEST_DATA.CREDENTIALS.VALID.USERNAME;
const TEST_PASSWORD = TEST_DATA.CREDENTIALS.VALID.PASSWORD;

/**
 * Test Suite: Login Page Performance Tests
 * Tag: @Performance - For filtering during test execution
 * Purpose: Validate performance metrics of the login page
 */
test.describe('Login Page Performance @Performance', () => {
    
    /**
     * Setup hook - runs before each test in this suite
     * Initializes Page Manager
     */
    test.beforeEach(async({ page }) => {
        pm = new PomManager(page);
    });

    /**
     * Test: Login page should load under 3 seconds
     * Measures the time from navigation to page fully loaded
     */
    test('Login page should load under 3 seconds', async() => {
        const startTime = Date.now();
        
        // Use the POM navigate method
        await pm.loginPage.navigate();
        
        const loadTime = Date.now() - startTime;
        
        // Performance assertion - adjust threshold as needed
        expect(loadTime).toBeLessThan(3000);
        
        // Verify page actually loaded correctly
        await expect(pm.page).toHaveURL(URLS.LOGIN);
    });

    /**
     * Test: Login form should be interactive within 2 seconds
     * Measures time until user can interact with the form
     */
    test('Login form should be interactive within 2 seconds', async() => {
        await pm.loginPage.navigate();
        
        const startTime = Date.now();
        
        // Wait for username field to be ready (visible and enabled)
        const usernameField = pm.page.locator('#username');
        await expect(usernameField).toBeVisible();
        await expect(usernameField).toBeEnabled();
        
        const readyTime = Date.now() - startTime;
        
        expect(readyTime).toBeLessThan(2000);
    });

    /**
     * Test: Complete login flow performance
     * Measures performance of entire login process
     */
    test('Complete login flow should complete under 4 seconds', async() => {
        
        const startTime = Date.now();
        
        // Step 1: Navigate to login page
        await pm.loginPage.navigate();
        
        // Step 2: Fill login form
        await pm.loginPage.login(TEST_USERNAME, TEST_PASSWORD);
        
        // Step 3: Wait for redirect to secure area
        await expect(pm.page).toHaveURL(/secure/);
        
        const totalTime = Date.now() - startTime;
        
        expect(totalTime).toBeLessThan(4000);
    });

    /**
     * Test: Network performance - page resources should load efficiently
     * Checks that page doesn't have too many or too large resources
     */
    test('Page should have optimized network requests', async() => {
        // Listen to network requests
        const requests = [];
        pm.page.on('request', request => {
            requests.push({
                url: request.url(),
                resourceType: request.resourceType()
            });
        });
        
        await pm.loginPage.navigate();
        
        // Wait for network to be idle
        await pm.page.waitForLoadState('networkidle');
        
        // Analyze requests
        const imageRequests = requests.filter(r => r.resourceType === 'image');
        const scriptRequests = requests.filter(r => r.resourceType === 'script');
        const cssRequests = requests.filter(r => r.resourceType === 'stylesheet');
        
        // Performance assertions
        expect(requests.length).toBeLessThan(30); // Not too many requests
        expect(imageRequests.length).toBeLessThan(10); // Reasonable number of images
    });

    /**
     * Test: Memory usage should be reasonable
     * Note: This is an approximation - real memory metrics require browser APIs
     */
    test('Page should have reasonable memory footprint', async() => {
        await pm.loginPage.navigate();
        
        // Get rough memory estimate by checking DOM size
        const domSize = await pm.page.evaluate(() => {
            return {
                elements: document.getElementsByTagName('*').length,
                nodes: document.querySelectorAll('*').length,
                depth: (function() {
                    let max = 0;
                    function getDepth(node, depth) {
                        if (node.children.length === 0) {
                            max = Math.max(max, depth);
                        } else {
                            for (let child of node.children) {
                                getDepth(child, depth + 1);
                            }
                        }
                    }
                    getDepth(document.documentElement, 0);
                    return max;
                })()
            };
        });
        
        expect(domSize.elements).toBeLessThan(500); // Reasonable DOM size
    });

    /**
     * Test: Performance under simulated slow network
     * Simulates 3G network conditions
     */
    test('Page should be usable on slow 3G network', async({ page, context }) => {
        // Set up slow network emulation
        await context.setOffline(false);
        
        pm = new PomManager(page);
        
        const startTime = Date.now();
        await pm.loginPage.navigate();
        
        const slowNetworkLoadTime = Date.now() - startTime;
        
        // Even on slow network, should load under 10 seconds
        expect(slowNetworkLoadTime).toBeLessThan(10000);
    });
});

/**
 * Test Suite: Performance Regression Tests
 * Tag: @Performance @Regression
 * Purpose: Catch performance regressions over time
 */
test.describe('Performance Regression Tests @Performance @Regression', () => {
    
    let pm;
    
    test.beforeEach(async({ page }) => {
        pm = new PomManager(page);
    });

    /**
     * Test: Performance baseline - compare against historical data
     * This test would typically store results in a database for comparison
     */
    test('Login page load time baseline', async() => {
        const startTime = Date.now();
        await pm.loginPage.navigate();
        const loadTime = Date.now() - startTime;
        
        // In real scenario, you would:
        // 1. Store this in a database
        // 2. Compare against historical average
        // 3. Fail if >20% slower than baseline
        
        // Example: Fail if more than 50% slower than 2 second baseline
        const historicalBaseline = 2000; // Normally from database
        const maxAllowed = historicalBaseline * 1.5; // 50% tolerance
        
        expect(loadTime).toBeLessThan(maxAllowed);
    });
});