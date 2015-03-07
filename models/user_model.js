/**
 * Created by Алексей on 31.01.2015.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var tools = require('../core/tools.js');
var email = require('../core/email.js');
var CONST = require('../core/const.js');
//var moment = require('moment');
//var _ = require('underscore');

var UserSchema = new Schema({
    alias: {                // уникальный идентификатор юзера, не обязателен
        type: String,
        default: ''
    },
    name: {                 // текстовое имя
        type: String
    },
    email: {                // личный емейл
        type: String
    },
    password: {
        type: String
    },
    status: {               // статус
        type: Number
    },
    last_login: {
        type: Date
    },
    reg_date: {
        type: Date
    },
    avatar: {
        type: String,
        default: ''
    },
    api_key: {
        type: String
    },
    token: {                // хэш с oauth2 токенами
        type: Schema.Types.Mixed,
        default: {}
    }
});


//email.send('redspirit@live.ru', {name: 'Вася ппупкинс', subject: 'Успешная регистрация'}, 'mail/register');


UserSchema.statics.register = function(data, cb){
    var User = this;

    var name = data.name;
    var email = data.email;
    var password = data.password;

    User.findOne({email: email}, function(err, checkUser){

        if(checkUser)
            return cb({error: 'email'});


        var user = new User({
            name: name,
            email: email,
            password: tools.sha1(password),
            status: CONST.USER_STATUS_NEW,
            reg_date: Date.now(),
            api_key: tools.ramdomString(12)
        });

        user.save(function(err, doc){

            if(err)
                return cb({error: err});

            cb(doc);

        });

    });

};

UserSchema.methods.confirm = function(cb){
    var user = this;


};

UserSchema.methods.forgot_password = function(cb){
    var user = this;


};

UserSchema.methods.get_token = function(cb){
    var user = this;


};

UserSchema.methods.refresh_token = function(cb){
    var user = this;


};

UserSchema.methods.remove_token = function(cb){
    var user = this;


};



exports.model = UserSchema;