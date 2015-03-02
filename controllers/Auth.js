




exports.register = function(req, res){

    console.log(req.body);

    res.send('this is me register !!!');

};

exports.login = function(req, res){

    console.log(req.query);

    res.send('this is me login!!!');

};


exports.getToken = function(req, res){

    res.send('this is token city');

};

exports.ats = function(req, res){

    res.send('ATS is my life');

};