var app = angular.module('widget', []);

app.controller('MainCtrl', function($scope, $http, $location, tools, ws){

    var urlParams = tools.parseGetParams();
    $scope.isAuth = false;
    $scope.me = {};
    $scope.users = {};
    $scope.splashScreen = true;
    $scope.registerScreen = false;
    $scope.form = {};

    if(!tools.isFramed()) {
        alert('Запущено не во фрейме!');
    }

    if(!urlParams.id) {
        alert('Не указан ID комнаты');
    }


    $scope.roomId = urlParams.id;


    $scope.singIn = function(nick) {

        if(!nick)
            return alert('Укажите свой ник!');

        var code = localStorage['guestCode'];
        if(!code) code = tools.ramdomString(30);

        ws.send('sing_in_guest', {
            code: code,
            nick: nick,
            room: $scope.roomId
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

        if(!text)
            return false;

        ws.send('chat', {t: text, r: $scope.room._id});

        $scope.form.message = '';

    };

    $scope.showRegisterScreen = function(state){
        $scope.registerScreen = state;
    };

    $scope.submitRegister = function(form){

        if(!form.email)
            return alert('Нужно указать Email');

        if(!form.nick)
            return alert('Нужно указать ник');

        if(!form.password || form.password.length < 6)
            return alert('Нужно указать пароль не менее 6 символов');

        if(form.password != form.password2)
            return alert('Пароли должны совпадать');


        ws.send('register_member', {
            email: form.email,
            name: form.nick,
            password: form.password
        }, function(newUser){

            if(newUser.error)
                return alert(newUser.error);


            tools.saveUserData({
                email: newUser.email,
                password: form.password
            });


            ws.send('sing_in', {
                email: newUser.email,
                password: form.password
            }, function(user){

                if(user.error)
                    return alert(user.error);

                $scope.isAuth = true;
                $scope.me = user;

                $scope.showRegisterScreen(false);

                // todo джойнимся к комнате

                $scope.$apply();

            });

        });

    };

    /******** EVENTS  *********/

    ws.on('connect', function(){

        if(!urlParams.id)
            return false;

        ws.send('widget_init', {roomId: urlParams.id}, function(room){

            if(room.error)
                return alert(room.error);

            $scope.room = room;


            var code = localStorage['guestCode'];
            var userData = tools.getUserData();

            if(userData.email){

                // auth user

                ws.send('sing_in', {
                    email: userData.email,
                    password: userData.password
                }, function(user){

                    if(user.error)
                        return alert(user.error);

                    $scope.isAuth = true;
                    $scope.me = user;

                    $scope.splashScreen = false;

                    // todo джойнимся к комнате

                    $scope.$apply();

                });

            } else if(code) {

                // auth guest

                ws.send('sing_in_guest', {
                    code: code,
                    room: $scope.roomId
                }, function(userInfo){

                    if(userInfo.error) {
                        $scope.isAuth = false;
                        console.error(userInfo.error);
                    } else {
                        $scope.isAuth = true;
                        $scope.me = userInfo;
                    }

                    $scope.splashScreen = false;
                    $scope.$apply();
                });


            } else {

                // no auth

                $scope.splashScreen = false;
                $scope.isAuth = false;
                $scope.$apply();

            }

        });

    });

    ws.on('joined', function(user){

        var hasUser = tools.getFromUsers($scope.room.users, user._id);

        if(hasUser)
            return false;

        $scope.room.users.push(user);


        if(user._id == $scope.me._id)
            return $scope.$apply();

        $scope.room.messages.push({
            type: 'log',
            class: {'log-user-join': true},
            n: user.name,
            d: Date.now(),
            t: 'зашел в чат'
        });

        $scope.$apply();

    });

    ws.on('leaved', function(user){

        if(!user._id)
            return false;

        $scope.room.users = tools.deleteFromUsers($scope.room.users, user._id);

        $scope.room.messages.push({
            type: 'log',
            class: {'log-user-leave': true},
            n: user.name,
            d: moment().format(),
            t: 'вышел из чата'
        });

        $scope.$apply();

    });


    ws.on('chat', function(message){

        $scope.room.messages.push(message);
        $scope.$apply();

    });



});
