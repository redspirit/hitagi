/**
 * Created by Алексей on 07.03.2015.
 * Вспомогательные функции
 */

var crypto = require('crypto');
var ejs = require('ejs');
var fs = require('fs');


exports.md5 = function(str){
    return crypto.createHash('md5').update(str).digest('hex');
};
exports.sha1 = function(str){
    return crypto.createHash('sha1').update(str).digest('hex');
};
exports.to_base64 = function(data) {
    return new Buffer(data, 'binary').toString('base64');
}
exports.from_base64 = function(str) {
    return new Buffer(str, 'base64').toString('binary');
}
exports.ramdomString = function(length){
    for (var a = "", b = 0; b < c; b++)
        a += "AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz1234567890"[Math.floor(62 * Math.random())];
    return a
};
exports.template = function(name, data, cb){

    fs.readFile('./views/' + name + '.html', 'utf8', function(err, text) {
        if (err)
            return cb({error: err});

        cb(ejs.render(text, data, {
            delimiter: '?'
        }));

    });


};