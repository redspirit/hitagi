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
exports.ramdomString = function(c){
    for (var a = "", b = 0; b < c; b++)
        a += "AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz1234567890_"[Math.floor(63 * Math.random())];
    return a
};
exports.validateEmail = function(email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}
exports.template = function(name, data, cb){

    fs.readFile('./views/' + name + '.html', 'utf8', function(err, text) {
        if (err)
            return cb({error: err});

        var body = ejs.render(text, data, {
            delimiter: '?'
        });

        // отдает результат в RES
        if (typeof cb == 'object') {

            cb.writeHead(200, {
                'Content-Length': Buffer.byteLength(body),
                'Content-Type': 'text/html'
            });
            cb.write(body);
            return cb.end();

        }

        if(typeof cb == 'function')
            return cb(body);

    });

};