import Convert from './convert'

class Calendar {
  constructor () {
    this.container = '#calendar-wrapper'
    this.nextClass = 'c-next'
    this.prewClass = 'c-prew'
    this.contentClass = 'c-body'
    this.headTextClass = 'current-month'
    this.today = new Date()
    this.showYear = this.today.getFullYear()
    this.showMonth = this.today.getMonth() + 1
  }

  getMonthData(year, month) {
    let ret = []

    if (!year || !month) {
      year = this.today.getFullYear()
      month = this.today.getMonth() + 1
    }

    // 本月的第一天
    let firstDay = new Date(year, month - 1, 1)
    let firstDayWeekDay = firstDay.getDay()
    // 以星期日为一周的第一天
    // 本月的日历上需要显示的上个月的天数
    let lastMonthDayCount = firstDayWeekDay

    // 上个月的最后一天的日期
    let lastDateOfLastMonth = new Date(year, month - 1, 0).getDate()
    // 本月的最后一天
    let lastDay = new Date(year, month, 0)
    // 本月最后一天的日期
    let lastDate = lastDay.getDate()
    // 本月最后一天是周几
    let lastDayWeekDay = lastDay.getDay()

    // 本月的日历上需要显示的下个月的天数
    let nextMonthDayCount = (6 - lastDayWeekDay)

    // 本月的日历上需要显示的总天数
    let showTotalDays = lastMonthDayCount + lastDate + nextMonthDayCount

    for (let i = 0; i < showTotalDays; i++) {
      let tempDate = i - lastMonthDayCount + 1
      let date = tempDate
      let thisYear = year
      let thisMonth = month
      if (tempDate <= 0) {
        thisMonth -= 1
        date = lastDateOfLastMonth + tempDate
      } else if (tempDate > lastDate) {
        thisMonth += 1
        date = tempDate - lastDate
      }

      if (thisMonth === 0) {
        thisMonth = 12
        thisYear -= 1
      }

      if (thisMonth === 13) {
        thisMonth = 1
        thisYear += 1
      }
      let lunar = new Convert().SolarToLunar({
        solarDay: date,
        solarMonth: thisMonth,
        solarYear: thisYear
      })
      let chineseChar = ['初一', '初二', '初三', '初四', '初五', '初六', '初七', '初八', '初九', '初十', '十一', '十二', '十三', '十四', '十五', '十六', '十七', '十八', '十九', '二十', '廿一', '廿二', '廿三', '廿四', '廿五', '廿六', '廿七', '廿八', '廿九', '三十']
      lunar.chineseChar = chineseChar[lunar.lunarDay - 1]
      ret.push({
        year: thisYear,
        month: thisMonth,
        date: date,
        lunar,
        tempDate: tempDate
      })
    }
    return {
      year: year,
      month: month,
      days: ret
    }
  }

  renderUi(year, month) {
    let monthData = this.getMonthData(year, month)

    let headHtml = `<div class="c-header">
                      <span class="c-prew">&lt;</span>
                      <div class="current-month">
                          ${monthData.year}年${monthData.month}月
                        </div>
                      <span class="c-next">&gt;</span>
                    </div>`
    let conentHtml = this.buildContent(monthData)

    document.querySelector(this.container).innerHTML = headHtml + conentHtml
  }

  buildContent(monthData) {
    let html = `<table class="c-body">
                  <thead>
                    <tr>
                      <td>日</td>
                      <td>一</td>
                      <td>二</td>
                      <td>三</td>
                      <td>四</td>
                      <td>五</td>
                      <td>六</td>
                    </tr>
                  </thead>
                  <tbody>`
    for (let i = 0; i < monthData.days.length; i++) {
      let thisDay = monthData.days[i]
      let dateString = thisDay.year + thisDay.month.toString().padStart(2, '0') + thisDay.date.toString().padStart(2, '0')
      let theDayIsNotThisMonth = thisDay.month !== this.showMonth
      if (i % 7 === 0) {
        html += `<tr>`
      }
      html += `<td data-date="${dateString}" style="${theDayIsNotThisMonth ? 'opacity:0.3' : ''}" class="${this.todayDateString === dateString ? 'current-day' : ''}">${monthData.days[i].date}<div>${monthData.days[i].lunar.chineseChar}</div></td>`
      if (i % 7 === 6) {
        html += `</tr>`
      }
    }
    html += `</tbody>`
    return html
  }
  event() {
    let that = this
    let headTextElement = document.querySelector('.' + this.headTextClass)
    function handler(e) {
      if (e.target.classList.contains(that.prewClass)) {
        that.showMonth--
        if (that.showMonth === 0) {
          that.showMonth = 12
          that.showYear--
        }
      } else if (e.target.classList.contains(that.nextClass)) {
        that.showMonth++
        if (that.showMonth === 13) {
          that.showMonth = 1
          that.showYear++
        }
      } else {
        return
      }

      let monthData = that.getMonthData(that.showYear, that.showMonth)
      let contentHtml = that.buildContent(monthData)
      // 删除原本节点
      let container = document.querySelector(that.container)
      let orginElement = document.querySelector('.' + that.contentClass)
      container.removeChild(orginElement)
      container.insertAdjacentHTML('beforeend', contentHtml)
      // 更新head月份显示
      document.querySelector('.' + that.headTextClass).innerHTML = `${that.showYear}年${that.showMonth}月`
    }
    headTextElement.parentElement.addEventListener('click', handler)
  }

  init() {
    this.todayDateString = this.today.getFullYear() + (this.today.getMonth() + 1).toString().padStart(2, '0') + this.today.getDate().toString().padStart(2, '0')
    this.renderUi()
    this.event()
  }
}

export default Calendar
