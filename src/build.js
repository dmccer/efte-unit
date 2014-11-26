var clc = require('cli-color');
var path = require('path');
var shelljs = require('shelljs');

var fs = require('fs');
var jf = require('jsonfile');
var stripJsonComments = require('strip-json-comments');

var error = clc.red.bold;
var notice = clc.cyan;

var PROJ = path.basename(process.cwd());
var CORTEXT_JSON = 'cortex.json';

var stripComment = function (file) {
  var fileCon = fs.readFileSync(file, {
    encoding: 'utf8'
  });
  fileCon = stripJsonComments(fileCon);
  fs.writeFileSync(file, fileCon);
}

module.exports = function () {
	try {
		var ctxJsonFile = path.join(shelljs.pwd(), CORTEXT_JSON);
		stripComment(ctxJsonFile);

		if (shelljs.exec('cortex build', { async: false }).code !== 0) {
			return console.log(error('cortex build 失败'));
		}
		
		var json = jf.readFileSync(ctxJsonFile);

		var buildProjDir = 'neurons/' + PROJ + '/';
		var latest = path.resolve(shelljs.pwd(), buildProjDir + 'latest');
		var version = path.resolve(shelljs.pwd(), buildProjDir + json.version);

		shelljs.rm('-rf', latest);
		shelljs.ln('-s', version, latest)
		console.log(notice('link') + ' ' + latest + ' -> ' + version);
	} catch (e) {
		console.log(error('build 失败'));
	}
}