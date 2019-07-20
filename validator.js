'use strict';

const validate = (decodedToken, options) => {

  if (!decodedToken.iat ||
    (options.mustExpire && !decodedToken.exp) ||
    !decodedToken.userid ||
    !decodedToken.username ||
    decodedToken.iss !== options.issuer ||
    decodedToken.aud !== options.audience) {
    return { isValid: false, decodedToken };
  }

  if (options.roles && options.roles.length &&
    !options.roles.includes(decodedToken.role)) {
    return { isValid: false, decodedToken };
  }

  return { isValid: true, decodedToken };
};

const getValidationFunction = (options) => {

  return (decodedToken, request) => {

    return validate(decodedToken, options);
  };
};

module.exports = getValidationFunction;
