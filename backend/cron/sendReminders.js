/* eslint-disable no-process-exit */
// process.env.cron=true

const { Op } = require('sequelize');
const { SCHEDULER_INTERVAL } = require('../config/constants');
const { produceMessages } = require('../helpers/kafkaHelper');
const Notice = require('../models/notice');
const Result = require('../models/result');

// const plansController = require('../controllers/plansController');
require('dotenv').config({ path: '.env' });
exports.send = async () => {
    console.log('Updating plans' + new Date());
    try {
        console.log('Updating plans' + new Date());
        const messages = {
            notice: await getNotices(),
            reminder: await getReminders(),
            result: await getResults()
        };
        await produceMessages(messages);
    } catch (err) {
        console.log(err);
    }
};

const getNotices = async () => {
    const interval = new Date(Date.now() - SCHEDULER_INTERVAL);
    const notices = await Notice.findAll({
        where: {
            published: false,
            publishOn: {
                [Op.gte]: interval,
                [Op.lte]: new Date()
            }
        }
    });
    console.log('Notices Got: ', notices.length);
    return processList(notices);
};
const getReminders = async () => {
    const interval = new Date(Date.now() - SCHEDULER_INTERVAL);
    const reminders = await Notice.findAll({
        where: {
            reminders: {
                [Op.overlap]: [interval, new Date()]
            }
        }
    });
    console.log('reminders Got: ', reminders.length);
    return processList(reminders);
};
const getResults = async () => {
    const interval = new Date(Date.now() - SCHEDULER_INTERVAL);
    const results = await Result.findAll({
        where: {
            published: false,
            publishOn: {
                [Op.gte]: interval,
                [Op.lte]: new Date()
            }
        }
    });
    console.log('results Got: ', results.length);
    return processList(results);
};

const processList = (list) => {
    return list.map((item) => {
        return {
            key: item.id,
            value: item.id
        };
    });
};
