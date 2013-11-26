const fs = require('fs')
const path = require('path')
const handlebars = require('handlebars')
const util = require('util')
const xtend = require('xtend')
const fmt = util.format.bind(util)

const escape = handlebars.Utils.escapeExpression

module.exports = {
  fromFile: tpl,
  header: tpl('header.html'),
  status: tpl('status-entry.html'),
  login: tpl('login.html'),
  footer: tpl('footer.html'),
  helpers: {
    linkify: linkify,
  }
}

handlebars.registerHelper('linkify', linkify)
handlebars.registerHelper('default', defaultText)
handlebars.registerHelper('twitterLink', twitterLink)

function read(name) {
  const file = path.join(__dirname, 'templates', name)
  return fs.readFileSync(file).toString('utf8')
}

function tpl(name) {
  return function (data) {
    const context = xtend(this.defaults || {}, data)
    return handlebars.compile(read(name))(context)
  }
}

function twitterLink(user, statusId) {
  return fmt('https://twitter.com/%s/status/%s', user, statusId)
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

function defaultText(thing, default_) {
  return thing || default_;
}
