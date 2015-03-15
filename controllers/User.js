/**
 * Created by Alexey Tayanchin on 25.07.14.
 */

var data = require('./../core/dataset.js');
var errors = require('../core/errors.js');
var _ = require('underscore');

exports.info = function(req, res){

    if(!req.user)
        return res.send(errors.authRequire);

    res.send(req.user.clear());

};

exports.update = function(req, res){

    if(!req.user)
        return res.send(errors.authRequire);

    var form = req.body;
    var user = req.user;

    if(!_.isUndefined(form.name)) user.name = form.name;
    if(!_.isUndefined(form.avatar)) user.avatar = form.avatar;
    if(!_.isUndefined(form.alias)) user.alias = form.alias;


    user.save(function(err, doc){

        if(err) {
            console.log('Ошибка сохранение профиля юзера', err);
            return res.send(errors.savingError);
        }

        res.send(doc.clear());

    });


};
