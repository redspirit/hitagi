/**
 * Created by Alexey Tayanchin on 15.07.14.
 */

var _ = require('underscore');
var mongoose = require('mongoose');
var config = require('./../config.json');
var fs = require('fs');

mongoose.connect('mongodb://' + config.mongo.server + ':' + config.mongo.port + '/' + config.mongo.database + '?auto_reconnect');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
    console.log('Database is ready');
});


var modelsDir = __dirname + '/../models/';
var models = fs.readdirSync(modelsDir);

var getName = function(s) {
    s = s.replace('.js', '');
    s = s.split('_')[0];
    return s.charAt(0).toUpperCase() + s.substr(1).toLowerCase();
};

models.forEach(function (model) {
    var m = require(modelsDir + model).model;
    var name = getName(model);

    module.exports[name] = mongoose.model(name, m);
    console.info('Добавлена модель:', name);
});


exports.ObjectId = mongoose.Types.ObjectId;
