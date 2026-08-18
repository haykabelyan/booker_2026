import { test as base, expect } from '@playwright/test';

export const baseUrl = 'https://restful-booker.herokuapp.com';

type BookerFixtures = {
  token: string;
  bookingId: number;
};

// Custom fixtures: login gives token, create booking gives bookingId.
export const test = base.extend<BookerFixtures>({
  
  token: async ({ request }, use) => {
    const response = await request.post(`${baseUrl}/auth`, {
      headers: { 'Content-Type': 'application/json' },
      data: {
        username: 'admin',
        password: 'password123',
      },
    });

    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);

    const data = await response.json();
    expect(data.token).toBeDefined();
    expect(typeof data.token).toBe('string');

    await use(data.token);
  },

  bookingId: async ({ request }, use) => {
    const newBooking = {
      firstname: 'Jim',
      lastname: 'Brown',
      totalprice: 111,
      depositpaid: true,
      bookingdates: {
        checkin: '2018-01-01',
        checkout: '2019-01-01',
      },
      additionalneeds: 'Breakfast',
    };

    const response = await request.post(`${baseUrl}/booking`, {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      data: newBooking,
    });

    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);

    const data = await response.json();
    expect(data.bookingid).toBeDefined();
    expect(typeof data.bookingid).toBe('number');

    await use(data.bookingid);
  },
});

export { expect };