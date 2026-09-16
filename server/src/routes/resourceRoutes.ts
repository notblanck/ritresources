import { Router } from 'express';
import multer from 'multer';
import * as resourceController from '../controllers/resourceController.js';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB limit
});

const router = Router();

router.get('/', resourceController.listResources);
router.get('/subjects', resourceController.getSubjects);
router.get('/:id', resourceController.getResource);
router.post('/', upload.single('file'), resourceController.createResource);
router.post('/:id/download', resourceController.downloadResource);

export default router;
