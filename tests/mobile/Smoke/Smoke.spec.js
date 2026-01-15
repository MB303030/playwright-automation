import { test, expect } from '@playwright/test';
import PomManager from '../../../pages/PomManager.js';
import { TEST_DATA } from '../../../constants/test_data.js';

let pm;
// Extract test data
const VALID_USERNAME = TEST_DATA.CREDENTIALS.VALID.USERNAME;
const VALID_PASSWORD = TEST_DATA.CREDENTIALS.VALID.PASSWORD;
const SELECTORS = TEST_DATA.SELECTORS.LOGIN_FORM;
const MESSAGES = TEST_DATA.MESSAGES.LOGIN_SUCCESS
const FLASH_MESSAGE = TEST_DATA.SELECTORS.SECURE_AREA.FLASH_MESSAGE;

test.describe.only('Mobile Smoke Tests @Smoke @Mobile', () => {
    
    test.beforeEach(async({ page }) => {
        pm = new PomManager(page);
    });

    test('Page loads on mobile', async() => {
        await pm.loginPage.navigate();
        
        // Use CommonActions method for title verification
        await pm.loginPage.actions.verifyPageTitle('The Internet');
        
        // Use page object method for header text (if you add it)
        const headerText = await pm.loginPage.actions.getText('h2');
        expect(headerText).toBe('Login Page');
    });

    test('Login form renders on mobile', async() => {
        await pm.loginPage.navigate();
        
        // Use CommonActions methods for all element checks
        await pm.loginPage.actions.waitForElement(SELECTORS.USERNAME);
        await pm.loginPage.actions.waitForElement(SELECTORS.PASSWORD);
        await pm.loginPage.actions.waitForElement(SELECTORS.SUBMIT_BUTTON);
        
        // Also check they're visible using CommonActions
        const isUsernameVisible = await pm.loginPage.actions.isVisible(SELECTORS.USERNAME);
        const isPasswordVisible = await pm.loginPage.actions.isVisible(SELECTORS.PASSWORD);
        const isButtonVisible = await pm.loginPage.actions.isVisible(SELECTORS.SUBMIT_BUTTON);
        
        expect(isUsernameVisible).toBe(true);
        expect(isPasswordVisible).toBe(true);
        expect(isButtonVisible).toBe(true);
    });

    test('Basic login works on mobile', async() => {
        await pm.loginPage.navigate();
        
        // OPTION 1: Use CommonActions methods directly
        await pm.loginPage.actions.fill(SELECTORS.USERNAME, VALID_USERNAME);
        await pm.loginPage.actions.fill(SELECTORS.PASSWORD, VALID_PASSWORD);
        await pm.loginPage.actions.click(SELECTORS.SUBMIT_BUTTON);
        
        // OPTION 2: Use LoginPage.login() method (if it exists and uses CommonActions)
        // await pm.loginPage.login(VALID_USERNAME, VALID_PASSWORD);
        
        // Check success using CommonActions through SecurePage
        const currentUrl = await pm.page.url();
        expect(currentUrl).toMatch(/secure/);

        const successMessage = await pm.securePage.getMessage();
        expect(successMessage).toContain(MESSAGES);
    });
});