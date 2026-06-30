# AI Agent Instructions — Growers Network QA Suite

This file provides context for AI coding agents (GitHub Copilot, Claude Code, and similar tools) working in this repository.

---

## What This Repository Is

A **Playwright + TypeScript regression test suite** for [growersnetwork.org](https://growersnetwork.org) — a B2B SaaS professional community for cannabis cultivation professionals.

Architecture: **Page Object Model (POM)** with **OOP** design patterns, structured for AI-assisted agentic execution via Claude Code.

---

## Architecture Constraints

### Page Object Model — Non-negotiable

Every page or section must have a class in `src/pages/` that:
- Extends `BasePage` from `src/pages/base.page.ts`
- Declares key elements as `readonly Locator` properties
- Exposes only **action methods** — never assertions

```typescript
// CORRECT
export class ResourcesPage extends BasePage {
  readonly heading: Locator;
  readonly articleCards: Locator;

  constructor(...args: ConstructorParameters<typeof BasePage>) {
    super(...args);
    this.heading = this.page.locator('h1').first();
    this.articleCards = this.page.locator('[class*="article"], [class*="resource-card"]');
  }

  async getHeadingText(): Promise<string> {
    return (await this.heading.textContent()) ?? '';
  }
}

// WRONG — expect() inside a page object
async assertVisible(): Promise<void> {
  await expect(this.heading).toBeVisible(); // NOT allowed
}
```

### Test Files

- Import `test` and `expect` from `@fixtures/site.fixture` — **never** from `@playwright/test` directly
- Tag every `test()` call: `@smoke`, `@navigation`, `@forms`, `@functional`, `@visual`, or `@responsive`
- Derive all URLs from `siteConfig.url` — never hardcode `https://growersnetwork.org` in a test
- Never call `page.waitForTimeout()` with values over 500ms — use Playwright's built-in auto-waiting

### TypeScript

- Strict mode is enabled — no implicit `any`
- Path aliases: `@pages/*`, `@fixtures/*`, `@utils/*`, `@app-types/*`
- Run `npx tsc --noEmit` before reporting any code change as complete

---

## What Agents Must Never Do

- Submit a form (no POST requests triggered by test actions)
- Create an account or log in (auth is not required on this site)
- Hardcode URLs
- Put `expect()` inside page object methods
- Generate `any` types
- Use `page.waitForTimeout()` > 500ms

---

## Locator Strategy

Use this priority order when writing selectors:

1. Role-based: `getByRole('button', { name: /text/i })`
2. Label-based: `getByLabel('Email')`
3. Text-based: `getByText('Submit')`
4. Test attribute: `locator('[data-testid="hero"]')`
5. CSS class: last resort — only when semantic alternatives don't exist

---

## Test File Naming and Placement

| What | Where |
|------|-------|
| Smoke tests | `tests/smoke/*.spec.ts` |
| Navigation tests | `tests/navigation/*.spec.ts` |
| Form tests | `tests/forms/*.spec.ts` |
| Functional tests | `tests/functional/*.spec.ts` |
| Visual tests | `tests/visual/*.spec.ts` |
| Responsive tests | `tests/responsive/*.spec.ts` |
| Site-specific generated tests | `tests/custom/*.spec.ts` |
| Page objects | `src/pages/<name>.page.ts` |

---

## Site Configuration

The target site is defined in `site.config.json`:

```json
{
  "name": "Growers Network",
  "url": "https://growersnetwork.org",
  "hasContactForm": true,
  "expectedNavItems": ["Log In", "Sign Up", "Resources", "Industry Insight"],
  "auth": { "required": false }
}
```

Read this file at the start of any task that involves the site. Use `WebFetch` to inspect the live site before writing selectors.

---

## Claude Code Sub-Agents

Two sub-agents are defined in `.claude/agents/`:

| Agent | Responsibility |
|-------|---------------|
| `site-analyzer` | Crawl the site → produce `site.config.json` |
| `test-generator` | Read config → generate POM + test files |

Invoke via slash commands: `/analyze-site`, `/generate-full-suite`.

Full documentation: `Agent.md` in the repo root.

---

## Path Aliases (tsconfig.json)

| Alias | Resolves to |
|-------|-------------|
| `@pages/*` | `src/pages/*` |
| `@fixtures/*` | `src/fixtures/*` |
| `@utils/*` | `src/utils/*` |
| `@app-types/*` | `src/types/*` |

Note: `@types/*` is reserved by TypeScript for DefinitelyTyped. Always use `@app-types/*` for project types.
