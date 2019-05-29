import $ from 'jquery'
import Bscroll from 'better-scroll'
import '@/inc/search/search.styl'
import './style/index.styl'

$(function() {
  $('#search')
    .on('focus', function() {
      $(this)
        .parent()
        .addClass('onfocus')
    })
    .on('blur', function() {
      if ($(this).val()) return
      $(this)
        .parent()
        .removeClass('onfocus')
    })
  let length = $('.slider-items li').length
  let html = ''
  for (let i = 0; i < length; i++) {
    html += '<li></li>'
  }
  $('.slider-dots').html(html)

  function resetWidth() {
    let sliderWidth = $('.slider-wrapper').width()
    $('.slider-items li').width(sliderWidth)
    $('.slider-items').css({
      width: (length + 2) * sliderWidth
    })
  }

  function initSlider() {
    resetWidth()
    $(window).on('resize', function() {
      resetWidth()
    })
    $('.slider-dots li')
      .eq(0)
      .addClass('active')
  }
  initSlider()

  let slider = new Bscroll($('.slider-wrapper')[0], {
    scrollX: true,
    scrollY: false,
    momentum: false,
    snap: {
      loop: true,
      threshold: 0.3,
      speed: 400
    }
  })
  slider.__timer = null

  function _play() {
    let pageIndex = slider.getCurrentPage().pageX + 1
    clearTimeout(slider.__timer)
    slider.__timer = setTimeout(function() {
      slider.goToPage(pageIndex, 0, 400)
    }, 5000)
  }
  _play()
  slider.on('scrollEnd', () => {
    $('.slider-dots li')
      .removeClass('active')
      .eq(slider.getCurrentPage().pageX - 1)
      .addClass('active')
    _play()
  })
})

if (module.hot) {
  module.hot.accept()
}
