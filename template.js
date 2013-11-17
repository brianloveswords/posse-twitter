const fs = require('fs')
const path = require('path')
const handlebars = require('handlebars')
const util = require('util')
const fmt = util.format.bind(util)

const escape = handlebars.Utils.escapeExpression

module.exports = {
  header: tpl('header.html'),
  status: tpl('status-entry.html'),
  footer: tpl('footer.html'),
  helpers: {
    linkify: linkify,
  }
}

handlebars.registerHelper('linkify', linkify)

function read(name) {
  const file = path.join(__dirname, 'templates', name)
  return fs.readFileSync(file).toString('utf8')
}

function tpl(name) {
  return function (data) {
    return handlebars.compile(read(name))(data)
  }
}

function linkify(text) {
  const withLinks = escape(text)
    .replace(/https?:\/\/\S+/gi, function (match) {
      const tpl = '<a href="%s" target="_blank">%s</a>'
      return fmt(tpl, match, match)
    })
    .replace(/@([a-z0-9_]+)/gi, function (match, username) {
      const tpl = '<a class="twitter" href="https://twitter.com/%s" target="_blank">@<span class="username">%s</span></a>'
      return fmt(tpl, username, username)
    })

  return withLinks
}
