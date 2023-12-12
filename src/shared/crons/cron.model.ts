import { Model, model, Schema } from 'mongoose';

export interface ICronJob {
  schedule: string;
  lastExecutionTime: number | null;
}

const cronJobSchema: Schema = new Schema(
  {
    schedule: { type: String, required: true, unique: true },
    lastExecutionTime: { type: Number, default: null }
  },
  { timestamps: true }
);

const CronJobModel: Model<ICronJob> = model<ICronJob>('CronJobs', cronJobSchema, 'CronJobs');
export { CronJobModel };
