
const repoUrl = process.env.GITLAB_REPO_URL

function formatDate(date) {
  // 我们写一个 2019年 5月 1日 星期三
  const y = date.getFullYear()
  const m = date.getMonth() + 1
  const d = date.getDate()
  date.setHours(date.getHours() + 8)
  let h = date.getHours()
  h = h < 10 ? '0' + h : h
  let mi = date.getMinutes()
  mi = mi < 10 ? '0' + mi : mi
  let s = date.getSeconds()
  s = s < 10 ? '0' + s : s
  const arr = [
    '星期日',
    '星期一',
    '星期二',
    '星期三',
    '星期四',
    '星期五',
    '星期六'
  ]
  const day = date.getDay()
  return y + '年' + m + '月' + d + '日 ' + h + '时' + mi + '分' + s + '秒'
}

// 获取gitlab地址
function getUrl(type = '', params = '') {
  let result = repoUrl.replace('.git', '')
  switch (type) {
    case 'commit':
      return result + '/-/commit/' + params
    case 'tree':
      return result + '/-/tree/' + params
    default:
      return result
  }
}

module.exports = {
  formatDate,
  getUrl
}
