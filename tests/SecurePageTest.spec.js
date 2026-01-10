import { test, expect } from '@playwright/test' // Add 'test' import
import PomManager from '../pages/PomManager.js';

let pm;
let username = 'tomsmith'
let password = 'SuperSecretPassword!'
let secureMessageConstant = 'You logged into a secure area!'
let expectedMessageInvalidUserName = 'Your username is invalid!'
let expectedMessageinvalidePassword = 'Your password is invalid!'
let userNameLabel = 'Username'
let passwordNameLabel = 'Password'

test.describe('Secure Area page', () => {
    test.beforeEach(async({ page }) => {
        pm = new PomManager(page);
        await pm.loginPage.navigate();
       // await pm.page.pause()
    });

    test('Login with valid credential', async()=>{
        await pm.loginPage.login(username,password);
        await pm.securePage.assertLoggedInMessage('You logged into a secure area!');

        //Assert value directly in test
        const message = await pm.securePage.getMessage();
        expect (message).toContain(secureMessageConstant);
    })

});
