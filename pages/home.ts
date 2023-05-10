import { test, expect, Page, Locator } from '@playwright/test';

export class HomePage {
    readonly page: Page;
    readonly registerButton: Locator;
    readonly signInButton: Locator;
    readonly loginButton: Locator;
    readonly signInBox: Locator;
    readonly passwordBox: Locator;
    readonly profileLink: Locator;
    readonly logoutLink: Locator;

    constructor(page: Page) {
        this.page = page;
        this.registerButton = page.getByRole('link', { name: 'Register' });
        this.signInBox = page.getByPlaceholder('Login');
        this.passwordBox = page.locator('input[name="password"]');
        this.loginButton = page.getByRole('button', { name: 'Login' });
        this.profileLink = page.getByRole('link', { name: 'Profile' });
        this.logoutLink = page.getByRole('link', { name: 'Logout' });
    }

    async goto() {
        await this.page.goto('');
    }

    async login(username: string, password: string) {
        await this.signInBox.fill(username);
        await this.passwordBox.fill(password);
        await this.loginButton.click();
    }
}
