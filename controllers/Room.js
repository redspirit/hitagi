/**
 * Created by Алексей on 21.03.2015.
 */

var data = require('./../core/dataset.js');
var tools = require('../core/tools.js');
var errors = require('../core/errors.js');
var CONST = require('../core/const.js');


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

    console.log('Инициализация комнаты', d.roomId);

    data.Room.info(d.roomId, function(err, room){

        if(!room)
            return callback(errors.roomNotFound);

        callback(room);

    });

};

exports.chat_message = function(s, d, callback) {

    if(!s.user)
        return callback(errors.noChatUser);

    var text = d.t;
    var roomId = d.r;

    if(!text)
        return callback(errors.emptyMessage);

    if(!data.isObjectId(roomId))
        return callback(errors.roomIdNotSet);


    data.History.add({
        text: text,
        user: s.user._id,
        room: data.ObjectId(roomId)
    }, function(err, doc){

        console.log('Сообщение от', s.user.name, ':', text);

    });


};