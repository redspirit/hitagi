/**
 * Created by Алексей on 21.03.2015.
 */

app.service('ws', function($http){

    var self = this;

    window.WebSocket = window.WebSocket || window.MozWebSocket;

    if (!window.WebSocket) {
        return alert('Вебсокеты не работают!');
    }

    console.log('connecting...');

    var connection = new WebSocket('ws://localhost:3310');

    connection.onopen = function () {

        console.info('ws open');

    };

    connection.onerror = function (error) {

        console.info('ws error');

    };


    connection.onmessage = function (message) {
        try {
            var json = JSON.parse(message.data);
        } catch (e) {
            console.log('This doesn look like a valid JSON: ', message.data);
            return;
        }

        console.log('WS receive <<', json);

        if(!json.event)
            return console.error('Во входящем сообщении нет поля event');

        self.trigger(json.event, json);
    };


    self.send = function(name, data){
        data.event = name;
        connection.send(JSON.stringify(data));
        console.log('WS send >>', data);
    };


});

var MicroEvent=function(){};
MicroEvent.prototype={on:function(a,b,c){b.ctx=c||this;this._events=this._events||{};this._events[a]=this._events[a]||[];this._events[a].push(b);return this},
    off:function(a,b){this._events=this._events||{};if(!1===a in this._events)return this;this._events[a].splice(this._events[a].indexOf(b),1);return this},
    trigger:function(a){this._events=this._events||{};if(!1===a in this._events)return this;for(var b=0;b<this._events[a].length;b++)
        this._events[a][b].apply(this._events[a][b].ctx,Array.prototype.slice.call(arguments,
            1));return this}};MicroEvent.mixin=function(a){for(var b=["on","off","trigger"],c=0;c<b.length;c++)
    "function"===typeof a?a.prototype[b[c]]=MicroEvent.prototype[b[c]]:a[b[c]]=MicroEvent.prototype[b[c]]};"undefined"!==typeof module&&"exports"in module&&(module.exports=MicroEvent);