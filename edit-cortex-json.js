var jf = require('jsonfile');
var path = require('path');
var util = require('util');
var extend = require('extend');

var tplJson = {
  "directories": {
    "src": "src"
  },
  "scripts": {
    "prebuild": "./node_moudles/.bin/gulp"
  },
  "entries": [
    "./js/page/*.js"
  ]
};

var args = process.argv;

var file = path.join(process.cwd(), args[2]);
var cortexJson = jf.readFileSync(file);

extend(true, cortexJson, tplJson);

jf.writeFileSync(file, cortexJson);
