/**
 * Created by Алексей on 07.03.2015.
 * Вспомогательные функции
 */

var crypto = require('crypto').createHash('md5');


exports.md5 = function(str){

    return crypto.update(str).digest('hex');

};