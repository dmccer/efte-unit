var clc = require('cli-color');
var path = require('path');
var fs = require('fs');
var shelljs = require('shelljs');
var readline = require('readline');
var async = require('async');
var spawn = require('child_process').spawn;
var inquirer = require('inquirer');

var editJson = require('./edit-json');

var error = clc.red.bold;
var warn = clc.yellow;
var notice = clc.cyan;

var TPL_UNIT = 'unit-m-template';

var steps = [];

var rollback = function() {
  console.log('rollbank')
}

var createProjDir = function(proj, cb) {
  if (shelljs.test('-d', proj)) {
    return cb(new Error('目录已存在'))
  }

  shelljs.mkdir('-p', proj);

  console.log(notice('创建项目文件夹成功'));
  cb();
}

var gitInit = function(cb) {
  inquirer.prompt([{
    type: 'input',
    name: 'gitUrl',
    message: '请输入 git url',
    validate: function(val) {
      if (!!val) {
        return true;
      }

      return 'git url 不能为空';
    }
  }], function(answer) {
    var gitInitStr = 'git init';
    if (shelljs.exec(gitInitStr).code !== 0) {
      return cb(new Error(gitInitStr));
    }

    var gitAddRemoteStr = 'git remote add origin ' + answer.gitUrl;
    if (shelljs.exec(gitAddRemoteStr).code !== 0) {
      return cb(new Error(gitAddRemoteStr + ' 失败'));
    }

    console.log(notice('初始化 git 成功'));
    cb();
  });
}

var cortexInit = function(cb) {
  var cortexInitStr = 'cortex init';
  var cortexInit = spawn('cortex', ['init'], {
    stdio: 'inherit'
  });

  cortexInit.on('close', function(code) {
    if (code !== 0) {
      return cb(new Error(cortexInitStr + ' 失败'));
    }

    console.log(notice('cortex init 成功'));
    cb();
  });
}

var npmInit = function(cb) {
  var npmInitStr = 'npm init';
  var npmInit = spawn('npm', ['init'], {
    stdio: 'inherit'
  });

  npmInit.on('close', function(code) {
    if (code !== 0) {
      return cb(new Error(npmInitStr + ' 失败'));
    }

    console.log(notice('npm init 成功'));
    cb();
  });
}

var creatDirStruct = function(cb) {
  try {
    shelljs.rm('-f', './index.html');
    shelljs.mkdir('-p', ['handlebar', 'less', 'less/page', 'js', 'js/page', 'js/env', 'js/util', 'src']);

    console.log(notice('创建项目目录结构成功'));
    cb();
  } catch (e) {
    cb(new Error('创建项目目录结构失败\n' + e.message));
  }
}

var installNpmDependencies = function(cb) {
  try {
    shelljs.exec('npm install gulp --save-dev', {
      async: false
    });
    shelljs.exec('npm install gulp-less --save-dev', {
      async: false
    });
    shelljs.exec('npm install gulp-cortex-handlebars-compiler --save-dev', {
      async: false
    });

    console.log(notice('安装 npm 工具依赖成功'));
    cb();
  } catch (e) {
    cb(new Error('安装 npm 工具依赖失败'));
  }
}

var installTplProj = function(proj, cb) {
  try {
    shelljs.cp('-rf', __dirname + '/../template/*', './');

    var output = shelljs.exec('grep -rl ' + TPL_UNIT + ' ./handlebar/*', {
      async: false
    }).output.replace(/\r?\n|\r/g, '%-%');

    var files = output.split('%-%').slice(0, -1);
    files.pop();

    files.forEach(function(file) {
      file = path.resolve(shelljs.pwd(), file);

      var fcon = fs.readFileSync(file, {
        encoding: 'utf8'
      });

      fcon = fcon.replace(new RegExp(TPL_UNIT, 'g'), proj);

      fs.writeFileSync(file, fcon);
    });

    console.log(notice('安装模板项目成功'));
    cb();
  } catch (e) {
    cb(new Error('安装模板项目失败\n' + e.message));
  }
}

