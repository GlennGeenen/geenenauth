'use strict';

const JwtAuth = require('hapi-auth-jwt2');

const Validator = require('./validator');
const GetToken = require('./getToken');
const VerifyToken = require('./verifyToken');

const register = async (server, options) => {

  if (!options.secret) {
    throw new Error('No private key provided.');
  }

  if (!options.audience) {
    throw new Error('No audience provided.');
  }

  if (!options.issuer) {
    options.issuer = 'GeenenTijd';
  }

  if (!options.mustExpire) {
    options.mustExpire = true;
  }

  // Register getToken method
  server.method('getToken', GetToken(options));
  server.method('verifyToken', VerifyToken(options));

  await server.register(JwtAuth);

  const tokenOptions = {
    algorithms: 'HS512',
    issuer: options.issuer,
    audience: options.audience
  };

  if (options.strategies) {
    options.strategies.forEach((strat) => {

      const strategyOptions = Object.assign({}, options, strat);
      server.auth.strategy(strat.name, 'jwt', {
        key: options.secret,
        validate: Validator(strategyOptions),
        verifyOptions: tokenOptions
      });
    });
  }

  return null;
};

exports.plugin = {
  pkg: require('./package.json'),
  requirements: {
    hapi: '>=17'
  },
  register
};
