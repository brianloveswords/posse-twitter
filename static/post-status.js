;(function ($) {
  const $replyTo = $('#reply-to')
  const $replyToStatus = $('#existing-status')
  const $statusInput = $('#status')
  const $count = $('#character-count')

  var type = 'down'

  function updateCount() {
    if (type == 'up')
      return $count.text($statusInput.val().length)

    const MAXLEN = 140
    const placeholder = 'xxxxxxxxxxxxxxxxxxxxx' // t.co links are 20 chars

    const inputText = $statusInput.val()
      .replace(/http:\/\/\S*/, placeholder)
      .replace(/https:\/\/\S*/, placeholder + 'x')
    const remaining = MAXLEN - inputText.length
    $count.text(remaining)
  }

  $count.on('click', function () {
    type = type == 'down' ? 'up' : 'down'
    updateCount()
  })

  $replyTo.on('keyup', function () {
    const $this = $(this)
    const statusId = Twitter.extractId($this.val())
    if (!statusId) return

    Remote.getStatusInfo(statusId, function (err, status) {
      if (err) {
        console.log(err.message)
        return false
      }
      const oldStatus = $statusInput.val().trim()
      const users = Twitter.removeSelfFromList(status.users)
      $replyToStatus.addClass('found')
      $replyToStatus.text(status.text)
      $statusInput.val([users.join(' '), oldStatus].join(' '))
    })
  })

  $statusInput.on('keyup', updateCount)
  $statusInput.on('keydown', updateCount)

  updateCount()

}(Zepto))
// https://twitter.com/ag_dubs/status/403223724889219072
