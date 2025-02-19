const express = require('express');
const router = express.Router();
const testimonialController = require('../controllers/testimonial');

router.get('/', testimonialController.list);

module.exports = router;
