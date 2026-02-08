/**
 * Concurrent Attack Security Tests for Login Functionality
 * Simplified data-driven concurrent tests using existing helpers
 * 
 * Tags: @Security @Concurrent @Load
 */

import { test, expect } from '@playwright/test';
import PomManager from '../../pages/PomManager.js';
import { SECURITY_TEST_DATA } from '../../constants/security_test_data.js';

/**
 * Helper function to run concurrent tests
 */
async function runConcurrentTests(browser, testCases, testFn) {
    const testPromises = testCases.map((testCase, index) => async () => {
        const context = await browser.newContext();
        const page = await context.newPage();
        const pm = new PomManager(page);
        
        await testFn(pm, testCase, index);
        
        await context.close();
    });
    
    await Promise.all(testPromises.map(p => p()));
}

test.describe('Concurrent Attack Security Tests @Security @Concurrent @Load', () => {
    
    test('Should handle multiple concurrent SQL injection attempts', async ({ browser }) => {
        const testCases = SECURITY_TEST_DATA.SQL_INJECTION.slice(0, 3);
        
        await runConcurrentTests(browser, testCases, async (pm, testCase, index) => {
            await pm.loginPage.navigate();
            console.log(`Concurrent SQLi #${index + 1}: ${testCase.description}`);
            
            await pm.loginPage.login(testCase.payload, testCase.payload);
            
            await expect(pm.page).not.toHaveURL(/secure/);
            
            const errorMessage = await pm.securePage.getMessage();
            await expect(errorMessage).toMatch(SECURITY_TEST_DATA.ERROR_EXPECTATIONS.GENERIC_ERROR);
        });
    });

    test('Should handle mixed attack types concurrently', async ({ browser }) => {
        const testCases = [
            // Get first item from each test category
            SECURITY_TEST_DATA.SQL_INJECTION[0],
            SECURITY_TEST_DATA.XSS_PAYLOADS[0],
            SECURITY_TEST_DATA.SPECIAL_CHARACTERS[0]
        ];
        
        await runConcurrentTests(browser, testCases, async (pm, testCase, index) => {
            await pm.loginPage.navigate();
            console.log(`Concurrent attack #${index + 1}: ${testCase.description}`);
            
            const username = testCase.payload || testCase.username;
            const password = testCase.payload || testCase.password;
            
            await pm.loginPage.login(username, password);
            
            await expect(pm.page).not.toHaveURL(/secure/);
            
            const errorMessage = await pm.securePage.getMessage();
            await expect(errorMessage).toMatch(SECURITY_TEST_DATA.ERROR_EXPECTATIONS.GENERIC_ERROR);
        });
    });

    test('Should handle concurrent valid and invalid login attempts', async ({ browser }) => {
        const testCases = [
            {
                ...SECURITY_TEST_DATA.VALID_CREDENTIALS,
                shouldSucceed: true,
                description: "Valid credentials"
            },
            {
                username: SECURITY_TEST_DATA.SQL_INJECTION[0].payload,
                password: SECURITY_TEST_DATA.SQL_INJECTION[0].payload,
                shouldSucceed: false,
                description: SECURITY_TEST_DATA.SQL_INJECTION[0].description
            },
            {
                username: SECURITY_TEST_DATA.XSS_PAYLOADS[0].payload,
                password: SECURITY_TEST_DATA.XSS_PAYLOADS[0].payload,
                shouldSucceed: false,
                description: SECURITY_TEST_DATA.XSS_PAYLOADS[0].description
            }
        ];
        
        await runConcurrentTests(browser, testCases, async (pm, testCase, index) => {
            await pm.loginPage.navigate();
            console.log(`Concurrent login #${index + 1}: ${testCase.description}`);
            
            await pm.loginPage.login(testCase.username, testCase.password);
            
            if (testCase.shouldSucceed) {
                await expect(pm.page).toHaveURL(/secure/);
                const message = await pm.securePage.getMessage();
                await expect(message).toMatch(SECURITY_TEST_DATA.ERROR_EXPECTATIONS.SUCCESS_MESSAGE);
            } else {
                await expect(pm.page).not.toHaveURL(/secure/);
                const message = await pm.securePage.getMessage();
                await expect(message).toMatch(SECURITY_TEST_DATA.ERROR_EXPECTATIONS.GENERIC_ERROR);
            }
        });
    });
});