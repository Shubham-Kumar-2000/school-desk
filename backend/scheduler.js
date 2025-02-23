require('dotenv').config({ path: '.env' });
const cron = require('node-cron');
const sequelize = require('./models/init');
const { send } = require('./cron/sendReminders');

cron.schedule('0 * * * * *', async () => {
    console.log('Cron Job Started at:', new Date().toISOString());
    await sequelize.sync({ alter: true });
    await send();
    console.log('Cron Job Ended at:', new Date().toISOString());
});
