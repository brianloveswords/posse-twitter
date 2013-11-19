(function ($) {
  const $login = $('.js-persona-login')
  const $form = $('.js-persona-form')
  const $assertion = $('.js-persona-assertion')

  const user = $form.data('user')

  $login.on('click', function (evt) {
    navigator.id.request()
  })

  navigator.id.watch({
    loggedInUser: user,
    onlogin: function (assertion) {
      $assertion.val(assertion)
      $form.attr('action', $form.data('login-url'))
      $form.submit()
    },
    onlogout: function () {
      $form.attr('action', $form.data('logout-url'))
      $form.submit()
    }
  })

}(jQuery))