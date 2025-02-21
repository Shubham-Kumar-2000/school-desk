const mongoose = require('mongoose');
const addressSchema = require('./address');
const { USER_STATUS, GENDERS } = require('../config/constants');

const Schema = mongoose.Schema;

const studentSchema = new Schema(
    {
        name: { type: String, required: true },
        rollNo: { type: Number, required: true },
        currentClass: {
            type: mongoose.Types.ObjectId,
            ref: 'Class',
            required: true
        },
        status: {
            type: String,
            enum: Object.values(USER_STATUS),
            required: true,
            default: USER_STATUS.ACTIVE
        },

        avatar: { type: String, default: null },

        address: { type: addressSchema, required: true },

        dob: { type: Date, required: true },
        gender: {
            type: String,
            required: true,
            default: GENDERS.MALE,
            enum: Object.values(GENDERS)
        }
    },
    { timestamps: true }
);

const Student = mongoose.model('Student', studentSchema);
module.exports = Student;
