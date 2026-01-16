/**
 * ==============================================================
 * SLOW NETWORK PERFORMANCE TESTS
 * ==============================================================
 * 
 * Tests performance under simulated 3G network conditions.
 * Ensures the app works well for users with poor connectivity.
 * 
 * Run Frequency: Weekly (slow tests)
 * Tags: @Performance @SlowNetwork @Resilience
 * 
 * Principles Tested:
 * 5. RESILIENCE: Should work even on slow networks
 * ==============================================================
 */

import { test } from '@playwright/test';
import PomManager from '../../pages/PomManager.js';
import { TEST_DATA } from '../../constants/test_data.js';
import { 
    measureExecutionTime,
    assertPerformanceThreshold 
} from '../../utils/PerformanceUtils.js';

const { LOGIN_FORM } = TEST_DATA.SELECTORS;

let pm;

test.describe('Slow Network Performance @Performance @SlowNetwork @Resilience', () => {
    
    test.beforeEach(async({ page }) => {
        pm = new PomManager(page);
    });

    /**
     * Network Resilience: 3G NETWORK PERFORMANCE
     * Simulates real-world slow network conditions.
     * Important for mobile users and emerging markets.
     */
    test('Page should be usable on slow 3G network', async({ page, context }) => {
        // Simulate 3G network conditions (1.5 Mbps download, 750 Kbps upload)
        const cdpSession = await context.newCDPSession(page);
        await cdpSession.send('Network.emulateNetworkConditions', {
            offline: false,
            downloadThroughput: 1.5 * 1024 * 1024 / 8, // 1.5 Mbps
            uploadThroughput: 750 * 1024 / 8, // 750 Kbps
            latency: 200 // 200ms
        });
        
        const { time: slowNetworkLoadTime } = await measureExecutionTime(async () => {
            await pm.loginPage.navigate();
            await pm.page.locator(LOGIN_FORM.USERNAME).waitFor({ state: 'visible' });
        });
        
        assertPerformanceThreshold(slowNetworkLoadTime, 10000, 'Slow 3G network page load');
    });
});