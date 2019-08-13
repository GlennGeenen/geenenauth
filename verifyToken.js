'use strict';

const Jwt = require('jsonwebtoken');

const verifyToken = (pluginOptions) => {

  const tokenOptions = {
    algorithm: 'HS512',
    expiresIn: '6h',
    issuer: pluginOptions.issuer,
    audience: pluginOptions.audience
  };

  return function checkToken(token, secretOrPrivateKey, options, callback) {

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

    if (!token) {
      return cb(new Error('No token provided.'));
    }

    Jwt.verify(token, secret, opts, cb);
  };

};

module.exports = verifyToken;
