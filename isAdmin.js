'use strict';

const isAdmin = function (options) {

  return function (decodedToken) {

    return options.adminRoles.indexOf(decodedToken.role) !== -1;
  };
};

module.exports = isAdmin;
