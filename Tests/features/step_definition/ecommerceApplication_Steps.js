
const { Given, When, Then} = require('@cucumber/cucumber');
const{expect} = require('@playwright/test');
const { chromium } = require('playwright');
const {POManager} = require('../../../PageObjects/POManager.js');

Given('the user login to Application1 using {string} and {string}',{timeout: 10000}, async function (userName, password) {
   
    const loginPage = this.poManager.getLoginPage();
    await loginPage.navigateToURLApplication1();
    await loginPage.logintoClient(userName, password);
});

When('the user searches for a product {string} and add it to the cart',{timeout: 10000}, async function (productName) {
    const dashboardPage = this.poManager.getDashboardPage();
    await dashboardPage.searchAndAddProductToCart(productName);
    await dashboardPage.navigateToCart(productName);
});


Then('verify user should be navigated to checkout page', {timeout: 100*1000},async function () {
    const cartPage = this.poManager.getCartPage();
    await cartPage.clickonCheckout();
});

When('user enter valid shipping details like Email {string}, code {string}, State {string} and place order',{timeout: 10000},async function (name, code, state) {
    const checkoutPage = this.poManager.getCheckoutPage();
    await checkoutPage.fillCheckoutDetails(name, '123', 'Test User', code, state);
    await checkoutPage.placeOrder();
});

Then('verify order confirmation message should be displayed', {timeout: 10000}, async function () {
    const orderHistory = this.poManager.getOrderHistoryPage();
    await orderHistory.verifyOrderDetails();
});

Given('the user login to Application2 using {string} and {string}', async function (username, password) {
  await this.page.goto('https://rahulshettyacademy.com/loginpagePractise/');
console.log(await this.page.title());
await this.page.locator('#username').fill(username);
await this.page.locator('[name="password"]').fill(password);
await this.page.locator('#signInBtn').click();
});

Then('Verify error message is displayed for invalid login credentials', async function () {
   await (expect (this.page.locator("[style*='block']))).toContainText('Incorrect username/password.")));

});
