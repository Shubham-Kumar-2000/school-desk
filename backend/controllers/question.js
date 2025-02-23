/* eslint-disable no-unused-vars */
const { SUPPORTED_LANGUAGES } = require('../config/constants');
const { askAi } = require('../helpers/aiHelper');
const { CustomError } = require('../helpers/errorHelper');
const { processQueryResponse } = require('../helpers/kafkaHelper');
const { translate } = require('../helpers/translationHelper');
const AdminTeacher = require('../models/adminTeachers');
const Class = require('../models/class');
const Notice = require('../models/notice');
const Question = require('../models/question');

const translateQuestions = async (questions, language) => {
    return Promise.all(
        questions.map(async (question) => {
            question.question = await translate(
                question.question,
                SUPPORTED_LANGUAGES.English.key,
                language
            );
            question.answers = await Promise.all(
                question.answers.map(async (answer) => {
                    answer.text = await translate(
                        answer.text,
                        SUPPORTED_LANGUAGES.English.key,
                        language
                    );
                    return answer;
                })
            );
            return question;
        })
    );
};

exports.askQuestion = async (req, res, next) => {
    try {
        const guardian = req.guardian;
        const student = req.student;
        const { question, noticeId } = req.body;

        let askedTo = null;

        if (noticeId) {
            const notice = await Notice.findByPk(noticeId);
            if (!notice) {
                throw new CustomError('Invalid Notice ID');
            }
            askedTo = notice.createdBy;
        } else {
            const currentClass = await Class.findByPk(student.currentClass);
            askedTo = currentClass.classTeacherId;
        }

        const translatedQuestion = await translate(
            question,
            guardian.preferredLanguage,
            SUPPORTED_LANGUAGES.English.key
        );

        const answer = await askAi(
            translatedQuestion,
            student,
            guardian,
            noticeId
        );

        const newQuestion = await Question.create({
            question: translatedQuestion,
            answers: [{ text: answer, answeredByAi: true }],
            askedByStudent: student._id,
            askedBy: guardian._id,
            askedTo,
            requiredHumanIntervention: false,
            humanAnswered: false
        });

        res.status(200).json({
            err: false,
            question: (
                await translateQuestions(
                    [newQuestion],
                    guardian.preferredLanguage
                )
            )[0]
        });
    } catch (e) {
        console.log(e);
        next(e);
    }
};

exports.getQuestionForTeacher = async (request, context) => {
    const { query = {} } = request;
    if (Object.keys(query).length === 0) {
        query['filters.requiredHumanIntervention'] = 'true';
        query['filters.humanAnswered'] = 'false';
    }

    if (
        Object.keys(query).includes('filters.humanAnswered') &&
        !Object.keys(query).includes('filters.requiredHumanIntervention')
    ) {
        query['filters.requiredHumanIntervention'] = 'true';
    }

    // query['filters.askedTo'] = context.currentAdmin._id;

    const newQuery = {
        ...query
    };

    request.query = newQuery;

    return request;
};

exports.answerQuestionForTeacher = async (request, response, context) => {
    if (request.method === 'get') {
        return {};
    }
    const { record, currentAdmin } = context;
    const { text } = request.payload;

    if (!record) {
        throw new CustomError('Invalid Question ID');
    }

    if (String(record.params.askedTo) !== String(currentAdmin._id)) {
        throw new CustomError('Unauthorized', 401);
    }

    if (record.params.humanAnswered) {
        throw new CustomError('Question already answered');
    }

    const question = await Question.findByPk(record.params._id);

    if (!question) {
        throw new CustomError('Question not found');
    }

    question.humanAnswered = true;

    if (Array.isArray(question.answers)) {
        question.answers.push({
            text: text,
            answeredByAi: false,
            answeredBy: currentAdmin._id
        });
        question.answers = [...question.answers];
    } else {
        const currentAnswers = JSON.parse(question.answers || '[]');
        currentAnswers.push({
            text,
            answeredByAi: false,
            answeredBy: currentAdmin._id
        });
        question.answers = currentAnswers;
    }

    await Question.update(
        {
            humanAnswered: true,
            answers: question.answers
        },
        {
            where: {
                _id: record.params._id
            }
        }
    );
    processQueryResponse(
        [question.askedByStudent],
        'Query Answered : ',
        text
    ).catch(console.error);
    return {
        notice: {
            message: 'Successfully answered question.',
            type: 'success'
        }
    };
};

exports.requiredHumanIntervention = async (req, res, next) => {
    try {
        const questionId = req.params.id;

        const question = await Question.findOne({
            where: {
                _id: questionId,
                askedBy: req.guardian._id,
                humanAnswered: false
            },
            include: [
                {
                    model: AdminTeacher,
                    as: 'askedToData'
                }
            ]
        });

        if (!question) {
            throw new CustomError('Invalid Question ID');
        }

        question.requiredHumanIntervention = true;
        await question.save();

        res.status(200).json({ err: false, question });
    } catch (e) {
        console.log(e);
        next(e);
    }
};

exports.myQuestions = async (req, res, next) => {
    try {
        const student = req.student;
        const guardian = req.guardian;
        const questions = await Question.findAll({
            where: {
                askedByStudent: student._id
            },
            order: [['updatedAt', 'DESC']],
            include: [{ model: AdminTeacher, as: 'askedToData' }]
        });

        res.status(200).json({
            err: false,
            questions: await translateQuestions(
                questions,
                guardian.preferredLanguage
            )
        });
    } catch (e) {
        console.log(e);
        next(e);
    }
};
