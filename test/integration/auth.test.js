const request = require('supertest');
const { User } = require('../../models/user');
const _ = require('lodash');

describe('/api/auth', () => {
  let server;
  let token;
  let email;
  let password;
  let user;

  describe('/sign-in', () => {
    const exec = async () => {
      return request(server)
        .post('/api/auth/sign-in')
        .send({ email: 'pprial@gmail.com', password: 'password' });
    };

    beforeEach(async () => {
      server = require('../../index');

      email = 'pprial@gmail.com';
      user = new User({
        first_name: 'ahmed',
        last_name: 'musalas',
        email: email,
        password: 'password',
      });
      user.save();
    });
    afterEach(async () => {
      await server.close({});
      await User.remove({});
    });
    it('should return 400 if email is not provided', async () => {
      email = '';
      const res = await exec();
      expect(res.status).toBe(400);
    });
    it('should return 400 if password is not provided', async () => {
      password = '';
      const res = await exec();
      expect(res.status).toBe(400);
    });
    // it('should return 404 if user is not found', async () => {
    //   user = '';
    //   const res = await exec();

    //   expect(res.status).toBe(404);
    // });
    it('should return 400 if passwod is incorrect', async () => {
      password = '1000000';

      const res = await exec();
      expect(res.status).toBe(400);
    });
    // it('should return user if valid', async () => {
    //   const res = await exec();
    //   expect(res.status).toBe(200);
    // });
  });
});
