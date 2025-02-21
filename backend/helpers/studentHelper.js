const { USER_STATUS } = require('../config/constants');
const Guardian = require('../models/guardian');
const { CustomError } = require('./errorHelper');

exports.validateStudent = async (req, res, next) => {
    try {
        const studentId = req.headers['x-student-id'];
        if (!studentId) throw new CustomError('Invalid Student ID');

        const guardian = await Guardian.findOne({
            _id: req.user._id,
            status: USER_STATUS.ACTIVE
        }).populate('students');

        if (!guardian) throw new CustomError('Invalid Guardian');

        const student = guardian.students.find(
            (student) => String(student._id) === studentId
        );

        if (!student || student.status !== USER_STATUS.ACTIVE) {
            throw new CustomError('Invalid Student ID');
        }

        req.student = student;
        req.guardian = guardian;
        next();
    } catch (e) {
        console.log(e);
        next(e);
    }
};
