const {LoginPage} = require('./LoginPage.js');
const {DashboardPage} = require('./DashboardPage.js');
const {CartPage} = require('./CartPage.js');
const {CheckoutPage} = require('./CheckoutPage.js');
const {OrderHistory} = require('./OrderHistory.js');
class POManager
{
    constructor(page)
    {
        this.page=page;
        this.loginPage = new LoginPage(this.page);
        this.dashboardPage = new DashboardPage(this.page);
        this.cartPage = new CartPage(this.page);
        this.checkoutPage= new CheckoutPage(this.page);
        this.orderHistory= new OrderHistory(this.page);
    }
getLoginPage()
{
    return this.loginPage;
}
getDashboardPage()
{
    return this.dashboardPage;
}
getCartPage()
{
    return this.cartPage;
}
getCheckoutPage()
{
    return this.checkoutPage;
}
    

getOrderHistoryPage()
{
    return this.orderHistory;
}
}
module.exports= {POManager};