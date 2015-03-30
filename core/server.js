/**
 * Created by Alexey Tayanchin on 25.07.14.
 */

var config = require('./../config.json');
var router = require('./router.js');
var mediators = require('./middleware.js');
var tools = require('./tools.js');
var _ = require('underscore');


var restify = require('restify');
var CookieParser = require('restify-cookies');
var WebSocketServer = require('ws').Server;
var wss = new WebSocketServer({ port: config.ws_port });

var server = restify.createServer({
    name: 'hitagi',
    version: '0.0.1'
});
var connections = {};
var connectionIDCounter = 0;
var userRooms = {};
var userSockets = {};

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
        ws.id = connectionIDCounter ++;
        connections[ws.id] = ws;

        console.log('connect ID', ws.id);

        // добавить юзера в комнату
        ws.join = function(roomName){

            if(!ws.user)
                return false;

            var userId = ws.user._id.toString();
            var arr = userRooms[roomName];

            if(arr) {

                if(arr.indexOf(userId) === -1) {
                    userRooms[roomName].push(userId);
                }

            } else {
                userRooms[roomName] = [userId];
            }

            console.log('room join', userRooms);

        };

        // удлить юзера из комнаты
        ws.leave = function(roomName){

            if(!ws.user)
                return false;

            var userId = ws.user._id.toString();
            var arr = userRooms[roomName];
            var idx;

            if(arr) {

                idx = arr.indexOf(userId);

                if(idx > -1)
                    userRooms[roomName].splice(idx, 1);

            }

            console.log('room leave', userRooms);

        };

        // todo удлить юзера из всех комнат
        ws.leaveAll = function(roomName){

            if(!ws.user)
                return false;

            var userId = ws.user._id.toString();
            var arr = userRooms[roomName];


            console.log('room leave all', userRooms);

        };

        // todo удлить сокет из всех комнат
        ws.leaveAllSock = function(roomName){

            var arr = userRooms[roomName];

            if(!arr)
                return false;

            arr.forEach(function(sock){

            });

            console.log('room leave all socket', userRooms);

        };

        // todo отправить сообщение во все комнаты в которых состоит юзер
        ws.toAllRooms = function(name, data){

            if(!ws.user)
                return false;

            var userId = ws.user._id.toString();

            _.each(userRooms, function(users, key){

                if(users.indexOf(userId) > -1)
                    ws.toRoom(key, name, data);

            });


        };

        // отправить сообщение в комнату исключая того, кто вызвал функцию
        ws.toRoom = function(room, name, data, exclusion){

            //var userId = ws.user ? ws.user._id.toString() : null;
            var userId = exclusion ? exclusion.toString() : null;
            var arr = userRooms[room];

            if(!arr)
                return false;

            arr.forEach(function(user){

                if(user != userId)
                    ws.toUser(user, name, data);

            });

        };
        
        ws.roomUsers = function(room){
            return userRooms[room];
        };

        // зарегистрировать сокет указанного юзера
        ws.setUser = function(userId){

            var uid = userId.toString();
            var arr = userSockets[uid];

            if(arr) {

               if(arr.indexOf(ws.id) === -1)
                   userSockets[uid].push(ws.id);

            } else {
                userSockets[uid] = [ws.id];
            }

            return true;
        };

        // удалить все сокеты указанного юзера
        ws.delUser = function(userId){
            var uid = userId.toString();
            delete userSockets[uid];
        };

        // получить по _id юзера все его сокеты
        ws.getUserSockets = function(userId){
            var uid = userId.toString();
            var arr = userSockets[uid];

            if(!arr)
                return false;

            var result = [];
            arr.forEach(function(sid){
                result.push(connections[sid]);
            });

            return result;
        };

        // отправить сообщение в указанный сокет
        ws.sendJson = function(name, data, cbName){
            ws.send(JSON.stringify({
                e: name,
                d: data,
                c: cbName
            }));
        };

        // отправить сообщение во все мои сокеты
        ws.toMe = function(name, data){

            if(!ws.user)
                return false;

            ws.toUser(ws.user._id, name, data);

        };

        // отправить сообщение конкретному юзеру (во все его сокеты)
        ws.toUser = function(userId, name, data){
            var uid = userId.toString();
            var arr = userSockets[uid];

            if(_.isArray(arr)) {

                arr.forEach(function(sockId){

                    if(!connections[sockId])
                        return false;

                    connections[sockId].send(JSON.stringify({
                        e: name,
                        d: data
                    }));

                });

            }

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

            delete connections[ws.id];

            ws.connections = connections;

            router.wsRouting(routes, {e: 'disconnect'}, ws);


            _.each(userSockets, function(arr, key){

                var idx = arr.indexOf(ws.id);

                if(idx > -1)
                    userSockets[key].splice(idx, 1);

                if(userSockets[key].length == 0)
                    delete userSockets[key];

            });

        });

        router.wsRouting(routes, {e: 'connect'}, ws);

    });

}
