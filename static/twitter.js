;(function ($) {
  const Twitter = {
    extractId: function extractId(str) {
      const pattern = /https?:\/\/twitter.com\/.*?\/status\/(\d+)/
        const match = pattern.exec(str)
      if (!match) return
      const statusId = match[1]
      return statusId
    }
  }

  window.Twitter = Twitter
}(Zepto))
