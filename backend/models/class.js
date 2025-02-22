const { DataTypes } = require('sequelize');
const sequelize = require('./init');
const AdminTeacher = require('./adminTeachers');
const configConsts = require('../config/constants');
const { CustomError } = require('../helpers/errorHelper');

const Class = sequelize.define(
    'Class',
    {
        _id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        batch: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        schedule: {
            // Schedule as a JSONB array
            type: DataTypes.JSONB,
            allowNull: false,
            validate: {
                validateSchedule(value) {
                    const days = {};
                    if (!Array.isArray(value)) {
                        throw new Error('Schedule must be an array');
                    }

                    for (const schedule of value) {
                        if (
                            !schedule.day ||
                            !schedule.startTime ||
                            !schedule.endTime ||
                            !schedule.subject ||
                            !schedule.teacher
                        ) {
                            throw new CustomError(
                                'Schedule items must have day, startTime, endTime, teacher and subject'
                            );
                        }
                        if (days[schedule.day]) {
                            throw new CustomError('Duplicate day in schedule');
                        }
                        days[schedule.day] = true;
                        if (!configConsts.DAYS_OF_WEEK.includes(schedule.day)) {
                            throw new CustomError('Invalid day of the week');
                        }
                        if (
                            !/^(0[1-9]|1[0-2]):([0-5][0-9])\s(AM|PM)$/.test(
                                schedule.startTime
                            ) ||
                            !/^(0[1-9]|1[0-2]):([0-5][0-9])\s(AM|PM)$/.test(
                                schedule.endTime
                            )
                        ) {
                            throw new CustomError('Invalid time format');
                        }
                    }
                }
            }
        }
    },
    {
        timestamps: true
    }
);

Class.belongsTo(AdminTeacher, {
    as: 'classTeacher',
    foreignKey: 'classTeacherId'
});
AdminTeacher.hasMany(Class, { as: 'classes', foreignKey: 'classTeacherId' });

module.exports = Class;
