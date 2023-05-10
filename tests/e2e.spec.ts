import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/home';
import { RegisterPage } from '../pages/register';
import * as common from '../support/common';
import { ModelPage } from '../pages/model';

let user: { userName: string; password: string; firstName: string; comment: string; lastName?: string; };
const defaultUser = {
    username: 'nathanw1204',
    password: 'Password1!',
    firstName: 'Nathan'
}

test.describe('tests that do not require login',()=>{
    test.beforeEach(async ({ page })=>{
        await page.goto('/');
    });

    test('user should be able to login', async({page})=>{
        const homePage = new HomePage(page);
        await expect(homePage.registerButton).toBeVisible();
        await expect(homePage.loginButton).toBeVisible();
        await homePage.login(defaultUser.username, defaultUser.password);
        await expect(page.getByText(`Hi, ${defaultUser.firstName}`)).toBeVisible();
    })

    test('user should be able to register', async ({page}) => {
        const homePage = new HomePage(page);
        const registerPage = new RegisterPage(page);
        const user = common.createUser();
        await expect(homePage.registerButton).toBeVisible();
        await homePage.registerButton.click();
        await registerPage.register(user);
        await registerPage.registerButton.click();
        await expect(page.getByText(`Registration is successful`)).toBeVisible();
    })
})

test.describe('tests that require login', ()=>{
    //sign up a brand new user in the backend for all the tests in this group.
    test.beforeAll(async () => {        
        user = common.createUser();
        await common.signUp(user);
    })

    //set the token to the browser so the page is in login state every time.
    test.beforeEach(async ({ page }) => {
        const token = await common.getToken(user.userName, user.password);
        await page.addInitScript({      
            content: `localStorage.setItem('token', '${token}');`      
        })
    });

    test('User Name should be visible after login',async ({ page }) => {
        await page.goto('/');
        await expect(page.getByText(`Hi, ${user.firstName}`)).toBeVisible();
    });

    
    test('user should be able to vote and comment', async ({ page }) => {
        const modelPage = new ModelPage(page); 
        const modelId = await common.getRandomModelId();       
        await modelPage.goto(modelId);
        await expect(modelPage.voteCount).toBeVisible();
        await expect(modelPage.commentBox).toBeVisible(); 
        await expect(modelPage.voteButton).toBeVisible();
        //get the vote count from backend before voting.
        const currentCount = await modelPage.getCurrentVoteCount();
        await modelPage.checkVoteCount(currentCount);
        //vote the current model
        await modelPage.commentBox.fill(user.comment);
        await modelPage.voteButton.click();
        //check the vote count gets increased by 1.
        await modelPage.checkVoteCount(currentCount+1);
        //check the text shows up
        await expect(page.getByText('Thank you for your vote!')).toBeVisible();
        //check the vote button is invisible after voting.
        await expect(modelPage.voteButton).toBeHidden();
        //check comment shows up as the last comment in the list.
        await expect(modelPage.lastComment).toHaveText(user.comment);
    });

    test('over-voting should be blocked', async ({ page }) => {
        //randomly pick up a model from the list
        const modelId = await common.getRandomModelId();
        const comment = 'this was voted by api';
        //vote the model in the backend.
        common.vote(user,modelId,comment);
        //load the page
        const modelPage = new ModelPage(page); 
        await modelPage.goto(modelId);
        //check the vote count, just to ensure the page is fully loaded.
        await modelPage.getCurrentVoteCount();
        //check all the elements for vote is invisible
        await expect(modelPage.commentBox).toBeHidden(); 
        await expect(modelPage.commentBox).toBeHidden(); 
        await expect(modelPage.voteButton).toBeHidden();
        //the comment should be the one added from backend.
        await expect(modelPage.lastComment).toHaveText(comment);
    })

    test('user should be able to logout', async ({ page }) => {
        const homePage = new HomePage(page);
        await homePage.goto();
        await homePage.logoutLink.click();
        await expect(homePage.loginButton).toBeEnabled();
        await expect(page.getByText(`Hi, ${user.firstName}`)).toBeHidden();
    })
})


