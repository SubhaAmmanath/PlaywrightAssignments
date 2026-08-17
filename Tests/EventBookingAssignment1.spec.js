const { test, expect } = require('@playwright/test');
test.only('Book an event E2E automation',async ({browser})=>
{
const context = await browser.newContext();
const page = await context.newPage();
await page.goto('https://eventhub.rahulshettyacademy.com/events');
await expect (page.getByText('Sign in to EventHub')).toBeVisible();
await expect(page.locator('#email')).toHaveAttribute('placeholder', 'you@email.com');
await expect(page.locator('#password')).toBeVisible();
await expect(page.locator('#login-btn')).toBeVisible();
await expect(page).toHaveURL(/login/);
//Login to the application
await page.locator('#email').fill('test1user1@gmail.com');
await page.locator('#password').fill('Test1user1!');
await page.getByRole('button',{name:"Sign In"}).click();
//verify application is loaded after user logged in
await page.getByText('Browse Events').first().waitFor();
await expect(page).toHaveTitle('EventHub — Discover & Book Events');

await page.pause();

});