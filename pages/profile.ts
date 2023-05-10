import { test, expect, Page, Locator } from '@playwright/test';

export class ProfilePage {
    readonly page: Page;
    readonly firstName: Locator;
    readonly saveButton: Locator;
    readonly successfulIndicator: Locator

    constructor(page: Page) {
        this.page = page;
        this.firstName = page.getByLabel('First Name');
        this.saveButton = page.getByRole('button', { name: 'Save' });    
        this.successfulIndicator = page.getByText('The profile has been saved successful').first();  
    }

    async goto() {
        await this.page.goto('/profile');
    }

    async updateFirstname(name: string) {
        await this.firstName.clear();
        await this.firstName.fill(name);
    }
}
