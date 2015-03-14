/**
 * Created by Алексей on 14.03.2015.
 * Коды ошибок
 */

module.exports = {
    noUsername: {error: 'Не указано имя пользователя', code: 1},
    noPassword: {error: 'Не указан пароль пользователя', code: 2},
    invalidEmail: {error: 'Неверно указан емейл пользователя', code: 3},
    busyEmail: {error: 'Емейл уже занят', code: 4},
    userNotFound: {error: 'Пользователь с такими данными не найден', code: 5}


};