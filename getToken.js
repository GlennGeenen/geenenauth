'use strict';

const Jwt = require('jsonwebtoken');

const getToken = function (pluginOptions) {

  const tokenOptions = {
    algorithm: 'HS512',
    expiresIn: '6h',
    issuer: pluginOptions.issuer,
    audience: pluginOptions.audience
  };

  return function signToken(user, secretOrPrivateKey, options, callback) {

    let opts;
    let cb;
    let secret = pluginOptions.secret;
    if (secretOrPrivateKey instanceof Function) {
      cb = secretOrPrivateKey;
      opts = tokenOptions;
    }
    else if (options instanceof Function) {
      if (secretOrPrivateKey instanceof Object) {
        opts = Object.assign({}, tokenOptions, secretOrPrivateKey);
      }
      else {
        secret = secretOrPrivateKey;
      }
      cb = options;
    }
    else {
      secret = secretOrPrivateKey;
      opts = Object.assign({}, tokenOptions, options);
      cb = callback;
    }

    if (!user || !user.userid || !user.username || !user.role) {
      return cb(new Error('No valid user provided.'));
    }

    const tokenData = {
      userid: user.userid,
      username: user.username,
      role: user.role
    };

    if (opts.expiresIn === null) {
      delete opts.expiresIn;
    }

    Jwt.sign(tokenData, secret, opts, cb);
  };

};

module.exports = getToken;