var installJsDep = function(cb) {
  if (shelljs.exec('cortex install zepto --save', {
      async: false
    }).code !== 0) {
    return cb(new Error('安装 zepto 失败'));
  }

  if (shelljs.exec('cortex install underscore --save', {
      async: false
    }).code !== 0) {
    return cb(new Error('安装 underscore 失败'));
  }

  if (shelljs.exec('cortex install efte --save', {
      async: false
    }).code !== 0) {
    return cb(new Error('安装 eftejs 失败'));
  }

  console.log(notice('安装 js 公共依赖库成功'));
  cb();
}

var installTheme = function(cb) {
  inquirer.prompt([{
    type: 'confirm',
    name: 'installTheme',
    message: '是否安装 apollo 皮肤主题 less',
    default: true,
    choices: [{
      name: '是',
      value: true
    }, {
      name: '否',
      value: false
    }]
  }], function(answer) {
    var gitCmd = [
      'git submodule add "git@code.dianpingoa.com:f2e/m-apollo-theme-base.git" less/common',
      'cd less/common',
      'git checkout master',
      'cd ../../'
    ].join(' & ');
    
    if (answer.installTheme) {
      if (shelljs.exec(gitCmd).code !== 0) {
        return cb(new Error('安装 apollo 皮肤主题 less 失败'));
      }

      console.log(notice('安装 apollo 皮肤主题 less 成功'));
    }

    cb();
  });
}

var editIgnoreFile = function(cb) {
  try {
    var file = path.resolve(shelljs.pwd(), '.gitignore');
    var fcon = fs.readFileSync(file, {
      encoding: 'utf8'
    });

    var prefix = '# custom\nless/common\nsrc\n';

    fcon = prefix + fcon;

    fs.writeFileSync(file, fcon);

    console.log(notice('配置 .gitignore 成功'));
    cb();
  } catch (e) {
    cb(new Error('配置 .gitignore 失败\n' + e.message));
  }
}

var commitModify = function(cb) {
  if (shelljs.exec('git add -A', { async: false }).code !== 0) {
    return cb(new Error('提交变更失败'));
  }

  if (shelljs.exec('git commit -m "创建项目并初始化"', { async: false }).code !== 0) {
    return cb(new Error('提交变更失败'));
  }

  console.log(notice('提交变更成功'));
  cb();
}

var successTip = function(proj, cb) {
  console.log(notice('创建项目' + proj + '成功'))
  cb();
}

var guide = function(cb) {
  console.log('建议安装 imock')
  console.log('- ' + notice('npm install imock'));
  console.log('- ' + notice('imock -j mock -b api -w neurons'));
  console.log('- ' + notice('浏览器打开 open http://localhost:3000/neurons/*/src/index.html'));
  console.log(warn('*************************************'));
  console.log(warn('*   Happy on Developing with Efte   *'));
  console.log(warn('*************************************'));

  cb();
}

module.exports = function(proj) {
  async
    .waterfall([
      // 创建 unit 项目文件夹
      function(cb) {
        createProjDir(proj, cb);
      },
      
      // 进入 unit 项目目录
      function(cb) {
        shelljs.cd(proj);
        cb();
      },

      // 初始化 git
      gitInit,

      // cortex init
      cortexInit,

      // npm init
      npmInit,

      // 创建项目目录结构
      creatDirStruct,

      // 安装 npm 工具依赖
      installNpmDependencies,

      // 安装模板项目
      function(cb) {
        installTplProj(proj, cb);
      },

      // 安装 js 公共依赖库
      installJsDep,

      // 安装 apollo 基础样式库
      installTheme,

      // 编辑 cortex.json 和 package.json
      function(cb) {
        try {
          editJson();

          console.log(notice('配置 cortex.json 和 package.json 成功'));
          cb();
        } catch (e) {
          cb(new Error('配置 cortex.json 和 package.json 失败\n' + e.message));
        }
      },

      // 编辑 gitignore
      editIgnoreFile,

      // 提交变更
      commitModify,

      // 成功提示
      function(cb) {
        successTip(proj, cb);
      },

      // 建议
      guide
    ], function(err, rs) {
      if (err) {
        console.log(error(err.message));
        return;
      }
    });
}
