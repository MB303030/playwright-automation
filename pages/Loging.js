import {expect} from '@playwright/test'
import CommonActions from '../utils/CommonActions.js'
import BasePage from './basePage.js';

import { url } from 'node:inspector'


export default class LoginPage extends BasePage {  // ← ADD THIS
    constructor(page){
        super(page);  
        this.actions = new CommonActions(page)
        this.usernameSelector = '#username'
    }

    async navigate(){
        await this.actions.navigate('https://the-internet.herokuapp.com/login')
    }

    async login(username, password){
        await this.actions.fill(this.usernameSelector,username)
        await this.actions.fill('#password',password)
        await this.actions.click('button[type=submit]')
    }

     async getUsernameLabelTextWithHover() {
        const element = this.page.getByText('Username', { exact: true });
        await element.hover();  // Hovers first
        return await element.textContent();  // Then gets text
    }

     async getPasswordLabelTextWithHover() {
        const element = this.page.getByText('Password', { exact: true });
        await element.hover();  // Hovers first
        return await element.textContent();  // Then gets text
    }

    // BasePage methods
    async validatePage() {
    await this.verifyPageTitle('The Internet');        
    await this.verifyPageUrl(/login/);                
    await this.verifyElementText('h2', 'Login Page');             
    }

    async verifyLoginButton() {
    // Use the BasePage method
    await this.verifyElementTextAndVisible('button[type="submit"]', 'Login');
    
    // Optional: Additional login button specific checks
    const button = this.page.locator('button[type="submit"]');
    await expect(button).toBeEnabled();
    await expect(button).toHaveAttribute('type', 'submit');
}
    
}