'use strict';

const isAdmin = function (options) {

  return function (decodedToken) {

    return options.adminRoles.indexOf(decodedToken.role) !== -1;
  };
};

const isPowerUser = function(options) {

  return function (decodedToken) {

    return options.powerUserRoles.indexOf(decodedToken.role) !== -1;
  };
}

module.exports = {
  isAdmin,
  isPowerUser,
};
