var formatTime = require('../utils/util.js')
const Time = (time) => { //时间数组 
  let list = []
  // 当前时间格式 2018-01-01 01:01:01
  // 参数时间格式 2018-01-01 01:01:01
  // _date1 当前日期 _date2 参数日期 _time1 当前时间 _time2参数时间
  let _date1 = formatTime.formatTime(new Date()).split(" ")[0].split("-") //[2018,01,01]
  let _time1 = formatTime.formatTime(new Date()).split(" ")[1].split(":") //[01,01,01]
  time.map((item, index) => { 
    let _date2 = item.split(" ")[0].split("-") //
    let _time2 = item.split(" ")[1].split(":", 2)

    if (_date1[0] - _date2[0] > 0) { //年份差
      list.push(item.split(" "))
    } else if (_date1[1] - _date2[1] > 0) { //月份差
      list.push(item.split(" "))
    } else if (_date1[2] - _date2[2] > 7) { //天数差大于7
      list.push(item.split(" "))
    } else if (_date1[2] - _date2[2] > 2 && _date1[2] - _date2[2] <= 7) {
      list.push(_date1[2] - _date2[2] + '天前 ' + _time2.join(":"))
    } else if (_date1[2] - _date2[2] == 2) {
      list.push('前天 ' + _time2.join(":"))
    } else if (_date1[2] - _date2[2] == 1) {
      list.push('昨天 ' + _time2.join(":"))
    } else if (_date1[2] - _date2[2] == 0 && _time1[0] - _time2[0] >= 1) {
      list.push(_time2.join(":"))
    } else if (_time1[1] - _time2[1] > 5) {
      list.push(_time1[1] - _time2[1] + '分钟前')
    } else {
      list.push('刚刚')
    }
  })
  return list
}
export default Time