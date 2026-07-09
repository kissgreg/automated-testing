import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from '../base-page';

export class SauceInventoryPage extends BasePage {
    private readonly cartIcon: Locator;
    private readonly cartBadge: Locator;
    private readonly footer: Locator;

    constructor(page: Page) {
        super(page);
        this.cartIcon = page.locator('.shopping_cart_link');
        this.cartBadge = page.locator('.shopping_cart_badge');
        this.footer = page.locator('[data-test="footer-copy"]');
    }

    public async addItemToCart(itemName: string): Promise<void> {
        // Formats "Sauce Labs Backpack" into "add-to-cart-sauce-labs-backpack"
        const formattedTestId = `add-to-cart-${itemName.toLowerCase().replace(/ /g, '-')}`;
        const itemButton = this.page.locator(`[data-test="${formattedTestId}"]`);
        await this.click(itemButton, `Add to Cart Button for: ${itemName}`);
    }

    public async getCartBadgeCount(): Promise<string> {
        await this.cartBadge.waitFor({ state: 'visible' });
        return this.cartBadge.innerText();
    }

    public async goToCart(): Promise<void> {
        await this.click(this.cartIcon, 'Shopping Cart Icon');
    }

    public async scrollToFooter(): Promise<void> {
        await this.footer.scrollIntoViewIfNeeded();
        await expect(this.footer).toBeVisible();
    }

    public async getFooterText(): Promise<string> {
        await this.footer.waitFor({ state: 'visible' });
        return this.footer.innerText();
    }
}