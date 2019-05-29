import $ from 'jquery'
import Calendar from '@/lib/plugins/calendar/calendar'
import log from './js/helper'
import './style/farmLog.styl'

let calendar = new Calendar()
log()

$(function () {
  console.log($('body'))
})
calendar.init()
