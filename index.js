'use strict';

const JwtAuth = require('hapi-auth-jwt2');
const Validator = require('./validator');
const GetToken = require('./getToken');
const VerifyToken = require('./verifyToken');

exports.register = function (server, options, next) {

  if (!options.secret) {
    return next(new Error('No private key provided.'));
  }

  if (!options.audience) {
    return next(new Error('No audience provided.'));
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

  const onRegister = function (err) {

    if (err || !Array.isArray(options.strategies)) {
      return next(err);
    }

    const tokenOptions = {
      algorithms: 'HS512',
      issuer: options.issuer,
      audience: options.audience
    };

    options.strategies.forEach((strat) => {

      const strategyOptions = Object.assign({}, options, strat);
      server.auth.strategy(strat.name, 'jwt', {
        key: options.secret,
        validateFunc: Validator(strategyOptions),
        verifyOptions: tokenOptions
      });
    });

    return next(err);
  };

  return server.register(JwtAuth, onRegister);
};

exports.register.attributes = {
  pkg: require('./package.json')
};
