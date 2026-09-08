const {expect}=require('@playwright/test');
class CartPage
{
    constructor(page)
    {
        this.page=page;
        this.bool = page.locator('h3:has-text("ZARA COAT 3")');
        this.checkout= page.locator('text=Checkout');
    }
    async clickonCheckout()
    {
        const boolFlag = await this.bool.isVisible();
        expect(boolFlag).toBeTruthy();
        await this.checkout.click();
    }

}
module.exports= {CartPage};