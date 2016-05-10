'use strict';

const Assert = require('assert');
const Lab = require('lab');
const lab = exports.lab = Lab.script();

lab.experiment('getToken', () => {

  const getToken = require('../getToken')({
    secret: 'BestSecretEver',
    issuer: 'test',
    audience: 'test'
  });

  lab.test('should get Token', (done) => {

    getToken({
      userid: 'lala',
      username: 'test',
      role: 'test'
    }, (err, token) => {

      Assert(!err);
      Assert(token);
      done();
    });
  });

  lab.test('should send user', (done) => {

    getToken(null, (err) => {

      Assert(err);
      done();
    });
  });

  lab.test('should have userid', (done) => {

    getToken({
      username: 'test',
      role: 'test'
    }, (err) => {

      Assert(err);
      done();
    });
  });

  lab.test('should have username', (done) => {

    getToken({
      userid: 'lala',
      role: 'test'
    }, (err) => {

      Assert(err);
      done();
    });
  });

  lab.test('should have role', (done) => {

    getToken({
      userid: 'lala',
      username: 'test'
    }, (err) => {

      Assert(err);
      done();
    });
  });

});
