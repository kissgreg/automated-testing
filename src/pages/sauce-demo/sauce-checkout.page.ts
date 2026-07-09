import { Page, Locator } from '@playwright/test';
import { BasePage } from '../base-page';

export class SauceCheckoutPage extends BasePage {
    private readonly checkoutButton: Locator;
    private readonly firstNameInput: Locator;
    private readonly lastNameInput: Locator;
    private readonly postalCodeInput: Locator;
    private readonly continueButton: Locator;
    private readonly finishButton: Locator;
    private readonly completeHeader: Locator;

    constructor(page: Page) {
        super(page);
        this.checkoutButton = page.locator('[data-test="checkout"]');
        this.firstNameInput = page.locator('[data-test="firstName"]');
        this.lastNameInput = page.locator('[data-test="lastName"]');
        this.postalCodeInput = page.locator('[data-test="postalCode"]');
        this.continueButton = page.locator('[data-test="continue"]');
        this.finishButton = page.locator('[data-test="finish"]');
        this.completeHeader = page.locator('.complete-header');
    }

    public async checkout(firstName: string, lastName: string, zipCode: string): Promise<void> {
        await this.click(this.checkoutButton, 'Initiate Checkout Button');
        
        await this.type(this.firstNameInput, firstName, 'Checkout: First Name');
        await this.type(this.lastNameInput, lastName, 'Checkout: Last Name');
        await this.type(this.postalCodeInput, zipCode, 'Checkout: Postal Code');
        
        await this.click(this.continueButton, 'Continue to Overview Button');
        await this.click(this.finishButton, 'Finish Order Button');
    }

    public async getFinalMessage(): Promise<string> {
        await this.completeHeader.waitFor({ state: 'visible' });
        return this.completeHeader.innerText();
    }
}