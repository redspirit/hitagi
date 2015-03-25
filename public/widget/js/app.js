var app = angular.module('widget', []);

app.controller('MainCtrl', function($scope, $http, tools, ws){

    var urlParams = tools.parseGetParams();
    $scope.isAuth = false;
    $scope.me = {};

    if(!tools.isFramed()) {
        alert('Запущено не во фрейме!');
    }

    if(!urlParams.id) {
        alert('Не указан ID комнаты');
    }


    $scope.roomId = urlParams.id;


    $scope.singIn = function(nick) {

        var code = localStorage['guestCode'];
        if(!code) code = tools.ramdomString(30);


        ws.send('sing_in_guest', {
            code: code,
            nick: nick
        }, function(userInfo){

            if(userInfo.error)
                return alert(userInfo.error);

            $scope.isAuth = true;

            localStorage['guestCode'] = userInfo.guest_code;

            $scope.me = userInfo;

            $scope.$apply();
        });


    };

    $scope.message = function(text) {

        ws.send('chat', {t: text, r: $scope.room._id}, function(result){



        });

    };


    /******** EVENTS  *********/

    ws.on('connect', function(){

        if(!urlParams.id)
            return false;

        ws.send('widget_init', {roomId: urlParams.id}, function(room){

            $scope.room = room;

            var code = localStorage['guestCode'];
            if(!code)
                return false;

            ws.send('sing_in_guest', {code: code}, function(userInfo){
                if(userInfo.error)
                    return alert(userInfo.error);

                $scope.isAuth = true;
                $scope.me = userInfo;
                $scope.$apply();
            });

        });

    });

    ws.on('echo', function(message){

        console.log('echo ', message);

    });


});
