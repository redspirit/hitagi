/**
 * Created by Алексей on 31.01.2015.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var moment = require('moment');
var errors = require('../core/errors.js');
var _ = require('underscore');

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
    messages_count: {
        type: Number,
        default: 0
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

RoomSchema.statics.info = function(id, cb){
    var Room = this;
    Room.findById(id, cb);
};

RoomSchema.methods.history = function(query, cb){

    var room = this;

    /*
     query
         skip:0, // Starting Row
         limit:10, // Ending Row
         sort:{
            date_added: -1 //Sort by Date Added DESC
     */

    query.sort = {
        d: -1
    };

    mongoose.dataset.History.find({r: room._id}, 't d u n', query, function(err, messages){

        if(err)
            return cb(err, null);

        /*
        var output = [];
        messages.forEach(function(mess){
            output.push(_.pick(mess, ['t', 'd', 'u', 'n']));
        });
        */

        cb(null, messages);

    });

};

RoomSchema.methods.pushUser = function(user, cb){
    var room = this;

    var hasUser = false;
    room.users.forEach(function(uid){
        if(hasUser)
            return false;
        hasUser = user.equals(uid);
    });

    if(!hasUser)
        room.users.push(user);

    room.save(cb);
};

RoomSchema.methods.removeUser = function(user){
    var room = this;

    room.users = _.filter(room.users, function(uid){
        return !uid.equals(user);
    });

    room.save(cb);
};


RoomSchema.methods.pushMessage = function(text, user, cb){
    var room = this;

    var hist = new mongoose.dataset.History({
        t: text,
        d: Date.now(),
        u: user._id,
        r: room._id,
        n: user.name
    });

    room.messages_count++;
    room.save();

    hist.save(cb);

};


exports.model = RoomSchema;
