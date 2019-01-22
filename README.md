# GeenenAuth Hapi Plugin

[![Build Status](https://travis-ci.org/GlennGeenen/geenenauth.svg?branch=master)](https://travis-ci.org/GlennGeenen/geenenauth)

This is a Hapi plugin wrapper around hapi-auth-jwt2 with a specific setup as used by GeenenTijd. Compatible with Glue.

## Install

```
npm i geenenauth --save
```

## Register

```
server.register({
  register: require('geenenauth'),
  options: {
    secret: 'MyJWTSecret',
    issuer: 'MyIssuer', // Default GeenenTijd
    audience: 'MyAudience',
    strategies: [{
      name: 'isUser',
      roles: ['user', 'editor', 'admin', 'superadmin'],
    }, {
      name: 'isEditor',
      roles: ['editor'],
    }, {
      name: 'isAdmin',
      roles: ['admin', 'superadmin'],
    }]
  }
});
```
## Strategies

User Authentication:
```
server.route({
  method: 'GET',
  path: '/me',
  config: {
    auth: {
      strategy: 'strategyName'
    }
  },
  handler: function (request, reply) {
  }
});

## getToken(user, [secret, options,] callback)

Options: [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken)

- expiresIn
- notBefore
- noTimestamp

Usage:
```
function (request, reply) {

  const user = {
    userid: 'c0cb1883-e8c6-4efa-8561-4ad4f4c14518',
    username: 'glenn',
    role: 'user'
  };

  request.server.methods.getToken(user, {
    expiresIn: '1d'
  } (err, token) => {

    // We have token here
  });
}
```

## verifyToken(user, [secret, options,] callback)

Options: [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken)

- expiresIn
- notBefore
- noTimestamp
