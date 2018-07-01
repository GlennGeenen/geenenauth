'use strict';

const JwtAuth = require('hapi-auth-jwt2');
const AuthUtil = require('./authUtil');

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

  if (!options.userRoles) {
    options.userRoles = ['user', 'editor'];
  }

  if (!options.adminRoles) {
    options.adminRoles = ['admin', 'superadmin'];
  }

  // Admin roles are also user roles
  options.userRoles = options.userRoles.concat(options.adminRoles);

  // Register isAdmin method
  server.method('isAdmin', require('./isAdmin')(options));

  // Register getToken method
  server.method('getToken', require('./getToken')(options));

  // Register getToken method
  const tokenUtils = require('./tokenUtils')(options);
  server.method('getTokenEx', tokenUtils.getTokenEx);
  server.method('verifyTokenEx', tokenUtils.verifyTokenEx);

  const onRegister = function (err) {

    const tokenOptions = {
      algorithms: 'HS512',
      issuer: options.issuer,
      audience: options.audience
    };

    server.auth.strategy('jwtUser', 'jwt', {
      key: options.secret,
      validateFunc: AuthUtil.validUser(options),
      verifyOptions: tokenOptions
    });

    server.auth.strategy('jwtAdmin', 'jwt', {
      key: options.secret,
      validateFunc: AuthUtil.validAdmin(options),
      verifyOptions: tokenOptions
    });

    return next(err);
  };

  return server.register(JwtAuth, onRegister);
};

exports.register.attributes = {
  pkg: require('./package.json')
};
