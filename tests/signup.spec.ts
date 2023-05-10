import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/home';
import { RegisterPage } from '../pages/register';
import * as common from '../support/common';

let user: { userName: string; password: string; firstName: string; comment: string; lastName: string; };

test('should be able to signup for a new user',async ({ page }) => {
    const homePage = new HomePage(page);
    const registerPage = new RegisterPage(page);
    await test.step('generate a new user object',async () => {
        user = common.createUser();               
    })

    await test.step('go to the register page from home page',async () => {
        await homePage.goto();
        await expect(homePage.registerButton).toBeVisible();
        await homePage.registerButton.click();        
    })

    await test.step('sign up the user in the register page', async () => {
        await registerPage.register(user);
        await registerPage.registerButton.click();
        await expect(page.getByText(`Registration is successful`)).toBeVisible();        
    })    
})