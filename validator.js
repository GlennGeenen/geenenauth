'use strict';

const Boom = require('boom');

const validate = (decodedToken, options, callback) => {

  if (!decodedToken.iat ||
    !decodedToken.exp ||
    !decodedToken.userid ||
    !decodedToken.username ||
    decodedToken.iss !== options.issuer ||
    decodedToken.aud !== options.audience) {
    return callback(Boom.forbidden(), false, decodedToken);
  }
  if (options.roles && options.roles.length &&
    !options.roles.includes(decodedToken.role)) {
    return callback(Boom.forbidden(), false, decodedToken);
  }
  return callback(null, true, decodedToken);
};

const getValidationFunction = (options) => {

  return (decodedToken, request, callback) => {

    validate(decodedToken, options, callback);
  };
};

module.exports = getValidationFunction;
