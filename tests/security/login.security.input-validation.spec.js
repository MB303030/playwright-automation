/**
 * Input Validation Security Tests for Login Functionality
 * Tests system stability with various inputs
 * Uses existing POM pattern and security test data
 * 
 * Tags: @Security @InputValidation @Low
 */

import { test, expect } from '@playwright/test';
import PomManager from '../../pages/PomManager.js';
import { SECURITY_TEST_DATA } from '../../constants/security_test_data.js';

let pm;

test.describe('Input Validation Security Tests @Security @InputValidation @Low', () => {
    
    test.beforeEach(async({ page }) => {
        pm = new PomManager(page);
        await pm.loginPage.navigate();
    });

    SECURITY_TEST_DATA.SPECIAL_CHARACTERS.forEach((testCase, index) => {
        test(`Should handle ${testCase.description} without crashing`, async ({ page }) => {
            console.log(`Testing input: ${testCase.description}`);
            
            await pm.loginPage.login(testCase.username, testCase.password);
            
            // System should remain stable
            await expect(page.locator('body')).toBeVisible();
            
            // Should show response (error for invalid credentials)
            const message = await pm.securePage.getMessage();
            expect(message).toBeTruthy();
            
            // Should NOT show server errors
            const pageContent = await page.content();
            expect(pageContent).not.toMatch(/5\d{2}\s+Internal Server Error/);
            expect(pageContent).not.toContain('Application Error');
            
            // Navigate back for next test
            if (index < SECURITY_TEST_DATA.SPECIAL_CHARACTERS.length - 1) {
                await pm.loginPage.navigate();
            }
        });
    });

    test('Should handle empty inputs', async () => {
        await pm.loginPage.login('', '');
        
        await expect(pm.page.locator('body')).toBeVisible();
        const message = await pm.securePage.getMessage();
        expect(message).toBeTruthy();
    });
});