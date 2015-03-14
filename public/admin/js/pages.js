/**
 * Created by Алексей on 13.03.2015.
 */

function validateEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

$('.form-group input').click(function(){
    $('.form-group').removeClass('has-error');
    $('#error-text').text('');
});

function ajax_register() {
    var msg = $("#form").serialize();
    var array = $("#form").serializeArray();
    var obj = {};
    var errorText = $('#error-text');
    var successText = $('#success-text');

    array.forEach(function(elem){
        obj[elem.name] = elem.value;
    });


    if(obj.name < 4) {
        $('#form-name').addClass('has-error');
        return errorText.text('Ошибка: Логин должен быть не мнее 4 символов');
    }

    if(!validateEmail(obj.email)) {
        $('#form-email').addClass('has-error');
        return errorText.text('Ошибка: неверный емейл');
    }

    if(obj.password.length < 6) {
        $('#pass_1').addClass('has-error');
        return errorText.text('Ошибка: Пароль должен быть не мнее 6 символов');
    }

    if(obj.password != obj.password_2) {
        $('#pass_1').addClass('has-error');
        $('#pass_2').addClass('has-error');
        return errorText.text('Ошибка: Пароли не одинаковы');
    }


    $.ajax({
        type: "POST",
        url: "/auth/register",
        data: msg,
        success: function(data) {

            if(!data.error) {
                $('#register-btn').attr('disabled', 'disabled');
                errorText.text('');
                return successText.html('Регистрация завершена успешно! На ваш email <b>' + obj.email + '</b> выслано письмо с подтверждением регистрации');
            }

            if(data.code == 4) {

                $('#form-email').addClass('has-error');
                return errorText.text('Ошибка: указанный email уже занят');

            }

            alert('Ошибка регистрации ' + data.error);

        },
        error:  function(xhr, str){
            alert("Возникла ошибка!");
        }
    });
};

function ajax_login() {
    var msg = $("#form").serialize();
    var array = $("#form").serializeArray();
    var obj = {};
    var errorText = $('#error-text');

    array.forEach(function(elem){
        obj[elem.name] = elem.value;
    });


    if(!validateEmail(obj.email)) {
        $('#form-email').addClass('has-error');
        return errorText.text('Ошибка: неверный емейл');
    }

    if(obj.password.length < 6) {
        $('#form-password').addClass('has-error');
        return errorText.text('Ошибка: Пароль должен быть не мнее 6 символов');
    }

    obj.cookie = true;


    $.ajax({
        type: "POST",
        url: "/auth/token",
        data: msg,
        success: function(data) {

            console.log(data);

            if(!data.error) {
                document.location.href = '/admin/index.html';
                return false;
            }

            if(data.code == 5) {
                return errorText.text('Ошибка: неверный логин или пароль');
            }

            alert(data.error);

        },
        error:  function(xhr, str){
            alert("Возникла ошибка!");
        }
    });

}