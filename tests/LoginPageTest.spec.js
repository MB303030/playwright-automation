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

test.describe('Login Page Structure @Sanity', () => {
    test.beforeEach(async({ page }) => {
        pm = new PomManager(page);
        await pm.loginPage.navigate();
    });
   
    test('Login page base validation if the page is redirected correctly', async() => {
         
        await pm.loginPage.verifyPageUrl(/login/);  
    });

     test('Login page base validation the title of the page', async() => {
        
        // base validations
        await pm.loginPage.verifyPageTitle('The Internet');   
    });

    test('Login text base validation if "Login Page"', async() => {
        
        // base validations
        await pm.loginPage.verifyElementText('h2','Login Page')
    });

    test('Login button text', async() => {
        
        const button = pm.page.locator('button[type="submit"]');
        
        await test.step('Button should be visible', async () => {
            await expect(button).toBeVisible();
        });
        
        await test.step('Button should be enabled', async () => {
            await expect(button).toBeEnabled();
        });
        
        await test.step('Button should have type="submit"', async () => {
            await expect(button).toHaveAttribute('type', 'submit');
        });
        
        await test.step('Button text should be "Login"', async () => {
            const buttonText = await button.textContent();
            expect(buttonText.trim()).toBe('Login');
    });
    });
});

test.describe('Login page UI check @Sanity', () => {
    test.beforeEach(async({ page }) => {
        pm = new PomManager(page);
        await pm.loginPage.navigate();
       // await pm.page.pause()
    });

    test('Check that Username label exist and the text is Username',async()=>{
        
        //Assert Username label 
        const textLabelWithHover = await pm.loginPage.getUsernameLabelTextWithHover();
        expect(textLabelWithHover).toBe(userNameLabel); 
    })

    test('Check that Password label exist and the text is Password',async()=>{
        
        //Assert password label 
        const textLabelWithHover = await pm.loginPage.getPasswordLabelTextWithHover();
        expect(textLabelWithHover).toBe(passwordNameLabel);  
    })

    test('Complete login page validation', async() => {
        await test.step('Verify page URL', async () => {
        await pm.loginPage.verifyPageUrl(/login/);
    });
    
        await test.step('Verify page title', async () => {
        await pm.loginPage.verifyPageTitle('The Internet');
    });
    
        await test.step('Verify header text', async () => {
        await pm.loginPage.verifyElementText('h2', 'Login Page');
    });
});
});
