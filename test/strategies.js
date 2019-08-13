'use strict';

const Assert = require('assert');
const Hapi = require('@hapi/hapi');
const Lab = require('lab');

const lab = exports.lab = Lab.script();

// We are going to do some timebending
const Lolex = require('lolex');

lab.experiment('Auth Plugin', () => {

  let server;
  const tokenOptions = {
    secret: 'BestSecretEver',
    issuer: 'test',
    audience: 'test',
    strategies: [{
      name: 'jwtUser',
      roles: ['user']
    }, {
      name: 'adminAuth',
      roles: ['admin']
    }]
  };

  lab.before(async () => {

    server = new Hapi.Server({
      port: 3010
    });

    await server.register({
      plugin: require('../index'),
      options: tokenOptions
    });
  });

  lab.experiment('test jwtUser', () => {

    lab.before(() => {

      server.route({
        method: 'GET',
        path: '/jwtUser',
        config: {
          auth: {
            strategy: 'jwtUser'
          }
        },
        handler: (request, reply) => {

          return { message: 'success' };
        }
      });
    });

    lab.test('should require authentication', async () => {

      const options = {
        method: 'GET',
        url: '/jwtUser'
      };

      const response = await server.inject(options);
      Assert(response.statusCode === 401);
    });

    lab.test('should require valid token', async () => {

      const options = {
        method: 'GET',
        url: '/jwtUser',
        headers: {
          authorization: 'Bearer sdsfg5dsfg156ad5g1sg5f1g5sd1gre56asg1'
        }
      };

      const response = await server.inject(options);
      Assert(response.statusCode === 401);
    });

    lab.test('should return success for user', async () => {

      const token = await server.methods.getToken({
        userid: 'c0cb1883-e8c6-4efa-8561-4ad4f4c14518',
        username: 'glenn',
        role: 'user'
      });

      const options = {
        method: 'GET',
        url: '/jwtUser',
        headers: {
          authorization: `Bearer ${token}`
        }
      };

      const response = await server.inject(options);
      Assert(response.statusCode === 200);
      Assert(response.result.message === 'success');
    });

    lab.test('should fail for admin', async () => {

      const token = await server.methods.getToken({
        userid: 'c0cb1883-e8c6-4efa-8561-4ad4f4c14518',
        username: 'glenn',
        role: 'admin'
      });

      const options = {
        method: 'GET',
        url: '/jwtUser',
        headers: {
          authorization: `Bearer ${token}`
        }
      };

      const response = await server.inject(options);
      Assert.equal(response.statusCode, 401);
    });
  });

  lab.experiment('test adminAuth', () => {

    lab.before(() => {

      server.route({
        method: 'GET',
        path: '/adminAuth',
        config: {
          auth: {
            strategy: 'adminAuth'
          }
        },
        handler: function (request, reply) {

          return { message: 'success' };
        }
      });
    });

    lab.test('should require authentication', async () => {

      const options = {
        method: 'GET',
        url: '/adminAuth'
      };

      const response = await server.inject(options);
      Assert(response.statusCode === 401);
    });

    lab.test('should require valid token', async () => {

      const options = {
        method: 'GET',
        url: '/adminAuth',
        headers: {
          authorization: 'Bearer sdsfg5dsfg156ad5g1sg5f1g5sd1gre56asg1'
        }
      };

      const response = await server.inject(options);
      Assert(response.statusCode === 401);
    });

    lab.test('should return 401 for user', async () => {

      const token = await server.methods.getToken({
        userid: 'c0cb1883-e8c6-4efa-8561-4ad4f4c14518',
        username: 'glenn',
        role: 'user'
      });

      const options = {
        method: 'GET',
        url: '/adminAuth',
        headers: {
          authorization: `Bearer ${token}`
        }
      };

      const response = await server.inject(options);
      Assert.equal(response.statusCode, 401);
    });

    lab.test('should be expired', async () => {

      const token = await server.methods.getToken({
        userid: 'c0cb1883-e8c6-4efa-8561-4ad4f4c14518',
        username: 'glenn',
        role: 'admin'
      });

      // We forward time to tomorrow
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const clock = Lolex.install({ now: tomorrow });

      const options = {
        method: 'GET',
        url: '/adminAuth',
        headers: {
          authorization: `Bearer ${token}`
        }
      };

      const response = await server.inject(options);

      // We reset time
      clock.uninstall();
      Assert(response.statusCode === 401);
    });

    lab.test('should not expire token', async () => {

      const token = await server.methods.getToken({
        userid: 'c0cb1883-e8c6-4efa-8561-4ad4f4c14518',
        username: 'glenn',
        role: 'admin'
      }, {
        expiresIn: '1y'
      });

      // We forward time to tomorrow
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const clock = Lolex.install({ now: tomorrow });

      const options = {
        method: 'GET',
        url: '/adminAuth',
        headers: {
          authorization: `Bearer ${token}`
        }
      };

      const response = await server.inject(options);

      // We reset time
      clock.uninstall();
      Assert(response.statusCode === 200, `${response.statusCode} should equal 200`);
      Assert(response.result.message === 'success');
    });

    lab.test('should return success for admin', async () => {

      const token = await server.methods.getToken({
        userid: 'c0cb1883-e8c6-4efa-8561-4ad4f4c14518',
        username: 'glenn',
        role: 'admin'
      });

      const options = {
        method: 'GET',
        url: '/adminAuth',
        headers: {
          authorization: `Bearer ${token}`
        }
      };

      const response = await server.inject(options);

      Assert(response.statusCode === 200);
      Assert(response.result.message === 'success');
    });
  });
});
