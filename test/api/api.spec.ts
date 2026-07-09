import { test, expect } from '@playwright/test';
import { ConfigManager } from '../../src/config/config-manager';

test.describe('JSONPlaceholder REST API', () => {

    test('Case 5 - Validate response of endpoint \'/users\'', async ({ request }, testInfo) => {
        const endpoint = new URL('/users', ConfigManager.getApiUrl()).toString();
        let responseJson: any;

        // Step 2: Send GET request
        await test.step(`Send GET request to \'${endpoint}\' and parse response`, async () => {
            const response = await request.get(endpoint);
            expect(response.status()).toBe(200);
            expect(response.ok()).toBeTruthy();
            
            // Step 3: Parse response to JSON
            responseJson = await response.json();
            expect(Array.isArray(responseJson)).toBe(true);
        });

        // Step 4: Log values of name and email fields
        await test.step('Extract and log user metrics (name | email)', async () => {
            let reportRows = ['name | email', '-----------------------------------------------'];

            for (const user of responseJson) {
                // Type assertion ensures safe access of properties
                const typedUser = user as { name: string; email: string };
                reportRows.push(`${typedUser.name} | ${typedUser.email}`);
            }

            const finalReport = reportRows.join('\n');

            await testInfo.attach('Extracted user data', {
                body: finalReport,
                contentType: 'text/plain'
            });

        });

        // Step 5: Verify the first email address contains @
        await test.step('Verify the first user\'s email address contains the \'@\' character', async () => {
            const firstEmailAddress = responseJson[0].email;
            expect(firstEmailAddress).toBeDefined();
            expect(firstEmailAddress).toContain('@');
        });
    });
});