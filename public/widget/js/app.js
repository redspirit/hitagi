var app = angular.module('widget', []);

app.controller('MainCtrl', function($scope, $http){


    $scope.text = 'is work';

    console.log(parseGetParams(), isFramed());


});