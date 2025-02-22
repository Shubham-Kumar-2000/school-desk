// db.js (Sequelize initialization) - No changes needed

// otp-usage-model.js
const { DataTypes } = require('sequelize');
const sequelize = require('./init');
const md5 = require('md5');

const OtpUsage = sequelize.define(
    'OtpUsage',
    {
        identifier: {
            type: DataTypes.STRING,
            allowNull: false
        },
        used: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        timeDelta: {
            type: DataTypes.BIGINT, // Use BIGINT for large numbers (timestamps)
            allowNull: false
        }
    },
    {
        timestamps: true,
        indexes: [
            {
                fields: ['identifier', 'timeDelta']
            }
        ]
    }
);

OtpUsage.getUsage = async function (identifier) {
    const now = Date.now();
    const timeDelta = now - (now % (1000 * 60 * 5));
    const hashedIdentifier = md5(identifier + '-salt');

    const [otpUsage] = await this.findOrCreate({
        where: {
            identifier: hashedIdentifier,
            timeDelta: timeDelta
        },
        defaults: {
            identifier: hashedIdentifier, // Ensure this is set on create
            timeDelta: timeDelta,
            used: 0 // Initialize to 0 if new record is created
        }
    });

    await otpUsage.increment('used'); // Increment the 'used' count efficiently
    await otpUsage.reload(); // To get the updated value

    return otpUsage;
};

module.exports = OtpUsage;
