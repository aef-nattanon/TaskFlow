import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { getCategories, createCategory } from '../controllers/category.controller';
import { validate } from '../middleware/validate';

const router = Router();
router.use(authenticate);

router.get('/', getCategories);

import { createCategorySchema } from '../schemas/category.schema';

router.post('/', validate(createCategorySchema), createCategory);

export default router;
