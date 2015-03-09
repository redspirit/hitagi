/**
 * Created by Alexey Tayanchin on 25.07.14.
 */


exports.test = function(req, res){

    //console.log();

    res.send({user: req.user});

};
