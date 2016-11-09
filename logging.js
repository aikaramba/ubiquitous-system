const fs = require("fs");
// create a write stream (in append mode)
let accessLogStream = fs.createWriteStream(__dirname + '/access.log', {flags: 'a'});
module.exports = require("morgan")("combined", {stream: accessLogStream});
