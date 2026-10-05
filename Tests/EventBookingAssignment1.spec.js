const { test, expect, request } = require('@playwright/test');
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
test.skip('Create New event Assignment', async ({ page }) => {

    const emailId = 'test2user2@test.com';
    await page.goto('https://eventhub.rahulshettyacademy.com/events');
    await expect(page.getByText('Sign in to EventHub')).toBeVisible();
    await expect(page.locator('#email')).toHaveAttribute('placeholder', 'you@email.com');
    await expect(page.locator('#password')).toBeVisible();
    await expect(page.locator('#login-btn')).toBeVisible();
    await expect(page).toHaveURL(/login/);
    //Login to the application
    await page.locator('#email').fill(emailId);
    await page.locator('#password').fill('Test2user2!');



    //click on signin to login to application
    await page.getByRole('button', { name: "Sign In" }).click();

    //verify application is loaded after user logged in
    await page.getByText('Browse Events').first().waitFor();
    await expect(page).toHaveTitle('EventHub — Discover & Book Events');

    await page.getByRole('button', { name: 'Admin' }).click();
    await page.getByRole('link', { name: 'Manage Events' }).first().click();
    const eventName10 = `Test Event ${Date.now()}`;
    await page.locator('#event-title-input').fill(eventName10);
    await page.getByPlaceholder('Describe the event…').fill("Test event to verify event creation");
    await page.locator('select').selectOption('Sports');
    await page.locator('#city').fill("Chennai")
    await page.locator('#venue').fill("Pragati Maidan Exhibition Grounds, Chennai")
    await page.locator('[id="price-($)"]').fill('350');
    await page.locator('#total-seats').fill('1000');
    await page.locator('[id="event-date-&-time"]').fill('2026-10-24T21:25');
    await page.getByTestId('add-event-btn').click();
    await page.getByText('Event created!').isVisible();
    //navigate to Events Tab and verify tab is loaded
    await page.getByTestId('nav-events').click();
    await expect(page.getByText("Upcoming Events")).toBeVisible();

    //Search for an event called world and filter using location hyderabad
    await page.getByPlaceholder('Search events, venues…').pressSequentially(eventName10, { delay: 100 });
    await page.locator('select').nth(1).selectOption('Chennai');
    //Verify the event tile is displayed and verify the details in the tile
    await expect(page.getByTestId('event-card').getByText(eventName10)).toBeVisible();
    const eventTile = await page.getByTestId('event-card');
    await expect(eventTile).toHaveCount(1);
    await expect(eventTile.getByRole('link', { name: eventName10 }))
        .toBeVisible();
    const price = await eventTile.locator('.text-lg');

    await expect(price).toHaveText('$350');
    await page.pause();
    //Verify the seats left is greater than 0 and click on book now button
    const seatText = await page.getByTestId('event-card').getByText(/seats available/i).innerText();

    const seatCount = Number(seatText.split(' ')[0]);
    if (seatCount > 0) {
        await page.getByTestId('book-now-btn').click();
    }

    //Verify confirm booking page is loaded
    await expect(page).toHaveURL(/events/);
    await page.getByRole('heading', { name: eventName10 });
    await expect(page.getByText('Total$')).toContainText('$350');
    await expect(page.getByText('Chennai', { exact: true })).toBeVisible();
    //Fill customer details and click on confirm booking
    await page.locator('#customerName').fill(customerName);
    await page.locator('#customer-email').fill(emailId);
    await page.locator('#phone').fill('9876543210');
    await page.getByRole('button', { name: 'Confirm Booking' }).click();
    await expect(page.getByRole('heading', { name: 'Booking Confirmed!' })).toBeVisible();

    this.bookingRef = await page.locator("//span[text()='Booking Ref']//following-sibling::span").textContent();
    await console.log(bookingRef);
    await expect(this.bookingRef).not.toBeNull();


    //Click on view my bookings and verify the booking is displayed in the list
    await page.getByRole('button', { name: 'View My Bookings' }).click();
    await page.getByRole('button', { name: 'View Details' }).click();
    await expect(page.getByRole('heading', { name: eventName10 })).toBeVisible();
    const actualBookingRef = await page.locator('.booking-ref').textContent();
    expect(actualBookingRef).toBe(bookingRef);
    await expect(page.getByText('ticket').nth(1)).toContainText('1');

});

