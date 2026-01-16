/**
 * ADVANCED MEMORY & RENDER PERFORMANCE TESTS
 * Uses Chrome DevTools Protocol for real memory and rendering metrics.
 * Requirements: Chromium browser
 * Run Frequency: Weekly
 * Tags: @Performance @Memory @Advanced @ChromeOnly
 */

import { test, expect } from '@playwright/test';
import PomManager from '../../../pages/PomManager.js';

let pm;

test.describe('Advanced Memory & Render Performance @Performance @Memory @Advanced @ChromeOnly @Weekly', () => {
    
    test.beforeEach(async({ page }) => {
        pm = new PomManager(page);
    });

    test('Comprehensive memory and render performance analysis', async({ page, context }) => {
        // Enable Performance Observer before navigation
        await page.addInitScript(() => {
            if (window.performanceObserver) return;
            
            window.performanceMetrics = {
                layouts: [],
                paints: [],
                longTasks: []
            };
            
            // Layout shift observer
            window.layoutObserver = new PerformanceObserver((list) => {
                window.performanceMetrics.layouts.push(...list.getEntries());
            });
            window.layoutObserver.observe({ entryTypes: ['layout-shift'] });
            
            // Paint observer
            window.paintObserver = new PerformanceObserver((list) => {
                window.performanceMetrics.paints.push(...list.getEntries());
            });
            window.paintObserver.observe({ entryTypes: ['paint'] });
            
            // Long task observer
            window.longTaskObserver = new PerformanceObserver((list) => {
                window.performanceMetrics.longTasks.push(...list.getEntries());
            });
            window.longTaskObserver.observe({ entryTypes: ['longtask'] });
        });
        
        // Navigate and wait for stability
        await pm.loginPage.navigate();
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(1000);
        
        // ===== DOM METRICS =====
        const domMetrics = await page.evaluate(() => {
            const allElements = document.getElementsByTagName('*');
            
            function calculateDOMDepth(node, currentDepth = 0) {
                if (!node.children || node.children.length === 0) {
                    return currentDepth;
                }
                let maxDepth = currentDepth;
                for (const child of node.children) {
                    const depth = calculateDOMDepth(child, currentDepth + 1);
                    if (depth > maxDepth) maxDepth = depth;
                }
                return maxDepth;
            }
            
            return {
                totalElements: allElements.length,
                domDepth: calculateDOMDepth(document.documentElement),
                formElements: document.querySelectorAll('input, select, textarea, button').length,
                deeplyNestedDivs: document.querySelectorAll('div > div > div > div > div').length,
                elementsWithInlineStyles: document.querySelectorAll('[style]').length,
            };
        });
        
        // ===== CHROME DEVTOOLS PROTOCOL =====
        let memoryMetrics = { available: false };
        
        try {
            const client = await context.newCDPSession(page);
            await client.send('Performance.enable');
            const perfData = await client.send('Performance.getMetrics');
            
            const jsHeapUsed = perfData.metrics.find(m => m.name === 'JSHeapUsedSize');
            const jsHeapTotal = perfData.metrics.find(m => m.name === 'JSHeapTotalSize');
            
            memoryMetrics = {
                available: true,
                jsHeapUsedMB: jsHeapUsed ? (jsHeapUsed.value / 1024 / 1024).toFixed(2) : 'N/A',
                jsHeapTotalMB: jsHeapTotal ? (jsHeapTotal.value / 1024 / 1024).toFixed(2) : 'N/A',
            };
            
        } catch (error) {
            // Silent fallback - test will continue with DOM metrics only
        }
        
        // ===== RENDER PERFORMANCE =====
        const renderMetrics = await page.evaluate(() => {
            // Force layout/reflow
            const forceReflow = () => {
                const start = performance.now();
                document.body.offsetHeight;
                document.body.getBoundingClientRect();
                window.getComputedStyle(document.body);
                return performance.now() - start;
            };
            
            // Get Performance Observer data
            const layoutShiftScore = window.performanceMetrics?.layouts
                ?.reduce((score, entry) => score + entry.value, 0) || 0;
            
            const longTaskCount = window.performanceMetrics?.longTasks?.length || 0;
            
            // Clean up
            if (window.layoutObserver) window.layoutObserver.disconnect();
            if (window.paintObserver) window.paintObserver.disconnect();
            if (window.longTaskObserver) window.longTaskObserver.disconnect();
            
            return {
                reflowTime: forceReflow(),
                layoutShiftScore: layoutShiftScore.toFixed(3),
                longTaskCount: longTaskCount,
            };
        });
        
        // ===== ASSERTIONS =====
        
        // DOM Structure
        expect(domMetrics.totalElements, 'Too many DOM elements').toBeLessThan(500);
        expect(domMetrics.domDepth, 'DOM too deeply nested').toBeLessThan(15);
        expect(domMetrics.formElements, 'Too many form elements').toBeLessThan(20);
        expect(domMetrics.deeplyNestedDivs, 'Too many deeply nested divs').toBeLessThan(10);
        expect(domMetrics.elementsWithInlineStyles, 'Too many inline styles').toBeLessThan(10);
        
        // Memory (if available)
        if (memoryMetrics.available && memoryMetrics.jsHeapUsedMB !== 'N/A') {
            expect(parseFloat(memoryMetrics.jsHeapUsedMB), 'JavaScript heap usage too high').toBeLessThan(100);
        }
        
        // Render Performance
        expect(renderMetrics.reflowTime, 'Reflow time too high').toBeLessThan(50);
        expect(parseFloat(renderMetrics.layoutShiftScore), 'Layout Shift too high').toBeLessThan(0.1);
        expect(renderMetrics.longTaskCount, 'Long tasks blocking main thread').toBeLessThan(1);
    });
});