const cron = require('node-cron');
const {insertOrUpdateData} = require('./../cities/city');
/**
 * Cronjob that start at 00:00 and update
 */
const scheduleJob = () => {
    cron.schedule('25 16 * * *', async () => {
        console.log('Execution cron-job for update the data');
        await insertOrUpdateData();
    });
}

module.exports = { scheduleJob };