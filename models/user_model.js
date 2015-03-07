/**
 * Created by Алексей on 31.01.2015.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var tools = require('../core/tools.js');
//var moment = require('moment');
//var _ = require('underscore');

var UserSchema = new Schema({
    alias: {                // уникальный идентификатор юзера, не обязателен
        type: String
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
        type: String
    },
    token: {                // хэш с oauth2 токенами
        type: Schema.Types.Mixed,
        default: {}
    }
});



UserSchema.statics.register = function(data, cb){
    var User = this;


    tools.md5('hello')

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