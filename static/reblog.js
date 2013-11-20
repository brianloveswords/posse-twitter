;(function ($) {
  const $statusLink = $('#status-link')
  const $existing = $('#existing-status')

  $statusLink.on('keyup', function () {
    const $this = $(this)
    const statusId = Twitter.extractId($this.val())
    if (!statusId) return

    Remote.getStatusInfo(statusId, function (err, status) {
      $existing.addClass('found')
      $existing.text(status.text)
    })
  })

}(Zepto))
