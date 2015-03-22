var app = angular.module('widget', []);

app.controller('MainCtrl', function($scope, $http, tools, ws){

    var urlParams = tools.parseGetParams();
    $scope.isAuth = false;

    if(!tools.isFramed()) {
        alert('Запущено не во фрейме!');
    }

    if(!urlParams.id) {
        alert('Не указан ID комнаты');
    }


    $scope.roomId = urlParams.id;


    $scope.singIn = function(nick) {


        $scope.isAuth = true;



    };

    $scope.message = function(text) {

        ws.send('chat', {text: text}, function(status){

            console.log('cb', status);

        });

    };


    /******** EVENTS  *********/

    ws.on('connect', function(){

        if(!urlParams.id)
            return false;

        ws.send('widget_init', {roomId: urlParams.id}, function(response){





        });

    });

    ws.on('echo', function(message){

        console.log('echo ', message);

    });


});
