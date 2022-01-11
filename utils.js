export function formatDate(date) {
  // 我们写一个 2019年 5月 1日 星期三
  var y = date.getFullYear()
  var m = date.getMonth() + 1
  var d = date.getDate()
  var h = date.getHours()
  h = h < 10 ? '0' + h : h
  var mi = date.getMinutes()
  mi = mi < 10 ? '0' + mi : mi
  var s = date.getSeconds()
  s = s < 10 ? '0' + s : s
  var arr = [
    '星期日',
    '星期一',
    '星期二',
    '星期三',
    '星期四',
    '星期五',
    '星期六'
  ]
  var day = date.getDay()
  console.log(
    y + '年' + m + '月' + d + '日 ' + h + '时' + mi + '分' + s + '秒 '
  )
}
