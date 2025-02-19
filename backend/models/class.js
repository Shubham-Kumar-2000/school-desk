const mongoose = require('mongoose');
const configConsts = require('../config/constants');

const Schema = mongoose.Schema;

const scheduleSchema = new Schema(
    {
        day: { type: String, required: true, enum: configConsts.DAYS_OF_WEEK },
        startTime: {
            type: String,
            match: /^(0[1-9]|1[0-2]):([0-5][0-9])\s(AM|PM)$/,
            required: true
        },
        endTime: {
            type: String,
            match: /^(0[1-9]|1[0-2]):([0-5][0-9])\s(AM|PM)$/,
            required: true
        },
        subject: { type: String, required: true },
        teacher: {
            type: mongoose.Types.ObjectId,
            ref: 'AdminTeacher',
            required: true
        }
    },
    { timestamps: false }
);

const classSchema = new Schema(
    {
        name: { type: String, required: true },
        batch: { type: Number, required: true },
        classTeacher: {
            type: mongoose.Types.ObjectId,
            ref: 'AdminTeacher',
            required: true
        },
        schedule: { type: [scheduleSchema], required: true }
    },
    { timestamps: true }
);

const validateSchedule = (schedules) => {
    const days = {};
    for (const schedule of schedules) {
        if (days[schedule.day]) {
            return false;
        }
        days[schedule.day] = true;
    }
    return true;
};

classSchema.pre('save', function (next) {
    if (!this.isModified('schedule')) {
        return next();
    }
    if (!validateSchedule(this.schedule)) {
        next(new Error('Duplicate day in schedule'));
    }
    next();
});

classSchema.pre('updateOne', function (next) {
    if (!this._update.schedule) {
        return next();
    }
    if (!validateSchedule(this._update.schedule)) {
        next(new Error('Duplicate day in schedule'));
    }
    next();
});

const Class = mongoose.model('Class', classSchema);
module.exports = Class;
