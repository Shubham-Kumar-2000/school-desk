const mongoose = require('mongoose');
const { NOTICE_TYPES, TARGET_AUDIENCE_TYPES } = require('../config/constants');
const Schema = mongoose.Schema;

const targetSchema = new Schema({
    audienceType: {
        type: String,
        required: true,
        enum: Object.keys(TARGET_AUDIENCE_TYPES)
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
    },
    acknowdegementRequired: {
        type: Boolean,
        required: true,
        default: false
    },
    acknowledgedBy: {
        type: [mongoose.Types.ObjectId],
        ref: 'Student',
        required: false
    },
    acknowledged: {
        type: Boolean,
        required: true,
        default: false
    }
});

const noticeSchema = new Schema(
    {
        title: { type: String, required: true },
        description: { type: String, required: true },

        noticeType: {
            type: String,
            required: true,
            enum: Object.keys(NOTICE_TYPES)
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
        },
        translationsCache: {
            type: Object,
            required: true,
            default: {}
        },
        resultAttached: {
            type: mongoose.Types.ObjectId,
            ref: 'Result',
            required: false
        },
        img: {
            type: String,
            required: false
        }
    },
    { timestamps: true }
);

const Notice = mongoose.model('Notice', noticeSchema);
module.exports = Notice;
