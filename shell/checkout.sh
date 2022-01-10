
#!/bin/bash

set -e

repositoryUrl="${GITLAB_REPO_URL}"
username="${GITLAB_REPO_USERNAME}"
password="${GITLAB_REPO_PASSWORD}"
branchName=${1}
devBranch='dev'
testBranch='test'
masterBranch='master'
prodBranch='prod'

function log() {
  echo "$(date)>>>>$@"
}

# 登录

echo git config --global user.name $username
echo git config --global user.email $password
echo git config --global credential.helper store

# 克隆分支代码
echo git clone -b test $repositoryUrl



# 将代码放到github runner 执行目录下
cd g-miniprograme && mv * ../ 

pwd

ls -l
