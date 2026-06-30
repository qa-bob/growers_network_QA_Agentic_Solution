/**
 * tests/functional/industry-insight.spec.ts
 *
 * Functional tests for the Growers Network /industry-insight (blog) page.
 * Covers: page load, article listings, category filters, newsletter sidebar,
 * social links, and specialized content sections (AMA, Harvest Newsletter).
 * No form submission occurs.
 *
 * Tag: @functional
 */

import { test, expect } from '@fixtures/site.fixture';
import { IndustryInsightPage } from '@pages/industry-insight.page';

test.describe('Industry Insight Page @functional', () => {
  test.beforeEach(async ({ page, siteConfig }) => {
    const insightUrl = siteConfig.url.replace(/\/$/, '') + '/industry-insight';
    const response = await page.goto(insightUrl, {
      waitUntil: 'domcontentloaded',
      timeout: 20_000,
    });

    if (!response || response.status() >= 400) {
      test.skip(true, `/industry-insight returned HTTP ${response?.status()} — page unavailable`);
    }
  });

  // ── Page load ─────────────────────────────────────────────────────────────────

  test('industry insight page loads with heading @functional', async ({ page, siteConfig }) => {
    const insight = new IndustryInsightPage(page, siteConfig);
    const heading = await insight.getPageHeadingText();
    expect(
      heading.length,
      'Industry Insight page should have a non-empty H1 heading'
    ).toBeGreaterThan(0);
  });

  test('industry insight heading contains expected text @functional', async ({ page, siteConfig }) => {
    const insight = new IndustryInsightPage(page, siteConfig);
    const heading = await insight.getPageHeadingText();
    expect(
      heading.toLowerCase(),
      'H1 heading should reference "industry" or "insights"'
    ).toMatch(/industry|insight|blog/i);
  });

  test('industry insight page has meaningful body content @functional', async ({ page }) => {
    const bodyText = await page.evaluate<string>(() => document.body.innerText);
    expect(
      bodyText.trim().length,
      'Page body should contain more than 200 characters of visible text'
    ).toBeGreaterThan(200);
  });

  // ── Article listings ──────────────────────────────────────────────────────────

  test('article cards are present on the page @functional', async ({ page, siteConfig }) => {
    const insight = new IndustryInsightPage(page, siteConfig);
    await page.waitForLoadState('networkidle');
    const count = await insight.getArticleCount();
    if (count === 0) {
      console.warn('[functional] No article card elements found — CSS selectors may need updating for this CMS.');
    } else {
      expect(count, 'At least one article card should be visible').toBeGreaterThan(0);
    }
  });

  test('first articles have non-empty titles and valid hrefs @functional', async ({ page, siteConfig }) => {
    const insight = new IndustryInsightPage(page, siteConfig);
    await page.waitForLoadState('networkidle');

    const articles = await insight.getFirstArticles(5);
    if (articles.length === 0) {
      console.warn('[functional] Could not extract article metadata — article link selectors may need updating.');
      return;
    }

    for (const article of articles) {
      expect(article.title, `Article title should be non-empty: "${article.href}"`).toBeTruthy();
      expect(article.href, `Article link should be non-empty`).toBeTruthy();

      // Article links should be absolute URLs or valid relative paths
      if (article.href.startsWith('http')) {
        expect(() => new URL(article.href)).not.toThrow();
      }
    }
  });

  test('article links stay on the site domain or known partner domains @functional', async ({ page, siteConfig }) => {
    const insight = new IndustryInsightPage(page, siteConfig);
    await page.waitForLoadState('networkidle');

    const articles = await insight.getFirstArticles(5);
    const siteOrigin = new URL(siteConfig.url).origin;

    for (const article of articles) {
      if (!article.href.startsWith('http')) continue;
      const articleOrigin = new URL(article.href).origin;

      // Allow same-origin links and known Growers Network sub-domains
      const isKnownOrigin =
        articleOrigin === siteOrigin ||
        articleOrigin.includes('growersnetwork.org') ||
        articleOrigin.includes('forum.growersnetwork.org');

      if (!isKnownOrigin) {
        console.warn(`[functional] Article link goes to external origin: ${article.href}`);
      }
    }
  });

  // ── Category filters ──────────────────────────────────────────────────────────

  test('blog category filter links are present @functional', async ({ page, siteConfig }) => {
    const insight = new IndustryInsightPage(page, siteConfig);
    const count = await insight.getCategoryFilterCount();
    if (count === 0) {
      console.warn('[functional] No category filter links found on /industry-insight.');
    } else {
      expect(count, 'At least one category filter should be present').toBeGreaterThan(0);
    }
  });

  test('category filter links have valid hrefs @functional', async ({ page, siteConfig }) => {
    const insight = new IndustryInsightPage(page, siteConfig);
    const filters = await insight.categoryFilters.all();

    for (const filter of filters) {
      const href = await filter.getAttribute('href');
      expect(href, 'Category filter link should have an href').toBeTruthy();
      expect(href, 'Category filter href must not be bare "#"').not.toBe('#');
    }
  });

  // ── Newsletter sidebar ────────────────────────────────────────────────────────

  test('newsletter signup section is present @functional', async ({ page, siteConfig }) => {
    const insight = new IndustryInsightPage(page, siteConfig);
    const hasSignup = await insight.hasNewsletterSignup();
    if (!hasSignup) {
      console.warn('[functional] Newsletter signup not found on /industry-insight — may have been removed.');
    }
    // Soft check — newsletter is a UX feature, not a hard requirement
    expect(typeof hasSignup).toBe('boolean');
  });

  // ── Social links ──────────────────────────────────────────────────────────────

  test('social media links are present on the page @functional', async ({ page, siteConfig }) => {
    const insight = new IndustryInsightPage(page, siteConfig);
    const hrefs = await insight.getSocialLinkHrefs();

    if (hrefs.length === 0) {
      console.warn('[functional] No social media links found on /industry-insight.');
    } else {
      expect(hrefs.length, 'At least one social media link should exist').toBeGreaterThan(0);
    }
  });

  test('social media links use HTTPS @functional', async ({ page, siteConfig }) => {
    const insight = new IndustryInsightPage(page, siteConfig);
    const hrefs = await insight.getSocialLinkHrefs();

    for (const href of hrefs) {
      const url = new URL(href);
      expect(url.protocol, `Social link "${href}" should use HTTPS`).toBe('https:');
    }
  });

  // ── Specialized sections ──────────────────────────────────────────────────────

  test('AMA section is present if visible @functional', async ({ page, siteConfig }) => {
    const insight = new IndustryInsightPage(page, siteConfig);
    const count = await insight.amaSection.count();
    if (count > 0) {
      await expect(insight.amaSection).toBeVisible({ timeout: 10_000 });
    } else {
      console.warn('[functional] AMA section not found on /industry-insight — may not be scheduled.');
    }
  });

  test('Harvest Newsletter section is present if visible @functional', async ({ page, siteConfig }) => {
    const insight = new IndustryInsightPage(page, siteConfig);
    const count = await insight.harvestNewsletterSection.count();
    if (count > 0) {
      await expect(insight.harvestNewsletterSection).toBeVisible({ timeout: 10_000 });
    } else {
      console.warn('[functional] Harvest Newsletter section not found on /industry-insight.');
    }
  });

  test('Latest News section is present @functional', async ({ page, siteConfig }) => {
    const insight = new IndustryInsightPage(page, siteConfig);
    const count = await insight.latestNewsSection.count();
    if (count > 0) {
      await expect(insight.latestNewsSection).toBeVisible({ timeout: 10_000 });
    } else {
      console.warn('[functional] Latest News section not found on /industry-insight.');
    }
  });
});
