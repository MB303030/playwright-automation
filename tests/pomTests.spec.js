import { test, expect } from '@playwright/test' // Add 'test' import
import LoginPage from '../pages/Loging.js';

let loginPageInstance;

test.describe ('Login Test',() => {

    test.beforeEach(async({page}) => {
        loginPageInstance = new LoginPage(page)

    })

    test('Login with valid credential', async()=>{
        await loginPageInstance.navigate();
        await loginPageInstance.login('tomsmith','SuperSecretPassword!');
    }) 

});