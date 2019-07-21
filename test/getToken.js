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
  });

  lab.test('should get Token', async () => {

    const token = await getToken({
      userid: 'lala',
      username: 'test',
      role: 'test'
    });

    Assert(token !== undefined);

    const decoded = await Jwt.verify(token, 'BestSecretEver');

    Assert(decoded.userid === 'lala');
    Assert(decoded.username === 'test');
    Assert(decoded.role === 'test');
    Assert(decoded.iss === 'test');
    Assert(decoded.aud === 'test');

    Assert(decoded.iat !== undefined);
    Assert(decoded.exp !== undefined);
  });

  lab.test('should send user', async () => {

    let error = null;
    try {
      await getToken(null);
    } catch (err) {
      error = err;
    }
    Assert(error);
  });

  lab.test('should have userid', async () => {

    let error = null;
    try {
      await getToken({
        username: 'test',
        role: 'test'
      });
    } catch (err) {
      error = err;
    }
    Assert(error);
  });

  lab.test('should have username', async () => {

    let error = null;
    try {
      await getToken({
        userid: 'test',
        role: 'test'
      });
    } catch (err) {
      error = err;
    }
    Assert(error);
  });

  lab.test('should have role', async () => {

    let error = null;
    try {
      await getToken({
        userid: 'test',
        username: 'test'
      });
    } catch (err) {
      error = err;
    }
    Assert(error);
  });

  lab.test('should set token options', async () => {

    const token = await getToken({
      userid: 'lala',
      username: 'test',
      role: 'test'
    }, {
      noTimestamp: true
    });

    Assert(token !== undefined);

    const decoded = await Jwt.verify(token, 'BestSecretEver');
    Assert(decoded.iat === undefined);
  });

});
