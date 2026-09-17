import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import * as resourceController from '../controllers/resourceController.js';
const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}
const storage = multer.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, uploadDir);
    },
    filename: (_req, file, cb) => {
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        const ext = path.extname(file.originalname);
        const safeBase = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
        cb(null, `${uniqueSuffix}-${safeBase}${ext}`);
    }
});
const upload = multer({
    storage,
    limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
    fileFilter: (_req, file, cb) => {
        const allowed = /\.(pdf|doc|docx|ppt|pptx|txt|zip|rar|tar|gz|py|java|cpp|c|js|ts|html|css|png|jpg|jpeg)$/i;
        if (allowed.test(file.originalname) || file.mimetype) {
            cb(null, true);
        }
        else {
            cb(new Error('Unsupported file format. Please upload PDF, Word document, code, archive, or image.'));
        }
    }
});
const router = Router();
router.get('/', resourceController.listResources);
router.get('/subjects', resourceController.getSubjects);
router.get('/:id', resourceController.getResource);
router.get('/:id/download', resourceController.streamDownloadResource);
router.post('/:id/download', resourceController.downloadResource);
router.post('/', upload.single('file'), resourceController.createResource);
export default router;
