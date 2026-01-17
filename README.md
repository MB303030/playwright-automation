# Playwright Test Automation Project

## Setup
1. Install dependencies: `npm install`
2. Install Playwright browsers: `npx playwright install`
3. Run tests: `npx playwright test`

## Project Structure
- `/pages` - Page Object Models
- `/tests` - Test files
- `/utils` - Helper classes and utilities

## Running Tests
- Headless mode: `npx playwright test`
- With UI: `npx playwright test --ui`
- Specific test: `npx playwright test tests/login.spec.js`

## Running Allure report 
- Headless mode: `npx playwright test -c playwright.ci.config.js 
- Generate report: `npx allure generate allure-results --clean -o allure-report`
- Open the report `npx allure open allure-report`