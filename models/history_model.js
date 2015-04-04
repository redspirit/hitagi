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
    n: {                // nick
        type: String
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


exports.model = HistorySchema;
