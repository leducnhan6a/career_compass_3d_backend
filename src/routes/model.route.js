'use strict';

import express from 'express';
import ModelController from '../controllers/model.controller.js';
import asyncHandler from '../helpers/asyncHandler.js';
// import { apiKey, permission } from '../middlewares/auth.middleware.js';
import { authenticationV2 } from '../utils/AuthUtil/auth.util.js';

const router = express.Router();

// // check apiKey
// router.use(apiKey);

// // check permission
// router.use(permission('0000'));

// authentication
router.use(authenticationV2);

// get questions by group
router.get('', asyncHandler(ModelController.getAll3DModels));

// create new question
router.post('', asyncHandler(ModelController.createNew3DModel));

// post result data
router.get('/:modelId', asyncHandler(ModelController.getInfoByModelId));

// post result data
router.post('/:modelId', asyncHandler(ModelController.getInfoByModelId));

// get all history result
router.get('/history', asyncHandler(SurveyController.getAllHistoryResult));

// update question
router.put('/questions/:questionId', asyncHandler(SurveyController.updateQuestion));

// soft delete question
router.patch('/questions/:questionId/delete', asyncHandler(SurveyController.softDeleteQuestion));

// restore deleted question
router.patch('/questions/:questionId/restore', asyncHandler(SurveyController.restoreDeletedQuestion));

// permanent delete question
router.delete('/questions/:questionId', asyncHandler(SurveyController.deleteQuestion));

export default router;