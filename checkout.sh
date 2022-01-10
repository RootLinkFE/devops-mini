
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

ls -l

# 克隆分支代码

if [[ $branchName == $testBranch ]];then
    echo "包含test"
    git clone -b test $repositoryUrl
elif [[ $branchName == $masterBranch ]];then
    echo "包含master"
    git clone $repositoryUrl
elif [[ $branchName == $prodBranch ]];then
    echo "包含prod"
    git clone -b g-miniprograme $repositoryUrl
elif [[ $branchName == $devBranch ]];then
    echo "包含dev"
    git clone -b g-miniprograme $repositoryUrl
else
    echo "默认执行test分支代码"
    git clone -b g-miniprograme $repositoryUrl
fi

wait

# 将代码放到github runner 执行目录下
cd g-miniprograme && mv * ../ 

pwd

ls -l
