import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import {
  getFarms,
  getFarmById,
  createFarm,
  updateFarm,
  deleteFarm,
} from '../controllers/farmController.js';

const router = Router();

// Protect all farm routes with JWT authentication
router.use(requireAuth);

router.get('/', getFarms);
router.get('/:id', getFarmById);
router.post('/', createFarm);
router.put('/:id', updateFarm);
router.delete('/:id', deleteFarm);

export default router;
