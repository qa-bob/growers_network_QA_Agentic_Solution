/**
 * src/pages/industry-insight.page.ts
 *
 * IndustryInsightPage models the /industry-insight (blog) page.
 * Covers article listings, category filters, newsletter sidebar, and social links.
 */

import { type Locator } from '@playwright/test';
import { BasePage } from '@pages/base.page';

export interface ArticleCardInfo {
  title: string;
  href: string;
}

export class IndustryInsightPage extends BasePage {
  // ── Primary page elements ─────────────────────────────────────────────────────

  readonly pageHeading: Locator;
  readonly articleCards: Locator;
  readonly articleLinks: Locator;

  // ── Category navigation ───────────────────────────────────────────────────────

  readonly categoryFilters: Locator;

  // ── Newsletter / sidebar ──────────────────────────────────────────────────────

  readonly newsletterSection: Locator;
  readonly socialLinks: Locator;

  // ── AMA / special sections ────────────────────────────────────────────────────

  readonly amaSection: Locator;
  readonly harvestNewsletterSection: Locator;
  readonly latestNewsSection: Locator;

  constructor(...args: ConstructorParameters<typeof BasePage>) {
    super(...args);

    // "Industry Insights" heading
    this.pageHeading = this.page.locator('h1').first();

    // Article cards — common patterns for blog post cards
    this.articleCards = this.page.locator(
      'article, [class*="article"], [class*="post"], [class*="blog-card"], [class*="card"]'
    );

    // All internal article links in the main content area
    this.articleLinks = this.page.locator('main a[href], [class*="content"] a[href], article a[href]').filter({
      hasNotText: /cultivation|industry|resources|general|laboratories|dispensary|processing|lighting/i,
    });

    // Category filter links
    this.categoryFilters = this.page.locator(
      'a[href*="cultivation"], a[href*="industry"], a[href*="resources"], ' +
      'a[href*="laboratories"], a[href*="lighting"], a[href*="dispensary"]'
    );

    // Sidebar / newsletter
    this.newsletterSection = this.page
      .locator('form, section, div, aside')
      .filter({ hasText: /newsletter|subscribe|bi-weekly/i })
      .first();

    // Social links
    this.socialLinks = this.page.locator(
      'a[href*="instagram.com"], a[href*="twitter.com"], a[href*="x.com"], ' +
      'a[href*="linkedin.com"], a[href*="facebook.com"], a[href*="youtube.com"]'
    );

    // Specialized content sections
    this.amaSection = this.page
      .locator('section, div')
      .filter({ hasText: /ask me anything|upcoming ama/i })
      .first();

    this.harvestNewsletterSection = this.page
      .locator('section, div')
      .filter({ hasText: /harvest newsletter/i })
      .first();

    this.latestNewsSection = this.page
      .locator('section, div')
      .filter({ hasText: /latest news/i })
      .first();
  }

  // ── Actions ───────────────────────────────────────────────────────────────────

  /** Navigate directly to the /industry-insight page. */
  async navigateToIndustryInsight(): Promise<void> {
    const insightUrl = this.config.url.replace(/\/$/, '') + '/industry-insight';
    await this.page.goto(insightUrl, { waitUntil: 'domcontentloaded' });
  }

  /** Return the page H1 heading text. */
  async getPageHeadingText(): Promise<string> {
    return (await this.pageHeading.textContent())?.trim() ?? '';
  }

  /** Return count of visible article cards. */
  async getArticleCount(): Promise<number> {
    return this.articleCards.count();
  }

  /** Return count of visible category filter links. */
  async getCategoryFilterCount(): Promise<number> {
    return this.categoryFilters.count();
  }

  /** Return true if the newsletter signup is present on the page. */
  async hasNewsletterSignup(): Promise<boolean> {
    return (await this.newsletterSection.count()) > 0;
  }

  /**
   * Return metadata for the first N article cards visible on the page.
   * Useful for verifying article listing content.
   */
  async getFirstArticles(limit = 5): Promise<ArticleCardInfo[]> {
    const links = await this.page.locator(
      'article a[href], [class*="post"] a[href], [class*="article"] a[href], main h2 a, main h3 a'
    ).all();

    const results: ArticleCardInfo[] = [];
    for (const link of links.slice(0, limit)) {
      const title = (await link.textContent())?.trim() ?? '';
      const href = (await link.getAttribute('href')) ?? '';
      if (title && href && href !== '#') {
        results.push({ title, href });
      }
    }
    return results;
  }

  /** Return all social link hrefs found on the page. */
  async getSocialLinkHrefs(): Promise<string[]> {
    const links = await this.socialLinks.all();
    const hrefs: string[] = [];
    for (const link of links) {
      const href = await link.getAttribute('href');
      if (href) hrefs.push(href);
    }
    return hrefs;
  }
}
