const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

const $input = $('#status')
const $count = $('#character-count')

const placeholder = 'xxxxxxxxxxxxxxxxxxxxx' // t.co links are 20 chars

function updateCount() {
  const MAXLEN = 140
  const inputText = $input.value
    .replace(/http:\/\/\S*/, placeholder)
    .replace(/https:\/\/\S*/, placeholder + 'x')
  const remaining = MAXLEN - inputText.length
  $count.textContent = remaining
}

$input.addEventListener('keyup', updateCount)
$input.addEventListener('keydown', updateCount)
updateCount()
