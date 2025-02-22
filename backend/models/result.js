const { DataTypes } = require('sequelize');
const sequelize = require('./init');
const Student = require('./student');
const Class = require('./class');
const AdminTeacher = require('./adminTeachers');
const { CustomError } = require('../helpers/errorHelper');

const Result = sequelize.define(
    'Result',
    {
        _id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        examName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        rank: {
            type: DataTypes.INTEGER, // Or FLOAT
            allowNull: true
        },
        published: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        publishOn: {
            type: DataTypes.DATE,
            allowNull: false
        },
        entries: {
            type: DataTypes.JSONB, // Store entries as JSONB array
            allowNull: false,
            defaultValue: [],
            validate: {
                isValidEntries(value) {
                    if (!Array.isArray(value)) {
                        throw new CustomError('Entries must be an array.');
                    }
                    value.forEach((entry) => {
                        console.log(entry);
                        if (
                            !entry.subject ||
                            typeof entry.subject !== 'string'
                        ) {
                            throw new CustomError(
                                'Subject is required and must be a string.'
                            );
                        }
                        if (
                            typeof entry.marks !== 'number' &&
                            Number.isNaN(entry.marks)
                        ) {
                            throw new CustomError(
                                'Marks is required and must be a number.'
                            );
                        } else {
                            entry.marks = Number(entry.marks);
                        }
                        if (
                            typeof entry.totalMarks !== 'number' &&
                            Number.isNaN(entry.totalMarks)
                        ) {
                            throw new CustomError(
                                'Total Marks is required and must be a number.'
                            );
                        } else {
                            entry.totalMarks = Number(entry.totalMarks);
                        }
                    });
                }
            }
        }
    },
    {
        timestamps: true
    }
);

// Define Relationships
Result.belongsTo(Student, { as: 'studentData', foreignKey: 'student' });
Student.hasMany(Result, { as: 'results', foreignKey: 'student' });

Result.belongsTo(Class, { as: 'currentClassData', foreignKey: 'currentClass' });
Class.hasMany(Result, { as: 'results', foreignKey: 'currentClass' });

Result.belongsTo(AdminTeacher, {
    as: 'createdByData',
    foreignKey: 'createdBy'
});
AdminTeacher.hasMany(Result, { as: 'results', foreignKey: 'createdBy' });

module.exports = Result;
