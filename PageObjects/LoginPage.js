
class LoginPage
{
    constructor(page) 
    {
    this.page=page;
    this.userName = page.locator('#userEmail');
    this.pwd = page.locator('#userPassword');
    this.signIn= page.locator('#login');
    }
    async logintoClient(username,pwd)
    {
        await this.userName.fill(username);
        await this.pwd.fill(pwd);
        await this.signIn.click();
        await this.page.waitForLoadState('networkidle');
    }
    async navigateToURLApplication1()
    {
        await this.page.goto('https://rahulshettyacademy.com/client/#/auth/login');
    }
}
module.exports={LoginPage};