/**
 * src/pages/resources.page.ts
 *
 * ResourcesPage models the /resources page of growersnetwork.org.
 * Covers resource cards, blog category filters, and the newsletter section.
 */

import { type Locator } from '@playwright/test';
import { BasePage } from '@pages/base.page';

export class ResourcesPage extends BasePage {
  // ── Primary page elements ─────────────────────────────────────────────────────

  readonly pageHeading: Locator;
  readonly resourceCards: Locator;
  readonly blogSection: Locator;
  readonly watchNowSection: Locator;
  readonly forumSection: Locator;

  // ── Resource hub cards ────────────────────────────────────────────────────────

  readonly jobBoardCard: Locator;
  readonly glossaryCard: Locator;
  readonly cannaCribsCard: Locator;

  // ── Blog category filters ─────────────────────────────────────────────────────

  readonly blogCategoryFilters: Locator;
  readonly cultivationFilter: Locator;
  readonly industryFilter: Locator;

  // ── Newsletter section ────────────────────────────────────────────────────────

  readonly newsletterSection: Locator;
  readonly newsletterEmailInput: Locator;

  constructor(...args: ConstructorParameters<typeof BasePage>) {
    super(...args);

    // Primary heading — "Resources"
    this.pageHeading = this.page.locator('h1').first();

    // Resource hub cards — elements linking to Job Board, Glossary, etc.
    this.resourceCards = this.page.locator(
      '[class*="resource"], [class*="card"], [class*="hub"]'
    ).filter({ hasText: /job board|glossary|growmetrics|canna cribs|deep roots|podcast/i });

    // Section blocks using text-based identification (resilient to class changes)
    this.blogSection = this.page
      .locator('section, div, article')
      .filter({ hasText: /^Blog$|blog articles|latest from the blog/i })
      .first();

    this.watchNowSection = this.page
      .locator('section, div')
      .filter({ hasText: /watch now/i })
      .first();

    this.forumSection = this.page
      .locator('section, div')
      .filter({ hasText: /forum/i })
      .first();

    // Individual resource hub cards
    this.jobBoardCard = this.page
      .locator('a, div, section')
      .filter({ hasText: /job board/i })
      .first();

    this.glossaryCard = this.page
      .locator('a, div, section')
      .filter({ hasText: /^glossary$/i })
      .first();

    this.cannaCribsCard = this.page
      .locator('a, div, section')
      .filter({ hasText: /canna cribs/i })
      .first();

    // Blog category filter navigation
    this.blogCategoryFilters = this.page.locator(
      'a[href*="cultivation"], a[href*="industry"], a[href*="laboratories"], a[href*="how-to"]'
    );

    this.cultivationFilter = this.page
      .getByRole('link', { name: /cultivation/i })
      .first();

    this.industryFilter = this.page
      .getByRole('link', { name: /^industry$/i })
      .first();

    // Newsletter section
    this.newsletterSection = this.page
      .locator('section, div, form')
      .filter({ hasText: /get updates|newsletter|subscribe/i })
      .first();

    this.newsletterEmailInput = this.page.locator(
      'input[type="email"], input[placeholder*="email" i]'
    ).first();
  }

  // ── Actions ───────────────────────────────────────────────────────────────────

  /** Navigate directly to the /resources page. */
  async navigateToResources(): Promise<void> {
    const resourcesUrl = this.config.url.replace(/\/$/, '') + '/resources';
    await this.page.goto(resourcesUrl, { waitUntil: 'domcontentloaded' });
  }

  /** Return the text of the primary page heading. */
  async getPageHeadingText(): Promise<string> {
    return (await this.pageHeading.textContent())?.trim() ?? '';
  }

  /** Return all resource card link hrefs on the page. */
  async getResourceCardLinks(): Promise<string[]> {
    const cards = await this.page.locator('a[href]').filter({
      hasText: /job board|glossary|growmetrics|canna cribs|deep roots|podcast/i,
    }).all();

    const hrefs: string[] = [];
    for (const card of cards) {
      const href = await card.getAttribute('href');
      if (href && href !== '#') hrefs.push(href);
    }
    return hrefs;
  }

  /** Return the count of visible blog category filter links. */
  async getBlogCategoryCount(): Promise<number> {
    return this.blogCategoryFilters.count();
  }

  /** Return true if the newsletter email input is present. */
  async hasNewsletterSignup(): Promise<boolean> {
    return (await this.newsletterEmailInput.count()) > 0;
  }
}
