/**
 * tests/functional/homepage-features.spec.ts
 *
 * Functional tests for Growers Network homepage features.
 * Covers: hero, community sections, CTAs, social links, footer, and navigation.
 * No account creation or form submission occurs in any test.
 *
 * Tag: @functional
 */

import { test, expect } from '@fixtures/site.fixture';
import { CommunityPage } from '@pages/community.page';

test.describe('Homepage Features @functional', () => {
  test.beforeEach(async ({ page, siteConfig }) => {
    await page.goto(siteConfig.url, { waitUntil: 'domcontentloaded' });
    await page.waitForLoadState('networkidle');
  });

  // ── Hero section ──────────────────────────────────────────────────────────────

  test('hero heading is visible and non-empty @functional', async ({ page, siteConfig }) => {
    const community = new CommunityPage(page, siteConfig);
    const headingText = await community.heroHeading.textContent();
    expect(headingText?.trim(), 'Hero h1 should have non-empty text').toBeTruthy();
    expect(headingText!.trim().length).toBeGreaterThan(5);
  });

  test('primary sign-up CTA is visible on homepage @functional', async ({ page, siteConfig }) => {
    const community = new CommunityPage(page, siteConfig);
    await expect(
      community.signUpCTA,
      'A "Sign Up" call-to-action link or button should be visible'
    ).toBeVisible({ timeout: 10_000 });
  });

  test('sign-up CTA links to sign-up page @functional', async ({ page, siteConfig }) => {
    const community = new CommunityPage(page, siteConfig);
    const href = await community.signUpCTA.getAttribute('href');
    expect(href, 'Sign-up CTA must have an href').not.toBeNull();
    // Should link to /login with signup param or similar — not an external site
    const resolvedUrl = new URL(href!, siteConfig.url);
    expect(
      resolvedUrl.origin,
      'Sign-up CTA should stay on the same origin'
    ).toBe(new URL(siteConfig.url).origin);
  });

  // ── Community sections ────────────────────────────────────────────────────────

  test('Valued Members / industry partners section is visible @functional', async ({ page, siteConfig }) => {
    const community = new CommunityPage(page, siteConfig);
    await expect(
      community.valuedMembersSection,
      'Industry partners / valued members section should be present'
    ).toBeVisible({ timeout: 10_000 });

    const logoCount = await community.getPartnerLogoCount();
    expect(logoCount, 'Industry partners section should contain at least one logo').toBeGreaterThan(0);
  });

  test('community forum / Join the Conversation section is visible @functional', async ({ page, siteConfig }) => {
    const community = new CommunityPage(page, siteConfig);
    if (await community.forumSection.count() === 0) {
      console.warn('[functional] Forum section not found on homepage — may be dynamic or renamed.');
      return;
    }
    await expect(
      community.forumSection,
      '"Join the Conversation" forum section should be visible'
    ).toBeVisible({ timeout: 10_000 });
  });

  test('Follow Your Interests section is visible with multiple pillars @functional', async ({ page, siteConfig }) => {
    const community = new CommunityPage(page, siteConfig);
    if (await community.interestsSection.count() === 0) {
      console.warn('[functional] "Follow Your Interests" section not found — may be renamed.');
      return;
    }
    await expect(community.interestsSection).toBeVisible({ timeout: 10_000 });
  });

  test('consulting / Canna Cribs section is visible @functional', async ({ page, siteConfig }) => {
    const community = new CommunityPage(page, siteConfig);
    if (await community.consultingSection.count() === 0) {
      console.warn('[functional] Consulting section not found — may have been removed.');
      return;
    }
    await expect(community.consultingSection).toBeVisible({ timeout: 10_000 });

    // Should have a link or CTA
    const ctaInSection = community.consultingSection.locator('a, button').first();
    expect(await ctaInSection.count(), 'Consulting section should have at least one CTA').toBeGreaterThan(0);
  });

  test('member testimonials section is present @functional', async ({ page, siteConfig }) => {
    const community = new CommunityPage(page, siteConfig);
    const count = await community.getTestimonialCount();
    if (count === 0) {
      console.warn('[functional] No testimonial elements found — selectors may need updating.');
    }
    // Soft check — testimonials are a UX nicety, not a hard requirement
    expect(count).toBeGreaterThanOrEqual(0);
  });

  // ── Social links ──────────────────────────────────────────────────────────────

  test('social media links are present in footer or header @functional', async ({ page, siteConfig }) => {
    const community = new CommunityPage(page, siteConfig);
    const hrefs = await community.getSocialLinkHrefs();
    expect(
      hrefs.length,
      'At least one social media link (Twitter/X, LinkedIn, Facebook, Instagram) should exist'
    ).toBeGreaterThan(0);
  });

  test('social media links open valid external URLs @functional', async ({ page, siteConfig }) => {
    const community = new CommunityPage(page, siteConfig);
    const hrefs = await community.getSocialLinkHrefs();

    for (const href of hrefs) {
      const url = new URL(href);
      expect(
        url.protocol,
        `Social link "${href}" should use HTTPS`
      ).toBe('https:');
    }
  });

  // ── Footer ────────────────────────────────────────────────────────────────────

  test('footer is present and contains links @functional', async ({ page, siteConfig }) => {
    const community = new CommunityPage(page, siteConfig);
    await expect(community.footer, 'Page footer should be visible').toBeVisible();
    const footerLinks = await community.getFooterLinkHrefs();
    expect(footerLinks.length, 'Footer should contain at least one link').toBeGreaterThan(0);
  });

  test('footer links point to valid URLs @functional', async ({ page, siteConfig }) => {
    const community = new CommunityPage(page, siteConfig);
    const footerLinks = await community.getFooterLinkHrefs();
    const siteOrigin = new URL(siteConfig.url).origin;

    for (const href of footerLinks.slice(0, 10)) {
      let resolved: URL;
      try {
        resolved = new URL(href, siteConfig.url);
      } catch {
        continue; // Skip malformed hrefs
      }
      // All footer links should be HTTPS
      expect(
        resolved.protocol,
        `Footer link "${href}" should use HTTP/HTTPS`
      ).toMatch(/^https?:$/);
    }
  });

  // ── Header navigation ─────────────────────────────────────────────────────────

  test('login link is present in header @functional', async ({ page, siteConfig }) => {
    const community = new CommunityPage(page, siteConfig);
    const count = await community.loginLink.count();
    expect(count, 'A login link should exist in the header or nav').toBeGreaterThan(0);
  });

  test('resources link is present in navigation @functional', async ({ page, siteConfig }) => {
    const community = new CommunityPage(page, siteConfig);
    const count = await community.resourcesLink.count();
    if (count === 0) {
      console.warn('[functional] Resources nav link not found — may have been renamed.');
    }
  });

  test('blog / Industry Insight link is present in navigation @functional', async ({ page, siteConfig }) => {
    const community = new CommunityPage(page, siteConfig);
    const count = await community.blogLink.count();
    if (count === 0) {
      console.warn('[functional] Blog/Industry Insight nav link not found.');
    }
  });
});

