import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/home';
import { RegisterPage } from '../pages/register';
import * as common from '../support/common';
import { ModelPage } from '../pages/model';

let user;

test.describe('tests that require login', ()=>{

    test.beforeAll(async () => {
        //sign up a brand new user
        user = common.createUser();
        await common.signUp(user);
    })

    test.beforeEach(async ({ page }) => {
        const token = await common.getToken(user.userName, user.password);
        await page.addInitScript({      
            content: `localStorage.setItem('token', '${token}');`      
        })
    });

    test('User Name should be visible after login',async ({ page }) => {
        await page.goto('');
        await expect(page.getByText(`Hi, ${user.firstName}`)).toBeVisible();
    });

    test('in progress user should be able to vote and comment',async ({ page }) =>{
        const modelId = await common.getRandomModelId();
        const modelPage = new ModelPage(page); 
        await modelPage.goto(modelId);
        await expect(modelPage.voteButton).toBeVisible();
    });

    test('user should be able to vote and comment', async ({page})=>{
        const modelPage = new ModelPage(page); 
        const modelId = await common.getRandomModelId();       
        await modelPage.goto(modelId);
        await expect(modelPage.voteCount).toBeVisible();
        await expect(modelPage.votebox).toBeVisible(); 
        await expect(modelPage.voteButton).toBeVisible();
        const currentCount = await modelPage.getCurrentVoteCount();
        await modelPage.votebox.fill(user.comment);
        await modelPage.voteButton.click();
        await modelPage.checkVoteCount(currentCount+1);
        await expect(page.getByText('Thank you for your vote!')).toBeVisible();
        await expect(modelPage.voteButton).toBeHidden();
        await expect(page.locator('tbody > tr:first-child > td:nth-child(3)')).toHaveText(user.comment);
    });


})


