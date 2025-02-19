const { Joi } = require('express-validation');
exports.addressValidation = Joi.object().keys({
    _id: Joi.string(),
    address: Joi.string().min(4).required(),
    city: Joi.string().min(2),
    state: Joi.string().min(2),
    country: Joi.string().min(2),
    pincode: Joi.string().required(),
    updatedAt: Joi.date(),
    createdAt: Joi.date()
});
