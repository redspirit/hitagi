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

    data.Room.make(fields, function(err, room){

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

    data.Room.byOwner(user._id, function(err, rooms){

        res.send(rooms);

    });

};

exports.widget_init = function(s, d, callback) {

    if(!d.roomId)
        return callback(errors.roomIdNotSet);

    data.Room.info(d.roomId, function(err, room){

        if(!room)
            return callback(errors.roomNotFound);

        console.log('Инициализация комнаты', room.caption);

        room.history({limit: 30}, function(err, messages){

            room.User.usersList(s.roomUsers(d.roomId), function(err, users){
                
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


    data.Room.info(roomId, function(err, room){

        if(!room)
            return callback(errors.roomNotFound);


        room.pushMessage(text, s.user, function(err, mess){

            s.toRoom(room._id.toString(), 'chat', _.omit(mess.toObject(), ['__v', 'r']));

            console.log('Сообщение от', s.user.name, ':', text);
        });

    });

};
