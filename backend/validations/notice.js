const { Joi } = require('express-validation');
const { NOTICE_TYPES } = require('../config/constants');

exports.myNotices = {
    query: Joi.object({
        page: Joi.number().integer().min(1).required(),
        noticeType: Joi.string().valid(...Object.keys(NOTICE_TYPES))
    })
};
