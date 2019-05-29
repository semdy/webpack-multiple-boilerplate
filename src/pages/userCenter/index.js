import $ from 'jquery'
import './style/userCenter.styl'

$(function () {
  $('[data-toggle=modal]').on('click', function () {
    var target = $(this).data('target')
    if (target) {
      $(target).animate({
        left: 0
      }, 200)
      $('body').addClass('modal-open')
    }
  })

  $('[data-close]').on('click', function () {
    var target = $(this).data('close')
    if (target) {
      $(target).animate({
        left: '100%'
      }, 200)
      $('body').removeClass('modal-open')
    }
  })
})