test('Assignment5 Replace the live EventHub events catalog with controlled mock data so filter and detail checks stay stable regardless of backend changes', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const eventPage = new EventPage(page);
    const mockEvents = [
        {
            id: 200,
            title: 'IT conference at Hyderabad',
            description: 'All Architects and Senior developers meet. It will be held in Gachibowli Hyderabad. It is a two-day event',
            category: 'Conference',
            venue: 'Gachibowli',
            city: 'Hyderabad',
            eventDate: '2026-12-21T17:00:00.000Z',
            price: '350',
            totalSeats: 10000,
            availableSeats: 9000,
            imageUrl: ''
        },
        {
            id: 201,
            title: 'Onam celebration — Delhi Malayali association',
            description: 'An event to experience Onam and rituals. Enjoy delicious local cuisine and culture',
            category: 'Festival',
            venue: 'Delhi, GSM Mall',
            city: 'Delhi',
            eventDate: '2026-11-23T19:00:00.000Z',
            price: '250',
            totalSeats: 500,
            availableSeats: 500,
            imageUrl: ''
        },
        {
            id: 202,
            title: 'Resin art workshop',
            description: 'A resin art workshop is a hands-on, beginner-friendly creative class',
            category: 'Workshop',
            venue: 'Bangalore, Function hall, road number 10',
            city: 'Bangalore',
            eventDate: '2026-10-18T09:00:00.000Z',
            price: '500',
            totalSeats: 500,
            availableSeats: 500,
            imageUrl: ''
        },
        {
            id: 203,
            title: 'Sherya Ghoshal live concert',
            description: 'Concert to mesmerize your two hours',
            category: 'Concert',
            venue: 'Mumbai, Parade Grounds',
            city: 'Mumbai',
            eventDate: '2026-10-28T20:00:00.000Z',
            price: '500',
            totalSeats: 500,
            availableSeats: 500,
            imageUrl: ''
        }
    ];
    const searchKeyword = 'IT conference';
    const filteredEvents = mockEvents.filter(event =>
        event.title.toLowerCase().includes(searchKeyword.toLowerCase()) ||
        event.description.toLowerCase().includes(searchKeyword.toLowerCase())
    );

    //routing options for different scenarios
    await page.route(/\/api\/events/, async (route) => {
        const url = route.request().url();

        // Scenario 1: Individual Event Details lookup matching specific ID for booking
        const idMatch = url.match(/\/api\/events\/(\d+)/);
        if (idMatch) {
            const targetId = parseInt(idMatch[1], 10);
            const eventDetails = mockEvents.find(item => item.id === targetId);

            return route.fulfill({
                status: 200,
                contentType: 'application/json',
                headers: { 'access-control-allow-origin': '*' },
                body: JSON.stringify({ success: true, data: eventDetails || mockEvents[0] })
            });
        }

        //search scenario
        if (url.includes('search=')) {
            return route.fulfill({
                status: 200,
                contentType: 'application/json',
                headers: { 'access-control-allow-origin': '*' },
                body: JSON.stringify({ success: true, data: filteredEvents })
            });
        }

        // Scenario 3:mock data loading when user click on browse events
        return route.fulfill({
            status: 200,
            contentType: 'application/json',
            headers: { 'access-control-allow-origin': '*' },
            body: JSON.stringify({ success: true, data: mockEvents })
        });
    });
    // Login to application
    await loginPage.navigatoApplicationURL();
    await loginPage.loginUsingCred(emailId, pwd);
    await eventPage.navigateToBrowseEvents();

    // Verify  mocked display tiles and its values
    const eventCards = page.getByTestId('event-card');
    await expect(eventCards).toHaveCount(mockEvents.length);

    for (const event of mockEvents) {

        // Find the card corresponding to the current mock event
        const eventCard = eventCards.filter({
            hasText: event.title
        });

        // Make sure exactly one card exists for this event
        await expect(eventCard).toHaveCount(1);

        // Verify title
        await expect(eventCard).toContainText(event.title);

        // Verify price
        await expect(eventCard).toContainText(`$${event.price}`);

        // Get seat availability text
        const seatText = await eventCard
            .getByText(/seats available/i)
            .innerText();

        // Example: "9000 seats available"
        const seatCount = Number(
            seatText.split(' ')[0]
        );

        // Verify seats against mock data
        expect(seatCount).toBe(event.availableSeats);
    }

    //Search a mocked event
    const searchInput = page.getByPlaceholder(/search events/i); // Adjust locator text to match your input placeholder
    await searchInput.fill('IT conference');
    await searchInput.press('Enter');

    // Assert search changes
    await expect(page.getByText('IT conference at Hyderabad')).toBeVisible();
    await expect(page.getByText('Resin art workshop')).toBeHidden();
    await page.getByTestId('book-now-btn').click();
    // Verify events details from booking page
    await expect(page.getByText('IT conference at Hyderabad')).toBeVisible();
    await expect(page.getByText('Gachibowli')).toBeVisible();
    await expect(page.getByText('9000 / 10000 seats')).toBeVisible();
    await expect(page.getByText('Price per ticket', { exact: true }).locator('..')).toContainText('$350');
    const ticketsCount = page.getByText('Tickets', { exact: true }).locator('..');
    await expect(ticketsCount.getByText('1', { exact: true })).toBeVisible();
    await (page.getByRole('button', { name: '+' })).click();
    await expect(ticketsCount.getByText('2', { exact: true })).toBeVisible();
    const total = Number(mockEvents[0].price.replace(/[$,]/g, '')) * 2;
    const actual = await page.locator("//span[text()='Total']/following-sibling::span").textContent();
    const actualTotal = Number((actual || '').replace(/[$,]/g, ''));
    await expect(actualTotal).toBe(Number(total));

});

