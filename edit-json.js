var jf = require('jsonfile');
var path = require('path');
var extend = require('extend');

var ctxTplJson = {
  "directories": {
    "src": "src"
  },
  "scripts": {
    "prebuild": "./node_modules/.bin/gulp"
  },
  "entries": [
    "./js/page/*.js"
  ]
};

var pkgTplJson = {
  "scripts": {
    "test": "cortex test"
  }
};

var CORTEXT_JSON = 'cortex.json';
var PACKAGE_JSON = 'package.json';

var editJsonFile = function (file, tplJson) {
  var json = jf.readFileSync(file);
  extend(true, json, tplJson);
  jf.writeFileSync(file, json);
};

// 修改 cortex json
editJsonFile(path.join(process.cwd(), CORTEXT_JSON), ctxTplJson);
// 修改 package json
editJsonFile(path.join(process.cwd(), PACKAGE_JSON), pkgTplJson);
