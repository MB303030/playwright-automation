// tests/debug-screenshot.spec.js
import { test, expect } from '@playwright/test';

test('Debug - Force failure to see artifacts', async({ page }) => {
    
    // Go to login page
    await page.goto('https://the-internet.herokuapp.com/login');
    
    // Take a screenshot before failure (optional)
    await page.screenshot({ 
        path: 'debug-before-failure.png',
        fullPage: true 
    });
    
    // Check something that will FAIL
    await expect(page).toHaveTitle('WRONG TITLE - THIS WILL FAIL');
    
    // This line won't run because test fails above
});

// Add a second test to see multiple failures
test('Another failing test to see multiple artifacts', async({ page }) => {
    await page.goto('https://the-internet.herokuapp.com/');
    
    // This will fail
    await expect(page.locator('h1')).toHaveText('This text does not exist');
    
    // Try to click non-existent element
    await page.click('button-that-does-not-exist');
});