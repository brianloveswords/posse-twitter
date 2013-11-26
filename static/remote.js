;(function ($) {
  const Remote = {
    working: false,
    cache: {},
    getStatusInfo: function (id, callback) {
      const self = this
      if (self.working)
        return callback(new Error('still working'))

      this.working = true
      const url = '/api/get-tweet/' + id
      const cache = this.cache

      if (cache[url]) {
        console.log('cache hit')
        return cache[url]
      }

      console.log('cache miss: ' + url)

      $.getJSON(url, function (data, status) {
        self.working = false
        cache[url] = data
        callback(null, data)
      })
    }
  }
  window.Remote = Remote
}(Zepto))
