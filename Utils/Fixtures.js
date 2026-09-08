const base = require('@playwright/test');
const {APIUtils} = require('./ApiUtils.js');
const {request} = require('@playwright/test');

const loginPayload = { userEmail: 'test1user1@test.com', userPassword: 'Test1user1' };
const orderData = {orders:[{country:"Cuba",productOrderedId:"6960eac0c941646b7a8b3e68"}]};
let response;

exports.customtest = base.test.extend({

    authenticatedPage: async ({ browser }, use) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto('https://rahulshettyacademy.com/client/#/auth/login');
    await page.getByPlaceholder('email@example.com').fill('test1user1@test.com');
    await page.getByPlaceholder('enter your passsword') .fill('Test1user1');
    await page.getByText('Login').click();
    await page.waitForLoadState('networkidle'); 
    await use(page);  
    await context.close();
    },
   createOrder: async({},use) => {
  const apiContext = await request.newContext();
    const apiUtils = new APIUtils(apiContext, loginPayload);
    response = await apiUtils.createOrder(orderData);
     await use(response);
     await apiContext.dispose();
    },
    testDataforOrder:
    {
        productName: 'Adidas original',
    }
   
})
