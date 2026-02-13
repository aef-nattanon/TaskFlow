import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { getTasks, createTask, updateTask, toggleTask, deleteTask } from '../controllers/task.controller';
import { validate } from '../middleware/validate';

const router = Router();
router.use(authenticate);

router.get('/', getTasks);

import { createTaskSchema, updateTaskSchema } from '../schemas/task.schema';

router.post('/', validate(createTaskSchema), createTask);

router.patch('/:id', validate(updateTaskSchema), updateTask);
router.patch('/:id/toggle', toggleTask);
router.delete('/:id', deleteTask);

export default router;
