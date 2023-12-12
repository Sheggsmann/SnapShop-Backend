import { CronJob } from 'cron';
import { CronJobModel } from './cron.model';
import { config } from '@root/config';
import { orderProcessingJob } from './orderProcessing.cron';
import Logger from 'bunyan';

const log: Logger = config.createLogger('BASE CRON JOB');

interface CronJobInfo {
  schedule: string;
  job: () => void;
}

export class BaseCronJob {
  private static cronJobInfos: CronJobInfo[] = [];
  private static cronJobs: CronJob[] = [];

  static async addCronJob(schedule: string, job: () => void): Promise<void> {
    const cronJobInfo: CronJobInfo = { schedule, job };
    this.cronJobInfos.push(cronJobInfo);
  }

  static startAllJobs(): void {
    this.cronJobInfos.forEach(async (cronJobInfo) => {
      const cronJob = new CronJob(cronJobInfo.schedule, async () => {
        await cronJobInfo.job();
        this.saveLastExecutionTimeToDB(cronJobInfo.schedule, Date.now());
      });

      this.cronJobs.push(cronJob);
      cronJob.start();
    });
  }

  static stopAllCronJobs(): void {
    this.cronJobs.forEach((job) => job.stop());
  }

  private static async loadLastExecutionTimeFromDB(schedule: string): Promise<number | null> {
    try {
      const cronJob = await CronJobModel.findOne({ schedule });
      return cronJob ? cronJob.lastExecutionTime : null;
    } catch (err) {
      log.error(`Error loading last execution time for schedule ${schedule}`, err);
      return null;
    }
  }

  private static async saveLastExecutionTimeToDB(schedule: string, lastExecutionTime: number): Promise<void> {
    try {
      await CronJobModel.updateOne({ schedule }, { lastExecutionTime }, { upsert: true });
    } catch (err) {
      log.error(`Error saving last execution time for schedule ${schedule}`, err);
    }
  }
}

BaseCronJob.addCronJob('* * * * *', orderProcessingJob);
