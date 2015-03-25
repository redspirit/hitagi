/**
 * Created by Алексей on 14.03.2015.
 * Коды ошибок
 */

module.exports = {
    noUsername: {error: 'Не указано имя пользователя', code: 1},
    noPassword: {error: 'Не указан пароль пользователя', code: 2},
    invalidEmail: {error: 'Неверно указан емейл пользователя', code: 3},
    busyEmail: {error: 'Емейл уже занят', code: 4},
    userNotFound: {error: 'Пользователь с такими данными не найден', code: 5},
    authRequire: {error: 'Требуется авторизация пользователя', code: 6},
    savingError: {error: 'Ошибка сохранения данных', code: 7},
    wrongVerificationCode: {error: 'Неверный код безопсности', code: 8},
    busyRoomAlias: {error: 'Такой алис уже занят', code: 9},
    createRoomError: {error: 'Ошибка создания новой комнаты', code: 10},
    roomIdNotSet: {error: 'Не указана ID комнаты', code: 11},
    roomNotFound: {error: 'Указанная комната не найдена', code: 12},
    noGuestCode: {error: 'Нет кода для регистрации гостя', code: 13},
    noChatUser: {error: 'Пользователь чата не определен', code: 14},
    emptyMessage: {error: 'Пустое сообщение в комнату', code: 15}



};