import { expect } from "@playwright/test";
import CommonActions from "../utils/CommonActions.js";

/**
 * SecurePage Class - Represents the post-login/dashboard page
 * This page is accessed after successful authentication
 */
export default class SecurePage {
    constructor(page) {
        // Store the Playwright page instance for use in all methods
        this.page = page;
        
        // Initialize CommonActions instance for reusable page interactions
        this.action = new CommonActions(page);

        //Define selector for flash message element
        this.flashMessageSelector = '#flash';

        //Define selector for main heading element
        this.mainHeadingSelector = 'h2'; 

        //Define selector for sub heading element
        this.subHeadingSelector = 'h4';

        //Define selector for logout button
        this.logoutButtonSelector = 'a.button.secondary.radius';
    }
  
    async getMessage() {
        // Retrieve text from the flash message element
        return await this.action.getText(this.flashMessageSelector);
    }

   async getHeadingText() {
    // Retrieve text from the main heading element  
    return await this.action.getText(this.mainHeadingSelector);
    }

    async getSubHeadingText() {
        return await this.action.getText(this.subHeadingSelector);
    }

    async getInvalideUserErrorMessage() {

         // Retrieve text from the flash message element
        return await this.action.getText(this.flashMessageSelector);
    }

    async getInvalidePasswordErrorMessage() {

         // Retrieve text from the flash message element
        return await this.action.getText(this.flashMessageSelector);
    }

    async getUsernameLabelText() {

        // Use exact text matching to find the Username label
        return await this.action.getTextByText('Username', { exact: true });
    }

    async isLogoutButtonVisible() {
        
        // Logout button just check if it exists
        return await this.page.isVisible(this.logoutButtonSelector);
    }

    async isLogoutButtonEnabled() {
        // Logout button just check if it is enabled
        return await this.page.isEnabled(this.logoutButtonSelector);
}

    async getLogoutButtonText() {
        
        //get Logout button text 
        return await this.action.getText(this.logoutButtonSelector);
    }

    async assertLoggedInMessage(passmessage) {

        // Get the actual message from the page
        const message = await this.getMessage();
        
        // Assert that the actual message contains the expected text
        await expect(message).toContain(passmessage);
    }
}