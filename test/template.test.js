const test = require('tap').test
const template = require('../template')

test('linkify', function (t) {
  const linkify = template.helpers.linkify
  const expect = '<a class="twitter" href="https://twitter.com/twitter" target="_blank">@<span class="username">twitter</span></a> and <a href="http://link.to.site" target="_blank">http://link.to.site</a>'
  t.same(linkify('@twitter and http://link.to.site'), expect)
  t.end()
})
