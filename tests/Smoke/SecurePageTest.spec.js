import { test, expect } from '@playwright/test';
import PomManager from '../../pages/PomManager.js';
import { TEST_DATA } from '../../constants/test_data.js';

let pm; // Page Manager instance

// Extract test data from constants for readability
const VALID_USERNAME = TEST_DATA.CREDENTIALS.VALID.USERNAME;
const VALID_PASSWORD = TEST_DATA.CREDENTIALS.VALID.PASSWORD;
const LOGIN_SUCCESS_MESSAGE = TEST_DATA.MESSAGES.LOGIN_SUCCESS;
const SECURE_AREA_TITLE = TEST_DATA.MESSAGES.SECURE_AREA_TITLE;
const WELCOME_MESSAGE = TEST_DATA.MESSAGES.WELCOME_MESSAGE;
const LOGOUT_BUTTON_TEXT = TEST_DATA.LABELS.LOGOUT_BUTTON;

// Test suite for Secure Area page - tagged with @smoke for quick validation
test.describe('Secure Area page @smoke', () => {
    
    // Setup: Login before each test
    test.beforeEach(async({ page }) => {
        pm = new PomManager(page);
        await pm.loginPage.navigate();
        await pm.loginPage.login(VALID_USERNAME, VALID_PASSWORD);
    });

    // Test: Verify successful login message
    test('Login with valid credentials should show success message', async() => {
        await pm.securePage.assertLoggedInMessage(LOGIN_SUCCESS_MESSAGE);
        const message = await pm.securePage.getMessage();
        expect(message).toContain(LOGIN_SUCCESS_MESSAGE);
    });

    // Test: Verify page heading/title
    test('Secure Area should have correct title', async() => {
        const title = await pm.securePage.getHeadingText();
        expect(title.trim()).toBe(SECURE_AREA_TITLE);
    });

    // Test: Verify welcome message text
    test('Secure Area should display welcome message', async() => {
        const message = await pm.securePage.getSubHeadingText();
        expect(message).toBe(WELCOME_MESSAGE);
    });

    // Test: Verify logout button visibility
    test('Logout button should be visible', async() => {
        const isVisible = await pm.securePage.isLogoutButtonVisible();
        expect(isVisible).toBe(true);
    });

    // Test: Verify logout button text
    test('Logout button should have correct text', async() => {
        const text = await pm.securePage.getLogoutButtonText();
        expect(text).toContain(LOGOUT_BUTTON_TEXT);
    });
    
    // Test: Verify logout button is enabled/clickable
    test('Logout button should be enabled', async() => {
        const isEnabled = await pm.securePage.isLogoutButtonEnabled();
        expect(isEnabled).toBe(true);
    });
});