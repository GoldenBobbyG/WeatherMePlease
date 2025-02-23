import { Router } from 'express';
const router = Router();

import weatherRoutes from './weatherRoutes.js';

// This ENDPOINT is PREFIXED with '/api'
router.use('/weather', weatherRoutes);

export default router;
