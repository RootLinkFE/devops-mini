
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

if [[ $branchName == $testBranch ]];then
    echo "包含test"
    git clone -b test $repositoryUrl
elif [[ $branchName == $masterBranch ]];then
    echo "包含master"
    git clone $repositoryUrl
elif [[ $branchName == $prodBranch ]];then
    echo "包含prod"
    git clone -b prod $repositoryUrl
elif [[ $branchName == $devBranch ]];then
    echo "包含dev"
    git clone -b dev $repositoryUrl
else
    echo "默认执行test分支代码"
    git clone -b test $repositoryUrl
fi

# cd g-crm-app 
# log "$(git branch)"
# # 拉取最新代码
# git pull
# cd ..  

# 将代码放到github runner 执行目录下
cd g-miniprograme && mv * ../ 

pwd

ls -l
