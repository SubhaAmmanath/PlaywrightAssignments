const { test, expect } = require('@playwright/test');
test.only('Book an event E2E automation',async ({browser})=>
{
const context = await browser.newContext();
const page = await context.newPage();
const emailId='test1user1@gmail.com';
await page.goto('https://eventhub.rahulshettyacademy.com/events');
await expect (page.getByText('Sign in to EventHub')).toBeVisible();
await expect(page.locator('#email')).toHaveAttribute('placeholder', 'you@email.com');
await expect(page.locator('#password')).toBeVisible();
await expect(page.locator('#login-btn')).toBeVisible();
await expect(page).toHaveURL(/login/);
//Login to the application
await page.locator('#email').fill(emailId);
await page.locator('#password').fill('Test1user1!');

//verify values are entered to email field
const receivedEmail= await page.locator('#email').textContent();
expect(receivedEmail === emailId).toBeTruthy;

//click on signin to login to application
await page.getByRole('button',{name:"Sign In"}).click();

//verify application is loaded after user logged in
await page.getByText('Browse Events').first().waitFor();
await expect(page).toHaveTitle('EventHub — Discover & Book Events');
//Create another browser context and page and verify login is visible
const context2 = await browser.newContext();
const page2 = await context2.newPage();
await page2.goto('https://eventhub.rahulshettyacademy.com/events')
//await expect (page.getByText('Sign in to EventHub')).toBeVisible();
await expect( page2.getByPlaceholder('you@email.com')).toHaveValue('');
await expect(await page2.locator('#login-btn')).toBeVisible();
await page2.close();
});