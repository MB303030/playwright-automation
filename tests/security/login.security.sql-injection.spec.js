/**
 * SQL Injection Security Tests for Login Functionality
 * Tests protection against SQL injection attacks
 * Uses existing POM pattern and security test data
 * 
 * Tags: @Security @SQLi @Critical
 */

import { test, expect } from '@playwright/test';
import PomManager from '../../pages/PomManager.js';
import { SECURITY_TEST_DATA } from '../../constants/security_test_data.js';

let pm;

test.describe('SQL Injection Security Tests @Security @SQLi @Critical', () => {
    
    test.beforeEach(async({ page }) => {
        pm = new PomManager(page);
        await pm.loginPage.navigate();
    });

    SECURITY_TEST_DATA.SQL_INJECTION.forEach((testCase, index) => {
        test(`Should prevent ${testCase.description}`, async () => {
            console.log(`Testing SQLi: ${testCase.description} | Payload: ${testCase.payload}`);
            
            // Use existing loginPage.login() method
            await pm.loginPage.login(testCase.payload, testCase.payload);
            
            // Should NOT login successfully
            await expect(pm.page).not.toHaveURL(/secure/);
            
            // Use existing securePage.getMessage() method
            const errorMessage = await pm.securePage.getMessage();
            
            // Check error message contains "invalid" (from ERROR_EXPECTATIONS)
            await expect(errorMessage).toMatch(SECURITY_TEST_DATA.ERROR_EXPECTATIONS.GENERIC_ERROR);
            
            // Should NOT reveal SQL/database errors
            SECURITY_TEST_DATA.ERROR_EXPECTATIONS.SHOULD_NOT_DISCLOSE.forEach(forbiddenWord => {
                expect(errorMessage.toLowerCase()).not.toContain(forbiddenWord.toLowerCase());
            });
            
            // Navigate back for next test using loginPage.navigate()
            if (index < SECURITY_TEST_DATA.SQL_INJECTION.length - 1) {
                await pm.loginPage.navigate();
            }
        });
    });
});