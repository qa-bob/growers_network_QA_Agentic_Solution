---
paths:
  - "tests/**/*.spec.ts"
  - "tests/**/*.test.ts"
---

# Testing Rules

## Imports
- Always import `test` and `expect` from `@fixtures/site.fixture`, NOT from `@playwright/test`
- Never import page objects directly in test files — use the fixture properties

## Tags
- Every `test()` call must include at least one tag in the test name: `@smoke`, `@navigation`, `@forms`, `@functional`, `@visual`, or `@responsive`
- `test.describe()` blocks should also include the primary tag

## Assertions
- Use `expect()` only in test files, never inside page object methods
- Prefer `toBeVisible()` over `isVisible()` for element checks
- Use `toHaveLength(0)` over `toBe(0)` for array emptiness checks

## Navigation
- Never hardcode URLs — always derive from `siteConfig.url`
- Use `waitUntil: 'domcontentloaded'` for initial navigation
- Use `waitForLoadState('networkidle')` only when checking dynamic content

## Forms
- Never call `page.click()` on a submit button in a way that would POST data
- Intercepting and blocking form submission is acceptable for validation tests
- Always gate form tests with `if (siteConfig.skipForms) { test.skip(...) }`

## Waiting
- Never use `page.waitForTimeout()` with values > 500ms
- Use Playwright's built-in auto-waiting: `toBeVisible()`, `waitForSelector()`, `waitForLoadState()`

## Test independence
- Each test must be able to run alone — no shared state between tests
- Use `test.beforeEach` for navigation, not `test.beforeAll`
