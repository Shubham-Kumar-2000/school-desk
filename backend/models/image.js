const { DataTypes } = require('sequelize');
const sequelize = require('./init');

const Image = sequelize.define(
    'Image',
    {
        key: {
            type: DataTypes.STRING,
            allowNull: true // You might want to make this required
        },
        filePath: {
            type: DataTypes.STRING,
            defaultValue: ''
        }
    },
    {
        timestamps: true, // Adds createdAt and updatedAt automatically
        tableName: 'Images' // Optional: If you want the table name to be 'Images'
    }
);

module.exports = Image;
