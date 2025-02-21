const { SUPPORTED_LANGUAGES } = require('../config/constants');
const { askAi } = require('../helpers/aiHelper');
const { CustomError } = require('../helpers/errorHelper');
const { translate } = require('../helpers/translationHelper');
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
            const notice = await Notice.findById(noticeId);
            if (!notice) {
                throw new CustomError('Invalid Notice ID');
            }
            askedTo = notice.createdBy;
        } else {
            const currentClass = await Class.findById(student.currentClass);
            askedTo = currentClass.classTeacher;
        }

        const translatedQuestion = await translate(
            question,
            guardian.preferredLanguage,
            SUPPORTED_LANGUAGES.English.key
        );

        const answer = await askAi(translatedQuestion, student, guardian);

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
        query['filters.requiredHumanIntervention'] = true;
        query['filters.humanAnswered'] = false;
    }

    if (
        Object.keys(query).includes('filters.humanAnswered') &&
        !Object.keys(query).includes('filters.requiredHumanIntervention')
    ) {
        query['filters.requiredHumanIntervention'] = true;
    }

    query['filters.askedTo'] = context.currentAdmin._id;

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

    await Question.findByIdAndUpdate(record.params._id, {
        $push: {
            answers: {
                text: text,
                answeredByAi: false,
                answeredBy: currentAdmin._id
            }
        },
        humanAnswered: true
    });
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

        const question = await Question.findOneAndUpdate(
            {
                _id: questionId,
                askedBy: req.guardian._id,
                humanAnswered: false
            },
            { $set: { requiredHumanIntervention: true } },
            { new: true }
        );

        if (!question) {
            throw new CustomError('Invalid Question ID');
        }

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
        const questions = await Question.find({
            askedByStudent: student._id
        }).sort({ updatedAt: -1 });

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
