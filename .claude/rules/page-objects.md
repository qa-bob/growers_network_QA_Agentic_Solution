---
paths:
  - "src/pages/**/*.ts"
---

# Page Object Rules

## Class structure
- Every page class must extend `BasePage` from `@pages/base.page`
- Locators must be declared as `readonly Locator` properties on the class
- Constructor must call `super(page, config)` — no additional logic in constructors

## Locator strategy (priority order)
1. Role-based: `getByRole('button', { name: /text/i })`
2. Label-based: `getByLabel('Email')`
3. Text-based: `getByText('Submit')`
4. Attribute: `locator('[data-testid="hero"]')`
5. CSS class: only as a last resort, prefer semantic attributes

## Methods
- Methods represent user actions (`clickNavItem`, `fillEmailField`, `openMobileMenu`)
- Methods must be `async` and return typed values (`Promise<void>`, `Promise<string>`, etc.)
- No `expect()` inside page object methods — return values for the test to assert
- No `any` types — use explicit TypeScript types

## Imports
- Import `Locator` and `Page` from `@playwright/test` (types only)
- Import `BasePage` from `@pages/base.page`
- Import `SiteConfig` from `@types/site-config.types`
