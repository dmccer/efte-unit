#!/usr/bin/env node

var clc = require('cli-color');
var path = require('path');
var shelljs = require('shelljs');
var createProj = require('../src/create');

var error = clc.red.bold;
var warn = clc.yellow;
var notice = clc.blue;

if (!shelljs.which('git')) {
	console.log(error('请先安装 git 工具'));
	process.exit();
}

if (!shelljs.which('cortex')) {
	console.log(error('请先使用 ') + notice('npm install -g cortex') + error(' 安装 cortex 工具'));
	process.exit();
}

var SEP_LINE = '\n======================================\n';

// 项目常量
var VERSION,
	PROJ = path.basename(process.cwd()),
	UNIT_PREFIX='unit-',
	TPL_UNIT='unit-m-template';


if (PROJ.indexOf(UNIT_PREFIX) != -1) {
	VERSION = shelljs.sed('-e', 's/[^0-9\.]//g', grep('version', 'cortex.json'));
}

// 发布环境 url
var PRD = 'http://efte.dianping.com',
	BETA = 'http://beta.efte.dp',
	ALPHA = 'http://192.168.218.29';

// 可选命令
var build = 'build',
	install = 'install',
	update = 'update',
	watch = 'watch',
	link = 'link';

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

switch (firstArg) {
	case 'build':
		console.log('eftu build');
		break;
	case 'install':
		console.log('eftu install')
		break;
	case 'update':
		console.log('eftu update')
		break;
	case 'watch':
		console.log('eftu watch')
		break;
	case 'link':
		console.log('eftu link')
		break;
	default:
		createProj(firstArg);
		break;
}