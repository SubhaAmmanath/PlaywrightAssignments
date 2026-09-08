const {expect}=require('@playwright/test');
class OrderHistory {
    constructor(page) {
        this.page = page;
        this.orderId = page.locator('.em-spacer-1 .ng-star-inserted')
        this.tableBody=page.locator('tbody');
        this.orderList = page.locator('tbody tr');
        this.myOrder= page.locator('button[routerlink*="myorders"]');
        this.tablecolumn=page.locator('.col-text');
    }
    async verifyOrderDetails() {

        const orderText = (await this.orderId.textContent()).split('|')[1].trim();
        await console.log(orderText);

        await this.myOrder.click();
        await this.tableBody.waitFor();
        
        const cnt = await this.orderList.count();
        for (let i = 0; i < cnt; i++) {
            const orderIdText = await this.orderList.nth(i).locator('th').textContent();
            if (orderIdText.trim() === orderText) {
                await this.orderList.nth(i).locator('button:has-text("View")').click();
                console.log('clicked');
                break;

            }
            console.log('Order Id not found');
        }
        await expect(this.tablecolumn).toHaveText(orderText);

    }
}

module.exports = { OrderHistory };