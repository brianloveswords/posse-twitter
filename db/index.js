const mysql = require('mysql-stream-db')
const env = require('../env')('db')

module.exports = mysql.connect({
  host: env.get('host', 'localhost'),
  user: env.get('user', 'root'),
  password: env.get('password', ''),
  database: env.get('database', 'microblog'),
})
