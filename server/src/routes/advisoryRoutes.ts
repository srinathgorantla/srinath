import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import {
  getAdvisories,
  getAdvisoryById,
  createAdvisory,
  deleteAdvisory,
} from '../controllers/advisoryController.js';

const router = Router();

// Protect all advisory routes with JWT authentication
router.use(requireAuth);

router.get('/', getAdvisories);
router.get('/:id', getAdvisoryById);
router.post('/', createAdvisory);
router.delete('/:id', deleteAdvisory);

export default router;
