const request = require('request')
const path = require('path')
const fs = require('fs')
const md5 = require('md5')
const formatDate = require('./utils')
const exec = require('child_process').exec
const WEB_HOOK = process.env.WECOM_WEBHOOK_KEY
const projectName = process.env.PROJECT_NAME
const repoUrl = process.env.GITLAB_REPO_URL
const branchName = process.argv[2]
const actionType = process.argv[3]

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

function getImgParams() {
  const previewImgPath = path.join('./preview.png')

  return new Promise((resolve) => {
    const content = fs.readFileSync(previewImgPath)
    const md5Code = md5(content)
    // const base64 = Base64.encode(content);
    const base64 = Buffer.from(content, 'binary').toString('base64')
    resolve({ md5Code, base64 })
  })
}

function noticeMsg(type) {
  const newDate = new Date()
  return new Promise((resolve, reject) => {
    exec('git log --oneline -1', (error, stdout) => {
      if (error) {
        console.error('git log error: ' + error)
        return reject()
      }
      const data = {
        msgtype: 'markdown',
        markdown: {
          content: `
          -----------${
            type === 'preview' ? '小程序预览通知' : '小程序上传通知'
          }---------- 
          >项目名称：[<font color="green">${projectName}</font>](${getUrl()})
          >分支：[<font color="green">${branchName}</font>](${getUrl(
            'tree',
            branchName
          )})
          >发布人：github action
          >${
            type === 'preview' ? '二维码预览时间' : '发布时间'
          }：<font color="comment">${formatDate(newDate)}</font>
          ${
            type === 'preview'
              ? `>二维码失效时间： <font color="red">${formatDate(
                  new Date(newDate.setMinutes(newDate.getMinutes() + 30))
                )}</font>`
              : ''
          }`
        }
      }
      request.post(
        WEB_HOOK,
        {
          body: JSON.stringify(data),
          headers: {
            'Content-Type': 'application/json'
          }
        },
        function (err) {
          if (err) {
            console.error(err)
            return reject()
          }
          resolve()
        }
      )
    })
  })
}

async function noticeQCode() {
  try {
    await noticeMsg()
    const { md5Code, base64 } = await getImgParams()
    const data = {
      msgtype: 'image',
      image: {
        base64,
        md5: md5Code
      }
    }
    request.post(
      WEB_HOOK,
      {
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json'
        }
      },
      function (err, resp, body) {
        if (err) {
          console.error(err)
        }
      }
    )
  } catch (error) {
    console.log(error)
  }
}

if (actionType === 'upload') {
  noticeMsg()
} else {
  noticeQCode()
}
