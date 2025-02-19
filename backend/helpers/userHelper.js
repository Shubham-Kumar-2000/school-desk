const constants = require('../config/constants');
const { CustomError } = require('./errorHelper');

exports.activeUser = (req, _, next) => {
    if (req.user && req.user.status != constants.USER_STATUS.ACTIVE) {
        return next(new CustomError('User not active'));
    }
    next();
};
exports.pendingUser = (req, _, next) => {
    if (req.user && req.user.status != constants.USER_STATUS.PENDING) {
        return next(new CustomError('User already on boarded'));
    }
    next();
};
