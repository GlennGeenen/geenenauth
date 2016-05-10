'use strict';

const Assert = require('assert');
const Hapi = require('hapi');
const Lab = require('lab');
const lab = exports.lab = Lab.script();

lab.experiment('Auth Plugin', () => {

  const secret = 'BestSecretEver';

  const getServer = function getServer() {

    const server = new Hapi.Server();
    server.connection({
      port: 8080
    });
    return server;
  };

  lab.experiment('register plugin', () => {

    lab.test('should require secret', (done) => {

      const callback = function (err) {

        Assert(err);
        done();
      };

      getServer().register({
        register: require('../index'),
        options: {
          audience: 'test'
        }
      }, callback);
    });

    lab.test('should require audience', (done) => {

      const callback = function (err) {

        Assert(err);
        done();
      };

      getServer().register({
        register: require('../index'),
        options: {
          secret: secret
        }
      }, callback);
    });

    lab.test('should register', (done) => {

      getServer().register({
        register: require('../index'),
        options: {
          secret: secret,
          audience: 'test'
        }
      }, done);
    });

    lab.test('should register', (done) => {

      getServer().register({
        register: require('../index'),
        options: {
          secret: secret,
          issuer: 'test',
          audience: 'test',
          userRoles: ['test'],
          adminRoles: ['admin']
        }
      }, done);
    });
  });
});
