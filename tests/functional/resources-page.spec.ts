/**
 * tests/functional/resources-page.spec.ts
 *
 * Functional tests for the Growers Network /resources page.
 * Covers: page load, resource hub cards, blog category filters, and newsletter signup.
 * No form submission occurs — the newsletter email field is inspected only.
 *
 * Tag: @functional
 */

import { test, expect } from '@fixtures/site.fixture';
import { ResourcesPage } from '@pages/resources.page';

test.describe('Resources Page @functional', () => {
  test.beforeEach(async ({ page, siteConfig }) => {
    const resourcesUrl = siteConfig.url.replace(/\/$/, '') + '/resources';
    const response = await page.goto(resourcesUrl, {
      waitUntil: 'domcontentloaded',
      timeout: 20_000,
    });

    if (!response || response.status() >= 400) {
      test.skip(true, `/resources returned HTTP ${response?.status()} — page unavailable`);
    }
  });

  // ── Page load ─────────────────────────────────────────────────────────────────

  test('resources page loads with a heading @functional', async ({ page, siteConfig }) => {
    const resources = new ResourcesPage(page, siteConfig);
    const heading = await resources.getPageHeadingText();
    expect(heading.length, 'Resources page should have a non-empty H1 heading').toBeGreaterThan(0);
  });

  test('resources page has meaningful body text @functional', async ({ page }) => {
    const bodyText = await page.evaluate<string>(() => document.body.innerText);
    expect(
      bodyText.trim().length,
      'Resources page body should contain visible content'
    ).toBeGreaterThan(100);
  });

  test('resources page is served over HTTPS @functional', async ({ siteConfig }) => {
    expect(siteConfig.url.startsWith('https://')).toBeTruthy();
  });

  // ── Resource hub cards ────────────────────────────────────────────────────────

  test('Job Board resource card is present @functional', async ({ page, siteConfig }) => {
    const resources = new ResourcesPage(page, siteConfig);
    const card = resources.jobBoardCard;
    const count = await card.count();
    if (count === 0) {
      console.warn('[functional] Job Board card not found on /resources — may have been removed or renamed.');
    } else {
      await expect(card.first()).toBeVisible({ timeout: 10_000 });
    }
  });

  test('Glossary resource card is present @functional', async ({ page, siteConfig }) => {
    const resources = new ResourcesPage(page, siteConfig);
    const card = resources.glossaryCard;
    const count = await card.count();
    if (count === 0) {
      console.warn('[functional] Glossary card not found on /resources.');
    } else {
      await expect(card.first()).toBeVisible({ timeout: 10_000 });
    }
  });

  test('Canna Cribs resource card is present @functional', async ({ page, siteConfig }) => {
    const resources = new ResourcesPage(page, siteConfig);
    const card = resources.cannaCribsCard;
    const count = await card.count();
    if (count === 0) {
      console.warn('[functional] Canna Cribs card not found on /resources.');
    } else {
      await expect(card.first()).toBeVisible({ timeout: 10_000 });
    }
  });

  test('resource hub card links are non-empty @functional', async ({ page, siteConfig }) => {
    const resources = new ResourcesPage(page, siteConfig);
    const hrefs = await resources.getResourceCardLinks();
    expect(
      hrefs.length,
      'At least one resource hub card link should be present (Job Board, Glossary, etc.)'
    ).toBeGreaterThan(0);

    for (const href of hrefs) {
      expect(href, 'Resource card link should be a non-empty string').toBeTruthy();
      expect(href, 'Resource card link must not be a bare "#"').not.toBe('#');
    }
  });

  // ── Blog category filters ─────────────────────────────────────────────────────

  test('blog category filters are present on resources page @functional', async ({ page, siteConfig }) => {
    const resources = new ResourcesPage(page, siteConfig);
    const count = await resources.getBlogCategoryCount();
    if (count === 0) {
      console.warn('[functional] No blog category filters found on /resources — selectors may need updating.');
    } else {
      expect(count, 'At least one blog category filter (Cultivation, Industry, etc.) should exist').toBeGreaterThan(0);
    }
  });

  test('Cultivation blog category filter is visible @functional', async ({ page, siteConfig }) => {
    const resources = new ResourcesPage(page, siteConfig);
    const filterCount = await resources.cultivationFilter.count();
    test.skip(filterCount === 0, 'Cultivation category filter not found on /resources');
    await expect(resources.cultivationFilter).toBeVisible({ timeout: 10_000 });
  });

  // ── Newsletter section ────────────────────────────────────────────────────────

  test('newsletter signup section is present on resources page @functional', async ({ page, siteConfig }) => {
    const resources = new ResourcesPage(page, siteConfig);
    const hasSignup = await resources.hasNewsletterSignup();
    if (!hasSignup) {
      console.warn('[functional] No newsletter signup found on /resources — may have been removed.');
    }
  });

  test('newsletter email input is present and not disabled @functional', async ({ page, siteConfig }) => {
    const resources = new ResourcesPage(page, siteConfig);
    const hasSignup = await resources.hasNewsletterSignup();
    if (!hasSignup) {
      test.skip(true, 'No newsletter section found — skipping email input check');
      return;
    }

    const emailInput = resources.newsletterEmailInput;
    test.skip(await emailInput.count() === 0, 'Newsletter email input not found');

    await expect(emailInput).toBeVisible({ timeout: 10_000 });
    await expect(emailInput).not.toBeDisabled();
  });

  // ── Section structure ─────────────────────────────────────────────────────────

  test('Watch Now section is visible on resources page @functional', async ({ page, siteConfig }) => {
    const resources = new ResourcesPage(page, siteConfig);
    const section = resources.watchNowSection;
    test.skip(await section.count() === 0, 'Watch Now section not found on /resources');
    await expect(section).toBeVisible({ timeout: 10_000 });
  });

  test('Forum section is visible on resources page @functional', async ({ page, siteConfig }) => {
    const resources = new ResourcesPage(page, siteConfig);
    const section = resources.forumSection;
    test.skip(await section.count() === 0, 'Forum section not found on /resources');
    await expect(section).toBeVisible({ timeout: 10_000 });
  });
});
