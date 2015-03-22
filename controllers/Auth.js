/**
 * Created by Alexey Tayanchin on 15.07.14.
 */

var data = require('./../core/dataset.js');
var emailService = require('../core/email.js');
var tools = require('../core/tools.js');
var errors = require('../core/errors.js');
var cache = require('memory-cache');
var CONST = require('../core/const.js');

exports.register = function(req, res){

    var d = req.body;

    var name = d.name;
    var email = d.email;
    var password = d.password;



    if(!name)
        return res.send(errors.noUsername);

    if(!tools.validateEmail(email))
        return res.send(errors.invalidEmail);

    if(!password)
        return res.send(errors.noPassword);


    data.User.register(d, function(err, user){

        if(err)
            return res.send(err);


        var mailData = {
            code: user.email_code,
            name: user.name,
            subject: 'Успешная регистрация'
        };

        emailService.send(user.email, mailData, 'mail/register');

        res.send({status: 'ok'});

        console.info('Регистрация пользователя', email);

    });

};

exports.confirm = function(req, res){

    var code = req.query.code;
    var redirect = req.query.redirect;

    if(!redirect) redirect = '/';

    data.User.confirm(code, function(err, user){

        if(err)
            return tools.template('confirm_error', {}, res);


        res.header('Location', redirect);
        res.send(302);

        console.info('Пользователь', user.email, 'подтвержден');

    });

};

exports.forgot_password = function(req, res){

    var email = req.body.email;

    if(!tools.validateEmail(email))
        return res.send(errors.invalidEmail);

    data.User.getByEmail(email, function(err, user){

        if(!user)
            return res.send(errors.userNotFound);

        var mailData = {
            code: tools.encrypt(user._id + user.email),
            name: user.name,
            email: email,
            subject: 'Запрос на восстановление пароля'
        };

        emailService.send(email, mailData, 'mail/forgot_request');

        res.send({status: 'ok'});

        console.info('Запрошено восстановление пароля для', email);

    });

};

exports.forgot_request = function(req, res){

    var code = req.query.code;
    var email = req.query.email;

    data.User.getByEmail(email, function(err, user) {

        if (!user)
            return tools.template('error', {message: 'Нельзя восстановить пороль потому что пользователь не найден'}, res);

        var origCode = tools.encrypt(user._id + user.email);

        if(origCode != code)
            return tools.template('error', {message: 'Нельзя восстановить пороль, неверный код безопасности'}, res);


        user.status = CONST.USER_STATUS_NEW;
        user.save();

        res.header('Location', '/admin/forgot-set.html?code=' + code + '&email=' + email);
        res.send(302);

    });

};

exports.forgot_set = function(req, res){

    var d = req.body;
    var code = d.code;
    var email = d.email;
    var password = d.password;

    if(!password)
        return res.send(errors.noPassword);


    data.User.getByEmail(email, function(err, user) {

        if (!user)
            return res.send(errors.userNotFound);

        var origCode = tools.encrypt(user._id + user.email);

        if(origCode != code)
            return res.send(errors.wrongVerificationCode);


        console.log(password, tools.sha1(password));

        user.password = tools.sha1(password);
        user.status = CONST.USER_STATUS_REGULAR;
        user.save(function(err, doc){

            res.send({status: 'ok'});

            console.info('Новый пароль установлен для пользователя', email);

        });

    });

};

exports.get_token = function(req, res){

    var email = req.query.email || req.body.email;
    var password = req.query.password || req.body.password;
    var saveCookie = (req.query.cookie || req.body.cookie) == 'true';

    data.User.get_token(email, password, function(err, user){

        if(err)
            return res.send(err);

        if(saveCookie)
            res.setCookie('access_token', tools.encrypt(user.token.access_token), {
                maxAge: 600000,
                path: '/',
                //secure: false,
                httpOnly: true
            });


        res.send(user.token);

        console.info('Пользователь', user.email, 'получил новый токен');

    });

};

exports.refresh_token = function(req, res){

    var refresh = req.query.refresh || req.body.refresh;

    data.User.refresh_token(refresh, function(err, user){

        if(err)
            return res.send(err);

        res.send(user.token);

        console.info('Пользователь', user.email, 'обновил токен');

    });

};

exports.remove_token = function(req, res){

    var refresh = req.query.refresh || req.body.refresh;

    data.User.remove_token(refresh, function(err, user){

        if(err)
            return res.send(err);

        res.send({status: 'ok'});

        console.info('Пользователь', user.email, 'удалил свой токен');

    });

};

exports.sing_out = function(req, res){

    if(!req.user)
        return res.send(errors.authRequire);

    var redirect = req.query.redirect ? req.query.redirect : '/';

    cache.put(req.user.token.access_token, null, 1);

    req.user.token = {};
    req.user.save(function(err, doc){

        res.setCookie('access_token', '', {
            maxAge: 0,
            path: '/',
            httpOnly: true
        });

        res.header('Location', redirect);
        res.send(302);

    });

};

exports.socket_connect = function(s, d){

    console.log('CLIENT CONNECT');

};

exports.socket_disconnect = function(s, d){

    console.log('CLIENT DISCONNECT');

};

exports.socket_test = function(s, d){

    console.log('TEST', d);

    s.sendEvent('echo', {text: d.text});

};

exports.socket_chat = function(s, d, callback){

    callback({status: 'ok'});

};