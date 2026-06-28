/**
 * src/pages/community.page.ts
 *
 * CommunityPage models the Growers Network homepage content sections.
 * Covers hero, community features, testimonials, consulting CTA, and footer.
 * Extends BasePage; selectors are based on live HTML inspection of growersnetwork.org.
 */

import { type Locator } from '@playwright/test';
import { BasePage } from '@pages/base.page';

export class CommunityPage extends BasePage {
  // ── Hero section ─────────────────────────────────────────────────────────────

  readonly heroHeading: Locator;
  readonly heroVideoEmbed: Locator;
  readonly signUpCTA: Locator;

  // ── Content sections ──────────────────────────────────────────────────────────

  readonly valuedMembersSection: Locator;
  readonly forumSection: Locator;
  readonly interestsSection: Locator;
  readonly testimonialSection: Locator;
  readonly consultingSection: Locator;

  // ── Footer ────────────────────────────────────────────────────────────────────

  readonly footer: Locator;
  readonly footerLinks: Locator;
  readonly socialLinks: Locator;

  // ── Header navigation ─────────────────────────────────────────────────────────

  readonly loginLink: Locator;
  readonly resourcesLink: Locator;
  readonly blogLink: Locator;

  constructor(...args: ConstructorParameters<typeof BasePage>) {
    super(...args);

    // Hero
    this.heroHeading = this.page.locator('h1').first();
    this.heroVideoEmbed = this.page.locator('iframe[src*="youtube"], iframe[src*="vimeo"], video').first();
    this.signUpCTA = this.page
      .getByRole('link', { name: /sign up/i })
      .or(this.page.getByRole('button', { name: /sign up/i }))
      .first();

    // Content sections — using common section/div patterns from the site
    this.valuedMembersSection = this.page
      .locator('section, div')
      .filter({ hasText: /valued members|industry partners/i })
      .first();
    this.forumSection = this.page
      .locator('section, div')
      .filter({ hasText: /join the conversation|forum/i })
      .first();
    this.interestsSection = this.page
      .locator('section, div')
      .filter({ hasText: /follow your interests/i })
      .first();
    this.testimonialSection = this.page
      .locator('section, div')
      .filter({ hasText: /testimonial|what our members/i })
      .first();
    this.consultingSection = this.page
      .locator('section, div')
      .filter({ hasText: /canna cribs|consulting/i })
      .first();

    // Footer
    this.footer = this.page.locator('footer').first();
    this.footerLinks = this.page.locator('footer a[href]');
    this.socialLinks = this.page.locator(
      'a[href*="twitter.com"], a[href*="x.com"], a[href*="linkedin.com"], ' +
      'a[href*="facebook.com"], a[href*="instagram.com"]'
    );

    // Header nav links
    this.loginLink = this.page
      .locator('header a[href*="login"], nav a[href*="login"]')
      .first();
    this.resourcesLink = this.page
      .locator('header a[href*="resources"], nav a[href*="resources"]')
      .first();
    this.blogLink = this.page
      .locator('header a[href*="industry-insight"], nav a[href*="industry-insight"], header a[href*="blog"], nav a[href*="blog"]')
      .first();
  }

  // ── Actions ───────────────────────────────────────────────────────────────────

  /** Return count of visible industry partner logos in the Valued Members section. */
  async getPartnerLogoCount(): Promise<number> {
    const logos = this.valuedMembersSection.locator('img');
    return logos.count();
  }

  /** Return count of testimonial entries on the page. */
  async getTestimonialCount(): Promise<number> {
    const testimonials = this.page.locator(
      '[class*="testimonial"], blockquote, [class*="quote"]'
    );
    return testimonials.count();
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

  /** Return all footer link hrefs. */
  async getFooterLinkHrefs(): Promise<string[]> {
    const links = await this.footerLinks.all();
    const hrefs: string[] = [];
    for (const link of links) {
      const href = await link.getAttribute('href');
      if (href && href !== '#') hrefs.push(href);
    }
    return hrefs;
  }
}
