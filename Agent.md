# Claude Code Agents — Growers Network QA Suite

Sub-agents are defined in `.claude/agents/`. They run with access to a specific subset of Claude Code tools, scoped to one responsibility. Agents are invoked automatically by slash commands or on-demand via the Claude Code CLI.

---

## Available Agents

### `site-analyzer`

**Definition**: `.claude/agents/site-analyzer.md`  
**Tools**: `WebFetch`, `Read`, `Write`, `Bash`  
**Invoked by**: `/analyze-site`

Crawls a live website and produces a fully-populated `site.config.json`. Use when onboarding a new site into the framework, or to verify that an existing config is still accurate after a site redesign.

**Inputs**

| Input | Required | Description |
|-------|----------|-------------|
| `url` | Yes | The site URL to analyze |
| `companyName` | No | Override company name (else inferred from page content) |

**What it does**

1. Resolves the final URL after any redirect chain
2. Waits for `networkidle` (SPA-safe)
3. Dismisses cookie consent banners
4. Extracts navigation links, form presence, meta description, industry keywords
5. Attempts `/contact`, `/contact-us`, `/get-in-touch` for form discovery
6. Sets `auth.required`, `skipVisual`, `skipForms` based on what it finds

**Output**: A complete `site.config.json` and an issues checklist (missing meta description, broken nav links, etc.)

---

### `test-generator`

**Definition**: `.claude/agents/test-generator.md`  
**Tools**: `WebFetch`, `Read`, `Write`, `Edit`, `Bash`  
**Invoked by**: `/generate-full-suite`

Reads a populated `site.config.json` and generates site-specific Playwright TypeScript test files in `tests/custom/`. Use when the site has unique functionality not covered by the shared framework, or to write regression tests for a discovered bug.

**Inputs**

| Input | Required | Description |
|-------|----------|-------------|
| `siteConfig` | Yes | Populated `site.config.json` |
| `testScenarios` | No | Specific scenarios to cover |
| `pagesToTest` | No | Specific page paths (e.g., `/pricing`, `/resources`) |

**What it generates**

- Page object additions in `src/pages/` (new methods or new classes)
- Spec files in `tests/custom/<scenario>.spec.ts`
- Updates to `src/fixtures/site.fixture.ts` if new page objects are added

**Output**: TypeScript test files that pass `npx tsc --noEmit`, with all tests tagged and following POM conventions.

---

## How Agents Are Invoked

Agents are Claude Code sub-agents — they run in a sandboxed context with only the tools listed in their frontmatter. They can be invoked by:

1. **Slash command** — the slash command file (`.claude/commands/*.md`) describes the workflow; Claude Code invokes the agent automatically
2. **Direct mention** — in a Claude Code session, ask Claude to "use the site-analyzer agent" or "run test-generator on the pricing page"
3. **Agent tool** — Claude Code's orchestrator can spawn agents programmatically as sub-tasks

---

## Agent Design Principles

The two agents in this repo follow a **separation of concerns**:

- `site-analyzer` only **reads and analyzes** — it never writes test files
- `test-generator` only **generates tests** — it does not re-crawl the site from scratch

This lets you run them independently. Analyze once to establish the config, then run test-generator iteratively as you add test coverage without re-crawling.

---

## Agent Output Constraints

All agents in this repo must:

- Follow the POM architecture in generated code (page objects in `src/pages/`, specs in `tests/`)
- Import `test` and `expect` from `@fixtures/site.fixture` in all generated test files
- Apply correct `@tag` annotations to all generated tests
- Run `npx tsc --noEmit` before reporting completion — TypeScript must compile cleanly
- Never generate form submissions, login flows, or account creation steps

---

## Adding a New Agent

1. Create `.claude/agents/<name>.md` with frontmatter declaring name, description, and tools:

   ```markdown
   ---
   name: my-agent
   description: One-line description used to decide when to invoke this agent
   tools: Read, Write, Bash
   ---

   # Agent: my-agent

   ## Role
   ...
   ```

2. Write the agent's role, inputs, outputs, edge-case handling, and step-by-step instructions in the body

3. Create a matching slash command in `.claude/commands/<name>.md` if the agent should be user-invocable

4. Add an entry to this file and update the skills table in `Skills.md`, `README.md`, and `CLAUDE.md`

---

## Agents vs. Skills

| | Agent (`.claude/agents/`) | Skill (`.claude/commands/`) |
|-|---------------------------|-----------------------------|
| What it is | A sub-agent with its own tool set | A prompt/workflow document |
| How it runs | Spawned as a sandboxed agent | Read by Claude as instructions |
| Best for | Multi-step autonomous tasks | Guided workflows with user interaction |
| Tool access | Restricted to declared tools | Full session tool access |

Skills often invoke agents — `/generate-full-suite` describes a workflow that uses `test-generator` under the hood.
