export default class CommonActions{
    // Constructor that accepts a page object (Playwright page instance)
    constructor(page){
        this.page = page;
    }

    //Navigate to a specific URL
    async navigate(url){
        await this.page.goto(url)
    }

    async click(selector){
        // Perform a click action on the element matching the selector
        await this.page.click(selector)
    }

    async fill(selector, text){
        // Clear the field and enter the specified text
        await this.page.fill(selector, text)

    }

    async getText(selector){
        // Retrieve and return the text content of the element matching the selector
        return await this.page.textContent(selector)
    }

     async getTextByText(text, options = {}) {
        // Use Playwright's getByText locator to find element by text content
        return await this.page.getByText(text, options).textContent();
    }

     async verifyPageTitle(expectedTitle) {
        // Assert that the page title matches the expected title
        return await expect(this.page).toHaveTitle(expectedTitle);
    }

    async isChecked(selector){
        // Return the checked state of the element
        return await this.page.isChecked(selector)
    }
    
}