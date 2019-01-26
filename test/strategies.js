'use strict';

const Assert = require('assert');
const Hapi = require('hapi');
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

  lab.before((done) => {

    server = new Hapi.Server();
    server.connection({
      port: 3010
    });
    server.register({
      register: require('../index'),
      options: tokenOptions
    }, done);
  });

  lab.experiment('test jwtUser', () => {

    lab.before((done) => {

      server.route({
        method: 'GET',
        path: '/jwtUser',
        config: {
          auth: {
            strategy: 'jwtUser'
          }
        },
        handler: (request, reply) => {

          reply({ message: 'success' });
        }
      });
      done();
    });

    lab.test('should require authentication', (done) => {

      const options = {
        method: 'GET',
        url: '/jwtUser'
      };

      server.inject(options, (response) => {

        Assert(response.statusCode === 401);
        done();
      });
    });

    lab.test('should require valid token', (done) => {

      const options = {
        method: 'GET',
        url: '/jwtUser',
        headers: {
          authorization: 'Bearer sdsfg5dsfg156ad5g1sg5f1g5sd1gre56asg1'
        }
      };

      server.inject(options, (response) => {

        Assert(response.statusCode === 401);
        done();
      });
    });

    lab.test('should return success for user', (done) => {

      server.methods.getToken({
        userid: 'c0cb1883-e8c6-4efa-8561-4ad4f4c14518',
        username: 'glenn',
        role: 'user'
      }, (err, token) => {

        if (err) {
          return done(err);
        }

        const options = {
          method: 'GET',
          url: '/jwtUser',
          headers: {
            authorization: `Bearer ${token}`
          }
        };

        server.inject(options, (response) => {

          Assert(response.statusCode === 200);
          Assert(response.result.message === 'success');
          done();
        });

      });
    });

    lab.test('should fail for admin', (done) => {

      server.methods.getToken({
        userid: 'c0cb1883-e8c6-4efa-8561-4ad4f4c14518',
        username: 'glenn',
        role: 'admin'
      }, (err, token) => {

        if (err) {
          return done(err);
        }

        const options = {
          method: 'GET',
          url: '/jwtUser',
          headers: {
            authorization: `Bearer ${token}`
          }
        };

        server.inject(options, (response) => {

          Assert(response.statusCode === 403);
          done();
        });

      });
    });
  });

  lab.experiment('test adminAuth', () => {

    lab.before((done) => {

      server.route({
        method: 'GET',
        path: '/adminAuth',
        config: {
          auth: {
            strategy: 'adminAuth'
          }
        },
        handler: function (request, reply) {

          reply({ message: 'success' });
        }
      });
      done();
    });

    lab.test('should require authentication', (done) => {

      const options = {
        method: 'GET',
        url: '/adminAuth'
      };

      server.inject(options, (response) => {

        Assert(response.statusCode === 401);
        done();
      });
    });

    lab.test('should require valid token', (done) => {

      const options = {
        method: 'GET',
        url: '/adminAuth',
        headers: {
          authorization: 'Bearer sdsfg5dsfg156ad5g1sg5f1g5sd1gre56asg1'
        }
      };

      server.inject(options, (response) => {

        Assert(response.statusCode === 401);
        done();
      });
    });

    lab.test('should return 403 for user', (done) => {

      server.methods.getToken({
        userid: 'c0cb1883-e8c6-4efa-8561-4ad4f4c14518',
        username: 'glenn',
        role: 'user'
      }, (err, token) => {

        if (err) {
          return done(err);
        }

        const options = {
          method: 'GET',
          url: '/adminAuth',
          headers: {
            authorization: `Bearer ${token}`
          }
        };

        server.inject(options, (response) => {

          Assert(response.statusCode === 403);
          done();
        });

      });
    });

    lab.test('should be expired', (done) => {

      server.methods.getToken({
        userid: 'c0cb1883-e8c6-4efa-8561-4ad4f4c14518',
        username: 'glenn',
        role: 'admin'
      }, (err, token) => {

        if (err) {
          return done(err);
        }

        // We forward time to tomorrow
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const clock = Lolex.install(undefined, tomorrow);

        const options = {
          method: 'GET',
          url: '/adminAuth',
          headers: {
            authorization: `Bearer ${token}`
          }
        };

        server.inject(options, (response) => {

          // We reset time
          clock.uninstall();
          Assert(response.statusCode === 401);
          done();
        });
      });
    });

    lab.test('should not expire token', (done) => {

      server.methods.getToken({
        userid: 'c0cb1883-e8c6-4efa-8561-4ad4f4c14518',
        username: 'glenn',
        role: 'admin'
      }, {
        expiresIn: '1y'
      }, (err, token) => {

        if (err) {
          return done(err);
        }

        // We forward time to tomorrow
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const clock = Lolex.install(undefined, tomorrow);

        const options = {
          method: 'GET',
          url: '/adminAuth',
          headers: {
            authorization: `Bearer ${token}`
          }
        };

        server.inject(options, (response) => {

          // We reset time
          clock.uninstall();
          Assert(response.statusCode === 200, `${response.statusCode} should equal 200`);
          Assert(response.result.message === 'success');
          done();
        });
      });
    });

    lab.test('should return success for admin', (done) => {

      server.methods.getToken({
        userid: 'c0cb1883-e8c6-4efa-8561-4ad4f4c14518',
        username: 'glenn',
        role: 'admin'
      }, (err, token) => {

        if (err) {
          return done(err);
        }

        const options = {
          method: 'GET',
          url: '/adminAuth',
          headers: {
            authorization: `Bearer ${token}`
          }
        };

        server.inject(options, (response) => {

          Assert(response.statusCode === 200);
          Assert(response.result.message === 'success');
          done();
        });

      });
    });

  });
});
