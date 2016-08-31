'use strict';

const Jwt = require('jsonwebtoken');

const getToken = function (pluginOptions) {

  const tokenOptions = {
    algorithm: 'HS512',
    expiresIn: '6h',
    issuer: pluginOptions.issuer,
    audience: pluginOptions.audience
  };

  return function (user, options, callback) {

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

    Jwt.sign(tokenData, pluginOptions.secret, opts, cb);
  };

};

module.exports = getToken;
