const request = require('supertest');
const { User } = require('../../models/user');

describe('/api/users', () => {
  let token;
  let user;

  describe('GET /', () => {
    beforeEach(async () => {
      server = require('../../index');
      token = new User({ isAdmin: true }).generateAuthToken();

      const users = [
        {
          first_name: 'allausa',
          last_name: 'manugasa',
          password: '123456',
          email: 'ppaAlla@gmail.com',
          isAdmin: true,
        },
        {
          first_name: 'allausa',
          last_name: 'manugasa',
          password: '123456',
          email: 'treas@gmail.com',
          isAdmin: true,
        },
        {
          first_name: 'allausa',
          last_name: 'manugasa',
          password: '123456',
          email: 'ggha@gmail.com',
          isAdmin: true,
        },
      ];

      await User.collection.insertMany(users);
    });
    afterEach(async () => {
      await server.close();
      await User.remove({});
    });
    it('should return 401 if user is not logged in', async () => {
      token = '';
      const res = await request(server)
        .get('/api/users')
        .set('x-auth-token', token);
      expect(res.status).toBe(401);
    });
    it('should return 403 if user is not admin', async () => {
      token = new User().generateAuthToken();

      const res = await request(server)
        .get('/api/users')
        .set('x-auth-token', token);
      expect(res.status).toBe(403);
    });
    it('should return the users if valid', async () => {
      const res = await request(server)
        .get('/api/users')
        .set('x-auth-token', token);
      expect(res.status).toBe(200);
    });
  });
  describe('GET /me', () => {
    let token;
    let user;
    beforeEach(async () => {
      server = require('../../index');

      user = new User({
        first_name: 'israel',
        last_name: 'favour',
        password: '123456',
        email: 'pp123@gmail.com',
        isAdmin: true,
      });

      user.save();
      token = user.generateAuthToken();
    });
    afterEach(async () => {
      await server.close();
      await User.remove();
    });

    it('should return 401 if user is not logged in', async () => {
      token = '';
      const res = await request(server)
        .get('/api/users/me')
        .set('x-auth-token', token);
      expect(res.status).toBe(401);
    });
    it('should return user if valid', async () => {
      const res = await request(server)
        .get('/api/users/me')
        .set('x-auth-token', token);
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('data.first_name');
    });
  });
  describe('POST /', () => {
    let user;
    let oldUser;

    const exec = async () => {
      return await request(server).post('/api/users/sign-up').send(user);
    };
    beforeEach(async () => {
      server = require('../../index');

      user = {
        first_name: 'israel',
        last_name: 'pplaing',
        email: 'appling@gmail.com',
        password: '123456',
        isAdmin: true,
      };

      oldUser = new User({
        first_name: 'pling',
        last_name: 'blonge',
        email: 'ppp123@gmail.com',
        password: '123456',
      });
      await oldUser.save();
    });
    afterEach(async () => {
      await server.close({});
      await User.remove({});
    });
    it('should return 400 if first_name is missing', async () => {
      user = {
        last_name: 'pplaing',
        email: 'appling@gmail.com',
        password: '123456',
        isAdmin: true,
      };
      const res = await exec();

      expect(res.status).toBe(400);
    });
    it('should return 400 if last_name is missing', async () => {
      user = {
        first_name: 'israel',
        email: 'appling@gmail.com',
        password: '123456',
        isAdmin: true,
      };
      const res = await exec();

      expect(res.status).toBe(400);
    });
    it('should return 400 if email is missing', async () => {
      user = {
        first_name: 'israel',
        last_name: 'pplaing',
        password: '123456',
        isAdmin: true,
      };
      const res = await exec();

      expect(res.status).toBe(400);
    });
    it('should return 400 if password is missing', async () => {
      user = {
        first_name: 'israel',
        last_name: 'pplaing',
        email: 'appling@gmail.com',
        isAdmin: true,
      };
      const res = await exec();

      expect(res.status).toBe(400);
    });
    it('should return 400 if user is exists', async () => {
      user = {
        first_name: 'israel',
        last_name: 'pplaing',
        email: 'ppp123@gmail.com',
        password: '123456',
        isAdmin: true,
      };
      const res = await exec();

      expect(res.status).toBe(400);
    });
    it('should reutrn the user if valid', async () => {
      const res = await exec();
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('data.userDetails');
    });
  });
});
