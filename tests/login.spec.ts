import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/home';
import * as common from '../support/common';

const defaultUser = {
    username: 'nathanw1204',
    password: 'Password1!',
    firstName: 'Nathan'
}

test.describe('login and logout',()=>{
    test('user should be able to login', async({page})=>{
        const homePage = new HomePage(page);
        await test.step(`login default user in home page`, async () => {
            await page.goto('/');
            await homePage.login(defaultUser.username, defaultUser.password);
        })

        await test.step('validate ui details after login',async () => {
            await expect(homePage.profileLink).toBeVisible();
            await expect(homePage.logoutLink).toBeVisible();
            await expect(page.getByText(`Hi, ${defaultUser.firstName}`)).toBeVisible();            
        }) 
    })

    test('user should be able to logout', async ({ page }) => {
        const homePage = new HomePage(page);
        await test.step('prepare login state',async () => {
            const token = await common.getToken(defaultUser.username, defaultUser.password);
            await page.addInitScript({      
                content: `localStorage.setItem('token', '${token}');`
            })        
        })

        await test.step('logout the default user', async () => {
            await homePage.goto();
            await expect(homePage.logoutLink).toBeVisible();
            await homePage.logoutLink.click();            
        })

        await test.step('validate ui details after logout',async () => {
            await expect(homePage.loginButton).toBeEnabled();
            await expect(homePage.profileLink).toBeHidden();
            await expect(homePage.logoutLink).toBeHidden();
            await expect(homePage.registerButton).toBeVisible();
            await expect(page.getByText(`Hi, ${defaultUser.firstName}`)).toBeHidden();            
        })       
    })
})