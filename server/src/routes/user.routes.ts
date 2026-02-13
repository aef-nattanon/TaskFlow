import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { getMe, updateMe } from '../controllers/user.controller';
import { validate } from '../middleware/validate';

const router = Router();
router.use(authenticate);

router.get('/me', getMe);

import { updateMeSchema } from '../schemas/user.schema';

router.patch('/me', validate(updateMeSchema), updateMe);

export default router;
