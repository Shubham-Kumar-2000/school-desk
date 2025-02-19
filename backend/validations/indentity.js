const { Joi } = require('express-validation');
const { IDENTITY_TYPES } = require('../config/constants');

exports.indentityValidation = Joi.object(
    Object.keys(IDENTITY_TYPES).reduce((acc, key) => {
        acc[key] = Joi.string().regex(IDENTITY_TYPES[key].regex);
        return acc;
    }, {})
);
