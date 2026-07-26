import { type Request, type Response, type NextFunction } from 'express';
import { type IJobService } from '../services/JobService';
import { ValidationError, NotFoundError } from '../utils/ErrorHandle';

export class RAGController {
  constructor(private jobService: IJobService) { }

  createIndexingJob = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { text } = req.body;
      console.log(text)

      if (!text) {
        throw new ValidationError('text is required');
      }

      const job = await this.jobService.createJob({
        type: 'indexing',
        data: { text },
      });

      res.status(201).json({
        status: 'success',
        data: {
          jobId: job.jobId,
          status: job.status,
        },
      });
      res.status(201).json({
        status: 'success',
        data: {
          jobId: 1,
          status: 'success',
          message: text
        },
      });
    } catch (error) {
      next(error);
    }
  };

  createIndexingJobForYoutube = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { url } = req.body;

      if (!url) {
        throw new ValidationError('URL is required');
      }

      const job = await this.jobService.createJob({
        type: 'indexing-youtube',
        data: { url },
      });

      res.status(201).json({
        status: 'success',
        data: {
          jobId: job.jobId,
          status: job.status,
        },
      });
    } catch (error) {
      console.log(error)
      next(error);
    }
  };

  createIndexingJobForWebsite = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { website } = req.body;

      if (!website) {
        throw new ValidationError('Website is required');
      }

      const job = await this.jobService.createJob({
        type: 'indexing-website',
        data: { website },
      });

      res.status(201).json({
        status: 'success',
        data: {
          jobId: job.jobId,
          status: job.status,
        },
      });
    } catch (error) {
      next(error);
    }
  };

  createIndexingJobForText = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { text } = req.body;
      console.log(text)

      if (!text) {
        throw new ValidationError('text is required');
      }

      // const job = await this.jobService.createJob({
      //   type: 'indexing',
      //   data: { text },
      // });

      // res.status(201).json({
      //   status: 'success',
      //   data: {
      //     jobId: job.jobId,
      //     status: job.status,
      //   },
      // });
      res.status(201).json({
        status: 'success',
        data: {
          jobId: 1,
          status: 'success',
          message: text
        },
      });
    } catch (error) {
      console.log(error)
      next(error);
    }
  };


  getJobStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { jobId } = req.params;

      if (!jobId) {
        throw new ValidationError('Job ID is required');
      }

      const job = await this.jobService.getJobStatus(String(jobId));

      if (!job) {
        throw new NotFoundError('Job not found');
      }

      res.json({
        status: 'success',
        data: {
          jobId: job.jobId,
          status: job.status,
          type: job.type,
          result: job.result,
          error: job.error,
          createdAt: job.createdAt,
          completedAt: job.completedAt,
        },
      });
    } catch (error) {
      next(error);
    }
  };

  createQueryJob = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { question, options } = req.body;

      if (!question) {
        throw new ValidationError('Question is required');
      }

      const job = await this.jobService.createJob({
        type: 'query',
        data: { question, options },
      });

      res.status(201).json({
        status: 'success',
        data: {
          jobId: job.jobId,
          status: job.status,
        },
      });
    } catch (error) {
      next(error);
    }
  };
}
