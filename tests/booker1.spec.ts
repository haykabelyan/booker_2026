import { test, expect, request } from '@playwright/test';


test.describe.serial('API restful-booker', () => {


  let token: string;
  let bookingId: number;


  test('Ping', async ({ request }) => {
    const response = await request.get('https://restful-booker.herokuapp.com/ping');
    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(201);
  });


  test('Auth - CreateToken', async ({ request }) => {


    const response = await request.post(`https://restful-booker.herokuapp.com/auth`, {
      headers: { 'Content-Type': 'application/json' },
      data: {
        username: "admin",
        password: "password123"
      }
    });

    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);

    const data = await response.json();
    expect(typeof data).toBe('object');

    expect(data.token).toBeDefined();
    token = data.token;

  });


  test('Booking - CreateBooking', async ({ request }) => {

    const new_book = {
      firstname: "Jim",
      lastname: "Brown",
      totalprice: 111,
      depositpaid: true,
      bookingdates: {
        checkin: "2018-01-01",
        checkout: "2019-01-01"
      },
      additionalneeds: "Breakfast"
    };


    const response = await request.post('https://restful-booker.herokuapp.com/booking', {
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      data: new_book
    });

    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);

    const data = await response.json();
    expect(typeof data).toBe('object');

    expect(data.bookingid).toBeDefined();
    expect(data.booking).toBeDefined();

    const booking = data.booking;
    expect(booking.firstname).toBeDefined();
    // HOMEWORK

    expect(typeof booking.firstname).toBe('string');
    // HOMEWORK

    expect(booking.firstname).toBe(new_book.firstname);
    // HOMEWORK


    bookingId = data.bookingId;

  });


  test('Booking - GetBookingIds', async ({ request }) => {

    const response = await request.get('https://restful-booker.herokuapp.com/booking');

    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);

    const data = await response.json();
    expect(Array.isArray(data)).toBeTruthy();

    for (let elem of data) {
      expect(elem.bookingid).toBeDefined();
      expect(typeof elem.bookingid).toBe('number');
    }

  });

  test('Booking - GetBookingIds | Filter by name', async ({ request }) => {

    const firstname = 'sally';
    const lastname = 'brown';

    const response = await request.get(`https://restful-booker.herokuapp.com/booking?firstname=${firstname}&lastname=${lastname}`);

    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);

    const data = await response.json();
    expect(Array.isArray(data)).toBeTruthy();

    for (let elem of data) {
      expect(data.bookingid).toBeDefined();
      expect(typeof data.bookingid).toBe('number');
    }
  });

  test('Booking - GetBookingIds | Filter by checkin - checkout', async ({ request }) => {

    const response = await request.get(`https://restful-booker.herokuapp.com/booking?checkin=2014-03-13&checkout=2014-05-21`);

    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);


    const data = await response.json();
    expect(Array.isArray(data)).toBeTruthy();

    for (let elem of data) {
      expect(elem.bookingid).toBeDefined();
      expect(typeof elem.bookingid).toBe('number');
    }

  });


  test('Booking - GetBooking', async ({ request }) => {

    bookingId = 2;

    const response = await request.get(`https://restful-booker.herokuapp.com/booking/${bookingId}`);

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
    // expect(data.additionalneeds).toBeDefined();


    expect(typeof data.firstname).toBe('string');
    expect(typeof data.lastname).toBe('string');
    expect(typeof data.totalprice).toBe('number');
    expect(typeof data.depositpaid).toBe('boolean');
    expect(typeof data.bookingdates).toBe('object');
    expect(typeof data.bookingdates.checkin).toBe('string');
    expect(typeof data.bookingdates.checkout).toBe('string');
    // expect(typeof data.additionalneeds).toBe('string');

  });


  test('Booking - UpdateBooking', async ({ request }) => {

    bookingId = 2;

    const updated_data = {
      firstname: "James",
      lastname: "Brown",
      totalprice: 111,
      depositpaid: true,
      bookingdates: {
        checkin: "2018-01-01",
        checkout: "2019-01-01"
      },
      additionalneeds: "Breakfast"
    }

    const response = await request.put(`https://restful-booker.herokuapp.com/booking/${bookingId}`, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Cookie': `token=${token}`
      },
      data: updated_data
    });


    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);

    const data = await response.json();
    expect(data.firstname).toBeDefined();
    expect(data.firstname).toBeDefined();
    expect(data.lastname).toBeDefined();
    expect(data.totalprice).toBeDefined();
    expect(data.depositpaid).toBeDefined();
    expect(data.bookingdates).toBeDefined();
    expect(data.bookingdates.checkin).toBeDefined();
    expect(data.bookingdates.checkout).toBeDefined();
    // expect(data.additionalneeds).toBeDefined();

    expect(typeof data.firstname).toBe('string');
    expect(typeof data.lastname).toBe('string');
    expect(typeof data.totalprice).toBe('number');
    expect(typeof data.depositpaid).toBe('boolean');
    expect(typeof data.bookingdates).toBe('object');
    expect(typeof data.bookingdates.checkin).toBe('string');
    expect(typeof data.bookingdates.checkout).toBe('string');
    // expect(data.additionalneeds).toBe('string');

    expect(data.firstname).toBe(updated_data.firstname);
    expect(data.lastname).toBe(updated_data.lastname);
    expect(data.totalprice).toBe(updated_data.totalprice);
    expect(data.depositpaid).toBe(updated_data.depositpaid);
    expect(data.bookingdates.checkin).toBe(updated_data.bookingdates.checkin);
    expect(data.bookingdates.checkout).toBe(updated_data.bookingdates.checkout);
    // expect(data.additionalneeds).toBe(updated_data.additionalneeds);    

  });


  test('Booking - PartialUpdateBooking', async ({ request }) => {

    bookingId = 2;

      const partialUpdateData = {
        firstname: 'James',
        lastname: 'Brown'
      };

       const response = await request.patch(`https://restful-booker.herokuapp.com/booking/${bookingId}`, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Cookie': `token=${token}`
        },
        data: partialUpdateData
      });

      expect(response.ok()).toBeTruthy();
      expect(response.status()).toBe(200);

       const data = await response.json();
      expect(data.firstname).toBeDefined();
      expect(data.lastname).toBeDefined();
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


  test('Booking - DeleteBooking', async ({ request }) => {

    bookingId = 2

    const response = await request.delete(`https://restful-booker.herokuapp.com/booking/${bookingId}`, {
      headers: {
        'Cookie': `token=${token}`
      }
    });

    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(201);
    
  });


});



