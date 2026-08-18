import { test, expect, baseUrl } from './fixtures';

test.describe('API restful-booker with fixtures', {
  tag: '@api',
}, () => {

  test('Ping', {tag: ['@ping'],}, async ({ request }) => {
    const response = await request.get(`${baseUrl}/ping`);
    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(201);
  });

  test('Auth - token from login fixture', { tag: ['@auth'],}, async ({ token }) => {
    expect(token).toBeDefined();
    expect(typeof token).toBe('string');
    expect(token.length).toBeGreaterThan(0);
  });

  test('Booking - bookingId from create booking fixture', {tag: ['@create'],}, async ({ bookingId }) => {
    expect(bookingId).toBeDefined();
    expect(typeof bookingId).toBe('number');
  });

  
  test('Booking - GetBookingIds', { tag: ['@get', '@get_all'],}, async ({ request }) => {
    const response = await request.get(`${baseUrl}/booking`);

    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);

    const data = await response.json();
    expect(Array.isArray(data)).toBeTruthy();

    for (const elem of data) {
      expect(elem.bookingid).toBeDefined();
      expect(typeof elem.bookingid).toBe('number');
    }
  });

  test('Booking - GetBookingIds | Filter by name', { tag: ['@get', '@filter'],}, async ({ request }) => {
    const firstname = 'sally';
    const lastname = 'brown';

    const response = await request.get(
      `${baseUrl}/booking?firstname=${firstname}&lastname=${lastname}`
    );

    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);

    const data = await response.json();
    expect(Array.isArray(data)).toBeTruthy();

    for (const elem of data) {
      expect(elem.bookingid).toBeDefined();
      expect(typeof elem.bookingid).toBe('number');
    }
  });

  test('Booking - GetBookingIds | Filter by checkin - checkout', {tag: ['@get', '@filter'],}, async ({ request }) => {
    const response = await request.get(
      `${baseUrl}/booking?checkin=2014-03-13&checkout=2014-05-21`
    );

    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);

    const data = await response.json();
    expect(Array.isArray(data)).toBeTruthy();

    for (const elem of data) {
      expect(elem.bookingid).toBeDefined();
      expect(typeof elem.bookingid).toBe('number');
    }
  });

  test('Booking - GetBooking', { tag: ['@get', '@get_by_id'],}, async ({ request, bookingId }) => {
    const response = await request.get(`${baseUrl}/booking/${bookingId}`);

    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);

    const data = await response.json();

    expect(typeof data).toBe('object');
    expect(data.firstname).toBeDefined();
    expect(data.lastname).toBeDefined();
    expect(data.totalprice).toBeDefined();
    expect(data.depositpaid).toBeDefined();
    expect(data.bookingdates).toBeDefined();
    expect(data.bookingdates.checkin).toBeDefined();
    expect(data.bookingdates.checkout).toBeDefined();

    expect(typeof data.firstname).toBe('string');
    expect(typeof data.lastname).toBe('string');
    expect(typeof data.totalprice).toBe('number');
    expect(typeof data.depositpaid).toBe('boolean');
    expect(typeof data.bookingdates).toBe('object');
    expect(typeof data.bookingdates.checkin).toBe('string');
    expect(typeof data.bookingdates.checkout).toBe('string');
  });

  test('Booking - UpdateBooking', { tag: ['@update', '@put'],}, async ({ request, token, bookingId }) => {
    const updatedData = {
      firstname: 'James',
      lastname: 'Brown',
      totalprice: 111,
      depositpaid: true,
      bookingdates: {
        checkin: '2018-01-01',
        checkout: '2019-01-01',
      },
      additionalneeds: 'Breakfast',
    };

    const response = await request.put(`${baseUrl}/booking/${bookingId}`, {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Cookie: `token=${token}`,
      },
      data: updatedData,
    });

    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);

    const data = await response.json();
    expect(data.firstname).toBeDefined();
    expect(data.lastname).toBeDefined();
    expect(data.totalprice).toBeDefined();
    expect(data.depositpaid).toBeDefined();
    expect(data.bookingdates).toBeDefined();
    expect(data.bookingdates.checkin).toBeDefined();
    expect(data.bookingdates.checkout).toBeDefined();

    expect(typeof data.firstname).toBe('string');
    expect(typeof data.lastname).toBe('string');
    expect(typeof data.totalprice).toBe('number');
    expect(typeof data.depositpaid).toBe('boolean');
    expect(typeof data.bookingdates).toBe('object');
    expect(typeof data.bookingdates.checkin).toBe('string');
    expect(typeof data.bookingdates.checkout).toBe('string');

    expect(data.firstname).toBe(updatedData.firstname);
    expect(data.lastname).toBe(updatedData.lastname);
    expect(data.totalprice).toBe(updatedData.totalprice);
    expect(data.depositpaid).toBe(updatedData.depositpaid);
    expect(data.bookingdates.checkin).toBe(updatedData.bookingdates.checkin);
    expect(data.bookingdates.checkout).toBe(updatedData.bookingdates.checkout);
  });

  test('Booking - PartialUpdateBooking', { tag: ['@update', '@patch'],}, async ({ request, token, bookingId }) => {
    const partialUpdateData = {
      firstname: 'James',
      lastname: 'Brown',
    };

    const response = await request.patch(`${baseUrl}/booking/${bookingId}`, {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Cookie: `token=${token}`,
      },
      data: partialUpdateData,
    });

    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);

    const data = await response.json();
    expect(data.firstname).toBeDefined();
    expect(data.lastname).toBeDefined();
    expect(data.totalprice).toBeDefined();
    expect(data.depositpaid).toBeDefined();
    expect(data.bookingdates).toBeDefined();
    expect(data.bookingdates.checkin).toBeDefined();
    expect(data.bookingdates.checkout).toBeDefined();

    expect(typeof data.firstname).toBe('string');
    expect(typeof data.lastname).toBe('string');
    expect(typeof data.totalprice).toBe('number');
    expect(typeof data.depositpaid).toBe('boolean');
    expect(typeof data.bookingdates).toBe('object');
    expect(typeof data.bookingdates.checkin).toBe('string');
    expect(typeof data.bookingdates.checkout).toBe('string');

    expect(data.firstname).toBe(partialUpdateData.firstname);
    expect(data.lastname).toBe(partialUpdateData.lastname);
  });

  test('Booking - DeleteBooking', { tag: ['@delete'], }, async ({ request, token, bookingId }) => {
    const response = await request.delete(`${baseUrl}/booking/${bookingId}`, {
      headers: {
        Cookie: `token=${token}`,
      },
    });

    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(201);
  });


});
