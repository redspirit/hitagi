
app.controller('MainCtrl', function($scope, $http) {

    $scope.user = {};

    $http.get('/api/user').success(function(user){

        $scope.user = user;

    });

});
