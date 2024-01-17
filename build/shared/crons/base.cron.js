"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseCronJob = void 0;
const cron_1 = require("cron");
const cron_model_1 = require("./cron.model");
const config_1 = require("../../config");
const orderProcessing_cron_1 = require("./orderProcessing.cron");
const log = config_1.config.createLogger('BASE CRON JOB');
class BaseCronJob {
    static async addCronJob(schedule, job) {
        const cronJobInfo = { schedule, job };
        this.cronJobInfos.push(cronJobInfo);
    }
    static startAllJobs() {
        this.cronJobInfos.forEach(async (cronJobInfo) => {
            const cronJob = new cron_1.CronJob(cronJobInfo.schedule, async () => {
                await cronJobInfo.job();
                this.saveLastExecutionTimeToDB(cronJobInfo.schedule, Date.now());
            });
            this.cronJobs.push(cronJob);
            cronJob.start();
        });
    }
    static stopAllCronJobs() {
        this.cronJobs.forEach((job) => job.stop());
    }
    static async loadLastExecutionTimeFromDB(schedule) {
        try {
            const cronJob = await cron_model_1.CronJobModel.findOne({ schedule });
            return cronJob ? cronJob.lastExecutionTime : null;
        }
        catch (err) {
            log.error(`Error loading last execution time for schedule ${schedule}`, err);
            return null;
        }
    }
    static async saveLastExecutionTimeToDB(schedule, lastExecutionTime) {
        try {
            await cron_model_1.CronJobModel.updateOne({ schedule }, { lastExecutionTime }, { upsert: true });
        }
        catch (err) {
            log.error(`Error saving last execution time for schedule ${schedule}`, err);
        }
    }
}
exports.BaseCronJob = BaseCronJob;
BaseCronJob.cronJobInfos = [];
BaseCronJob.cronJobs = [];
BaseCronJob.addCronJob('0 */3 * * *', orderProcessing_cron_1.orderProcessingJob);
