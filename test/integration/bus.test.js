const request = require('supertest');
const { Bus } = require('../../models/bus');
const { User } = require('../../models/user');
const mongoose = require('mongoose');

let server;
let token = new User({ isAdmin: true }).generateAuthToken();

describe('/api/buses', () => {
  beforeEach(() => {
    server = require('../../index');
  });
  afterEach(async () => {
    await server.close();
    await Bus.remove({});
  });

  describe('GET /', () => {
    it('should return all the buses', async () => {
      const buses = [
        {
          number_plate: '253Abcd',
          manufacturer: 'toyota',
          model: 'corolla',
          year: 2015,
          capacity: 250,
        },
        {
          number_plate: 'Abc-ASd',
          manufacturer: 'toyota',
          model: 'venza',
          year: 2015,
          capacity: 250,
        },
        {
          number_plate: 'AdE-788',
          manufacturer: 'toyota',
          model: 'camry',
          year: 2015,
          capacity: 250,
        },
      ];

      await Bus.collection.insertMany(buses);

      const res = await request(server)
        .get('/api/buses')
        .set('x-auth-token', token);

      expect(res.status).toBe(200);
    });
  });

  describe('GET /:id', () => {
    it('should return a bus if valid id is passed', async () => {
      const bus = new Bus({
        number_plate: '253Abcd',
        manufacturer: 'toyota',
        model: 'corolla',
        year: 2015,
        capacity: 250,
      });
      await bus.save();

      const res = await request(server)
        .get('/api/buses/' + bus._id)
        .set('x-auth-token', token);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('model', bus.model);
    });

    it('should return 404 if invalid id is passed', async () => {
      const res = await request(server)
        .get('/api/buses/1')
        .set('x-auth-token', token);

      expect(res.status).toBe(404);
    });

    it('should return 404 if no bus with the given id exists', async () => {
      const id = mongoose.Types.ObjectId();
      const res = await request(server)
        .get('/api/buses/' + id)
        .set('x-auth-token', token);

      expect(res.status).toBe(404);
    });
  });

  describe('POST /', () => {
    let bus;
    let token;
    let id = mongoose.Types.ObjectId();
    const exec = async () => {
      return await request(server)
        .post('/api/buses')
        .set('x-auth-token', token)
        .send(bus);
    };
    beforeEach(async () => {
      server = require('../../index');
      token = new User({ isAdmin: true }).generateAuthToken();

      bus = {
        number_plate: '234-AdGb',
        manufacturer: 'toyota',
        capacity: 250,
        model: 'corolla',
        year: '2015',
      };

      id = bus._id;
    });

    afterEach(async () => {
      await server.close();
      await Bus.remove({});
    });

    it('should 401 if client is not logged in', async () => {
      token = '';

      const res = await exec();

      expect(res.status).toBe(401);
    });

    it('should return 400 if capacity is missing', async () => {
      bus = {
        number_plate: '2344-ADG',
        model: 'toyota',
        manufacturer: 'camry',
        year: '2005',
      };

      const res = await exec();
      expect(res.status).toBe(400);
    });

    it('should return 400 if number_plate is missing', async () => {
      bus = {
        capacity: 250,
        model: 'toyota',
        manufacturer: 'camry',
        year: '2005',
      };

      const res = await exec();
      expect(res.status).toBe(400);
    });

    it('should save if it is valid', async () => {
      await exec();

      const res = await Bus.find({ model: 'corolla' });
      expect(res).not.toBeNull();
    });
    it('should return the bus if it is valid', async () => {
      const res = await exec();

      expect(res.body).toHaveProperty('data.model', 'corolla');
      expect(res.body).toHaveProperty('data.capacity');
    });
  });
  describe('DELETE /:id', () => {
    let token;
    let id;
    let bus;

    const exec = async () => {
      return await request(server)
        .delete('/api/buses/' + id)
        .set('x-auth-token', token)
        .send();
    };
    beforeEach(async () => {
      server = require('../../index');
      token = new User({ isAdmin: true }).generateAuthToken();

      bus = new Bus({
        number_plate: '2345-ABD',
        manufacturer: 'toyota',
        model: 'camry',
        year: '2020',
        capacity: 250,
      });
      await bus.save();
      id = bus._id;
    });
    afterEach(async () => {
      await server.close({});
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
    it('should delete the bus if valid', async () => {
      token = new User({ isAdmin: true }).generateAuthToken();

      await exec();

      const busInDb = await Bus.findById(id);
      expect(busInDb).toBeNull();
    });
    it('should return the bus if valid', async () => {
      token = new User({ isAdmin: true }).generateAuthToken();

      const res = await exec();

      expect(res.body).toHaveProperty('data._id', bus._id.toHexString());
      expect(res.body).toHaveProperty('data.capacity', bus.capacity);
    });
  });
});
