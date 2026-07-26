import { Queue, Worker, type Job as BullJob } from 'bullmq';
import { Job, type IJob, type JobStatus } from '../models/Job.model';
import { connection } from '../db/jobConnection';

export interface CreateJobInput {
  type: 'indexing' | "indexing-youtube" | "indexing-website" | 'query';
  data: Record<string, unknown>;
}

export interface IJobService {
  createJob(input: CreateJobInput): Promise<IJob>;
  getJobStatus(jobId: string): Promise<IJob | null>;
  processJobs(processor: (job: BullJob) => Promise<unknown>): void;
}

export class JobService implements IJobService {
  private queue: Queue;
  private worker: Worker | null = null;

  constructor(queueName: string = 'indexing-youtube') {
    this.queue = new Queue(queueName, { connection });
  }

  async createJob(input: CreateJobInput): Promise<IJob> {
    try {
      const bullJob = await this.queue.add(input.type, input.data);

      const job = await Job.create({
        jobId: bullJob.id,
        status: 'waiting',
        type: input.type,
        data: input.data,
      });
      console.log(job)

      return job;
    } catch (error) {
      console.log(error)
      throw new Error(error);
    }
  }

  async getJobStatus(jobId: string): Promise<IJob | null> {
    return Job.findOne({ jobId });
  }

  processJobs(processor: (job: BullJob) => Promise<unknown>): void {
    this.worker = new Worker(this.queue.name, async (job: BullJob) => {
      await Job.findOneAndUpdate(
        { jobId: job.id },
        { status: 'active' }
      );

      try {
        const result = await processor(job);

        await Job.findOneAndUpdate(
          { jobId: job.id },
          {
            status: 'completed',
            result: result as Record<string, unknown>,
            completedAt: new Date(),
          }
        );

        return result;
      } catch (error) {
        await Job.findOneAndUpdate(
          { jobId: job.id },
          {
            status: 'failed',
            error: error instanceof Error ? error.message : 'Unknown error',
          }
        );
        throw error;
      }
    }, {
      connection: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379'),
        password: process.env.REDIS_PASSWORD,
      },
    });
  }

  async close(): Promise<void> {
    await this.worker?.close();
    await this.queue.close();
  }
}
