var app = angular.module('widget', []);

app.controller('MainCtrl', function($scope, $http){

    var urlParams = parseGetParams();


    if(!isFramed()) {
        alert('Запущено не во фрейме!');
    }

    if(!urlParams.id) {
        alert('Не указан ID комнаты');
    }


    $scope.roomId = urlParams.id;


    $scope.message = function(text) {


        console.log(text);

        text = '';

    }



});