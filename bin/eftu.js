#!/usr/bin/env node

var clc = require('cli-color');
var path = require('path');
var shelljs = require('shelljs');
var createProj = require('../src/create');
var buildProj = require('../src/build');
var linkProj = require('../src/ln');

var pkgJson = require('../package.json');

var error = clc.red.bold;
var warn = clc.yellow;
var notice = clc.cyan;

if (!shelljs.which('git')) {
  console.log(error('请先安装 git 工具'));
  process.exit();
}

if (!shelljs.which('cortex')) {
  console.log(error('请先使用 ') + notice('npm install -g cortex') + error(' 安装 cortex 工具'));
  process.exit();
}

// 新建 unit 项目: efte proj
var args = process.argv;

// 若无指定任何参数，则退出程序
if (args.length <= 2) {
  console.log(notice('请输入参数或查看帮助文档 eftu -h'));
  process.exit();
}

// eftu xxx
// 第一个参数是：xxx
var firstArg = args[2];
var allArgs = args.slice(2);

var cortexCmd = function(args) {
  var cmdStr = 'cortex ' + args.join(' ');

  if (shelljs.exec(cmdStr).code !== 0) {
    return console.log(error(cmdStr + '失败'))
  }
}

var help = function() {
  console.log('Usage: eftu [options]\n');
  console.log('Options:\n');
  console.log('  -h, --help', 'help doc');
  console.log('  -v, --version', 'eftu version');
  console.log('  [unit-name]', '创建名为 unit-name 的 unit 项目');
  console.log('  link [appName]', '给当前项目创建 appName 下所有已 clone 到本地的 unit 的软连接');
  console.log('  build', 'cortex build 并创建最新版本的软连接 latest');

  console.log('\nOther Options:\n');
  console.log('  install, update, watch, ls, search, publish, unpublish, adduser, init, profile, server, shrinkwrap. Same as cortex.\n')
}

var version = function() {
  console.log(pkgJson.version);
}

switch (firstArg) {
  case 'build':
    buildProj();
    break;
  case 'install':
  case 'update':
  case 'watch':
  case 'config':
  case 'ls':
  case 'search':
  case 'publish':
  case 'unpublish':
  case 'adduser':
  case 'init':
  case 'profile':
  case 'server':
  case 'shrinkwrap':
    cortexCmd(allArgs);
    break;
  case 'link':
    linkProj(allArgs);
    break;
  case '-h':
  case '--help':
    help();
    break;
  case '-v':
  case '--version':
    version();
    break;
  default:
    createProj(firstArg);
    break;
}
