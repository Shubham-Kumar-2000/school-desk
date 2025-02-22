const { Joi } = require('express-validation');
const { SUPPORTED_LANGUAGES } = require('../config/constants');

exports.login = {
    body: Joi.object({
        phone: Joi.string()
            .regex(new RegExp('^[+]91[9876][0-9]{9}$'))
            .length(13)
            .required(),
        otp: Joi.string().regex(new RegExp('[0-9]+')).length(6).required()
    })
};

exports.generateOtp = {
    body: Joi.object({
        phone: Joi.string()
            .regex(new RegExp('^[+]91[9876][0-9]{9}$'))
            .length(13)
            .required(),
        resend: Joi.boolean()
    })
};

exports.idQuery = {
    query: Joi.object({
        id: Joi.string().min(5).required()
    })
};

exports.updateGuardian = Joi.object({
    body: Joi.object({
        notificationSettings: Joi.object({
            sms: Joi.boolean().required(),
            pushToken: Joi.string()
        }).required(),
        preferredLanguage: Joi.string()
            .valid(...Object.keys(SUPPORTED_LANGUAGES))
            .required()
    })
});
