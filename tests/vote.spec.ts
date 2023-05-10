import { test, expect } from '@playwright/test';
import * as common from '../support/common';
import { ModelPage } from '../pages/model';

let user: { userName: string; password: string; firstName: string; comment: string; lastName?: string; };

test.describe('vote and comment on a model page', ()=>{
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

    test('user should be able to vote and comment', async ({ page }) => {
        const modelPage = new ModelPage(page); 
        let currentCount;

        await test.step('get to the detail page of a random model', async () => {
        const modelId = await common.getRandomModelId(); 
        //get the vote count from backend before voting.
        currentCount = await common.getModelVoteCount(modelId);     
        await modelPage.goto(modelId);
        await expect(modelPage.voteCount).toBeVisible();
        await expect(modelPage.commentBox).toBeVisible(); 
        await expect(modelPage.voteButton).toBeVisible();            
        })        

        await test.step('user votes and add comment to the model',async () => {
        //vote the current model
        await modelPage.commentBox.fill(user.comment);
        await modelPage.voteButton.click();
        })

        await test.step('validate the ui change',async () => {
        //check the vote count gets increased by 1.
        await modelPage.checkVoteCount(currentCount+1);
        //check the text shows up
        await expect(page.getByText('Thank you for your vote!')).toBeVisible();
        //check the vote button is invisible after voting.
        await expect(modelPage.voteButton).toBeHidden();
        //check comment shows up as the last comment in the list.
        await expect(modelPage.lastComment).toHaveText(user.comment);            
        })      
        
    });

    test('user is not able to double vote',async ({ page }) => {        
        //randomly pick up a model from the list
        const modelId = await common.getRandomModelId();
        const comment = 'this was voted by api';
        const modelPage = new ModelPage(page); 
        
        await test.step('prepare test data - model alread voted', async () => {
        //vote the model in the backend.
        common.vote(user,modelId,comment);            
        })
        
        await test.step('load the page of the voted model', async () => {
            await modelPage.goto(modelId);
            await modelPage.getCurrentVoteCount();                
        })

        await test.step('validate the elements for voting are invisible',async () => {
            //check all the elements for vote is invisible
            await expect(modelPage.commentBox).toBeHidden(); 
            await expect(modelPage.commentBox).toBeHidden(); 
            await expect(modelPage.voteButton).toBeHidden();
            //the comment should be the one added from backend.
            await expect(modelPage.lastComment).toHaveText(comment);            
        })  
                
    })

})




