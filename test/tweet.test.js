const test = require('tap').test
const tweet = require('../tweet')

test('tweet.extractId', function (t) {
  t.same(
    tweet.extractId('https://twitter.com/brianloveswords/status/402097801204867072'),
    402097801204867072,
    'should extract the right id'
  )
  t.same(
    tweet.extractId('http://twitter.com/brianloveswords/status/402097801204867072'),
    402097801204867072,
    'should extract the right id with http proto'
  )
  t.end()
})
