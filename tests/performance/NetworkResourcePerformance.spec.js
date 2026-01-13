/**
 * ==============================================================
 * NETWORK & RESOURCE PERFORMANCE TESTS
 * ==============================================================
 * 
 * Tests network efficiency and resource optimization.
 * Ensures the page doesn't waste bandwidth or make unnecessary requests.
 * 
 * Run Frequency: Daily (in nightly builds)
 * Tags: @Performance @Network @Detailed
 * 
 * Principles Tested:
 * 4. EFFICIENCY: Page shouldn't waste resources
 * ==============================================================
 */

import { test, expect } from '@playwright/test';
import PomManager from '../../pages/PomManager.js';
import { TEST_DATA } from '../../constants/test_data.js';
import { 
    measureExecutionTime, 
    formatTime,
    assertPerformanceThreshold 
} from '../../utils/PerformanceUtils.js';

const { LOGIN_FORM } = TEST_DATA.SELECTORS;

let pm;

test.describe('Network & Resource Performance @Performance @Network @Detailed', () => {
    
    test.beforeEach(async({ page }) => {
        pm = new PomManager(page);
    });

    /**
     * Network Efficiency: FULL PAGE LOAD WITH NETWORK IDLE
     * Measures time until all network requests complete.
     * Important for users on metered connections or slow networks.
     */
    test('Page should load efficiently with network idle', async() => {
        const requests = [];
        pm.page.on('request', request => {
            requests.push({
                url: request.url(),
                resourceType: request.resourceType()
            });
        });
        
        const { time: loadTime } = await measureExecutionTime(async () => {
            await pm.loginPage.navigate();
            await pm.page.waitForLoadState('networkidle');
        });
        
        const imageRequests = requests.filter(r => r.resourceType === 'image');
        const scriptRequests = requests.filter(r => r.resourceType === 'script');
        const cssRequests = requests.filter(r => r.resourceType === 'stylesheet');
        
        console.log(`Network idle load time: ${formatTime(loadTime)}`);
        console.log(`Total requests: ${requests.length}`);
        console.log(`Images: ${imageRequests.length}, Scripts: ${scriptRequests.length}, CSS: ${cssRequests.length}`);
        
        assertPerformanceThreshold(loadTime, 4000, 'Page load with network idle');
        
        // Resource count assertions
        expect(requests.length, 'Too many HTTP requests').toBeLessThan(30);
        expect(imageRequests.length, 'Too many images').toBeLessThan(10);
        expect(scriptRequests.length, 'Too many scripts').toBeLessThan(8);
    });

    /**
     * Core Web Vitals: TIME TO FIRST BYTE (TTFB)
     * Measures server response time. Critical for perceived performance.
     * Google Core Web Vitals threshold: < 1 second
     */
    test('Time to First Byte should be under 1 second', async() => {
        const { time: totalLoadTime, result: navigationTiming } = await measureExecutionTime(async () => {
            await pm.loginPage.navigate();
            
            return await pm.page.evaluate(() => {
                const [navigationEntry] = performance.getEntriesByType('navigation');
                return {
                    ttfb: navigationEntry.responseStart - navigationEntry.startTime,
                    domContentLoaded: navigationEntry.domContentLoadedEventEnd - navigationEntry.startTime,
                    loadEvent: navigationEntry.loadEventEnd - navigationEntry.startTime
                };
            });
        });
        
        console.log(`Total load time: ${formatTime(totalLoadTime)}`);
        console.log(`TTFB: ${formatTime(navigationTiming.ttfb)}`);
        console.log(`DOM Content Loaded: ${formatTime(navigationTiming.domContentLoaded)}`);
        console.log(`Load Event: ${formatTime(navigationTiming.loadEvent)}`);
        
        expect(navigationTiming.ttfb, 'Time to First Byte too high').toBeLessThan(1000);
    });
});