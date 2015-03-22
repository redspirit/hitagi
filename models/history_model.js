/**
 * Created by Алексей on 22.03.2015.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var moment = require('moment');
var errors = require('../core/errors.js');

var HistorySchema = new Schema({
    t: {                // text
        type: String,
        default: ''
    },
    d: {                // date
        type: Number
    },
    u: {                // user
        type: Schema.Types.ObjectId
    },
    r: {                // room
        type: Schema.Types.ObjectId
    }
});


HistorySchema.statics.add = function(d, cb){
    var History = this;
    var hist = new History({
        t: d.text,
        d: d.date,
        u: d.user,
        r: d.room
    });
    hist.save(cb);
};


exports.model = HistorySchema;
