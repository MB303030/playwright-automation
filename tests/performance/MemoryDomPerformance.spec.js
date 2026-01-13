/**
 * ==============================================================
 * MEMORY & DOM PERFORMANCE TESTS
 * ==============================================================
 * 
 * Tests memory footprint and DOM complexity.
 * Ensures the page is optimized for low-memory devices.
 * 
 * Run Frequency: Weekly (comprehensive testing)
 * Tags: @Performance @Memory @Detailed
 * ==============================================================
 */

import { test, expect } from '@playwright/test';
import PomManager from '../../pages/PomManager.js';

let pm;

test.describe('Memory & DOM Performance @Performance @Memory @Detailed', () => {
    
    test.beforeEach(async({ page }) => {
        pm = new PomManager(page);
    });

    /**
     * Memory Footprint: DOM SIZE ANALYSIS
     * Large DOM trees cause memory issues and slow rendering.
     * Good practice: Keep DOM elements under 500 total.
     */
    test('Page should have reasonable memory footprint', async() => {
        await pm.loginPage.navigate();
        
        const domSize = await pm.page.evaluate(() => {
            return {
                elements: document.getElementsByTagName('*').length,
                nodes: document.querySelectorAll('*').length,
                depth: (function() {
                    let max = 0;
                    function getDepth(node, depth) {
                        if (node.children.length === 0) {
                            max = Math.max(max, depth);
                        } else {
                            for (let child of node.children) {
                                getDepth(child, depth + 1);
                            }
                        }
                    }
                    getDepth(document.documentElement, 0);
                    return max;
                })(),
                formElements: document.querySelectorAll('input, select, textarea, button').length,
                images: document.querySelectorAll('img').length
            };
        });
        
        console.log(`DOM Elements: ${domSize.elements}, DOM Depth: ${domSize.depth}`);
        console.log(`Form Elements: ${domSize.formElements}, Images: ${domSize.images}`);
        
        expect(domSize.elements, 'Too many DOM elements').toBeLessThan(500);
        expect(domSize.formElements, 'Too many form elements').toBeLessThan(20);
    });
});