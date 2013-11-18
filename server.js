const http = require('http')
const router = require('routes')()
const url = require('url')
const fs = require('fs')
const path = require('path')
const concat = require('concat-stream')
const xtend = require('xtend')
const qs = require('querystring')
const domain = require('domain')
const JSONStream = require('JSONStream')
const ecstatic = require('ecstatic')
const mapStream = require('map-stream')
const moment = require('moment')
const util = require('util')

const status = require('./db/status')
const twitter = require('./db/twitter')
const tweet = require('./tweet')
const template = require('./template')

router.addRoute('/', index)
router.addRoute('/status', statusPage)
router.addRoute('/reblog', reblogPage)
router.addRoute('/static/*', ecstatic({
  baseDir: '/static',
  root: './static'
}))

const server = http.createServer()
server.on('request', function (req, res) {
  const urlParts = url.parse(req.url)
  const match = router.match(urlParts.pathname)
  if (match)
    return match.fn.call(match, req, res)
  return notFound(res)
})

server.on('listening', function () {
  const addr = this.address()
  console.log('listening %s:%s', addr.address, addr.port)
})

server.listen(3000)

function render(name) {
  return function (req, res) {
    res.setHeader('content-type','text/html; charset=utf8')
    res.write(template.header())
    const file = path.join(__dirname, 'templates', name + '.html')
    fs.createReadStream(file)
      .on('end', finish)
      .pipe(res, { end: false })
    function finish() { res.end(template.footer()) }
  }
}

function index(req, res) {
  res.setHeader('content-type','text/html; charset=utf8')
  res.write(template.header())
  status.createReadStream({}, {
    sort: { createdAt: 'desc' },
  }).on('end', function finish() {

    res.end(template.footer())

  }).pipe(mapStream(function rows(row, next) {

    const when = moment(row.createdAt).fromNow()
    const datetime = row.createdAt.toISOString()
    const reply = row.replyTo ? { link: row.replyTo } : null
    const reblog = row.reblog ? { link: row.reblog } : null

    next(null, template.status(xtend(row, {
      datetime: datetime,
      when: when,
      reply: reply,
      reblog: reblog,
    })))

  })).pipe(res)
}

function reblogPage(req, res) {
  if (req.method == 'GET')
    return render('reblog')(req, res)

  if (req.method != 'POST')
    return notFound(res)

  req.pipe(concat(function (data) {
    const post = qs.parse(data.toString('utf8'))
    const statusId = tweet.extractId(post.statusLink)

    const dom = domain.create()
    dom.add(res)
    dom.on('error', function (err) {
      return serverError(err, res)
    })

    dom.run(function () {
      // 1. retweet to twitter
      tweet.retweet({ id: statusId }, function (err, resp) {
        if (err) throw err

        const tweetId = resp.id_str
        const text = util.format(
          'RT @%s: %s',
          resp.retweeted_status.user.screen_name,
          resp.retweeted_status.text)

        // 2. get text back, post to own `status` table
        status.put({
          text: text,
          reblog: post.statusLink
        }, function (err, meta) {
          if (err) throw err

          // 3. get status id back, post to `twitter` table
          twitter.put({
            statusId: meta.insertId,
            twitterId: tweetId
          }, function (err, meta) {
            if (err) throw err

            // 4. redirect
            res.writeHead(303, { Location: '/' })
            res.end()
          })
        })
      })
    })
  }))
}

function statusPage(req, res) {
  if (req.method == 'GET')
    return render('new-status')(req, res)

  if (req.method != 'POST')
    return notFound(res)

  const dom = domain.create()
  dom.add(res)
  dom.on('error', function (err) {
    return serverError(err, res)
  })

  dom.run(function () {
    req.pipe(concat(function (data) {
      const post = qs.parse(data.toString('utf8'))
      const replyToStatusId = tweet.extractId(post.replyTo)

      status.put({
        text: post.text,
        replyTo: post.replyTo
      }, function (err, meta) {
        if (err) throw err

        tweet({
          status: post.text,
          replyTo: replyToStatusId
        }, function (err, result) {
          if (err) throw err

          twitter.put({
            statusId: meta.insertId,
            twitterId: result.id_str
          }, function (err, meta) {
            if (err) throw err

            res.writeHead(303, { Location: '/' })
            res.end()
          })
        })
      })
    }))
  })
}

function serverError(err, res) {
  console.error('error', err.stack)
  return respond(500, 'Internal Server Error', res)
}

function notFound(res) {
  return respond(404, 'Not Found', res)
}

function respond(status, body, res) {
  res.writeHead(status, {'content-length': body.length})
  res.write(body)
  res.end()
}
