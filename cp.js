var spawn = require('child_process');
var path = require('path');

console.log(NODE_PATH);
spawn('cp', ['-f', path.join(__dirname, 'template', '*'), './']);
