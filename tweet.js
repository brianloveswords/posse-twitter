const twitter = require('./twitter-client')

module.exports = tweet

function tweet(opts, callback) {
  const params = {
    status: opts.status,
    in_reply_to_status_id: opts.replyTo
  }
  twitter.post('statuses/update', params, callback)
}

tweet.extractId = function (str) {
  const pattern = /https?:\/\/twitter.com\/.*?\/status\/(\d+)/
  const match = pattern.exec(str)
  if (!match) return
  const statusId = match[1]
  return statusId
}
