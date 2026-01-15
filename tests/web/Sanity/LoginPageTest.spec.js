import { test, expect } from '@playwright/test';
import PomManager from '../../../pages/PomManager.js';
import { TEST_DATA } from '../../../constants/test_data.js';

// Initialize Page Manager instance - will be set in beforeEach hooks
let pm;

// Extract test data from constants for better readability
const USERNAME_LABEL = TEST_DATA.LABELS.USERNAME;
const PASSWORD_LABEL = TEST_DATA.LABELS.PASSWORD;
const PAGE_TITLE = TEST_DATA.PAGE.TITLE;
const PAGE_HEADER = TEST_DATA.PAGE.HEADER;

/**
 * Test Suite: Login Page Structure Tests
 * Tag: @Sanity - For filtering during test execution
 * Purpose: Validate the basic structure and navigation of the login page
 */
test.describe('Login Page Structure @Sanity', () => {
    
    /**
     * Setup hook - runs before each test in this suite
     * Initializes Page Manager and navigates to login page
     */
    test.beforeEach(async({ page }) => {
        pm = new PomManager(page);
        await pm.loginPage.navigate();
    });
   
    /**
     * Test: Verify login page URL
     * Validates that navigation correctly lands on the login page
     */
    test('Login page URL should contain /login', async() => {
        await pm.loginPage.verifyPageUrl(/login/);  
    });

    /**
     * Test: Verify page title
     * Validates the browser tab title is correct
     */
    test('Page title should be "The Internet"', async() => {
        await pm.loginPage.verifyPageTitle(PAGE_TITLE);   // Using constant from test data
    });

    /**
     * Test: Verify page header text
     * Validates the main heading on the login page
     */
    test('Page header should be "Login Page"', async() => {
        await pm.loginPage.verifyElementText('h2', PAGE_HEADER); // Using constant from test data
    });

    /**
     * Test: Verify login button properties
     * Comprehensive validation of the submit button's state and attributes
     */
    test('Login button should have correct properties', async() => {
        const button = pm.page.locator('button[type="submit"]');
        
        // Step 1: Verify button visibility
        await test.step('Button should be visible', async () => {
            await expect(button).toBeVisible();
        });
        
        // Step 2: Verify button is enabled (not disabled)
        await test.step('Button should be enabled', async () => {
            await expect(button).toBeEnabled();
        });
        
        // Step 3: Verify button has correct type attribute
        await test.step('Button should have type="submit"', async () => {
            await expect(button).toHaveAttribute('type', 'submit');
        });
        
        // Step 4: Verify button text is correct
        await test.step('Button text should be "Login"', async () => {
            const buttonText = await button.textContent();
            expect(buttonText.trim()).toBe('Login');
        });
    });
});

/**
 * Test Suite: Login Page UI Elements
 * Tag: @Sanity - For filtering during test execution
 * Purpose: Validate specific UI elements and form labels on the login page
 */
test.describe('Login page UI check @Sanity', () => {
    
    /**
     * Setup hook - runs before each test in this suite
     */
    test.beforeEach(async({ page }) => {
        pm = new PomManager(page);
        await pm.loginPage.navigate();
    });

    /**
     * Test: Validate Username label
     * Verifies the Username label exists and displays correct text
     * Includes hover interaction to test label behavior
     */
    test('Username label should exist with correct text', async() => {
        const labelText = await pm.loginPage.getUsernameLabelTextWithHover();
        expect(labelText).toBe(USERNAME_LABEL); 
    });

    /**
     * Test: Validate Password label
     * Verifies the Password label exists and displays correct text
     * Includes hover interaction to test label behavior
     */
    test('Password label should exist with correct text', async() => {
        const labelText = await pm.loginPage.getPasswordLabelTextWithHover();
        expect(labelText).toBe(PASSWORD_LABEL);  
    });

    /**
     * Test: Comprehensive login page validation
     * Uses test steps to organize multiple validations in a single test
     * Useful for smoke/sanity testing of the entire login page
     */
    test('Complete login page validation', async() => {
        await test.step('Verify page URL', async () => {
            await pm.loginPage.verifyPageUrl(/login/);
        });
    
        await test.step('Verify page title', async () => {
            await pm.loginPage.verifyPageTitle(PAGE_TITLE);
        });
    
        await test.step('Verify header text', async () => {
            await pm.loginPage.verifyElementText('h2', PAGE_HEADER);
        });
    });
});