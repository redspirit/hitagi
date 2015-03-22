/**
 * Created by Alexey Tayanchin on 25.07.14.
 */

var config = require('./../config.json');
var router = require('./router.js');
var mediators = require('./middleware.js');
var tools = require('./tools.js');


var restify = require('restify');
var CookieParser = require('restify-cookies');
var WebSocketServer = require('ws').Server;
var wss = new WebSocketServer({ port: config.ws_port });

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
server.use(CookieParser.parse);
server.use(mediators.prepareBody);
server.use(mediators.checkToken);
server.use(mediators.checkPages);

server.on('uncaughtException', function (req, res, route, error) {

    console.error('Ошибка на адресе:', route.spec.path, error.stack);
    tools.template('internal_error', {}, res);

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

        ws.ip = ws._socket.remoteAddress;

        router.wsRouting(routes, {e: 'connect'}, ws);

        ws.sendEvent = function(name, data, cbName){
            ws.send(JSON.stringify({
                e: name,
                d: data,
                c: cbName
            }));
        };

        ws.on('message', function(message) {

            try {
                var json = JSON.parse(message);
            } catch (e) {
                return;
            }

            if(!json.e)
                return false;

            router.wsRouting(routes, json, ws);

        });

        ws.on('close', function() {
            router.wsRouting(routes, {e: 'disconnect'}, ws);
        });

    });

}
