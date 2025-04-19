'use strict';

import express from 'express';
import ModelController from '../controllers/model.controller.js';
import asyncHandler from '../helpers/asyncHandler.js';
// import { apiKey, permission } from '../middlewares/auth.middleware.js';
import { authenticationV2 } from '../utils/AuthUtil/auth.util.js';
import { permission } from '../middlewares/auth.middleware.js';
import multer from 'multer';

const router = express.Router();

// // check apiKey
// router.use(apiKey);

// // check permission

// authentication
router.use(authenticationV2);

// permission user
router.use(permission('user'))
router.get('', asyncHandler(ModelController.getAll3DModels));
router.get('/:modelId/detail', asyncHandler(ModelController.getModelDetailById));


router.use(permission('admin'))
// permission admin
router.get('/deleted', asyncHandler(ModelController.getAllDeleted3DModels));
router.put('/:modelId/detail', asyncHandler(ModelController.updateModelDetailById));
router.patch('/:modelId/delete', asyncHandler(ModelController.softDeleteModelById));
router.delete('/:modelId/delete', asyncHandler(ModelController.forceDeleteModelById));
router.patch('/:modelId/restore', asyncHandler(ModelController.restoreModelById));
router.get('/:modelId', asyncHandler(ModelController.getSignedURLById));
router.get('/:modelId/model', asyncHandler(ModelController.get3DBufferFile));

export default router;
