'use strict';

const Joi = require('joi');
const Boom = require('boom');

const getSchema = function (roles, issuer, audience) {

  return Joi.object({
    userid: Joi.string().guid().required(),
    username: Joi.string().min(3).required(),
    role: Joi.string().valid(roles).required(),
    iat: Joi.date().timestamp('unix').max('now').required(),
    exp: Joi.date().timestamp('unix').min('now').required(),
    iss: Joi.any().valid(issuer).required(),
    aud: Joi.any().valid(audience).required()
  });
};

const validate = function (decodedToken, schema, callback) {

  const validated = function (err) {

    if (err) {
      const error = Boom.wrap(err, 403);
      return callback(error, false, decodedToken);
    }

    return callback(null, true, decodedToken);
  };

  Joi.validate(decodedToken, schema, validated);
};

const validUser = function (options) {

  return function (decodedToken, request, callback) {

    const schema = getSchema(options.userRoles, options.issuer, options.audience);
    validate(decodedToken, schema, callback);
  };
};

const validAdmin = function (options) {

  return function (decodedToken, request, callback) {

    const schema = getSchema(options.adminRoles, options.issuer, options.audience);
    validate(decodedToken, schema, callback);
  };
};

module.exports = {
  validate,
  validUser,
  validAdmin
};
