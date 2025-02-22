const { Op } = require('sequelize');
const { USER_STATUS } = require('../config/constants');
const Guardian = require('../models/guardian');
const Student = require('../models/student');
const { CustomError } = require('./errorHelper');
const Class = require('../models/class');

exports.validateStudent = async (req, res, next) => {
    try {
        const studentId = req.headers['x-student-id'];
        if (!studentId) throw new CustomError('Invalid Student ID');

        const user = await Guardian.getUserById(req.user._id);

        if (!user) throw new CustomError('Invalid Token');

        const students = await Student.findAll({
            where: {
                _id: {
                    [Op.in]: user.students
                },
                status: USER_STATUS.ACTIVE
            },
            include: [{ model: Class, as: 'currentClassData' }]
        });
        user.students = students;

        const student = user.students.find(
            (student) => String(student._id) === studentId
        );

        if (!student || student.status !== USER_STATUS.ACTIVE) {
            throw new CustomError('Invalid Student ID');
        }

        req.student = student;
        req.guardian = user;
        next();
    } catch (e) {
        console.log(e);
        next(e);
    }
};
