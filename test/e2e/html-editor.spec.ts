import { test, expect } from '@playwright/test';
import { HtmlEditorPage } from '../../src/pages/html-editor/html-editor.page';
import { ConfigManager } from '../../src/config/config-manager';

test.describe('Rich Text Editor', () => {
    test('Case 3 - Validate rich text formatting', async ({ page }) => {
        const editorPage = new HtmlEditorPage(page);

        // Step 1: Open URL
        await test.step('Navigate to Online HTML Editor page', async () => {
            await page.goto(ConfigManager.getHtmlEditorUrl());
        });

        // Prepare the editor
        await test.step('Clear default content from the editor', async () => {
            await editorPage.clearEditor();
        });

        // Steps 2-4: Type text with bold and underline formatting
        await test.step('Type text with bold and underline formatting', async () => {
            await editorPage.typeFormattedText();
        });

        // Step 5: Validate the text is appearing with correct formatting tags
        await test.step('Assert DOM structure contains correct formatting tags (<b>/<strong> and <u>)', async () => {
            const htmlContent = await editorPage.getEditorInnerHtml();
            expect(htmlContent).toContain('<strong>Automation</strong>');
            expect(htmlContent).toContain('<u>Test</u>');
            expect(htmlContent).toContain('Example');
        });
    });
});