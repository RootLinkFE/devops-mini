const { getUrl } = require('./utils')
const actionType = process.argv[3]
const projectName = process.env.PROJECT_NAME
const branchName = process.argv[2]

function sendFail() {
  const content = `
  -----------${
    actionType === 'preview' ? '小程序预览通知' : '小程序上传通知'
  }---------- 
  >项目名称：[<font color="blue">${projectName}</font>](${getUrl()})
  >分支：[<font color="blue">${branchName}</font>](${getUrl(
    repoUrl,
    'tree',
    branchName
  )})
  >发布人：github action
  >结果：<font color="red">失败</font>`
  noticeMsg(content)
}

sendFail()
