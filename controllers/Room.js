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