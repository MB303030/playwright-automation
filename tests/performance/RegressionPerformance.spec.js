/**
 * ==============================================================
 * PERFORMANCE REGRESSION TESTS
 * ==============================================================
 * 
 * Tracks performance over time to catch regressions.
 * Compares current performance against historical baselines.
 * 
 * Run Frequency: Weekly (trend analysis)
 * Tags: @Performance @Regression @Monitoring
 * ==============================================================
 */

import { test, expect } from '@playwright/test';
import PomManager from '../../pages/PomManager.js';
import { TEST_DATA } from '../../constants/test_data.js';
import { 
    measureExecutionTime, 
    formatTime
} from '../../utils/PerformanceUtils.js';

const { LOGIN_FORM } = TEST_DATA.SELECTORS;

let pm;

test.describe('Performance Regression Tests @Performance @Regression @Monitoring', () => {
    
    test.beforeEach(async({ page }) => {
        pm = new PomManager(page);
    });

    /**
     * Regression Test: PAGE LOAD TIME BASELINE
     * Tracks page load time against historical average.
     * Fails if performance degrades by more than 50%.
     */
    test('Login page load time baseline', async() => {
        const { time: loadTime } = await measureExecutionTime(async () => {
            await pm.loginPage.navigate();
            await pm.page.locator(LOGIN_FORM.USERNAME).waitFor({ state: 'visible' });
        });
        
        const historicalBaseline = 2000; // 2 seconds baseline
        const maxAllowed = historicalBaseline * 1.5; // 50% tolerance
        
        console.log(`Current load time: ${formatTime(loadTime)}`);
        console.log(`Historical baseline: ${formatTime(historicalBaseline)}`);
        console.log(`Max allowed (50% over): ${formatTime(maxAllowed)}`);
        
        expect(loadTime, `Performance regression detected! Load time increased by ${((loadTime - historicalBaseline) / historicalBaseline * 100).toFixed(1)}%`).toBeLessThan(maxAllowed);
    });
    
    /**
     * Regression Test: NETWORK REQUEST COUNT
     * Tracks number of HTTP requests against historical average.
     * Fails if request count increases by more than 30%.
     */
    test('Network request count baseline', async() => {
        const requests = [];
        pm.page.on('request', request => {
            requests.push(request.url());
        });
        
        await pm.loginPage.navigate();
        await pm.page.waitForLoadState('networkidle');
        
        const historicalRequestCount = 25; // Historical average
        const maxAllowedRequests = historicalRequestCount * 1.3; // 30% tolerance
        
        console.log(`Current request count: ${requests.length}`);
        console.log(`Historical average: ${historicalRequestCount}`);
        console.log(`Max allowed (30% over): ${maxAllowedRequests}`);
        
        expect(requests.length, `Network request count increased by ${((requests.length - historicalRequestCount) / historicalRequestCount * 100).toFixed(1)}%`).toBeLessThan(maxAllowedRequests);
    });
});