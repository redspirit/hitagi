/**
 * Created by Alexey Tayanchin on 25.07.14.
 */

var config = require('./../config.json');
var router = require('./router.js');
var tools = require('./tools.js');


var restify = require('restify');
var WebSocketServer = require('ws').Server;
var wss = new WebSocketServer({ port: config.ws_port });
var queryString = require('querystring');

var server = restify.createServer({
    name: 'hitagi',
    version: '0.0.1'
});
var sockUsers = {};
var sockRooms = {};


server.pre(restify.pre.sanitizePath());
//server.use(restify.CORS());
//server.use(restify.acceptParser(server.acceptable));
//server.use(restify.fullResponse());
server.use(restify.queryParser());
server.use(restify.bodyParser());
server.use(function(req, res, next){

    if(req.method == 'GET')
        return next();

    if(typeof req.body == 'string')
        req.body = queryString.parse(req.body);

    next();

});

server.on('uncaughtException', function (req, res, route, error) {

    console.log('Ошибка на адресе:', route.spec.path);
    console.log('uncaughtException', error.stack);

    tools.template('internal_error', {}, function(text){
        res.send(500, text);
    });

});

exports.Start = function(httpRoutes, wsRoutes){

    router.httpRouting(server, httpRoutes, restify.serveStatic({
        directory: __dirname + '/..' + config.public_path,
        default: 'index.html',
        maxAge: config.file_cache
    }));


    ws_paths(wsRoutes);


    // запуск серера
    server.listen(config.http_port, function() {
        console.log('%s listening at %s', server.name, server.url);
    });

};



function ws_paths(routes){

    wss.on('connection', function(ws) {



    });

}
