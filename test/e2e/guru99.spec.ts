import { test, expect } from '@playwright/test';
import { Guru99Page } from '../../src/pages/guru99/guru99.page';
import { ConfigManager } from '../../src/config/config-manager';

test.describe('Guru99 Home & Tutorial', () => {
    test('Case 4 - iFrame and tab handling', async ({ page, context }) => {
        const homePage = new Guru99Page(page);

        // Step 1: Open URL
        await test.step('Navigate to Guru99 Home page', async () => {
            await page.goto(ConfigManager.getGuru99Url(), { waitUntil: 'domcontentloaded' });
        });

        // Step 2: Click image in iframe
        let newPage: any;
        await test.step('Click image in iFrame', async () => {
            [newPage] = await Promise.all([
                context.waitForEvent('page'),
                homePage.clickIframeImage()
            ]);
            await newPage.waitForLoadState('domcontentloaded');
        });

        // Step 3: Verify page is loaded in a new tab, verify tab title
        await test.step('Verify page is loaded in a new tab', async () => {
            expect(context.pages().length).toBe(2);
            const tabTitle = await newPage.title();
            // Mismatching tab title or Cloudflare challenge can be handled and the test flow can continue
            expect.soft(tabTitle).toContain('Selenium Live Project: FREE Real Time Project for Practice');
        });

        // Step 4: Close tab and return to main page
        await test.step('Close new tab', async () => {
            await newPage.close();
            await page.bringToFront();
        });

        // Step 5: Hover on 'Testing' menu and navigate to Selenium Tutorial
        await test.step('Hover on Testing menu and navigate to Selenium Tutorial', async () => {
            await homePage.navigateToSeleniumTutorials();
        });

        // Step 6: Verify the 'Join Now' button
        await test.step('Verify the \'Join Now\' button is displayed', async () => {
            const buttonLocator = homePage.getJoinNowButtonLocator();
            await expect(buttonLocator).toBeVisible();
        });
    });
});
