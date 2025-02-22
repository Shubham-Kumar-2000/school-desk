const { DataTypes } = require('sequelize');
const sequelize = require('./init');
const Class = require('./class'); // Import Class model
const { USER_STATUS, GENDERS } = require('../config/constants');
const { addressSequlizeSchema } = require('./address');

const Student = sequelize.define(
    'Student',
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
        rollNo: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        status: {
            type: DataTypes.ENUM(...Object.values(USER_STATUS)),
            allowNull: false,
            defaultValue: USER_STATUS.ACTIVE
        },
        avatar: {
            type: DataTypes.STRING,
            allowNull: true, // Changed to allowNull: true for default: null
            defaultValue: null
        },
        dob: {
            type: DataTypes.DATE,
            allowNull: false
        },
        gender: {
            type: DataTypes.ENUM(...Object.values(GENDERS)),
            allowNull: false,
            defaultValue: GENDERS.MALE
        },
        address: addressSequlizeSchema
    },
    {
        timestamps: true,
        indexes: [
            // Add a unique index for class and rollNo
            {
                unique: true,
                fields: ['currentClass', 'rollNo']
            }
        ]
    }
);

// Define relationships
Student.belongsTo(Class, {
    as: 'currentClassData',
    foreignKey: 'currentClass'
});
Class.hasMany(Student, { as: 'students', foreignKey: 'currentClass' });

module.exports = Student;
