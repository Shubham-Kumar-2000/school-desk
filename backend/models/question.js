const { DataTypes } = require('sequelize');
const sequelize = require('./init');
const Guardian = require('./guardian');
const Student = require('./student');
const AdminTeacher = require('./adminTeachers');

const Question = sequelize.define(
    'Question',
    {
        question: {
            type: DataTypes.STRING,
            allowNull: false
        },
        answers: {
            type: DataTypes.JSONB, // Store answers as a JSONB array
            allowNull: false,
            defaultValue: [],
            validate: {
                isValidAnswers(value) {
                    if (!Array.isArray(value)) {
                        throw new Error('Answers must be an array.');
                    }
                    value.forEach((answer) => {
                        if (!answer.text || typeof answer.text !== 'string') {
                            throw new Error(
                                'Text is required and must be a string.'
                            );
                        }
                        if (typeof answer.answeredByAi !== 'boolean') {
                            throw new Error(
                                'answeredByAi is required and must be a boolean.'
                            );
                        }
                    });
                }
            }
        },
        requiredHumanIntervention: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        humanAnswered: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        }
    },
    {
        timestamps: true
    }
);

// Define Relationships
Question.belongsTo(Guardian, { as: 'askedByData', foreignKey: 'askedBy' });
Guardian.hasMany(Question, { as: 'questions', foreignKey: 'askedBy' });

Question.belongsTo(Student, {
    as: 'askedByStudentData',
    foreignKey: 'askedByStudent'
});
Student.hasMany(Question, { as: 'questions', foreignKey: 'askedByStudent' });

Question.belongsTo(AdminTeacher, { as: 'askedToData', foreignKey: 'askedTo' });
AdminTeacher.hasMany(Question, { as: 'questions', foreignKey: 'askedTo' });

module.exports = Question;
