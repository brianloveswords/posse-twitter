const request = require('request')
const util = require('util')

const env = require('./env')('auth')

const ADMIN = env.get('admin')
const AUDIENCE = env.get('host')

module.exports = verify

function verify(assertion, callback) {
  request.post('https://verifier.login.persona.org/verify', {
    json: true,
    form: {
      assertion: assertion,
      audience: AUDIENCE
    }
  }, function (err, res, body) {
    if (err)
      return callback(err)

    if (body.status != 'okay')
      return callback(new Error(util.format('could not verify: %j', body)))

    if (body.audience != AUDIENCE)
      return callback(new Error('could not verify, invalid audience'))

    return callback(null, body.email)
  })
}

verify.audience = AUDIENCE
