import { test, expect } from '@playwright/test' // Add 'test' import
import PomManager from '../pages/PomManager.js';

let pm;
let username = 'tomsmith'
let password = 'SuperSecretPassword!'
let secureMessageConstant = 'You logged into a secure area!'
let secureMessageTitle = ' Secure Area'
let WelcomeMessage = 'Welcome to the Secure Area. When you are done click logout below.'

test.describe('Secure Area page', () => {
    test.beforeEach(async({ page }) => {
        pm = new PomManager(page);
        await pm.loginPage.navigate();
        await pm.loginPage.login(username,password);
       // await pm.page.pause()
    });

    test('Login with valid credential', async()=>{

        await pm.securePage.assertLoggedInMessage('You logged into a secure area!');

        const message = await pm.securePage.getMessage();
        expect (message).toContain(secureMessageConstant);
    })

    test('Secure Area title', async()=>{

        const message = await pm.securePage.getHeadingText();
        expect (message).toBe(secureMessageTitle);
    })

    test('Welcome message text', async()=>{

        const message = await pm.securePage.getSubHeadingText();
        expect (message).toBe(WelcomeMessage);
    })

   test('Logout button validation', async() => {
           
        // Check visibility
        const isVisible = await pm.securePage.isLogoutButtonVisible();
        expect(isVisible).toBe(true);
    });

});
