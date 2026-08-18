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

//navigate to Events Tab and verify tab is loaded
await page.getByTestId('nav-events').click();
await expect(page.getByText("Upcoming Events")).toBeVisible();

//Search for an event called world and filter using location hyderabad
await page.getByPlaceholder('Search events, venues…').pressSequentially('World',{ delay: 200 });
await page.locator('select').nth(1).selectOption('Hyderabad');

//Verify the event tile is displayed and verify the details in the tile
await expect(page.getByTestId('event-card').getByText('World Tech Summit')).toBeVisible();
const eventTile = await page.getByTestId('event-card');
await expect(eventTile).toHaveCount(1);
await expect(eventTile.getByRole('link', { name: 'World Tech Summit' }))
  .toBeVisible();
const price = await eventTile.locator('.text-lg');
await expect(price).toContainText('$');
await expect(price).toHaveText('$1,500');

//Verify the seats left is greater than 0 and click on book now button
const seatcount=(await eventTile.getByText('seats left!').textContent()).split(' ')[0].trim();
console.log(seatcount);
if(seatcount>0)
{
    await page.getByTestId('book-now-btn').click();
}

//Verify confirm booking page is loaded
await expect(page).toHaveURL(/events/);
await page.getByRole('heading', { name: 'World Tech Summit' });
await expect(page.getByText('Total$')).toContainText('$1,500');
await expect(page.getByText('Hyderabad', { exact: true })).toBeVisible();

//Navigate back to event page and verify all tiles
await page.getByRole('main').getByRole('link', { name: 'Events' }).click();
await expect(page.getByTestId('event-card')).toHaveCount(3);
const allEvents= await page.getByTestId('event-card');
await expect(allEvents.nth(0).getByRole('link', { name: 'Dilli Diwali Mela' })).toBeVisible();
await expect(allEvents.nth(1).getByRole('link', { name: 'Hollywood Monsoon Night — Los Angeles' })).toBeVisible();
await expect(allEvents.nth(2).getByRole('link', { name: 'World Tech Summit' })).toBeVisible();

//Create another browser context and page and verify login is visible
const context2 = await browser.newContext();
const page2 = await context2.newPage();
await page2.goto('https://eventhub.rahulshettyacademy.com/events')

//await expect (page.getByText('Sign in to EventHub')).toBeVisible();
await expect( page2.getByPlaceholder('you@email.com')).toHaveValue('');
await expect(await page2.locator('#login-btn')).toBeVisible();
await page2.close();

});