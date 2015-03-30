/**
 * Created by Алексей on 31.01.2015.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var tools = require('../core/tools.js');
var CONST = require('../core/const.js');
var errors = require('../core/errors.js');
//var moment = require('moment');
var _ = require('underscore');


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
    guest_code: {           // уникальный код для определения гостя
        type: String
    },
    last_ip: {              // последний IP используемый для авторизации
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


UserSchema.methods.clear = function(){
    return _.pick(this.toObject(), ['alias', 'name', 'email', 'status', 'last_login', 'reg_date', 'avatar', 'api_key']);
};

UserSchema.methods.clearGuest = function(){
    return _.pick(this.toObject(), ['_id', 'name', 'status', 'last_login', 'guest_code', 'last_ip']);
};

UserSchema.methods.clearMember = function(){
    return _.pick(this.toObject(), ['_id', 'name', 'status', 'last_login', 'avatar', 'last_ip']);
};

UserSchema.statics.register = function(data, cb){
    var User = this;

    User.findOne({email: data.email}, function(err, checkUser){

        if(checkUser)
            return cb(errors.busyEmail, null);

        var user = new User({
            name: data.name,
            status: CONST.USER_STATUS_NEW,
            reg_date: Date.now(),
            api_key: tools.ramdomString(12),
            email_code: tools.ramdomString(24)
        });

        user.save(cb);

    });

};

UserSchema.statics.register_guest = function(code, nick, ip, cb){

    var User = this;

    User.findOne({guest_code: code}, function(err, guest) {

        if(guest)
            return cb(null, guest);

        var newGuest = new User({
            name: nick,
            guest_code: code,
            status: CONST.USER_STATUS_GUEST,
            reg_date: Date.now(),
            last_ip: ip
        });

        newGuest.save(cb);

    });


};

UserSchema.statics.confirm = function(code, cb){
    var User = this;

    User.findOne({email_code: code, status: CONST.USER_STATUS_NEW}, function(err, user){

        if(!user)
            return cb(errors.userNotFound, null);

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
            return cb(errors.userNotFound, null);

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
            return cb(errors.userNotFound, null);

        user.token = {
            access_token: tools.ramdomString(24),
            refresh_token: tools.ramdomString(16),
            expires_in: 86400
        };

        user.save(cb);

    });

};

UserSchema.statics.remove_token = function(token, cb){
    var User = this;

    User.findOne({'token.access_token': token}, function(err, user) {

        if(!user)
            return cb(errors.userNotFound, null);

        user.token = {};

        user.save(cb);

    });

};

UserSchema.statics.getByEmail = function(email, cb){
    var User = this;
    User.findOne({email: email}, cb);
};

UserSchema.statics.usersList = function(ids, cb){
    var User = this;
    // сконвертить в ObkectId
    
    console.log('ids', ids);
    
    User.find({_id: {'$in': ids}}, function(err, users){
        
        var result = _.map(users, function(user){
            return user.clearMember();
        });
        
        cb(err, result);
        
    });
};

exports.model = UserSchema;
