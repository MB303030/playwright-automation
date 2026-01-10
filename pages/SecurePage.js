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
        
    }

  
    async getMessage() {
        // Retrieve text from the flash message element
        return await this.action.getText(this.flashMessageSelector);
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

    async assertLoggedInMessage(passmessage) {

        // Get the actual message from the page
        const message = await this.getMessage();
        
        // Assert that the actual message contains the expected text
        expect(message).toContain(passmessage);
    }
}