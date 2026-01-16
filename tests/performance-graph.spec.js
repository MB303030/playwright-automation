// tests/performance-graph.spec.js
const { test, expect } = require('@playwright/test');
const fs = require('fs');
const { execSync } = require('child_process');

test('Performance with automatic graph', async ({ page }) => {
  // Test your site
  await page.goto('https://example.com');
  
  // Get performance data
  const metrics = await page.evaluate(() => {
    const timing = performance.timing;
    const paints = performance.getEntriesByType('paint');
    
    return {
      loadTime: timing.loadEventEnd - timing.navigationStart,
      domReady: timing.domContentLoadedEventEnd - timing.navigationStart,
      firstPaint: paints.find(p => p.name === 'first-paint')?.startTime || 0,
      fcp: paints.find(p => p.name === 'first-contentful-paint')?.startTime || 0,
      lcp: performance.getEntriesByName('largest-contentful-paint')[0]?.renderTime || 0,
      ttfb: timing.responseStart - timing.requestStart
    };
  });
  
  console.log('📊 Performance:', metrics);
  
  // Save data
  const dataFile = 'perf-data.json';
  let allData = [];
  
  if (fs.existsSync(dataFile)) {
    allData = JSON.parse(fs.readFileSync(dataFile));
  }
  
  allData.push({
    date: new Date().toISOString(),
    ...metrics
  });
  
  fs.writeFileSync(dataFile, JSON.stringify(allData, null, 2));
  
  // CREATE SIMPLE GRAPH USING TERMINAL (NO INSTALL)
  console.log('\n📈 PERFORMANCE GRAPH:');
  console.log('='.repeat(50));
  
  // Bar chart in terminal
  const maxTime = Math.max(...Object.values(metrics));
  
  Object.entries(metrics).forEach(([key, value]) => {
    const bars = Math.round((value / maxTime) * 40);
    console.log(`${key.padEnd(15)}: ${'█'.repeat(bars)} ${value}ms`);
  });
  
  console.log('='.repeat(50));
  
  // Also save as CSV for Excel
  const csv = Object.entries(metrics)
    .map(([key, value]) => `${key},${value}`)
    .join('\n');
  
  fs.writeFileSync('perf-chart.csv', 'Metric,Time(ms)\n' + csv);
  console.log('✅ CSV saved: perf-chart.csv - Open in Excel for charts!');
});