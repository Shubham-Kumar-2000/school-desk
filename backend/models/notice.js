const { DataTypes } = require('sequelize');
const sequelize = require('./init');
const { NOTICE_TYPES, TARGET_AUDIENCE_TYPES } = require('../config/constants');
const AdminTeacher = require('./adminTeachers');
// const Result = require('./result');

const Notice = sequelize.define(
    'Notice',
    {
        _id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: {
            type: DataTypes.STRING,
            allowNull: false
        },
        noticeType: {
            type: DataTypes.ENUM(...Object.keys(NOTICE_TYPES)),
            allowNull: false
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
        reminders: {
            type: DataTypes.ARRAY(DataTypes.DATE),
            allowNull: true,
            defaultValue: []
        },
        translationsCache: {
            type: DataTypes.JSONB,
            allowNull: false,
            defaultValue: {}
        },
        img: {
            type: DataTypes.STRING,
            allowNull: true
        },
        targets: {
            // Embedded target as JSONB
            type: DataTypes.JSONB,
            allowNull: false,
            validate: {
                isValidTarget(value) {
                    if (!value || typeof value !== 'object') {
                        throw new Error('Target must be a valid JSON object.');
                    }

                    const allowedAudienceTypes = Object.keys(
                        TARGET_AUDIENCE_TYPES
                    );

                    if (!allowedAudienceTypes.includes(value.audienceType)) {
                        throw new Error('Invalid audience type.');
                    }

                    if (value.student && typeof value.student !== 'string') {
                        // Assuming student ID is a string
                        throw new Error('Student must be a valid ID.');
                    }

                    if (
                        value.students &&
                        (!Array.isArray(value.students) ||
                            value.students.some((id) => typeof id !== 'string'))
                    ) {
                        throw new Error(
                            'Students must be an array of valid IDs.'
                        );
                    }

                    if (value.class && typeof value.class !== 'string') {
                        // Assuming class ID is a string
                        throw new Error('Class must be a valid ID.');
                    }

                    if (typeof value.acknowledgementRequired !== 'boolean') {
                        throw new Error(
                            'Acknowledgement required must be a boolean.'
                        );
                    }

                    if (!Object.keys(value).includes('acknowledgedBy')) {
                        value.acknowledgedBy = [];
                    }

                    if (
                        value.acknowledgedBy &&
                        (!Array.isArray(value.acknowledgedBy) ||
                            value.acknowledgedBy.some(
                                (id) => typeof id !== 'string'
                            ))
                    ) {
                        throw new Error(
                            'Acknowledged by must be an array of valid IDs.'
                        );
                    }
                    if (!Object.keys(value).includes('acknowledged')) {
                        value.acknowledged = false;
                    }

                    if (typeof value.acknowledged !== 'boolean') {
                        throw new Error('Acknowledged must be a boolean.');
                    }
                }
            }
        }
    },
    {
        timestamps: true
    }
);

Notice.belongsTo(AdminTeacher, {
    as: 'createdByData',
    foreignKey: 'createdBy'
});
AdminTeacher.hasMany(Notice, { as: 'notices', foreignKey: 'createdBy' });

// Notice.belongsTo(Result, {
//     as: 'resultAttached',
//     foreignKey: 'resultAttachedId',
//     allowNull: true
// });
// Result.hasMany(Notice, { as: 'notices', foreignKey: 'resultAttachedId' });

module.exports = Notice;
