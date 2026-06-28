# Skills Reference — Growers Network QA Suite

Skills are slash commands that Claude Code loads on demand. They encapsulate repeatable workflows for this repository. Type any command in Claude Code to invoke it.

---

## Available Skills

### `/generate-full-suite`

**File:** `.claude/commands/generate-full-suite.md`

**What it does:** Analyzes the live website and generates a complete POM + test suite from scratch, including page objects, fixtures, and all test categories.

**When to use:**
- First-time setup of this repo against a new site
- After a major site redesign that broke many selectors
- When you need to rapidly scaffold tests for newly discovered pages

**Steps it runs:**
1. Reads `site.config.json`
2. Crawls the live site with `WebFetch`
3. Generates/updates page object classes in `src/pages/`
4. Writes test files across all suites (`smoke`, `navigation`, `forms`, `functional`, `visual`, `responsive`)
5. Updates `src/fixtures/site.fixture.ts`
6. Verifies TypeScript compiles with `npx tsc --noEmit`

---

### `/analyze-site`

**File:** `.claude/commands/analyze-site.md`

**What it does:** Crawls the website and produces a fully-populated `site.config.json` ready to paste into the repo.

**When to use:**
- Onboarding a new target website
- Verifying `site.config.json` is still accurate after a site redesign

**Output:** Updated `site.config.json` JSON block + issues checklist (missing meta desc, broken links, etc.)

---

### `/run-smoke`

**File:** `.claude/commands/run-smoke.md`

**What it does:** Runs all `@smoke` tagged tests and returns a pass/fail summary.

**When to use:**
- Quick sanity check before a full test run
- Verifying the site is up before a sprint demo
- CI gate check

---

### `/update-baseline`

**File:** `.claude/commands/update-baseline.md`

**What it does:** Runs all `@visual` tests with `--update-snapshots` to refresh the screenshot baselines.

**When to use:**
- After intentional UI changes that affect layout/styling
- When visual tests fail due to expected design updates
- After updating browser versions that affect rendering

**Caution:** Review all changed snapshots before committing. Only run when the visual changes are intentional.

---

### `/generate-report`

**File:** `.claude/commands/generate-report.md`

**What it does:** Reads `test-results/results.json` and generates a human-readable markdown test report.

**When to use:**
- After a test run to share results with stakeholders
- For sprint retrospective QA summaries
- After CI failures to diagnose what broke

---

## Adding a New Skill

1. Create `.claude/commands/<command-name>.md`
2. Write the skill body using markdown — Claude Code loads this as the prompt context
3. Register the skill in the table above
4. Reference it in `CLAUDE.md` under the Slash Commands section

**Naming convention:** Use kebab-case. The filename becomes the slash command: `my-workflow.md` → `/my-workflow`.

---

## Skill vs Agent — When to Use Each

| Use a **Skill** when... | Use an **Agent** when... |
|------------------------|--------------------------|
| The task is user-invoked (`/command`) | The task is automatically delegated |
| It's a workflow with multiple steps | It's a specialized domain expert |
| It runs once and returns results | It might be invoked repeatedly |
| Instructions should be in context only when invoked | Instructions should persist and be auto-selected |

---

## npm Scripts (Non-Claude)

These run outside Claude Code for CI/CD integration:

| Script | Command | Description |
|--------|---------|-------------|
| All tests | `npm test` | Full test suite |
| Smoke only | `npm run test:smoke` | `@smoke` tests |
| Navigation | `npm run test:navigation` | `@navigation` tests |
| Forms | `npm run test:forms` | `@forms` tests |
| Visual | `npm run test:visual` | `@visual` tests |
| Responsive | `npm run test:responsive` | `@responsive` tests |
| Visual baseline | `npm run baseline` | Update screenshot snapshots |
| Type check | `npm run typecheck` | `npx tsc --noEmit` |
| Lint | `npm run lint` | ESLint on `src/` and `tests/` |
| HTML report | `npm run report` | Open Playwright HTML report |
