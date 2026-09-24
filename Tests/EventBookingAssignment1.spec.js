const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../Tests/POM_Assignment/LoginPage.js')
const { EventPage } = require('../Tests/POM_Assignment/EventsPage.js')
const emailId = 'test2user2@test.com';
const pwd = 'Test2user2!'
const ticketPrice1 = '$1,500';
const ticketPrice2 = '$300';

const eventLocation = 'Hyderabad';
const eventLocation2 = 'Delhi';
const eventName = 'World Tech Summit';
const eventName1 = 'Dilli Diwali Mela';
const eventName2 = 'Hollywood Monsoon Night — Los Angeles';
const eventName3 = 'World Tech Summit';
const customerName = "Test2user2"


test('Book an event assignments 1 to 3', async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    const loginPage = new LoginPage(page);
    const eventPage = new EventPage(page);

    await loginPage.navigatoApplicationURL();
    await loginPage.loginUsingCred(emailId, pwd)

    //Create another browser context and page and verify login is visible
    // const context2 = await browser.newContext();
    // const page2 = await context2.newPage();
    // await loginPage.loginWithNewContextandCloseContext(page2,emailId,pwd);

    //Verify Browse events is showing
    await eventPage.navigateToBrowseEvents();

    //Search for an event called world and filter using location hyderabad
    await eventPage.searchForAnEventAndVerify(eventLocation, eventName, ticketPrice1);

    //Verify the seats left is greater than 0 and click on book now button
    await eventPage.checkForSeatAvailabilityandBook();

    //Verify confirm booking page is loaded
    await eventPage.checkBookingPageInfo(eventName, eventLocation, ticketPrice1)

    //Navigate back to event page and verify all tiles
    await eventPage.checkEventTileDetails(eventName1, eventName2, eventName3)
});

test('Book an event Assignment 4', async ({ browser }) => {

    const context = await browser.newContext();
    const page = await context.newPage();
    const loginPage = new LoginPage(page);
    const eventPage = new EventPage(page);

    //Login to application   
    await loginPage.navigatoApplicationURL();
    await loginPage.loginUsingCred(emailId, pwd)

    //navigate to Events Tab and verify tab is loaded
    await eventPage.navigateToBrowseEvents();

    //Search for an event called world and filter using location hyderabad
    await eventPage.searchForAnEventAndVerify(eventLocation, eventName, ticketPrice1);

    //Verify the event tile is displayed and verify the details in the tile
    await eventPage.checkForSeatAvailabilityandBook();

    //Verify the seats left is greater than 0 and click on book now button
    await eventPage.checkForSeatAvailabilityandBook();

    //Verify confirm booking page is loaded
    await eventPage.checkBookingPageInfo(eventName, eventLocation, ticketPrice1);

    //Fill customer details and click on confirm booking
    await eventPage.fillCustomerDetailsAndBook(customerName, emailId, '1', ticketPrice1);

    //Click on view my bookings and verify the booking is displayed in the list
    await eventPage.verifyBookingDetails(eventName, 1)

    //Search for another event and book tickets
    await page.getByTestId('nav-events').click();
    await expect(page.getByText("Upcoming Events")).toBeVisible();
    await eventPage.searchForAnEventAndVerify(eventLocation2, eventName1, ticketPrice2);
    await eventPage.checkForSeatAvailabilityandBook();

    //Fill customer details and click on confirm booking
    await eventPage.fillCustomerDetailsAndBook(customerName, emailId, '2', ticketPrice2);

    //Verify the booking reference is displayed and verify the details in the booking confirmation page
    await eventPage.verifyBookingDetails(eventName1, 2)

    //Verify booking details like event name, ticket count
    await eventPage.verifyBookingDetailsfromList(eventName, '1', 1)
    await eventPage.verifyBookingDetailsfromList(eventName1, '2', 0)

    //delete all booking so that rerun wont have impact
    await eventPage.navigateToMyBooking();
    await eventPage.deleteBooking();
    await eventPage.deleteBooking();

});

