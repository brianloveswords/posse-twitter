(function ($) {
  const $input = $('#status')
  const $count = $('#character-count')

  const placeholder = 'xxxxxxxxxxxxxxxxxxxxx' // t.co links are 20 chars

  var type = 'down'

  function updateCount() {
    if (type == 'up')
      return $count.text($input.val().length)

    const MAXLEN = 140
    const inputText = $input.val()
      .replace(/http:\/\/\S*/, placeholder)
      .replace(/https:\/\/\S*/, placeholder + 'x')
    const remaining = MAXLEN - inputText.length
    $count.text(remaining)
  }

  $count.on('click', function () {
    type = type == 'down' ? 'up' : 'down'
    updateCount()
  })

  $input.on('keyup', updateCount)
  $input.on('keydown', updateCount)
  updateCount()

}(jQuery))
