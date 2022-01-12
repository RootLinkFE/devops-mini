const { formatDate, getUrl } = require('./utils')
const { noticeMsg, noticeQCode } = require('./notification')
const actionType = process.argv[3]
const projectName = process.env.PROJECT_NAME
const branchName = process.argv[2]
const repoUrl = process.env.GITLAB_REPO_URL

async function sendSuccess() {
  const newDate = new Date()
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
  >结果：<font color="green">成功</font>
  >${
    actionType === 'preview' ? '二维码预览时间' : '发布时间'
  }：<font color="comment">${formatDate(newDate)}</font>
  ${
    actionType === 'preview'
      ? `>二维码失效时间： <font color="red">${formatDate(
          new Date(newDate.setMinutes(newDate.getMinutes() + 30))
        )}</font>`
      : ''
  }`

  if (actionType === 'preview') {
    await noticeQCode()
    await noticeMsg(content)
  } else {
    noticeMsg(content)
  }
}

sendSuccess()
