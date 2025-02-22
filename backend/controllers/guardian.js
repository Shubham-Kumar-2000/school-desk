/* eslint-disable no-empty */
const Guardian = require('../models/guardian');
const tokenHelper = require('../helpers/tokenHelper');
const configConsts = require('../config/constants');
const { CustomError } = require('../helpers/errorHelper');
const OtpUsage = require('../models/otpUsage');
const Otp = require('../models/otp');
const { sendOtp } = require('../helpers/smsHelper');
const { indentityValidation } = require('../validations/indentity');

exports.generateOtp = async (req, res, next) => {
    try {
        const phone = req.body.phone;
        if ((await OtpUsage.getUsage(phone)).used >= 5) {
            throw new CustomError('Limit exceeded');
        }
        let otp = '';
        if (req.body.resend) {
            const resend = await Otp.getResendOtp(phone);
            if (!resend) {
                return res.status(200).json({ success: true });
            }
            otp = resend.otp;
        } else {
            otp = await Otp.createOtp(phone);
        }
        await sendOtp(phone, otp);
        return res.status(200).json({ success: true });
    } catch (e) {
        console.log(e);
        next(e);
    }
};

exports.logInByPhone = async (req, res, next) => {
    const reqUser = {
        phone: req.body.phone,
        otp: req.body.otp
    };
    try {
        if (!reqUser.phone || !reqUser.otp)
            throw new CustomError('Bad Request');
        if (!(await Otp.validateOtp(reqUser.phone, reqUser.otp))) {
            throw new CustomError('Invalid Otp');
        }
        const user = await Guardian.checkIfUserExists(reqUser.phone, 'phone');

        if (!user) {
            throw new CustomError('User not found');
        }

        if (user.status == configConsts.USER_STATUS.BLOCKED) {
            throw new CustomError('You have been blocked from this platform');
        }
        if (user.status == configConsts.USER_STATUS.DELETED) {
            throw new CustomError('You are not allowed to use this platform');
        }

        res.status(200).json({
            err: false,
            token: tokenHelper.sign({
                _id: user._id,
                name: user.name,
                phone: user.phone,
                status: user.status
            }),
            user: user
        });
    } catch (e) {
        console.log(e);
        next(e);
    }
};

exports.profile = async (req, res, next) => {
    try {
        const user = await Guardian.getUserById(req.user._id).populate(
            'students'
        );

        if (!user) throw new CustomError('Invalid Token');
        res.status(200).json({ err: false, user });
    } catch (e) {
        console.log(e);
        next(e);
    }
};

exports.deleteGuardian = async (request, response, context) => {
    const { record } = context;
    await Guardian.removeUser(record.params._id);

    return {
        notice: {
            message: 'Successfully deleted user.',
            type: 'success'
        }
    };
};

exports.defaultActiveGuardiansOnly = (request) => {
    const { query = {} } = request;
    if (!query['filters.status']) {
        query['filters.status'] = configConsts.USER_STATUS.ACTIVE;
    }
    const newQuery = {
        ...query
    };

    request.query = newQuery;

    return request;
};

exports.studentIdToStudent = (request) => {
    const { query = {} } = request;
    if (query['filters.studentId']) {
        query['filters.students'] = query['filters.studentId'];
    }

    delete query['filters.studentId'];

    const newQuery = {
        ...query
    };

    request.query = newQuery;

    return request;
};

exports.validateGuardianIndentityNumber = (request) => {
    const { payload = {} } = request;
    const indentityNumber = payload.indentityNumber;

    if (!indentityNumber) {
        throw new CustomError('Indentity number is required');
    }
    const indentityValidationObject = {
        [payload.indentityType]: payload.indentityNumber
    };
    const { error } = indentityValidation.validate(indentityValidationObject);
    if (error) throw new CustomError('Invalid indentity number');

    return request;
};

exports.updateMe = async (req, res, next) => {
    try {
        const user = await Guardian.updateUser(req.user._id, req.body, {
            status: configConsts.USER_STATUS.ACTIVE
        });
        if (!user) throw new CustomError('Invalid Guardian');
        res.status(200).json({ err: false, user });
    } catch (e) {
        console.log(e);
        next(e);
    }
};