test('Assignment6 Patch exactly one live booking in transit and prove My Bookings and the booking detail page reflect only those intentional changes.', async ({ page, request }) => {
    const loginPage = new LoginPage(page);
    const eventPage = new EventPage(page);

    await loginPage.navigatoApplicationURL();
    await loginPage.loginUsingCred(emailId, pwd);
    const token = await page.evaluate(() => localStorage.getItem('eventhub_token'));
    expect(token).toBeTruthy();
    const authHeaders = { Authorization: `Bearer ${token}` };

    const [targetResponse, controlResponse] = await Promise.all([
        request.post('https://api.eventhub.rahulshettyacademy.com/api/bookings', {
            headers: authHeaders,
            data: {
                customerName: 'Assignment 6 target',
                customerEmail: emailId,
                customerPhone: '9876543210',
                quantity: 1,
                eventId: 285
            }
        }),
        request.post('https://api.eventhub.rahulshettyacademy.com/api/bookings', {
            headers: authHeaders,
            data: {
                customerName: 'Assignment 6 control',
                customerEmail: emailId,
                customerPhone: '9876543210',
                quantity: 1,
                eventId: 284
            }
        })
    ]);
    expect(targetResponse.status()).toBe(201);
    expect(controlResponse.status()).toBe(201);
    const targetBooking = (await targetResponse.json()).data;
    const controlBooking = (await controlResponse.json()).data;

    const patchedTitle = 'Intentional Cricket Tournament';
    const patchedTicketCount = 5;
    const patchedTotalAmount = String(Number(targetBooking.totalPrice) * patchedTicketCount);
    const patchedRefCode = `PATCH-${targetBooking.bookingRef}`;

    await page.route('**/api/bookings**', async (route) => {
        if (route.request().method() !== 'GET') {
            return route.continue();
        }

        const response = await route.fetch();
        const payload = await response.json();
        const bookings = Array.isArray(payload.data) ? payload.data : [payload.data];
        for (const booking of bookings) {
            if (booking?.bookingRef === targetBooking.bookingRef) {
                booking.bookingRef = patchedRefCode;
                booking.quantity = patchedTicketCount;
                booking.totalPrice = patchedTotalAmount;
                if (booking.event)
                    booking.event.title = patchedTitle;
            }
        }
        await route.fulfill({
            response,
            contentType: 'application/json',
            body: JSON.stringify(payload)
        });
    });
    await eventPage.navigateToMyBooking();

    await expect(page.getByTestId('nav-bookings')).toBeVisible();
    const patchedCard = page.getByTestId('booking-card').filter({ hasText: patchedRefCode });
    await expect(patchedCard).toHaveCount(1);
    await expect(patchedCard).toContainText(patchedTitle);
    await expect(patchedCard).toContainText(`${patchedTicketCount} tickets`);
    await expect(patchedCard).toContainText(`$${Number(patchedTotalAmount).toLocaleString('en-US')}`);

    const unpatchedCard = page.getByTestId('booking-card').filter({ hasText: controlBooking.bookingRef });
    await expect(unpatchedCard).toHaveCount(1);
    await expect(unpatchedCard).toContainText(controlBooking.event.title);
    await expect(unpatchedCard).not.toContainText(patchedTitle);
    await patchedCard.getByRole('button', { name: 'View Details' }).first().click();

    await expect(page.locator('body')).toContainText(patchedRefCode);
    await expect(page.getByRole('heading', { name: patchedTitle })).toBeVisible();
    await expect(page.locator('body')).toContainText(emailId);
    await expect(page.locator('body')).toContainText(`${patchedTicketCount}`);

    await page.getByRole('button', { name: 'Back to My Bookings' }).click();
    await expect(page.getByTestId('booking-card').filter({ hasText: patchedRefCode })).toContainText(patchedTitle);

    const [targetDelete, controlDelete] = await Promise.all([
        request.delete(`https://api.eventhub.rahulshettyacademy.com/api/bookings/${targetBooking.id}`, { headers: authHeaders }),
        request.delete(`https://api.eventhub.rahulshettyacademy.com/api/bookings/${controlBooking.id}`, { headers: authHeaders })
    ]);
    expect(targetDelete.status()).toBe(200);
    expect(controlDelete.status()).toBe(200);
});

