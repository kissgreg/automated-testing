import { Page, Locator } from '@playwright/test';
import { BasePage } from '../base-page';

export class HtmlEditorPage extends BasePage {
    private readonly editorBody: Locator;

    constructor(page: Page) {
        super(page);
        this.editorBody = page.locator('.ck-editor__editable[contenteditable="true"]');
    }

    public async clearEditor(): Promise<void> {
        await this.click(this.editorBody, 'Rich Text Editor Body');
        // Select all text and delete it to start with a clean slate
        await this.page.keyboard.press('Control+A');
        await this.page.keyboard.press('Backspace');
    }

    public async typeFormattedText(): Promise<void> {
        await this.click(this.editorBody, 'Rich Text Editor Body');

        await this.page.keyboard.press('Control+B'); // bold on
        await this.page.keyboard.type('Automation');
        await this.page.keyboard.press('Control+B'); // bold off
        await this.page.keyboard.type(' ');

        await this.page.keyboard.press('Control+U'); // underline on
        await this.page.keyboard.type('Test');
        await this.page.keyboard.press('Control+U'); // underline off

        await this.page.keyboard.type(' Example');
    }

    public async getEditorInnerHtml(): Promise<string> {
        return await this.editorBody.innerHTML();
    }
}