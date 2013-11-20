const config = require('./env').get('twitter')
const Twit = require('twit')
const xtend = require('xtend')
const pluck = require('lodash.pluck')
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

tweet.retweet = function retweet(opts, callback) {
  const id = opts.id
  const url = 'statuses/retweet/' + id
  twitter.post(url, { }, callback)
}

tweet.get = function get(opts, callback) {
  const url = 'statuses/show'
  const defaults = { include_entities: true }
  twitter.get(url, xtend(defaults, opts), callback)
}

tweet.getUsersFromTweet = function (tweet) {
  const entities = tweet.entities
  const author = tweet.user.screen_name
  if (!entities)
    new Error('could not get entities')
  const mentions = pluck(entities.user_mentions, 'screen_name')
  const users = [author].concat(mentions)
  return users.map(function (user) {
    return '@' + user
  })
}

// tweet.getUsersFromTweet('403178276610248704', function (err, users) {
//   console.dir(err)
//   console.dir(users)
// })
