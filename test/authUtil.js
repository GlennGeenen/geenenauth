'use strict';

const Assert = require('assert');
const Lab = require('lab');
const lab = exports.lab = Lab.script();

lab.experiment('AuthUtil', () => {

  const AuthUtil = require('../authUtil');
  const options = {
    secret: 'IAmTheSecret',
    issuer: 'GeenenIssuer',
    audience: 'GeenenAudience',
    userRoles: ['user', 'admin'],
    adminRoles: ['admin']
  };

  lab.experiment('validUser', () => {

    const validUser = AuthUtil.validUser(options);

    lab.test('jwt should be valid (user role)', (done) => {

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

      validUser(token, null, reply);
    });

    lab.test('jwt should be valid (admin role)', (done) => {

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

      validUser(token, null, reply);
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

      validUser(token, null, reply);
    });

    lab.test('jwt should valid userid (guid)', (done) => {

      const token = {
        userid: 'c0cb1883-e8c6-4efa-8561',
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

      validUser(token, null, reply);
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

      validUser(token, null, reply);
    });

    lab.test('jwt should have role', (done) => {

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

      validUser(token, null, reply);
    });

    lab.test('jwt should have valid role', (done) => {

      const token = {
        userid: 'c0cb1883-e8c6-4efa-8561-4ad4f4c14518',
        username: 'glenn',
        role: 'unknown',
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

      validUser(token, null, reply);
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

      validUser(token, null, reply);
    });

    lab.test('jwt should have expire date', (done) => {

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

      validUser(token, null, reply);
    });

    lab.test('jwt should be expired', (done) => {

      const token = {
        userid: 'c0cb1883-e8c6-4efa-8561-4ad4f4c14518',
        username: 'glenn',
        role: 'user',
        iat: Math.round(Date.now() / 1000) - 60,
        exp: Math.round(Date.now() / 1000) - 30,
        iss: options.issuer,
        aud: options.audience
      };

      const reply = function (err, valid, decoded) {

        Assert(err !== null);
        Assert(valid === false);

        done();
      };

      validUser(token, null, reply);
    });

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

      validUser(token, null, reply);
    });

    lab.test('jwt should have valid issuer', (done) => {

      const token = {
        userid: 'c0cb1883-e8c6-4efa-8561-4ad4f4c14518',
        username: 'glenn',
        role: 'user',
        iat: Math.round(Date.now() / 1000) - 60,
        exp: Math.round(Date.now() / 1000) + 60,
        iss: 'glenn',
        aud: options.audience
      };

      const reply = function (err, valid, decoded) {

        Assert(err !== null);
        Assert(valid === false);

        done();
      };

      validUser(token, null, reply);
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

      validUser(token, null, reply);
    });

    lab.test('jwt should have valid audience', (done) => {

      const token = {
        userid: 'c0cb1883-e8c6-4efa-8561-4ad4f4c14518',
        username: 'glenn',
        role: 'user',
        iat: Math.round(Date.now() / 1000) - 60,
        exp: Math.round(Date.now() / 1000) + 60,
        iss: options.issuer,
        aud: 'glenn'
      };

      const reply = function (err, valid, decoded) {

        Assert(err !== null);
        Assert(valid === false);

        done();
      };

      validUser(token, null, reply);
    });
  });

  lab.experiment('validAdmin', () => {

    const validAdmin = AuthUtil.validAdmin(options);

    lab.test('jwt should be valid', (done) => {

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

      validAdmin(token, null, reply);
    });

    lab.test('jwt should not have valid role', (done) => {

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

        Assert(err !== null);
        Assert(valid === false);

        done();
      };

      validAdmin(token, null, reply);
    });
  });
});
