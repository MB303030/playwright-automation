/**
 * XSS (Cross-Site Scripting) Security Tests for Login Functionality
 * Tests protection against script injection attacks
 * Uses existing POM pattern and security test data
 * 
 * Tags: @Security @XSS @Critical
 */

import { test, expect } from '@playwright/test';
import PomManager from '../../pages/PomManager.js';
import { SECURITY_TEST_DATA } from '../../constants/security_test_data.js';

let pm;

test.describe('XSS Attack Security Tests @Security @XSS @Critical', () => {
    
    test.beforeEach(async({ page }) => {
        pm = new PomManager(page);
        await pm.loginPage.navigate();
    });

    SECURITY_TEST_DATA.XSS_PAYLOADS.forEach((testCase, index) => {
        test(`Should prevent ${testCase.description}`, async ({ page }) => {
            console.log(`Testing XSS: ${testCase.description}`);
            
            // Use existing loginPage.login() method
            await pm.loginPage.login(testCase.payload, testCase.payload);
            
            // Check page content - payload should NOT appear
            const pageContent = await page.content();
            expect(pageContent).not.toContain(testCase.payload);
            
            // Also check for URL-encoded versions
            const urlEncodedPayload = encodeURIComponent(testCase.payload);
            expect(pageContent).not.toContain(urlEncodedPayload);
            
            // Use existing securePage.getMessage() method
            const errorMessage = await pm.securePage.getMessage();
            
            // Check error message contains "invalid" (from ERROR_EXPECTATIONS)
            await expect(errorMessage).toMatch(SECURITY_TEST_DATA.ERROR_EXPECTATIONS.GENERIC_ERROR);
            
            // Navigate back for next test using loginPage.navigate()
            if (index < SECURITY_TEST_DATA.XSS_PAYLOADS.length - 1) {
                await pm.loginPage.navigate();
            }
        });
    });
});