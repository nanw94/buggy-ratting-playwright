import { test, expect, Page } from '@playwright/test';
import { HomePage } from '../pages/home';
import { RegisterPage } from '../pages/register';
import * as common from '../support/common';

test('register button should be visible if all the feilds are fillout', async ({ page }) => {
    const registerPage = new RegisterPage(page);
    const newUser = common.createUser();
    await registerPage.goto();
    await registerPage.register(newUser);
  });
