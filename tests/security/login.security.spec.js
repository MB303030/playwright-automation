/**
 * ==============================================================
 * SECURITY TESTS FOR LOGIN FUNCTIONALITY
 * ==============================================================
 * 
 * Critical security validations to prevent common vulnerabilities.
 * These tests should run on EVERY build.
 * 
 * Run Frequency: On every commit (CI/CD pipeline)
 * Tags: @Security @Critical @Fast
 * 
 * Principles Tested:
 * 1. SQL Injection Prevention
 * 2. XSS Attack Prevention
 * 3. Input Sanitization
 * ==============================================================
 */

import { test, expect } from '@playwright/test';
import PomManager from '../../pages/PomManager.js';
import { TEST_DATA } from '../../constants/test_data.js';

let pm;

test.describe('Login Security Tests @Security @Critical @Fast', () => {
    
    test.beforeEach(async({ page }) => {
        pm = new PomManager(page);
        await pm.loginPage.navigate();
    });

    /**
     * TEST 1: SQL INJECTION PREVENTION
     * Ensures SQL injection attempts are blocked
     */
    test('Should prevent common SQL injection attacks', async () => {
        // Common SQL injection payloads
        const sqlInjectionAttempts = [
            "' OR '1'='1",
            "'; DROP TABLE users; --",
            "' UNION SELECT username, password FROM users --",
            "admin'--",
            "1' OR '1' = '1"
        ];
        
        for (const attempt of sqlInjectionAttempts) {
            // Attempt login with SQL injection payload
            await pm.loginPage.login(attempt, attempt);
            
            // Should NOT successfully login
            await expect(pm.page).not.toHaveURL(/secure/);
            
            // Should show generic error message (not revealing system details)
            const errorMessage = await pm.securePage.getMessage();
            await expect(errorMessage.toLowerCase()).toContain('invalid');
            
            // Navigate back for next attempt
            await pm.loginPage.navigate();
        }
    });

    /**
     * TEST 2: XSS ATTACK PREVENTION
     * Ensures script tags and JavaScript payloads are sanitized
     */
    test('Should prevent XSS attacks in form inputs', async ({ page }) => {
        const xssPayloads = [
            "<script>alert('XSS')</script>",
            "<img src=x onerror=alert('XSS')>",
            "javascript:alert('XSS')",
            "\"><script>alert('XSS')</script>"
        ];
        
        for (const payload of xssPayloads) {
            // Fill form with XSS payload
            await pm.loginPage.login(payload, payload);
            
            // Check page content for script tags (they shouldn't exist)
            const pageContent = await page.content();
            
            // Verify no script tags made it to the page
            expect(pageContent).not.toContain('<script>alert');
            expect(pageContent).not.toContain('onerror=');
            expect(pageContent).not.toContain('javascript:alert');
            
            // Navigate back for next attempt
            await pm.loginPage.navigate();
        }
    });

    /**
     * TEST 3: SENSITIVE DATA EXPOSURE
     * Ensures error messages don't reveal sensitive information
     */
    test('Should not expose sensitive information in error messages', async () => {
        // Test with invalid username
        await pm.loginPage.login('wronguser', TEST_DATA.CREDENTIALS.VALID.PASSWORD);
        let errorMessage = await pm.securePage.getMessage();
        
        // Error should NOT specify which field was wrong
        expect(errorMessage).not.toContain('username');
        expect(errorMessage).not.toContain('password');
        expect(errorMessage.toLowerCase()).toContain('invalid');
        
        // Navigate back
        await pm.loginPage.navigate();
        
        // Test with invalid password
        await pm.loginPage.login(TEST_DATA.CREDENTIALS.VALID.USERNAME, 'wrongpass');
        errorMessage = await pm.securePage.getMessage();
        
        // Error should still be generic
        expect(errorMessage).not.toContain('username');
        expect(errorMessage).not.toContain('password');
        expect(errorMessage.toLowerCase()).toContain('invalid');
    });

    /**
     * TEST 4: SESSION SECURITY AFTER LOGOUT
     * Ensures session is properly terminated
     */
    test('Session should be invalidated after logout', async () => {
        // Login successfully
        await pm.loginPage.login(
            TEST_DATA.CREDENTIALS.VALID.USERNAME,
            TEST_DATA.CREDENTIALS.VALID.PASSWORD
        );
        
        // Verify we're in secure area
        await expect(pm.page).toHaveURL(/secure/);
        
        // Logout using existing SecurePage method
        await pm.securePage.action.click(pm.securePage.logoutButtonSelector);
        
        // Verify we're redirected to login
        await expect(pm.page).toHaveURL(/login/);
        
        // Try to access secure area directly via URL
        await pm.page.goto('/secure');
        
        // Should NOT allow access - should redirect to login or show error
        await expect(pm.page).not.toHaveURL(/secure/);
        
        // Either stays on login page or shows error
        const currentUrl = pm.page.url();
        expect(currentUrl).toMatch(/login|error/);
    });

    /**
     * TEST 5: SPECIAL CHARACTERS HANDLING
     * Ensures system handles special characters safely
     */
    test('Should safely handle special characters in inputs', async ({ page }) => {
        const specialCharsCredentials = [
            { username: 'test@email.com', password: 'P@$$w0rd!' },
            { username: 'user_name', password: 'pass word with spaces' },
            { username: 'user123', password: 'unicode✓password' }
        ];
        
        for (const creds of specialCharsCredentials) {
            await pm.loginPage.login(creds.username, creds.password);
            
            // System should handle gracefully - no crashes
            await expect(page.locator('body')).toBeVisible();
            
            // Should show appropriate response (error for invalid credentials)
            const message = await pm.securePage.getMessage();
            expect(message).toBeTruthy(); // Some message should appear
            
            // Navigate back for next attempt
            await pm.loginPage.navigate();
        }
    });
});