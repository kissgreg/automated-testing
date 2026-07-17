import { Locator, Page, expect } from '@playwright/test';

export class SauceProductDetailsPage {
    private readonly page: Page;
    private readonly productName: Locator;
    private readonly backToProductsBtn: Locator;

    constructor(page: Page) {
        this.page = page;
        this.productName = page.locator('[data-test="inventory-item-name"]');
        this.backToProductsBtn = page.locator('[data-test="back-to-products"]');
    }

    public async getProductName(): Promise<string> {
        return (await this.productName.textContent())?.trim() || '';
    }

    public async verifyProductUrl(expectedId: number): Promise<void> {
        await expect(this.page).toHaveURL(new RegExp(`/inventory-item\\.html\\?id=${expectedId}`));
    }

    public async clickBackToProducts(): Promise<void> {
        await this.backToProductsBtn.click();
    }
}