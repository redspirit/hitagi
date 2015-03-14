/**
 * Created by Alexey Tayanchin on 15.07.14.
 */

var data = require('./../core/dataset.js');
var emailService = require('../core/email.js');
var tools = require('../core/tools.js');
var errors = require('../core/errors.js');


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

    res.send('Функционал не реализован');

};

exports.get_token = function(req, res){

    var email = req.query.email || req.body.email;
    var password = req.query.password || req.body.password;
    var saveCookie = req.query.cookie == 'true';


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