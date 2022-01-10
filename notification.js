const request = require('request')
var path = require('path')
const fs = require('fs')
const md5 = require('md5')
const exec = require('child_process').exec
const WEB_HOOK = process.env.WECOM_WEBHOOK_KEY
const projectName = process.env.PROJECT_NAME
const branchName = process.argv[1]

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

function noticeMsg() {
  const newDate = new Date()
  return new Promise((resolve, reject) => {
    exec('git log --oneline -1', (error, stdout) => {
      if (error) {
        console.error('error: ' + error)
        return reject()
      }
      const data = {
        msgtype: 'markdown',
        markdown: {
          content: `
          >项目名称：<font color="green">${projectName}</font>
          >分支：<font color="green">${branchName}</font>
          >最新的提交commitId和记录：${stdout}
          >发布人：github action
          >发布时间：<font color="comment">${newDate}</font>
          >二维码失效时间： <font color="comment">${new Date(
            newDate.setMinutes(newDate.getMinutes() + 30)
          )}</font>`
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
    console.log(md5Code)
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
    console.log('err')
  }
}

noticeQCode()
