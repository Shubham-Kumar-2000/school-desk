const express = require('express');
const router = express.Router();
const { validate } = require('express-validation');
const questionController = require('../controllers/question');
const validations = require('../validations/question');
const { validateStudent } = require('../helpers/studentHelper');

router.post(
    '/create',
    validate(validations.createQuestion, {}, {}),
    validateStudent,
    questionController.askQuestion
);

router.post(
    '/human-intervention/:id',
    validateStudent,
    questionController.requiredHumanIntervention
);

router.get('/my', validateStudent, questionController.myQuestions);

module.exports = router;
