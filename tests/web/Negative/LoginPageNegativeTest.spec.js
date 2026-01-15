// tests/login-negative.spec.js
import { test, expect } from '@playwright/test';
import PomManager from '../../../pages/PomManager.js';
import { negativeLoginTestCases } from './NegativeLoginTestData.js';

let pm;

test.describe('Negative Login Tests - Data Driven @negative tests', () => {
    
    test.beforeEach(async({ page }) => {
        pm = new PomManager(page);
        await pm.loginPage.navigate();
    });

    // Create a separate test for EACH negative case
    negativeLoginTestCases.forEach(testCase => {
        test(`Should fail login with ${testCase.name}`, async() => {
            
            await pm.loginPage.login(testCase.username, testCase.password);
            
            const errorMessage = await pm.securePage.getMessage();
    
            // Note: Your data uses "expectedError" not "expectedMessage"
            expect(errorMessage).toContain(testCase.expectedError);
            
            // Should still be on login page
            await expect(pm.page).toHaveURL(/login/);
        });
    });
});