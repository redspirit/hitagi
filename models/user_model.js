/**
 * Created by Алексей on 31.01.2015.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var tools = require('../core/tools.js');
var CONST = require('../core/const.js').data;
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
    email_code: {
        type: String
    },
    token: {                // хэш с oauth2 токенами
        type: Schema.Types.Mixed,
        default: {}
    }
});



UserSchema.statics.register = function(data, cb){
    var User = this;

    //console.log(data);

    User.findOne({email: data.email}, function(err, checkUser){

        if(checkUser)
            return cb('email', null);

        var user = new User({
            name: data.name,
            email: data.email,
            password: tools.sha1(data.password),
            status: CONST.USER_STATUS_NEW,
            reg_date: Date.now(),
            api_key: tools.ramdomString(12),
            email_code: tools.ramdomString(24)
        });

        user.save(cb);

    });

};

UserSchema.statics.confirm = function(code, cb){
    var User = this;

    User.findOne({email_code: code, status: CONST.USER_STATUS_NEW}, function(err, user){

        if(!user)
            return cb('user not found', null);

        user.status = CONST.USER_STATUS_REGULAR;
        user.email_code = '';
        user.save(cb);

    });

};

UserSchema.statics.byToken = function(token, cb){
    var User = this;
    // игнорирует новых и заблокированных пользователей
    User.findOne({'token.access_token': token, status: {'$gte': CONST.USER_STATUS_REGULAR}}, cb);
};

UserSchema.methods.forgot_password = function(cb){
    var user = this;


};

UserSchema.statics.get_token = function(email, pass, cb){
    var User = this;
    var password =  tools.sha1(pass);

    User.findOne({email: email, password: password}, function(err, user) {

        if(!user)
            return cb('user not found', null);

        user.token = {
            access_token: tools.ramdomString(24),
            refresh_token: tools.ramdomString(16),
            expires_in: 86400
        };

        user.save(cb);

    });

};

UserSchema.statics.refresh_token = function(refresh, cb){
    var User = this;

    User.findOne({'token.refresh_token': refresh}, function(err, user) {

        if(!user)
            return cb('user not found', null);

        user.token = {
            access_token: tools.ramdomString(24),
            refresh_token: tools.ramdomString(16),
            expires_in: 86400
        };

        user.save(cb);

    });

};

UserSchema.statics.remove_token = function(cb){
    var User = this;

    User.findOne({'token.refresh_token': refresh}, function(err, user) {

        if(!user)
            return cb('user not found', null);

        user.token = {};

        user.save(cb);

    });

};



exports.model = UserSchema;