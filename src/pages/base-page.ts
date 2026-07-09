import { Page, Locator, test } from '@playwright/test';

export abstract class BasePage {
    protected readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    protected async navigateTo(url: string): Promise<void> {
        await test.step(`Maps to target platform URL: "${url}"`, async () => {
            await this.page.goto(url);
        });
    }

    protected async click(locator: Locator, elementDescription: string): Promise<void> {
        await test.step(`UI Interaction: Click on [${elementDescription}]`, async () => {
            // Ensure actionable state before firing event
            await locator.waitFor({ state: 'visible' });
            await locator.click();
        });
    }

    protected async type(locator: Locator, text: string, elementDescription: string, isSecret = false): Promise<void> {
        const loggedValue = isSecret ? '********' : text;
        await test.step(`UI Interaction: Type "${loggedValue}" into field [${elementDescription}]`, async () => {
            await locator.waitFor({ state: 'visible' });
            await locator.fill(text);
        });
    }

    protected async validateCondition(description: string, assertionBlock: () => Promise<void> | void): Promise<void> {
        await test.step(`Verification Step: ${description}`, async () => {
            await assertionBlock();
        });
    }
}