import {expect} from '@playwright/test'
import CommonActions from '../utils/CommonActions.js'
import BasePage from './basePage.js';
import { URLS } from '../constants/urls.js'; 

export default class LoginPage extends BasePage {  
    constructor(page){
        // Call parent constructor to initialize base page properties
        super(page); 
        // Initialize CommonActions instance for reusable interactions 
        this.actions = new CommonActions(page)
        // Define CSS selector for username input field
        this.usernameSelector = '#username'
        // define CSS selector for password input field
        this.passwordSelector = '#password';
        // Define CS selector for submit button
        this.submitButtonSelector = 'button[type=submit]';
    }

    async navigate(){
         // Navigate to the specific login page URL
        await this.actions.navigate(URLS.LOGIN);
    }

    async login(username, password){
        // Fill the username field with provided username
        await this.actions.fill(this.usernameSelector,username)

        // Fill the password field with provided password
        await this.actions.fill(this.passwordSelector,password)

         // Click the submit button to attempt login
        await this.actions.click(this.submitButtonSelector )
    }

     async getUsernameLabelTextWithHover() {
        const element = this.page.getByText('Username', { exact: true });
        await element.hover();  // Hovers first
        return await element.textContent();  // Then gets text
    }

     async getPasswordLabelTextWithHover() {
         // Locate the exact "Username" text element
        const element = this.page.getByText('Password', { exact: true });

        // Hover over the element first
        await element.hover();

        // Then get and return the text content
        return await element.textContent();  // Then gets text
    }

    // BasePage methods
    async validatePage() {
        // Verify the page title matches expected value
        await this.verifyPageTitle('The Internet'); 

        // Verify the URL contains 'login' pattern       
        await this.verifyPageUrl(/login/);
        
        // Verify the main heading text matches 'Login Page'
        await this.verifyElementText('h2', 'Login Page');             
    }

    async verifyLoginButton() {

        // Use BasePage method to verify button text and visibility
        await this.verifyElementTextAndVisible(this.submitButtonSelector, 'Login');
        
        // Optional: Additional login button specific checks
        // Locate the login button
        const button = this.page.locator(this.submitButtonSelector);

        // Verify the button is enabled (not disabled)
        await expect(button).toBeEnabled();

         // Verify the button has the correct type attribute
        await expect(button).toHaveAttribute('type', 'submit');
}
    
}