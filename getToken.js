'use strict';

const Jwt = require('jsonwebtoken');

const getToken = (pluginOptions) => {

  const tokenOptions = {
    algorithm: 'HS512',
    expiresIn: '6h',
    issuer: pluginOptions.issuer,
    audience: pluginOptions.audience
  };

  return (user, secretOrPrivateKey, options) => {

    let opts = tokenOptions;
    let secret = pluginOptions.secret;
    if (!user || !user.userid || !user.username || !user.role) {
      throw new Error('No valid user provided.');
    }

    if (options) {
      secret = secretOrPrivateKey;
      opts = Object.assign({}, tokenOptions, options);
    }
    else if (secretOrPrivateKey) {
      if (secretOrPrivateKey instanceof Object) {
        opts = Object.assign({}, tokenOptions, secretOrPrivateKey);
      }
      else {
        secret = secretOrPrivateKey;
      }
    }

    const tokenData = {
      userid: user.userid,
      username: user.username,
      role: user.role
    };

    if (opts.expiresIn === null) {
      delete opts.expiresIn;
    }

    return Jwt.sign(tokenData, secret, opts);
  };
};

module.exports = getToken;
