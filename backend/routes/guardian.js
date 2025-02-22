const express = require('express');
const router = express.Router();
const { validate } = require('express-validation');
const userController = require('../controllers/guardian');
const tokenHelper = require('../helpers/tokenHelper');
const validations = require('../validations/guardian');

router.post(
    '/sendOtp',
    validate(validations.generateOtp, {}, {}),
    userController.generateOtp
);

router.post(
    '/login',
    validate(validations.login, {}, {}),
    userController.logInByPhone
);

router.get('/me', tokenHelper.validate, userController.profile);
router.post('/settings', tokenHelper.validate, userController.updateMe);

module.exports = router;
