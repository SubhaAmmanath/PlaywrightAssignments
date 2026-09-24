import{expect} from '@playwright/test'
class LoginPage
{
    constructor(page)
    {
        this.page=page;
        this.userName=this.page.locator('#email');
        this.pwd= this.page.locator('#password');
        this.signIn=this.page.locator('#login-btn')
        this.loginPageTitle=page.getByText('Sign in to EventHub')
    }
    async navigatoApplicationURL()
    {
       await this.page.goto('/login');
       await expect (this.loginPageTitle).toBeVisible();
    }
    async loginUsingCred(userName,pwd)
    {
        await expect(this.userName).toHaveAttribute('placeholder', 'you@email.com');
        await expect(this.pwd).toBeVisible();
        await expect(this.signIn).toBeVisible();
        await expect(this.page).toHaveURL('https://eventhub.rahulshettyacademy.com/login');
        //Login to the application
        await this.userName.fill(userName);
        await this.pwd.fill(pwd);
        
        //verify values are entered to email field
        await expect(this.userName).toHaveValue(userName);
        
        //click on signin to login to application
        await (this.signIn).isVisible();
        await (this.signIn).click();
        await this.page.waitForLoadState('networkidle');
        //verify application is loaded after user logged in
        await this.page.getByText('Browse Events').first().waitFor();
        await expect(this.page).toHaveTitle('EventHub — Discover & Book Events');    
    }
    async loginWithNewContextandCloseContext(page2,userName,pwd)
    {
        await page2.goto('/login')
        await expect (page2.getByText('Sign in to EventHub')).toBeVisible();
        await expect( page2.getByPlaceholder('you@email.com')).toHaveValue('');
        await expect(await page2.locator('#login-btn')).toBeVisible();
        await page2.close();
    }
}
module.exports={LoginPage};