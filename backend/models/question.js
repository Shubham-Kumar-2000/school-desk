const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const answerSchema = new Schema(
    {
        text: { type: String, required: true },
        answeredByAi: { type: Boolean, required: true },
        answeredBy: {
            type: mongoose.Types.ObjectId,
            ref: 'AdminTeacher',
            required: false
        }
    },
    { timestamps: false }
);

const questionSchema = new Schema(
    {
        question: { type: String, required: true },
        answers: { type: [answerSchema], required: true, default: [] },
        askedBy: {
            type: mongoose.Types.ObjectId,
            ref: 'Guardian',
            required: true
        },
        askedByStudent: {
            type: mongoose.Types.ObjectId,
            ref: 'Student',
            required: true
        },
        askedTo: {
            type: mongoose.Types.ObjectId,
            ref: 'AdminTeacher',
            required: true
        },

        requiredHumanIntervention: {
            type: Boolean,
            required: true,
            default: false
        },
        humanAnswered: { type: Boolean, required: true, default: false }
    },
    { timestamps: true }
);

const Question = mongoose.model('Question', questionSchema);
module.exports = Question;
