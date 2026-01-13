/**
 * ==============================================================
 * CRITICAL LOGIN PERFORMANCE TESTS
 * ==============================================================
 * 
 * These are the MOST IMPORTANT performance tests for the login flow.
 * They test the core user journey that impacts EVERY user.
 * 
 * Run Frequency: On every commit (CI/CD pipeline)
 * Tags: @Performance @Critical @Fast
 * 
 * Principles Tested:
 * 1. SPEED: Pages should load quickly (under 3 seconds)
 * 2. RESPONSIVENESS: Forms should be interactive quickly (under 2 seconds)
 * 3. FLUIDITY: Complete actions should feel seamless (under 4 seconds)
 * ==============================================================
 */

import { test, expect } from '@playwright/test';
import PomManager from '../../pages/PomManager.js';
import { URLS } from '../../constants/urls.js';
import { TEST_DATA } from '../../constants/test_data.js';
import CommonActions from '../../utils/CommonActions.js';
import { 
    measureExecutionTime, 
    assertPerformanceThreshold 
} from '../../utils/PerformanceUtils.js';

const TEST_USERNAME = TEST_DATA.CREDENTIALS.VALID.USERNAME;
const TEST_PASSWORD = TEST_DATA.CREDENTIALS.VALID.PASSWORD;
const { LOGIN_FORM } = TEST_DATA.SELECTORS;

let pm;
let commonActions;

test.describe('Critical Login Performance @Performance @Critical @Fast', () => {
    
    test.beforeEach(async({ page }) => {
        pm = new PomManager(page);
        commonActions = new CommonActions(page);
    });

    /**
     * Core Metric 1: PAGE LOAD SPEED
     * Users expect the login page to appear almost instantly.
     * Threshold: 3 seconds (Google's "good" rating for page load)
     */
    test('Login page should load under 3 seconds', async() => {
        const { time: loadTime } = await measureExecutionTime(() => 
            pm.loginPage.navigate()
        );
        
        assertPerformanceThreshold(loadTime, 3000, 'Login page load');
        await expect(pm.page).toHaveURL(URLS.LOGIN);
    });

    /**
     * Core Metric 2: FORM READINESS
     * Users should be able to start typing credentials immediately.
     * Threshold: 2 seconds (User attention span limit)
     */
    test('Login form should be interactive within 2 seconds', async() => {
        await pm.loginPage.navigate();
        
        const { time: readyTime } = await measureExecutionTime(async () => {
            await commonActions.waitForElement(LOGIN_FORM.USERNAME);
            await commonActions.waitForElement(LOGIN_FORM.PASSWORD);
            await commonActions.waitForElement(LOGIN_FORM.SUBMIT_BUTTON);

            const isUsernameEnabled = await commonActions.isEnabled(LOGIN_FORM.USERNAME);
            const isPasswordEnabled = await commonActions.isEnabled(LOGIN_FORM.PASSWORD);
            const isSubmitEnabled = await commonActions.isEnabled(LOGIN_FORM.SUBMIT_BUTTON);
            
            expect(isUsernameEnabled).toBeTruthy();
            expect(isPasswordEnabled).toBeTruthy();
            expect(isSubmitEnabled).toBeTruthy();
        });

        assertPerformanceThreshold(readyTime, 2000, 'Form interaction readiness');
    });

    /**
     * Core Metric 3: COMPLETE LOGIN FLOW
     * The entire login process should feel smooth and complete quickly.
     * Threshold: 4 seconds (User expectation for action completion)
     */
    test('Complete login flow should complete under 4 seconds', async() => {
        const { time: totalTime } = await measureExecutionTime(async () => {
            await pm.loginPage.navigate();
            await pm.loginPage.login(TEST_USERNAME, TEST_PASSWORD);
            await expect(pm.page).toHaveURL(/secure/);
        });
        
        assertPerformanceThreshold(totalTime, 4000, 'Complete login flow');
    });
});