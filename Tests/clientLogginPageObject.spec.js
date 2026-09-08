const {test,expect }= require('@playwright/test');
const {POManager} = require('../PageObjects/POManager.js');
//const dataset= JSON.parse(JSON.stringify(require('../Utils/TestData.json')));
const {customtests}= require('../Utils/TestData');
test("@web create order using pageobject and test data using json",async ({page})=>
{
const poManager= new POManager(page);


const loginPage= poManager.getLoginPage();
await loginPage.navigateToURLApplication1();
await loginPage.logintoClient(dataset.userName,dataset.pwd);
const dashboardPage =poManager.getDashboardPage();
await dashboardPage.searchAndAddProductToCart(dataset.itemName);
await dashboardPage.navigateToCart(dataset.itemName);

const cartPage= poManager.getCartPage();
await cartPage.clickonCheckout();

const checkoutPage= poManager.getCheckoutPage();
await checkoutPage.fillCheckoutDetails(dataset.userName,dataset.cvv,'Test User','ind','India');
await checkoutPage.placeOrder();

const orderHistory= poManager.getOrderHistoryPage();
await orderHistory.verifyOrderDetails();

});


customtests.only("@web create order using pageobject and test data using js",async ({page, testdata})=>
{
const poManager= new POManager(page);

const loginPage= poManager.getLoginPage();
await loginPage.navigateToURLApplication1();
await loginPage.logintoClient(testdata.userName,testdata.pwd);
const dashboardPage =poManager.getDashboardPage();
await dashboardPage.searchAndAddProductToCart(testdata.itemName);
await dashboardPage.navigateToCart(testdata.itemName);

const cartPage= poManager.getCartPage();
await cartPage.clickonCheckout();

const checkoutPage= poManager.getCheckoutPage();
await checkoutPage.fillCheckoutDetails(testdata.userName,testdata.cvv,'Test User','ind','India');
await checkoutPage.placeOrder();

const orderHistory= poManager.getOrderHistoryPage();
await orderHistory.verifyOrderDetails();

});