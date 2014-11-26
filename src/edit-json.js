var jf = require('jsonfile');
var fs = require('fs');
var path = require('path');
var extend = require('extend');
var stripJsonComments = require('strip-json-comments');

var ctxTplJson = {
  'directories': {
    'src': 'src'
  },
  'scripts': {
    'prebuild': './node_modules/.bin/gulp'
  },
  'entries': [
    './js/page/*.js'
  ]
};

var pkgTplJson = {
  'scripts': {
    'test': 'cortex test'
  }
};

var CORTEXT_JSON = 'cortex.json';
var PACKAGE_JSON = 'package.json';

var editJsonFile = function (file, tplJson) {
  var json = jf.readFileSync(file);
  extend(true, json, tplJson);
  jf.writeFileSync(file, json);
};

var stripComment = function (file) {
  var fileCon = fs.readFileSync(file, {
    encoding: 'utf8'
  });
  fileCon = stripJsonComments(fileCon);
  fs.writeFileSync(file, fileCon);
}

module.exports = function () {
  var ctxFile = path.join(process.cwd(), CORTEXT_JSON);
  var pkgFile = path.join(process.cwd(), PACKAGE_JSON);

  stripComment(ctxFile);
  stripComment(pkgFile);

  // 修改 cortex json
  editJsonFile(ctxFile, ctxTplJson);
  // 修改 package json
  editJsonFile(pkgFile, pkgTplJson);  
}