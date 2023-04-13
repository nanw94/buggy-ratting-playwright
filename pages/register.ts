import { test, expect, Page, Locator } from '@playwright/test';

export class RegisterPage {
    readonly page: Page;
    readonly login: Locator;
    readonly firstName: Locator;
    readonly lastName: Locator;
    readonly password: Locator;
    readonly confirmPassword: Locator;

    constructor(page: Page) {
        this.page = page;
        this.login = page.getByLabel('Login');
        this.firstName = page.getByLabel('First Name');
        this.lastName = page.getByLabel('Last Name');
        this.password = page.getByLabel('Password', { exact: true });
        this.confirmPassword = page.getByLabel('Confirm Password');
    }

    async goto() {
        await this.page.goto('/register ');
    }

    async register(user) {
        await this.login.fill(user.userName);
        await this.firstName.fill(user.firstName);
        await this.lastName.fill(user.lastName);
        await this.password.fill(user.password);
        await this.confirmPassword.fill(user.password);
    }
}