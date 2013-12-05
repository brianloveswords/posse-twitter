domready(function () {
  const $statusLink = $('#status-link')
  const $existing = $('#existing-status')

  $statusLink.on('keyup', showStatus)

  function showStatus() {
    const statusId = Twitter.extractId($statusLink.val())
    if (!statusId) return

    Remote.getStatusInfo(statusId, function (err, status) {
      $existing.addClass('found')
      $existing.text(status.text)
    })
  }

  showStatus()
})
