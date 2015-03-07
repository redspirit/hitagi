/**
 * Created by Alexey Tayanchin on 15.07.14.
 */


exports.register = function(req, res){

    console.log(req.body);

    res.send('this is me register !!!');

};

exports.confirm = function(req, res){

    console.log(req.query);

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