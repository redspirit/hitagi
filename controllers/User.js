/**
 * Created by Alexey Tayanchin on 25.07.14.
 */

var data = require('./../core/dataset.js');
var errors = require('../core/errors.js');

exports.info = function(req, res){

    if(!req.user)
        return res.send(errors.authRequire);


    res.send(req.user);

};
