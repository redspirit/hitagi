var app = angular.module('widget', []);

app.controller('MainCtrl', function($scope, $http, ws){

    MicroEvent.mixin(ws);
    var urlParams = parseGetParams();
    $scope.isAuth = false;

    if(!isFramed()) {
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

        console.log(text);

        ws.send('mess', {text: text});

    };


    ws.on('echo', function(message){


        console.log('echo ', message);

    });


});
