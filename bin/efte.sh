#!/bin/bash

# 创建项目文件夹
if [ ! -d "$1" ]; then
  mkdir $1
else
  echo "$1 目录已存在"
  exit 1
fi
echo '创建项目文件夹成功'

# 进入 $1 目录
cd $1

# 初始化 git 项目
echo '请输入 git url:'
read
if [ -n $REPLY ]; then
  git init
  git remote add origin $REPLY
else
  echo '没有输入 git url, 初始化 git 项目失败'
  exit 1
fi
echo '初始化 git 项目成功'

# cortex、npm 初始化
cortex init
echo '初始化 cortex 成功'

npm init
echo '初始化 npm 成功'

# 创建项目目录结构
rm ./index.html
mkdir handlebar
mkdir less
mkdir less/page
mkdir js
mkdir js/page
mkdir js/env
mkdir js/util
mkdir src
echo '创建项目目录结构成功'

# 安装 npm 工具依赖
npm install gulp --save
npm install gulp-less --save
npm install gulp-cortex-handlebars-compiler --save
curl ~/.cortext-efte-gulpfile.js ./gulpfile.js
echo '安装 npm 工具依赖成功'

# 安装 js 公共依赖库
cortex install zepto --save
cortex install underscore --save
cortex install efte --save
echo '安装 js 公共依赖库成功'

# 安装 apollo 基础样式库
git submodule add 'git@code.dianpingoa.com:f2e/m-apollo-theme-base.git' less/common
cd less/common
git checkout master
cd ../../
echo '安装 apollo 基础样式库成功'

# 修改 cortex.json
# TODO

# .gitignore
sed -i '' -e '1i\
  \# custom\
  less/common\
  src' .gitignore

sed -i '' -e '3G' .gitignore

# 提交改动
git add -A
git commit -m '创建项目并初始化'

echo '项目创建成功'
exit 0
