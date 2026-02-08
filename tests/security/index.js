/**
 * Security Test Suite Index
 * Run all security tests from one command
 */

// This file is just for documentation/organization
// All tests are automatically discovered by Playwright

/**
 * To run all security tests:
 * npx playwright test --grep "@Security"
 * 
 * To run specific security test categories:
 * 
 * SQL Injection Tests:
 * npx playwright test --grep "@Security @SQLi"
 * 
 * XSS Tests:
 * npx playwright test --grep "@Security @XSS"
 * 
 * Information Disclosure Tests:
 * npx playwright test --grep "@Security @InfoDisclosure"
 * 
 * Session Security Tests:
 * npx playwright test --grep "@Security @Session"
 * 
 * Input Validation Tests:
 * npx playwright test --grep "@Security @InputValidation"
 * 
 * Concurrent Attack Tests:
 * npx playwright test --grep "@Security @Concurrent"
 */