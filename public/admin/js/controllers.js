
app.controller('MainCtrl', function($scope, $http) {

    $scope.user = {};
    $scope.form = {};
    $scope.myRooms = [];


    function initLoad(){

        $http.get('/api/user').success(function(user){
            $scope.user = user;
        });

        $http.get('/api/rooms').success(function(rooms){
            $scope.myRooms = rooms;
        });

    }


    initLoad();


    $scope.roomCreate = function(form){

        $http.post('/api/room', form).success(function(room){

            form = {};
            console.log(room);

        });

    }

    $scope.showRoomInfo = function(room){

        $scope.roomDetail = room;

    }

});
