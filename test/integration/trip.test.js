const { Trip } = require('../../models/trip');
const { Bus } = require('../../models/bus');
const mongoose = require('mongoose');
const request = require('supertest');
const { User } = require('../../models/user');

describe('/api/trips', () => {
  let server;
  let token = new User().generateAuthToken();
  let bus;
  let busId = mongoose.Types.ObjectId();

  beforeEach(async () => {
    server = require('../../index');

    bus = new Bus({
      _id: busId,
      number_plate: '253Abcd',
      manufacturer: 'toyota',
      model: 'corolla',
      year: 2015,
      capacity: 250,
    });
    await bus.save();
  });
  afterEach(async () => {
    await server.close({});
    await Trip.remove({});
    await Bus.remove({});
  });
  describe('GET /', () => {
    const exec = async () => {
      return await request(server).get('/api/trips').set('x-auth-token', token);
    };

    it('should return all trips', async () => {
      const trip = [
        {
          bus: {
            number_plate: '253Abcd',
            manufacturer: 'toyota',
            model: 'corolla',
            year: 2015,
            capacity: 250,
          },
          fare: 2500,
          origin: 'lagos',
          destination: 'eko',
        },
        {
          bus: {
            number_plate: '2445acd',
            manufacturer: 'toyota',
            model: 'corolla',
            year: 2015,
            capacity: 290,
          },
          fare: 2500,
          origin: 'edo',
          destination: 'akure',
        },
      ];

      await Trip.collection.insertMany(trip);
      const res = await exec();

      expect(res.status).toBe(200);
      //   expect(res.body.length).toBe(2);
      //   expect(res.body.some((g) => g.destination === 'akure')).toBeTruthy();
      //   expect(res.body.some((g) => g.destination === 'eko')).toBeTruthy();
    });
  });
  describe('GET /:id', () => {
    it('should return a trip if valid id is passed', async () => {
      const trip = new Trip({
        bus: bus,
        fare: 2500,
        origin: 'lagos',
        destination: 'eko',
      });
      await trip.save();

      const res = await request(server).get('/api/trips/' + trip._id);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('data.destination', trip.destination);
    });

    it('should return 404 if invalid id is passed', async () => {
      const res = await request(server).get('/api/trips/1');

      expect(res.status).toBe(404);
    });

    it('should return 404 if no genre with the given id exists', async () => {
      const id = mongoose.Types.ObjectId();
      const res = await request(server).get('/api/trips/' + id);

      expect(res.status).toBe(404);
    });
  });
  describe('POST /', () => {
    let trips;
    let busId;
    let bus;
    let token;

    const exec = async () => {
      return await request(server)
        .post('/api/trips')
        .set('x-auth-token', token)
        .send({ bus: busId, fare: 2500, origin: 'lagos', destination: 'edo' });
    };
    beforeEach(async () => {
      server = require('../../index');
      busId = mongoose.Types.ObjectId();
      token = new User({ isAdmin: true }).generateAuthToken();

      bus = new Bus({
        _id: busId,
        number_plate: '253Abcd',
        manufacturer: 'toyota',
        model: 'corolla',
        year: 2015,
        capacity: 250,
      });
      await bus.save();
    });
    afterEach(async () => {
      await server.close({});
      await Bus.remove({});
      await Trip.remove({});
    });
    it('should 401 if client is not logged in', async () => {
      token = '';

      const res = await exec();

      expect(res.status).toBe(401);
    });
    it('should 403 if client is not admin', async () => {
      token = new User().generateAuthToken();

      const res = await exec();

      expect(res.status).toBe(403);
    });
    it('should return 400 if busId is not provided', async () => {
      token = new User({ isAdmin: true }).generateAuthToken();
      busId = '';

      const res = await exec();

      expect(res.status).toBe(400);
    });
    it('should return 404 if no bus found', async () => {
      await Bus.remove({});

      const res = await exec();

      expect(res.status).toBe(404);
    });
    it('should return 200 if request is valid', async () => {
      const res = await exec();

      expect(res.status).toBe(200);
    });
    it('should return trip if it is valid', async () => {
      const res = await exec();

      expect(res.body).toHaveProperty('data.bus');
      expect(res.body).toHaveProperty('data.fare');
      expect(res.body).toHaveProperty('data.origin');
      expect(res.body).toHaveProperty('data.destination');
    });
  });
  describe('DELETE /:id', () => {
    let token;
    let trip;
    let id;
    let bus;

    const exec = async () => {
      return await request(server)
        .delete('/api/trips/' + id)
        .set('x-auth-token', token)
        .send();
    };
    beforeEach(async () => {
      busId = mongoose.Types.ObjectId();

      bus = new Bus({
        _id: busId,
        number_plate: '253Abcd',
        manufacturer: 'toyota',
        model: 'corolla',
        year: 2015,
        capacity: 250,
      });
      await bus.save();
      trip = new Trip({
        bus: bus,
        fare: 2500,
        destination: 'osogbo',
        origin: 'egbeda',
      });
      await trip.save();
      id = trip._id;
    });
    afterEach(async () => {
      await server.close({});
      await Trip.remove({});
      await Bus.remove({});
    });
    it('should 401 if client is not logged in', async () => {
      token = '';

      const res = await exec();

      expect(res.status).toBe(401);
    });
    it('should 403 if client is not admin', async () => {
      token = new User().generateAuthToken();

      const res = await exec();

      expect(res.status).toBe(403);
    });
    it('should return 404 if id is invalid', async () => {
      token = new User({ isAdmin: true }).generateAuthToken();
      id = 1;

      const res = await exec();

      expect(res.status).toBe(404);
    });
    it('should return 404 if no trip with the given id was found', async () => {
      token = new User({ isAdmin: true }).generateAuthToken();
      id = mongoose.Types.ObjectId();

      const res = await exec();

      expect(res.status).toBe(404);
    });
    it('should delete the trip if input is valid', async () => {
      token = new User({ isAdmin: true }).generateAuthToken();

      await exec();

      const tripInDb = await Trip.findById(id);

      expect(tripInDb).toBeNull();
    });

    it('should return the removed trip', async () => {
      token = new User({ isAdmin: true }).generateAuthToken();

      const res = await exec();

      expect(res.body).toHaveProperty('data._id', trip._id.toHexString());
      expect(res.body).toHaveProperty('data.fare', trip.fare);
    });
  });
});
