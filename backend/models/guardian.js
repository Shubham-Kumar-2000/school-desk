const mongoose = require('mongoose');
const configConsts = require('../config/constants');
const addressSchema = require('./address');

const Schema = mongoose.Schema;

const notificationSettingsSchema = new Schema({
    sms: { type: Boolean, required: true, default: true },
    pushToken: { type: String, required: false }
});

const guardianSchema = new Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: false },
        phone: { type: String, match: /^\+91[6-9]\d{9}$/, required: true },
        students: {
            type: [mongoose.Types.ObjectId],
            ref: 'Student',
            required: false
        },
        dob: { type: Date, required: true },
        preferredLanguage: {
            type: String,
            enum: Object.keys(configConsts.SUPPORTED_LANGUAGES),
            required: true
        },

        notificationSettings: {
            type: notificationSettingsSchema,
            required: true,
            default: {
                sms: true
            }
        },

        status: {
            type: String,
            enum: Object.values(configConsts.USER_STATUS),
            required: true,
            default: configConsts.USER_STATUS.ACTIVE
        },

        indentityType: {
            type: String,
            required: true,
            enum: Object.keys(configConsts.IDENTITY_TYPES)
        },
        indentityNumber: { type: String, required: true },

        address: { type: addressSchema, required: true }
    },
    { timestamps: true }
);

guardianSchema.statics.checkIfUserExists = function (username, kind) {
    const where = {
        status: {
            $nin: [
                configConsts.USER_STATUS.BLOCKED,
                configConsts.USER_STATUS.DELETED
            ]
        }
    };

    if (!kind) {
        where['email'] = username;
    } else {
        where[kind] = username;
    }
    return Guardian.findOne(where);
};

guardianSchema.statics.getUserById = (userId) => {
    return Guardian.findOne({
        _id: userId
    });
};

guardianSchema.statics.getValidUserById = (userId) => {
    return Guardian.findOne({
        _id: userId,
        status: configConsts.USER_STATUS.ACTIVE
    });
};

guardianSchema.statics.updateUser = (userId, update, query = {}) => {
    return Guardian.findOneAndUpdate(
        {
            _id: userId,
            ...query
        },
        {
            $set: update
        },
        { new: true }
    );
};

guardianSchema.statics.removeUser = (userId) => {
    return Guardian.findOneAndUpdate(
        {
            _id: userId
        },
        {
            $set: {
                status: configConsts.USER_STATUS.BLOCKED
            }
        },
        { new: true }
    );
};

const Guardian = mongoose.model('Guardian', guardianSchema);
module.exports = Guardian;
