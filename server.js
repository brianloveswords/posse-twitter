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

const env = require('./env')
const persona = require('./persona')
const session = require('./session')
const status = require('./db/status')
const twitter = require('./db/twitter')
const tweet = require('./tweet')
const template = require('./template')

router.addRoute('/', index)
router.addRoute('/login', withSession(loginPage))
router.addRoute('/logout', withSession(logout))
router.addRoute('/status', requireAdmin(statusPage))
router.addRoute('/reblog', requireAdmin(reblogPage))
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
  return notFound(req, res)
})

server.on('listening', function () {
  const addr = this.address()
  console.log('listening %s:%s', addr.address, addr.port)
})

server.listen(env.get('port') || 3000)

function render(name, context) {
  if (typeof context == 'string')
    context = { title: context }

  return function (req, res) {
    const tpl = template.fromFile(name + '.html')
    res.setHeader('content-type','text/html; charset=utf8')
    res.write(template.header(context))
    res.write(tpl(context))
    res.end(template.footer())
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
    return render('reblog', 'Reblog a Status')(req, res)

  if (req.method != 'POST')
    return notFound(req, res)

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
  const auth = env('auth')
  const user = req.session.user
  if (!user || user !== auth.get('admin'))
    return forbidden(res)

  if (req.method == 'GET')
    return render('new-status', 'Post a New Status')(req, res)

  if (req.method != 'POST')
    return notFound(req, res)

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
            redirect(res, '/')
          })
        })
      })
    }))
  })
}

function loginPage(req, res) {
  if (req.method == 'GET')
    return render('login', {
      title: 'Login',
      user: req.session.user
    })(req, res)

  if (req.method != 'POST')
    return notFound(req, res)


  getPostData(req, function (err, post) {
    persona(post.assertion, function (err, email) {
      if (err) {
        console.error(err)
        return forbidden(res)
      }
      req.session.user = email
      redirect(res, '/')
    })
  })
}

function logout(req, res) {
  req.session.user = null
  redirect(res, '/')
}

function redirect(res, location) {
  res.writeHead(303, { Location: location || '/' })
  res.end()
}

function getPostData(req, callback) {
  req.pipe(concat(function (data) {
    const post = qs.parse(data.toString('utf8'))
    callback(null, post)
  })).on('error', function (err) {
    callback(err)
  })
}

function requireAdmin(endpoint) {
  return withSession(function (req, res) {
    const auth = env('auth')
    const user = req.session.user
    if (!user || user !== auth.get('admin'))
      return forbidden(res)
    return endpoint(req, res)
  })
}

function withSession(endpoint) {
  return function (req, res) {
    session(req, res, function (err) {
      if (err) return serverError(err, res)
      console.dir(req.session)
      return endpoint(req, res)
    })
  }
}

function serverError(err, res) {
  console.error('error', err.stack)
  return respond(500, 'Internal Server Error', res)
}

function forbidden(res) {
  return respond(403, 'Forbidden', res)
}

function notFound(req, res) {
  console.dir(req.url)
  return respond(404, 'Not Found', res)
}

function respond(status, body, res) {
  res.writeHead(status, {'content-length': body.length})
  res.write(body)
  res.end()
}
