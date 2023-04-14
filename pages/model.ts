import { test, expect, Page, Locator } from '@playwright/test';

export class ModelPage {
    readonly page: Page;
    readonly votebox: Locator;
    readonly voteButton: Locator;
    readonly voteCount: Locator;

    constructor(page: Page) {
        this.page = page;
        this.votebox = page.getByLabel('Your Comment (optional)');
        this.voteCount = page.getByRole('heading').filter({ hasText:'Votes:'});
        this.voteButton = page.getByRole('button', { name: 'Vote!' });
    }

    async goto(modelId) {
        await this.page.goto(`/model/${modelId}`);
    }

    async checkVoteCount(count: number) {
        await expect(this.voteCount).toContainText(count.toString())
    }

    async getCurrentVoteCount() {
        const constString = await this.voteCount.locator('strong').innerText();
        const count = parseInt(constString);
        return count;
    }

}