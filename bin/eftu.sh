#!/bin/bash

# 环境变量
os=`uname -s`
osx='Darwin'

if [ -z "$NODE" ]; then
  NODE='/usr/local/bin'
fi

if [ -z "$NODE_PATH" ]; then
  NODE_PATH='/usr/local/lib/node_modules'
fi

# 常量
SEP_LINE='\n======================================\n'

# 项目常量
PROJ=$(basename $(pwd))
TPL_UNIT='unit-m-template'
UNIT_PREFIX='unit-'

if [[ $PROJ == $UNIT_PREFIX* ]]; then
  VERSION=$(grep 'version' cortex.json | sed -e 's/[^0-9\.]//g')
fi

# 发布环境 url
PRD='http://efte.dianping.com'
BETA='http://beta.efte.dp'
ALPHA='http://192.168.218.29'

# 可选命令
build='build'
install='install'
update='update'
watch='watch'
link='link'

# efte build
if [ "$1" = "$build" ]; then
  cortex build
  cd neurons/$PROJ
  rm -rf latest
  echo "link $VERSION > latest"
  ln -s $VERSION latest
  exit 0
fi

# efte install
if [ "$1" = "$install" ]; then
  cortex "$@"
  exit 0
fi

# efte update
if [ "$1" = "$update" ]; then
  cortex "$@"
  exit 0
fi

# efte watch
if [ "$1" = "$watch" ]; then
  cortex watch
  exit 0
fi

# efte link
if [ "$1" = "$link" ]; then
  if [ -n "$2" ]; then
    param_pre='{"appName":"'
    param_end='","packages":{}}'
    curl --header "Content-Type:application/json" -d "$param_pre$2$param_end" $BETA/api/app/$2/checkupdate > .pkgs.json
    node $NODE_PATH/efte-init/ln.js '.pkgs.json'
    rm -f .pkgs.json
    exit 0
  else
    echo '请输入 Efte 站点上 App 名称'
    exit 1
  fi
fi

# 创建 unit 项目文件夹: efte proj
if [ -n "$1" ]; then
  if [ ! -d "$1" ]; then
    mkdir $1
  else
    echo "$1 目录已存在"
    exit 1
  fi
else
  echo '请输入项目名称'
  exit 1;
fi
echo '创建项目文件夹成功'
echo -e $SEP_LINE

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
echo -e $SEP_LINE

# cortex、npm 初始化
cortex init
echo '初始化 cortex 成功'
echo -e $SEP_LINE

npm init
echo '初始化 npm 成功'
echo -e $SEP_LINE

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
echo -e $SEP_LINE

# 安装 npm 工具依赖
npm install gulp --save
npm install gulp-less --save
npm install gulp-cortex-handlebars-compiler --save
echo '安装 npm 工具依赖成功'
echo -e $SEP_LINE

# 安装模板项目
if [ "$os" != "$osx" -a "$os" != "$linux" ]; then
  node $NODE_PATH/efte-init/cp.js
  # cp -rf $NODE_PATH/efte-init/template/* ./
  sed -e "s/$TPL_UNIT/$1/g" `grep "$TPL_UNIT" -rl ./handlebar/*`
else
  cp -rf $NODE_PATH/efte-init/template/* ./
  sed -i '' -e "s/$TPL_UNIT/$1/g" `grep "$TPL_UNIT" -rl ./handlebar/*`
fi
echo '安装模板项目成功'
echo -e $SEP_LINE

# 安装 js 公共依赖库
cortex install zepto --save
cortex install underscore --save
cortex install efte --save
echo '安装 js 公共依赖库成功'
echo -e $SEP_LINE

# 安装 apollo 基础样式库
git submodule add 'git@code.dianpingoa.com:f2e/m-apollo-theme-base.git' less/common
cd less/common
git checkout master
cd ../../
echo '安装 apollo 基础样式库成功'
echo -e $SEP_LINE

# 修改 cortex.json
node $NODE_PATH/efte-init/edit-json.js cortex.json
echo '配置 cortex.json 和 package.json 成功'
echo -e $SEP_LINE

# .gitignore
if [ "$os" = "$osx" ]; then
  sed -i '' -e '1i\
    \# custom\
    less/common\
    src' .gitignore

  sed -i '' -e '3G' .gitignore
else
  sed -e '1i\
\# custom\
less/common\
src' .gitignore

  sed -e '3G' .gitignore
fi

echo '配置 .gitignore 成功'
echo -e $SEP_LINE

# 提交改动
git add -A
git commit -m '创建项目并初始化'
echo '项目创建成功'
echo -e $SEP_LINE

# 用户引导
echo '建议安装 imock'
echo '- npm install imock '
echo '- imock -j mock -b api -w neurons -p 3000'
echo '- 浏览器打开 open http://localhost:3000/neurons/src/index.html'
echo '*************************************'
echo '*   Happy on Developing with Efte   *'
echo '*************************************'

exit 0
