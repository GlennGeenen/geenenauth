'use strict';

const Assert = require('assert');
const Hapi = require('hapi');
const Lab = require('lab');

const lab = exports.lab = Lab.script();

lab.experiment('Auth Plugin', () => {

  const secret = 'BestSecretEver';

  const getServer = function getServer() {

    const server = new Hapi.Server({
      port: 8080
    });
    return server;
  };

  lab.experiment('register plugin', () => {

    lab.test('should require secret', async () => {

      let error = null;
      try {
        await getServer().register({
          register: require('../index'),
          options: {
            audience: 'test'
          }
        });
      } catch (err) {
        error = err;
      }

      Assert(error);
      Assert(error.message === 'No private key provided.');
    });

    lab.test('should require audience', async () => {

      let error = null;
      try {
        await getServer().register({
          register: require('../index'),
          options: {
            secret
          }
        });
      } catch (err) {
        error = err;
      }

      Assert(error);
      Assert(error.message === 'No audience provided.');
    });

    lab.test('should register', async () => {

      await getServer().register({
        register: require('../index'),
        options: {
          secret,
          audience: 'test'
        }
      });
    });

    lab.test('should register', async () => {

      await getServer().register({
        register: require('../index'),
        options: {
          secret,
          issuer: 'test',
          audience: 'test'
        }
      });
    });

    lab.test('should register', async () => {

      await getServer().register({
        register: require('../index'),
        options: {
          secret,
          issuer: 'test',
          audience: 'test',
          strategies: []
        }
      });
    });

    lab.test('should register', async () => {

      await getServer().register({
        register: require('../index'),
        options: {
          secret,
          issuer: 'test',
          audience: 'test',
          strategies: [{
            name: 'one'
          }, {
            name: 'two',
            roles: ['two']
          }]
        }
      });
    });
  });
});
