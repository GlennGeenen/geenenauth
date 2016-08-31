'use strict';

const Assert = require('assert');
const Jwt = require('jsonwebtoken');
const Lab = require('lab');
const lab = exports.lab = Lab.script();

lab.experiment('getToken', () => {

  const getToken = require('../getToken')({
    secret: 'BestSecretEver',
    issuer: 'test',
    audience: 'test',
    userRoles: ['test']
  });

  lab.test('should get Token', (done) => {

    getToken({
      userid: 'lala',
      username: 'test',
      role: 'test'
    }, (err, token) => {

      Assert(err === null);
      Assert(token !== undefined);

      Jwt.verify(token, 'BestSecretEver', (err, decoded) => {

        Assert(err === null);
        Assert(decoded.userid === 'lala');
        Assert(decoded.username === 'test');
        Assert(decoded.role === 'test');
        Assert(decoded.iss === 'test');
        Assert(decoded.aud === 'test');

        Assert(decoded.iat !== undefined);
        Assert(decoded.exp !== undefined);
        done();
      });
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

  lab.test('should have valid role', (done) => {

    getToken({
      userid: 'lala',
      username: 'test',
      role: 'role'
    }, (err, token) => {

      Assert(err);
      done();
    });
  });

  lab.test('should set token options', (done) => {

    getToken({
      userid: 'lala',
      username: 'test',
      role: 'test'
    }, {
      issuer: 'trol',
      noTimestamp: true
    }, (err, token) => {

      Assert(err === null);
      Assert(token !== undefined);
      Jwt.verify(token, 'BestSecretEver', (err, decoded) => {

        Assert(err === null);
        Assert(decoded.iss === 'trol');
        Assert(decoded.iat === undefined);
        done();
      });
    });
  });

});
