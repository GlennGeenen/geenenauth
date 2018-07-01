'use strict';

const Jwt = require('jsonwebtoken');

module.exports = function (pluginOptions) {

  const tokenOptions = {
    algorithm: 'HS512',
    expiresIn: '6h',
    issuer: pluginOptions.issuer,
    audience: pluginOptions.audience
  };

  const getTokenEx = function (secret, user, options, callback) {

    let opts;
    let cb;
    if (options instanceof Function) {
      cb = options;
      opts = tokenOptions;
    }
    else {
      cb = callback;
      opts = Object.assign({}, tokenOptions, options);
    }

    if (!user || !user.userid || !user.username || !user.role ||
        pluginOptions.userRoles.indexOf(user.role) === -1) {
      return cb(new Error('No valid user provided.'));
    }

    const tokenData = {
      userid: user.userid,
      username: user.username,
      role: user.role
    };

    Jwt.sign(tokenData, secret || pluginOptions.secret, opts, cb);
  };

  const verifyTokenEx = function (secret, token, options, callback)  {

    let opts;
    let cb;
    if (options instanceof Function) {
      cb = options;
      opts = tokenOptions;
    }
    else {
      cb = callback;
      opts = Object.assign({}, tokenOptions, options);
    }

    Jwt.verify(token, secret, opts, cb)
  };

  return {getTokenEx, verifyTokenEx};
};
