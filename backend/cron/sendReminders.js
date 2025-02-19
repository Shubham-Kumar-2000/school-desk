/* eslint-disable no-process-exit */
// process.env.cron=true
// const plansController = require('../controllers/plansController');
require('dotenv').config({ path: '.env' });
require('../models/index').connect();
async function posts() {
    console.log('Updating plans' + new Date());
    try {
        console.log('Updating plans' + new Date());
        // await Promise.all([plansController.start(), plansController.expire()]);
    } catch (err) {
        console.log(err);
    }
}
posts()
    .then(() => {
        console.log('Plans Update done' + new Date());
        process.exit();
    })
    .catch((e) => {
        console.log(e);
        process.exit(1);
    });
