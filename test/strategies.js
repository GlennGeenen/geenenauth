'use strict';

const Assert = require('assert');
const Hapi = require('hapi');
const Lab = require('lab');
const lab = exports.lab = Lab.script();

lab.experiment('Auth Plugin', () => {

  let server;
  const tokenOptions = {
    secret: 'BestSecretEver',
    issuer: 'test',
    audience: 'test'
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
        handler: function (request, reply) {

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
  });

  lab.experiment('test jwtAdmin', () => {

    lab.before((done) => {

      server.route({
        method: 'GET',
        path: '/jwtAdmin',
        config: {
          auth: {
            strategy: 'jwtAdmin'
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
        url: '/jwtAdmin'
      };

      server.inject(options, (response) => {

        Assert(response.statusCode === 401);
        done();
      });
    });

    lab.test('should require valid token', (done) => {

      const options = {
        method: 'GET',
        url: '/jwtAdmin',
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
          url: '/jwtAdmin',
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
          url: '/jwtAdmin',
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
