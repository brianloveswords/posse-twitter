domready(function () {
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

  $replyTo.on('keyup', getStatus)

  function getStatus() {
    const $this = $replyTo
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

      const mentions = users.join(' ')
      const newStatus = mentions + ' ' + oldStatus

      if (oldStatus.indexOf(mentions) !== 0)
        $statusInput.val(newStatus)
    })
  }

  $statusInput.on('keyup', updateCount)
  $statusInput.on('keydown', updateCount)

  updateCount()
  getStatus()
})
