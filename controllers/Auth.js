/**
 * Created by Alexey Tayanchin on 15.07.14.
 */

var data = require('./../core/dataset.js');
var email = require('../core/email.js');
var tools = require('../core/tools.js');
var _ = require('underscore');


exports.register = function(req, res){

    var d = req.body;

    var name = d.name;
    var email = d.email;
    var password = d.password;

    if(!name)
        return res.send({error: 'Не указано имя пользователя'});

    if(!tools.validateEmail(email))
        return res.send({error: 'Неверно указан емейл пользователя'});

    if(!password)
        return res.send({error: 'Не указан пароль пользователя'});



    data.User.register(d, function(err, user){

        if(err)
            return res.send({error: err});



        email.send(user.email, _.extend(user, {subject: 'Успешная регистрация'}), 'mail/register');

        res.send({status: 'ok'});

    });

};

exports.confirm = function(req, res){

    var code = req.query.code;
    var redirect = req.query.redirect;


    data.User.confirm(code, function(err, user){


        // todo редиректим на указанный урл


    });


    res.send('this is me login!!!');

};


exports.forgot_password = function(req, res){

    res.send('Функционал не реализован');

};

exports.get_token = function(req, res){

    res.send('Функционал не реализован');

};

exports.refresh_token = function(req, res){

    res.send('Функционал не реализован');

};

exports.remove_token = function(req, res){

    res.send('Функционал не реализован');

};