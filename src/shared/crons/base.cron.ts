import cron from 'node-cron';

interface CronJobInfo {
  schedule: string;
  lastExecutionTime: number | null;
  job: () => void;
}

export class BaseCronJob {
  private static cronJobs: CronJobInfo[] = [];

  static addCronJob(schedule: string, job: () => void): void {}

  static startAllJobs(): void {}

  static stopAllCronJobs(): void {}

  private static async loadLastExecutionTimeFromDB(schedule: string): Promise<number | null> {}

  private static async saveLastExecutionTimeToDB(
    schedule: string,
    lastExecutionTime: number
  ): Promise<void> {}
}
