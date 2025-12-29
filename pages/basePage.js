import { expect } from '@playwright/test';

export default class BasePage {
    constructor(page) {
        this.page = page;
    }

    // Page validation methods
    async verifyPageTitle(expectedTitle) {
        await expect(this.page).toHaveTitle(expectedTitle);
    }

    async verifyPageUrl(expectedUrl) {
        await expect(this.page).toHaveURL(expectedUrl);
    }

    async verifyElementText(selector, expectedText) {
        await expect(this.page.locator(selector)).toHaveText(expectedText);
    }

    async verifyElementVisible(selector) {
        await expect(this.page.locator(selector)).toBeVisible();
    }

    async verifyElementTextAndVisible(selector, expectedText) {
        const element = this.page.locator(selector);
        await expect(element).toBeVisible();
        await expect(element).toHaveText(expectedText);
    }
}