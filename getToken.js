'use strict';

const Jwt = require('jsonwebtoken');

const getToken = function (options) {

  const tokenOptions = {
    algorithm: 'HS512',
    expiresIn: '6h',
    issuer: options.issuer,
    audience: options.audience
  };

  return function (user, callback) {

    if (!user || !user.userid || !user.username || !user.role) {
      return callback(new Error('No valid user provided.'));
    }

    const tokenData = {
      userid: user.userid,
      username: user.username,
      role: user.role
    };

    Jwt.sign(tokenData, options.secret, tokenOptions, callback);
  };

};

module.exports = getToken;
