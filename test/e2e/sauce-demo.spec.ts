import { test, expect } from '@playwright/test';
import { SauceLoginPage } from '../../src/pages/sauce-demo/sauce-login.page';
import { SauceInventoryPage } from '../../src/pages/sauce-demo/sauce-inventory.page';
import { SauceCheckoutPage } from '../../src/pages/sauce-demo/sauce-checkout.page';
import { SauceProductDetailsPage } from '../../src/pages/sauce-demo/sauce-product-details.page';
import { ConfigManager } from '../../src/config/config-manager';

test.describe('Swag Labs online store', () => {
 
    test.beforeEach(async ({ page }) => {
        // NOTE: Requirement specifies /inventory.html, calling this route
        // unauthenticated triggers a UI-level error message
        await test.step('Navigate to SauceDemo / Swag Labs login page', async () => {
            await page.goto(ConfigManager.getSauceDemoUrl());
        });
    });

    test('Case 1 - Automate Purchase Process', async ({ page }) => {
        const loginPage = new SauceLoginPage(page);
        const inventoryPage = new SauceInventoryPage(page);
        const checkoutPage = new SauceCheckoutPage(page);

        // Step 3: Parse credentials
        const credentials = ConfigManager.getCredentials();
        
        // Step 4: Login
        await test.step('Login', async () => {
            loginPage.login(credentials.username, credentials.password);
        });

        // Step 5: Add items to cart
        const itemsToBuy = ['Sauce Labs Backpack', 'Sauce Labs Fleece Jacket'];
        await test.step('Add items to cart', async () => {
            for (const item of itemsToBuy) {
                await inventoryPage.addItemToCart(item);
            }
        });

        // Step 6: Validate the number on the cart symbol
        await test.step('Validate item count on cart symbol', async () => {
            const expectedCount = itemsToBuy.length.toString();
            const actualCount = await inventoryPage.getCartBadgeCount();
            await test.step(`Expected value: "${expectedCount}", actual value: "${actualCount}"`, async () => {
                expect(actualCount).toBe(expectedCount);
            });
        });

        // Step 7: Checkout
        await test.step('Go through the checkout process', async () => {
            await inventoryPage.goToCart();
            // NOTE: Replacing hardcoded strings with dynamically generated synthetic test data
            // using '@faker-js/faker' would ensure boundary value coverage (e.g., varying name lengths,
            // special characters) and prevent data collision.
            await checkoutPage.checkout('John', 'Doe', '54321');
        });

        // Step 8: Validate 'Thank you for your order!' message
        await test.step('Validate transaction is completed', async () => {
            const expectedMessage = 'Thank you for your order!';
            const actualMessage = await checkoutPage.getFinalMessage();

            await test.step(`Validate final message, expected value: \'${expectedMessage}\', actual value: \'${actualMessage}\'`, async () => {
                expect(actualMessage).toBe(expectedMessage);
            });
        });
    });

    test('Case 2 - Verify error messages for mandatory fields', async ({ page }) => {
        const loginPage = new SauceLoginPage(page);
        const inventoryPage = new SauceInventoryPage(page);

        // Step 2: Click on login button
        await test.step('Click on login button without providing credentials', async () => {
            await loginPage.clickLoginButton();
        });

        // Step 3: Validate the error message
        await test.step('Validate error message for empty mandatory fields', async () => {
            const errorMessage = await loginPage.getErrorMessage();
            expect(errorMessage).toContain('Username is required');
        });

        // Step 4: Login with standard user
        await test.step('Login', async () => {
            loginPage.login('standard_user', 'secret_sauce');
        });

        // Step 5: Scroll down to the bottom of the page
        await test.step('Scroll down to the bottom of the page', async () => {
            await inventoryPage.scrollToFooter();
        });
        
        // Step 6: Validate footer message contents
        // NOTE: Validation of a hardcoded year value can create
        // brittle tests. Using RegEx matching would make the assertion
        // future-proof if the test specification allows it. Example:
        // expect(footerText).toMatch(/20\d{2}/);
        const expectedFooterContentYear = '2023';
        const expectedFooterContentLegal = 'Terms of Service';
        await test.step(`Validate footer message contents: \'${expectedFooterContentYear}\', \'${expectedFooterContentLegal}\'`, async () => {
            const footerText = await inventoryPage.getFooterText();
            expect(footerText).toContain(expectedFooterContentYear);
            expect(footerText).toContain(expectedFooterContentLegal);
        });
    });

    test('Case 3 - Navigate to product details and return to inventory', async ({ page }) => {
        const loginPage = new SauceLoginPage(page);
        const inventoryPage = new SauceInventoryPage(page);
        const productDetailsPage = new SauceProductDetailsPage(page);

        const targetProductName = 'Sauce Labs Bolt T-Shirt';
        const targetProductId = 1;

        // Step 1: Login
        await test.step('Login with standard user', async () => {
            await page.goto('https://www.saucedemo.com/');
            const credentials = ConfigManager.getCredentials(); 
            await loginPage.login(credentials.username, credentials.password);
            await inventoryPage.verifyInventoryUrl();
        });

        // Step 2: Navigate to Product Details
        await test.step(`Click on product: "${targetProductName}"`, async () => {
            await inventoryPage.clickProductByName(targetProductName);
            await productDetailsPage.verifyProductUrl(targetProductId);
        });

        // Step 3: Validate Details Page Content
        await test.step('Verify product details page content', async () => {
            const displayedName = await productDetailsPage.getProductName();
            expect(displayedName).toBe(targetProductName);
        });

        // Step 4: Click Back to Products
        await test.step('Click "Back to products" and verify return to inventory', async () => {
            await productDetailsPage.clickBackToProducts();
            await inventoryPage.verifyInventoryUrl();
        });
    });
});