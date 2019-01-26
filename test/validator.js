'use strict';

const Assert = require('assert');
const Lab = require('lab');
const lab = exports.lab = Lab.script();

lab.experiment('Validator', () => {

  const Validator = require('../validator');
  const options = {
    secret: 'IAmTheSecret',
    issuer: 'GeenenIssuer',
    audience: 'GeenenAudience',
    roles: ['user', 'admin'],
    adminRoles: ['admin'],
    mustExpire: true
  };

  lab.test('jwt should have issuer', (done) => {

    const token = {
      userid: 'c0cb1883-e8c6-4efa-8561-4ad4f4c14518',
      username: 'glenn',
      role: 'user',
      iat: Math.round(Date.now() / 1000) - 60,
      exp: Math.round(Date.now() / 1000) + 60,
      aud: options.audience
    };

    const reply = function (err, valid, decoded) {

      Assert(err !== null);
      Assert(valid === false);

      done();
    };

    const opts = Object.assign({}, options, { roles: ['user'] });
    Validator(opts)(token, null, reply);
  });

  lab.test('jwt should have audience', (done) => {

    const token = {
      userid: 'c0cb1883-e8c6-4efa-8561-4ad4f4c14518',
      username: 'glenn',
      role: 'user',
      iat: Math.round(Date.now() / 1000) - 60,
      exp: Math.round(Date.now() / 1000) + 60,
      iss: options.issuer
    };

    const reply = function (err, valid, decoded) {

      Assert(err !== null);
      Assert(valid === false);

      done();
    };

    const opts = Object.assign({}, options, { roles: ['user'] });
    Validator(opts)(token, null, reply);
  });

  lab.test('jwt should have userid', (done) => {

    const token = {
      username: 'glenn',
      role: 'user',
      iat: Math.round(Date.now() / 1000) - 60,
      exp: Math.round(Date.now() / 1000) + 60,
      iss: options.issuer,
      aud: options.audience
    };

    const reply = function (err, valid, decoded) {

      Assert(err !== null);
      Assert(valid === false);

      done();
    };

    const opts = Object.assign({}, options, { roles: ['user'] });
    Validator(opts)(token, null, reply);
  });

  lab.test('jwt should have username', (done) => {

    const token = {
      userid: 'c0cb1883-e8c6-4efa-8561-4ad4f4c14518',
      role: 'user',
      iat: Math.round(Date.now() / 1000) - 60,
      exp: Math.round(Date.now() / 1000) + 60,
      iss: options.issuer,
      aud: options.audience
    };

    const reply = function (err, valid, decoded) {

      Assert(err !== null);
      Assert(valid === false);

      done();
    };

    const opts = Object.assign({}, options, { roles: ['user'] });
    Validator(opts)(token, null, reply);
  });

  lab.test('jwt should have iat', (done) => {

    const token = {
      userid: 'c0cb1883-e8c6-4efa-8561-4ad4f4c14518',
      username: 'glenn',
      role: 'user',
      exp: Math.round(Date.now() / 1000) + 60,
      iss: options.issuer,
      aud: options.audience
    };

    const reply = function (err, valid, decoded) {

      Assert(err !== null);
      Assert(valid === false);

      done();
    };

    const opts = Object.assign({}, options, { roles: ['user'] });
    Validator(opts)(token, null, reply);
  });

  lab.test('jwt should have exp', (done) => {

    const token = {
      userid: 'c0cb1883-e8c6-4efa-8561-4ad4f4c14518',
      username: 'glenn',
      role: 'user',
      iat: Math.round(Date.now() / 1000) - 60,
      iss: options.issuer,
      aud: options.audience
    };

    const reply = function (err, valid, decoded) {

      Assert(err !== null);
      Assert(valid === false);

      done();
    };

    const opts = Object.assign({}, options, { roles: ['user'] });
    Validator(opts)(token, null, reply);
  });

  lab.test('jwt should be valid user', (done) => {

    const token = {
      userid: 'c0cb1883-e8c6-4efa-8561-4ad4f4c14518',
      username: 'glenn',
      role: 'user',
      iat: Math.round(Date.now() / 1000) - 60,
      exp: Math.round(Date.now() / 1000) + 60,
      iss: options.issuer,
      aud: options.audience
    };

    const reply = function (err, valid, decoded) {

      Assert(err === null);
      Assert(valid === true);

      Assert(decoded.username === token.username);
      Assert(decoded.role === token.role);
      Assert(decoded.iat === token.iat);
      Assert(decoded.exp === token.exp);
      Assert(decoded.iss === token.iss);
      Assert(decoded.aud === token.aud);

      done();
    };

    const opts = Object.assign({}, options, { roles: ['user'] });
    Validator(opts)(token, null, reply);
  });

  lab.test('jwt should be valid admin', (done) => {

    const token = {
      userid: 'c0cb1883-e8c6-4efa-8561-4ad4f4c14518',
      username: 'glenn',
      role: 'admin',
      iat: Math.round(Date.now() / 1000) - 60,
      exp: Math.round(Date.now() / 1000) + 60,
      iss: options.issuer,
      aud: options.audience
    };

    const reply = function (err, valid, decoded) {

      Assert(err === null);
      Assert(valid === true);

      Assert(decoded.username === token.username);
      Assert(decoded.role === token.role);
      Assert(decoded.iat === token.iat);
      Assert(decoded.exp === token.exp);
      Assert(decoded.iss === token.iss);
      Assert(decoded.aud === token.aud);

      done();
    };

    const opts = Object.assign({}, options, { roles: ['admin', 'superadmin'] });
    Validator(opts)(token, null, reply);
  });

  lab.test('jwt should be valid', (done) => {

    const token = {
      userid: 'c0cb1883-e8c6-4efa-8561-4ad4f4c14518',
      username: 'glenn',
      iat: Math.round(Date.now() / 1000) - 60,
      exp: Math.round(Date.now() / 1000) + 60,
      iss: options.issuer,
      aud: options.audience
    };

    const reply = function (err, valid, decoded) {

      Assert(err !== null);
      Assert(valid === false);

      done();
    };

    Validator(options)(token, null, reply);
  });
});
