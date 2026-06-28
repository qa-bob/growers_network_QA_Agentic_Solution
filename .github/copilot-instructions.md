# GitHub Copilot Instructions — Growers Network QA Suite

This repository is a **Playwright + TypeScript regression test suite** using the **Page Object Model (POM)** and **OOP** design patterns. These instructions guide Copilot suggestions in this repo.

---

## Architecture

### Page Object Model

Every page or section of the website has a corresponding TypeScript class in `src/pages/`:

```typescript
// Pattern: extend BasePage, declare Locators, expose action methods
import { type Locator } from '@playwright/test';
import { BasePage } from '@pages/base.page';

export class ExamplePage extends BasePage {
  readonly heading: Locator;
  readonly ctaButton: Locator;

  constructor(...args: ConstructorParameters<typeof BasePage>) {
    super(...args);
    this.heading = this.page.locator('h1').first();
    this.ctaButton = this.page.getByRole('link', { name: /get started/i }).first();
  }

  async clickCta(): Promise<void> {
    await this.ctaButton.click();
    await this.page.waitForLoadState('domcontentloaded');
  }
}
```

### Test files

```typescript
// Always import from the fixture, not from @playwright/test
import { test, expect } from '@fixtures/site.fixture';

test.describe('Feature @functional', () => {
  test('feature is visible @functional', async ({ page, siteConfig }) => {
    // Use page objects — no raw page.locator() in test bodies
    await page.goto(siteConfig.url, { waitUntil: 'domcontentloaded' });
    const heading = page.locator('h1').first();
    await expect(heading).toBeVisible();
  });
});
```

---

## Rules Copilot Must Follow

1. **Import `test` from `@fixtures/site.fixture`**, not `@playwright/test`
2. **No `expect()` inside page object methods** — page objects return values; tests assert them
3. **No hardcoded URLs** — always derive from `siteConfig.url`
4. **No form submissions** — intercept and cancel POST requests in form tests
5. **No `page.waitForTimeout()` over 500ms** — use `waitForLoadState()` or `waitForSelector()`
6. **No `any` type** — use explicit TypeScript types; strict mode is on
7. **Tag every test** — include `@smoke`, `@navigation`, `@forms`, `@functional`, `@visual`, or `@responsive` in the test name
8. **One page class per page** — don't put multiple unrelated pages in one class

---

## File Structure

```
src/pages/          # Page Object classes (one per page/section)
src/fixtures/       # site.fixture.ts — extends Playwright test with page objects
src/types/          # TypeScript interfaces
src/utils/          # Shared helpers (link-checker, visual-helper)
tests/
  smoke/            # @smoke tests
  navigation/       # @navigation tests
  forms/            # @forms tests
  functional/       # @functional tests
  visual/           # @visual tests
  responsive/       # @responsive tests
  custom/           # @custom site-specific generated tests
```

---

## Path Aliases

TypeScript path aliases are configured in `tsconfig.json`:

| Alias | Resolves to |
|-------|-------------|
| `@pages/*` | `src/pages/*` |
| `@fixtures/*` | `src/fixtures/*` |
| `@utils/*` | `src/utils/*` |
| `@app-types/*` | `src/types/*` |

> Note: use `@app-types/*` not `@types/*` — `@types/` is reserved by TypeScript for DefinitelyTyped packages and causes TS6137 errors.

---

## Do Not Generate

- Form submissions or account creation
- Tests that rely on being logged in (unless `auth.required: true` in `site.config.json`)
- `page.waitForTimeout()` calls longer than 500ms
- Selectors using internal class names that are likely to change (prefer role/text-based selectors)
- Comments that describe what code does — only comment on WHY when non-obvious
