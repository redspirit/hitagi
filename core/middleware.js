/**
 * Created by Алексей on 09.03.2015.
 * Медиаторы для REST
 */

var data = require('./dataset.js');
var tools = require('./tools.js');
//var CONST = require('./const.js').data;


exports.checkToken = function(req, res, next){

    var token = req.query.access_token || req.body.access_token || req.headers.access_token;

    if(token || req.cookies.access_token)
        token = tools.decrypt(req.cookies.access_token);


    req.user = null;

    if(!token)
        return next();

    data.User.byToken(token, function(err, user){
        req.user = user;
        next();
    });

};

exports.prepareBody = function(req, res, next){

    if(req.method == 'GET') {
        req.body = {};
        return next();
    }

    if(typeof req.body == 'string')
        req.body = queryString.parse(req.body);

    next();

};