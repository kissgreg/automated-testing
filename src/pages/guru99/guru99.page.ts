import { Page, Locator } from '@playwright/test';
import { BasePage } from '../base-page';

export class Guru99Page extends BasePage {
    private readonly iframeLocator: Locator;
    private readonly testingMenu: Locator;
    private readonly seleniumSubMenu: Locator;
    private readonly joinNowButton: Locator;

    constructor(page: Page) {
        super(page);
        
        // iframe
        this.iframeLocator = page.frameLocator('iframe[id="a077aa5e"]').locator('a[href*="live-selenium-project"] img');
        
        // navigation
        this.testingMenu = page.locator('ul.gf-menu li.parent > a.item').filter({ hasText: /^\s*Testing\s*$/ });
        this.seleniumSubMenu = page.locator('ul.l2 li a').filter({ hasText: /^\s*Selenium\s*$/ });
        
        //  assertion
        this.joinNowButton = page.locator('button', { hasText: 'Join Now' }).first();
    }

    public async clickIframeImage(): Promise<void> {
        await this.click(this.iframeLocator, 'Image inside the iframe');
    }

    public async navigateToSeleniumTutorials(): Promise<void> {
        await this.testingMenu.hover();
        await this.click(this.seleniumSubMenu, 'Selenium Sub-Menu Link');
    }

    public getJoinNowButtonLocator(): Locator {
        return this.joinNowButton;
    }
}