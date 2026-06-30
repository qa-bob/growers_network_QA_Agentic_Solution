/**
 * src/fixtures/site.fixture.ts
 *
 * Extends Playwright's base `test` with pre-constructed page objects and the
 * loaded site config.  All test files should import {test, expect} from here
 * instead of from '@playwright/test' directly.
 *
 * Usage in test files:
 *   import { test, expect } from '@fixtures/site.fixture';
 */

import { test as base, expect } from '@playwright/test';
import { loadSiteConfig, type SiteConfig } from '@app-types/site-config.types';
import { HomePage } from '@pages/home.page';
import { NavigationPage } from '@pages/navigation.page';
import { ContactFormPage } from '@pages/contact.page';
import { CommunityPage } from '@pages/community.page';
import { ResourcesPage } from '@pages/resources.page';
import { IndustryInsightPage } from '@pages/industry-insight.page';

// ── Fixture type definitions ─────────────────────────────────────────────────

export interface Fixtures {
  /** Fully resolved site configuration loaded from site.config.json */
  siteConfig: SiteConfig;
  /** Pre-navigated HomePage page object */
  homePage: HomePage;
  /** NavigationPage page object (does not auto-navigate) */
  navigationPage: NavigationPage;
  /** ContactFormPage page object (does not auto-navigate) */
  contactPage: ContactFormPage;
  /** CommunityPage — Growers Network specific sections (does not auto-navigate) */
  communityPage: CommunityPage;
  /** ResourcesPage — /resources page object (does not auto-navigate) */
  resourcesPage: ResourcesPage;
  /** IndustryInsightPage — /industry-insight page object (does not auto-navigate) */
  industryInsightPage: IndustryInsightPage;
}

// ── Extended test object ─────────────────────────────────────────────────────

export const test = base.extend<Fixtures>({
  /**
   * siteConfig — loaded once per worker from site.config.json.
   * Shared across all fixtures in the same test.
   */
  siteConfig: async ({}, use) => {
    const config = loadSiteConfig();
    await use(config);
  },

  /**
   * homePage — constructs HomePage and navigates to the site root.
   * Waits for domcontentloaded before handing control to the test.
   */
  homePage: async ({ page, siteConfig }, use) => {
    const homePage = new HomePage(page, siteConfig);
    await homePage.navigate();
    await use(homePage);
  },

  /**
   * navigationPage — constructs NavigationPage without navigating.
   * Tests that need to be on a specific page should call navigate() themselves.
   */
  navigationPage: async ({ page, siteConfig }, use) => {
    const navigationPage = new NavigationPage(page, siteConfig);
    await use(navigationPage);
  },

  /**
   * contactPage — constructs ContactFormPage without navigating.
   * Tests should navigate to the appropriate page first.
   */
  contactPage: async ({ page, siteConfig }, use) => {
    const contactPage = new ContactFormPage(page, siteConfig);
    await use(contactPage);
  },

  /**
   * communityPage — Growers Network-specific page object for homepage sections.
   * Does not auto-navigate; tests call navigate() or page.goto() themselves.
   */
  communityPage: async ({ page, siteConfig }, use) => {
    const communityPage = new CommunityPage(page, siteConfig);
    await use(communityPage);
  },

  /**
   * resourcesPage — Page object for the /resources page.
   * Does not auto-navigate; call resourcesPage.navigateToResources() in tests.
   */
  resourcesPage: async ({ page, siteConfig }, use) => {
    const resourcesPage = new ResourcesPage(page, siteConfig);
    await use(resourcesPage);
  },

  /**
   * industryInsightPage — Page object for the /industry-insight (blog) page.
   * Does not auto-navigate; call industryInsightPage.navigateToIndustryInsight() in tests.
   */
  industryInsightPage: async ({ page, siteConfig }, use) => {
    const industryInsightPage = new IndustryInsightPage(page, siteConfig);
    await use(industryInsightPage);
  },
});

// Re-export expect so tests only need one import source
export { expect };
