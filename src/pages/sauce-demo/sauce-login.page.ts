import { Page, Locator, test } from '@playwright/test';
import { BasePage } from '../base-page';

export class SauceLoginPage extends BasePage {
    private readonly usernameInput: Locator;
    private readonly passwordInput: Locator;
    private readonly loginButton: Locator;
    private readonly errorContainer: Locator;

    constructor(page: Page) {
        super(page);
        this.usernameInput = page.locator('[data-test="username"]');
        this.passwordInput = page.locator('[data-test="password"]');
        this.loginButton = page.locator('[data-test="login-button"]');
        this.errorContainer = page.locator('[data-test="error"]');
    }

    public async login(user: string, pass: string): Promise<void> {
        await test.step(`Login workflow for user: "${user}"`, async () => {
            await this.type(this.usernameInput, user, 'Username Input Field');
            await this.type(this.passwordInput, pass, 'Password Input Field', true);
            await this.click(this.loginButton, 'Submit Login Button');
            
            // Overriding default timeout to "fail fast" if login doesn't work
            await this.page.waitForURL('**/inventory.html', { timeout: 7000 });
        });
    }

    public async clickLoginButton(): Promise<void> {
        await this.click(this.loginButton, 'Submit Login Button');
    }

    public async getErrorMessage(): Promise<string> {
        await this.errorContainer.waitFor({ state: 'visible' });
        return this.errorContainer.innerText();
    }
}