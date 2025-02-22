const { DataTypes, Op } = require('sequelize');
const sequelize = require('./init');
const configConsts = require('../config/constants');
const { addressSequlizeSchema } = require('./address');

const Guardian = sequelize.define(
    'Guardian',
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
        email: {
            type: DataTypes.STRING,
            allowNull: true
        },
        phone: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                is: /^\+91[6-9]\d{9}$/
            }
        },
        dob: {
            type: DataTypes.DATE,
            allowNull: false
        },
        preferredLanguage: {
            type: DataTypes.ENUM(
                ...Object.keys(configConsts.SUPPORTED_LANGUAGES)
            ),
            allowNull: false
        },
        notificationSettings: {
            type: DataTypes.JSONB, // Store notification settings as JSONB
            allowNull: false,
            defaultValue: {
                sms: true
            }
        },
        status: {
            type: DataTypes.ENUM(...Object.values(configConsts.USER_STATUS)),
            allowNull: false,
            defaultValue: configConsts.USER_STATUS.ACTIVE
        },
        identityType: {
            type: DataTypes.ENUM(...Object.keys(configConsts.IDENTITY_TYPES)),
            allowNull: false
        },
        identityNumber: {
            type: DataTypes.STRING,
            allowNull: false
        },
        address: addressSequlizeSchema,
        students: {
            type: DataTypes.ARRAY(DataTypes.UUID),
            allowNull: false,
            defaultValue: []
        }
    },
    {
        timestamps: true
    }
);

// Static methods (using class methods in Sequelize v6+)
Guardian.checkIfUserExists = async function (username, kind) {
    const where = {
        status: {
            [Op.notIn]: [
                configConsts.USER_STATUS.BLOCKED,
                configConsts.USER_STATUS.DELETED
            ]
        }
    };

    if (!kind) {
        where.email = username;
    } else {
        where[kind] = username;
    }
    return this.findOne({ where });
};

Guardian.getUserById = async function (userId) {
    const guardian = await this.findOne({ where: { _id: userId } });

    if (guardian) {
        return guardian.get({ plain: true });
    }
    return null;
};

Guardian.getValidUserById = async function (userId) {
    const guardian = await this.findOne({
        where: { _id: userId, status: configConsts.USER_STATUS.ACTIVE }
    });
    if (guardian) {
        return guardian.get({ plain: true }); // Convert to plain object if found
    }
    return null;
};

Guardian.updateUser = async function (userId, update, query = {}) {
    return this.update(update, {
        where: {
            _id: userId,
            ...query
        },
        returning: true // For getting the updated instance
    }).then((result) => result[1][0]); // Get the updated instance
};

Guardian.removeUser = async function (userId) {
    return this.update(
        { status: configConsts.USER_STATUS.BLOCKED },
        {
            where: { _id: userId },
            returning: true
        }
    ).then((result) => result[1][0]);
};

module.exports = Guardian;
