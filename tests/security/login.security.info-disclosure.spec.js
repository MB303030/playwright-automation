/**
 * Information Disclosure Security Tests for Login Functionality
 * Tests that system doesn't reveal sensitive information
 * Uses existing POM pattern and security test data
 * 
 * Tags: @Security @InfoDisclosure @Medium
 */

import { test, expect } from '@playwright/test';
import PomManager from '../../pages/PomManager.js';
import { SECURITY_TEST_DATA } from '../../constants/security_test_data.js';

let pm;

test.describe('Information Disclosure Security Tests @Security @InfoDisclosure @Medium', () => {
    
    test.beforeEach(async({ page }) => {
        pm = new PomManager(page);
        await pm.loginPage.navigate();
    });

    test('Should show appropriate error for invalid username', async () => {
        // Use test data from INFORMATION_DISCLOSURE array
        const testCase = SECURITY_TEST_DATA.INFORMATION_DISCLOSURE[0];
        
        await pm.loginPage.login(testCase.username, testCase.password);
        
        const errorMessage = await pm.securePage.getMessage();
        
        // Should contain the expected field (from test data)
        await expect(errorMessage.toLowerCase()).toContain(testCase.expectedField);
        
        // Should match generic error pattern (from ERROR_EXPECTATIONS)
        await expect(errorMessage).toMatch(SECURITY_TEST_DATA.ERROR_EXPECTATIONS.GENERIC_ERROR);
        
        // Log this as a security finding
        console.log(`SECURITY NOTE: System discloses "${errorMessage.trim()}" - Consider fixing to generic error`);
    });

    test('Should show appropriate error for invalid password', async () => {
        // Use test data from INFORMATION_DISCLOSURE array
        const testCase = SECURITY_TEST_DATA.INFORMATION_DISCLOSURE[1];
        
        await pm.loginPage.login(testCase.username, testCase.password);
        
        const errorMessage = await pm.securePage.getMessage();
        
        // Should contain the expected field (from test data)
        await expect(errorMessage.toLowerCase()).toContain(testCase.expectedField);
        
        // Should match generic error pattern (from ERROR_EXPECTATIONS)
        await expect(errorMessage).toMatch(SECURITY_TEST_DATA.ERROR_EXPECTATIONS.GENERIC_ERROR);
        
        console.log(`SECURITY NOTE: System discloses "${errorMessage.trim()}" - Consider fixing to generic error`);
    });

    test('Should not reveal SQL/database errors in response', async () => {
        // Use first SQL injection payload from SQL_INJECTION array
        const testCase = SECURITY_TEST_DATA.SQL_INJECTION[0];
        
        await pm.loginPage.login(testCase.payload, testCase.payload);
        
        const errorMessage = await pm.securePage.getMessage();
        
        // Should NOT contain database/SQL related terms (from ERROR_EXPECTATIONS)
        SECURITY_TEST_DATA.ERROR_EXPECTATIONS.SHOULD_NOT_DISCLOSE.forEach(forbiddenWord => {
            expect(errorMessage.toLowerCase()).not.toContain(forbiddenWord.toLowerCase());
        });
    });
});