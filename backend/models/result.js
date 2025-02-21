const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const resultRowSchema = new Schema(
    {
        subject: { type: String, required: true },
        marks: { type: Number, required: true },
        totalMarks: { type: Number, required: true, default: 100 }
    },
    { timestamps: false }
);

const resultSchema = new Schema(
    {
        examName: {
            type: String,
            required: true
        },
        student: {
            type: mongoose.Types.ObjectId,
            ref: 'Student',
            required: true
        },
        currentClass: {
            type: mongoose.Types.ObjectId,
            ref: 'Class',
            required: true
        },
        rank: {
            type: Number,
            required: false
        },
        published: {
            type: Boolean,
            required: true,
            default: false
        },
        publishOn: {
            type: Date,
            required: true
        },
        entries: {
            type: [resultRowSchema],
            required: true,
            default: []
        },
        createdBy: {
            type: mongoose.Types.ObjectId,
            ref: 'AdminTeacher',
            required: true
        }
    },
    { timestamps: true }
);

const Result = mongoose.model('Result', resultSchema);
module.exports = Result;
