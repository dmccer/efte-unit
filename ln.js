var path = require('path');
var fs = require('fs');
var spawn = require('child_process').spawn;

var PKGS = process.argv[2];
var cwd = process.cwd();
var json = path.join(cwd, PKGS);
var pkgs = require(json).packages;

var unitNames = Object.keys(pkgs);

var parentDir = path.dirname(cwd);
var targetDir = path.join(cwd, 'neurons');
var projName = path.basename(cwd);

var index = unitNames.indexOf(projName);
unitNames.splice(index, 1);

try {
  unitNames.forEach(function (unitName) {
    var unitDir = path.join(parentDir, unitName, 'neurons/' + unitName);

    if (fs.existsSync(unitDir)) {
      var stats = fs.lstatSync(unitDir);

      if (stats.isDirectory()) {
        spawn('ln', ['-s', unitDir, targetDir]);
        console.log('link ' + path.join(parentDir, unitName, 'neurons/' + unitName) + ' > ' + targetDir);
      }
    }
  });
} catch (e) {
  console.warn('创建软连接失败');
  console.log(e);
}
