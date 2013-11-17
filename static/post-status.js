const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

const $input = $('#status')
const $count = $('#character-count')

function updateCount() {
  const MAXLEN = 140
  const remaining = MAXLEN - $input.value.length
  $count.textContent = remaining
}

$input.addEventListener('keyup', updateCount)
$input.addEventListener('keydown', updateCount)
updateCount()
