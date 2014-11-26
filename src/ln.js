var path = require('path');
var fs = require('fs');
var shelljs = require('shelljs');

var clc = require('cli-color');
var error = clc.red.bold;
var warn = clc.yellow;
var notice = clc.blue;

var creatLinks = function(pkgs) {
  var unitNames = Object.keys(pkgs.packages);
  var cwd = shelljs.pwd();

  var parentDir = path.dirname(cwd);
  var targetDir = path.join(cwd, 'neurons');
  var projName = path.basename(cwd);

  var index = unitNames.indexOf(projName);
  unitNames.splice(index, 1);

  var _ln = function (unitBuiltDir, unitName) {
    shelljs.rm('-rf', path.join(targetDir, unitName));
    shelljs.ln('-s', unitBuiltDir, path.join(targetDir, unitName));
    console.log(notice('link ') +
      path.join(parentDir, unitName, 'neurons/' + unitName) +
      ' > ' +
      path.join(targetDir, unitName));
  }

  try {
    unitNames.forEach(function(unitName) {
      var unitDir = path.join(parentDir, unitName);
      var unitBuiltDir = path.join(unitDir, 'neurons/' + unitName);

      if (fs.existsSync(unitBuiltDir) && fs.lstatSync(unitBuiltDir).isDirectory()) {
        return _ln(unitBuiltDir, unitName);
      }

      if (fs.existsSync(unitDir)) {
        shelljs.cd(unitDir);

        if (shelljs.exec('eftu install').code === 0 && shelljs.exec('eftu build', { async: false }).code === 0) {
          _ln(unitBuiltDir, unitName);
        } else {
          console.log(error('build ' + unitName + '失败'));
        }

        shelljs.cd(cwd);
      }
    });
  } catch (e) {
    console.log(error('创建软连接失败\n' + e.message));
  }
}

var BETA = 'http://beta.efte.dp';
var TEMP_JSON_FILE = '.pkgs.json';

module.exports = function(args) {
  if (args.length < 2) {
    return console.log(error('请输入 app 名称'));
  }

  if (args.length >= 3) {
    return console.log(error('参数个数不正确: eftu link appName'));
  }

  var param = {
    appName: args[1],
    packages: {}
  };

  var curlStr = 'curl --header "Content-Type:application/json" -d \'' +
    JSON.stringify(param) + '\' ' +
    BETA + '/api/app/' + args[1] +
    '/checkupdate -o ' +TEMP_JSON_FILE;

  if (shelljs.exec(curlStr, {
      async: false
    }).code !== 0) {
    return console.log(error('获取 unit 项目失败'));
  }

  var resJson = require(path.join(shelljs.pwd(), TEMP_JSON_FILE));

  creatLinks(resJson);
}
