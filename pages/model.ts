import { test, expect, Page, Locator } from '@playwright/test';

export class ModelPage {
    readonly page: Page;
    readonly commentBox: Locator;
    readonly voteButton: Locator;
    readonly voteCount: Locator;
    readonly lastComment: Locator;

    constructor(page: Page) {
        this.page = page;
        this.commentBox = page.getByLabel('Your Comment (optional)');
        this.voteCount = page.getByRole('heading').filter({ hasText:'Votes:'});
        this.voteButton = page.getByRole('button', { name: 'Vote!' });
        this.lastComment = page.locator('tbody > tr:first-child > td:nth-child(3)');
    }

    async goto(modelId) {
        await this.page.goto(`/model/${modelId}`);
    }

    //check if the ui vote count equal to a number
    async checkVoteCount(count: number) {
        await expect(this.voteCount).toContainText(count.toString())
    }

    //get the current vote count from ui
    async getCurrentVoteCount() {
        const constString = await this.voteCount.locator('strong').innerText();
        const count = parseInt(constString);
        return count;
    }

}