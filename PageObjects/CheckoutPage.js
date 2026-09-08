const {expect}=require('@playwright/test');
class CheckoutPage
{
    constructor(page)
    {
        this.page=page;
        this.placeOrderButtn= page.locator('text=Place Order');
        this.thankuMsg=page.locator('.hero-primary');
        this.userEmail = page.locator('.user__name label');
        this.cvv= page.locator("//*[@class='title'][text()='CVV Code ']/following-sibling::input");
        this.nameOnCard= page.locator('//*[@class="title"][text()="Name on Card "]/following-sibling::input');
        this.country= page.locator('[placeholder*=Country]');
        this.dropdown = page.locator('.ta-results');
    }
    async fillCheckoutDetails(userEmail,cvv,userName,countrycode,country)
    {

        await expect(this.userEmail).toContainText(userEmail);
        await this.cvv.fill(cvv);
        await this.nameOnCard.fill(userName);
        await this.country.pressSequentially(countrycode, { delay: 200 });
        await this.dropdown.waitFor();
        const optionsCount = await this.dropdown.locator('button').count();
        for(let i=0;i<optionsCount;i++)
        {
        const text = await this.dropdown.locator('button').nth(i).textContent();
        if(text.trim() === country)
        {
            await this.dropdown.locator('button').nth(i).click();
            break;
        }
        }
       
    }
    async placeOrder()
    {
        await this.placeOrderButtn.click();
        await expect(this.thankuMsg).toHaveText(' Thankyou for the order. ');
    }
}
module.exports= {CheckoutPage};