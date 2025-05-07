import express from 'express';
import GPAController from '../controllers/gpa.controller.js';
import asyncHandler from '../helpers/asyncHandler.js';
import { authenticationV2 } from '../utils/AuthUtil/auth.util.js';
import { permission } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Xác thực đã đăng nhập
router.use(authenticationV2);

// List of methods to calculate gpa
router.get('/methods', asyncHandler(GPAController.getGPACalcMethods));

// Check user permission
router.use(permission('user'));

// Calculate GPA
router.post('/result', asyncHandler(GPAController.getGPAresult));

// Get GPA history
router.get('/history', asyncHandler(GPAController.getGPAHistory));

export default router;