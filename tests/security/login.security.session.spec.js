/**
 * Session Security Tests for Login Functionality
 * Tests session management and access control
 * Uses existing POM pattern and security test data
 * 
 * Tags: @Security @Session @Medium
 */

import { test, expect } from '@playwright/test';
import PomManager from '../../pages/PomManager.js';
import { SECURITY_TEST_DATA } from '../../constants/security_test_data.js';

let pm;

test.describe('Session Security Tests @Security @Session @Medium', () => {
    
    test.beforeEach(async({ page }) => {
        pm = new PomManager(page);
        await pm.loginPage.navigate();
    });

    test('Session should be invalidated after logout', async ({ page }) => {
        // Use VALID_CREDENTIALS from security test data
        await pm.loginPage.login(
            SECURITY_TEST_DATA.VALID_CREDENTIALS.username,
            SECURITY_TEST_DATA.VALID_CREDENTIALS.password
        );
        
        await expect(pm.page).toHaveURL(/secure/);
        
        // Check success message matches EXPECTATIONS
        const successMessage = await pm.securePage.getMessage();
        await expect(successMessage).toMatch(SECURITY_TEST_DATA.ERROR_EXPECTATIONS.SUCCESS_MESSAGE);
        
        // Use existing securePage action click method
        await pm.securePage.action.click(pm.securePage.logoutButtonSelector);
        await expect(pm.page).toHaveURL(/login/);
        
        // Try to access secure area directly
        await page.goto('https://the-internet.herokuapp.com/secure');
        
        // Should redirect to login
        await expect(page).toHaveURL(/login/);
    });

    test('Should not allow access to secure area without login', async ({ page }) => {
        // Try to access secure area directly without logging in
        await page.goto('https://the-internet.herokuapp.com/secure');
        
        // Should be on login page
        await expect(page).toHaveURL(/login/);
        await expect(page.locator('h2')).toHaveText('Login Page');
    });
});