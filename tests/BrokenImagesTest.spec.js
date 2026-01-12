// tests/broken-images.spec.js
import { test, expect } from '@playwright/test';
import PomManager from '../pages/PomManager.js';
import { URLS } from '../constants/urls.js';

let pm;

test.describe('Broken Images Page @Regression', () => {
    
    test.beforeEach(async({ page }) => {
        pm = new PomManager(page);
        await pm.loginPage.actions.navigate(URLS.BROKEN_IMAGE);
    });

    test('Page has 3 images', async() => {
        // Find all images inside the .example div
        const images = pm.page.locator('.example img'); // Use pm.page
        
        // Count how many images
        const imageCount = await images.count();
        
        // Should be exactly 3
        expect(imageCount).toBe(3);
    });

    test('Images have correct styling', async() => {
        // Check that images exist in the example section
        const exampleImages = pm.page.locator('.example img'); // Use pm.page
        expect(await exampleImages.count()).toBe(3);
        
        // Check CSS styling is applied (from the <style> tag)
        const firstImage = exampleImages.first();
        const computedStyle = await firstImage.evaluate((img) => {
            return {
                width: window.getComputedStyle(img).width,
                height: window.getComputedStyle(img).height
            };
        });
        
        expect(computedStyle.width).toBe('120px');
        expect(computedStyle.height).toBe('90px');
    });
});