import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { getCategories, createCategory } from '../controllers/category.controller';
import { validate } from '../middleware/validate';

const router = Router();
router.use(authenticate);

router.get('/', getCategories);

router.post('/', validate([
  { field: 'name', required: true, type: 'string', minLength: 1 },
  { field: 'color', required: true, type: 'string', minLength: 1 },
]), createCategory);

export default router;
