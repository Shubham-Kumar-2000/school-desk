// db.js (Sequelize initialization) - No changes needed

// otp-model.js
const { DataTypes, Op } = require('sequelize');
const sequelize = require('./init');
const md5 = require('md5');
const otpGenerator = require('otp-generator');

const Otp = sequelize.define(
    'Otp',
    {
        identifier: {
            type: DataTypes.STRING,
            allowNull: false
        },
        otp: {
            type: DataTypes.STRING,
            allowNull: false
        },
        validTill: {
            type: DataTypes.DATE,
            allowNull: false
        }
    },
    {
        timestamps: true,
        indexes: [
            {
                fields: ['identifier', 'createdAt'] // Index for identifier and createdAt (timeDelta equivalent)
            }
        ]
    }
);

// Class methods (static methods in Sequelize)
Otp.validateOtp = async function (identifier, otp) {
    const hashedIdentifier = md5(identifier + '-otp');
    const otpDoc = await this.findOne({
        where: {
            identifier: hashedIdentifier,
            validTill: {
                [Op.gt]: new Date() // Sequelize's greater than operator
            },
            otp
        }
    });

    if (otpDoc) {
        await this.destroy({ where: { id: otpDoc.id } }); // Use destroy for deleteOne equivalent
    }
    return otpDoc;
};

Otp.getResendOtp = async function (identifier) {
    const hashedIdentifier = md5(identifier + '-otp');
    return this.findOne({
        where: {
            identifier: hashedIdentifier,
            validTill: {
                [Op.gt]: new Date()
            }
        }
    });
};

Otp.createOtp = async function (identifier) {
    const hashedIdentifier = md5(identifier + '-otp');
    const otp = otpGenerator.generate(6, {
        digits: true,
        lowerCaseAlphabets: false,
        upperCaseAlphabets: false,
        specialChars: false
    });

    await this.destroy({ where: { identifier: hashedIdentifier } }); // Delete existing OTPs
    await this.create({
        identifier: hashedIdentifier,
        otp,
        validTill: new Date(Date.now() + 1000 * 60 * 5) // Convert to Date object
    });
    return otp;
};

module.exports = Otp;
