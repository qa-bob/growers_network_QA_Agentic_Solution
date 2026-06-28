# Agent Registry — Growers Network QA Suite

This file documents all AI agents available in this repository for any compatible AI coding tool. Claude Code reads `CLAUDE.md` instead — see that file for Claude-specific instructions. If you use another tool that reads `AGENTS.md`, add a `CLAUDE.md` that imports this file with `@AGENTS.md`.

---

## What is this repository?

This is a **Playwright + TypeScript regression test suite** for [Growers Network](https://growersnetwork.org/), a professional cannabis community platform. Tests use the **Page Object Model (POM)** design pattern and **OOP** principles to keep selectors, actions, and assertions separated by responsibility.

The test suite covers: smoke tests, navigation, form interactions (no submission), functional business logic, visual regression, and responsive layout across desktop, tablet, and mobile viewports.

---

## Available Agents

### `site-analyzer`

**Location:** `.claude/agents/site-analyzer.md`

**Purpose:** Crawls the live website at `site.config.json → url` and produces a fully-populated `site.config.json`. Use this when:
- Onboarding a new target website
- Re-verifying the config after a site redesign
- Running the `/analyze-site` slash command

**Outputs:** Updated `site.config.json` + issues checklist

**Tools used:** WebFetch, Read, Write

---

### `test-generator`

**Location:** `.claude/agents/test-generator.md`

**Purpose:** Reads `site.config.json` and generates site-specific Playwright TypeScript test files in `tests/custom/`. Use this when:
- A discovered page has unique functionality not covered by the generic suites
- Writing regression tests for a specific discovered bug
- Running the `/generate-full-suite` slash command

**Outputs:** `tests/custom/<scenario>.spec.ts` files + any required page object additions in `src/pages/`

**Tools used:** WebFetch, Read, Write, Edit, Bash

---

## Agent Conventions

All agents in this repository follow these rules:

1. **Never submit forms** — form validation tests click submit but intercept the POST
2. **Never create accounts** — no real credentials, no sign-up flows
3. **Never hardcode URLs** — always derive from `siteConfig.url` in `site.config.json`
4. **Assertions belong in tests** — page object methods return values, never assert
5. **TypeScript strict mode** — all generated code must pass `npx tsc --noEmit`
6. **Real selectors** — inspect the live site with WebFetch before writing any selector; no generic placeholders

---

## Adding a New Agent

1. Create `.claude/agents/<agent-name>.md`
2. Add YAML frontmatter with `name`, `description`, and optionally `tools` and `model`
3. Write the system prompt in the body of the file
4. Add an entry to this `AGENTS.md` file
5. Reference the agent in `CLAUDE.md` slash commands if it should be user-invocable

```markdown
---
name: my-agent
description: What this agent does and when to delegate to it
tools: Read, Write, Bash
model: claude-haiku-4-5
---

# Agent: my-agent

(system prompt body here)
```
