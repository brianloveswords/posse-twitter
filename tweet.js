const twitter = require('./twitter-client')

module.exports = function tweet(status, callback) {
  twitter.post('statuses/update', {
    status: status
  }, callback)
}
