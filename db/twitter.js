const db = require('./')
module.exports = db.table('twitter', {
  fields: ['tweetId', 'statusId']
})
