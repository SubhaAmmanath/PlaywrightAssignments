Feature: Ecommerce Application
@validation
Scenario Outline: Place an order for a product
Given the user login to Application2 using "<username>" and "<password>"
Then Verify error message is displayed for invalid login credentials
Examples:
| username | password |
| rahulshettyacademy | Learning@830$3mK2 |
| rahulshetty | Learning |