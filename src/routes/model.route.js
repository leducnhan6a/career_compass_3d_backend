'use strict';

import express from 'express';
import ModelController from '../controllers/model.controller.js';
import asyncHandler from '../helpers/asyncHandler.js';
import { authenticationV2 } from '../utils/AuthUtil/auth.util.js';
import { permission } from '../middlewares/auth.middleware.js';

const router = express.Router();

// authentication
router.use(authenticationV2);

// permission user
router.use(permission('user'))
// permission
router.get('', asyncHandler(ModelController.getAll3DModels));
router.get('/:modelId', asyncHandler(ModelController.getSignedURLById));
router.get('/:modelId/detail', asyncHandler(ModelController.getModelDetailById));

// permission admin
router.use(permission('admin'))
// permission 

router.get('/deleted', asyncHandler(ModelController.getAllDeleted3DModels));
router.put('/:modelId/detail', asyncHandler(ModelController.updateModelDetailById));
router.patch('/:modelId/delete', asyncHandler(ModelController.softDeleteModelById));
router.delete('/:modelId/delete', asyncHandler(ModelController.forceDeleteModelById));
router.patch('/:modelId/restore', asyncHandler(ModelController.restoreModelById));

export default router;
