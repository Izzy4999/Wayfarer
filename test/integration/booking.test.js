const request = require('supertest');
const { Booking } = require('../../models/booking');
const { Trip } = require('../../models/trip');
const { User } = require('../../models/user');
const mongoose = require('mongoose');

describe('/api/bookings', () => {
  let server;
  let token;

  beforeEach(() => {
    server = require('../../index');
  });
  afterEach(async () => {
    await server.close({});
    await Booking.remove({});
  });
  describe('GET /', () => {
    it('should return 401 if user is not logged in', async () => {
      token = '';
      const booking = [
        {
          trip: {
            bus: {
              number_plate: 'brk1788',
              model: 'corolla',
              capacity: 2,
              manufacturer: 'toyota',
              year: '2000',
            },
            origin: 'lekki',
            destination: 'oniru',
            fare: 2500,
            trip_date: '2018-04-05',
          },
          seatNumber: 3,
          user: {
            first_name: 'ilaws',
            email: 'praiale@emai.com',
            password: '123456',
            last_name: 'pewla',
            isAdmin: true,
          },
          created_on: '2018-04-05',
        },
        {
          trip: {
            bus: {
              number_plate: 'brk1788',
              model: 'corolla',
              capacity: 1,
              manufacturer: 'toyota',
              year: '2000',
            },
            origin: 'lekki',
            destination: 'oniru',
            fare: 2500,
            trip_date: '2018-04-05',
          },
          seatNumber: 2,
          user: {
            first_name: 'ilaws',
            email: 'ppiale@emai.com',
            password: '123456',
            last_name: 'pewla',
            isAdmin: true,
          },
          created_on: '2018-04-05',
        },
        {
          trip: {
            bus: {
              number_plate: 'brk1788',
              model: 'corolla',
              capacity: 0,
              manufacturer: 'toyota',
              year: '2000',
            },
            origin: 'lekki',
            destination: 'oniru',
            fare: 2500,
            trip_date: '2018-04-05',
          },
          seatNumber: 1,
          user: {
            first_name: 'ilaws',
            email: 'raeiale@emai.com',
            password: '123456',
            last_name: 'pewla',
            isAdmin: true,
          },
          created_on: '2018-04-05',
        },
      ];
      await Booking.collection.insertMany(booking);
      const res = await request(server).get('/api/bookings');

      expect(res.status).toBe(401);
    });
    it('should return 403 is user is not admin', async () => {
      token = new User().generateAuthToken();

      const booking = [
        {
          trip: {
            bus: {
              number_plate: 'brk1788',
              model: 'corolla',
              capacity: 2,
              manufacturer: 'toyota',
              year: '2000',
            },
            origin: 'lekki',
            destination: 'oniru',
            fare: 2500,
            trip_date: '2018-04-05',
          },
          seatNumber: 3,
          user: {
            first_name: 'ilaws',
            email: 'praiale@emai.com',
            password: '123456',
            last_name: 'pewla',
            isAdmin: true,
          },
          created_on: '2018-04-05',
        },
        {
          trip: {
            bus: {
              number_plate: 'brk1788',
              model: 'corolla',
              capacity: 1,
              manufacturer: 'toyota',
              year: '2000',
            },
            origin: 'lekki',
            destination: 'oniru',
            fare: 2500,
            trip_date: '2018-04-05',
          },
          seatNumber: 2,
          user: {
            first_name: 'ilaws',
            email: 'ppiale@emai.com',
            password: '123456',
            last_name: 'pewla',
            isAdmin: true,
          },
          created_on: '2018-04-05',
        },
        {
          trip: {
            bus: {
              number_plate: 'brk1788',
              model: 'corolla',
              capacity: 0,
              manufacturer: 'toyota',
              year: '2000',
            },
            origin: 'lekki',
            destination: 'oniru',
            fare: 2500,
            trip_date: '2018-04-05',
          },
          seatNumber: 1,
          user: {
            first_name: 'ilaws',
            email: 'raeiale@emai.com',
            password: '123456',
            last_name: 'pewla',
            isAdmin: true,
          },
          created_on: '2018-04-05',
        },
      ];
      await Booking.collection.insertMany(booking);
      const res = await request(server)
        .get('/api/bookings')
        .set('x-auth-token', token);

      expect(res.status).toBe(403);
    });
    it('should return all booking if user is admin', async () => {
      token = new User({ isAdmin: true }).generateAuthToken();

      const booking = [
        {
          trip: {
            bus: {
              number_plate: 'brk1788',
              model: 'corolla',
              capacity: 2,
              manufacturer: 'toyota',
              year: '2000',
            },
            origin: 'lekki',
            destination: 'oniru',
            fare: 2500,
            trip_date: '2018-04-05',
          },
          seatNumber: 3,
          user: {
            first_name: 'ilaws',
            email: 'qwaaiale@emai.com',
            password: '123456',
            last_name: 'pewla',
            isAdmin: true,
          },
          created_on: '2018-04-05',
        },
        {
          trip: {
            bus: {
              number_plate: 'brk1788',
              model: 'corolla',
              capacity: 1,
              manufacturer: 'toyota',
              year: '2000',
            },
            origin: 'lekki',
            destination: 'oniru',
            fare: 2500,
            trip_date: '2018-04-05',
          },
          seatNumber: 2,
          user: {
            first_name: 'ilaws',
            email: 'ppiale@emai.com',
            password: '123456',
            last_name: 'pewla',
            isAdmin: true,
          },
          created_on: '2018-04-05',
        },
        {
          trip: {
            bus: {
              number_plate: 'brk1788',
              model: 'corolla',
              capacity: 0,
              manufacturer: 'toyota',
              year: '2000',
            },
            origin: 'lekki',
            destination: 'oniru',
            fare: 2500,
            trip_date: '2018-04-05',
          },
          seatNumber: 1,
          user: {
            first_name: 'ilaws',
            email: 'raeiale@emai.com',
            password: '123456',
            last_name: 'pewla',
            isAdmin: true,
          },
          created_on: '2018-04-05',
        },
      ];
      await Booking.collection.insertMany(booking);
      const res = await request(server)
        .get('/api/bookings')
        .set('x-auth-token', token);

      expect(res.status).toBe(200);
      // expect(res.body.length).toBe(3);
      // expect(res.body.some((g) => g.trip.destination === 'oniru')).toBeTruthy();
      // expect(res.body.some((g) => g.user.first_name === 'ilaws')).toBeTruthy();
      // expect(res.body.some((g) => g.trip.bus.capacity === 1)).toBeTruthy();
    });
  });
  describe('GET /my-bookings', () => {
    let booking;
    let trip;
    let user;
    let userId;
    let tripId;
    let busId;

    token = new User({
      _id: userId,
      email: 'allaw@gmail.com',
    }).generateAuthToken();

    beforeEach(async () => {
      userId = mongoose.Types.ObjectId();
      tripId = mongoose.Types.ObjectId();
      busId = mongoose.Types.ObjectId();
    });

    it('should return the logged in users booking', async () => {
      const booking = [
        {
          trip: {
            bus: {
              number_plate: 'brk1788',
              model: 'corolla',
              capacity: 2,
              manufacturer: 'toyota',
              year: '2000',
            },
            origin: 'lekki',
            destination: 'oniru',
            fare: 2500,
            trip_date: '2018-04-05',
          },
          seatNumber: 3,
          user: {
            first_name: 'ilaws',
            email: 'qwaaiale@emai.com',
            password: '123456',
            last_name: 'pewla',
            isAdmin: true,
          },
          created_on: '2018-04-05',
        },
        {
          trip: {
            bus: {
              number_plate: 'brk1788',
              model: 'corolla',
              capacity: 1,
              manufacturer: 'toyota',
              year: '2000',
            },
            origin: 'ibadan',
            destination: 'abuja',
            fare: 2500,
            trip_date: '2018-04-05',
          },
          seatNumber: 2,
          user: {
            first_name: 'ilaws',
            email: 'allaw@gmail.com',
            password: '123456',
            last_name: 'pewla',
            isAdmin: true,
          },
          created_on: '2018-04-05',
        },
        {
          trip: {
            bus: {
              number_plate: 'brk1788',
              model: 'corolla',
              capacity: 0,
              manufacturer: 'toyota',
              year: '2000',
            },
            origin: 'lekki',
            destination: 'oniru',
            fare: 2500,
            trip_date: '2018-04-05',
          },
          seatNumber: 1,
          user: {
            first_name: 'ilaws',
            email: 'allaw@gmail.com',
            password: '123456',
            last_name: 'pewla',
            isAdmin: true,
          },
          created_on: '2018-04-05',
        },
      ];
      await Booking.collection.insertMany(booking);
      const res = await request(server)
        .get('/api/bookings/my-bookings')
        .set('x-auth-token', token);

      expect(res.status).toBe(200);
    });
  });
  describe('POST /', () => {
    let token;
    let server;
    let tripId;
    let userId;
    let trip;
    let user;
    let busId;
    let id;
    let seatNumber;

    const exec = async () => {
      return await request(server)
        .post('/api/bookings')
        .set('x-auth-token', token)
        .send({ tripId, userId, seatNumber });
    };
    beforeEach(async () => {
      server = require('../../index');

      tripId = mongoose.Types.ObjectId();
      userId = mongoose.Types.ObjectId();
      busId = mongoose.Types.ObjectId();

      seatNumber = 3;

      token = new User({
        _id: userId,
        first_name: 'Lawal',
        last_name: 'Kunle',
        password: '123456',
        email: 'pinp123@yah.com',
      }).generateAuthToken();

      user = new User({
        _id: userId,
        first_name: 'Lawal',
        last_name: 'Kunle',
        password: '123456',
        email: 'pinp123@yah.com',
      });
      await user.save();

      trip = new Trip({
        _id: tripId,
        bus: {
          _id: busId,
          number_plate: '234AgBa',
          model: 'toyota',
          manufacturer: 'Corolla',
          capacity: 10,
        },
        origin: 'ebudu lekki',
        destination: 'ajah',
        fare: 200,
      });
      await trip.save();
    });
    afterEach(async () => {
      await server.close({});
      await Trip.remove({});
      await User.remove({});
      await Booking.remove({});
    });
    it('should return 401 if user is not logged in', async () => {
      token = '';

      const res = await exec();

      expect(res.status).toBe(401);
    });
    it('should return 400 if tripId is not provided', async () => {
      tripId = '';

      const res = await exec();

      expect(res.status).toBe(400);
    });
    it('should return 404 if trip is not found', async () => {
      await Trip.remove({});

      const res = await exec();

      expect(res.status).toBe(404);
    });
    it('should return 404 if user is not found', async () => {
      await User.remove({});
      const res = await exec();

      expect(res.status).toBe(404);
    });
    it('should return 400 if seat is taken', async () => {
      const book = [
        {
          trip: {
            bus: {
              number_plate: 'brk1788',
              model: 'corolla',
              capacity: 0,
              manufacturer: 'toyota',
              year: '2000',
            },
            origin: 'ebudu lekki',
            destination: 'ajah',
            fare: 200,
            trip_date: '2018-04-05',
          },
          seatNumber: 3,
          user: {
            first_name: 'ilaws',
            email: 'allaw@gmail.com',
            password: '123456',
            last_name: 'pewla',
            isAdmin: true,
          },
          created_on: '2018-04-05',
        },
        {
          trip: {
            bus: {
              number_plate: 'brk1788',
              model: 'corolla',
              capacity: 0,
              manufacturer: 'toyota',
              year: '2000',
            },
            origin: 'ebudu lekki',
            destination: 'ajah',
            fare: 200,
            trip_date: '2018-04-05',
          },
          seatNumber: 2,
          user: {
            first_name: 'ilaws',
            email: 'allaw@gmail.com',
            password: '123456',
            last_name: 'pewla',
            isAdmin: true,
          },
          created_on: '2018-04-05',
        },
      ];

      await Booking.collection.insertMany(book);

      const res = await exec();
      expect(res.status).toBe(400);
    });
    it('should return 401 if seat number is greaater than bus capacity', async () => {
      seatNumber = 150;

      const res = await exec();

      expect(res.status).toBe(401);
    });
    it('should return the booking if valid', async () => {
      const res = await exec();

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty(
        'data.trip.destination',
        trip.destination
      );
      expect(res.body).toHaveProperty('data.user.first_name', user.first_name);
    });
  });

  describe('DELETE /:id', () => {
    let token;
    let tripId;
    let userId;
    let user;
    let id;
    let booking;
    let busId;

    const exec = async () => {
      return await request(server)
        .delete('/api/bookings/' + id)
        .set('x-auth-token', token);
    };

    beforeEach(async () => {
      userId = mongoose.Types.ObjectId();
      tripId = mongoose.Types.ObjectId();
      id = mongoose.Types.ObjectId();
      busId = mongoose.Types.ObjectId();

      token = new User({
        _id: userId,
        first_name: 'Lawal',
        last_name: 'Kunle',
        password: '123456',
        email: 'pinp123@yah.com',
      }).generateAuthToken();

      user = new User({
        _id: userId,
        first_name: 'Lawal',
        last_name: 'Kunle',
        password: '123456',
        email: 'pinp123@yah.com',
      });
      await user.save();

      trip = new Trip({
        _id: tripId,
        bus: {
          _id: busId,
          number_plate: '234AgBa',
          model: 'toyota',
          manufacturer: 'Corolla',
          capacity: 10,
        },
        origin: 'ebudu lekki',
        destination: 'ajah',
        fare: 200,
      });
      await trip.save();

      booking = new Booking({
        _id: id,
        trip: trip,
        user: user,
        seatNumber: 3,
      });

      await booking.save();
    });
    afterEach(async () => {
      await server.close({});
      await Trip.remove({});
      await User.remove({});
    });

    it('should 401 if client is not logged in', async () => {
      token = '';

      const res = await exec();

      expect(res.status).toBe(401);
    });
    it('should return 404 if id is invalid', async () => {
      id = 1;

      const res = await exec();

      expect(res.status).toBe(404);
    });
    it('should return 404 if no trip with the given id was found', async () => {
      id = mongoose.Types.ObjectId();

      const res = await exec();
      expect(res.status).toBe(404);
    });

    it('should get the booking', async () => {
      const bookInDb = await Booking.findById(id);

      expect(bookInDb).not.toBeNull();
    });

    it('should return 400 if id is not for user', async () => {
      token = new User({ email: 'pp@yahoo.com' }).generateAuthToken();

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it('should delete the trip if input is valid', async () => {
      await exec();

      const tripInDb = await Trip.findById(id);

      expect(tripInDb).toBeNull();
    });
  });
});
