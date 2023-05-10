import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/home';
import { ProfilePage } from '../pages/profile';
import * as common from '../support/common';
import { faker } from '@faker-js/faker';

let user: { userName: string; password: string; firstName: string; comment: string; lastName: string; };

test.beforeAll(async () => {
    //generate a new user
    user = common.createUser(); 
    await common.signUp(user)     
})

test.beforeEach(async ({ page }) => {
    const token = await common.getToken(user.userName, user.password);
    await page.addInitScript({      
        content: `localStorage.setItem('token', '${token}');`      
    })    
})

test('should be able to update the first name',async ({ page }) => {
    const homePage = new HomePage(page);
    const profilePage = new ProfilePage(page);
    let newName = await faker.name.firstName();

    await test.step('go to the profile page from home page',async () => {
        await homePage.goto();
        await expect(homePage.profileLink).toBeVisible();
        await homePage.profileLink.click();
        await expect(page.url()).toContain('profile');       
    })

    await test.step('update the first name', async () => {
        await profilePage.updateFirstname(newName);
        await profilePage.saveButton.click();
        await expect(profilePage.successfulIndicator).toBeVisible();        
    })
    
    await test.step('login again and validate first name gets updated',async () => {
        homePage.logoutLink.click();
        homePage.login(user.userName, user.password);
        await expect(page.getByText(`Hi, ${newName}`)).toBeVisible();          
    })
})