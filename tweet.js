const config = require('./env').get('twitter')
const Twit = require('twit')
const twitter = new Twit(config)

module.exports = tweet

function tweet(opts, callback) {
  const params = {
    status: opts.status,
    in_reply_to_status_id: opts.replyTo
  }
  twitter.post('statuses/update', params, callback)
}

tweet.extractId = function extractId(str) {
  const pattern = /https?:\/\/twitter.com\/.*?\/status\/(\d+)/
  const match = pattern.exec(str)
  if (!match) return
  const statusId = match[1]
  return statusId
}

tweet.retweet = function (opts, callback) {
  const id = opts.id
  const url = 'statuses/retweet/' + id
  twitter.post(url, { }, callback)
}
