import { Router } from 'express';
import * as departmentController from '../controllers/departmentController.js';

const router = Router();

router.get('/', departmentController.listDepartments);

export default router;
