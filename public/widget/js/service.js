/**
 * Created by Алексей on 21.03.2015.
 */

app.service('ws', function($http, tools){

    var self = this;
    var callbackFunctions = {};

    var wsServer = location.hostname;

    window.WebSocket = window.WebSocket || window.MozWebSocket;
    if (!window.WebSocket) {
        return alert('Вебсокеты не работают!');
    }

    var connection = new ReconnectingWebSocket('ws://' + wsServer + ':3310');

    connection.onopen = function () {
        self.trigger('connect');
    };

    connection.onclose = function() {
        self.trigger('disconnect');
    };

    connection.onerror = function (error) {
        self.trigger('error');
    };


    connection.onmessage = function (message) {
        try {
            var json = JSON.parse(message.data);
        } catch (e) {
            console.log('This doesn look like a valid JSON: ', message.data);
            return;
        }

        console.log('WS receive <<', json.e, json.d);

        if(!json.e)
            return console.error('Во входящем сообщении нет поля "e"');

        if(json.c) {
            callbackFunctions[json.c](json.d);
            delete callbackFunctions[json.c];
        } else {
            self.trigger(json.e, json.d);
        }
    };


    self.send = function(name, data, callback){

        var message = {};

        if(typeof callback == 'function') {
            var cbCode = tools.ramdomString(4);
            message.c = cbCode;
            callbackFunctions[cbCode] = callback;
        }

        message.e = name;
        message.d = data;

        connection.send(JSON.stringify(message));
        console.log('WS send >>', name, data);
    };

    MicroEvent.mixin(self);

});

app.service('tools', function($http){
    var self = this;

    self.ramdomString = function(c){
        for (var a = "", b = 0; b < c; b++)
            a += "AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz1234567890_"[Math.floor(63 * Math.random())];
        return a
    };

    self.isFramed = function(){
        try {
            return window != window.top || document != top.document || self.location != top.location;
        } catch (e) {
            return true;
        }
    };

    self.validateEmail = function(email){
        var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    };

    self.parseGetParams = function() {
        var $_GET = {};
        var __GET = window.location.search.substring(1).split("&");
        for(var i=0; i<__GET.length; i++) {
            var getVar = __GET[i].split("=");
            $_GET[getVar[0]] = typeof(getVar[1])=="undefined" ? "" : getVar[1];
        }
        return $_GET;
    };

    self.deleteFromUsers = function(arr, id) {

        return _.filter(arr, function(item){
            return item._id != id;
        });

    };

    self.getFromUsers = function(arr, id) {

        return _.find(arr, function(item){
            return item._id == id;
        });

    };

    var passPhrase = 'dsiy33473d';

    self.stringEncode = function(str) {
        var code = CryptoJS.AES.encrypt(str, passPhrase);
        return code.toString();
    };
    self.stringDecode = function(str) {
        var code = CryptoJS.AES.decrypt(str, passPhrase);
        return code.toString(CryptoJS.enc.Utf8);
    };

    self.saveUserData = function(data) {
        localStorage['userData'] = self.stringEncode(JSON.stringify(data));
    };

    self.getUserData = function() {

        var ret = {};

        try {

            ret = JSON.parse(self.stringDecode(localStorage['userData']));

        } catch (e){

        }

        return ret;

    };

});


var MicroEvent=function(){};
MicroEvent.prototype={on:function(a,b,c){b.ctx=c||this;this._events=this._events||{};this._events[a]=this._events[a]||[];this._events[a].push(b);return this},
    off:function(a,b){this._events=this._events||{};if(!1===a in this._events)return this;this._events[a].splice(this._events[a].indexOf(b),1);return this},
    trigger:function(a){this._events=this._events||{};if(!1===a in this._events)return this;for(var b=0;b<this._events[a].length;b++)
        this._events[a][b].apply(this._events[a][b].ctx,Array.prototype.slice.call(arguments,
            1));return this}};MicroEvent.mixin=function(a){for(var b=["on","off","trigger"],c=0;c<b.length;c++)
    "function"===typeof a?a.prototype[b[c]]=MicroEvent.prototype[b[c]]:a[b[c]]=MicroEvent.prototype[b[c]]};"undefined"!==typeof module&&"exports"in module&&(module.exports=MicroEvent);