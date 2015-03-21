/**
 * Created by Алексей on 31.01.2015.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var moment = require('moment');
var errors = require('../core/errors.js');

var RoomSchema = new Schema({
    alias: {
        type: String,
        unique: true
    },
    caption: {
        type: String
    },
    topic: {
        type: String,
        default: ''
    },
    create_date: {
        type: Date
    },
    owner: {
        type: Schema.Types.ObjectId
    },
    users: [{
        type: Schema.Types.ObjectId
    }]
});


RoomSchema.statics.make = function(d, cb){
    var Room = this;

    Room.findOne({alias: d.alias}, function(err, room){

        if(room)
            return cb(errors.busyRoomAlias);

        d.create_date = Date.now();
        var room = new Room(d);
        room.save(cb);

    });

};

RoomSchema.statics.byOwner = function(owner, cb){
    var Room = this;
    Room.find({owner: owner}, cb);
};

RoomSchema.statics.byUser = function(user, cb){
    var Room = this;
    Room.find({users: user}, cb);
};


exports.model = RoomSchema;
