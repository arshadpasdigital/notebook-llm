/**
 * @goal : to create the user route to handle all user related routes 
 * @description : it has mainly three routes 
 *  1. /indexing POST => is used to create the indexing create in job
 *  2. /:JobId GET  => get the status of job
 *  3. /query POSt => asking the query
 * 
 * @purpose : it is here we follow the solid principle and add the DI
 * 
 */

import { Router } from 'express';
import { RAGController } from '../controllers/RAGController';
import { type IJobService } from '../services/JobService';
import multer from 'multer'

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Ensure this folder exists in your root root directory
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + file.originalname);
  }
});


const upload = multer({ storage })

export function createRAGRouter(jobService: IJobService): Router {
  const router = Router();
  const controller = new RAGController(jobService);

  router.post('/pdf-indexing', upload.single("mypdf"), controller.createIndexingJob);
  router.post('/vvt-indexing', controller.createIndexingJob);
  router.post('/youtube-indexing', controller.createIndexingJobForYoutube);
  router.post('/text-indexing', controller.createIndexingJob);
  router.get('/:jobId', controller.getJobStatus);
  router.post('/query', controller.createQueryJob);

  return router;
}
