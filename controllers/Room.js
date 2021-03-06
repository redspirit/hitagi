/**
 * Created by Алексей on 21.03.2015.
 */

var data = require('./../core/dataset.js');
var tools = require('../core/tools.js');
var errors = require('../core/errors.js');
var CONST = require('../core/const.js');
var _ = require('underscore');


exports.make = function(req, res){

    if(!req.user)
        return res.send(errors.authRequire);

    var user = req.user;
    var fields = {
        alias: req.body.alias,
        caption: req.body.caption,
        owner: user._id
    };

    return data.Room.make(fields, function(err, room){

        if(err)
            return res.send(errors.createRoomError);


        console.log('Создана новая комната', room.alias);
        res.send(room);

    });

};

exports.list = function(req, res) {

    if (!req.user)
        return res.send(errors.authRequire);


    var user = req.user;

    return data.Room.byOwner(user._id, function(err, rooms){

        res.send(rooms);

    });

};

exports.widget_init = function(s, d, callback) {

    if(!d.roomId)
        return callback(errors.roomIdNotSet);

    return data.Room.info(d.roomId, function(err, room){

        if(!room)
            return callback(errors.roomNotFound);

        room.shows++;
        room.save();

        console.log('Инициализация комнаты', room.caption);

        return room.history({limit: 30}, function(err, messages){

            data.User.usersList(s.roomUsers(d.roomId), function(err, users){
                
                var roomObj = room.toObject();
                roomObj.messages = messages;
                roomObj.users = users;
    
                callback(roomObj);

            });
            
        });

    });

};

exports.chat_message = function(s, d, callback) {

    if(!s.user)
        return callback(errors.noChatUser);

    var text = d.t;
    var roomId = d.r;

    if(!text)
        return callback(errors.emptyMessage);


    return data.Room.info(roomId, function(err, room){

        if(!room)
            return callback(errors.roomNotFound);


        room.pushMessage(text, s.user, function(err, mess){

            s.toRoom(room._id, 'chat', _.omit(mess.toObject(), ['__v', 'r']));

        });

    });

};

exports.join = function(s, d, callback) {

    if(!s.user)
        return callback(errors.noChatUser);

    if(!d.room)
        return callback(errors.roomIdNotSet);

    var getInfo = d.info ? true : false;

    data.Room.info(d.room, function(err, room){

        if(!room)
            return callback(errors.roomNotFound);

        s.join(room._id);
        s.toRoom(room._id, 'joined', user.clearMember());


        // отправляем только описание комнаты
        if(!getInfo)
            return callback(room);


        // отправляем историю и список юзеров комнаты
        return room.history({limit: 30}, function(err, messages){

            data.User.usersList(s.roomUsers(room._id), function(err, users){

                var roomObj = room.toObject();
                roomObj.messages = messages;
                roomObj.users = users;

                callback(roomObj);

            });

        });

    });

};



