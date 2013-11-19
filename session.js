const fs = require('fs')
const clientSession = require('client-sessions')
const crypto = require('crypto')
const secret = require('./secret')

module.exports = clientSession({
  cookieName: 'session',
  secret: secret,
  duration: 24 * 60 * 60 * 1000,
  cookie: {
    httpOnly: true,
    ephemeral: true,
    secure: false,
  },
})
