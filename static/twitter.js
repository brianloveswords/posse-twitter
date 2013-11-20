;(function ($) {
  const Twitter = {
    extractId: function extractId(str) {
      const pattern = /https?:\/\/twitter.com\/.*?\/status\/(\d+)/
        const match = pattern.exec(str)
      if (!match) return
      const statusId = match[1]
      return statusId
    },
    getOwnHandle: function () {
      return $('body').data('twitter-handle')
    },
    removeSelfFromList: function (list) {
      const self = this.getOwnHandle()
      if (!self) return list
      return list.filter(function (handle) {
        return handle != self
      })
    }
  }
  window.Twitter = Twitter
}(Zepto))
