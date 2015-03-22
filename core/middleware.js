/**
 * Created by Алексей on 09.03.2015.
 * Медиаторы для REST
 */

var data = require('./dataset.js');
var tools = require('./tools.js');
var queryString = require('querystring');
var cache = require('memory-cache');

// список путей, на которые нельзя перейти без авторизационных куки
var needPaths = [
    '/admin',
    '/admin/index.html'
];

// список путей, на которые наоборот нельзя перейти имея куки
var stopPaths = [
    '/admin/forgot.html',
    '/admin/forgot-set.html',
    '/admin/sign-in.html',
    '/admin/sign-up.html'
];



exports.checkToken = function(req, res, next){

    var parts = req._url.pathname.split('.');
    var ext = parts[parts.length - 1];
    var token = req.body.access_token || req.headers.access_token;

    if(token || req.cookies.access_token)
        token = tools.decrypt(req.cookies.access_token);

    req.user = null;

    if(!token)
        return next();

    if(ext == 'css' || ext == 'js' || ext == 'ico' || ext == 'woff' || ext == 'png' || ext == 'jpg' || ext == 'jpeg')
        return next();

    if(cache.get(token)) {
        req.user = cache.get(token);
        return next();
    }

    data.User.byToken(token, function(err, user){
        console.log('get user info from db by token,', user.email);
        req.user = user;
        cache.put(token, user, 60 * 60 * 1000);
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

exports.checkPages = function(req, res, next){

    if(needPaths.indexOf(req._url.pathname) > -1 && !req.user) {
        res.header('Location', '/admin/sign-in.html');
        return res.send(302);
    }

    if(stopPaths.indexOf(req._url.pathname) > -1 && req.user) {
        res.header('Location', '/admin/index.html');
        return res.send(302);
    }

    next();

};