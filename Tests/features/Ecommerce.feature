Feature: Ecommerce Application
@regression
Scenario: Place an order for a product
Given the user login to Application1 using "test1user1@test.com" and "Test1user1"
When the user searches for a product "Zara coat 3" and add it to the cart
Then verify user should be navigated to checkout page
When user enter valid shipping details like Email "test1user1@test.com", code "ind", State "India" and place order
Then verify order confirmation message should be displayed