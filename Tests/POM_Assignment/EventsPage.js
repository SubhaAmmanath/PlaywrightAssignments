import { expect } from '@playwright/test'
class EventPage {
    constructor(page) {
        this.page = page;
        this.browseEvents = this.page.getByRole('link', { name: 'Browse Events', exact: true });
        this.eventTile = this.page.getByTestId('event-card');
        this.price = this.eventTile.locator('.text-lg');
        this.bookButton = this.page.getByTestId('book-now-btn');
        this.bookingRef;
        this.bookingTiles = this.page.getByTestId('booking-card');
    }
    async navigateToBrowseEvents() {
        await this.browseEvents.click();
        await expect(this.page.getByText("Upcoming Events")).toBeVisible();
    }
    async searchForAnEventAndVerify(eventLocation, eventName, price) {
        await this.page.getByPlaceholder('Search events, venues…').pressSequentially(eventName, { delay: 100 });
        await this.page.locator('select').nth(1).selectOption(eventLocation);

        //Verify the event tile is displayed and verify the details in the tile
        await expect(this.eventTile.getByText(eventName)).toBeVisible();
        await expect(this.eventTile).toHaveCount(1);
        await expect(this.eventTile.getByRole('link', { name: eventName }))
            .toBeVisible();
        await expect(this.price).toContainText(price);
    }
    async checkForSeatAvailabilityandBook() {
        const seatText = await this.eventTile
            .getByText(/seats available/i)
            .innerText();

        const seatCount = Number(seatText.split(' ')[0]);
        if (seatCount > 0) {
            await this.bookButton.click();
        } else {
            console.log('Seats are not available');
        }
    }
    async checkBookingPageInfo(eventName, eventLocation, price) {
        await expect(this.page).toHaveURL(/events/);
        await expect(this.page.getByRole('heading', { name: eventName })).toBeVisible();
        const totalRow = this.page.locator('div').filter({ hasText: /^Total/ });
        await expect(totalRow).toContainText("Total" + price);
        await expect(this.page.getByText(eventLocation, { exact: true })).toBeVisible();
    }
    async checkEventTileDetails(eventName1, eventName2, eventName3) {
        await this.page.getByRole('main').getByRole('link', { name: 'Events' }).click();
        await expect(this.eventTile).toHaveCount(3);
        const allEvents = this.eventTile;
        await expect(allEvents.nth(0).getByRole('link', { name: eventName1 })).toBeVisible();
        await expect(allEvents.nth(1).getByRole('link', { name: eventName2 })).toBeVisible();
        await expect(allEvents.nth(2).getByRole('link', { name: eventName3 })).toBeVisible();
    }
    async fillCustomerDetailsAndBook(customerName, emailId,ticketCount,price) {
       
        for(let count=1;count<ticketCount;count++)
            {
                await (this.page.getByRole('button', { name: '+' })).click();
            }
        await this.page.locator('#customerName').fill(customerName);
        await this.page.locator('#customer-email').fill(emailId);
        await this.page.locator('#phone').fill('9876543210');
        await this.page.getByRole('button', { name: 'Confirm Booking' }).click();
        await expect(this.page.getByRole('heading', { name: 'Booking Confirmed!' })).toBeVisible();
        this.bookingRef = await this.page.locator("//span[text()='Booking Ref']//following-sibling::span").textContent();
        await expect(this.bookingRef).not.toBeNull();
        await console.log(this.bookingRef);
        await expect(this.page.locator("//span[text()='Customer']/following-sibling::span")).toHaveText(customerName);
        await expect(this.page.locator("//span[text()='Tickets']/following-sibling::span")).toHaveText(ticketCount);
        const total = parseInt(price.replace(/[$,]/g, ''), 10) * parseInt(ticketCount);
        const actual= await this.page.locator("//span[text()='Total']/following-sibling::span").textContent();;   
        const actualTotal = Number((actual || '').replace(/[$,]/g, ''));
        await expect(actualTotal).toBe(Number(total));
       
    }
    async clickonviewBooking() {
        await this.page.getByRole('button', { name: 'View My Bookings' }).click();
    }
    async verifyBookingDetails(eventName,order) {
       this.clickonviewBooking();
       const count = await this.bookingTiles.count();
        if (count === 1) {
            await expect(this.page.getByRole('heading', { name: eventName })).toBeVisible();
            const actualBookingRef = await this.page.locator('.booking-ref').textContent();
            expect(actualBookingRef).toBe(this.bookingRef);
            await expect(this.page.getByText('ticket').nth(count)).toContainText('1');
            return;
        }
        //await expect(this.bookingTiles.getByText(eventName)).toBeVisible();
        for(let i=0;i<count;i++)
        {
        const bookingRef1 = await this.bookingTiles.locator('.booking-ref').nth(i)
        if(bookingRef1.textContent()===eventName)
            {
            console.log(bookingRef1.textContent());
            expect(bookingRef1).toBe(this.bookingRef);
            await expect(this.bookingTiles.getByText('ticket').nth(i)).toContainText(order);
            }
        }
    }
    async verifyBookingDetailsfromList(eventName, ticketCount, count) {
        await this.bookingTiles.nth(count).getByRole('button', { name: 'View Details' }).click();
        await expect(this.page.locator("//span[text()='Event']//following-sibling::span")).toHaveText(eventName);
        await expect(this.page.locator("//span[text()='Tickets']//following-sibling::span")).toHaveText(ticketCount);
        await this.page.getByRole('button', { name: 'Back to My Bookings' }).click();
    }
    async navigateToMyBooking()
    {
        await this.page.getByTestId('nav-bookings').click();
    }
    async deleteBooking()
    {
        const count = await this.bookingTiles.count();
        
        if(count<2)
        {
            await this.bookingTiles.getByTestId('cancel-booking-btn').click();
            await this.page.getByTestId('confirm-dialog-yes').click();
        }
        else
        {
           await this.bookingTiles.getByTestId('cancel-booking-btn').first().click();
           await this.page.getByTestId('confirm-dialog-yes').click();
        }
    }
}
module.exports = { EventPage };