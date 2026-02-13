import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { getTasks, createTask, updateTask, toggleTask, deleteTask } from '../controllers/task.controller';
import { validate } from '../middleware/validate';

const router = Router();
router.use(authenticate);

router.get('/', getTasks);

router.post('/', validate([
  { field: 'title', required: true, type: 'string', minLength: 1 },
  { field: 'priority', required: true, type: 'string', enum: ['Urgent', 'High', 'Medium', 'Low'] },
  { field: 'categoryId', required: true, type: 'string' },
]), createTask);

router.patch('/:id', updateTask);
router.patch('/:id/toggle', toggleTask);
router.delete('/:id', deleteTask);

export default router;
