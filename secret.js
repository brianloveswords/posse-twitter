const crypto = require('crypto')
const fs = require('fs')
const FILENAME = '.cookie_secret'
var secret;
try {
  secret = fs.readFileSync(FILENAME).toString()
  if (!secret)
    throw new Error('not a good secret')
} catch (e) {
  secret = crypto.randomBytes(128).toString('base64')
  fs.writeFileSync(FILENAME, secret)
}
module.exports = secret
