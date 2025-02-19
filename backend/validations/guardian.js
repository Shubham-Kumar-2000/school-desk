const { Joi } = require('express-validation');

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
