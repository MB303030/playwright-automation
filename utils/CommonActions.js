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

    /**
     * Get any attribute value from an element
     * @param {string} selector - Element selector
     * @param {string} attribute - Attribute name (href, class, id, etc.)
     * @returns {Promise<string>} Attribute value
     */
    async getElementAttribute(selector, attribute) {
        return await this.page.getAttribute(selector, attribute);
    }

    /**
     * Verify element has a specific CSS class
     * @param {string} selector - Element selector
     * @param {string} className - Class name to verify (partial match)
     */
    async verifyElementHasClass(selector, className) {
        const element = this.page.locator(selector);
        await expect(element).toHaveClass(new RegExp(className));
    }

    /**
     * Wait for element to be visible
     * @param {string} selector - Element selector
     * @param {Object} options - Optional wait options
     */
    async waitForElement(selector, options = {}) {
        const element = this.page.locator(selector);
        await element.waitFor({ 
            state: 'visible',
            timeout: options.timeout || 10000, // 10 second default
            ...options 
        });
    }
    
    /**
     * Check if element is visible
     * @param {string} selector - Element selector
     * @returns {Promise<boolean>} Visibility state
     */
    async isVisible(selector) {
        const element = this.page.locator(selector);
        return await element.isVisible();
    }
    
    /**
     * Check if element is enabled (not disabled)
     * @param {string} selector - Element selector
     * @returns {Promise<boolean>} Enabled state
     */
    async isEnabled(selector) {
        const element = this.page.locator(selector);
        return await element.isEnabled();
    }
    
}