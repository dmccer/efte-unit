var spawn = require('child_process').spawn;
var path = require('path');

spawn('cp', ['-f', path.join(__dirname, 'template', '*'), './']);
console.log(path.join(__dirname, 'template', '*'));
