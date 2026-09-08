class DashboardPage
{
    constructor(page)
    {
        this.page =page;
        this.productName =page.locator('.card-body b');
        this.products= page.locator('.card-body');
        this.cartTab=page.locator('[routerlink*="cart"]');
    }
    async searchAndAddProductToCart(productName)
    {
        await  this.productName.first().waitFor();
    const titles = await  this.productName.allTextContents();
    console.log(titles);
    const count =await this.products.count();
    await console.log(count);
    for(let i=0;i< count;i++)
    {
    
    //await console.log(await this.product.locator('b').textContent());
    const productTitle = await (this.products.nth(i)).locator('b').textContent();
    if(productTitle.trim().toLowerCase() === productName.trim().toLowerCase())
    {
        await this.products.nth(i).locator('text=" Add To Cart"').click();
        break;
    
    }
    }
    }
    async navigateToCart(itemName)
    {
        await this.cartTab.click();
        await this.page.locator(`h3:has-text("${itemName.toUpperCase()}")`).waitFor();
    }
}
module.exports ={DashboardPage};