/**
 * Created by Алексей on 07.03.2015.
 * Отправка емейлов
 */

var config = require('./../config.json');
var nodemailer = require('nodemailer');
var tools = require('../core/tools.js');


var transporter = nodemailer.createTransport({
    service: config.mail.service,
    auth: {
        user: config.mail.user,
        pass: config.mail.pass
    }
});

exports.send = function(to, data, template){

    tools.template(template, data, function(text){

        var mailOptions = {
            from: config.mail.from,
            to: to,
            subject: data.subject,
            html: text
        };

        transporter.sendMail(mailOptions, function(error, info){
            if(error)
                console.error('Ошибка отправки емейла', error);

        });

    });

};
