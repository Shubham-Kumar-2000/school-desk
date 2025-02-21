const express = require('express');
const router = express.Router();
const { validate } = require('express-validation');
const noticeController = require('../controllers/notice');
const validations = require('../validations/notice');
const { validateStudent } = require('../helpers/studentHelper');

router.get(
    '/my-notifications',
    validate(validations.myNotices, {}, {}),
    validateStudent,
    noticeController.getMyNotifications
);

router.post(
    '/acknowledge/:id',
    validateStudent,
    noticeController.acknowledgeNotice
);

module.exports = router;
