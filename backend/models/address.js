const { DataTypes } = require('sequelize');
const { CustomError } = require('../helpers/errorHelper');

const addressSequlizeSchema = {
    // Address as JSONB
    type: DataTypes.JSONB,
    allowNull: false,
    validate: {
        isValidAddress(value) {
            if (!value || typeof value !== 'object') {
                throw new Error('Address must be a valid JSON object.', 400);
            }

            const requiredFields = ['address', 'city', 'state'];
            for (const field of requiredFields) {
                if (
                    !(field in value) ||
                    typeof value[field] !== 'string' ||
                    value[field].trim() === ''
                ) {
                    throw new CustomError(
                        `Address must have a valid ${field}.`
                    );
                }
            }

            if (
                (value.pincode &&
                    (typeof value.pincode !== 'string' ||
                        !/^\d{6}$/.test(value.pincode))) ||
                !value.pincode
            ) {
                throw new CustomError('Pincode must be a 6-digit number.', 400);
            }
        }
    }
};

const addressAdminJsSchema = {
    address: {
        type: 'mixed',
        isVisible: {
            edit: true,
            filter: false,
            show: true,
            list: false
        },
        isRequired: true
    },
    'address.address': {
        type: 'string',
        isRequired: true,
        isVisible: {
            edit: true,
            filter: false,
            show: true,
            list: false
        }
    },
    'address.city': {
        type: 'string',
        isRequired: true,
        isVisible: {
            edit: true,
            filter: false,
            show: true,
            list: false
        }
    },
    'address.state': {
        type: 'string',
        isRequired: true,
        isVisible: {
            edit: true,
            filter: false,
            show: true,
            list: false
        },
        availableValues: [
            {
                value: 'Andaman and Nicobar Islands'
            },
            {
                value: 'Andhra Pradesh'
            },
            {
                value: 'Arunachal Pradesh'
            },
            {
                value: 'Assam'
            },
            {
                value: 'Bihar'
            },
            {
                value: 'Chandigarh'
            },
            {
                value: 'Chhattisgarh'
            },
            {
                value: 'Dadra and Nagar Haveli'
            },
            {
                value: 'Daman and Diu'
            },
            {
                value: 'Delhi'
            },
            {
                value: 'Goa'
            },
            {
                value: 'Gujarat'
            },
            {
                value: 'Haryana'
            },
            {
                value: 'Himachal Pradesh'
            },
            {
                value: 'Jammu and Kashmir'
            },
            {
                value: 'Jharkhand'
            },
            {
                value: 'Karnataka'
            },
            {
                value: 'Kerala'
            },
            {
                value: 'Ladakh'
            },
            {
                value: 'Lakshadweep'
            },
            {
                value: 'Madhya Pradesh'
            },
            {
                value: 'Maharashtra'
            },
            {
                value: 'Manipur'
            },
            {
                value: 'Meghalaya'
            },
            {
                value: 'Mizoram'
            },
            {
                value: 'Nagaland'
            },
            {
                value: 'Odisha'
            },
            {
                value: 'Puducherry'
            },
            {
                value: 'Punjab'
            },
            {
                value: 'Rajasthan'
            },
            {
                value: 'Sikkim'
            },
            {
                value: 'Tamil Nadu'
            },
            {
                value: 'Telangana'
            },
            {
                value: 'Tripura'
            },
            {
                value: 'Uttar Pradesh'
            },
            {
                value: 'Uttarakhand'
            },
            {
                value: 'West Bengal'
            }
        ]
    },
    'address.pincode': {
        type: 'number',
        isRequired: true,
        isVisible: {
            edit: true,
            filter: false,
            show: true,
            list: false
        }
    }
};

module.exports = { addressSequlizeSchema, addressAdminJsSchema };
