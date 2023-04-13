import { test, expect, Page, Locator } from '@playwright/test';

export class HomePage {
    readonly page: Page;
    readonly registerButton: Locator;
    readonly signInButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.registerButton = page.getByRole('link', { name: 'Register' })
    }

    async goto() {
        await this.page.goto('');
    }

    async register() {
        await this.registerButton.click();
    }
}
