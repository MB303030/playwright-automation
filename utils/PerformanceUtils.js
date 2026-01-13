// utils/performance-utils.js

/**
 * Measure execution time of an async function
 * @param {Function} fn - Async function to measure
 * @param {...any} args - Arguments to pass to the function
 * @returns {Promise<{result: any, time: number}>} - Result and execution time in milliseconds
 */
export async function measureExecutionTime(fn, ...args) {
    const startTime = Date.now();
    const result = await fn(...args);
    const time = Date.now() - startTime;
    return { result, time };
}

/**
 * Format time for logging
 * @param {number} ms - Time in milliseconds
 * @returns {string} Formatted time string
 */
export function formatTime(ms) {
    if (ms < 1000) {
        return `${Math.round(ms)}ms`;
    } else if (ms < 60000) {
        return `${(ms / 1000).toFixed(2)}s`;
    } else {
        const minutes = Math.floor(ms / 60000);
        const seconds = ((ms % 60000) / 1000).toFixed(1);
        return `${minutes}m ${seconds}s`;
    }
}

/**
 * Create a performance threshold assertion with descriptive error message
 * @param {number} actualTime - Actual execution time in milliseconds
 * @param {number} maxAllowed - Maximum allowed time in milliseconds
 * @param {string} operationName - Name of the operation being measured
 * @throws {Error} If actual time exceeds max allowed time
 */
export function assertPerformanceThreshold(actualTime, maxAllowed, operationName) {
    const actualFormatted = formatTime(actualTime);
    const maxFormatted = formatTime(maxAllowed);
    const percentage = ((actualTime / maxAllowed) * 100).toFixed(1);
    
    if (actualTime > maxAllowed) {
        throw new Error(
            `❌ ${operationName} took ${actualFormatted} which exceeds the threshold of ${maxFormatted} by ${percentage}%`
        );
    }
}

/**
 * Calculate performance improvement or regression
 * @param {number} currentTime - Current execution time
 * @param {number} baselineTime - Baseline execution time
 * @returns {Object} Performance comparison data
 */
export function calculatePerformanceChange(currentTime, baselineTime) {
    const change = currentTime - baselineTime;
    const percentage = (change / baselineTime) * 100;
    const isRegression = change > 0;
    
    return {
        changeMs: change,
        changePercentage: percentage.toFixed(1),
        isRegression,
        message: isRegression 
            ? `Performance regression: +${formatTime(change)} (+${percentage.toFixed(1)}%)`
            : `Performance improvement: -${formatTime(Math.abs(change))} (-${Math.abs(percentage).toFixed(1)}%)`
    };
}