;(function ($) {
  const Remote = {
    cache: {},
    getStatusInfo: function (id, callback) {
      const url = '/api/get-tweet/' + id
      const cache = this.cache

      if (cache[url]) {
        console.log('cache hit')
        return cache[url]
      }

      console.log('cache miss: ' + url)

      $.getJSON(url, function (data, status) {
        cache[url] = data
        callback(null, data)
      })
    }
  }
  window.Remote = Remote
}(Zepto))
