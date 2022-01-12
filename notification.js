const request = require('request')
const path = require('path')
const fs = require('fs')
const md5 = require('md5')
const exec = require('child_process').exec
const WEB_HOOK = process.env.WECOM_WEBHOOK_KEY
const projectName = process.env.PROJECT_NAME
const repoUrl = process.env.GITLAB_REPO_URL
const branchName = process.argv[2]
const actionType = process.argv[3]

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

function noticeMsg(content) {
  return new Promise((resolve, reject) => {
    exec('git log --oneline -1', (error, stdout) => {
      if (error) {
        console.error('git log error: ' + error)
        return reject()
      }
      const data = {
        msgtype: 'markdown',
        markdown: {
          content
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

function noticeQCode() {
  return new Promise(async (resolve, reject) => {
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
          return reject()
        }
        return resolve()
      }
    )
  })
}

module.exports = {
  noticeMsg,
  noticeQCode
}
