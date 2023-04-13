import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/home';
import { RegisterPage } from '../pages/register';
import * as common from '../support/common';

test.beforeEach(async ({ page }) => {
  const homePage = new HomePage(page);
  await homePage.goto();
});

test('has title', async ({ page }) => {
  await expect(page).toHaveTitle(/Buggy Cars Rating/);
});

// test('get started link', async ({ page }) => {
//   // await page.goto('');

//   // Click the get started link.
//   await page.getByRole('link', { name: 'Register' }).click();

//   // Expects the URL to contain intro.
//   await expect(page).toHaveURL(/.*register/);
// });

test('should block voting without loin', async ({ page }) => {
  const homePage = new HomePage(page);

  // Click the register button link.
  await homePage.register();
  const heading = await page.getByText('Register with Buggy Cars Rating')
  await expect(heading).toBeVisible();
  
});

test('register button should be visible if all the feilds are fillout', async ({ page }) => {
  const registerPage = new RegisterPage(page);
  const newUser = await common.createUser();
  registerPage.goto();
  registerPage.register(newUser);
});
