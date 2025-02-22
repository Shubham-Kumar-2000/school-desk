const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('school_desk', 'postgres', 'shubham', {
    host: 'localhost',
    dialect: 'postgres' // Or your PostgreSQL connection details
    // ... other Sequelize options
});

// Test the connection (optional)
sequelize
    .authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');
    })
    .catch((err) => {
        console.error('Unable to connect to the database:', err);
    });

module.exports = sequelize;