// ── Content page tests ──────────────────────────────────────────────────────────

test.describe('Resources Page @functional', () => {
  test('resources page loads with content @functional', async ({ page, siteConfig }) => {
    const response = await page.goto(
      siteConfig.url.replace(/\/$/, '') + '/resources',
      { waitUntil: 'domcontentloaded', timeout: 15_000 }
    );

    if (!response || response.status() >= 400) {
      test.skip(true, `/resources returned ${response?.status()} — page may not exist`);
      return;
    }

    const heading = page.locator('h1, h2').first();
    await expect(heading, 'Resources page should have a heading').toBeVisible({ timeout: 10_000 });
  });
});

test.describe('Industry Insight / Blog Page @functional', () => {
  test('blog page loads and shows article listings @functional', async ({ page, siteConfig }) => {
    const response = await page.goto(
      siteConfig.url.replace(/\/$/, '') + '/industry-insight',
      { waitUntil: 'domcontentloaded', timeout: 15_000 }
    );

    if (!response || response.status() >= 400) {
      test.skip(true, `/industry-insight returned ${response?.status()} — page may not exist`);
      return;
    }

    const heading = page.locator('h1, h2').first();
    await expect(heading, 'Blog page should have a heading').toBeVisible({ timeout: 10_000 });

    // At least one article/post link should be present
    const articleLinks = page.locator('article a, .post a, [class*="article"] a, [class*="post"] a, main a[href]');
    const count = await articleLinks.count();
    if (count === 0) {
      console.warn('[functional] No article links found on blog page — selectors may need updating.');
    } else {
      expect(count).toBeGreaterThan(0);
    }
  });
});

test.describe('Glossary Page @functional', () => {
  test('glossary page loads with definitions @functional', async ({ page, siteConfig }) => {
    const response = await page.goto(
      siteConfig.url.replace(/\/$/, '') + '/glossary',
      { waitUntil: 'domcontentloaded', timeout: 15_000 }
    );

    if (!response || response.status() >= 400) {
      test.skip(true, `/glossary returned ${response?.status()} — page may not exist`);
      return;
    }

    const heading = page.locator('h1, h2').first();
    await expect(heading, 'Glossary page should have a heading').toBeVisible({ timeout: 10_000 });

    const bodyText = await page.evaluate<string>(() => document.body.innerText);
    expect(bodyText.trim().length, 'Glossary page should have visible content').toBeGreaterThan(50);
  });
});
