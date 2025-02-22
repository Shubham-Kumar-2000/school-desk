const { Joi } = require('express-validation');

exports.createQuestion = {
    body: Joi.object({
        question: Joi.string().max(250).min(20).required(),
        noticeId: Joi.string().length(36)
    })
};
