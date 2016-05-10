'use strict';

const Assert = require('assert');
const Lab = require('lab');
const lab = exports.lab = Lab.script();

lab.experiment('isAdmin', () => {

  const isAdmin = require('../isAdmin')({
    adminRoles: ['admin']
  });

  lab.test('should not have adminRole', (done) => {

    Assert(!isAdmin({ role: 'user' }));
    Assert(!isAdmin({ role: 'random' }));
    Assert(!isAdmin({ role: 'adm' }));
    Assert(!isAdmin({ role: 'Admin' }));
    done();
  });

  lab.test('should have adminRole', (done) => {

    Assert(isAdmin({ role: 'admin' }));
    done();
  });

});
