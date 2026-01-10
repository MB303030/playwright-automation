import { test, expect } from '@playwright/test' // Add 'test' import
import PomManager from '../pages/PomManager.js';

let pm;
let username = 'tomsmith'
let password = 'SuperSecretPassword!'
let secureMessageConstant = 'You logged into a secure area!'
let secureMessageTitle = ' Secure Area'
let WelcomeMessage = 'Welcome to the Secure Area. When you are done click logout below.'
let logoutButtonText = 'Logout'

test.describe('Secure Area page', () => {
    test.beforeEach(async({ page }) => {
        pm = new PomManager(page);
        await pm.loginPage.navigate();
        await pm.loginPage.login(username,password);
       // await pm.page.pause()
    });

    test('Login with valid credential @smoke', async()=>{

        await pm.securePage.assertLoggedInMessage('You logged into a secure area!');
        // get secure area message text 
        const message = await pm.securePage.getMessage();
        expect (message).toContain(secureMessageConstant);
    })

    test('Secure Area title', async()=>{
        //get secure area title text
        const message = await pm.securePage.getHeadingText();
        expect (message).toBe(secureMessageTitle);
    })

    test('Welcome message text', async()=>{
        // get welcome message text 
        const message = await pm.securePage.getSubHeadingText();
        expect (message).toBe(WelcomeMessage);
    })

   test('Logout button is it visible', async() => {
           
        // Check visibility of the logout button
        const isVisible = await pm.securePage.isLogoutButtonVisible();
        expect(isVisible).toBe(true);
    });

   test('Logout button has correct text', async() => {
        // get tect of loggout button 
        const text = await pm.securePage.getLogoutButtonText();
        expect(text).toContain(logoutButtonText);
    });
    
   test('Logout button should be enabled', async() => {
    // Check if the logout button is enabled
    const isEnabled = await pm.securePage.isLogoutButtonEnabled();
    expect(isEnabled).toBe(true);
});

});
