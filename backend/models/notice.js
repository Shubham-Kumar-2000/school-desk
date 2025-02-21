const mongoose = require('mongoose');
const { NOTICE_TYPES, TARGET_AUDIENCE_TYPES } = require('../config/constants');
const Schema = mongoose.Schema;

const targetSchema = new Schema({
    audienceType: {
        type: String,
        required: true,
        enum: TARGET_AUDIENCE_TYPES
    },
    student: {
        type: mongoose.Types.ObjectId,
        ref: 'Student',
        required: false
    },
    students: {
        type: [mongoose.Types.ObjectId],
        ref: 'Student',
        required: false
    },
    class: {
        type: mongoose.Types.ObjectId,
        ref: 'Class',
        required: false
    }
});

const noticeSchema = new Schema(
    {
        title: { type: String, required: true },
        description: { type: String, required: true },

        noticeType: {
            type: String,
            required: true,
            enum: NOTICE_TYPES
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

        targets: {
            type: targetSchema,
            required: true
        },

        reminders: {
            type: [Date],
            required: false,
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

const Notice = mongoose.model('Notice', noticeSchema);
module.exports = Notice;