test('Assignment7 Create a booking through the EventHub API for a runtime-selected event,', async ({ page, request }) => {
    const eventPage = new EventPage(page);
    const loginResponse = await request.post('https://api.eventhub.rahulshettyacademy.com/api/auth/login', {
        data: {
            email: emailId,
            password: pwd
        }
    });
    expect(loginResponse.status()).toBe(200);
    const loginPayload = await loginResponse.json();
    expect(loginPayload.success).toBe(true);
    const token = loginPayload.token;

    const eventResponse = await request.get('https://api.eventhub.rahulshettyacademy.com/api/events/285', {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    expect(eventResponse.status()).toBe(200);
    const eventPayload = await eventResponse.json();

    expect(eventPayload.success).toBe(true);
    expect(eventPayload.data.id).toBe(285);
    expect(eventPayload.data.availableSeats).toBeGreaterThan(2);
    const bookingPayload = { customerName: "test", customerEmail: "test@test.com", customerPhone: "9876543210", quantity: 2, eventId: 285 };
    const bookAnEvent = await request.post('https://api.eventhub.rahulshettyacademy.com/api/bookings', {
        headers: {
            Authorization: `Bearer ${token}`
        },
        data: bookingPayload,

    });
    expect(bookAnEvent.status()).toBe(201);
    const bookAnEventPayload = await bookAnEvent.json();
    const bookingRef = bookAnEventPayload.data.bookingRef;
    await console.log(bookingRef);
    const id = bookAnEventPayload.data.id;
    const qty = bookAnEventPayload.data.quantity;
    const price = bookAnEventPayload.data.totalPrice;
    const getBookingDetails = await request.get(`https://api.eventhub.rahulshettyacademy.com/api/bookings/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    expect(getBookingDetails.status()).toBe(200);
    const bookingDetailsPayload = await getBookingDetails.json();

    expect(bookingDetailsPayload.data.bookingRef).toBe(bookingRef);
    expect(bookingDetailsPayload.data.id).toBe(id);
    expect(bookingDetailsPayload.data.quantity).toBe(qty);
    expect(bookingDetailsPayload.data.totalPrice).toBe(price);

    await page.addInitScript(value => {
        window.localStorage.setItem('eventhub_token', value);
    }, token);
    await page.goto('https://eventhub.rahulshettyacademy.com/events');
    await eventPage.navigateToMyBooking();
    const bookingCard = page.getByTestId('booking-card').filter({ hasText: bookingRef });
    await expect(bookingCard).toHaveCount(1);
    await expect(bookingCard).toContainText(`${qty} tickets`);
    await expect(bookingCard).toContainText(`$${price}`);
    await bookingCard.getByRole('button', { name: 'View Details' }).first().click();
    await expect(page.locator('body')).toContainText(bookingRef);
    await expect(page.getByText('test@test.com')).toBeVisible();
    const deleteBookingDetails = await request.delete(`https://api.eventhub.rahulshettyacademy.com/api/bookings/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    expect(deleteBookingDetails.status()).toBe(200);
    const payload = await deleteBookingDetails.json();
    await expect(payload.message).toBe('Booking cancelled');
    const retreiveBookingDetails = await request.get(`https://api.eventhub.rahulshettyacademy.com/api/bookings/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    expect(retreiveBookingDetails.status()).toBe(404);
    await console.log(retreiveBookingDetails.json());
    await page.getByTestId('nav-events').click();
    await expect(page.getByText("Upcoming Events")).toBeVisible();
    await eventPage.navigateToMyBooking();
    await page.reload({ waitUntil: 'networkidle' });
    await expect(page.getByTestId('booking-card').filter({ hasText: bookingRef })).toHaveCount(0);
   
});