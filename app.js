/**
 * Created by Alexey Tayanchin on 15.07.14.
 */

var server = require('./core/server.js');

var routes = {
    'post /auth/register':              'auth.register',        // зарегистрирвать пользователя и выслать ему пароль
    'get /auth/confirm':                'auth.confirm',         // подтвердить емейл пользователя
    'post /auth/forgot':                'auth.forgot_password', // восстановить пароль через емейл
    'get /forgot_request':              'auth.forgot_request',  // ссылка из письма
    'post /auth/forgot_set':            'auth.forgot_set',      // сохранение нового пароля

    'post /auth/token':                 'auth.get_token',       // получить токен доступа по паролю
    'post /auth/refresh':               'auth.refresh_token',   // обновить токен
    'post /auth/out':                   'auth.remove_token',    // сделать токен недействительным
    'get /sign-out':                    'auth.sing_out',        // разлогинится, аналогично remove_token


    /* USERS */

    'get /api/user':                    'user.info',
    'put /api/user/update':             'user.update',


    /* ROOMS */

    'post /api/room':                   'room.make',
    'get /api/rooms':                   'room.list',




    'all /api/:controller/:action':     ':controller.:action'
};

var ws_routes = {
    'connect':                          'auth.socket_connect',         // подключение к сокету
    'disconnect':                       'auth.socket_disconnect',      // отключение от сокета

    'widget_init':                      'room.widget_init',
    'sing_in_guest':                    'auth.sing_in_guest',
    'sing_in':                          'auth.sing_in',
    'register_member':                  'auth.register_member',

    'chat':                             'room.chat_message'
};

server.Start(routes, ws_routes);
