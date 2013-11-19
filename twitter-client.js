const config = require('./env').get('twitter')
module.exports = new require('twit')(config)
