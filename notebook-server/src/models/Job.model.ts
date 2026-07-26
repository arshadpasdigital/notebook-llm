import mongoose, { Schema, type Document } from 'mongoose';

export type JobStatus = 'waiting' | 'active' | 'completed' | 'failed' | 'delayed';

export interface IJob extends Document {
  jobId: string;
  status: JobStatus;
  type: 'indexing' | "indexing-youtube" | "indexing-website" | 'query';
  data: Record<string, unknown>;
  result?: Record<string, unknown>;
  error?: string;
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
}

const JobSchema = new Schema<IJob>(
  {
    jobId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    status: {
      type: String,
      enum: ['waiting', 'active', 'completed', 'failed', 'delayed'],
      default: 'waiting',
    },
    type: {
      type: String,
      enum: ['indexing', "indexing-youtube", "indexing-website", 'query'],
      required: true,
    },
    data: {
      type: Schema.Types.Mixed,
      required: true,
    },
    result: {
      type: Schema.Types.Mixed,
    },
    error: {
      type: String,
    },
    completedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

export const Job = mongoose.model<IJob>('Job', JobSchema);
