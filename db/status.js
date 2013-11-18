const db = require('./')
module.exports = db.table('status', {
  fields: ['id', 'createdAt', 'text', 'replyTo', 'reblog']
})
